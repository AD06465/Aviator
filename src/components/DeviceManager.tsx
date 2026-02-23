'use client';

import React, { useState, useEffect } from 'react';
import { PortSpeed, PortInfo, Environment, DeviceDetails } from '@/types';
import { flightDeckApiService } from '@/lib/api';

interface Device {
  name: string;
  description?: string;
  details?: DeviceDetails; // ASRI device details
}

interface DeviceManagerProps {
  selectedDevice: string;
  selectedPort: string;
  onDeviceChange: (device: string) => void;
  onPortChange: (port: string) => void;
  environment: string;
  portSpeedMbps?: number; // Auto-detected port speed from order API
}

const PORT_SPEEDS: PortSpeed[] = [
  { label: '1GBPS', value: 1000 },
  { label: '10GBPS', value: 10000 },
  { label: '100GBPS', value: 100000 },
];

const DEFAULT_DEVICES: Device[] = [
  { name: 'LAB3COZS4S001', description: 'Lab 3 - S4S Device for testing ASR 920 configurations' },
  { name: 'LAB4COZW4M001', description: 'Lab 4 - Primary 4M Device for Metro Ethernet testing' },
  { name: 'LAB4COZW4M002', description: 'Lab 4 - Secondary 4M Device for redundancy testing' },
  { name: 'LAB4COZWZG001', description: 'Lab 4 - Primary ZG Device for ASR 920-24SZ-M testing' },
  { name: 'LAB4COZWZG002', description: 'Lab 4 - Secondary ZG Device for failover scenarios' },
];

const STORAGE_KEY = 'aviator_devices';

// Environment-specific MESH API URLs
const MESH_API_URLS: Record<string, string> = {
  'Test 1': 'http://sasi-test1.rke-odc-test.corp.intranet',
  'Test 2': 'http://sasi-test4.rke-odc-test.corp.intranet',
  'Test 4': 'http://sasi-test2.rke-odc-test.corp.intranet',
};

export default function DeviceManager({
  selectedDevice,
  selectedPort,
  onDeviceChange,
  onPortChange,
  environment,
  portSpeedMbps,
}: DeviceManagerProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceDescription, setNewDeviceDescription] = useState('');
  const [selectedPortSpeed, setSelectedPortSpeed] = useState<number>(portSpeedMbps || 1000);
  const [isFetchingPorts, setIsFetchingPorts] = useState(false);
  const [availablePorts, setAvailablePorts] = useState<PortInfo[]>([]);
  const [portFetchError, setPortFetchError] = useState('');
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Update port speed when auto-detected value changes
  useEffect(() => {
    if (portSpeedMbps && portSpeedMbps !== selectedPortSpeed) {
      setSelectedPortSpeed(portSpeedMbps);
      console.log(`✅ Port speed auto-updated to: ${portSpeedMbps} Mbps`);
    }
  }, [portSpeedMbps]);

  // Load devices from localStorage on mount
  useEffect(() => {
    const storedDevices = localStorage.getItem(STORAGE_KEY);
    if (storedDevices) {
      try {
        const parsed = JSON.parse(storedDevices);
        // Handle legacy string[] format
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Convert old string[] format to Device[] - only add default description if no user data
            const convertedDevices = parsed.map(name => {
              const defaultDevice = DEFAULT_DEVICES.find(d => d.name === name);
              return {
                name,
                description: defaultDevice?.description || undefined
              };
            });
            setDevices(convertedDevices);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedDevices));
          } else {
            // Device[] format - preserve user descriptions, DON'T overwrite with defaults
            setDevices(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to parse stored devices:', error);
        setDevices(DEFAULT_DEVICES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
      }
    } else {
      // First time - use defaults
      setDevices(DEFAULT_DEVICES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEVICES));
    }
  }, []);

  // Fetch device details from ASRI when environment changes or devices load
  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (devices.length === 0) return;
      
      // Use provided environment or default to Test 1
      const currentEnv = environment || 'Test 1';
      
      console.log(`🔄 Fetching device details for ${devices.length} devices in ${currentEnv}...`);
      
      // Set environment for API calls
      flightDeckApiService.setEnvironment(currentEnv);
      
      const updatedDevices = await Promise.all(
        devices.map(async (device) => {
          // Always fetch when environment changes (don't skip if details exist)
          const result = await flightDeckApiService.getDeviceDetails(device.name);
          
          if (result.success && result.data) {
            console.log(`✅ Fetched details for ${device.name} in ${currentEnv}`);
            return {
              ...device,
              details: result.data
            };
          }
          
          console.log(`⚠️ Could not fetch details for ${device.name} in ${currentEnv}`);
          // Keep device without details if API call fails
          return { ...device, details: undefined };
        })
      );
      
      // Update devices with new details
      setDevices(updatedDevices);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDevices));
      console.log(`✅ Device details refreshed for environment: ${currentEnv}`);
    };
    
    // Fetch on initial load and when environment changes
    if (devices.length > 0) {
      fetchDeviceDetails();
    }
  }, [environment, devices.length]); // Re-fetch when environment changes or devices are loaded

  // Save devices to localStorage whenever they change
  const saveDevices = (newDevices: Device[]) => {
    setDevices(newDevices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDevices));
  };

  // Export devices to JSON file
  const exportDevices = () => {
    const dataStr = JSON.stringify(devices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aviator-devices-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import devices from JSON file
  const importDevices = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedDevices: Device[] = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedDevices)) {
          saveDevices(importedDevices);
          alert(`Successfully imported ${importedDevices.length} device(s)`);
        } else {
          alert('Invalid device configuration file');
        }
      } catch (error) {
        alert('Failed to import devices. Please check the file format.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Add device to the list
  const handleAddDevice = () => {
    if (!newDeviceName.trim()) {
      return;
    }

    const deviceExists = devices.some(
      (d) => d.name.toLowerCase() === newDeviceName.trim().toLowerCase()
    );

    if (deviceExists) {
      alert('⚠️ Device already exists in the list');
      return;
    }

    const newDevice: Device = {
      name: newDeviceName.trim(),
      description: newDeviceDescription.trim() || undefined,
    };

    const updatedDevices = [...devices, newDevice];
    saveDevices(updatedDevices);
    setNewDeviceName('');
    setNewDeviceDescription('');
  };

  // Remove device from list
  const handleRemoveDevice = (deviceName: string) => {
    if (devices.length <= 1) {
      alert('⚠️ Cannot remove the last device');
      return;
    }

    const updatedDevices = devices.filter((d) => d.name !== deviceName);
    saveDevices(updatedDevices);
    if (selectedDevice === deviceName) {
      onDeviceChange('');
      onPortChange('');
    }
  };

  // Start editing a device
  const handleEditDevice = (device: Device) => {
    setEditingDevice(device.name);
    setEditName(device.name);
    setEditDescription(device.description || '');
  };

  // Save edited device
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      alert('⚠️ Device name cannot be empty');
      return;
    }

    // Check if renamed device already exists (excluding current device)
    if (editName !== editingDevice) {
      const deviceExists = devices.some(
        (d) => d.name.toLowerCase() === editName.trim().toLowerCase()
      );
      if (deviceExists) {
        alert('⚠️ A device with this name already exists');
        return;
      }
    }

    const updatedDevices = devices.map((d) =>
      d.name === editingDevice
        ? { name: editName.trim(), description: editDescription.trim() || undefined }
        : d
    );

    saveDevices(updatedDevices);
    
    // Update selected device if it was renamed
    if (selectedDevice === editingDevice && editName !== editingDevice) {
      onDeviceChange(editName.trim());
    }

    setEditingDevice(null);
    setEditName('');
    setEditDescription('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingDevice(null);
    setEditName('');
    setEditDescription('');
  };

  // Fetch available ports from MESH API
  const handleFetchPorts = async () => {
    if (!selectedDevice) {
      setPortFetchError('⚠️ Please select a device first');
      return;
    }

    if (!selectedPortSpeed) {
      setPortFetchError('⚠️ Please select a port speed');
      return;
    }

    setIsFetchingPorts(true);
    setPortFetchError('');
    setAvailablePorts([]);

    try {
      // Get environment-specific MESH API URL
      const meshBaseUrl = MESH_API_URLS[environment] || MESH_API_URLS['Test 1'];
      const meshUrl = `${meshBaseUrl}/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend=${selectedDevice}&portSpeed=${selectedPortSpeed}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE`;

      console.log('🌍 Current environment:', environment);
      console.log('🔗 MESH Base URL:', meshBaseUrl);
      console.log('🔍 Fetching ports from:', meshUrl);

      const response = await fetch(meshUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });

      console.log('📡 MESH Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const jsonText = await response.text();
      
      if (!jsonText || jsonText.trim() === '') {
        setPortFetchError('❌ Empty response from MESH API. This may be a CORS issue. Try entering port manually.');
        return;
      }

      console.log('📦 Received response, length:', jsonText.length);
      console.log('📦 First 500 chars:', jsonText.substring(0, 500));

      // Parse JSON response
      let data: any;
      try {
        data = JSON.parse(jsonText);
        console.log('✅ JSON parsed successfully');
        console.log('📊 Response structure:', {
          resourceType: data.resourceType,
          totalResources: data.totalResources,
          hasResources: !!data.resources
        });
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.error('❌ Response text:', jsonText.substring(0, 1000));
        setPortFetchError(`❌ Failed to parse JSON response. This might be an HTML error page or CORS issue. Check browser console.`);
        return;
      }

      // Navigate JSON structure to find aendPort
      const ports: PortInfo[] = [];
      
      if (!data.resources || data.resources.length === 0) {
        setPortFetchError('❌ No resources found in MESH response');
        return;
      }

      // Iterate through resources and pathElements to find aendPort
      for (const resource of data.resources) {
        if (!resource.pathElements) continue;
        
        for (const pathElement of resource.pathElements) {
          // Check if this is a "New_NID" type - means no available device/port
          if (pathElement.type === 'New_NID') {
            setPortFetchError('⚠️ New NID Required: MESH indicates that a new NID device installation is required at this location. No existing device/port is available. Please coordinate with provisioning team for new device installation.');
            setAvailablePorts([]);
            return;
          }
          
          if (!pathElement.subElements) continue;
          
          for (const subElement of pathElement.subElements) {
            // Verify this subElement is for the requested device
            const deviceNameMatch = subElement.name === selectedDevice;
            
            if (subElement.aendPort && deviceNameMatch) {
              const aendPort = subElement.aendPort;
              
              // Extract portSysId from attributes
              const portSysIdAttr = aendPort.attributes?.find(
                (attr: any) => attr.name === 'portSysId'
              );
              const portSysId = portSysIdAttr?.value || '';
              
              // Extract Class attribute
              const classAttr = aendPort.attributes?.find(
                (attr: any) => attr.name === 'Class'
              );
              const portClass = classAttr?.value || '';

              if (aendPort.name) {
                ports.push({
                  name: aendPort.name,
                  portSysId,
                  type: aendPort.type || '',
                  status: aendPort.status || '',
                  class: portClass,
                });
                
                console.log('✅ Found aendPort:', {
                  name: aendPort.name,
                  portSysId,
                  type: aendPort.type,
                  status: aendPort.status,
                  class: portClass
                });
                
                // Stop after finding first aendPort (as per user requirement)
                break;
              }
            }
          }
          
          // If we found a port, stop searching
          if (ports.length > 0) break;
        }
        
        // If we found a port, stop searching
        if (ports.length > 0) break;
      }

      console.log('🔍 Total ports found:', ports.length);

      if (ports.length > 0) {
        // Check if the port class is "Empty Slot"
        const firstPort = ports[0];
        if (firstPort.class && firstPort.class.toLowerCase().includes('empty slot')) {
          setAvailablePorts(ports);
          setPortFetchError(`ℹ️ Note: Port "${firstPort.name}" is an Empty Slot (not a physical port). This is a slot placeholder and cannot be used directly as a PORT. Please enter the actual physical port manually.`);
          // Don't auto-fill the port field for empty slots
          onPortChange('');
        } else {
          setAvailablePorts(ports);
          // Auto-fill the first port only if it's a valid physical port
          onPortChange(firstPort.name);
          setPortFetchError(`✅ Found ${ports.length} available port(s)`);
        }
      } else {
        setPortFetchError('❌ Could not extract port information from response');
      }
    } catch (error) {
      console.error('❌ Port fetch error:', error);
      
      // Check for CORS-specific errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setPortFetchError(`❌ CORS Error: Cannot access MESH API. Enter port manually based on your order requirements.`);
      } else {
        setPortFetchError(`❌ Failed to fetch ports: ${error instanceof Error ? error.message : 'Network error'}`);
      }
    } finally {
      setIsFetchingPorts(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Device and Port Configuration Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device and Port Configuration</h3>
        
        <div className="space-y-4">
          {/* Device Selection with Manage Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Device (Optional)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedDevice}
                onChange={(e) => {
                  onDeviceChange(e.target.value);
                  onPortChange(''); // Reset port when device changes
                  setAvailablePorts([]);
                  setPortFetchError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a device</option>
                {devices.map((device) => (
                  <option key={device.name} value={device.name} title={device.description}>
                    {device.name}{device.description ? ` - ${device.description}` : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowDeviceManager(!showDeviceManager)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Manage Devices</span>
              </button>
            </div>
          </div>

          {/* Device Management Modal/Section */}
          {showDeviceManager && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-blue-900">Device Management</h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={exportDevices}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                    title="Export devices"
                  >
                    📥 Export
                  </button>
                  <label className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors cursor-pointer" title="Import devices">
                    📤 Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importDevices}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDeviceManager(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add Device Input */}
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddDevice()}
                  placeholder="Device name (e.g., LAB4COZWZG002)"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newDeviceDescription}
                  onChange={(e) => setNewDeviceDescription(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddDevice()}
                  placeholder="Description (optional, e.g., 'Primary device for testing ASR configurations')"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddDevice}
                  disabled={!newDeviceName.trim()}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Devices List */}
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-blue-200">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Device Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-200">
                    {devices.map((device) => (
                      <tr key={device.name} className="hover:bg-blue-50">
                        <td className="px-4 py-3">
                          {editingDevice === device.name ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Device name"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{device.name}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingDevice === device.name ? (
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Description (optional)"
                            />
                          ) : (
                            <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                {device.description || <span className="italic text-gray-400">No description</span>}
                              </div>
                              {/* Device Details from ASRI */}
                              {device.details && (
                                <div className="text-xs text-gray-500 space-y-0.5 mt-2 pt-2 border-t border-gray-100">
                                  {device.details.type && (
                                    <div>
                                      <span className="font-semibold text-blue-600">Type:</span> {device.details.type}
                                    </div>
                                  )}
                                  {device.details.subType && (
                                    <div>
                                      <span className="font-semibold text-green-600">SubType:</span> {device.details.subType}
                                    </div>
                                  )}
                                  {device.details.status && (
                                    <div>
                                      <span className="font-semibold text-purple-600">Status:</span> {device.details.status}
                                    </div>
                                  )}
                                  {device.details.roleCode && (
                                    <div>
                                      <span className="font-semibold text-orange-600">Role Code:</span> {device.details.roleCode}
                                    </div>
                                  )}
                                  {device.details.roleFullName && (
                                    <div>
                                      <span className="font-semibold text-indigo-600">Role:</span> {device.details.roleFullName}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          {editingDevice === device.name ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Save changes"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Cancel"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditDevice(device)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Edit device"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDevice(device.name)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Remove device"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-blue-700">
                💾 Devices are automatically saved and will persist across sessions
              </p>
            </div>
          )}

          {/* Port Speed Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port Speed
            </label>
            <select
              value={selectedPortSpeed}
              onChange={(e) => setSelectedPortSpeed(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PORT_SPEEDS.map((speed) => (
                <option key={speed.value} value={speed.value}>
                  {speed.label}
                </option>
              ))}
            </select>
          </div>

          {/* Port Fetching */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Port (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedPort}
                onChange={(e) => onPortChange(e.target.value)}
                placeholder="Port name (e.g., GigabitEthernet0/0/21)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleFetchPorts}
                disabled={!selectedDevice || isFetchingPorts}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isFetchingPorts ? 'Fetching...' : 'Fetch Port'}
              </button>
            </div>
            {portFetchError && (
              <p className="mt-2 text-sm text-gray-600">{portFetchError}</p>
            )}
          </div>

          {/* Available Ports Display */}
          {availablePorts.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Available Ports:</h4>
              <div className="space-y-2">
                {availablePorts.map((port, idx) => (
                  <div key={idx} className="text-sm text-blue-800">
                    <div className="font-medium">{port.name}</div>
                    <div className="text-xs text-blue-600">
                      Type: {port.type} | Status: {port.status} | Class: {port.class}
                      {port.portSysId && ` | ID: ${port.portSysId}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
