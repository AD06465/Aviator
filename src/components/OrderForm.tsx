import React, { useState, useEffect, useRef } from 'react';
import { OrderForm, Workgroup, WorkgroupResponse, UserWorkgroup } from '../types';
import { workflowTypes, defaultDevices } from '../lib/taskConfig';
import { flightDeckApiService } from '../lib/api';

interface OrderFormProps {
  onSubmit: (orderForm: OrderForm) => void;
  isProcessing: boolean;
}

const OrderFormComponent: React.FC<OrderFormProps> = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState<OrderForm>({
    orderNumber: '',
    productName: '',
    workflowName: '',
    environment: 'Test 1',
    userName: '',
    workgroup: '',
    preferredDevice: '',
    preferredPort: '',
  });

  const [workgroups, setWorkgroups] = useState<WorkgroupResponse>([]);
  const [filteredWorkgroups, setFilteredWorkgroups] = useState<(string | Workgroup)[]>([]);
  const [workgroupSearch, setWorkgroupSearch] = useState('');
  const [devices, setDevices] = useState<string[]>(defaultDevices);
  const [newDevice, setNewDevice] = useState('');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [isLoadingWorkgroups, setIsLoadingWorkgroups] = useState(false);
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(false);
  const [userWorkgroups, setUserWorkgroups] = useState<UserWorkgroup[]>([]);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);
  const [userNameConfirmed, setUserNameConfirmed] = useState(false);
  const [confirmedUserName, setConfirmedUserName] = useState('');
  const [isWorkgroupDropdownOpen, setIsWorkgroupDropdownOpen] = useState(false);
  const workgroupDropdownRef = useRef<HTMLDivElement>(null);

  const environments = flightDeckApiService.getEnvironments();

  // Auto-load user profile and workgroups when username is 7 characters or confirmed
  useEffect(() => {
    if (formData.userName && 
        ((formData.userName.length === 7 && !userNameConfirmed) || 
         (userNameConfirmed && confirmedUserName === formData.userName))) {
      loadUserProfile();
    }
  }, [formData.userName, userNameConfirmed, confirmedUserName]);

  const loadUserProfile = async () => {
    if (!formData.userName || formData.userName.length < 7) return;

    setIsLoadingUserProfile(true);
    setUserProfileError(null);
    
    try {
      // Set environment and username for API service
      flightDeckApiService.setEnvironment(formData.environment);
      flightDeckApiService.setUserName(formData.userName);

      const result = await flightDeckApiService.getUserProfile(formData.userName);
      
      if (result.success && result.data) {
        const userData = result.data;
        
        // Extract user workgroups
        if (userData.workgroupsList && Array.isArray(userData.workgroupsList)) {
          setUserWorkgroups(userData.workgroupsList);
          setUserProfileError(null);
          
          // Set username as confirmed
          if (!userNameConfirmed) {
            setUserNameConfirmed(true);
            setConfirmedUserName(formData.userName);
          }
          
          console.log(`Found ${userData.workgroupsList.length} workgroups for user ${formData.userName}`);
        } else {
          setUserWorkgroups([]);
          setUserProfileError('No workgroups found for this user');
        }
      } else {
        setUserWorkgroups([]);
        setUserProfileError(result.error || 'Failed to load user profile');
        // Fallback to loading all workgroups
        loadWorkgroups();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserWorkgroups([]);
      setUserProfileError('Failed to load user profile');
      // Fallback to loading all workgroups
      loadWorkgroups();
    } finally {
      setIsLoadingUserProfile(false);
    }
  };

  // Reload workgroups when environment changes (if username is confirmed)
  useEffect(() => {
    if (userNameConfirmed && confirmedUserName === formData.userName && formData.userName) {
      loadWorkgroups();
    }
  }, [formData.environment]);

  // Reset workgroup data when username changes after confirmation
  useEffect(() => {
    if (userNameConfirmed && confirmedUserName !== formData.userName) {
      setUserNameConfirmed(false);
      setConfirmedUserName('');
      setWorkgroups([]);
      setFilteredWorkgroups([]);
      setFormData(prev => ({ ...prev, workgroup: '' }));
      setWorkgroupSearch('');
    }
  }, [formData.userName, userNameConfirmed, confirmedUserName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workgroupDropdownRef.current && !workgroupDropdownRef.current.contains(event.target as Node)) {
        setIsWorkgroupDropdownOpen(false);
      }
    };

    if (isWorkgroupDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWorkgroupDropdownOpen]);

  useEffect(() => {
    // Use user workgroups when available, fallback to all workgroups
    const workgroupsToFilter = userWorkgroups.length > 0 ? 
      userWorkgroups.map(uw => ({ workgroupId: uw.id, workgroupName: uw.name })) : workgroups;

    if (workgroupSearch) {
      const filtered = workgroupsToFilter.filter(wg => {
        const workgroupName = getWorkgroupDisplayName(wg);
        const workgroupId = getWorkgroupId(wg);
        
        // Skip empty workgroup names
        if (!workgroupName || workgroupName.trim() === '' || workgroupName === '""') {
          return false;
        }
        
        return workgroupName.toLowerCase().includes(workgroupSearch.toLowerCase()) ||
               workgroupId.toLowerCase().includes(workgroupSearch.toLowerCase());
      });
      setFilteredWorkgroups(filtered);
    } else {
      // Filter out empty workgroup names when showing all
      const filtered = workgroupsToFilter.filter(wg => {
        const workgroupName = getWorkgroupDisplayName(wg);
        return workgroupName && workgroupName.trim() !== '' && workgroupName !== '""';
      });
      setFilteredWorkgroups(filtered);
    }
  }, [workgroupSearch, workgroups, userWorkgroups]);

  const loadWorkgroups = async () => {
    if (!formData.userName) return;
    
    console.log('Loading workgroups for:', formData.userName, 'in environment:', formData.environment);
    setIsLoadingWorkgroups(true);
    try {
      // Set both environment and username before making API call
      flightDeckApiService.setEnvironment(formData.environment);
      flightDeckApiService.setUserName(formData.userName);
      
      const result = await flightDeckApiService.getWorkgroups();
      console.log('Workgroup result:', result);
      
      if (result.success && result.data) {
        console.log('Raw workgroup data:', result.data);
        console.log('First workgroup object:', result.data[0]);
        setWorkgroups(result.data);
        setFilteredWorkgroups(result.data);
        if (!userNameConfirmed) {
          setUserNameConfirmed(true);
          setConfirmedUserName(formData.userName);
        }
        console.log('Loaded', result.data.length, 'workgroups');
      } else {
        console.error('Failed to load workgroups:', result.error);
        setWorkgroups([]);
        setFilteredWorkgroups([]);
      }
    } catch (error) {
      console.error('Failed to load workgroups:', error);
      setWorkgroups([]);
      setFilteredWorkgroups([]);
    } finally {
      setIsLoadingWorkgroups(false);
    }
  };

  const handleConfirmUserName = () => {
    if (formData.userName && formData.userName.trim()) {
      setUserNameConfirmed(true);
      setConfirmedUserName(formData.userName);
      loadWorkgroups();
    }
  };

  // Helper function to safely get workgroup display name
  const getWorkgroupDisplayName = (wg: any): string => {
    // If it's a string, return it directly
    if (typeof wg === 'string') {
      return wg.replace(/"/g, ''); // Remove any quotes
    }
    // If it's an object, try different property names
    return wg?.workgroupName || wg?.name || wg?.groupName || wg?.displayName || 'Unnamed Workgroup';
  };

  // Helper function to safely get workgroup ID
  const getWorkgroupId = (wg: any): string => {
    // If it's a string, use it as both name and ID
    if (typeof wg === 'string') {
      return wg.replace(/"/g, ''); // Remove any quotes
    }
    // If it's an object, try different property names
    return wg?.workgroupId || wg?.id || wg?.groupId || '';
  };

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    // Trim whitespace for orderNumber to prevent API failures
    const processedValue = field === 'orderNumber' ? value.trim() : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleAddDevice = () => {
    if (newDevice && !devices.includes(newDevice)) {
      setDevices(prev => [...prev, newDevice]);
      setFormData(prev => ({
        ...prev,
        preferredDevice: newDevice,
      }));
      setNewDevice('');
      setShowAddDevice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return (
      formData.orderNumber &&
      formData.productName &&
      formData.workflowName &&
      formData.environment &&
      formData.userName &&
      formData.workgroup &&
      userNameConfirmed &&
      confirmedUserName === formData.userName &&
      filteredWorkgroups.length > 0
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Configuration</h2>
        <p className="text-gray-600">Configure your FlightDeck order for automated processing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Number *
            </label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => handleInputChange('orderNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter order number"
              disabled={isProcessing}
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <select
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 hover:border-gray-400 focus:scale-[1.02]"
              disabled={isProcessing}
              required
            >
              <option value="">Select product type...</option>
              <option value="DIA">DIA</option>
              <option value="ELINE">ELINE</option>
              <option value="ELAN">ELAN</option>
              <option value="ELYNK">ELYNK</option>
              <option value="IPVPN">IPVPN</option>
              <option value="UNI">UNI</option>
            </select>
          </div>

          {/* Workflow Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Itential Workflow Name *
            </label>
            <select
              value={formData.workflowName}
              onChange={(e) => handleInputChange('workflowName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            >
              <option value="">Select workflow</option>
              {workflowTypes.map((workflow) => (
                <option key={workflow.value} value={workflow.value}>
                  {workflow.name}
                </option>
              ))}
            </select>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environment *
            </label>
            <select
              value={formData.environment}
              onChange={(e) => handleInputChange('environment', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            >
              {environments.map((env) => (
                <option key={env.name} value={env.name}>
                  {env.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UserName (CUID) *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  userNameConfirmed && confirmedUserName === formData.userName
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your 7-character CUID"
                maxLength={7}
                disabled={isProcessing}
              />
              
              {/* Confirmation Button */}
              {formData.userName && 
               formData.userName.length >= 3 && 
               (!userNameConfirmed || confirmedUserName !== formData.userName) && (
                <button
                  type="button"
                  onClick={handleConfirmUserName}
                  disabled={isProcessing || isLoadingWorkgroups}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[140px]"
                >
                  {isLoadingWorkgroups ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span className="text-sm">Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">Confirm User</span>
                    </>
                  )}
                </button>
              )}
              
              {/* Auto-loading indicator for 7-char usernames */}
              {formData.userName.length === 7 && 
               !userNameConfirmed && 
               isLoadingWorkgroups && (
                <div className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg flex items-center space-x-2 min-w-[140px]">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm">Auto-loading...</span>
                </div>
              )}
            </div>
            
            {/* Status Messages */}
            {userNameConfirmed && confirmedUserName === formData.userName && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Username confirmed</span>
              </div>
            )}
            
            {/* User Profile Status */}
            {isLoadingUserProfile && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Loading your workgroup profile...</span>
              </div>
            )}
            
            {userWorkgroups.length > 0 && !isLoadingUserProfile && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Found {userWorkgroups.length} workgroup{userWorkgroups.length !== 1 ? 's' : ''} for your profile</span>
              </div>
            )}
            
            {userProfileError && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-orange-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{userProfileError} • Using all available workgroups</span>
              </div>
            )}
            
            {formData.userName.length === 7 && !userNameConfirmed && !isLoadingWorkgroups && !isLoadingUserProfile && (
              <div className="mt-2 text-sm text-blue-600">
                ✨ Auto-loading workgroups for 7-character username
              </div>
            )}
            
            {formData.userName.length > 0 && formData.userName.length < 7 && (
              <div className="mt-2 text-sm text-gray-500">
                💡 Enter complete CUID (7 characters) for auto-load, or click "Confirm User" button
              </div>
            )}
          </div>

          {/* Workgroup */}
          <div className="relative" ref={workgroupDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select FD WorkGroup *
            </label>
            
            {!userNameConfirmed || !formData.userName ? (
              // Show disabled state when username not confirmed
              <div className="relative">
                <input
                  type="text"
                  value=""
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                  placeholder="Please confirm username first to load workgroups"
                  disabled={true}
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            ) : (
              // Show active workgroup selection
              <div className="relative">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={workgroupSearch}
                    onChange={(e) => {
                      setWorkgroupSearch(e.target.value);
                      setIsWorkgroupDropdownOpen(true);
                    }}
                    onFocus={() => setIsWorkgroupDropdownOpen(true)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      isLoadingUserProfile 
                        ? "Loading your profile..." 
                        : userWorkgroups.length > 0 
                          ? `Search your ${userWorkgroups.length} workgroup${userWorkgroups.length !== 1 ? 's' : ''} or click to select...`
                          : filteredWorkgroups.length > 0 
                            ? `Search ${filteredWorkgroups.length} workgroup${filteredWorkgroups.length !== 1 ? 's' : ''} or click to select...`
                            : "No workgroups found"
                    }
                    disabled={isProcessing || isLoadingWorkgroups || isLoadingUserProfile || filteredWorkgroups.length === 0}
                  />
                  
                  {/* Right side icons */}
                  <div className="absolute right-3 top-3 flex items-center space-x-2">
                    {(isLoadingWorkgroups || isLoadingUserProfile) && (
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                    {filteredWorkgroups.length === 0 && !isLoadingWorkgroups && !isLoadingUserProfile && userNameConfirmed && (
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                    {filteredWorkgroups.length > 0 && !isLoadingWorkgroups && !isLoadingUserProfile && (
                      <button
                        type="button"
                        onClick={() => setIsWorkgroupDropdownOpen(!isWorkgroupDropdownOpen)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className={`w-5 h-5 transform transition-transform ${isWorkgroupDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Dropdown List */}
                {isWorkgroupDropdownOpen && filteredWorkgroups.length > 0 && userNameConfirmed && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {userWorkgroups.length > 0 
                          ? `Your ${filteredWorkgroups.length} workgroup${filteredWorkgroups.length !== 1 ? 's' : ''}`
                          : `${filteredWorkgroups.length} workgroup${filteredWorkgroups.length !== 1 ? 's' : ''} available`}
                        {userProfileError && (
                          <span className="text-xs text-orange-600 ml-2">(Default list)</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsWorkgroupDropdownOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Scrollable List */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredWorkgroups.map((wg, index) => {
                        const displayName = getWorkgroupDisplayName(wg);
                        const workgroupId = getWorkgroupId(wg);
                        const isString = typeof wg === 'string';
                        
                        return (
                          <button
                            key={isString ? `${wg}-${index}` : (workgroupId || index)}
                            type="button"
                            onClick={() => {
                              handleInputChange('workgroup', displayName);
                              setWorkgroupSearch('');
                              setIsWorkgroupDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            disabled={isProcessing}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{displayName}</div>
                                {!isString && workgroupId && (
                                  <div className="text-sm text-gray-500">ID: {workgroupId}</div>
                                )}
                              </div>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Selected Workgroup Display */}
            {formData.workgroup && (
              <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Selected: <strong>{formData.workgroup}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('workgroup', '');
                    setWorkgroupSearch('');
                  }}
                  className="ml-auto text-blue-600 hover:text-blue-800"
                  disabled={isProcessing}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Status Messages */}
            {userNameConfirmed && filteredWorkgroups.length === 0 && !isLoadingWorkgroups && !isLoadingUserProfile && (
              <div className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>No workgroups found for username: {confirmedUserName}</span>
              </div>
            )}
            
            {userNameConfirmed && filteredWorkgroups.length > 0 && !formData.workgroup && !isLoadingWorkgroups && !isLoadingUserProfile && (
              <div className="mt-2 text-sm text-green-600 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {userWorkgroups.length > 0 
                    ? `Your ${filteredWorkgroups.length} workgroup${filteredWorkgroups.length !== 1 ? 's' : ''} loaded - search or click to select`
                    : `${filteredWorkgroups.length} workgroup${filteredWorkgroups.length !== 1 ? 's' : ''} available - search or click to select`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Preferred Device */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Device (Optional)
          </label>
          <div className="flex space-x-2">
            <select
              value={formData.preferredDevice}
              onChange={(e) => handleInputChange('preferredDevice', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            >
              <option value="">Select device</option>
              {devices.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddDevice(!showAddDevice)}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
              disabled={isProcessing}
            >
              Add Device
            </button>
          </div>
          
          {showAddDevice && (
            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new device name"
              />
              <button
                type="button"
                onClick={handleAddDevice}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!newDevice}
              >
                Add
              </button>
            </div>
          )}
          
          <p className="mt-2 text-sm text-blue-600">
            ℹ️ This device will be used for mesh fallouts and manual device selection tasks
          </p>
        </div>

        {/* Preferred Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Port (Optional)
          </label>
          <input
            type="text"
            value={formData.preferredPort}
            onChange={(e) => handleInputChange('preferredPort', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter port name respective to selected device"
            disabled={isProcessing}
          />
          <p className="mt-2 text-sm text-blue-600">
            ℹ️ Enter port name respective of selected device and based on your order requirement
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col space-y-3">
          {/* Validation Messages */}
          {!isFormValid() && (
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="font-medium text-gray-800 mb-2">Required to start automation:</div>
              <ul className="space-y-1">
                {!formData.orderNumber && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Order Number</span></li>}
                {!formData.productName && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Product Name</span></li>}
                {!formData.workflowName && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Workflow Name</span></li>}
                {!formData.userName && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Username (CUID)</span></li>}
                {formData.userName && !userNameConfirmed && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Confirm Username (click "Confirm User" button)</span></li>}
                {userNameConfirmed && workgroups.length === 0 && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Valid workgroup (no workgroups found for user)</span></li>}
                {userNameConfirmed && workgroups.length > 0 && !formData.workgroup && <li className="flex items-center space-x-2"><span className="text-red-500">•</span><span>Select a workgroup</span></li>}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Start Automation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderFormComponent;
