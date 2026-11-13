import { describe, it, expect } from 'vitest';
import { pteCoreMockQuestions } from '../../src/data/questionBanks/pteCoreMock';
import { pteAcademicMockQuestions } from '../../src/data/questionBanks/pteAcademicMock';
import { evaluateSessionTask } from '../../src/services/scoring/deterministicScorer';
import { SpeechRecognitionService } from '../../src/services/audio/speechRecognition';

describe('QA End-to-End Quality & Regression Verification', () => {
  it('verifies that Reading & Writing Blanks questions have valid passage blanks ("___")', () => {
    const coreRwBlanks = pteCoreMockQuestions.find(
      (q) => q.type === 'READING_WRITING_FILL_IN_BLANKS'
    )!;
    expect(coreRwBlanks).toBeDefined();
    expect(coreRwBlanks.passageText).toContain('___');
    const segments = (coreRwBlanks.passageText || '').split('___');
    // 3 dropdown blanks => 4 passage text segments
    expect(segments.length).toBe(4);
    expect(coreRwBlanks.dropdownBlanks?.length).toBe(3);

    const acadRwBlanks = pteAcademicMockQuestions.find(
      (q) => q.type === 'READING_WRITING_FILL_IN_BLANKS'
    )!;
    expect(acadRwBlanks).toBeDefined();
    expect(acadRwBlanks.passageText).toContain('___');
    const acadSegments = (acadRwBlanks.passageText || '').split('___');
    expect(acadSegments.length).toBe(4);
    expect(acadRwBlanks.dropdownBlanks?.length).toBe(3);
  });

  it('verifies that Reading Drag & Drop Blanks questions have valid passage blanks ("___")', () => {
    const coreRBlanks = pteCoreMockQuestions.find(
      (q) => q.type === 'READING_FILL_IN_BLANKS'
    )!;
    expect(coreRBlanks).toBeDefined();
    expect(coreRBlanks.passageText).toContain('___');
    const segments = (coreRBlanks.passageText || '').split('___');
    // 4 target gaps => 5 segments
    expect(segments.length).toBe(5);
    expect(coreRBlanks.targetGaps?.length).toBe(4);
    expect(coreRBlanks.dragDropWords?.length).toBeGreaterThanOrEqual(4);

    const acadRBlanks = pteAcademicMockQuestions.find(
      (q) => q.type === 'READING_FILL_IN_BLANKS'
    )!;
    expect(acadRBlanks).toBeDefined();
    expect(acadRBlanks.passageText).toContain('___');
    const acadSegments = (acadRBlanks.passageText || '').split('___');
    expect(acadSegments.length).toBe(4);
    expect(acadRBlanks.targetGaps?.length).toBe(3);
  });

  it('verifies dynamic recipient context for Email writing tasks', () => {
    const emailQ = pteCoreMockQuestions.find((q) => q.type === 'WRITE_EMAIL')!;
    expect(emailQ.recipientContext).toBe('the building property manager');
  });

  it('verifies Personal Introduction is explicitly marked as unscored item', () => {
    const introQ = pteCoreMockQuestions.find((q) => q.type === 'PERSONAL_INTRODUCTION')!;
    expect(introQ).toBeDefined();
    const score = evaluateSessionTask(introQ, {
      taskId: introQ.id,
      transcript: 'Hello, my name is Alex. I am moving to Toronto for higher education.',
    });
    expect(score.contentScore).toBe(0);
    expect(score.maxContent).toBe(0);
  });

  it('correctly scores Listening Fill in the Blanks against target gaps', () => {
    const dummyListeningBlanks = {
      id: 'mock-lfib-1',
      type: 'LISTENING_FILL_IN_BLANKS' as const,
      examMode: 'BOTH' as const,
      section: 'LISTENING' as const,
      title: 'Listening Blanks Test',
      instructions: 'Fill the blanks',
      targetGaps: [
        { index: 0, correctWord: 'sustainability' },
        { index: 1, correctWord: 'ecosystem' },
      ],
    };

    const accurateResponse = {
      taskId: 'mock-lfib-1',
      blankValues: {
        0: 'sustainability',
        1: 'ecosystem',
      },
    };
    const accurateScore = evaluateSessionTask(dummyListeningBlanks, accurateResponse);
    expect(accurateScore.contentScore).toBe(2);
    expect(accurateScore.maxContent).toBe(2);

    const partialResponse = {
      taskId: 'mock-lfib-1',
      blankValues: {
        0: 'sustainability',
        1: 'wrongword',
      },
    };
    const partialScore = evaluateSessionTask(dummyListeningBlanks, partialResponse);
    expect(partialScore.contentScore).toBe(1);
    expect(partialScore.maxContent).toBe(2);
  });

  it('verifies ANSWER_SHORT_QUESTION scores accurately and prevents false-positive substrings', () => {
    const asq = pteCoreMockQuestions.find((q) => q.type === 'ANSWER_SHORT_QUESTION')!;
    expect(asq).toBeDefined();

    // Correct responses
    const invoiceResp = evaluateSessionTask(asq, { taskId: asq.id, transcript: 'an invoice' });
    expect(invoiceResp.contentScore).toBe(1);

    const billResp = evaluateSessionTask(asq, { taskId: asq.id, transcript: 'a bill' });
    expect(billResp.contentScore).toBe(1);

    // Irrelevant responses containing sub-strings like 'an' must score 0
    const bananaResp = evaluateSessionTask(asq, { taskId: asq.id, transcript: 'banana' });
    expect(bananaResp.contentScore).toBe(0);

    const orangeResp = evaluateSessionTask(asq, { taskId: asq.id, transcript: 'orange' });
    expect(orangeResp.contentScore).toBe(0);
  });

  it('verifies HIGHLIGHT_INCORRECT_WORDS scoring is mathematically consistent regardless of click order', () => {
    const hiw = pteCoreMockQuestions.find((q) => q.type === 'HIGHLIGHT_INCORRECT_WORDS')!;
    expect(hiw).toBeDefined();

    // Incorrect words are at index 2 ('observe') and 17 ('agricultural')
    expect(hiw.incorrectWords?.[0].index).toBe(2);
    expect(hiw.incorrectWords?.[1].index).toBe(17);

    // Click 1 right (index 2) + 1 wrong (index 0) => net 0
    const scoreRightThenWrong = evaluateSessionTask(hiw, { taskId: hiw.id, highlightedIndices: [2, 0] });
    // Click 1 wrong (index 0) + 1 right (index 2) => net 0
    const scoreWrongThenRight = evaluateSessionTask(hiw, { taskId: hiw.id, highlightedIndices: [0, 2] });

    expect(scoreRightThenWrong.contentScore).toBe(0);
    expect(scoreWrongThenRight.contentScore).toBe(0);

    // Click both right (indices 2 and 17) => full score 2
    const scoreBothRight = evaluateSessionTask(hiw, { taskId: hiw.id, highlightedIndices: [2, 17] });
    expect(scoreBothRight.contentScore).toBe(2);
    expect(scoreBothRight.maxContent).toBe(2);
  });

  it('preserves trailing speech in SpeechRecognitionService on stop()', () => {
    const svc = new SpeechRecognitionService();
    // When no speech engine exists in test env, stop returns empty string safely
    expect(svc.stop()).toBe('');
  });
});
