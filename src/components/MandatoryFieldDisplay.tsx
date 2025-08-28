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
    return <div>Loading mandatory field analysis...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Mandatory Fields Analysis
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{analysis.totalMandatoryFields}</div>
          <div className="text-sm text-gray-500">Total Mandatory</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{analysis.providedFields.length}</div>
          <div className="text-sm text-gray-500">Fields Filled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{analysis.missingFields.length}</div>
          <div className="text-sm text-gray-500">Missing Values</div>
        </div>
      </div>

      {analysis.missingFields.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
