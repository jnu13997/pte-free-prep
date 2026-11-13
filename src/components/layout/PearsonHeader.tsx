import React from 'react';
import { Clock } from 'lucide-react';

export interface PearsonHeaderProps {
  examMode: 'PTE_CORE' | 'PTE_ACADEMIC';
  currentSection: string;
  questionIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  onExit?: () => void;
}

export const PearsonHeader: React.FC<PearsonHeaderProps> = ({
  examMode,
  currentSection,
  questionIndex,
  totalQuestions,
  timeRemainingSeconds,
  onExit,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds <= 300; // Under 5 mins warning

  return (
    <header className="bg-pearson-navy text-white px-4 py-2 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Branding & Mode */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-lg tracking-wider text-white">PEARSON</span>
            <span className="text-pearson-blue font-semibold text-lg">VUE</span>
          </div>
          <span className="text-gray-400 text-sm">|</span>
          <span className="bg-pearson-blue/20 text-blue-200 border border-blue-400/30 text-xs px-2 py-0.5 rounded font-medium">
            {examMode === 'PTE_CORE' ? 'PTE Core' : 'PTE Academic'}
          </span>
        </div>

        {/* Center: Current Task Info */}
        <div className="text-center hidden sm:block">
          <div className="text-xs uppercase tracking-wider text-gray-300 font-semibold">{currentSection}</div>
          <div className="text-sm font-bold text-white">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Right: Timer & Exit */}
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-mono font-bold transition-colors ${
              isLowTime ? 'bg-red-900/60 text-red-300 border border-red-500/50 animate-pulse' : 'bg-black/30 text-gray-100'
            }`}
          >
            <Clock className="w-4 h-4 text-gray-300" />
            <span>Time Remaining: {formatTime(timeRemainingSeconds)}</span>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="text-xs text-gray-300 hover:text-white underline"
            >
              Exit Test
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
