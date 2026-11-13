import { PteMode, QuestionItem, SectionType } from '../../types/exam';

export interface UserExamResponse {
  taskId: string;
  transcript?: string;
  writtenText?: string;
  selectedOptionIds?: string[];
  reorderedIds?: string[];
  dropdownSelections?: Record<number, string>;
  blankValues?: Record<number, string>;
  highlightedIndices?: number[];
  audioBlob?: Blob;
  durationSeconds?: number;
}

export interface ExamSession {
  examMode: PteMode;
  questions: QuestionItem[];
  currentQuestionIndex: number;
  currentSection: SectionType;
  responses: Record<string, UserExamResponse>;
  timeRemainingSeconds: number; // for active pooled section or per-item
  isComplete: boolean;
  startedAt: string;
}

export function createExamSession(examMode: PteMode, questions: QuestionItem[]): ExamSession {
  const filtered = questions.filter(
    (q) => q.examMode === 'BOTH' || q.examMode === examMode
  );

  const initialQuestion = filtered[0];

  return {
    examMode,
    questions: filtered,
    currentQuestionIndex: 0,
    currentSection: initialQuestion ? initialQuestion.section : 'SPEAKING_WRITING',
    responses: {},
    timeRemainingSeconds: initialQuestion?.durationSeconds || 40,
    isComplete: filtered.length === 0,
    startedAt: new Date().toISOString(),
  };
}

export function advanceQuestion(
  session: ExamSession,
  response: UserExamResponse
): ExamSession {
  const updatedResponses = {
    ...session.responses,
    [response.taskId]: response,
  };

  const nextIndex = session.currentQuestionIndex + 1;
  if (nextIndex >= session.questions.length) {
    return {
      ...session,
      responses: updatedResponses,
      isComplete: true,
    };
  }

  const nextQuestion = session.questions[nextIndex];
  const isSameSection = nextQuestion.section === session.currentSection;
  const isPooledSection = nextQuestion.section === 'READING' || nextQuestion.section === 'LISTENING';

  const timeRemainingSeconds =
    isSameSection && isPooledSection
      ? session.timeRemainingSeconds
      : nextQuestion.durationSeconds || (isPooledSection ? 1800 : 40);

  return {
    ...session,
    currentQuestionIndex: nextIndex,
    currentSection: nextQuestion.section,
    responses: updatedResponses,
    timeRemainingSeconds,
  };
}
