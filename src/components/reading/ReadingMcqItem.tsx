import React from 'react';

export interface McqOption {
  id: string;
  text: string;
}

export interface ReadingMcqItemProps {
  passageText: string;
  questionText: string;
  options: McqOption[];
  isMultiple: boolean;
  selectedOptionIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export const ReadingMcqItem: React.FC<ReadingMcqItemProps> = ({
  passageText,
  questionText,
  options,
  isMultiple,
  selectedOptionIds,
  onChange,
}) => {
  const handleToggle = (optionId: string) => {
    if (isMultiple) {
      if (selectedOptionIds.includes(optionId)) {
        onChange(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        onChange([...selectedOptionIds, optionId]);
      }
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          {isMultiple
            ? 'Read the text and answer the question by selecting all the correct responses. More than one response is correct.'
            : 'Read the text and answer the multiple-choice question by selecting the correct response. Only one response is correct.'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Passage */}
        <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm max-h-[420px] overflow-y-auto">
          <p className="text-base text-gray-800 leading-relaxed font-serif select-text">
            {passageText}
          </p>
        </div>

        {/* Right: Question & Options */}
        <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{questionText}</h3>

          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOptionIds.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleToggle(opt.id)}
                  className={`p-3.5 rounded border cursor-pointer flex items-start space-x-3 transition-colors ${
                    isSelected
                      ? 'border-pearson-blue bg-blue-50/70 text-blue-900'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <input
                    type={isMultiple ? 'checkbox' : 'radio'}
                    checked={isSelected}
                    onChange={() => handleToggle(opt.id)}
                    className="mt-1 h-4 w-4 text-pearson-blue focus:ring-blue-400 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
