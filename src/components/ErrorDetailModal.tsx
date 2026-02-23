import React from 'react';

interface ErrorDetailModalProps {
  open: boolean;
  onClose: () => void;
  workflowName: string;
  errorDetails: Array<{
    task: string;
    message: string | object;
    timestamp: number;
    incoming?: any;
    outgoing?: any;
    error?: any;
    status?: string;
  }>;
  loading?: boolean;
}

const ErrorDetailModal: React.FC<ErrorDetailModalProps> = ({ open, onClose, workflowName, errorDetails, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 relative border border-[#e5e7eb] animate-fadeIn">
        <div className="flex items-center justify-between px-8 pt-7 pb-2 border-b border-[#F5C6CB] rounded-t-2xl bg-gradient-to-r from-[#fff0f3] to-[#f8d7da]">
          <h2 className="text-2xl font-semibold text-[#B71C1C] tracking-tight flex items-center gap-2">
            <svg className="w-7 h-7 text-[#DC3545]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="#DC3545" fill="#F8D7DA" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" stroke="#DC3545" />
            </svg>
            Error Details for <span className="ml-1 text-[#DC3545]">{workflowName}</span>
          </h2>
          <button
            className="text-[#DC3545] hover:text-[#B71C1C] text-2xl font-bold transition-colors focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-8 py-6 max-h-[32rem] overflow-y-auto bg-gradient-to-b from-[#fff] to-[#f8d7da]/40 rounded-b-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="text-[#DC3545] text-lg font-medium animate-pulse">Loading error details...</span>
            </div>
          ) : errorDetails.length === 0 ? (
            <p className="text-gray-600 text-center">No error details available.</p>
          ) : (
            errorDetails.map((err, idx) => (
              <div key={idx} className="border border-[#F5C6CB] bg-white/80 shadow-sm rounded-xl p-5 mb-5 transition-all hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-semibold text-[#DC3545]">Task:</span>
                  <span className="text-[#333] font-mono text-base">{err.task}</span>
                  {err.status && (
                    <span className="ml-2 text-xs bg-[#DC3545] text-white px-2 py-0.5 rounded shadow">{err.status}</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-[#DC3545]">Message:</span>
                  <span className="text-[#333] ml-2 font-mono text-xs break-all">{typeof err.message === 'string' ? err.message : JSON.stringify(err.message)}</span>
                </div>
                {err.incoming !== undefined && (
                  <div className="mb-2">
                    <span className="font-semibold text-[#DC3545]">Incoming:</span>
                    <span className="text-[#333] ml-2 font-mono text-xs break-all">{JSON.stringify(err.incoming)}</span>
                  </div>
                )}
                {err.outgoing !== undefined && (
                  <div className="mb-2">
                    <span className="font-semibold text-[#DC3545]">Outgoing:</span>
                    <span className="text-[#333] ml-2 font-mono text-xs break-all">{JSON.stringify(err.outgoing)}</span>
                  </div>
                )}
                {err.error !== undefined && (
                  <div className="mb-2">
                    <span className="font-semibold text-[#DC3545]">Error:</span>
                    <span className="text-[#333] ml-2 font-mono text-xs break-all">{JSON.stringify(err.error)}</span>
                  </div>
                )}
                <div className="text-xs text-[#721c24] mt-2 text-right">
                  {new Date(err.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDetailModal;
