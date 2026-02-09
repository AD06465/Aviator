'use client';

import React, { useState, useEffect } from 'react';
import { DataBackupManager, BackupMetadata } from '@/lib/dataBackup';

export default function BackupManager() {
  const [metadata, setMetadata] = useState<BackupMetadata | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string>('');

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = () => {
    const meta = DataBackupManager.getBackupMetadata();
    setMetadata(meta);
  };

  const handleCreateBackup = () => {
    try {
      DataBackupManager.createBackup();
      setBackupStatus('✅ Backup created successfully!');
      loadMetadata();
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      setBackupStatus('❌ Failed to create backup');
      setTimeout(() => setBackupStatus(''), 3000);
    }
  };

  const handleExportBackup = () => {
    try {
      DataBackupManager.exportBackupToFile();
      setBackupStatus('✅ Backup file downloaded!');
      setTimeout(() => setBackupStatus(''), 3000);
    } catch (error) {
      setBackupStatus('❌ Failed to export backup');
      setTimeout(() => setBackupStatus(''), 3000);
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await DataBackupManager.importBackupFromFile(file);
      setBackupStatus('✅ Backup restored successfully! Please refresh the page.');
      loadMetadata();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setBackupStatus('❌ Failed to import backup');
      setTimeout(() => setBackupStatus(''), 3000);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleRestoreBackup = () => {
    setShowRestoreConfirm(true);
  };

  const confirmRestore = () => {
    try {
      const success = DataBackupManager.restoreFromBackup();
      if (success) {
        setBackupStatus('✅ Data restored from backup! Refreshing...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setBackupStatus('❌ No backup found to restore');
      }
    } catch (error) {
      setBackupStatus('❌ Failed to restore backup');
    }
    setShowRestoreConfirm(false);
    setTimeout(() => setBackupStatus(''), 3000);
  };

  const handleToggleAutoBackup = () => {
    const newState = !metadata?.autoBackupEnabled;
    DataBackupManager.setAutoBackupEnabled(newState);
    loadMetadata();
    setBackupStatus(`✅ Auto-backup ${newState ? 'enabled' : 'disabled'}`);
    setTimeout(() => setBackupStatus(''), 3000);
  };

  const handleVerifyIntegrity = () => {
    const result = DataBackupManager.verifyDataIntegrity();
    if (result.isValid) {
      setBackupStatus('✅ Data integrity check passed!');
    } else {
      setBackupStatus(`⚠️ Issues found: ${result.issues.join(', ')}`);
    }
    setTimeout(() => setBackupStatus(''), 5000);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isExpanded ? '💾' : '🔒'}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Backup Manager</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isExpanded
                ? 'Manage backups and protect your configuration data'
                : metadata?.lastBackupTime
                ? `Last backup: ${formatDate(metadata.lastBackupTime)}`
                : 'Click to expand backup options'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {metadata?.autoBackupEnabled && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Auto-backup ON
            </span>
          )}
          {!isExpanded && (
            <span className="text-sm text-gray-500">
              {metadata?.backupCount || 0} backups
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Status Message */}
          {backupStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{backupStatus}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm font-semibold text-green-600">
                {metadata?.lastBackupTime
                  ? new Date(metadata.lastBackupTime).toLocaleTimeString()
                  : 'Never'}
              </div>
              <div className="text-sm text-green-800">Last Backup Time</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm font-semibold text-purple-600">
                {metadata?.autoBackupEnabled ? 'Active' : 'Disabled'}
              </div>
              <div className="text-sm text-purple-800">Auto-Backup Status</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleCreateBackup}
              className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>💾</span>
              Create Backup Now
            </button>

            <button
              onClick={handleExportBackup}
              className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>📥</span>
              Download Backup File
            </button>

            <label className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
              <span>📤</span>
              Import Backup File
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleRestoreBackup}
              className="px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              Restore from Backup
            </button>

            <button
              onClick={handleToggleAutoBackup}
              className={`px-4 py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2 ${
                metadata?.autoBackupEnabled
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <span>{metadata?.autoBackupEnabled ? '⏸️' : '▶️'}</span>
              {metadata?.autoBackupEnabled ? 'Disable' : 'Enable'} Auto-Backup
            </button>

            <button
              onClick={handleVerifyIntegrity}
              className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              Verify Data Integrity
            </button>
          </div>

          {/* Information Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>💡</span>
              Backup System Information
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[140px]">Auto-Backup:</span>
                <span>
                  Creates automatic backups every 5 minutes when enabled
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[140px]">Backup Storage:</span>
                <span>
                  All backups are stored in your browser's localStorage
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[140px]">Export Backup:</span>
                <span>
                  Downloads a JSON file to your computer for safekeeping
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[140px]">Import Backup:</span>
                <span>
                  Restores data from a previously exported backup file
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[140px]">Data Protected:</span>
                <span>
                  Device configurations, task settings, and all mandatory field mappings
                </span>
              </div>
            </div>
          </div>

          {/* Last Backup Info */}
          {metadata?.lastBackupTime && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Last Backup:</span>{' '}
                {formatDate(metadata.lastBackupTime)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              ⚠️ Confirm Restore
            </h3>
            <p className="text-gray-700 mb-6">
              This will restore all data from the last backup. Any changes made since
              then will be lost. The page will refresh after restoration.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Yes, Restore Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
