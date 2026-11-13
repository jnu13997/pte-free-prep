import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

export interface Paragraph {
  id: string;
  text: string;
}

export interface ReorderParagraphsItemProps {
  paragraphs: Paragraph[];
  onChange: (orderedIds: string[]) => void;
}

export const ReorderParagraphsItem: React.FC<ReorderParagraphsItemProps> = ({
  paragraphs,
  onChange,
}) => {
  const [sourceList, setSourceList] = useState<Paragraph[]>(paragraphs);
  const [targetList, setTargetList] = useState<Paragraph[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const moveRight = () => {
    if (!selectedSourceId) return;
    const item = sourceList.find((p) => p.id === selectedSourceId);
    if (!item) return;

    const newSource = sourceList.filter((p) => p.id !== selectedSourceId);
    const newTarget = [...targetList, item];
    setSourceList(newSource);
    setTargetList(newTarget);
    setSelectedSourceId(null);
    onChange(newTarget.map((p) => p.id));
  };

  const moveLeft = () => {
    if (!selectedTargetId) return;
    const item = targetList.find((p) => p.id === selectedTargetId);
    if (!item) return;

    const newTarget = targetList.filter((p) => p.id !== selectedTargetId);
    const newSource = [...sourceList, item];
    setTargetList(newTarget);
    setSourceList(newSource);
    setSelectedTargetId(null);
    onChange(newTarget.map((p) => p.id));
  };

  const moveUp = () => {
    if (!selectedTargetId) return;
    const index = targetList.findIndex((p) => p.id === selectedTargetId);
    if (index <= 0) return;

    const newTarget = [...targetList];
    const temp = newTarget[index - 1];
    newTarget[index - 1] = newTarget[index];
    newTarget[index] = temp;
    setTargetList(newTarget);
    onChange(newTarget.map((p) => p.id));
  };

  const moveDown = () => {
    if (!selectedTargetId) return;
    const index = targetList.findIndex((p) => p.id === selectedTargetId);
    if (index < 0 || index >= targetList.length - 1) return;

    const newTarget = [...targetList];
    const temp = newTarget[index + 1];
    newTarget[index + 1] = newTarget[index];
    newTarget[index] = temp;
    setTargetList(newTarget);
    onChange(newTarget.map((p) => p.id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          The text boxes in the left panel have been placed in a random order. Restore the original order by dragging text boxes to the target panel or using the arrow buttons.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,56px,1fr,48px] gap-3 items-center">
        {/* Source List */}
        <div className="border border-pearson-borderGray rounded bg-white p-3 min-h-[300px] flex flex-col shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide border-b pb-2 mb-2">
            Source ({sourceList.length})
          </span>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {sourceList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedSourceId(item.id);
                  setSelectedTargetId(null);
                }}
                className={`p-3 text-sm rounded border cursor-pointer transition-all ${
                  selectedSourceId === item.id
                    ? 'border-pearson-blue bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                {item.text}
              </div>
            ))}
            {sourceList.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                All paragraphs moved to target
              </div>
            )}
          </div>
        </div>

        {/* Center Transfer Buttons */}
        <div className="flex md:flex-col items-center justify-center space-x-2 md:space-x-0 md:space-y-3">
          <button
            type="button"
            onClick={moveRight}
            disabled={!selectedSourceId}
            aria-label="Move Right"
            className="p-2.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 shadow-xs transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={moveLeft}
            disabled={!selectedTargetId}
            aria-label="Move Left"
            className="p-2.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Target Ordered List */}
        <div className="border border-pearson-borderGray rounded bg-white p-3 min-h-[300px] flex flex-col shadow-xs">
          <span className="text-xs font-bold text-pearson-blue uppercase tracking-wide border-b pb-2 mb-2">
            Target ({targetList.length})
          </span>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {targetList.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedTargetId(item.id);
                  setSelectedSourceId(null);
                }}
                className={`p-3 text-sm rounded border cursor-pointer transition-all flex items-start space-x-2 ${
                  selectedTargetId === item.id
                    ? 'border-pearson-blue bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                }`}
              >
                <span className="font-bold text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
                <span className="flex-1 leading-snug">{item.text}</span>
              </div>
            ))}
            {targetList.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                Select a paragraph and click &gt; to place here
              </div>
            )}
          </div>
        </div>

        {/* Up / Down Controls for Target */}
        <div className="flex md:flex-col items-center justify-center space-x-2 md:space-x-0 md:space-y-3">
          <button
            type="button"
            onClick={moveUp}
            disabled={!selectedTargetId}
            aria-label="Move Up"
            className="p-2.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 shadow-xs transition-colors"
          >
            <ArrowUp className="w-4 h-4 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={moveDown}
            disabled={!selectedTargetId}
            aria-label="Move Down"
            className="p-2.5 rounded bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-30 shadow-xs transition-colors"
          >
            <ArrowDown className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
