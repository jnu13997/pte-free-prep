import React, { useState, useEffect } from 'react';
import { PteMode, QuestionItem, SectionType } from '../../types/exam';
import { ExamSession, createExamSession, advanceQuestion, UserExamResponse } from '../../services/exam/examRunnerState';
import { PearsonHeader } from '../layout/PearsonHeader';
import { PearsonFooter } from '../layout/PearsonFooter';

// Speaking Components
import { ReadAloudItem } from '../speaking/ReadAloudItem';
import { RepeatSentenceItem } from '../speaking/RepeatSentenceItem';
import { DescribeImageItem } from '../speaking/DescribeImageItem';
import { RespondToSituationItem } from '../speaking/RespondToSituationItem';
import { RetellLectureItem } from '../speaking/RetellLectureItem';
import { AnswerShortQuestionItem } from '../speaking/AnswerShortQuestionItem';

// Writing Components
import { SummarizeWrittenTextItem } from '../writing/SummarizeWrittenTextItem';
import { WriteEmailItem } from '../writing/WriteEmailItem';
import { WriteEssayItem } from '../writing/WriteEssayItem';

// Reading Components
import { ReadingWritingBlanksItem } from '../reading/ReadingWritingBlanksItem';
import { ReorderParagraphsItem } from '../reading/ReorderParagraphsItem';
import { ReadingBlanksDragDropItem } from '../reading/ReadingBlanksDragDropItem';
import { ReadingMcqItem } from '../reading/ReadingMcqItem';

// Listening Components
import { SummarizeSpokenTextItem } from '../listening/SummarizeSpokenTextItem';
import { WriteFromDictationItem } from '../listening/WriteFromDictationItem';
import { HighlightIncorrectWordsItem } from '../listening/HighlightIncorrectWordsItem';
import { SelectMissingWordItem } from '../listening/SelectMissingWordItem';
import { ListeningBlanksItem } from '../listening/ListeningBlanksItem';

export interface ExamRunnerProps {
  examMode: PteMode;
  questions: QuestionItem[];
  onFinishExam: (responses: Record<string, UserExamResponse>, questions: QuestionItem[]) => void;
  onExit: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  examMode,
  questions,
  onFinishExam,
  onExit,
}) => {
  const [session, setSession] = useState<ExamSession>(() => createExamSession(examMode, questions));
  const [currentResponse, setCurrentResponse] = useState<UserExamResponse>({ taskId: '' });
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQ = session.questions[session.currentQuestionIndex];

  // Reset or load response for current question
  useEffect(() => {
    if (currentQ) {
      setCurrentResponse(session.responses[currentQ.id] || { taskId: currentQ.id });
    }
  }, [session.currentQuestionIndex]);

  // Section / Item Timer countdown
  useEffect(() => {
    if (session.isComplete) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (prev.timeRemainingSeconds <= 1) {
          // Auto advance when timer runs out
          return advanceQuestion(prev, currentResponse);
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.currentQuestionIndex, session.isComplete, currentResponse]);

  // Check if exam completed
  useEffect(() => {
    if (session.isComplete) {
      onFinishExam(session.responses, session.questions);
    }
  }, [session.isComplete]);

  if (!currentQ || session.isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pearson-blue mx-auto" />
          <h2 className="text-lg font-bold text-gray-800">Finalizing test responses and generating score report...</h2>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    const updated = advanceQuestion(session, currentResponse);
    setSession(updated);
  };

  const sectionNameMap: Record<SectionType, string> = {
    SPEAKING_WRITING: 'Part 1: Speaking & Writing',
    READING: 'Part 2: Reading',
    LISTENING: 'Part 3: Listening',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      <PearsonHeader
        examMode={session.examMode}
        currentSection={sectionNameMap[session.currentSection]}
        questionIndex={session.currentQuestionIndex}
        totalQuestions={session.questions.length}
        timeRemainingSeconds={session.timeRemainingSeconds}
        onExit={() => setShowExitConfirm(true)}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Speaking Tasks */}
        {currentQ.type === 'PERSONAL_INTRODUCTION' && (
          <ReadAloudItem
            passageText={currentQ.promptText || ''}
            prepTimeSeconds={currentQ.prepTimeSeconds || 25}
            recordingSeconds={currentQ.durationSeconds || 30}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'READ_ALOUD' && (
          <ReadAloudItem
            passageText={currentQ.promptText || ''}
            prepTimeSeconds={currentQ.prepTimeSeconds || 35}
            recordingSeconds={currentQ.durationSeconds || 40}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'REPEAT_SENTENCE' && (
          <RepeatSentenceItem
            sentenceText={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            recordingSeconds={currentQ.durationSeconds || 15}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'DESCRIBE_IMAGE' && (
          <DescribeImageItem
            imageUrl={currentQ.imageUrl}
            chartDescription={currentQ.chartDescription}
            prepTimeSeconds={currentQ.prepTimeSeconds || 25}
            recordingSeconds={currentQ.durationSeconds || 40}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'RESPOND_TO_SITUATION' && (
          <RespondToSituationItem
            situationText={currentQ.passageText || ''}
            rolePrompt={currentQ.promptText || ''}
            prepTimeSeconds={currentQ.prepTimeSeconds || 25}
            recordingSeconds={currentQ.durationSeconds || 40}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'RETELL_LECTURE' && (
          <RetellLectureItem
            lectureText={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            imageUrl={currentQ.imageUrl}
            prepTimeSeconds={currentQ.prepTimeSeconds || 10}
            recordingSeconds={currentQ.durationSeconds || 40}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {currentQ.type === 'ANSWER_SHORT_QUESTION' && (
          <AnswerShortQuestionItem
            questionText={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            recordingSeconds={currentQ.durationSeconds || 10}
            onRecordingComplete={(blob, transcript, duration) =>
              setCurrentResponse({ taskId: currentQ.id, audioBlob: blob, transcript, durationSeconds: duration })
            }
          />
        )}

        {/* Writing Tasks */}
        {currentQ.type === 'SUMMARIZE_WRITTEN_TEXT' && (
          <SummarizeWrittenTextItem
            passageText={currentQ.passageText || ''}
            value={currentResponse.writtenText || ''}
            onChange={(val) => setCurrentResponse({ taskId: currentQ.id, writtenText: val })}
          />
        )}

        {currentQ.type === 'WRITE_EMAIL' && (
          <WriteEmailItem
            scenarioText={currentQ.passageText || ''}
            bulletPoints={currentQ.options?.map((o) => o.text) || []}
            recipientContext="the property manager"
            value={currentResponse.writtenText || ''}
            onChange={(val) => setCurrentResponse({ taskId: currentQ.id, writtenText: val })}
          />
        )}

        {currentQ.type === 'WRITE_ESSAY' && (
          <WriteEssayItem
            essayTopic={currentQ.promptText || ''}
            value={currentResponse.writtenText || ''}
            onChange={(val) => setCurrentResponse({ taskId: currentQ.id, writtenText: val })}
          />
        )}

        {/* Reading Tasks */}
        {currentQ.type === 'READING_WRITING_FILL_IN_BLANKS' && (
          <ReadingWritingBlanksItem
            passageSegments={(currentQ.passageText || '').split('___')}
            dropdownBlanks={currentQ.dropdownBlanks || []}
            selectedValues={currentResponse.dropdownSelections || {}}
            onChange={(idx, val) =>
              setCurrentResponse((prev) => ({
                ...prev,
                taskId: currentQ.id,
                dropdownSelections: { ...prev.dropdownSelections, [idx]: val },
              }))
            }
          />
        )}

        {currentQ.type === 'REORDER_PARAGRAPHS' && (
          <ReorderParagraphsItem
            paragraphs={currentQ.scrambledParagraphs || []}
            onChange={(orderedIds) =>
              setCurrentResponse({ taskId: currentQ.id, reorderedIds: orderedIds })
            }
          />
        )}

        {currentQ.type === 'READING_FILL_IN_BLANKS' && (
          <ReadingBlanksDragDropItem
            passageSegments={(currentQ.passageText || '').split('___')}
            wordBank={currentQ.dragDropWords || []}
            assignedWords={currentResponse.blankValues || {}}
            onAssign={(idx, word) =>
              setCurrentResponse((prev) => ({
                ...prev,
                taskId: currentQ.id,
                blankValues: { ...prev.blankValues, [idx]: word },
              }))
            }
            onRemove={(idx) =>
              setCurrentResponse((prev) => {
                const nextBlanks = { ...(prev.blankValues || {}) };
                delete nextBlanks[idx];
                return { ...prev, taskId: currentQ.id, blankValues: nextBlanks };
              })
            }
          />
        )}

        {currentQ.type === 'MULTIPLE_CHOICE_SINGLE_READING' && (
          <ReadingMcqItem
            passageText={currentQ.passageText || ''}
            questionText={currentQ.promptText || ''}
            options={currentQ.options || []}
            isMultiple={false}
            selectedOptionIds={currentResponse.selectedOptionIds || []}
            onChange={(ids) => setCurrentResponse({ taskId: currentQ.id, selectedOptionIds: ids })}
          />
        )}

        {currentQ.type === 'MULTIPLE_CHOICE_MULTIPLE_READING' && (
          <ReadingMcqItem
            passageText={currentQ.passageText || ''}
            questionText={currentQ.promptText || ''}
            options={currentQ.options || []}
            isMultiple={true}
            selectedOptionIds={currentResponse.selectedOptionIds || []}
            onChange={(ids) => setCurrentResponse({ taskId: currentQ.id, selectedOptionIds: ids })}
          />
        )}

        {/* Listening Tasks */}
        {currentQ.type === 'SUMMARIZE_SPOKEN_TEXT' && (
          <SummarizeSpokenTextItem
            spokenPromptText={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            value={currentResponse.writtenText || ''}
            onChange={(val) => setCurrentResponse({ taskId: currentQ.id, writtenText: val })}
          />
        )}

        {currentQ.type === 'WRITE_FROM_DICTATION' && (
          <WriteFromDictationItem
            sentencePrompt={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            value={currentResponse.writtenText || ''}
            onChange={(val) => setCurrentResponse({ taskId: currentQ.id, writtenText: val })}
          />
        )}

        {currentQ.type === 'HIGHLIGHT_INCORRECT_WORDS' && (
          <HighlightIncorrectWordsItem
            transcript={currentQ.transcript || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            highlightedIndices={currentResponse.highlightedIndices || []}
            onChange={(indices) =>
              setCurrentResponse({ taskId: currentQ.id, highlightedIndices: indices })
            }
          />
        )}

        {currentQ.type === 'SELECT_MISSING_WORD' && (
          <SelectMissingWordItem
            sentenceWithBeep={currentQ.promptText || ''}
            audioPromptUrl={currentQ.promptAudioUrl}
            options={currentQ.options || []}
            selectedOptionId={currentResponse.selectedOptionIds?.[0] || null}
            onChange={(id) => setCurrentResponse({ taskId: currentQ.id, selectedOptionIds: [id] })}
          />
        )}

        {currentQ.type === 'LISTENING_FILL_IN_BLANKS' && (
          <ListeningBlanksItem
            passageSegments={(currentQ.passageText || '').split('___')}
            audioPromptUrl={currentQ.promptAudioUrl}
            transcriptForFallback={currentQ.transcript}
            blankValues={currentResponse.blankValues || {}}
            onChange={(idx, val) =>
              setCurrentResponse((prev) => ({
                ...prev,
                taskId: currentQ.id,
                blankValues: { ...prev.blankValues, [idx]: val },
              }))
            }
          />
        )}
      </main>

      <PearsonFooter
        onNext={handleNext}
        nextLabel={session.currentQuestionIndex === session.questions.length - 1 ? 'Submit Test' : 'Next'}
      />

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Are you sure you want to exit?</h3>
            <p className="text-sm text-gray-600">
              Exiting now will end your practice session and calculate your diagnostic score based on questions completed so far.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 text-gray-700"
              >
                Resume Test
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
