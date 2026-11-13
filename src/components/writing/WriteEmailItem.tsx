import React from 'react';
import { WritingEditor } from './WritingEditor';

export interface WriteEmailItemProps {
  scenarioText: string;
  bulletPoints: string[];
  recipientContext: string;
  value: string;
  onChange: (val: string) => void;
}

export const WriteEmailItem: React.FC<WriteEmailItemProps> = ({
  scenarioText,
  bulletPoints,
  recipientContext,
  value,
  onChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">
            Read the description of a situation below. Write an email to address the situation. You have 9 minutes.
          </h2>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold ml-2 whitespace-nowrap">
            PTE Core Task
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          You should write about 100 words (between 80 and 120 words). Make sure you address all three bullet points.
        </p>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Situation Prompt</div>
        <p className="text-base text-gray-800 leading-relaxed font-medium">{scenarioText}</p>

        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <span className="text-xs font-bold text-gray-700 block mb-2">In your email to {recipientContext}:</span>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <WritingEditor
        value={value}
        onChange={onChange}
        minWords={80}
        maxWords={120}
        placeholder="Dear [Name/Sir or Madam],&#10;&#10;I am writing to..."
        rows={8}
      />
    </div>
  );
};
