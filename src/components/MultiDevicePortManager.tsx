'use client';

import React, { useState, useEffect } from 'react';
import { DevicePortPair } from '@/types';

interface Device {
  name: string;
  description?: string;
}

interface MultiDevicePortManagerProps {
  environment: string;
  portSpeedMbps?: number;
  onDevicePortPairsChange: (pairs: DevicePortPair[]) => void;
  initialPairs?: DevicePortPair[];
}

const DEFAULT_DEVICES: Device[] = [
  { name: 'LAB3COZS4S001', description: 'Lab 3 - S4S Device' },
  { name: 'LAB4COZW4M001', description: 'Lab 4 - Primary 4M Device' },
  { name: 'LAB4COZW4M002', description: 'Lab 4 - Secondary 4M Device' },
  { name: 'LAB4COZWZG001', description: 'Lab 4 - Primary ZG Device' },
  { name: 'LAB4COZWZG002', description: 'Lab 4 - Secondary ZG Device' },
];

const MESH_API_URLS: Record<string, string> = {
  'Test 1': 'http://sasi-test1.rke-odc-test.corp.intranet',
  'Test 2': 'http://sasi-test4.rke-odc-test.corp.intranet',
  'Test 4': 'http://sasi-test2.rke-odc-test.corp.intranet',
};

export default function MultiDevicePortManager({
  environment,
  portSpeedMbps = 10000,
  onDevicePortPairsChange,
  initialPairs = [],
}: MultiDevicePortManagerProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [devicePortPairs, setDevicePortPairs] = useState<DevicePortPair[]>(initialPairs);
  const [isFetchingPorts, setIsFetchingPorts] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string>('');
  const [showManager, setShowManager] = useState(false);

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

  // Toggle device selection
  const handleDeviceToggle = (deviceName: string) => {
    setSelectedDevices(prev => {
      if (prev.includes(deviceName)) {
        return prev.filter(d => d !== deviceName);
      } else {
        return [...prev, deviceName];
      }
    });
  };

  // Fetch port for a single device from MESH API
  const fetchPortForDevice = async (deviceName: string, portSpeed: number): Promise<DevicePortPair | null> => {
    try {
      const meshBaseUrl = MESH_API_URLS[environment] || MESH_API_URLS['Test 1'];
      const meshUrl = `${meshBaseUrl}/inventory/v1/mesh/paths?product=Ethernet&includeColorless=yes&aend=${deviceName}&portSpeed=${portSpeed}&highBandwidth=Yes&numpaths=1&interface=Optical&productType=ELINE`;

      console.log(`🔍 Fetching port for ${deviceName}:`, meshUrl);

      const response = await fetch(meshUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const jsonText = await response.text();
      if (!jsonText || jsonText.trim() === '') {
        console.warn(`⚠️ Empty response for ${deviceName}`);
        return null;
      }

      const data = JSON.parse(jsonText);

      // Navigate JSON structure to find aendPort
      if (!data.resources || data.resources.length === 0) {
        console.warn(`⚠️ No resources for ${deviceName}`);
        return null;
      }

      for (const resource of data.resources) {
        if (!resource.pathElements) continue;

        for (const pathElement of resource.pathElements) {
          // Check for New_NID type
          if (pathElement.type === 'New_NID') {
            console.warn(`⚠️ ${deviceName} requires New NID`);
            return {
              device: deviceName,
              port: 'New NID Required',
              portClass: 'New_NID',
            };
          }

          if (!pathElement.subElements) continue;

          for (const subElement of pathElement.subElements) {
            if (subElement.name === deviceName && subElement.aendPort) {
              const aendPort = subElement.aendPort;

              // Extract portSysId
              const portSysIdAttr = aendPort.attributes?.find(
                (attr: any) => attr.name === 'portSysId'
              );
              const portSysId = portSysIdAttr?.value || '';

              // Extract Class
              const classAttr = aendPort.attributes?.find(
                (attr: any) => attr.name === 'Class'
              );
              const portClass = classAttr?.value || '';

              if (aendPort.name) {
                console.log(`✅ Found port for ${deviceName}:`, aendPort.name);
                return {
                  device: deviceName,
                  port: aendPort.name,
                  portSysId,
                  portClass,
                  portSpeed: `${portSpeed} Mbps`,
                };
              }
            }
          }
        }
      }

      console.warn(`⚠️ No port found for ${deviceName}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching port for ${deviceName}:`, error);
      return null;
    }
  };

  // Fetch ports for all selected devices in parallel
  const handleFetchAllPorts = async () => {
    if (selectedDevices.length === 0) {
      setFetchStatus('⚠️ Please select at least one device');
      return;
    }

    setIsFetchingPorts(true);
    setFetchStatus(`🔄 Fetching ports for ${selectedDevices.length} device(s)...`);

    try {
      // Make parallel MESH API calls for all selected devices
      const portPromises = selectedDevices.map(deviceName =>
        fetchPortForDevice(deviceName, portSpeedMbps)
      );

      const results = await Promise.all(portPromises);

      // Filter out null results and create device/port pairs
      const successfulPairs = results.filter((pair): pair is DevicePortPair => pair !== null);

      if (successfulPairs.length === 0) {
        setFetchStatus('❌ No ports found for selected devices');
      } else {
        setDevicePortPairs(successfulPairs);
        onDevicePortPairsChange(successfulPairs);
        setFetchStatus(`✅ Fetched ports for ${successfulPairs.length}/${selectedDevices.length} device(s)`);
      }
    } catch (error) {
      console.error('❌ Error fetching ports:', error);
      setFetchStatus('❌ Failed to fetch ports. Check console for details.');
    } finally {
      setIsFetchingPorts(false);
    }
  };

  // Remove a device/port pair
  const handleRemovePair = (index: number) => {
    const updated = devicePortPairs.filter((_, i) => i !== index);
    setDevicePortPairs(updated);
    onDevicePortPairsChange(updated);
  };

  // Clear all pairs
  const handleClearAll = () => {
    setDevicePortPairs([]);
    setSelectedDevices([]);
    onDevicePortPairsChange([]);
    setFetchStatus('');
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
      {/* Collapsible Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={() => setShowManager(!showManager)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{showManager ? '📂' : '📁'}</span>
          <div>
            <h3 className="text-base font-semibold text-purple-900 flex items-center gap-2">
              <span>🔀</span>
              Multi-Device/Port Manager
              {devicePortPairs.length > 0 && (
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  {devicePortPairs.length} configured
                </span>
              )}
            </h3>
            <p className="text-xs text-purple-700 mt-0.5">
              {showManager
                ? 'Click to collapse'
                : `Click to expand and configure device/port pairs${devicePortPairs.length > 0 ? ` • ${devicePortPairs.length} pair(s) configured` : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {devicePortPairs.length > 0 && !showManager && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-purple-300">
              <span className="text-purple-600">✓</span>
              <span>Configured</span>
            </div>
          )}
          <span className="text-2xl text-purple-600">{showManager ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Collapsible Content */}
      {showManager && (
        <div className="px-4 pb-4 space-y-4">
          {/* Device Selection */}
          <div>
            <label className="block text-sm font-semibold text-purple-900 mb-2">
              Select Devices (click to select multiple):
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {devices.map(device => (
                <label
                  key={device.name}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                    selectedDevices.includes(device.name)
                      ? 'bg-purple-200 border-2 border-purple-600'
                      : 'bg-white border border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.name)}
                    onChange={() => handleDeviceToggle(device.name)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{device.name}</div>
                    {device.description && (
                      <div className="text-xs text-gray-600">{device.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Fetch Ports Button */}
          <div className="flex gap-2">
            <button
              onClick={handleFetchAllPorts}
              disabled={selectedDevices.length === 0 || isFetchingPorts}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
            >
              {isFetchingPorts ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching Ports...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Fetch Ports for {selectedDevices.length || 0} Selected Device(s)
                </>
              )}
            </button>
            {devicePortPairs.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Status Message */}
          {fetchStatus && (
            <div className="p-3 bg-white border border-purple-300 rounded text-sm">
              {fetchStatus}
            </div>
          )}

          {/* Device/Port Pairs Table */}
          {devicePortPairs.length > 0 && (
            <div className="bg-white rounded-lg border border-purple-300 overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-2 font-semibold">
                Configured Device/Port Pairs
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">#</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Device</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Port</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Use As</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devicePortPairs.map((pair, index) => (
                      <tr key={index} className="border-t border-purple-200 hover:bg-purple-50">
                        <td className="px-4 py-3 text-sm font-medium text-purple-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-800">{pair.device}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-800">
                          {pair.port}
                          {pair.portClass === 'New_NID' && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                              New NID
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-xs text-green-700 font-semibold">Auto (recommended):</div>
                            <code className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded block font-mono">
                              {"{{preferredDevice}}"} → This device
                            </code>
                            <code className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded block font-mono">
                              {"{{preferredPort}}"} → This port
                            </code>
                            <div className="text-xs text-gray-500 mt-2">Manual (optional):</div>
                            <code className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded block font-mono">
                              {`{{preferredDevice${index + 1}}}`}
                            </code>
                            <code className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded block font-mono">
                              {`{{preferredPort${index + 1}}}`}
                            </code>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleRemovePair(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-green-50 border-t border-green-200 p-3">
                <div className="space-y-2">
                  <p className="text-sm text-green-800 font-semibold">
                    ✨ Global Sequential Assignment:
                  </p>
                  <p className="text-sm text-green-800">
                    Simply use <code className="bg-green-200 px-1 font-mono">{"{{preferredDevice}}"}</code> and <code className="bg-green-200 px-1 font-mono">{"{{preferredPort}}"}</code> in your Task Configuration for ANY task.
                    The system assigns pairs in the order tasks are processed:
                  </p>
                  <ul className="text-sm text-green-800 ml-4 space-y-1">
                    <li>• <strong>1st task completed</strong> → Gets Pair #1 (any task type)</li>
                    <li>• <strong>2nd task completed</strong> → Gets Pair #2 (any task type)</li>
                    <li>• <strong>3rd task completed</strong> → Gets Pair #3 (any task type)</li>
                  </ul>
                  <p className="text-xs text-green-700 mt-2">
                    <strong>Example:</strong> If you process "LOA Designate Tid and Port", then "Verify Device", then another "LOA Designate" - they get Pairs #1, #2, and #3 respectively.
                  </p>
                  <p className="text-xs text-green-700 mt-1 italic">
                    Works across ALL task types! No manual numbering needed. 🚀
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
