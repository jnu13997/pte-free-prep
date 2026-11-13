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
    promptAudioUrl: './audio/prompts/acad-rs-1.mp3',
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
    promptAudioUrl: './audio/prompts/acad-rtl-1.mp3',
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

  // 7. Reading & Writing: Fill in the Blanks
  {
    id: 'acad-rwfib-1',
    type: 'READING_WRITING_FILL_IN_BLANKS',
    examMode: 'PTE_ACADEMIC',
    section: 'READING',
    title: 'Reading & Writing: Fill in the Blanks - Astrophysics',
    instructions: 'Below is a text with blanks. Click on each blank, a list of choices will appear. Select the appropriate answer choice for each blank.',
    passageText: 'Gravitational wave astronomy has provided researchers with novel insights into stellar evolution. Detectors such as LIGO have recorded signals from binary black hole ___ with exceptional sensitivity. These empirical observations confirm long-standing predictions postulated in Einstein\'s general theory of relativity, while simultaneously ___ new avenues for observing previously undetectable cosmic events. Further instrumentation upgrades are expected to significantly ___ our observational event horizon.',
    dropdownBlanks: [
      { index: 0, options: ['mergers', 'collisions', 'divergences', 'suspensions'], correctIndex: 0 },
      { index: 1, options: ['opening', 'terminating', 'restricting', 'distorting'], correctIndex: 0 },
      { index: 2, options: ['expand', 'compress', 'obstruct', 'terminate'], correctIndex: 0 },
    ],
  },

  // 8. Reading: Fill in the Blanks (Drag & Drop)
  {
    id: 'acad-rfib-1',
    type: 'READING_FILL_IN_BLANKS',
    examMode: 'PTE_ACADEMIC',
    section: 'READING',
    title: 'Reading: Fill in the Blanks - Paleoclimatology',
    instructions: 'In the text below some words are missing. Drag words from the box below to the appropriate place in the text.',
    passageText: 'Ice core samples extracted from the Antarctic ice sheet offer invaluable ___ into historical atmospheric composition. Trapped gas bubbles allow geochemists to reconstruct past temperature ___ over hundreds of millennia. By establishing these ancient baseline measurements, climatologists can more accurately evaluate the velocity of modern anthropogenic climate ___.',
    dragDropWords: ['insights', 'fluctuations', 'change', 'illusions', 'stability', 'evaporation'],
    targetGaps: [
      { index: 0, correctWord: 'insights' },
      { index: 1, correctWord: 'fluctuations' },
      { index: 2, correctWord: 'change' },
    ],
  },

  // 9. Answer Short Question
  {
    id: 'acad-asq-1',
    type: 'ANSWER_SHORT_QUESTION',
    examMode: 'PTE_ACADEMIC',
    section: 'SPEAKING_WRITING',
    title: 'Answer Short Question - Economics',
    instructions: 'You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.',
    durationSeconds: 10,
    promptText: 'What term describes an economic system where prices are determined by unrestricted competition between privately owned businesses?',
    sampleAnswer: 'free market or market economy',
  },

  // 10. Listening: Fill in the Blanks
  {
    id: 'acad-lfib-1',
    type: 'LISTENING_FILL_IN_BLANKS',
    examMode: 'PTE_ACADEMIC',
    section: 'LISTENING',
    title: 'Listening: Fill in the Blanks - Cellular Metabolism',
    instructions: 'You will hear a recording. Type the missing words in each blank.',
    passageText: 'Mitochondrial organelles convert dietary nutrients into cellular ___ through oxidative phosphorylation. Enzymatic complexes facilitate chemical reactions that generate metabolic ___. When cellular stress occurs, apoptosis pathways are ___ activated.',
    transcript: 'Mitochondrial organelles convert dietary nutrients into cellular energy through oxidative phosphorylation. Enzymatic complexes facilitate chemical reactions that generate metabolic intermediates. When cellular stress occurs, apoptosis pathways are subsequently activated.',
    targetGaps: [
      { index: 0, correctWord: 'energy' },
      { index: 1, correctWord: 'intermediates' },
      { index: 2, correctWord: 'subsequently' },
    ],
  },

  // 11. Write from Dictation
  {
    id: 'acad-wfd-1',
    type: 'WRITE_FROM_DICTATION',
    examMode: 'PTE_ACADEMIC',
    section: 'LISTENING',
    title: 'Write from Dictation - Statistical Significance',
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it.',
    promptText: 'Quantitative research methodologies require rigorous empirical verification to establish statistical significance.',
    promptAudioUrl: './audio/prompts/acad-wfd-1.mp3',
  },
];
