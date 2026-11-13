import React, { useState } from 'react';
import { pteStrategyTemplates, PteTemplateItem } from '../../data/templates/pteTemplates';
import { PteMode } from '../../types/exam';
import { Copy, Check, BookOpen } from 'lucide-react';

export interface TemplateLibraryProps {
  currentMode: PteMode;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ currentMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = pteStrategyTemplates.filter((t) => {
    const modeMatches = t.examMode === 'BOTH' || t.examMode === currentMode;
    const catMatches = selectedCategory === 'ALL' || t.category.toUpperCase() === selectedCategory.toUpperCase();
    return modeMatches && catMatches;
  });

  const handleCopy = (item: PteTemplateItem) => {
    navigator.clipboard?.writeText(item.templateContent);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-pearson-blue text-white shadow-xs'
              : 'bg-white border text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Templates ({filteredTemplates.length})
        </button>
        <button
          onClick={() => setSelectedCategory('SPEAKING')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === 'SPEAKING'
              ? 'bg-pearson-blue text-white shadow-xs'
              : 'bg-white border text-gray-700 hover:bg-gray-100'
          }`}
        >
          Speaking Templates
        </button>
        <button
          onClick={() => setSelectedCategory('WRITING')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === 'WRITING'
              ? 'bg-pearson-blue text-white shadow-xs'
              : 'bg-white border text-gray-700 hover:bg-gray-100'
          }`}
        >
          Writing Templates
        </button>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-pearson-borderGray shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pearson-blue">
                  {item.category}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-semibold">
                  Target: {item.targetScore}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>

              <div className="relative">
                <pre className="bg-gray-50 border border-gray-200 p-3.5 rounded text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-text">
                  {item.templateContent}
                </pre>
                <button
                  onClick={() => handleCopy(item)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white border border-gray-300 p-1.5 rounded shadow-xs text-gray-600 transition-colors"
                  title="Copy template to clipboard"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Guidelines */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                  Examiner Tips:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600">
                  {item.guidelines.map((g, gIdx) => (
                    <li key={gIdx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
