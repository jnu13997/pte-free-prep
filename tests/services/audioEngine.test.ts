import { describe, it, expect } from 'vitest';
import { calculateSpeechRateAndFluency } from '../../src/services/audio/recorderEngine';

describe('Audio Engine Utilities', () => {
  it('calculates fluency and words-per-minute accurately', () => {
    const text = 'This is an example test sentence spoken aloud clearly and smoothly';
    const durationSeconds = 5.0;
    const pausesDetected = 0;
    const result = calculateSpeechRateAndFluency(text, durationSeconds, pausesDetected);

    expect(result.wpm).toBeGreaterThan(80);
    expect(result.fluencyScore).toBeGreaterThanOrEqual(4);
    expect(result.fluencyScore).toBeLessThanOrEqual(5);
  });

  it('penalizes fluency score when excessive pauses occur', () => {
    const text = 'This is a hesitant sentence with many breaks';
    const durationSeconds = 12.0;
    const pausesDetected = 4;
    const result = calculateSpeechRateAndFluency(text, durationSeconds, pausesDetected);

    expect(result.wpm).toBeLessThan(80);
    expect(result.fluencyScore).toBeLessThan(4);
  });
});
