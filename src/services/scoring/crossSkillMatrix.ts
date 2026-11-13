import { TaskRawScore, PteScoreReport, TaskType } from '../../types/exam';

interface SkillWeights {
  speaking: number;
  writing: number;
  reading: number;
  listening: number;
}

const TASK_CROSS_SKILL_WEIGHTS: Record<TaskType, SkillWeights> = {
  PERSONAL_INTRODUCTION: { speaking: 0, writing: 0, reading: 0, listening: 0 },
  READ_ALOUD: { speaking: 0.6, writing: 0, reading: 0.4, listening: 0 },
  REPEAT_SENTENCE: { speaking: 0.5, writing: 0, reading: 0, listening: 0.5 },
  DESCRIBE_IMAGE: { speaking: 1.0, writing: 0, reading: 0, listening: 0 },
  RESPOND_TO_SITUATION: { speaking: 0.7, writing: 0, reading: 0, listening: 0.3 },
  RETELL_LECTURE: { speaking: 0.7, writing: 0, reading: 0, listening: 0.3 },
  ANSWER_SHORT_QUESTION: { speaking: 0.5, writing: 0, reading: 0, listening: 0.5 },
  SUMMARIZE_WRITTEN_TEXT: { speaking: 0, writing: 0.6, reading: 0.4, listening: 0 },
  WRITE_EMAIL: { speaking: 0, writing: 1.0, reading: 0, listening: 0 },
  WRITE_ESSAY: { speaking: 0, writing: 1.0, reading: 0, listening: 0 },
  READING_WRITING_FILL_IN_BLANKS: { speaking: 0, writing: 0.35, reading: 0.65, listening: 0 },
  MULTIPLE_CHOICE_MULTIPLE_READING: { speaking: 0, writing: 0, reading: 1.0, listening: 0 },
  REORDER_PARAGRAPHS: { speaking: 0, writing: 0, reading: 1.0, listening: 0 },
  READING_FILL_IN_BLANKS: { speaking: 0, writing: 0, reading: 1.0, listening: 0 },
  MULTIPLE_CHOICE_SINGLE_READING: { speaking: 0, writing: 0, reading: 1.0, listening: 0 },
  SUMMARIZE_SPOKEN_TEXT: { speaking: 0, writing: 0.5, reading: 0, listening: 0.5 },
  MULTIPLE_CHOICE_MULTIPLE_LISTENING: { speaking: 0, writing: 0, reading: 0, listening: 1.0 },
  LISTENING_FILL_IN_BLANKS: { speaking: 0, writing: 0.4, reading: 0, listening: 0.6 },
  HIGHLIGHT_CORRECT_SUMMARY: { speaking: 0, writing: 0, reading: 0.4, listening: 0.6 },
  MULTIPLE_CHOICE_SINGLE_LISTENING: { speaking: 0, writing: 0, reading: 0, listening: 1.0 },
  SELECT_MISSING_WORD: { speaking: 0, writing: 0, reading: 0, listening: 1.0 },
  HIGHLIGHT_INCORRECT_WORDS: { speaking: 0, writing: 0, reading: 0.4, listening: 0.6 },
  WRITE_FROM_DICTATION: { speaking: 0, writing: 0.5, reading: 0, listening: 0.5 },
};

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function computePteScores(rawScores: TaskRawScore[]): PteScoreReport {
  let speakingEarned = 0, speakingMax = 0;
  let writingEarned = 0, writingMax = 0;
  let readingEarned = 0, readingMax = 0;
  let listeningEarned = 0, listeningMax = 0;

  // Enabling skills
  let grammarEarned = 0, grammarMax = 0;
  let fluencyEarned = 0, fluencyMax = 0;
  let pronunciationEarned = 0, pronunciationMax = 0;
  let spellingEarned = 0, spellingMax = 0;
  let vocabEarned = 0, vocabMax = 0;
  let discourseEarned = 0, discourseMax = 0;

  rawScores.forEach((score) => {
    const weights = TASK_CROSS_SKILL_WEIGHTS[score.taskType] || { speaking: 0, writing: 0, reading: 0, listening: 0 };
    
    // Sum total earned for this task
    const totalItemEarned =
      (score.contentScore || 0) +
      (score.fluencyScore || 0) +
      (score.pronunciationScore || 0) +
      (score.grammarScore || 0) +
      (score.vocabularyScore || 0) +
      (score.spellingScore || 0) +
      (score.formScore || 0);

    const totalItemMax = Math.max(
      1,
      (score.maxContent || 0) +
      (score.maxFluency || 0) +
      (score.maxPronunciation || 0) +
      (score.maxGrammar || 0) +
      (score.maxVocabulary || 0) +
      (score.maxSpelling || 0) +
      (score.maxForm || 0)
    );

    const itemRatio = totalItemEarned / totalItemMax;

    if (weights.speaking > 0) {
      speakingEarned += itemRatio * weights.speaking;
      speakingMax += weights.speaking;
    }
    if (weights.writing > 0) {
      writingEarned += itemRatio * weights.writing;
      writingMax += weights.writing;
    }
    if (weights.reading > 0) {
      readingEarned += itemRatio * weights.reading;
      readingMax += weights.reading;
    }
    if (weights.listening > 0) {
      listeningEarned += itemRatio * weights.listening;
      listeningMax += weights.listening;
    }

    // Enabling skills tracking
    if (score.grammarScore !== undefined && score.maxGrammar) {
      grammarEarned += score.grammarScore;
      grammarMax += score.maxGrammar;
    }
    if (score.fluencyScore !== undefined && score.maxFluency) {
      fluencyEarned += score.fluencyScore;
      fluencyMax += score.maxFluency;
    }
    if (score.pronunciationScore !== undefined && score.maxPronunciation) {
      pronunciationEarned += score.pronunciationScore;
      pronunciationMax += score.maxPronunciation;
    }
    if (score.spellingScore !== undefined && score.maxSpelling) {
      spellingEarned += score.spellingScore;
      spellingMax += score.maxSpelling;
    }
    if (score.vocabularyScore !== undefined && score.maxVocabulary) {
      vocabEarned += score.vocabularyScore;
      vocabMax += score.maxVocabulary;
    }
    if (score.formScore !== undefined && score.maxForm) {
      discourseEarned += score.formScore;
      discourseMax += score.maxForm;
    }
  });

  const scaleToPte = (earned: number, max: number): number => {
    if (max === 0) return 10;
    const ratio = earned / max;
    // Scale smoothly from 10 to 90
    return Math.round(10 + ratio * 80);
  };

  const speaking = clamp(scaleToPte(speakingEarned, speakingMax), 10, 90);
  const writing = clamp(scaleToPte(writingEarned, writingMax), 10, 90);
  const reading = clamp(scaleToPte(readingEarned, readingMax), 10, 90);
  const listening = clamp(scaleToPte(listeningEarned, listeningMax), 10, 90);

  // Overall is average of active communicative skills
  const activeSkills = [
    speakingMax > 0 ? speaking : null,
    writingMax > 0 ? writing : null,
    readingMax > 0 ? reading : null,
    listeningMax > 0 ? listening : null,
  ].filter((s): s is number => s !== null);

  const overall = activeSkills.length > 0
    ? Math.round(activeSkills.reduce((a, b) => a + b, 0) / activeSkills.length)
    : 10;

  return {
    overall: clamp(overall, 10, 90),
    speaking,
    writing,
    reading,
    listening,
    enablingSkills: {
      grammar: scaleToPte(grammarEarned, grammarMax || 1),
      oralFluency: scaleToPte(fluencyEarned, fluencyMax || 1),
      pronunciation: scaleToPte(pronunciationEarned, pronunciationMax || 1),
      spelling: scaleToPte(spellingEarned, spellingMax || 1),
      vocabulary: scaleToPte(vocabEarned, vocabMax || 1),
      writtenDiscourse: scaleToPte(discourseEarned, discourseMax || 1),
    },
    totalTasksCompleted: rawScores.length,
    completedAt: new Date().toISOString(),
  };
}
