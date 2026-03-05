import { NextRequest, NextResponse } from 'next/server';

/**
 * Normalize port speed to standard Mbps value
 * Converts various formats to: 1000, 10000, or 100000
 */
function normalizePortSpeed(value: string): { mbps: number; display: string } | null {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();
  
  // Extract number and unit
  const match = normalized.match(/([0-9.]+)\s*(GBPS|GBP|GBIT|G|MBPS|MBP|MBIT|M|KBPS|K|GIGE)?/i);
  if (!match) return null;

  const num = parseFloat(match[1]);
  const unit = match[2]?.toUpperCase() || '';

  let mbps = 0;

  // Convert to Mbps
  if (unit.startsWith('G') || unit === 'GIGE') {
    mbps = num * 1000; // Gbps to Mbps
  } else if (unit.startsWith('M') || !unit) {
    mbps = num; // Already in Mbps
  } else if (unit.startsWith('K')) {
    mbps = num / 1000; // Kbps to Mbps
  } else {
    mbps = num; // Default to Mbps
  }

  // Round to standard values: 1000, 10000, 100000
  let standardMbps: number;
  let displayGbps: string;

  if (mbps >= 50000) {
    standardMbps = 100000;
    displayGbps = '100 Gbps';
  } else if (mbps >= 5000) {
    standardMbps = 10000;
    displayGbps = '10 Gbps';
  } else {
    standardMbps = 1000;
    displayGbps = '1 Gbps';
  }

  return {
    mbps: standardMbps,
    display: displayGbps
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const swiftEnv = searchParams.get('env') || 'env1'; // Default to env1

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching order details for order: ${orderNumber} from ${swiftEnv}`);

    // Build environment-specific Swift API URL
    const swiftApiBaseUrls: Record<string, string> = {
      env1: 'http://swiftservicesenv1.corp.global.level3.com:9000',
      env2: 'http://swiftservicesenv2.corp.global.level3.com:9000',
      env4: 'http://swiftservicesenv4.corp.global.level3.com:9000',
    };

    const baseUrl = swiftApiBaseUrls[swiftEnv] || swiftApiBaseUrls.env1;
    const swiftApiUrl = `${baseUrl}/Customer/v3/Ordering/transaction/${orderNumber}/productPackage`;

    console.log(`📡 Calling Swift API: ${swiftApiUrl}`);

    const response = await fetch(swiftApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't follow redirects
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`❌ Swift API returned status: ${response.status}`);
      return NextResponse.json(
        { error: `Swift API returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched order details for ${orderNumber}`);
    console.log(`📦 Response data structure:`, JSON.stringify(data).substring(0, 500)); // Log first 500 chars

    // Extract port speed AND product name from the response
    let portSpeed = null;
    let productName = null;
    let foundIn = '';
    
    // Extract product name from the first product in productPackage
    if (Array.isArray(data) && data.length > 0) {
      // Debug: Print all product names and their attributes for this order
      for (const productPackage of data) {
        if (productPackage.products && Array.isArray(productPackage.products)) {
          for (const product of productPackage.products) {
            console.log(`[DEBUG] Product:`, product.productName);
            if (product.productAttributes && Array.isArray(product.productAttributes)) {
              for (const attr of product.productAttributes) {
                console.log(`[DEBUG]   Attribute:`, attr.attributeName, '|', attr.attributeDisplayValue);
              }
            }
          }
        }
      }
      console.log(`🔍 First item in array:`, data[0]);
      
      // Product name is in products[0].productName, not at the top level
      if (data[0].products && Array.isArray(data[0].products) && data[0].products.length > 0) {
        const firstProduct = data[0].products[0];
        if (firstProduct.productName) {
          productName = firstProduct.productName.trim();
          console.log(`✅ Product name found: "${productName}"`);
          
          // If it's "Wholesale UNI", check for related OVC product
          if (productName === 'Wholesale UNI' && data[0].relatedProducts && Array.isArray(data[0].relatedProducts)) {
            const ovcRelation = data[0].relatedProducts.find((rel: any) => 
              rel.relationshipName === 'OVCs' && rel.relatedProductName
            );
            if (ovcRelation && ovcRelation.relatedProductName) {
              productName = ovcRelation.relatedProductName;
              console.log(`✅ Found OVC relationship: Using "${productName}" instead of "Wholesale UNI"`);
            }
          }
        }
      } else {
        console.warn(`⚠️ No products array in data[0]. Available fields:`, Object.keys(data[0]));
      }
    } else {
      console.warn(`⚠️ Data is not an array or is empty`);
    }
    
    if (Array.isArray(data) && data.length > 0) {
      // List of possible attribute names for port/bandwidth speed
      const speedAttributeNames = [
        'Bandwidth in Mb',
        'Port Bandwidth',
        'Transport Bandwidth',
        'Bandwidth',
        'Port Speed',
        'Access Bandwidth',
        'Interface Bandwidth',
        'Circuit Bandwidth',
        'Service Bandwidth',
        'MaxPDR',
        'VPN CIR',
        'VPN PIR',
        'Total VPN CIR',
      ];

      // Always search all products and attributes for the highest bandwidth value
      let maxBandwidthMbps = 0;
      let maxBandwidthDisplay = '';
      let maxBandwidthFoundIn = '';
      let maxBandwidthProduct = null;
      let maxBandwidthProductPackage = null;
      for (const productPackage of data) {
        if (productPackage.products && Array.isArray(productPackage.products)) {
          for (const product of productPackage.products) {
            if (product.productAttributes && Array.isArray(product.productAttributes)) {
              for (const attrName of speedAttributeNames) {
                const attr = product.productAttributes.find((a: any) => a.attributeName === attrName);
                if (attr && attr.attributeDisplayValue && attr.attributeDisplayValue !== 'null' && attr.attributeDisplayValue !== '') {
                  // Try to parse Mbps or Gbps value
                  let mbps = 0;
                  let match = attr.attributeDisplayValue.match(/([0-9.]+)\s*Mbps/i);
                  if (match) {
                    mbps = parseFloat(match[1]);
                  } else {
                    match = attr.attributeDisplayValue.match(/([0-9.]+)\s*Gbps/i);
                    if (match) {
                      mbps = parseFloat(match[1]) * 1000;
                    }
                  }
                  if (mbps > maxBandwidthMbps) {
                    maxBandwidthMbps = mbps;
                    maxBandwidthDisplay = mbps >= 1000 ? (mbps / 1000) + ' Gbps' : mbps + ' Mbps';
                    maxBandwidthFoundIn = `productAttributes.${attrName} (product: ${product.productName})`;
                    maxBandwidthProduct = product;
                    maxBandwidthProductPackage = productPackage;
                  }
                }
              }
            }
            // Also check priceDetails descriptions
            if (product.priceInfo?.priceDetails && Array.isArray(product.priceInfo.priceDetails)) {
              for (const priceDetail of product.priceInfo.priceDetails) {
                if (priceDetail.description) {
                  const desc = priceDetail.description;
                  let mbps = 0;
                  let match = desc.match(/([0-9.]+)\s*Mbps/i);
                  if (match) {
                    mbps = parseFloat(match[1]);
                  } else {
                    match = desc.match(/([0-9.]+)\s*Gbps/i);
                    if (match) {
                      mbps = parseFloat(match[1]) * 1000;
                    }
                  }
                  if (mbps > maxBandwidthMbps) {
                    maxBandwidthMbps = mbps;
                    maxBandwidthDisplay = mbps >= 1000 ? (mbps / 1000) + ' Gbps' : mbps + ' Mbps';
                    maxBandwidthFoundIn = `priceDetails.description (product: ${product.productName})`;
                    maxBandwidthProduct = product;
                    maxBandwidthProductPackage = productPackage;
                  }
                }
              }
            }
            // Also check product name for bandwidth hints
            if (product.productName) {
              let mbps = 0;
              let match = product.productName.match(/([0-9.]+)\s*Mbps/i);
              if (match) {
                mbps = parseFloat(match[1]);
              } else {
                match = product.productName.match(/([0-9.]+)\s*Gbps/i);
                if (match) {
                  mbps = parseFloat(match[1]) * 1000;
                }
              }
              if (mbps > maxBandwidthMbps) {
                maxBandwidthMbps = mbps;
                maxBandwidthDisplay = mbps >= 1000 ? (mbps / 1000) + ' Gbps' : mbps + ' Mbps';
                maxBandwidthFoundIn = `productName (product: ${product.productName})`;
                maxBandwidthProduct = product;
                maxBandwidthProductPackage = productPackage;
              }
            }
          }
        }
      }
      let parentProductName = '';
      if (maxBandwidthProduct && maxBandwidthProductPackage && Array.isArray(maxBandwidthProductPackage.products)) {
        // Find parent product in the same package
        const parent = maxBandwidthProductPackage.products.find((p: any) => p.isParentProduct);
        if (parent && parent.productName) {
          parentProductName = parent.productName;
          
          // Special case: If parent is "Wholesale UNI", check for related "E-Access - OVC" product
          if (parentProductName === 'Wholesale UNI' && maxBandwidthProductPackage.relatedProducts && Array.isArray(maxBandwidthProductPackage.relatedProducts)) {
            const ovcRelation = maxBandwidthProductPackage.relatedProducts.find((rel: any) => 
              rel.relationshipName === 'OVCs' && rel.relatedProductName
            );
            if (ovcRelation && ovcRelation.relatedProductName) {
              parentProductName = ovcRelation.relatedProductName;
              console.log(`✅ Found OVC relationship: Using "${parentProductName}" instead of "Wholesale UNI"`);
            }
          }
        } else if (maxBandwidthProduct.productName) {
          parentProductName = maxBandwidthProduct.productName;
        }
      }
      if (maxBandwidthMbps > 0) {
        portSpeed = maxBandwidthDisplay;
        foundIn = maxBandwidthFoundIn;
        productName = parentProductName;
        console.log(`✅ Port speed found: "${portSpeed}" in ${foundIn}`);
        console.log(`✅ Parent product name: "${productName}"`);
      }
    }

    if (!portSpeed) {
      console.warn('⚠️ Port Bandwidth attribute not found in order');
    } else {
      // Normalize the port speed
      console.log(`[DEBUG] Normalizing port speed value:`, portSpeed);
      const normalized = normalizePortSpeed(portSpeed);
      console.log(`[DEBUG] Normalized result:`, normalized);
      if (normalized) {
        console.log(`✅ Normalized port speed: ${portSpeed} → ${normalized.display} (${normalized.mbps} Mbps)`);
        return NextResponse.json({
          success: true,
          portSpeed: normalized.display, // Display format for UI
          portSpeedMbps: normalized.mbps, // Numeric format for MESH API
          productName: productName, // Auto-detected product name
          rawValue: portSpeed, // Original value from API
          foundIn: foundIn,
          data, // Full data for debugging
        });
      } else {
        console.warn(`⚠️ Could not normalize port speed: "${portSpeed}"`);
      }
    }

    return NextResponse.json({
      success: true,
      portSpeed: null,
      portSpeedMbps: null,
      productName: productName, // Still return product name even if port speed not found
      data,
    });

  } catch (error: any) {
    const errorCode = error?.cause?.code || error?.code;
    const errorMessage = error.message || 'Failed to fetch order details';
    
    // Log based on error type
    if (errorCode === 'ENOTFOUND') {
      console.warn('⚠️ FlightDeck API DNS error - check VPN connection');
    } else if (errorCode === 'ECONNRESET' || errorCode === 'ETIMEDOUT') {
      console.warn('⚠️ FlightDeck API connection error:', errorCode);
    } else {
      console.error('❌ Error fetching order details:', error);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorCode === 'ENOTFOUND'
          ? 'Cannot reach FlightDeck API. Check VPN connection.'
          : errorCode === 'ECONNRESET'
          ? 'Connection lost to FlightDeck API. Please retry.'
          : errorMessage
      },
      { status: 500 }
    );
  }
}
