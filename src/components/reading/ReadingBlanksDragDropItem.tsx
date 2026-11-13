import React, { useState } from 'react';

export interface TargetGap {
  index: number;
}

export interface ReadingBlanksDragDropItemProps {
  passageSegments: string[];
  wordBank: string[];
  assignedWords: Record<number, string>;
  onAssign: (gapIndex: number, word: string) => void;
  onRemove: (gapIndex: number) => void;
}

export const ReadingBlanksDragDropItem: React.FC<ReadingBlanksDragDropItemProps> = ({
  passageSegments,
  wordBank,
  assignedWords,
  onAssign,
  onRemove,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Available words in bank (words not yet assigned)
  const assignedValues = Object.values(assignedWords);
  const availableBank = wordBank.filter((w) => !assignedValues.includes(w));

  const handleGapClick = (gapIndex: number) => {
    if (assignedWords[gapIndex]) {
      // Remove word back to bank
      onRemove(gapIndex);
    } else if (selectedWord) {
      // Place selected word
      onAssign(gapIndex, selectedWord);
      setSelectedWord(null);
    }
  };

  const handleWordSelect = (word: string) => {
    setSelectedWord((prev) => (prev === word ? null : word));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          In the text below some words are missing. Drag words from the box below to the appropriate place in the text, or click a word then click a gap.
        </h2>
      </div>

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm leading-loose text-base text-gray-800">
        {passageSegments.map((segment, idx) => {
          const isGap = idx < passageSegments.length - 1;
          const assigned = assignedWords[idx];

          return (
            <React.Fragment key={idx}>
              <span>{segment}</span>
              {isGap && (
                <button
                  type="button"
                  onClick={() => handleGapClick(idx)}
                  className={`inline-block mx-1.5 px-3 py-1 min-w-[90px] border-2 border-dashed rounded text-sm font-semibold transition-all align-middle select-none ${
                    assigned
                      ? 'border-pearson-blue bg-blue-50 text-blue-900 shadow-xs'
                      : selectedWord
                      ? 'border-blue-400 bg-blue-50/50 hover:bg-blue-100 text-gray-400 animate-pulse'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  {assigned || (selectedWord ? 'Click to drop' : '[ Blank ]')}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Word Bank */}
      <div className="bg-white p-5 rounded border border-pearson-borderGray shadow-xs">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Word Bank (Click a word to select, then click a blank)
        </div>
        <div className="flex flex-wrap gap-2.5">
          {availableBank.map((word, wIdx) => (
            <button
              key={wIdx}
              type="button"
              onClick={() => handleWordSelect(word)}
              className={`px-3.5 py-1.5 rounded border text-sm font-semibold cursor-pointer transition-all shadow-xs ${
                selectedWord === word
                  ? 'border-pearson-blue bg-pearson-blue text-white shadow-md'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800'
              }`}
            >
              {word}
            </button>
          ))}
          {availableBank.length === 0 && (
            <span className="text-xs text-gray-400 italic">All words assigned to blanks</span>
          )}
        </div>
      </div>
    </div>
  );
};
