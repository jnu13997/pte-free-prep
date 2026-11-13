import React from 'react';
import { WritingEditor } from './WritingEditor';

export interface WriteEssayItemProps {
  essayTopic: string;
  value: string;
  onChange: (val: string) => void;
}

export const WriteEssayItem: React.FC<WriteEssayItemProps> = ({
  essayTopic,
  value,
  onChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            You will have 20 minutes to plan, write and revise an essay about the topic below.
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200–300 words.
          </p>
        </div>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded font-semibold ml-2 whitespace-nowrap">
          PTE Academic Task
        </span>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Essay Topic</span>
        <p className="text-lg text-gray-900 font-semibold leading-relaxed select-text">
          "{essayTopic}"
        </p>
      </div>

      <WritingEditor
        value={value}
        onChange={onChange}
        minWords={200}
        maxWords={300}
        placeholder="Type your essay here..."
        rows={12}
      />
    </div>
  );
};
