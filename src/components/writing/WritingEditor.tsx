import React, { useRef } from 'react';
import { Scissors, Copy, Clipboard } from 'lucide-react';

export interface WritingEditorProps {
  value: string;
  onChange: (val: string) => void;
  minWords?: number;
  maxWords?: number;
  placeholder?: string;
  rows?: number;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({
  value,
  onChange,
  minWords,
  maxWords,
  placeholder = 'Type your response here...',
  rows = 10,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const isOutOfRange =
    (minWords !== undefined && wordCount < minWords) ||
    (maxWords !== undefined && wordCount > maxWords);

  const handleCut = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start === end) return;
    const selected = value.substring(start, end);
    navigator.clipboard?.writeText(selected);
    const newValue = value.substring(0, start) + value.substring(end);
    onChange(newValue);
  };

  const handleCopy = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start === end) return;
    const selected = value.substring(start, end);
    navigator.clipboard?.writeText(selected);
  };

  const handlePaste = async () => {
    if (!textareaRef.current) return;
    try {
      const text = await navigator.clipboard?.readText();
      if (!text) return;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);
    } catch {
      // clipboard access error
    }
  };

  return (
    <div className="w-full border border-pearson-borderGray rounded bg-white shadow-sm overflow-hidden">
      {/* Pearson Toolbar */}
      <div className="bg-[#f0f2f5] border-b border-pearson-borderGray px-3 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCut}
            aria-label="Cut"
            className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 active:bg-gray-200 transition-colors"
          >
            <Scissors className="w-3.5 h-3.5 text-gray-600" />
            <span>Cut</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy"
            className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 active:bg-gray-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-gray-600" />
            <span>Copy</span>
          </button>
          <button
            type="button"
            onClick={handlePaste}
            aria-label="Paste"
            className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 active:bg-gray-200 transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5 text-gray-600" />
            <span>Paste</span>
          </button>
        </div>

        {minWords !== undefined && maxWords !== undefined && (
          <span className="text-xs text-gray-500 font-medium">
            Required Words: {minWords} - {maxWords}
          </span>
        )}
      </div>

      {/* Editor Body */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-4 font-sans text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pearson-blue resize-y leading-relaxed select-text"
      />

      {/* Counter Status Footer */}
      <div className="bg-[#f8f9fa] border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Total Word Count: {wordCount}</span>
          {minWords !== undefined && maxWords !== undefined && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] ${
                wordCount === 0
                  ? 'bg-gray-100 text-gray-500'
                  : isOutOfRange
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {wordCount === 0
                ? 'Not started'
                : isOutOfRange
                ? 'Out of word limit'
                : 'Within word limit'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
