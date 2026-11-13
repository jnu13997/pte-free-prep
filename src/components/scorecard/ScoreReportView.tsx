import React from 'react';
import { PteScoreReport } from '../../types/exam';
import { mapPteToClb } from '../../services/scoring/clbMapping';
import { ClbBadge } from './ClbBadge';
import { Award, RotateCcw, BookOpen, Printer } from 'lucide-react';

export interface ScoreReportViewProps {
  report: PteScoreReport;
  onRetake: () => void;
  onPracticeDrill: () => void;
}

export const ScoreReportView: React.FC<ScoreReportViewProps> = ({
  report,
  onRetake,
  onPracticeDrill,
}) => {
  const clbSpeaking = mapPteToClb(report.speaking, 'speaking');
  const clbWriting = mapPteToClb(report.writing, 'writing');
  const clbReading = mapPteToClb(report.reading, 'reading');
  const clbListening = mapPteToClb(report.listening, 'listening');

  const communicativeSkills = [
    { name: 'Listening', score: report.listening, clb: clbListening },
    { name: 'Reading', score: report.reading, clb: clbReading },
    { name: 'Speaking', score: report.speaking, clb: clbSpeaking },
    { name: 'Writing', score: report.writing, clb: clbWriting },
  ];

  const enablingSkillsList = [
    { name: 'Grammar', score: report.enablingSkills.grammar },
    { name: 'Oral Fluency', score: report.enablingSkills.oralFluency },
    { name: 'Pronunciation', score: report.enablingSkills.pronunciation },
    { name: 'Spelling', score: report.enablingSkills.spelling },
    { name: 'Vocabulary', score: report.enablingSkills.vocabulary },
    { name: 'Written Discourse', score: report.enablingSkills.writtenDiscourse },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 select-text">
      {/* Official Top Banner */}
      <div className="bg-white rounded-lg border border-pearson-borderGray shadow-sm overflow-hidden">
        <div className="bg-pearson-navy text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="font-bold tracking-wider text-xl">PEARSON</span>
              <span className="text-pearson-blue font-semibold text-xl">TEST OF ENGLISH</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Diagnostic Test Score Report</h1>
            <p className="text-xs text-gray-300">
              Completed on: {new Date(report.completedAt).toLocaleDateString()} at {new Date(report.completedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Overall Score Circle */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-xs px-6 py-4 rounded-xl border border-white/20">
            <span className="text-xs uppercase tracking-wider text-gray-200 font-semibold">Overall Score</span>
            <span className="text-5xl font-black text-white">{report.overall}</span>
            <span className="text-[11px] text-gray-300 mt-1">Scale 10 - 90</span>
          </div>
        </div>

        {/* Canadian CLB Summary Section */}
        <div className="bg-[#f0f7fd] border-b border-pearson-borderGray px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-sm text-pearson-navy font-semibold">
            <Award className="w-5 h-5 text-pearson-blue" />
            <span>Canadian Language Benchmark (CLB) Equivalencies:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ClbBadge skill="Listening" clbLevel={clbListening} />
            <ClbBadge skill="Reading" clbLevel={clbReading} />
            <ClbBadge skill="Speaking" clbLevel={clbSpeaking} />
            <ClbBadge skill="Writing" clbLevel={clbWriting} />
          </div>
        </div>

        {/* Communicative Skills Breakdown */}
        <div className="p-6 space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b pb-2">Communicative Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicativeSkills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>{skill.name}</span>
                  <div className="space-x-2">
                    <span className="text-xs font-normal text-gray-500">(CLB {skill.clb})</span>
                    <span className="text-pearson-blue font-bold">{skill.score} / 90</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-pearson-blue rounded-full transition-all duration-500"
                    style={{ width: `${(skill.score / 90) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Enabling Skills Breakdown */}
          <h2 className="text-base font-bold text-gray-900 border-b pb-2 pt-4">Enabling Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {enablingSkillsList.map((skill) => (
              <div key={skill.name} className="bg-gray-50 p-3.5 rounded border border-gray-200 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span>{skill.name}</span>
                  <span className="text-gray-900 font-bold">{skill.score}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(skill.score / 90) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={onPracticeDrill}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-pearson-blue text-pearson-blue hover:bg-blue-50 rounded text-sm font-bold shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Specific Skills</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center space-x-2 px-6 py-2.5 bg-pearson-blue hover:bg-[#005a9e] text-white rounded text-sm font-bold shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Mock Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
