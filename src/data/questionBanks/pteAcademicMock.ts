import { QuestionItem } from '../../types/exam';

export const pteAcademicMockQuestions: QuestionItem[] = [
  // 1. Read Aloud
  {
    id: 'acad-ra-1',
    type: 'READ_ALOUD',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Read Aloud - Quantum Computing',
    instructions: 'Look at the text below. In 35 seconds, you must read this text aloud as naturally and clearly as possible.',
    prepTimeSeconds: 35,
    durationSeconds: 40,
    promptText: 'Quantum computing exploits the fundamental principles of quantum mechanics, utilizing superposition and entanglement to perform complex computations at speeds that exponentially surpass traditional silicon microprocessors.',
  },

  // 2. Repeat Sentence
  {
    id: 'acad-rs-1',
    type: 'REPEAT_SENTENCE',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Repeat Sentence - Academic Integrity',
    instructions: 'You will hear a sentence. Please repeat the sentence exactly as you hear it. You will hear the sentence only once.',
    durationSeconds: 15,
    promptText: 'Scholarly citations must be formatted accurately according to the departmental publication guidelines.',
  },

  // 3. Re-tell Lecture (PTE Academic Unique)
  {
    id: 'acad-rtl-1',
    type: 'RETELL_LECTURE',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Re-tell Lecture - Marine Ecosystem Acidification',
    instructions: 'You will hear a lecture. In 10 seconds, please speak into the microphone and retell what you have just heard in your own words.',
    prepTimeSeconds: 10,
    durationSeconds: 40,
    promptText: 'Ocean acidification occurs when atmospheric carbon dioxide dissolves into seawater, forming carbonic acid and decreasing oceanic pH levels. Marine biologists have documented that this chemical shift severely impedes coral calcification and disrupts calcareous shell formation among mollusks, destabilizing global aquatic trophic pyramids.',
  },

  // 4. Summarize Written Text
  {
    id: 'acad-swt-1',
    type: 'SUMMARIZE_WRITTEN_TEXT',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Summarize Written Text - Neural Plasticity',
    instructions: 'Read the passage below and summarize it using one sentence. You have 10 minutes to finish this task (5-75 words).',
    durationSeconds: 600,
    passageText: 'Neuroscientific investigations over the past quarter-century have disproven the longstanding dogma that the adult mammalian brain is functionally static. Through synaptic remodeling and dendritic arborization, neural networks retain structural plasticity well into senescence, actively reorganizing in response to experiential learning, cognitive rehabilitation, and targeted behavioral therapies.',
  },

  // 5. Write Essay (PTE Academic Unique)
  {
    id: 'acad-we-1',
    type: 'WRITE_ESSAY',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Write Essay - Automation and Higher Education',
    instructions: 'You will have 20 minutes to plan, write and revise an essay about the topic below (200–300 words).',
    durationSeconds: 1200,
    promptText: 'Some educators argue that universities should shift their curricula towards practical technical skills to prepare students for an automated workforce, while others believe that theoretical and liberal arts education remains essential. Discuss both views and give your own opinion.',
  },

  // 6. Reading: Re-order Paragraphs
  {
    id: 'acad-ro-1',
    type: 'REORDER_PARAGRAPHS',
    examMode: 'PTE_ACADEMIC',
    section: 'READING',
    title: 'Re-order Paragraphs - Renaissance Optics',
    instructions: 'The text boxes in the left panel have been placed in a random order. Restore the original order.',
    scrambledParagraphs: [
      { id: 'acad-ro-2', text: 'This mathematical innovation allowed painters to render three-dimensional space onto flat surfaces.' },
      { id: 'acad-ro-1', text: 'During the early Renaissance, Florentine architects developed formal geometric linear perspective.' },
      { id: 'acad-ro-4', text: 'Consequently, visual art experienced a profound aesthetic revolution across continental Europe.' },
      { id: 'acad-ro-3', text: 'Subsequent treatises by Alberti codified these optical principles into widespread artistic doctrine.' },
    ],
    correctParagraphOrder: ['acad-ro-1', 'acad-ro-2', 'acad-ro-3', 'acad-ro-4'],
  },

  // 7. Write from Dictation
  {
    id: 'acad-wfd-1',
    type: 'WRITE_FROM_DICTATION',
    examMode: 'PTE_ACADEMIC',
    section: 'LISTENING',
    title: 'Write from Dictation - Statistical Significance',
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it.',
    promptText: 'Quantitative research methodologies require rigorous empirical verification to establish statistical significance.',
  },
];
