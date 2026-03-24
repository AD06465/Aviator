import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SwiftTask, SwiftProductPackage } from '@/types';
import { swiftApiService } from '@/lib/swiftApi';
import { gcaService } from '@/services/gcaService';
import LoadingSpinner from './LoadingSpinner';

interface SwiftMonitorProps {
  orderNumber: string;
  environment: string;
  isActive?: boolean; // Control auto-refresh based on monitoring state
}

const SWIFT_REFRESH_INTERVAL = 30000; // 30 seconds

const SwiftMonitor: React.FC<SwiftMonitorProps> = ({ orderNumber, environment, isActive = false }) => {
  const [tasks, setTasks] = useState<SwiftTask[]>([]);
  const [productPackage, setProductPackage] = useState<SwiftProductPackage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [processingLog, setProcessingLog] = useState<Array<{ time: Date; message: string; type: 'info' | 'success' | 'error' | 'warning' }>>([]);
  const [isOrderCompleted, setIsOrderCompleted] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLogExpanded, setIsLogExpanded] = useState<boolean>(false);
  
  // Order validation state
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; missingFields: string[]; errors: string[]; warnings?: string[] } | null>(null);
  const [isValidationBlocking, setIsValidationBlocking] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [orderPackageDetails, setOrderPackageDetails] = useState<any>(null);
  const [firstContactId, setFirstContactId] = useState<number | null>(null);
  const [glmAddressId, setGlmAddressId] = useState<string | null>(null);
  const [isAddingContacts, setIsAddingContacts] = useState<boolean>(false);
  const MAX_UPDATE_RETRIES = 2;
  
  // Refs to prevent duplicate simultaneous operations and stable retry tracking
  const isFetchingRef = useRef<boolean>(false);
  const initializeRef = useRef<boolean>(false);
  const updateRetryCountRef = useRef<number>(0);
  const lastUpdateAttemptRef = useRef<number>(0);
  const UPDATE_COOLDOWN = 5000; // 5 second cooldown between update attempts

  // Add log entry
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    // Log to console for debugging
    console.log(`[SwiftMonitor] ${message}`);
    setProcessingLog((prev) => [...prev, { time: new Date(), message, type }]);
  }, []);

  // Validate order package (check if OES, Coordinator, OrderType are set)
  const validateOrderPackage = useCallback(async () => {
    // Prevent concurrent validations
    if (isFetchingRef.current) {
      console.log('[SwiftMonitor] Validation already in progress - skipping duplicate call');
      return false;
    }
    
    setIsValidating(true);
    isFetchingRef.current = true;
    
    try {
      addLog('🔍 Validating order package configuration...', 'info');
      console.log('[SwiftMonitor] Starting order package validation for order:', orderNumber);
      
      const result = await swiftApiService.fetchOrderPackage(orderNumber);
      console.log('[SwiftMonitor] fetchOrderPackage result:', result);
      
      if (!result.success || !result.data) {
        addLog(`❌ Failed to fetch order package for validation: ${result.error}`, 'error');
        setValidationResult({
          isValid: false,
          missingFields: [],
          errors: ['Failed to fetch order package details'],
          warnings: [],
        });
        setIsValidationBlocking(true);
        return false;
      }

      // Store order package details for display
      setOrderPackageDetails(result.data);

      // Extract GLM Address ID from ServiceAddresses (needed for adding contacts)
      let extractedAddressId: string | null = null;
      if (result.data.ServiceAddresses && result.data.ServiceAddresses.length > 0) {
        const firstAddress = result.data.ServiceAddresses[0];
        extractedAddressId = firstAddress.Address1 || firstAddress.AddressId || firstAddress.GLMAddressId;
        if (extractedAddressId) {
          setGlmAddressId(extractedAddressId);
          addLog(`📍 Service Address ID extracted: ${extractedAddressId}`, 'info');
        } else {
          addLog(`⚠️ Could not extract Service Address ID from: ${JSON.stringify(firstAddress)}`, 'warning');
        }
      } else {
        addLog(`⚠️ No ServiceAddresses found in order package`, 'warning');
      }

      // Fetch contacts data
      addLog('🔍 Checking order contacts...', 'info');
      const contactsResult = await swiftApiService.fetchOrderContacts(orderNumber);
      
      if (!contactsResult.success) {
        addLog(`⚠️ Failed to fetch order contacts: ${contactsResult.error}`, 'warning');
      }

      // Validate order with all prechecks (OrderType, Coordinator, OES, PSP Dates, Documents, Contacts)
      addLog('🔍 Validating order package (checking preconditions)...', 'info');
      let validation = await swiftApiService.validateOrderPackage(orderNumber, result.data, contactsResult.success ? contactsResult.data : undefined);
      console.log('[SwiftMonitor] Validation result:', validation);
      console.log('[SwiftMonitor] Missing fields:', validation.missingFields);
      console.log('[SwiftMonitor] Order Detail:', result.data?.OrderDetail);
      setValidationResult(validation);
      
      // Show warnings (like NAE) but don't block on them
      if (validation.warnings && validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => {
          addLog(`⚠️ ${warning}`, 'warning');
        });
      }
      
      if (!validation.isValid) {
        setIsValidationBlocking(true);
        addLog(`⚠️ Order validation failed: ${validation.errors.join(', ')}`, 'error');
        validation.errors.forEach((error) => {
          addLog(`   - ${error}`, 'warning');
        });

        // Check if OrderType, OES, or Coordinator are missing (critical fields only)
        const orderFieldsMissing = validation.missingFields.filter(field => 
          ['OrderType', 'OES', 'Coordinator'].includes(field)
        );
        console.log('[SwiftMonitor] Critical order fields missing:', orderFieldsMissing);
        
        // Check if NAE is missing (optional - will try to update but won't block)
        const shouldUpdateNAE = !result.data?.OrderDetail?.SelectedNAE;
        if (shouldUpdateNAE) {
          addLog('ℹ️ NAE field is empty - will attempt to set it (optional)', 'info');
        }

        // Check if we're within cooldown period to prevent duplicate updates
        const now = Date.now();
        const timeSinceLastAttempt = now - lastUpdateAttemptRef.current;
        if (timeSinceLastAttempt < UPDATE_COOLDOWN) {
          addLog(`⏳ Skipping update - cooldown active (${Math.ceil((UPDATE_COOLDOWN - timeSinceLastAttempt) / 1000)}s remaining)`, 'info');
          return false;
        }

        if (orderFieldsMissing.length > 0 && updateRetryCountRef.current < MAX_UPDATE_RETRIES) {
          addLog(`🔄 Automatically updating missing critical fields: ${orderFieldsMissing.join(', ')}`, 'info');
          updateRetryCountRef.current += 1;
          lastUpdateAttemptRef.current = now; // Set cooldown timestamp
          console.log('[SwiftMonitor] Calling updateOrderPackage with fields:', orderFieldsMissing);
          console.log('[SwiftMonitor] Update attempt:', updateRetryCountRef.current, '/', MAX_UPDATE_RETRIES);
          
          try {
            // Include NAE in update attempt if it's missing
            const fieldsToUpdate = shouldUpdateNAE ? [...validation.missingFields, 'NAE'] : validation.missingFields;
            
            // STEP 1: Check if changes would trigger workflow restart (using current data)
            // Note: Actual save will use fresh data to avoid version conflicts
            addLog('🔍 Validating changes before save...', 'info');
            const restartCheck = await swiftApiService.checkRestartTrigger(
              orderNumber,
              result.data.OrderDetail,
              result.data.ProductPackages || []
            );
            
            if (restartCheck.success && restartCheck.data) {
              if (restartCheck.data.willTriggerRestart) {
                addLog('⚠️ WARNING: Changes would trigger workflow restart!', 'warning');
                addLog(`   Triggering changes: ${restartCheck.data.restartTriggeringChanges.join(', ')}`, 'warning');
                // Continue anyway since we're preserving PSPs - should not restart
                addLog('   → Proceeding (PSPs are preserved)', 'info');
              } else {
                addLog('✓ Validation passed - no restart will be triggered', 'success');
              }
            } else {
              // Non-blocking - continue even if validation check fails
              addLog('⚠️ Could not validate restart trigger - proceeding anyway', 'warning');
            }
            
            // STEP 2: Update order package (will fetch fresh data internally to avoid version conflicts)
            addLog('📝 Updating order package with latest data...', 'info');
            const updateResult = await swiftApiService.updateOrderPackage(
              orderNumber,
              result.data,
              fieldsToUpdate
            );
            console.log('[SwiftMonitor] updateOrderPackage result:', updateResult);

            if (updateResult.success) {
              // Reset retry counter on successful update
              updateRetryCountRef.current = 0;
              const updatedFields = shouldUpdateNAE ? [...orderFieldsMissing, 'NAE'] : orderFieldsMissing;
              addLog(`✅ Successfully updated order fields: ${updatedFields.join(', ')}`, 'success');
              if (result.data?.OrderDetail?.OrderType) {
                addLog(`   → Order Type: ${result.data.OrderDetail.OrderType}`, 'info');
              }
              if (result.data?.OrderDetail?.SelectedOES) {
                addLog(`   → OES: ${result.data.OrderDetail.SelectedOES}`, 'info');
              }
              if (result.data?.OrderDetail?.SelectedCoordinator) {
                addLog(`   → Coordinator: ${result.data.OrderDetail.SelectedCoordinator}`, 'info');
              }
              if (shouldUpdateNAE) {
                addLog(`   → NAE: AB81208 (attempted)`, 'info');
              }
              
              // Re-fetch and re-validate after a brief delay to allow propagation
              addLog('🔍 Re-validating order after updates...', 'info');
              await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
              const revalidateResult = await swiftApiService.fetchOrderPackage(orderNumber);
              
              if (revalidateResult.success && revalidateResult.data) {
                // Update order package details for display
                setOrderPackageDetails(revalidateResult.data);
                
                const revalidation = await swiftApiService.validateOrderPackage(
                  orderNumber,
                  revalidateResult.data,
                  contactsResult.success ? contactsResult.data : undefined
                );
                setValidationResult(revalidation);
                
                // Check if critical fields are now valid (ignore NAE warnings)
                if (revalidation.isValid || revalidation.missingFields.every(f => f === 'Contacts')) {
                  // If only contacts are missing, continue with contact handling
                  if (revalidation.missingFields.includes('Contacts')) {
                    addLog('✅ Critical order fields updated successfully! Now handling contacts...', 'success');
                    // Update result.data to use fresh order package data for contact handling below
                    result.data = revalidateResult.data;
                    validation = revalidation; // Update validation to use fresh results
                    // Continue to contact handling below
                  } else {
                    setIsValidationBlocking(false);
                    addLog('✅ Order validation passed after updates!', 'success');
                    return true;
                  }
                } else {
                  // Check if only auto-fixable issues remain (Contacts, PSP Dates)
                  // Documents are now required and blocking after auto-upload attempt
                  const criticalFieldsStillMissing = revalidation.missingFields.filter(f => 
                    !['Contacts', 'PSP Dates'].includes(f)
                  );
                  if (criticalFieldsStillMissing.length === 0) {
                    addLog('✅ Critical fields are set - proceeding with auto-fixes for remaining fields', 'success');
                    result.data = revalidateResult.data;
                    validation = revalidation;
                  } else {
                    addLog('⚠️ Some critical fields still missing after updates', 'warning');
                    addLog(`   Missing: ${criticalFieldsStillMissing.join(', ')}`, 'warning');
                    
                    // Check if we've hit retry limit
                    if (updateRetryCountRef.current >= MAX_UPDATE_RETRIES) {
                      addLog(`⚠️ Stopping retries after ${MAX_UPDATE_RETRIES} attempts`, 'warning');
                      addLog(`💡 The Swift API may have permission restrictions`, 'info');
                      addLog(`💡 Please manually set: ${criticalFieldsStillMissing.join(', ')} in Swift UI`, 'info');
                      setIsValidationBlocking(false);
                      return false;
                    }
                  }
                }
              }
            } else {
              addLog(`❌ Failed to update order fields: ${updateResult.error}`, 'error');
              
              // If we've exhausted retries, stop blocking validation
              if (updateRetryCountRef.current >= MAX_UPDATE_RETRIES) {
                addLog(`⚠️ Maximum update retries (${MAX_UPDATE_RETRIES}) reached - proceeding without updates`, 'warning');
                addLog(`💡 Please manually set missing fields in Swift UI`, 'info');
                setIsValidationBlocking(false);
                return false;
              }
            }
          } catch (error: any) {
            addLog(`❌ Error updating order fields: ${error.message}`, 'error');
            
            // If we've exhausted retries, stop blocking
            if (updateRetryCountRef.current >= MAX_UPDATE_RETRIES) {
              addLog(`⚠️ Maximum update retries (${MAX_UPDATE_RETRIES}) reached after error`, 'warning');
              addLog(`💡 Please manually set missing fields in Swift UI`, 'info');
              setIsValidationBlocking(false);
              return false;
            }
          }
        } else if (orderFieldsMissing.length > 0 && updateRetryCountRef.current >= MAX_UPDATE_RETRIES) {
          // Already hit max retries, don't try again
          addLog(`⚠️ Skipping update - already tried ${MAX_UPDATE_RETRIES} times`, 'warning');
          addLog(`💡 Please manually set: ${orderFieldsMissing.join(', ')} in Swift UI`, 'info');
          setIsValidationBlocking(false);
        }

        // If PSP Dates are missing, automatically set them (NDD and CRD)
        if (validation.missingFields.includes('PSP Dates') && result.data) {
          addLog('📅 PSP Dates missing - automatically setting NDD and CRD...', 'info');
          addLog('   → Setting dates to: Current date + 5 business days', 'info');
          
          try {
            const setPspDatesResult = await swiftApiService.setPspDates(
              orderNumber,
              result.data
              // Uses default dates: current date + 5 business days
            );
            
            if (setPspDatesResult.success) {
              addLog('✅ Successfully set PSP dates (NDD and CRD)', 'success');
              
              // Re-validate after setting dates
              addLog('🔍 Re-validating order after setting PSP dates...', 'info');
              await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
              
              const revalidateResult = await swiftApiService.fetchOrderPackage(orderNumber);
              
              if (revalidateResult.success && revalidateResult.data) {
                setOrderPackageDetails(revalidateResult.data);
                
                validation = await swiftApiService.validateOrderPackage(
                  orderNumber,
                  revalidateResult.data,
                  contactsResult.success ? contactsResult.data : undefined
                );
                setValidationResult(validation);
                
                // Update result.data to use fresh order package data
                result.data = revalidateResult.data;
                
                if (validation.missingFields.includes('PSP Dates')) {
                  addLog('⚠️ PSP Dates still missing after update', 'warning');
                } else {
                  addLog('✅ PSP Dates validated successfully!', 'success');
                }
              }
            } else {
              addLog(`⚠️ Failed to set PSP dates: ${setPspDatesResult.error}`, 'warning');
              addLog('💡 You may need to manually set NDD and CRD dates in Swift UI', 'info');
            }
          } catch (error: any) {
            addLog(`❌ Error setting PSP dates: ${error.message}`, 'error');
            addLog('💡 You may need to manually set NDD and CRD dates in Swift UI', 'info');
          }
        }

        // If documents are missing, automatically upload template document
        if (validation.missingFields.includes('Documents') && result.data) {
          addLog('📄 Documents missing - automatically uploading template...', 'info');
          
          try {
            // Check which documents are required
            const requiredDocsResult = await swiftApiService.loadRequiredDocuments(
              orderNumber,
              result.data
            );

            if (requiredDocsResult.success && requiredDocsResult.data) {
              const { documentTypes } = requiredDocsResult.data;
              const missingDocs = documentTypes.filter((doc: any) => !doc.attached);
              
              if (missingDocs.length > 0) {
                // For now, upload SOF template for any missing documents
                // You can extend this to handle different document types
                const docType = missingDocs[0].type; // e.g., "SOF"
                const docName = missingDocs[0].name; // e.g., "Service Order Form"
                
                addLog(`   → Uploading template for: ${docName} (${docType})`, 'info');
                
                // Fetch the template file from /public/templates/
                const templateUrl = '/templates/SOF.pdf';
                const response = await fetch(templateUrl);
                
                if (!response.ok) {
                  throw new Error(`Template file not found: ${templateUrl}`);
                }
                
                const blob = await response.blob();
                const file = new File([blob], 'SOF.pdf', { type: 'application/pdf' });
                
                addLog(`   → Template loaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'info');
                
                // Upload the document
                const uploadResult = await swiftApiService.addDocumentToOrder(
                  orderNumber,
                  file,
                  result.data,
                  docType
                );
                
                if (uploadResult.success) {
                  addLog(`✅ Successfully uploaded document: ${uploadResult.data?.fileName}`, 'success');
                  
                  // Re-validate after uploading document
                  addLog('🔍 Re-validating order after document upload...', 'info');
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
                  
                  const revalidateResult = await swiftApiService.fetchOrderPackage(orderNumber);
                  
                  if (revalidateResult.success && revalidateResult.data) {
                    setOrderPackageDetails(revalidateResult.data);
                    
                    validation = await swiftApiService.validateOrderPackage(
                      orderNumber,
                      revalidateResult.data,
                      contactsResult.success ? contactsResult.data : undefined
                    );
                    setValidationResult(validation);
                    
                    // Update result.data to use fresh order package data
                    result.data = revalidateResult.data;
                    
                    if (validation.missingFields.includes('Documents')) {
                      addLog('⚠️ Documents still missing after upload', 'warning');
                    } else {
                      addLog('✅ Documents validated successfully!', 'success');
                    }
                  }
                } else {
                  addLog(`⚠️ Failed to upload document: ${uploadResult.error}`, 'warning');
                  addLog('💡 You may need to manually upload documents in Swift UI', 'info');
                }
              }
            } else {
              addLog('⚠️ Could not determine required documents', 'warning');
            }
          } catch (error: any) {
            addLog(`❌ Error uploading document: ${error.message}`, 'error');
            addLog('💡 You may need to manually upload documents in Swift UI', 'info');
          }
        }

        // If contacts are missing, automatically add the first available contact
        if (validation.missingFields.includes('Contacts') && result.data.OrderDetail?.CustomerId) {
          addLog('🔍 Fetching available contacts for customer...', 'info');
          try {
            const availableContactsResult = await swiftApiService.fetchAvailableContacts(
              result.data.OrderDetail.CustomerId.toString()
            );
            
            if (availableContactsResult.success && availableContactsResult.data?.firstContactId) {
              const contactId = availableContactsResult.data.firstContactId;
              const selectedContact = availableContactsResult.data.contacts.find((c: any) => c.ContactId === contactId);
              setFirstContactId(contactId);
              
              addLog(
                `✅ Found ${availableContactsResult.data.contacts.length} available contacts`,
                'success'
              );
              
              if (selectedContact) {
                // Extract contact details from actual Swift API structure
                const contactName = selectedContact.NameFirstLast || 'Unknown';
                
                // Extract primary email from ContactMethods array
                const primaryEmail = selectedContact.ContactMethods?.find((m: any) => m.IsPrimaryEMailAddress === true);
                const contactEmail = primaryEmail?.Value || 'No email';
                
                // Extract primary phone from ContactMethods array
                const primaryPhone = selectedContact.ContactMethods?.find((m: any) => m.IsPrimaryPhoneNumber === true);
                const contactPhone = primaryPhone?.Value || 'No phone';
                
                addLog(`   → Selected contact: ${contactName} (ID: ${contactId})`, 'info');
                addLog(`   → Email: ${contactEmail}`, 'info');
                addLog(`   → Phone: ${contactPhone}`, 'info');
              } else {
                addLog(`   → Using contact ID: ${contactId}`, 'info');
              }
              
              // Use the freshly extracted address ID (not the state variable which is async)
              // If no address ID found, use empty string (API accepts null/empty)
              const addressIdForContact = extractedAddressId || '';
              
              if (addressIdForContact) {
                addLog(`📍 Using Service Address ID: ${addressIdForContact}`, 'info');
              } else {
                addLog(`⚠️ No Service Address ID found - proceeding with empty glmAddressId`, 'warning');
              }
              
              addLog(`🔄 Adding contact ${contactId} to order ${orderNumber}...`, 'info');
                addLog(`🔄 Adding contact ${contactId} to order ${orderNumber}...`, 'info');
                setIsAddingContacts(true);
                
                const persistResult = await swiftApiService.persistContactAssociations(
                  orderNumber,
                  contactId,
                  addressIdForContact
                );
                
                setIsAddingContacts(false);
                
                if (persistResult.success) {
                  addLog(`✅ Successfully added contact ${contactId} to order`, 'success');
                  
                  // Re-fetch BOTH order package AND contacts to get fresh data
                  addLog('🔍 Re-fetching order data to confirm contact was added...', 'info');
                  
                  const refreshedOrderResult = await swiftApiService.fetchOrderPackage(orderNumber);
                  const refreshedContactsResult = await swiftApiService.fetchOrderContacts(orderNumber);
                  
                  if (refreshedOrderResult.success && refreshedContactsResult.success) {
                    // Re-validate with FRESH data
                    const revalidation = await swiftApiService.validateOrderPackage(
                      orderNumber,
                      refreshedOrderResult.data,
                      refreshedContactsResult.data
                    );
                    
                    setValidationResult(revalidation);
                    
                    if (revalidation.isValid) {
                      setIsValidationBlocking(false);
                      addLog('✅ Order validation passed after adding contact!', 'success');
                      return true;
                    } else {
                      // Check if only warnings remain (all critical fields set)
                      const criticalMissing = revalidation.missingFields.filter(f => ['OES', 'Coordinator', 'OrderType', 'Contacts'].includes(f));
                      if (criticalMissing.length === 0) {
                        setIsValidationBlocking(false);
                        addLog('✅ All critical fields are set - validation passed!', 'success');
                        return true;
                      } else {
                        addLog('⚠️ Validation still failing after adding contact', 'warning');
                        addLog(`   Missing critical fields: ${criticalMissing.join(', ')}`, 'warning');
                      }
                    }
                  } else {
                    addLog('⚠️ Failed to re-fetch order data for re-validation', 'warning');
                  }
                } else {
                  addLog(`❌ Failed to add contact: ${persistResult.error}`, 'error');
                }
            } else {
              if (!availableContactsResult.success) {
                addLog(`⚠️ Failed to fetch available contacts: ${availableContactsResult.error}`, 'warning');
                addLog(`💡 Please manually add contacts in Swift UI`, 'info');
              } else if (!availableContactsResult.data?.firstContactId) {
                addLog(`⚠️ No valid contacts found for customer ${result.data.OrderDetail.CustomerId}`, 'warning');
                addLog(`   (Contacts must have name, phone, AND email to be valid)`, 'warning');
                addLog(`💡 Please manually add contacts in Swift UI`, 'info');
              }
              
              // Don't block validation if only contacts are missing - allow manual addition
              if (validation.missingFields.length === 1 && validation.missingFields[0] === 'Contacts') {
                addLog(`ℹ️ Only contacts are missing - proceeding with task monitoring`, 'info');
                addLog(`💡 Add contacts manually in Swift UI to complete order setup`, 'info');
                setIsValidationBlocking(false);
                return true;
              }
            }
          } catch (error: any) {
            addLog(`❌ Error handling contacts: ${error.message}`, 'error');
            addLog(`💡 Please manually add contacts in Swift UI`, 'info');
            setIsAddingContacts(false);
            
            // Don't block validation if only contacts are missing
            if (validation.missingFields.length === 1 && validation.missingFields[0] === 'Contacts') {
              addLog(`ℹ️ Only contacts are missing - proceeding with task monitoring`, 'info');
              setIsValidationBlocking(false);
              return true;
            }
          }
        }

        // Continue to final validation check (don't return false here)
      }

      // Final validation check after all auto-fixes
      addLog('🔍 Performing final validation check...', 'info');
      
      const finalValidation = await swiftApiService.validateOrderPackage(
        orderNumber,
        result.data,
        contactsResult.success ? contactsResult.data : undefined
      );
      
      setValidationResult(finalValidation);

      // Check if ALL prechecks pass (OrderType, Coordinator, OES, PSP Dates, Documents, Contacts)
      if (finalValidation.isValid) {
        setIsValidationBlocking(false);
        addLog('✅ Order validation passed - All prechecks complete!', 'success');
        addLog('   ✓ OrderType, Coordinator, OES, PSP Dates, Documents, Contacts', 'success');
        console.log('[SwiftMonitor] ✅ All prechecks passed - ready to process tasks');
        return true;
      } else {
        // Some prechecks still failing
        const stillMissing = finalValidation.missingFields.join(', ');
        addLog(`⚠️ Validation incomplete - Missing: ${stillMissing}`, 'warning');
        addLog('💡 Please fix missing fields manually in Swift UI', 'info');
        setIsValidationBlocking(true);
        return false;
      }
    } catch (error: any) {
      console.error('[SwiftMonitor] Error during validation:', error);
      addLog(`❌ Error during validation: ${error.message}`, 'error');
      setIsValidationBlocking(true);
      return false;
    } finally {
      setIsValidating(false);
      isFetchingRef.current = false;
    }
  }, [orderNumber, addLog]);

  // Fetch order details (product package)
  const fetchOrderDetails = useCallback(async () => {
    const result = await swiftApiService.fetchProductPackage(orderNumber);
    if (result.success && result.data) {
      setProductPackage(result.data);
      
      // Check if order is completed
      const isCompleted = swiftApiService.isOrderCompleted(result.data);
      
      // Log the status for debugging
      const status = result.data[0]?.status || 'Unknown';
      console.log(`[SwiftMonitor] Order status: ${status}, isCompleted: ${isCompleted}`);
      
      if (isCompleted && !isOrderCompleted) {
        setIsOrderCompleted(true);
        addLog('🎉 Order status changed to "Ordered" - Order sent to downstream system!', 'success');
        addLog('✅ Swift Monitor will stop processing - No more Swift tasks expected', 'success');
      }
      
      return result.data;
    } else {
      console.error('Failed to fetch product package:', result.error);
      return null;
    }
  }, [orderNumber, addLog, isOrderCompleted]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    // Prevent duplicate simultaneous fetches
    if (isFetchingRef.current) {
      return null;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await swiftApiService.fetchTasks(orderNumber);
      
      if (result.success && result.data) {
        setTasks(result.data);
        setLastRefresh(new Date());
        
        // Log task summary
        const readyTasks = swiftApiService.getReadyTasks(result.data);
        const completedTasksCount = result.data.filter(t => t.status === 'Completed').length;
        addLog(`Found ${result.data.length} total tasks (${readyTasks.length} Ready, ${completedTasksCount} Completed)`, 'info');
        
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch tasks');
        addLog(`Error fetching tasks: ${result.error}`, 'error');
        return null;
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      addLog(`Exception fetching tasks: ${errorMsg}`, 'error');
      return null;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [orderNumber, addLog]);

  // Complete a single task
  const completeTask = useCallback(async (task: SwiftTask) => {
    // Skip if already completed
    if (completedTasks.has(task.taskId)) {
      return { success: true, alreadyCompleted: true };
    }

    addLog(`Attempting to complete task: ${task.displayName} (ID: ${task.taskId})`, 'info');

    const result = await swiftApiService.completeTask(task.taskId);
    
    if (result.success) {
      setCompletedTasks((prev) => new Set(prev).add(task.taskId));
      addLog(`✅ Successfully completed: ${task.displayName}`, 'success');
      return { success: true };
    } else {
      addLog(`❌ Failed to complete ${task.displayName}: ${result.error}`, 'error');
      return { success: false, error: result.error };
    }
  }, [completedTasks, addLog]);

  // Process ready tasks
  const processReadyTasks = useCallback(async () => {
    if (isProcessing || isOrderCompleted) {
      return;
    }

    // Check if order is already completed (status = "Ordered")
    if (isOrderCompleted) {
      addLog('✅ Order is complete - No more tasks to process', 'success');
      return;
    }

    // Check validation before processing tasks
    if (isValidationBlocking) {
      addLog('⚠️ Task processing blocked due to validation errors', 'warning');
      return;
    }

    const readyTasks = swiftApiService.getReadyTasks(tasks);
    
    if (readyTasks.length === 0) {
      return;
    }

    setIsProcessing(true);
    addLog(`Found ${readyTasks.length} Ready task(s) to process`, 'info');

    for (const task of readyTasks) {
      // Special handling for "Wait For Credit Approval" task
      // Only approve in GCA - Swift will auto-complete when it detects approval
      if (task.displayName === 'Wait For Credit Approval') {
        addLog(`🏦 Processing credit approval in GCA for task: "${task.displayName}"`, 'info');
        
        try {
          // Call GCA service to complete credit approval
          addLog(`📋 Step 1: Searching for order ${orderNumber} in GCA...`, 'info');
          const gcaResult = await gcaService.completeCreditApproval(orderNumber, environment);
          
          if (gcaResult.success) {
            addLog(`✅ GCA Credit Approval completed: ${gcaResult.message}`, 'success');
            addLog(`⏳ Swift will automatically complete the task when it detects the approval`, 'info');
            // Don't complete the task manually - Swift will auto-complete when polling GCA
          } else {
            addLog(`❌ GCA Credit Approval failed: ${gcaResult.error}`, 'error');
            addLog(`⚠️ Task "${task.displayName}" requires manual completion in GCA`, 'warning');
          }
        } catch (error: any) {
          addLog(`❌ Error processing credit approval: ${error.message}`, 'error');
        }
        
        // Small delay before next task
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      // Check if it's a manual task
      if (swiftApiService.isManualTask(task)) {
        addLog(`⚠️ Manual action required: "${task.displayName}" - Please complete this task manually`, 'warning');
        continue;
      }

      // Check if it's a completable task
      if (swiftApiService.isCompletableTask(task)) {
        await completeTask(task);
        // Small delay between task completions
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsProcessing(false);

    // After processing tasks, check order status
    await fetchOrderDetails();
    
    // Refresh tasks after processing
    setTimeout(() => fetchTasks(), 2000);
  }, [tasks, isProcessing, isOrderCompleted, isValidationBlocking, completeTask, fetchOrderDetails, fetchTasks, addLog]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    if (isFetchingRef.current || isRefreshing) return;
    
    setIsRefreshing(true);
    addLog('🔄 Manual refresh triggered', 'info');
    
    try {
      await fetchOrderDetails();
      await fetchTasks();
      addLog('✅ Manual refresh completed', 'success');
    } catch (error: any) {
      addLog(`❌ Manual refresh failed: ${error.message}`, 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOrderDetails, fetchTasks, addLog, isRefreshing]);

  // Initialize monitoring
  useEffect(() => {
    if (!isActive) {
      initializeRef.current = false;
      return;
    }

    // Prevent duplicate initialization
    if (initializeRef.current) return;
    initializeRef.current = true;

    // Set environment
    swiftApiService.setEnvironment(environment);
    addLog(`🚀 Swift Monitor started for Order ${orderNumber} in ${environment}`, 'info');

    // Reset retry counter and cooldown for new monitoring session
    updateRetryCountRef.current = 0;
    lastUpdateAttemptRef.current = 0;

    // Initial fetch of order details, validation, and tasks
    const initialize = async () => {
      try {
        console.log('[SwiftMonitor] Starting initialization...');
        await fetchOrderDetails();
        console.log('[SwiftMonitor] fetchOrderDetails complete, starting validation...');
        await validateOrderPackage();
        console.log('[SwiftMonitor] validateOrderPackage complete, fetching tasks...');
        await fetchTasks();
        console.log('[SwiftMonitor] Initialization complete');
      } catch (error: any) {
        console.error('[SwiftMonitor] Error during initialization:', error);
        addLog(`❌ Initialization error: ${error.message}`, 'error');
      }
    };
    
    initialize();

    // Reset initialization flag when dependencies change
    return () => {
      initializeRef.current = false;
    };
  }, [orderNumber, environment, isActive]); // Removed function dependencies to prevent re-initialization

  // Auto-refresh tasks
  useEffect(() => {
    if (!isActive || isOrderCompleted) return;

    const intervalId = setInterval(async () => {
      await fetchTasks();
    }, SWIFT_REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, isOrderCompleted, fetchTasks]);

  // Process ready tasks when tasks change
  useEffect(() => {
    if (!isActive || isOrderCompleted || tasks.length === 0 || isProcessing) return;

    processReadyTasks();
  }, [tasks, isActive, isOrderCompleted, isProcessing, processReadyTasks]);

  // Get order summary
  const orderSummary = productPackage ? swiftApiService.extractOrderSummary(productPackage) : null;

  // Get task statistics
  const taskStats = {
    total: tasks.length,
    ready: tasks.filter(t => t.status === 'Ready').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
  };

  return (
    <div className="space-y-4">
      {/* Order Completed Banner */}
      {isOrderCompleted && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-4 text-white border-2 border-green-400">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-bold">🎉 Order Complete!</h3>
              <p className="text-sm text-green-100">
                Order status: <strong>"Ordered"</strong> - Order has been sent to downstream systems. 
                Swift Monitor has stopped processing.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-bold">Swift Monitor</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/50 text-blue-100">
                {environment}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-blue-200 text-xs mb-0.5">Transaction ID</p>
                <p className="font-semibold">{orderNumber}</p>
              </div>
              
              {orderPackageDetails?.OrderDetail?.BusinessOrderId && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Business Order ID</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.BusinessOrderId}</p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.CustomerNumber && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Customer Account</p>
                  <p className="font-semibold">
                    {orderPackageDetails.OrderDetail.CustomerId && 
                      `${orderPackageDetails.OrderDetail.CustomerId}/`}
                    {orderPackageDetails.OrderDetail.CustomerNumber}
                  </p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.Status && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Order Status</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.Status}</p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.OrderType && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Order Type</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.OrderType}</p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.SelectedOES && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">OES</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.SelectedOES}</p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.SelectedCoordinator && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Coordinator</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.SelectedCoordinator}</p>
                </div>
              )}
              
              {orderPackageDetails?.OrderDetail?.SelectedNAE && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">NAE</p>
                  <p className="font-semibold">{orderPackageDetails.OrderDetail.SelectedNAE}</p>
                </div>
              )}
              
              {lastRefresh && (
                <div>
                  <p className="text-blue-200 text-xs mb-0.5">Last Refresh</p>
                  <p className="font-semibold">{lastRefresh.toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="ml-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex-shrink-0"
            title="Manually refresh Swift data"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Validation Status */}
      {(isValidating || isAddingContacts) && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <LoadingSpinner size="sm" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-blue-800">
                {isAddingContacts ? '📝 Adding Contact to Order...' : '🔍 Validating Order Configuration...'}
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                {isAddingContacts 
                  ? `Associating Contact ID ${firstContactId} to order ${orderNumber}` 
                  : 'Checking OES, Coordinator, Order Type, and Contacts'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {!isValidating && !isAddingContacts && validationResult && !validationResult.isValid && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-red-800">
                ⚠️ Order Validation Failed - Task Processing Blocked
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-2">Missing required fields:</p>
                <div className="flex flex-wrap gap-2">
                  {validationResult.missingFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-red-600">
                  Configure these fields in Swift before task automation can proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Success */}
      {!isValidating && validationResult && validationResult.isValid && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-800 font-medium">
              Order validation passed - All required fields configured
            </p>
          </div>
        </div>
      )}

      {/* Order Status */}
      {orderSummary && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Product Package Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div>
              <p className="text-xs text-gray-600">Package Status</p>
              <p className={`font-semibold ${orderSummary.status === 'Ordered' ? 'text-green-600' : 'text-blue-600'}`}>
                {orderSummary.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Products</p>
              <p className="font-semibold">{orderSummary.productCount}</p>
            </div>
          </div>
          
          {orderSummary.products.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-2">Product List:</p>
              <div className="bg-gray-50 rounded p-2 max-h-24 overflow-y-auto">
                {orderSummary.products.map((product, idx) => (
                  <div key={idx} className="text-xs py-0.5">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-gray-500 ml-2">({product.action})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Statistics */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-3 text-gray-800">Task Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded p-3">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-800">{taskStats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded p-3">
            <p className="text-xs text-gray-600">Ready</p>
            <p className="text-xl font-bold text-yellow-600">{taskStats.ready}</p>
          </div>
          <div className="bg-green-50 rounded p-3">
            <p className="text-xs text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">{taskStats.completed}</p>
          </div>
          <div className="bg-blue-50 rounded p-3">
            <p className="text-xs text-gray-600">In Progress</p>
            <p className="text-xl font-bold text-blue-600">{taskStats.inProgress}</p>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isOrderCompleted && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-semibold">
              Order Completed - Status: Ordered (Order sent to downstream system)
            </p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center">
            <LoadingSpinner size="sm" />
            <p className="text-blue-800 ml-3">Processing tasks...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800 font-semibold">Error:</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800">Tasks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Milestone
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <LoadingSpinner />
                    <p className="text-gray-500 mt-2 text-sm">Loading tasks...</p>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No tasks found for this order
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.taskKey} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.displayName}</div>
                      <div className="text-xs text-gray-500">ID: {task.taskId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'Ready'
                            ? 'bg-yellow-100 text-yellow-800'
                            : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                      {completedTasks.has(task.taskId) && (
                        <div className="text-xs text-green-600 mt-1">✓ Auto-completed</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{task.milestoneName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{task.roleName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {task.startDateUtc && (
                        <div>Started: {new Date(task.startDateUtc).toLocaleString()}</div>
                      )}
                      {task.completionDateUtc && (
                        <div>Completed: {new Date(task.completionDateUtc).toLocaleString()}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processing Log */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsLogExpanded(!isLogExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-800">Processing Log</h3>
              {processingLog.length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {processingLog.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {processingLog.length > 0 && (
                <span className="text-xs text-gray-500">
                  {isLogExpanded ? 'Hide' : 'View'}
                </span>
              )}
              <svg
                className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${
                  isLogExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        {isLogExpanded && (
          <div className="p-3 bg-gray-50 max-h-80 overflow-y-auto font-mono text-xs">
            {processingLog.length === 0 ? (
              <p className="text-gray-500">No activity yet...</p>
            ) : (
              processingLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`mb-1 ${
                    log.type === 'error'
                      ? 'text-red-600'
                      : log.type === 'success'
                      ? 'text-green-600'
                      : log.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-gray-500">[{log.time.toLocaleTimeString()}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwiftMonitor;
