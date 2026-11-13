import { describe, it, expect } from 'vitest';
import { scoreReadAloud, scoreSummarizeText, scoreWriteFromDictation } from '../../src/services/scoring/deterministicScorer';

describe('Deterministic Scorer', () => {
  it('evaluates Read Aloud using phonetic similarity and word error rate', () => {
    const target = 'The solar system consists of the sun and celestial bodies';
    const spoken = 'The solar system consists of the sun and celestial objects';
    const score = scoreReadAloud(target, spoken, 6.0);

    expect(score.contentScore).toBeGreaterThanOrEqual(2);
    expect(score.pronunciationScore).toBeGreaterThanOrEqual(3);
    expect(score.fluencyScore).toBeGreaterThanOrEqual(3);
  });

  it('penalizes Summarize Text if outside 5-75 words', () => {
    const scoreTooShort = scoreSummarizeText('Too short.', 'Reference text passage here');
    expect(scoreTooShort.formScore).toBe(0);

    const validSummary = 'Modern remote working arrangements provide substantial economic and lifestyle flexibility for global corporate workforces.';
    const scoreValid = scoreSummarizeText(validSummary, 'Reference text passage here');
    expect(scoreValid.formScore).toBe(1);
    expect(scoreValid.contentScore).toBeGreaterThanOrEqual(1);
  });

  it('evaluates Write from Dictation word-for-word accuracy', () => {
    const target = 'All international applicants must submit verified documentation';
    const userTyped = 'All international applicants must submit verified documentation';
    const score = scoreWriteFromDictation(target, userTyped);

    expect(score.contentScore).toBe(7);
    expect(score.maxContent).toBe(7);
  });
});
