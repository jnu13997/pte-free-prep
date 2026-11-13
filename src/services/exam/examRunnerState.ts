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

/**
 * Calculates realistic, comfortable allocated time for a question so candidates
 * are NEVER cut off mid-speech during prep countdowns or speaking recordings.
 */
export function calculateAllocatedTimeForQuestion(q?: QuestionItem): number {
  if (!q) return 60;

  switch (q.type) {
    case 'READ_ALOUD':
      // 35s prep + 40s recording + 15s comfort buffer = 90s
      return (q.prepTimeSeconds ?? 35) + (q.durationSeconds ?? 40) + 15;
    case 'REPEAT_SENTENCE':
      // ~8s audio playback + 15s recording + 12s buffer = 35s
      return (q.durationSeconds ?? 15) + 20;
    case 'DESCRIBE_IMAGE':
      // 25s prep + 40s recording + 15s buffer = 80s
      return (q.prepTimeSeconds ?? 25) + (q.durationSeconds ?? 40) + 15;
    case 'RESPOND_TO_SITUATION':
      // ~10s audio prompt + 25s prep + 40s recording + 15s buffer = 90s
      return (q.prepTimeSeconds ?? 25) + (q.durationSeconds ?? 40) + 25;
    case 'RETELL_LECTURE':
      // ~20s lecture audio + 10s prep + 40s recording + 15s buffer = 85s
      return (q.prepTimeSeconds ?? 10) + (q.durationSeconds ?? 40) + 35;
    case 'ANSWER_SHORT_QUESTION':
      // ~6s audio question + 10s recording + 10s buffer = 26s
      return (q.durationSeconds ?? 10) + 16;
    case 'PERSONAL_INTRODUCTION':
      // 25s prep + 30s recording + 15s buffer = 70s
      return (q.prepTimeSeconds ?? 25) + (q.durationSeconds ?? 30) + 15;
    case 'SUMMARIZE_WRITTEN_TEXT':
      return q.durationSeconds || 600; // 10 mins
    case 'WRITE_EMAIL':
      return q.durationSeconds || 540; // 9 mins
    case 'WRITE_ESSAY':
      return q.durationSeconds || 1200; // 20 mins
    case 'SUMMARIZE_SPOKEN_TEXT':
      return q.durationSeconds || 600; // 10 mins
    default:
      if (q.section === 'READING') return 1800; // 30 min pooled section
      if (q.section === 'LISTENING') return 1500; // 25 min pooled section
      return q.durationSeconds || 60;
  }
}

export function createExamSession(examMode: PteMode, questions: QuestionItem[]): ExamSession {
  const filtered = questions.filter(
    (q) => q.examMode === 'BOTH' || q.examMode === examMode
  );

  const initialQuestion = filtered[0];
  const isPooled = initialQuestion?.section === 'READING' || initialQuestion?.section === 'LISTENING';
  const initialTime = isPooled && initialQuestion?.durationSeconds
    ? initialQuestion.durationSeconds
    : calculateAllocatedTimeForQuestion(initialQuestion);

  return {
    examMode,
    questions: filtered,
    currentQuestionIndex: 0,
    currentSection: initialQuestion ? initialQuestion.section : 'SPEAKING_WRITING',
    responses: {},
    timeRemainingSeconds: initialTime,
    isComplete: filtered.length === 0,
    startedAt: new Date().toISOString(),
  };
}

export function isTaskPooledSection(q?: QuestionItem): boolean {
  if (!q) return false;
  return q.section === 'READING' || (q.section === 'LISTENING' && q.type !== 'SUMMARIZE_SPOKEN_TEXT');
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

  const currentQ = session.questions[session.currentQuestionIndex];
  const nextQuestion = session.questions[nextIndex];
  const isSameSection = nextQuestion.section === session.currentSection;
  const isCurrentlyPooled = isTaskPooledSection(currentQ);
  const isNextPooled = isTaskPooledSection(nextQuestion);

  // Time remaining is ONLY pooled if both current and next questions belong to the pooled pool
  // (Prevents individually timed items like SUMMARIZE_SPOKEN_TEXT from bleeding into pooled listening)
  const timeRemainingSeconds =
    isSameSection && isCurrentlyPooled && isNextPooled
      ? session.timeRemainingSeconds
      : calculateAllocatedTimeForQuestion(nextQuestion);

  return {
    ...session,
    currentQuestionIndex: nextIndex,
    currentSection: nextQuestion.section,
    responses: updatedResponses,
    timeRemainingSeconds,
  };
}
