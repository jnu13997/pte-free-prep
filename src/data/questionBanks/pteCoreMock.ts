import { QuestionItem } from '../../types/exam';

export const pteCoreMockQuestions: QuestionItem[] = [
  // 1. Personal Introduction
  {
    id: 'core-intro-1',
    type: 'PERSONAL_INTRODUCTION',
    examMode: 'PTE_CORE',
    section: 'SPEAKING_WRITING',
    title: 'Personal Introduction',
    instructions: 'Read the prompt below. In 25 seconds, you must speak into the microphone to introduce yourself.',
    prepTimeSeconds: 25,
    durationSeconds: 60,
    promptText: 'Please introduce yourself. You could talk about your background, your family, your interests, or your goals for moving to Canada.',
  },

  // 2. Read Aloud
  {
    id: 'core-ra-1',
    type: 'READ_ALOUD',
    examMode: 'BOTH',
    section: 'SPEAKING_WRITING',
    title: 'Read Aloud - Urban Transportation',
    instructions: 'Look at the text below. In 35 seconds, you must read this text aloud as naturally and clearly as possible.',
    prepTimeSeconds: 35,
    durationSeconds: 40,
    promptText: 'Modern urban planning increasingly prioritizes integrated public transit networks over individual automobile reliance. Cities that invest in efficient rail, cycling corridors, and pedestrian zones demonstrate measurable reductions in carbon emissions and marked improvements in public health.',
  },

  // 3. Repeat Sentence
  {
    id: 'core-rs-1',
    type: 'REPEAT_SENTENCE',
    examMode: 'BOTH',
    section: 'SPEAKING_WRITING',
    title: 'Repeat Sentence - Library Services',
    instructions: 'You will hear a sentence. Please repeat the sentence exactly as you hear it. You will hear the sentence only once.',
    durationSeconds: 15,
    promptText: 'The main campus library will extend its opening hours during the upcoming examination period.',
  },

  // 4. Describe Image
  {
    id: 'core-di-1',
    type: 'DESCRIBE_IMAGE',
    examMode: 'BOTH',
    section: 'SPEAKING_WRITING',
    title: 'Describe Image - Canadian Energy Production',
    instructions: 'Look at the image below. In 25 seconds, please speak into the microphone and describe in detail what the image is showing.',
    prepTimeSeconds: 25,
    durationSeconds: 40,
    chartDescription: 'Bar chart showing provincial electricity generation: Hydroelectric represents 61%, Nuclear represents 15%, Wind and Solar represent 11%, Natural Gas represents 11%, and Coal represents 2%.',
  },

  // 5. Respond to a Situation (PTE Core Unique)
  {
    id: 'core-rts-1',
    type: 'RESPOND_TO_SITUATION',
    examMode: 'PTE_CORE',
    section: 'SPEAKING_WRITING',
    title: 'Respond to a Situation - Flight Delay Notice',
    instructions: 'Listen to and read a description of a situation. You will have 25 seconds to prepare. When you hear the beep, speak into the microphone.',
    prepTimeSeconds: 25,
    durationSeconds: 40,
    passageText: 'You are travelling on a business trip to Vancouver. Your connecting flight has just been delayed by four hours due to adverse weather conditions, meaning you will miss an important evening dinner meeting with a key client.',
    promptText: 'Call your client. Explain the travel delay, apologize for the inconvenience, and suggest rescheduling the meeting for breakfast the following morning.',
  },

  // 6. Answer Short Question
  {
    id: 'core-asq-1',
    type: 'ANSWER_SHORT_QUESTION',
    examMode: 'BOTH',
    section: 'SPEAKING_WRITING',
    title: 'Answer Short Question - Financial Terms',
    instructions: 'You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.',
    durationSeconds: 10,
    promptText: 'What document is issued by a vendor to a buyer requesting payment for goods or services supplied?',
    sampleAnswer: 'An invoice (or bill).',
  },

  // 7. Summarize Written Text
  {
    id: 'core-swt-1',
    type: 'SUMMARIZE_WRITTEN_TEXT',
    examMode: 'BOTH',
    section: 'SPEAKING_WRITING',
    title: 'Summarize Written Text - Telecommuting Trends',
    instructions: 'Read the passage below and summarize it using one sentence. You have 10 minutes to finish this task (between 5 and 75 words).',
    durationSeconds: 600,
    passageText: 'The widespread adoption of remote work has fundamentally transformed the contemporary workplace across industrialized nations. Initially accelerated by technological connectivity and global events, telecommuting has proven to offer sustained advantages, including reduced commute times, enhanced geographic flexibility for employers, and lower overhead costs for commercial office spaces. However, organizational analysts frequently caution that persistent remote arrangements can erode company culture, reduce spontaneous innovation, and exacerbate work-life boundary blurring if not managed with deliberate communication protocols.',
  },

  // 8. Write an Email (PTE Core Unique)
  {
    id: 'core-we-1',
    type: 'WRITE_EMAIL',
    examMode: 'PTE_CORE',
    section: 'SPEAKING_WRITING',
    title: 'Write an Email - Building Maintenance Complaint',
    instructions: 'Read the description of a situation below. Write an email to address the situation. You have 9 minutes. Write about 100 words (80–120 words).',
    durationSeconds: 540,
    passageText: 'You live in an apartment complex where the building elevator has been out of service for over two weeks, causing severe difficulty for elderly residents and delivery personnel.',
    options: [
      { id: 'b1', text: 'Explain the ongoing issue and how it affects building occupants' },
      { id: 'b2', text: 'Express dissatisfaction with previous maintenance response times' },
      { id: 'b3', text: 'Request an urgent completion date and an update for all tenants' },
    ],
  },

  // 9. Reading & Writing: Fill in the Blanks
  {
    id: 'core-rwfib-1',
    type: 'READING_WRITING_FILL_IN_BLANKS',
    examMode: 'BOTH',
    section: 'READING',
    title: 'Reading & Writing: Fill in the Blanks - Renewable Technologies',
    instructions: 'Below is a text with blanks. Click on each blank, a list of choices will appear. Select the appropriate answer choice for each blank.',
    passageText: 'Renewable energy infrastructure has undergone significant technological evolution over the past decade. Decreases in solar panel manufacturing costs have enabled widespread adoption across residential and commercial sectors. Furthermore, advancements in grid-scale battery storage now provide dependable backup power during intermittent generation intervals.',
    dropdownBlanks: [
      { index: 0, options: ['evolution', 'stagnation', 'deterioration', 'postponement'], correctIndex: 0 },
      { index: 1, options: ['widespread', 'occasional', 'reluctant', 'forbidden'], correctIndex: 0 },
      { index: 2, options: ['dependable', 'hazardous', 'temporary', 'fragile'], correctIndex: 0 },
    ],
  },

  // 10. Re-order Paragraphs
  {
    id: 'core-ro-1',
    type: 'REORDER_PARAGRAPHS',
    examMode: 'BOTH',
    section: 'READING',
    title: 'Re-order Paragraphs - Historical Cartography',
    instructions: 'The text boxes in the left panel have been placed in a random order. Restore the original order.',
    scrambledParagraphs: [
      { id: 'ro-3', text: 'Consequently, European maritime explorers gained unprecedented navigational accuracy across uncharted oceans.' },
      { id: 'ro-1', text: 'Early medieval European mapmakers prioritized religious symbolism over geographic accuracy.' },
      { id: 'ro-4', text: 'This marked the transition toward modern mathematical cartography.' },
      { id: 'ro-2', text: 'However, the fourteenth-century introduction of the magnetic compass revolutionized map production.' },
    ],
    correctParagraphOrder: ['ro-1', 'ro-2', 'ro-3', 'ro-4'],
  },

  // 11. Reading: Fill in the Blanks (Drag & Drop)
  {
    id: 'core-rfib-1',
    type: 'READING_FILL_IN_BLANKS',
    examMode: 'BOTH',
    section: 'READING',
    title: 'Reading: Fill in the Blanks - Ecosystem Restoration',
    instructions: 'In the text below some words are missing. Drag words from the box below to the appropriate place in the text.',
    passageText: 'Forest conservation projects play an essential role in preserving biological diversity. Reforestation efforts not only sequester atmospheric carbon but also protect fragile soil layers from erosion. When native species are reintroduced, ecological equilibrium is steadily restored.',
    dragDropWords: ['biological', 'sequester', 'fragile', 'equilibrium', 'destructive', 'abandoned'],
    targetGaps: [
      { index: 0, correctWord: 'biological' },
      { index: 1, correctWord: 'sequester' },
      { index: 2, correctWord: 'fragile' },
      { index: 3, correctWord: 'equilibrium' },
    ],
  },

  // 12. Multiple Choice, Single Answer (Reading)
  {
    id: 'core-mcqs-1',
    type: 'MULTIPLE_CHOICE_SINGLE_READING',
    examMode: 'BOTH',
    section: 'READING',
    title: 'Multiple Choice, Single Answer - Urban Biodiversity',
    instructions: 'Read the text and answer the multiple-choice question by selecting the correct response.',
    passageText: 'Recent biological field surveys in urban parklands indicate that introducing micro-wetlands significantly enhances local amphibian and pollinator populations. While municipal managers initially worried about maintenance expenses, ecological monitoring demonstrated that naturalized waterways require less seasonal mowing and pesticide application than conventional lawns.',
    promptText: 'According to the passage, what surprising financial benefit arose from micro-wetlands in city parks?',
    options: [
      { id: 'opt-a', text: 'They generated direct revenue through recreational fishing permits.' },
      { id: 'opt-b', text: 'They lowered ongoing maintenance costs by reducing lawn mowing and chemical treatments.', isCorrect: true },
      { id: 'opt-c', text: 'They eliminated the need for municipal park staff altogether.' },
      { id: 'opt-d', text: 'They were funded entirely by private botanical societies.' },
    ],
  },

  // 13. Summarize Spoken Text
  {
    id: 'core-sst-1',
    type: 'SUMMARIZE_SPOKEN_TEXT',
    examMode: 'BOTH',
    section: 'LISTENING',
    title: 'Summarize Spoken Text - Artificial Intelligence in Healthcare',
    instructions: 'You will hear a short lecture. Write a summary for a fellow student who was not present at the lecture. Write 50–70 words. You have 10 minutes.',
    durationSeconds: 600,
    promptText: 'Artificial intelligence diagnostic algorithms are demonstrating remarkable speed and accuracy in interpreting radiographic scans and MRI imaging. By rapidly scanning through tens of thousands of past pathology scans, machine learning models can identify micro-tumors and subtle vascular anomalies far earlier than standard manual evaluations. Nevertheless, clinical ethicists emphasize that AI should serve as an assistive decision-support tool rather than an autonomous replacement for trained medical physicians.',
  },

  // 14. Highlight Incorrect Words
  {
    id: 'core-hiw-1',
    type: 'HIGHLIGHT_INCORRECT_WORDS',
    examMode: 'BOTH',
    section: 'LISTENING',
    title: 'Highlight Incorrect Words - Climate Migration',
    instructions: 'You will hear a recording. Below is a transcript of the recording. Some words in the transcript differ from what the speaker said. Click on the words that are different.',
    transcript: 'Environmental economists observe that severe droughts are increasingly driving rural communities toward urban centers in search of agricultural stability.',
    incorrectWords: [
      { index: 2, originalWord: 'observe', spokenWord: 'conclude' },
      { index: 12, originalWord: 'agricultural', spokenWord: 'economic' },
    ],
  },

  // 15. Select Missing Word
  {
    id: 'core-smw-1',
    type: 'SELECT_MISSING_WORD',
    examMode: 'BOTH',
    section: 'LISTENING',
    title: 'Select Missing Word - Architectural Design',
    instructions: 'You will hear a recording about architecture. At the end of the recording the last word has been replaced by a beep. Select the correct option.',
    promptText: 'Sustainable architecture emphasizes building materials that reduce operational lifecycle emissions and foster long-term environmental [beep]',
    options: [
      { id: 'opt-1', text: 'degradation' },
      { id: 'opt-2', text: 'sustainability', isCorrect: true },
      { id: 'opt-3', text: 'conflict' },
      { id: 'opt-4', text: 'inconvenience' },
    ],
  },

  // 16. Write from Dictation
  {
    id: 'core-wfd-1',
    type: 'WRITE_FROM_DICTATION',
    examMode: 'BOTH',
    section: 'LISTENING',
    title: 'Write from Dictation - Assignment Submission',
    instructions: 'You will hear a sentence. Type the sentence in the box below exactly as you hear it. You will hear the sentence only once.',
    promptText: 'All international applicants must submit their verified documentation before the priority deadline.',
  },
];
