import { describe, it, expect } from 'vitest';
import { computePteScores } from '../../src/services/scoring/crossSkillMatrix';

describe('Cross-Skill Matrix', () => {
  it('aggregates cross-skill points correctly for Read Aloud to Speaking and Reading', () => {
    const report = computePteScores([
      {
        taskId: 'ra-1',
        taskType: 'READ_ALOUD',
        contentScore: 3,
        fluencyScore: 5,
        pronunciationScore: 5,
        maxContent: 3,
        maxFluency: 5,
        maxPronunciation: 5,
      },
    ]);
    expect(report.speaking).toBeGreaterThan(10);
    expect(report.reading).toBeGreaterThan(10);
    expect(report.overall).toBeGreaterThanOrEqual(10);
    expect(report.overall).toBeLessThanOrEqual(90);
  });

  it('aggregates points for Write from Dictation to Listening and Writing', () => {
    const report = computePteScores([
      {
        taskId: 'wfd-1',
        taskType: 'WRITE_FROM_DICTATION',
        contentScore: 8,
        maxContent: 8,
      },
    ]);
    expect(report.listening).toBeGreaterThan(10);
    expect(report.writing).toBeGreaterThan(10);
  });
});
