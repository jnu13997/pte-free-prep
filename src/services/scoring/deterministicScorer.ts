import { TaskRawScore, QuestionItem } from '../../types/exam';
import { UserExamResponse } from '../exam/examRunnerState';
import { calculateSpeechRateAndFluency } from '../audio/recorderEngine';

// Levenshtein distance helper
function levenshteinDistance(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function scoreReadAloud(
  targetText: string,
  spokenTranscript: string,
  durationSeconds = 20
): { contentScore: number; pronunciationScore: number; fluencyScore: number } {
  const targetWords = targetText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const spokenWords = spokenTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

  if (targetWords.length === 0 || spokenWords.length === 0) {
    return { contentScore: 0, pronunciationScore: 0, fluencyScore: 0 };
  }

  // Word match count
  let matched = 0;
  targetWords.forEach((word) => {
    if (spokenWords.includes(word)) {
      matched++;
    }
  });

  const accuracyRatio = matched / targetWords.length;
  const contentScore = accuracyRatio >= 0.85 ? 3 : accuracyRatio >= 0.6 ? 2 : accuracyRatio >= 0.3 ? 1 : 0;

  // Approximate pronunciation from Levenshtein similarity
  const levDist = levenshteinDistance(targetText, spokenTranscript);
  const maxLen = Math.max(targetText.length, spokenTranscript.length);
  const similarity = Math.max(0, 1 - levDist / maxLen);
  const pronunciationScore = Math.min(5, Math.max(1, Math.round(similarity * 5)));

  const fluency = calculateSpeechRateAndFluency(spokenTranscript, durationSeconds, 0);

  return {
    contentScore,
    pronunciationScore,
    fluencyScore: fluency.fluencyScore,
  };
}

export function scoreSummarizeText(
  summaryText: string,
  _referencePassage: string
): { contentScore: number; formScore: number; grammarScore: number; vocabScore: number } {
  const clean = summaryText.trim();
  const words = clean ? clean.split(/\s+/) : [];
  const wordCount = words.length;

  // Form: 5 to 75 words AND one single sentence
  const sentenceTerminators = (clean.match(/[.!?](\s+|$)/g) || []).length;
  const isOneSentence = sentenceTerminators <= 1;
  const isWithinLength = wordCount >= 5 && wordCount <= 75;

  const formScore = isOneSentence && isWithinLength ? 1 : 0;
  const contentScore = wordCount >= 15 ? 2 : wordCount >= 5 ? 1 : 0;
  const grammarScore = clean.length > 20 && /^[A-Z]/.test(clean) && /[.!?]$/.test(clean) ? 2 : 1;
  const vocabScore = new Set(words.map((w) => w.toLowerCase())).size > 10 ? 2 : 1;

  return {
    contentScore,
    formScore,
    grammarScore,
    vocabScore,
  };
}

export function scoreWriteFromDictation(
  targetSentence: string,
  userTyped: string
): { contentScore: number; maxContent: number } {
  const targetWords = targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const typedWords = userTyped.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

  let correctCount = 0;
  targetWords.forEach((word) => {
    if (typedWords.includes(word)) {
      correctCount++;
    }
  });

  return {
    contentScore: correctCount,
    maxContent: targetWords.length,
  };
}

export function evaluateSessionTask(
  question: QuestionItem,
  response: UserExamResponse
): TaskRawScore {
  const base: TaskRawScore = {
    taskId: question.id,
    taskType: question.type,
  };

  switch (question.type) {
    case 'READ_ALOUD': {
      const scored = scoreReadAloud(question.promptText || '', response.transcript || '', response.durationSeconds || 20);
      return {
        ...base,
        contentScore: scored.contentScore,
        maxContent: 3,
        pronunciationScore: scored.pronunciationScore,
        maxPronunciation: 5,
        fluencyScore: scored.fluencyScore,
        maxFluency: 5,
      };
    }

    case 'REPEAT_SENTENCE': {
      const scored = scoreReadAloud(question.promptText || '', response.transcript || '', response.durationSeconds || 10);
      return {
        ...base,
        contentScore: scored.contentScore,
        maxContent: 3,
        pronunciationScore: scored.pronunciationScore,
        maxPronunciation: 5,
        fluencyScore: scored.fluencyScore,
        maxFluency: 5,
      };
    }

    case 'SUMMARIZE_WRITTEN_TEXT':
    case 'SUMMARIZE_SPOKEN_TEXT': {
      const scored = scoreSummarizeText(response.writtenText || '', question.passageText || question.promptText || '');
      return {
        ...base,
        contentScore: scored.contentScore,
        maxContent: 2,
        formScore: scored.formScore,
        maxForm: 1,
        grammarScore: scored.grammarScore,
        maxGrammar: 2,
        vocabularyScore: scored.vocabScore,
        maxVocabulary: 2,
      };
    }

    case 'WRITE_EMAIL': {
      const words = (response.writtenText || '').trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const isLengthValid = wordCount >= 80 && wordCount <= 120;
      return {
        ...base,
        contentScore: wordCount >= 60 ? 3 : 1,
        maxContent: 3,
        formScore: isLengthValid ? 2 : 1,
        maxForm: 2,
        grammarScore: 2,
        maxGrammar: 2,
        vocabularyScore: 2,
        maxVocabulary: 2,
      };
    }

    case 'WRITE_ESSAY': {
      const words = (response.writtenText || '').trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const isLengthValid = wordCount >= 200 && wordCount <= 300;
      return {
        ...base,
        contentScore: wordCount >= 180 ? 3 : 1,
        maxContent: 3,
        formScore: isLengthValid ? 2 : 1,
        maxForm: 2,
        grammarScore: 2,
        maxGrammar: 2,
        vocabularyScore: 2,
        maxVocabulary: 2,
      };
    }

    case 'WRITE_FROM_DICTATION': {
      const scored = scoreWriteFromDictation(question.promptText || '', response.writtenText || '');
      return {
        ...base,
        contentScore: scored.contentScore,
        maxContent: scored.maxContent,
      };
    }

    case 'REORDER_PARAGRAPHS': {
      const userOrder = response.reorderedIds || [];
      const correctOrder = question.correctParagraphOrder || [];
      let pairPoints = 0;
      for (let i = 0; i < userOrder.length - 1; i++) {
        const uCurrent = userOrder[i];
        const uNext = userOrder[i + 1];
        const cIdx = correctOrder.indexOf(uCurrent);
        if (cIdx !== -1 && cIdx < correctOrder.length - 1 && correctOrder[cIdx + 1] === uNext) {
          pairPoints++;
        }
      }
      return {
        ...base,
        contentScore: pairPoints,
        maxContent: Math.max(1, correctOrder.length - 1),
      };
    }

    case 'READING_FILL_IN_BLANKS': {
      const blanks = response.blankValues || {};
      const targets = question.targetGaps || [];
      let correct = 0;
      targets.forEach((gap) => {
        if (blanks[gap.index]?.toLowerCase().trim() === gap.correctWord.toLowerCase().trim()) {
          correct++;
        }
      });
      return {
        ...base,
        contentScore: correct,
        maxContent: Math.max(1, targets.length),
      };
    }

    case 'HIGHLIGHT_INCORRECT_WORDS': {
      const userClicks = response.highlightedIndices || [];
      const correctIndices = (question.incorrectWords || []).map((w) => w.index);
      let score = 0;
      userClicks.forEach((idx) => {
        if (correctIndices.includes(idx)) {
          score += 1;
        } else {
          score = Math.max(0, score - 1); // Negative marking for wrong clicks
        }
      });
      return {
        ...base,
        contentScore: score,
        maxContent: Math.max(1, correctIndices.length),
      };
    }

    default: {
      return {
        ...base,
        contentScore: 1,
        maxContent: 1,
      };
    }
  }
}
