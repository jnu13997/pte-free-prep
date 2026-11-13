import React from 'react';
import { WritingEditor } from './WritingEditor';

export interface SummarizeWrittenTextItemProps {
  passageText: string;
  value: string;
  onChange: (val: string) => void;
}

export const SummarizeWrittenTextItem: React.FC<SummarizeWrittenTextItemProps> = ({
  passageText,
  value,
  onChange,
}) => {
  // Check single sentence rule
  const clean = value.trim();
  const sentenceTerminators = (clean.match(/[.!?](\s+|$)/g) || []).length;
  const isSingleSentence = sentenceTerminators <= 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Read the passage below and summarize it using one sentence. You have 10 minutes to finish this task.
        </h2>
        <p className="text-xs text-gray-500">
          Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage (between 5 and 75 words in a SINGLE sentence).
        </p>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm max-h-64 overflow-y-auto">
        <p className="text-base text-gray-800 leading-relaxed font-serif select-text">
          {passageText}
        </p>
      </div>

      <div className="space-y-2">
        <WritingEditor
          value={value}
          onChange={onChange}
          minWords={5}
          maxWords={75}
          placeholder="Write your one-sentence summary here..."
          rows={5}
        />

        {!isSingleSentence && clean.length > 0 && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
            Warning: In PTE Summarize Written Text, you must write only ONE single sentence. Multiple full stops detected.
          </div>
        )}
      </div>
    </div>
  );
};
