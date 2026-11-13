import { describe, it, expect } from 'vitest';
import {
  calculateAllocatedTimeForQuestion,
  createExamSession,
  advanceQuestion,
} from '../../src/services/exam/examRunnerState';
import { pteCoreMockQuestions } from '../../src/data/questionBanks/pteCoreMock';

describe('QA Exam Progression & Timing Specification', () => {
  it('allocates sufficient prep and recording buffer for all speaking tasks', () => {
    const readAloud = pteCoreMockQuestions.find((q) => q.type === 'READ_ALOUD')!;
    const repeatSentence = pteCoreMockQuestions.find((q) => q.type === 'REPEAT_SENTENCE')!;
    const describeImage = pteCoreMockQuestions.find((q) => q.type === 'DESCRIBE_IMAGE')!;
    const respondSituation = pteCoreMockQuestions.find((q) => q.type === 'RESPOND_TO_SITUATION')!;
    const answerShortQ = pteCoreMockQuestions.find((q) => q.type === 'ANSWER_SHORT_QUESTION')!;

    // Read Aloud: 35s prep + 40s recording + 15s comfort buffer = 90s (never cut off at 40s)
    expect(calculateAllocatedTimeForQuestion(readAloud)).toBeGreaterThanOrEqual(85);

    // Repeat Sentence: prompt audio + 15s recording + buffer = 35s (never cut off at 15s)
    expect(calculateAllocatedTimeForQuestion(repeatSentence)).toBeGreaterThanOrEqual(28);

    // Describe Image: 25s prep + 40s recording + buffer = 80s (never cut off at 40s)
    expect(calculateAllocatedTimeForQuestion(describeImage)).toBeGreaterThanOrEqual(75);

    // Respond to Situation: audio + 25s prep + 40s recording + buffer = 90s
    expect(calculateAllocatedTimeForQuestion(respondSituation)).toBeGreaterThanOrEqual(80);

    // Answer Short Question: audio + 10s recording + buffer = 26s
    expect(calculateAllocatedTimeForQuestion(answerShortQ)).toBeGreaterThanOrEqual(20);
  });

  it('allocates full standard time for writing tasks', () => {
    const swt = pteCoreMockQuestions.find((q) => q.type === 'SUMMARIZE_WRITTEN_TEXT')!;
    const writeEmail = pteCoreMockQuestions.find((q) => q.type === 'WRITE_EMAIL')!;

    // 10 minutes for SWT (600s)
    expect(calculateAllocatedTimeForQuestion(swt)).toBe(600);

    // 9 minutes for Write Email (540s)
    expect(calculateAllocatedTimeForQuestion(writeEmail)).toBe(540);
  });

  it('maintains candidate response across question progression without dropping data', () => {
    const session = createExamSession('PTE_CORE', pteCoreMockQuestions);
    const mockAudioBlob = new Blob(['test audio'], { type: 'audio/webm' });

    const spokenResponse = {
      taskId: 'core-ra-1',
      transcript: 'Modern urban planning increasingly prioritizes integrated public transit networks.',
      audioBlob: mockAudioBlob,
      durationSeconds: 28.5,
    };

    const nextSession = advanceQuestion(session, spokenResponse);

    expect(nextSession.currentQuestionIndex).toBe(1);
    expect(nextSession.responses['core-ra-1']).toBeDefined();
    expect(nextSession.responses['core-ra-1'].transcript).toContain('Modern urban planning');
    expect(nextSession.responses['core-ra-1'].durationSeconds).toBe(28.5);
  });
});
