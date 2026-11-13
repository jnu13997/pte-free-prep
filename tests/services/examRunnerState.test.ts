import { describe, it, expect } from 'vitest';
import { createExamSession, advanceQuestion, UserExamResponse } from '../../src/services/exam/examRunnerState';
import { QuestionItem } from '../../src/types/exam';

describe('Exam Runner State Machine', () => {
  const dummyQuestions: QuestionItem[] = [
    {
      id: 'q1',
      type: 'READ_ALOUD',
      examMode: 'BOTH',
      section: 'SPEAKING_WRITING',
      title: 'Read Aloud 1',
      instructions: 'Read aloud',
      promptText: 'First question text',
      durationSeconds: 40,
    },
    {
      id: 'q2',
      type: 'SUMMARIZE_WRITTEN_TEXT',
      examMode: 'BOTH',
      section: 'SPEAKING_WRITING',
      title: 'Summarize Written Text 1',
      instructions: 'Summarize in one sentence',
      passageText: 'Passage for summary',
      durationSeconds: 600,
    },
    {
      id: 'q3',
      type: 'READING_FILL_IN_BLANKS',
      examMode: 'BOTH',
      section: 'READING',
      title: 'Reading Blanks 1',
      instructions: 'Fill the blanks',
      passageText: 'Reading passage',
    },
  ];

  it('initializes exam session properly with initial question and state', () => {
    const session = createExamSession('PTE_CORE', dummyQuestions);
    expect(session.examMode).toBe('PTE_CORE');
    expect(session.currentQuestionIndex).toBe(0);
    expect(session.currentSection).toBe('SPEAKING_WRITING');
    expect(session.isComplete).toBe(false);
    expect(session.questions.length).toBe(3);
  });

  it('advances question index and records response', () => {
    const session = createExamSession('PTE_CORE', dummyQuestions);
    const userResponse: UserExamResponse = {
      taskId: 'q1',
      transcript: 'Spoken text sample',
      durationSeconds: 15,
    };

    const nextSession = advanceQuestion(session, userResponse);
    expect(nextSession.currentQuestionIndex).toBe(1);
    expect(nextSession.responses['q1']).toEqual(userResponse);
  });

  it('marks exam complete when advancing past final question', () => {
    let session = createExamSession('PTE_CORE', dummyQuestions);
    session = advanceQuestion(session, { taskId: 'q1' });
    session = advanceQuestion(session, { taskId: 'q2' });
    session = advanceQuestion(session, { taskId: 'q3' });

    expect(session.isComplete).toBe(true);
  });

  it('preserves pooled section timer across Reading questions', () => {
    const readingQuestions: QuestionItem[] = [
      {
        id: 'r1',
        type: 'READING_FILL_IN_BLANKS',
        examMode: 'BOTH',
        section: 'READING',
        title: 'Reading 1',
        instructions: 'Fill blanks',
        durationSeconds: 1800, // 30 min pooled section
      },
      {
        id: 'r2',
        type: 'REORDER_PARAGRAPHS',
        examMode: 'BOTH',
        section: 'READING',
        title: 'Reading 2',
        instructions: 'Reorder',
      },
    ];

    let session = createExamSession('PTE_CORE', readingQuestions);
    expect(session.timeRemainingSeconds).toBe(1800);

    // Simulate 60 seconds spent on r1
    session.timeRemainingSeconds = 1740;
    const nextSession = advanceQuestion(session, { taskId: 'r1' });

    // Should preserve the 1740s remaining rather than resetting
    expect(nextSession.timeRemainingSeconds).toBe(1740);
  });
});
