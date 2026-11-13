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
  _referencePassage?: string
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

export function scoreSummarizeSpokenText(
  summaryText: string,
  _spokenPromptText?: string
): { contentScore: number; formScore: number; grammarScore: number; vocabScore: number; spellingScore: number } {
  const clean = summaryText.trim();
  const words = clean ? clean.split(/\s+/) : [];
  const wordCount = words.length;

  // Form: 50 to 70 words. Multiple sentences are encouraged in SST!
  const isWithinLength = wordCount >= 50 && wordCount <= 70;
  const formScore = isWithinLength ? 2 : (wordCount >= 40 && wordCount <= 100) ? 1 : 0;

  const contentScore = wordCount >= 45 ? 2 : wordCount >= 20 ? 1 : 0;
  const grammarScore = clean.length > 30 && /^[A-Z]/.test(clean) && /[.!?]$/.test(clean) ? 2 : 1;
  const vocabScore = new Set(words.map((w) => w.toLowerCase())).size >= 25 ? 2 : 1;
  const spellingScore = 2;

  return {
    contentScore,
    formScore,
    grammarScore,
    vocabScore,
    spellingScore,
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
    case 'PERSONAL_INTRODUCTION': {
      return {
        ...base,
        contentScore: 0,
        maxContent: 0,
      };
    }

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

    case 'DESCRIBE_IMAGE':
    case 'RESPOND_TO_SITUATION':
    case 'RETELL_LECTURE': {
      const words = (response.transcript || '').trim().split(/\s+/).filter(Boolean);
      const fluency = calculateSpeechRateAndFluency(response.transcript || '', response.durationSeconds || 30, 0);
      const contentScore = words.length >= 40 ? 5 : words.length >= 25 ? 4 : words.length >= 15 ? 3 : words.length > 5 ? 2 : 1;
      const pronunciationScore = words.length > 10 ? 4 : 2;

      return {
        ...base,
        contentScore,
        maxContent: 5,
        fluencyScore: fluency.fluencyScore,
        maxFluency: 5,
        pronunciationScore,
        maxPronunciation: 5,
      };
    }

    case 'ANSWER_SHORT_QUESTION': {
      const answer = (response.transcript || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
      const answerWords = new Set(answer.split(/\s+/).filter(Boolean));

      const expectedRaw = (question.sampleAnswer || '').toLowerCase();
      const stopWords = new Set(['a', 'an', 'the', 'or', 'and', 'in', 'of', 'to', 'for', 'is', 'it']);
      const validKeywords = expectedRaw
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2 && !stopWords.has(w));

      const isCorrect = validKeywords.length > 0
        ? validKeywords.some((kw) => answerWords.has(kw) || answer.includes(kw))
        : answerWords.size > 0;

      return {
        ...base,
        contentScore: isCorrect ? 1 : 0,
        maxContent: 1,
        pronunciationScore: isCorrect ? 5 : 2,
        maxPronunciation: 5,
        fluencyScore: isCorrect ? 5 : 3,
        maxFluency: 5,
      };
    }

    case 'SUMMARIZE_WRITTEN_TEXT': {
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

    case 'SUMMARIZE_SPOKEN_TEXT': {
      const scored = scoreSummarizeSpokenText(response.writtenText || '', question.passageText || question.promptText || '');
      return {
        ...base,
        contentScore: scored.contentScore,
        maxContent: 2,
        formScore: scored.formScore,
        maxForm: 2,
        grammarScore: scored.grammarScore,
        maxGrammar: 2,
        vocabularyScore: scored.vocabScore,
        maxVocabulary: 2,
        spellingScore: scored.spellingScore,
        maxSpelling: 2,
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

    case 'READING_WRITING_FILL_IN_BLANKS': {
      const selections = response.dropdownSelections || {};
      const blanks = question.dropdownBlanks || [];
      let correct = 0;
      blanks.forEach((b) => {
        const chosen = selections[b.index];
        const correctOpt = b.options[b.correctIndex];
        if (chosen === correctOpt) {
          correct++;
        }
      });
      return {
        ...base,
        contentScore: correct,
        maxContent: Math.max(1, blanks.length),
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

    case 'LISTENING_FILL_IN_BLANKS': {
      const blanks = response.blankValues || {};
      const targets = question.targetGaps || [];
      if (targets.length > 0) {
        let correct = 0;
        targets.forEach((gap) => {
          if (blanks[gap.index]?.toLowerCase().trim() === gap.correctWord.toLowerCase().trim()) {
            correct++;
          }
        });
        return {
          ...base,
          contentScore: correct,
          maxContent: targets.length,
        };
      }
      const correctCount = Object.values(blanks).filter((v) => v && v.trim().length > 0).length;
      return {
        ...base,
        contentScore: correctCount,
        maxContent: Math.max(1, Object.keys(blanks).length || 3),
      };
    }

    case 'SELECT_MISSING_WORD':
    case 'MULTIPLE_CHOICE_SINGLE_READING':
    case 'MULTIPLE_CHOICE_SINGLE_LISTENING':
    case 'HIGHLIGHT_CORRECT_SUMMARY': {
      const selectedId = response.selectedOptionIds?.[0];
      const correctOption = question.options?.find((o) => o.isCorrect);
      const isCorrect = correctOption ? selectedId === correctOption.id : false;
      return {
        ...base,
        contentScore: isCorrect ? 1 : 0,
        maxContent: 1,
      };
    }

    case 'MULTIPLE_CHOICE_MULTIPLE_READING':
    case 'MULTIPLE_CHOICE_MULTIPLE_LISTENING': {
      const selectedIds = response.selectedOptionIds || [];
      const correctIds = (question.options || []).filter((o) => o.isCorrect).map((o) => o.id);
      let correct = 0;
      let incorrect = 0;
      selectedIds.forEach((id) => {
        if (correctIds.includes(id)) {
          correct++;
        } else {
          incorrect++;
        }
      });
      const earned = Math.max(0, correct - incorrect);
      return {
        ...base,
        contentScore: earned,
        maxContent: Math.max(1, correctIds.length),
      };
    }

    case 'HIGHLIGHT_INCORRECT_WORDS': {
      const userClicks = response.highlightedIndices || [];
      const correctIndices = (question.incorrectWords || []).map((w) => w.index);
      let correct = 0;
      let incorrect = 0;
      userClicks.forEach((idx) => {
        if (correctIndices.includes(idx)) {
          correct++;
        } else {
          incorrect++;
        }
      });
      const score = Math.max(0, correct - incorrect);
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
