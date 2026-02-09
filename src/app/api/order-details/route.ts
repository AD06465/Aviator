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
      console.log(`🔍 First item in array:`, data[0]);
      
      // Product name is in products[0].productName, not at the top level
      if (data[0].products && Array.isArray(data[0].products) && data[0].products.length > 0) {
        const firstProduct = data[0].products[0];
        if (firstProduct.productName) {
          productName = firstProduct.productName.trim();
          console.log(`✅ Product name found: "${productName}"`);
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
        'Bandwidth in Mb',
      ];

      for (const productPackage of data) {
        if (productPackage.products && Array.isArray(productPackage.products)) {
          for (const product of productPackage.products) {
            
            // Strategy 1: Search in productAttributes
            if (product.productAttributes && Array.isArray(product.productAttributes)) {
              for (const attrName of speedAttributeNames) {
                const attr = product.productAttributes.find(
                  (a: any) => a.attributeName === attrName
                );
                
                if (attr?.attributeDisplayValue && attr.attributeDisplayValue !== 'null' && attr.attributeDisplayValue !== '') {
                  portSpeed = attr.attributeDisplayValue;
                  foundIn = `productAttributes.${attrName}`;
                  console.log(`✅ Port speed found: "${portSpeed}" in ${foundIn}`);
                  break;
                }
              }
              if (portSpeed) break;
            }

            // Strategy 2: Search in priceDetails descriptions
            if (!portSpeed && product.priceInfo?.priceDetails && Array.isArray(product.priceInfo.priceDetails)) {
              for (const priceDetail of product.priceInfo.priceDetails) {
                if (priceDetail.description) {
                  const desc = priceDetail.description;
                  // Look for patterns like "Port Bandwidth = 1 Gbps" or "Bandwidth=1000 Mbps"
                  const bandwidthMatch = desc.match(/(?:Port Bandwidth|Transport Bandwidth|Bandwidth|Port Speed)\s*[=:]\s*([0-9.]+\s*(?:Gbps|Mbps|Kbps|GigE|G|M))/i);
                  if (bandwidthMatch) {
                    portSpeed = bandwidthMatch[1].trim();
                    foundIn = `priceDetails.description`;
                    console.log(`✅ Port speed found: "${portSpeed}" in ${foundIn}`);
                    break;
                  }
                }
              }
              if (portSpeed) break;
            }

            // Strategy 3: Check product name for bandwidth hints
            if (!portSpeed && product.productName) {
              const nameMatch = product.productName.match(/([0-9.]+\s*(?:Gbps|Mbps|GigE|G|M))/i);
              if (nameMatch) {
                portSpeed = nameMatch[1].trim();
                foundIn = `productName`;
                console.log(`✅ Port speed found: "${portSpeed}" in ${foundIn}`);
                break;
              }
            }
          }
          if (portSpeed) break;
        }
      }
    }

    if (!portSpeed) {
      console.warn('⚠️ Port Bandwidth attribute not found in order');
    } else {
      // Normalize the port speed
      const normalized = normalizePortSpeed(portSpeed);
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
    console.error('❌ Error fetching order details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch order details' 
      },
      { status: 500 }
    );
  }
}
