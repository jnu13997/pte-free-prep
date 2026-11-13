import React, { useState } from 'react';
import { PteMode, QuestionItem, PteScoreReport, TaskRawScore } from './types/exam';
import { pteCoreMockQuestions } from './data/questionBanks/pteCoreMock';
import { pteAcademicMockQuestions } from './data/questionBanks/pteAcademicMock';
import { ExamRunner } from './components/exam/ExamRunner';
import { ScoreReportView } from './components/scorecard/ScoreReportView';
import { LearningCenter } from './components/learning/LearningCenter';
import { evaluateSessionTask } from './services/scoring/deterministicScorer';
import { computePteScores } from './services/scoring/crossSkillMatrix';
import { GeminiScorerService } from './services/scoring/geminiScorer';
import { UserExamResponse } from './services/exam/examRunnerState';
import { AudioSettingsModal } from './components/layout/AudioSettingsModal';
import {
  Sparkles,
  Key,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Volume2,
} from 'lucide-react';

type AppView = 'HOME' | 'EXAM' | 'SCORE_REPORT' | 'LEARNING' | 'DRILL';

export const App: React.FC = () => {
  const [examMode, setExamMode] = useState<PteMode>('PTE_CORE');
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [activeDrillQuestion, setActiveDrillQuestion] = useState<QuestionItem | null>(null);
  const [scoreReport, setScoreReport] = useState<PteScoreReport | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState(
    GeminiScorerService.getSavedApiKey() || ''
  );
  const [apiKeySavedStatus, setApiKeySavedStatus] = useState(false);

  const activeQuestions =
    examMode === 'PTE_CORE' ? pteCoreMockQuestions : pteAcademicMockQuestions;

  const handleStartExam = () => {
    setScoreReport(null);
    setCurrentView('EXAM');
  };

  const handleStartDrill = (question: QuestionItem) => {
    setActiveDrillQuestion(question);
    setCurrentView('DRILL');
  };

  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);

  const handleFinishExam = async (
    responses: Record<string, UserExamResponse>,
    questions: QuestionItem[]
  ) => {
    setIsEvaluatingAi(true);

    const apiKey = GeminiScorerService.getSavedApiKey();

    const rawScores: TaskRawScore[] = [];

    for (const q of questions) {
      const resp = responses[q.id] || { taskId: q.id };
      let taskScore = evaluateSessionTask(q, resp);

      // If user provided a Gemini API Key and this is a free-form Speaking or Writing task, run multimodal evaluation
      if (
        apiKey &&
        (q.type === 'DESCRIBE_IMAGE' ||
          q.type === 'RESPOND_TO_SITUATION' ||
          q.type === 'RETELL_LECTURE' ||
          q.type === 'WRITE_EMAIL' ||
          q.type === 'WRITE_ESSAY' ||
          q.type === 'SUMMARIZE_WRITTEN_TEXT' ||
          q.type === 'SUMMARIZE_SPOKEN_TEXT')
      ) {
        try {
          const aiResult = await GeminiScorerService.evaluateAudioOrText(
            q.type,
            q.promptText || q.passageText || q.title,
            resp.writtenText || resp.transcript || '',
            resp.audioBlob
          );

          if (aiResult) {
            taskScore = {
              ...taskScore,
              contentScore: aiResult.contentScore,
              fluencyScore: aiResult.fluencyScore,
              pronunciationScore: aiResult.pronunciationScore,
              grammarScore: aiResult.grammarScore,
              vocabularyScore: aiResult.vocabularyScore,
            };
          }
        } catch {
          // graceful fallback to deterministic score
        }
      }

      rawScores.push(taskScore);
    }

    const report = computePteScores(rawScores);
    setScoreReport(report);
    setIsEvaluatingAi(false);
    setCurrentView('SCORE_REPORT');
  };

  const handleSaveApiKey = () => {
    if (geminiApiKeyInput.trim()) {
      GeminiScorerService.saveApiKey(geminiApiKeyInput.trim());
      setApiKeySavedStatus(true);
      setTimeout(() => {
        setApiKeySavedStatus(false);
        setShowSettingsModal(false);
      }, 1000);
    } else {
      GeminiScorerService.removeApiKey();
      setShowSettingsModal(false);
    }
  };

  // If in active full exam
  if (currentView === 'EXAM') {
    return (
      <ExamRunner
        examMode={examMode}
        questions={activeQuestions}
        onFinishExam={handleFinishExam}
        onExit={() => setCurrentView('HOME')}
      />
    );
  }

  // If in single-question drill mode
  if (currentView === 'DRILL' && activeDrillQuestion) {
    return (
      <ExamRunner
        examMode={examMode}
        questions={[activeDrillQuestion]}
        onFinishExam={handleFinishExam}
        onExit={() => setCurrentView('HOME')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      {/* Top Application Navbar */}
      <header className="bg-pearson-navy text-white px-6 py-3 shadow-md select-none sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Mode Selector */}
          <div className="flex items-center space-x-4">
            <div
              onClick={() => setCurrentView('HOME')}
              className="flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="font-bold text-xl tracking-wider text-white">PEARSON</span>
              <span className="text-pearson-blue font-semibold text-xl">VUE</span>
            </div>

            <div className="hidden sm:flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setExamMode('PTE_CORE')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  examMode === 'PTE_CORE'
                    ? 'bg-pearson-blue text-white shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                PTE Core (Canada)
              </button>
              <button
                onClick={() => setExamMode('PTE_ACADEMIC')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  examMode === 'PTE_ACADEMIC'
                    ? 'bg-pearson-blue text-white shadow-xs'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                PTE Academic
              </button>
            </div>
          </div>

          {/* Navigation Links & AI Key */}
          <div className="flex items-center space-x-4 text-sm font-semibold">
            <button
              onClick={() => setCurrentView('HOME')}
              className={`hover:text-pearson-blue transition-colors ${
                currentView === 'HOME' ? 'text-pearson-blue' : 'text-gray-200'
              }`}
            >
              Mock Tests
            </button>
            <button
              onClick={() => setCurrentView('LEARNING')}
              className={`hover:text-pearson-blue transition-colors ${
                currentView === 'LEARNING' ? 'text-pearson-blue' : 'text-gray-200'
              }`}
            >
              Study Hub
            </button>
            <button
              onClick={() => setShowAudioModal(true)}
              className="flex items-center space-x-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-white border border-blue-400/30 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Settings</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Scoring Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-8">
        {isEvaluatingAi ? (
          <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-xl border border-pearson-borderGray shadow-md text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pearson-blue mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">AI Examiner Evaluating Responses</h2>
            <p className="text-xs text-gray-500">
              Performing multimodal acoustic pronunciation and grammatical cohesion assessment...
            </p>
          </div>
        ) : currentView === 'SCORE_REPORT' && scoreReport ? (
          <ScoreReportView
            report={scoreReport}
            onRetake={handleStartExam}
            onPracticeDrill={() => setCurrentView('HOME')}
          />
        ) : currentView === 'LEARNING' ? (
          <LearningCenter currentMode={examMode} onStartMock={handleStartExam} />
        ) : (
          /* HOME View: Mock Exam Launch & Question Type Drills */
          <div className="max-w-6xl mx-auto px-4 space-y-8 select-text">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-pearson-navy to-[#0b3864] text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-3 py-1 rounded-full font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>100% Free • Official Pearson VUE Simulation • Instant AI Scoring</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Free {examMode === 'PTE_CORE' ? 'PTE Core' : 'PTE Academic'} Full Mock Test
                </h1>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Practice under authentic Pearson VUE test-day conditions with preparation countdowns, live audio recording, silence detection, and comprehensive diagnostic scorecards mapped to Canadian CLB levels.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={handleStartExam}
                    className="px-8 py-3.5 bg-pearson-blue hover:bg-[#005a9e] text-white font-bold rounded-lg shadow-md transition-all text-base flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Start Timed Mock Exam</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('LEARNING')}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all text-base border border-white/20 flex items-center space-x-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Templates & Tips</span>
                  </button>
                </div>
              </div>

              {/* Quick Specs Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/15 w-full md:w-72 space-y-3 shrink-0 text-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Exam Specifications</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-gray-300">Format:</span>
                    <span className="font-semibold text-white">Computer-based</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-gray-300">Target Scale:</span>
                    <span className="font-semibold text-white">10 - 90 Points</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-gray-300">IRCC Benchmark:</span>
                    <span className="font-semibold text-white">CLB 4 to CLB 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Scoring:</span>
                    <span className="font-semibold text-emerald-400">Automated AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Type Drill Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Practice by Question Type</h2>
                  <p className="text-xs text-gray-500">
                    Drill individual tasks with immediate AI evaluation and scoring feedback.
                  </p>
                </div>
                <span className="text-xs font-semibold text-pearson-blue">
                  {activeQuestions.length} Questions Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => handleStartDrill(q)}
                    className="bg-white p-5 rounded-lg border border-pearson-borderGray hover:border-pearson-blue hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-pearson-blue bg-blue-50 px-2 py-0.5 rounded">
                          {q.section.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {q.durationSeconds ? `${q.durationSeconds}s` : 'Self-paced'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-pearson-blue transition-colors">
                        {q.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{q.instructions}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-pearson-blue">
                      <span>Practice Question</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Key Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-pearson-navy border-b pb-3">
              <Key className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-lg">AI Examiner Scoring Key (Optional)</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              This platform includes <strong>100% free built-in client-side AI scoring</strong> out of the box. If you wish to activate enhanced multimodal examiner feedback (deep pronunciation, oral fluency, and custom essay remarks), you can enter your free personal Google Gemini API key below.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Gemini API Key:</label>
              <input
                type="password"
                value={geminiApiKeyInput}
                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-pearson-blue font-mono"
              />
              <span className="text-[11px] text-gray-400 block">
                Saved securely in your browser's private localStorage. Never sent to any third-party server.
              </span>
            </div>

            {apiKeySavedStatus && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>API key saved successfully!</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 bg-pearson-blue hover:bg-[#005a9e] text-white rounded text-sm font-semibold"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice & Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500 space-y-2 select-none">
        <p>
          Open Source PTE (PTE Core & Academic) Exam Preparation Simulator. Built for global test-takers preparing for Canadian Immigration (PR) and International Study.
        </p>
        <p className="text-gray-400">
          Not affiliated with or endorsed by Pearson PLC or Pearson VUE. All test item simulations are original educational training materials.
        </p>
      </footer>
    </div>
  );
};

export default App;
