export type PteMode = 'PTE_CORE' | 'PTE_ACADEMIC';

export type SectionType =
  | 'SPEAKING_WRITING'
  | 'READING'
  | 'LISTENING';

export type TaskType =
  // Speaking & Writing
  | 'PERSONAL_INTRODUCTION'
  | 'READ_ALOUD'
  | 'REPEAT_SENTENCE'
  | 'DESCRIBE_IMAGE'
  | 'RESPOND_TO_SITUATION' // PTE Core unique
  | 'RETELL_LECTURE'       // PTE Academic unique
  | 'ANSWER_SHORT_QUESTION'
  | 'SUMMARIZE_WRITTEN_TEXT'
  | 'WRITE_EMAIL'          // PTE Core unique
  | 'WRITE_ESSAY'          // PTE Academic unique
  // Reading
  | 'READING_WRITING_FILL_IN_BLANKS'
  | 'MULTIPLE_CHOICE_MULTIPLE_READING'
  | 'REORDER_PARAGRAPHS'
  | 'READING_FILL_IN_BLANKS'
  | 'MULTIPLE_CHOICE_SINGLE_READING'
  // Listening
  | 'SUMMARIZE_SPOKEN_TEXT'
  | 'MULTIPLE_CHOICE_MULTIPLE_LISTENING'
  | 'LISTENING_FILL_IN_BLANKS'
  | 'HIGHLIGHT_CORRECT_SUMMARY'
  | 'MULTIPLE_CHOICE_SINGLE_LISTENING'
  | 'SELECT_MISSING_WORD'
  | 'HIGHLIGHT_INCORRECT_WORDS'
  | 'WRITE_FROM_DICTATION';

export interface TaskRawScore {
  taskId: string;
  taskType: TaskType;
  contentScore?: number;
  maxContent?: number;
  fluencyScore?: number;
  maxFluency?: number;
  pronunciationScore?: number;
  maxPronunciation?: number;
  grammarScore?: number;
  maxGrammar?: number;
  vocabularyScore?: number;
  maxVocabulary?: number;
  spellingScore?: number;
  maxSpelling?: number;
  formScore?: number;
  maxForm?: number;
}

export interface EnablingSkills {
  grammar: number;
  oralFluency: number;
  pronunciation: number;
  spelling: number;
  vocabulary: number;
  writtenDiscourse: number;
}

export interface PteScoreReport {
  overall: number;
  speaking: number;
  writing: number;
  reading: number;
  listening: number;
  enablingSkills: EnablingSkills;
  clbLevels?: {
    overall: number;
    speaking: number;
    writing: number;
    reading: number;
    listening: number;
  };
  totalTasksCompleted: number;
  completedAt: string;
}

export interface QuestionItem {
  id: string;
  type: TaskType;
  examMode: 'BOTH' | 'PTE_CORE' | 'PTE_ACADEMIC';
  section: SectionType;
  title: string;
  instructions: string;
  prepTimeSeconds?: number;
  durationSeconds?: number;
  promptText?: string;
  promptAudioUrl?: string;
  imageUrl?: string;
  chartDescription?: string;
  // Specialized task attributes
  passageText?: string;
  options?: { id: string; text: string; isCorrect?: boolean }[];
  dropdownBlanks?: { index: number; options: string[]; correctIndex: number }[];
  scrambledParagraphs?: { id: string; text: string }[];
  correctParagraphOrder?: string[];
  dragDropWords?: string[];
  targetGaps?: { index: number; correctWord: string }[];
  transcript?: string;
  incorrectWords?: { index: number; originalWord: string; spokenWord: string }[];
  minWords?: number;
  maxWords?: number;
  sampleAnswer?: string;
}
