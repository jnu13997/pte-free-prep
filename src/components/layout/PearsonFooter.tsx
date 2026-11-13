import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export interface PearsonFooterProps {
  onNext: () => void;
  onPrevious?: () => void;
  isSubmitting?: boolean;
  nextLabel?: string;
  disableNext?: boolean;
  disablePrevious?: boolean;
}

export const PearsonFooter: React.FC<PearsonFooterProps> = ({
  onNext,
  onPrevious,
  isSubmitting = false,
  nextLabel = 'Next',
  disableNext = false,
  disablePrevious = false,
}) => {
  return (
    <footer className="bg-white border-t border-pearson-borderGray px-6 py-3 select-none flex items-center justify-between">
      <div>
        {onPrevious && (
          <button
            onClick={onPrevious}
            disabled={disablePrevious || isSubmitting}
            className="flex items-center space-x-1.5 px-5 py-2 border border-pearson-borderGray text-gray-700 font-medium rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onNext}
          disabled={disableNext || isSubmitting}
          className="flex items-center space-x-1.5 px-6 py-2 bg-pearson-blue hover:bg-[#005a9e] text-white font-semibold rounded shadow-sm disabled:opacity-40 transition-colors"
        >
          <span>{isSubmitting ? 'Evaluating...' : nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
