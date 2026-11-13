import React, { useState } from 'react';
import { PteMode } from '../../types/exam';
import { TemplateLibrary } from './TemplateLibrary';
import { ClbCalculator } from './ClbCalculator';
import { BookOpen, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

export interface LearningCenterProps {
  currentMode: PteMode;
  onStartMock: () => void;
}

export const LearningCenter: React.FC<LearningCenterProps> = ({
  currentMode,
  onStartMock,
}) => {
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'CLB' | 'EXAM_GUIDE'>('TEMPLATES');

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-pearson-navy to-[#0a3560] rounded-xl text-white p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Open Educational Resource</span>
          </div>
          <h1 className="text-2xl font-black">
            PTE {currentMode === 'PTE_CORE' ? 'Core (Canada PR)' : 'Academic'} Study & Strategy Center
          </h1>
          <p className="text-sm text-gray-300 max-w-xl">
            Master high-scoring speaking templates, email writing frameworks, Pearson cross-skill mechanics, and Canadian Language Benchmark (CLB) target scores.
          </p>
        </div>

        <button
          onClick={onStartMock}
          className="px-6 py-3 bg-pearson-blue hover:bg-[#005a9e] text-white font-bold rounded-lg shadow-md transition-all shrink-0"
        >
          Take Full Mock Exam
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-3 border-b border-gray-300 pb-2">
        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`flex items-center space-x-2 px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'TEMPLATES'
              ? 'border-pearson-blue text-pearson-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Strategy & Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('CLB')}
          className={`flex items-center space-x-2 px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'CLB'
              ? 'border-pearson-blue text-pearson-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>CLB Score Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAM_GUIDE')}
          className={`flex items-center space-x-2 px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'EXAM_GUIDE'
              ? 'border-pearson-blue text-pearson-blue'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>PTE 19 Tasks Blueprint</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'TEMPLATES' && <TemplateLibrary currentMode={currentMode} />}
      {activeTab === 'CLB' && <ClbCalculator />}
      {activeTab === 'EXAM_GUIDE' && (
        <div className="bg-white rounded-lg border border-pearson-borderGray p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
            PTE Exam Structure & Cross-Skill Contribution Breakdown
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded space-y-2">
              <h3 className="font-bold text-blue-900">1. Part 1: Speaking & Writing (50 - 65 Mins)</h3>
              <p>
                • <strong>Read Aloud:</strong> Crucial for BOTH Speaking and Reading scores. Smooth delivery is more important than perfect accents.
              </p>
              <p>
                • <strong>Repeat Sentence:</strong> Huge contributor to Listening and Speaking. Repeat with confidence even if you miss a word.
              </p>
              <p>
                • <strong>Describe Image:</strong> 40 seconds of fluent, structured speaking using our 3-step formula.
              </p>
              <p>
                • <strong>{currentMode === 'PTE_CORE' ? 'Respond to a Situation' : 'Re-tell Lecture'}:</strong>{' '}
                {currentMode === 'PTE_CORE'
                  ? 'Address the 4 situation steps with polite workplace tone.'
                  : 'Capture 5-7 key phrases and deliver with our lecture template.'}
              </p>
              <p>
                • <strong>{currentMode === 'PTE_CORE' ? 'Write an Email' : 'Write Essay'}:</strong>{' '}
                {currentMode === 'PTE_CORE'
                  ? '9 minutes, approx 100 words covering all 3 bullet points.'
                  : '20 minutes, 200–300 words following 4-paragraph structure.'}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded space-y-2">
              <h3 className="font-bold text-emerald-900">2. Part 2: Reading (27 - 37 Mins)</h3>
              <p>
                • <strong>Reading & Writing Fill in the Blanks:</strong> High weight on Reading and Writing. Collocation and grammar awareness are key.
              </p>
              <p>
                • <strong>Re-order Paragraphs:</strong> Scores points for adjacent pairs. Find independent topic sentences first.
              </p>
              <p>
                • <strong>Reading Fill in the Blanks (Drag & Drop):</strong> Focus on parts of speech (nouns, adjectives, verbs).
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-4 rounded space-y-2">
              <h3 className="font-bold text-purple-900">3. Part 3: Listening (22 - 37 Mins)</h3>
              <p>
                • <strong>Write from Dictation:</strong> One of the highest scoring tasks on the entire test. Scores 1 point per word in Listening and Writing!
              </p>
              <p>
                • <strong>Summarize Spoken Text:</strong> 10 minutes, 50–70 words. Double-check spelling and punctuation.
              </p>
              <p>
                • <strong>Highlight Incorrect Words:</strong> Watch out for negative marking—only click when you are confident!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
