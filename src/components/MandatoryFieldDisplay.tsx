import React from 'react';
import { MandatoryFieldManager } from '@/lib/mandatoryFieldManager';
import { TaskDetails } from '@/types';

interface MandatoryFieldDisplayProps {
  taskDetails: TaskDetails;
}

export const MandatoryFieldDisplay: React.FC<MandatoryFieldDisplayProps> = ({ taskDetails }) => {
  const [analysis, setAnalysis] = React.useState<any>(null);

  React.useEffect(() => {
    if (taskDetails) {
      const fieldAnalysis = MandatoryFieldManager.analyzeMandatoryFields(taskDetails);
      setAnalysis(fieldAnalysis);
    }
  }, [taskDetails]);

  if (!analysis) {
    return <div>Loading field analysis...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        📝 Task Fields Analysis
      </h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{analysis.totalMandatoryFields}</div>
          <div className="text-sm text-gray-500">Required Fields</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{analysis.optionalEditableFields.length}</div>
          <div className="text-sm text-gray-500">Optional Fields</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{analysis.providedFields.length}</div>
          <div className="text-sm text-gray-500">Fields Filled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{analysis.missingFields.length}</div>
          <div className="text-sm text-gray-500">Need Input</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Enhanced Field Support</h4>
            <div className="mt-1 text-sm text-blue-700">
              Smart Order Closure now shows ALL editable fields for tasks, including Network Build Form fields 
              like Rack Size, Device Mount Type, Device CLLI ARM, and Engineering Solution fields 
              like Build Types, CCEA, and Implementation Team.
            </div>
          </div>
        </div>
      </div>

      {analysis.missingFields.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Missing Mandatory Fields
              </h3>
              <div className="mt-1 text-sm text-red-700">
                This task requires user input for {analysis.missingFields.length} mandatory field{analysis.missingFields.length > 1 ? 's' : ''} before it can be completed automatically.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Field Details:</h4>
        {[...analysis.providedFields, ...analysis.missingFields].map((field: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{field.fieldLabel}</span>
              <span className="text-sm text-gray-500 ml-2">({field.fieldName})</span>
            </div>
            <div className="flex items-center">
              {field.hasValue ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Filled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ⚠ Missing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {analysis.missingFields.length > 0 && (
        <div className="mt-4">
          <button
            onClick={async () => {
              const canProceed = await MandatoryFieldManager.checkMissingValues(taskDetails);
              if (canProceed) {
                const updatedAnalysis = MandatoryFieldManager.analyzeMandatoryFields(taskDetails);
                setAnalysis(updatedAnalysis);
              }
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fill Missing Fields
          </button>
        </div>
      )}
    </div>
  );
};
