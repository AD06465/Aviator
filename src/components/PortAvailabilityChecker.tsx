'use client';

import React, { useState, useEffect } from 'react';

interface Device {
  name: string;
  description?: string;
}

interface PortAvailabilityCheckerProps {
  environment: string;
}

const DEFAULT_DEVICES: Device[] = [
  { name: 'LAB3COZS4S001', description: 'Lab 3 - S4S Device' },
  { name: 'LAB4COZW4M001', description: 'Lab 4 - Primary 4M Device' },
  { name: 'LAB4COZW4M002', description: 'Lab 4 - Secondary 4M Device' },
  { name: 'LAB4COZWZG001', description: 'Lab 4 - Primary ZG Device' },
  { name: 'LAB4COZWZG002', description: 'Lab 4 - Secondary ZG Device' },
];

interface PortAvailabilityData {
  portName: string;
  portType: string;
  cardName: string;
  cardCatalogNo: string;
  cardStatus: string;
  allowedByBusinessRules: string;
  availableInAsriLiveCall: string;
  availableInNetwork: string;
  logicalPortName?: string;
  logicalPortType?: string;
  services?: Array<{
    serviceName: string;
    serviceType: string;
  }>;
}

export default function PortAvailabilityChecker({ environment }: PortAvailabilityCheckerProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showSection, setShowSection] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [portAvailabilityData, setPortAvailabilityData] = useState<PortAvailabilityData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [bandwidthFilter, setBandwidthFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Load devices from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('aviator_devices');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDevices(parsed);
      } catch {
        setDevices(DEFAULT_DEVICES);
      }
    } else {
      setDevices(DEFAULT_DEVICES);
    }
  }, []);

  // Determine bandwidth from card name
  const getBandwidthFromCardName = (cardName: string): string => {
    if (!cardName) return 'Unknown';
    
    const card = cardName.toUpperCase();
    
    // 1 Gbps cards
    if (card.includes('1000SFP')) {
      return '1 Gbps';
    }
    
    // 10 Gbps cards
    if (card.includes('10GSFP') || card.includes('10G')) {
      return '10 Gbps';
    }
    
    // 100 Gbps cards
    if (card.includes('100GQSFP') || card.includes('100G')) {
      return '100 Gbps';
    }
    
    return 'Unknown';
  };

  // Check if port is available (all three criteria must be "yes")
  const isPortAvailable = (port: PortAvailabilityData): boolean => {
    return (
      port.allowedByBusinessRules === 'yes' &&
      port.availableInAsriLiveCall === 'yes' &&
      port.availableInNetwork === 'yes'
    );
  };

  // Get status category for a port
  const getPortStatus = (port: PortAvailabilityData): string => {
    if (isPortAvailable(port)) {
      return 'Available';
    } else if (port.services && port.services.length > 0) {
      return 'In Service';
    } else {
      return 'Unavailable';
    }
  };

  // Fetch port availability for selected device
  const handleFetchPortAvailability = async () => {
    if (!selectedDevice) {
      setStatus('⚠️ Please select a device');
      return;
    }

    setIsFetching(true);
    setStatus(`🔄 Fetching port availability for ${selectedDevice}...`);
    setPortAvailabilityData([]);
    
    // Reset filters when fetching new device data
    setBandwidthFilter('All');
    setStatusFilter('All');

    try {
      // Call backend API route instead of directly calling MESH API
      const params = new URLSearchParams({
        deviceName: selectedDevice,
        environment: environment,
        bandwidth: '1000',
        portSpeed: '1000',
        interfaceType: '',
        user: 'sasi',
      });

      const url = `/api/port-availability?${params.toString()}`;

      console.log(`🔍 Fetching port availability via backend API:`, url);
      console.log(`📍 Environment: ${environment}`);
      console.log(`📍 Device: ${selectedDevice}`);

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
      });

      console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

      const data = await response.json();
      console.log('✅ Response received:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status} ${response.statusText}`);
      }

      // Handle empty response or error from backend
      if (data.error) {
        console.warn('⚠️ Backend reported an error:', data.error);
        setStatus(`⚠️ ${data.error}`);
        return;
      }

      // Check for port data
      if (data.internalMeshPortData && Array.isArray(data.internalMeshPortData)) {
        if (data.internalMeshPortData.length === 0) {
          console.warn('⚠️ No ports found in response');
          setStatus('⚠️ No ports found for this device');
          return;
        }
        
        setPortAvailabilityData(data.internalMeshPortData);
        
        const availableCount = data.internalMeshPortData.filter(isPortAvailable).length;
        const totalCount = data.internalMeshPortData.length;
        
        console.log(`✅ Found ${totalCount} ports, ${availableCount} available`);
        setStatus(`✅ Found ${availableCount} available ports out of ${totalCount} total ports`);
      } else {
        console.warn('⚠️ Response structure:', Object.keys(data));
        setStatus('⚠️ No port data found in response. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Error fetching port availability:', error);
      if (error instanceof Error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus('❌ Failed to fetch port availability. Check console for details.');
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
      {/* Collapsible Header */}
      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setShowSection(!showSection)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{showSection ? '📂' : '📁'}</span>
          <div>
            <h3 className="text-base font-semibold text-blue-900 flex items-center gap-2">
              <span>🔌</span>
              Port Availability Checker
              {portAvailabilityData.length > 0 && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {portAvailabilityData.filter(isPortAvailable).length} available
                </span>
              )}
            </h3>
            <p className="text-xs text-blue-700 mt-0.5">
              {showSection
                ? 'Click to collapse'
                : `Check port availability for any device${portAvailabilityData.length > 0 ? ` • ${portAvailabilityData.length} ports loaded` : ''}`}
            </p>
          </div>
        </div>
        <span className="text-xl text-blue-600">{showSection ? '▼' : '▶'}</span>
      </div>

      {/* Collapsible Content */}
      {showSection && (
        <div className="px-3 pb-3 space-y-3">
          {/* Device Selection */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Select Device:
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="">-- Select a device --</option>
                {devices.map(device => (
                  <option key={device.name} value={device.name}>
                    {device.name} {device.description ? `- ${device.description}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchPortAvailability}
                disabled={!selectedDevice || isFetching}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2 text-sm"
              >
                {isFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Fetching...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Check Availability
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className="p-2 bg-white border border-blue-300 rounded text-sm">
              {status}
            </div>
          )}

          {/* Port Availability Table */}
          {portAvailabilityData.length > 0 && (
            <div className="bg-white rounded-lg border border-blue-300 overflow-hidden">
              <div className="bg-blue-600 text-white px-3 py-2 font-semibold text-sm">
                Port Availability for {selectedDevice}
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900">Port</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900">Card Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900">
                        <div className="flex items-center gap-1">
                          <span>Bandwidth</span>
                          <select
                            value={bandwidthFilter}
                            onChange={(e) => setBandwidthFilter(e.target.value)}
                            className="ml-1 px-2 py-0.5 border border-blue-400 rounded text-xs bg-white hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title="Filter by bandwidth"
                          >
                            <option value="All">▼</option>
                            <option value="1 Gbps">1G</option>
                            <option value="10 Gbps">10G</option>
                            <option value="100 Gbps">100G</option>
                          </select>
                        </div>
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900">
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="ml-1 px-2 py-0.5 border border-blue-400 rounded text-xs bg-white hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title="Filter by status"
                          >
                            <option value="All">▼</option>
                            <option value="Available">✓</option>
                            <option value="In Service">✗</option>
                            <option value="Unavailable">⚠</option>
                          </select>
                        </div>
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-blue-900">Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portAvailabilityData
                      .filter(port => {
                        // Apply bandwidth filter
                        const bandwidth = getBandwidthFromCardName(port.cardName);
                        const matchesBandwidth = bandwidthFilter === 'All' || bandwidth === bandwidthFilter;
                        
                        // Apply status filter
                        const portStatus = getPortStatus(port);
                        const matchesStatus = statusFilter === 'All' || portStatus === statusFilter;
                        
                        return matchesBandwidth && matchesStatus;
                      })
                      .map((port, index) => {
                      const available = isPortAvailable(port);
                      const bandwidth = getBandwidthFromCardName(port.cardName);
                      const hasServices = port.services && port.services.length > 0;
                      
                      return (
                        <tr
                          key={index}
                          className={`border-t border-blue-200 ${
                            available ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3 py-2 font-mono font-semibold text-gray-800">
                            {port.portName}
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-xs">
                              <div className="font-medium text-gray-800">{port.cardName}</div>
                              <div className="text-gray-600">{port.portType}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                bandwidth === '100 Gbps'
                                  ? 'bg-purple-100 text-purple-800'
                                  : bandwidth === '10 Gbps'
                                  ? 'bg-blue-100 text-blue-800'
                                  : bandwidth === '1 Gbps'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {bandwidth}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {available ? (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                                ✓ Available
                              </span>
                            ) : hasServices ? (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                                ✗ In Service
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                                ⚠ Unavailable
                              </span>
                            )}
                            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                              <div>Rules: {port.allowedByBusinessRules}</div>
                              <div>ASRI: {port.availableInAsriLiveCall}</div>
                              <div>Network: {port.availableInNetwork}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {hasServices ? (
                              <div className="space-y-1">
                                {port.services!.map((service, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className={`text-xs px-2 py-1 rounded ${
                                      service.serviceType === 'UNI'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <div className="font-semibold">{service.serviceType}</div>
                                    <div className="font-mono text-xs">{service.serviceName}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No services</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="bg-blue-50 border-t border-blue-200 p-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
                      <span className="text-gray-700">
                        Available: {portAvailabilityData
                          .filter(port => {
                            const bandwidth = getBandwidthFromCardName(port.cardName);
                            const portStatus = getPortStatus(port);
                            return (bandwidthFilter === 'All' || bandwidth === bandwidthFilter) &&
                                   (statusFilter === 'All' || portStatus === statusFilter);
                          })
                          .filter(isPortAvailable).length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-100 border border-red-300 rounded"></span>
                      <span className="text-gray-700">
                        In Service: {portAvailabilityData
                          .filter(port => {
                            const bandwidth = getBandwidthFromCardName(port.cardName);
                            const portStatus = getPortStatus(port);
                            return (bandwidthFilter === 'All' || bandwidth === bandwidthFilter) &&
                                   (statusFilter === 'All' || portStatus === statusFilter);
                          })
                          .filter(p => p.services && p.services.length > 0).length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></span>
                      <span className="text-gray-700">
                        Unavailable: {portAvailabilityData
                          .filter(port => {
                            const bandwidth = getBandwidthFromCardName(port.cardName);
                            const portStatus = getPortStatus(port);
                            return (bandwidthFilter === 'All' || bandwidth === bandwidthFilter) &&
                                   (statusFilter === 'All' || portStatus === statusFilter);
                          })
                          .filter(p => !isPortAvailable(p) && (!p.services || p.services.length === 0)).length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-800">
                      Showing {portAvailabilityData.filter(port => {
                        const bandwidth = getBandwidthFromCardName(port.cardName);
                        const portStatus = getPortStatus(port);
                        return (bandwidthFilter === 'All' || bandwidth === bandwidthFilter) &&
                               (statusFilter === 'All' || portStatus === statusFilter);
                      }).length} of {portAvailabilityData.length}
                    </span>
                    {(bandwidthFilter !== 'All' || statusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setBandwidthFilter('All');
                          setStatusFilter('All');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                        title="Clear all filters"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
