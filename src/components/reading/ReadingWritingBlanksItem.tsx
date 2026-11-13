import React from 'react';

export interface DropdownBlank {
  index: number;
  options: string[];
}

export interface ReadingWritingBlanksItemProps {
  passageSegments: string[]; // e.g. ["Water covers ", " of the Earth, and plays a ", " role."]
  dropdownBlanks: DropdownBlank[];
  selectedValues: Record<number, string>;
  onChange: (blankIndex: number, selectedValue: string) => void;
}

export const ReadingWritingBlanksItem: React.FC<ReadingWritingBlanksItemProps> = ({
  passageSegments,
  dropdownBlanks,
  selectedValues,
  onChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Below is a text with blanks. Click on each blank, a list of choices will appear. Select the appropriate answer choice for each blank.
        </h2>
      </div>

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm leading-loose text-base text-gray-800 select-text">
        {passageSegments.map((segment, idx) => {
          const blank = dropdownBlanks.find((b) => b.index === idx);
          return (
            <React.Fragment key={idx}>
              <span>{segment}</span>
              {blank && (
                <span className="inline-block mx-1.5 align-middle select-none">
                  <select
                    value={selectedValues[blank.index] || ''}
                    onChange={(e) => onChange(blank.index, e.target.value)}
                    className="bg-blue-50 border border-pearson-blue text-pearson-blue font-semibold py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-xs"
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {blank.options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
