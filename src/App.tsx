import React from 'react';
import { PearsonHeader } from './components/layout/PearsonHeader';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      <PearsonHeader
        examMode="PTE_CORE"
        currentSection="Speaking & Writing"
        questionIndex={0}
        totalQuestions={1}
        timeRemainingSeconds={3600}
      />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pearson-navy mb-2">PTE Free Mock Test & AI Learning</h1>
          <p className="text-gray-600">Official Exam Simulation & Immediate Diagnostic Scoring</p>
        </div>
      </main>
    </div>
  );
};

export default App;
