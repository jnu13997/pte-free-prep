import { describe, it, expect } from 'vitest';
import {
  scoreReadAloud,
  scoreSummarizeText,
  scoreSummarizeSpokenText,
  scoreWriteFromDictation,
  evaluateSessionTask,
} from '../../src/services/scoring/deterministicScorer';

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

  it('evaluates Summarize Spoken Text allowing multiple sentences within 50-70 words', () => {
    const multiSentenceSummary =
      'The lecture explored modern artificial intelligence diagnostics in medical radiology across major research hospitals. Machine learning models can analyze tens of thousands of past scans with notable accuracy and efficiency. However, clinical ethicists and senior researchers emphasize that human medical oversight remains essential to ensure patient safety and ethical treatment standards worldwide.';
    const score = scoreSummarizeSpokenText(multiSentenceSummary);

    expect(score.formScore).toBe(2);
    expect(score.contentScore).toBeGreaterThanOrEqual(1);
  });

  it('evaluates Reading & Writing Blanks dropdown selections accurately', () => {
    const question = {
      id: 'rwfib-test',
      type: 'READING_WRITING_FILL_IN_BLANKS' as const,
      examMode: 'BOTH' as const,
      section: 'READING' as const,
      title: 'Dropdown Test',
      instructions: 'Select options',
      dropdownBlanks: [
        { index: 0, options: ['apple', 'banana'], correctIndex: 0 },
        { index: 1, options: ['cat', 'dog'], correctIndex: 1 },
      ],
    };
    const response = {
      taskId: 'rwfib-test',
      dropdownSelections: { 0: 'apple', 1: 'dog' },
    };
    const result = evaluateSessionTask(question, response);
    expect(result.contentScore).toBe(2);
    expect(result.maxContent).toBe(2);
  });

  it('evaluates Select Missing Word correctly', () => {
    const question = {
      id: 'smw-test',
      type: 'SELECT_MISSING_WORD' as const,
      examMode: 'BOTH' as const,
      section: 'LISTENING' as const,
      title: 'SMW Test',
      instructions: 'Select option',
      options: [
        { id: 'opt-1', text: 'Wrong' },
        { id: 'opt-2', text: 'Correct', isCorrect: true },
      ],
    };
    const response = {
      taskId: 'smw-test',
      selectedOptionIds: ['opt-2'],
    };
    const result = evaluateSessionTask(question, response);
    expect(result.contentScore).toBe(1);
    expect(result.maxContent).toBe(1);
  });
});
