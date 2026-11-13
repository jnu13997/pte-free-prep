# PTE Free Mock Test & AI Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, 100% free, open-source PTE (PTE Core & Academic) preparation and mock test web platform with authentic Pearson VUE interface simulation, real audio recording, hybrid deterministic/multimodal AI scoring, and automated GitHub Pages deployment.

**Architecture:** Client-side Single Page Application (SPA) using React 18, TypeScript, Tailwind CSS, and Vite. Implements custom Web Audio and Web Speech engines for microphone capture, prep beeps, silence detection, and speech transcription with zero backend cost. Integrates Pearson's cross-skill scoring matrix and optional user Gemini API key for multimodal examiner scoring.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Web Audio API, Web Speech API, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-13-pte-platform-design.md`

## Global Constraints
- Platform: Browser Web SPA, 100% free to host on GitHub Pages (`base: './'`).
- Zero required server backend: all evaluation, recording, and progress tracking must function fully client-side.
- UI Fidelity: Deep Pearson Navy (`#022340`), authentic banner instructions, status boxes with audio volume bars, exact word counters, and countdown timers.
- Exam Modes: Support both **PTE Core** (*Respond to a Situation*, *Write an Email*) and **PTE Academic** (*Re-tell Lecture*, *Write Essay*).
- AI Scoring: Dual-layer (Layer 1: instant in-browser heuristic/phonetic/WER algorithms; Layer 2: optional user-supplied Gemini API key for multimodal oral and essay feedback).

## Review Focus
1. Microphone silence cutoff: If a user stays silent for 3 seconds after recording begins, the recorder must auto-stop and mark recording complete.
2. Word counter boundaries: Summarize Written Text must enforce 5–75 words and single sentence rules; Write an Email approx 100 words; Write Essay 200–300 words.
3. Pearson cross-skill mapping: Tasks must award points to dual skills (e.g. Read Aloud -> Speaking + Reading; Write from Dictation -> Listening + Writing).
4. Audio one-time playback: Listening prompt audios must disable playback controls after one play to replicate real exam pressure.
5. GitHub Pages path resolution: Assets and links must resolve correctly under subpaths on `username.github.io/repo-name/`.

---

### Task 1: Project Scaffolding & Design System
**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Create: `src/components/layout/PearsonHeader.tsx`, `src/components/layout/PearsonFooter.tsx`
- Test: `tests/components/PearsonHeader.test.tsx`

**Interfaces:**
- Consumes: None (root configuration)
- Produces: Base React application with Pearson VUE navy design system, navigation header, and timer display.

- [ ] **Step 1: Write the failing test for PearsonHeader**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PearsonHeader } from '../../src/components/layout/PearsonHeader';

describe('PearsonHeader', () => {
  it('renders exam mode, question counter, section title, and timer', () => {
    render(
      <PearsonHeader
        examMode="PTE_CORE"
        currentSection="Speaking & Writing"
        questionIndex={2}
        totalQuestions={15}
        timeRemainingSeconds={540}
      />
    );
    expect(screen.getByText(/PTE Core/i)).toBeInTheDocument();
    expect(screen.getByText(/Question 3 of 15/i)).toBeInTheDocument();
    expect(screen.getByText(/09:00/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/PearsonHeader.test.tsx`
Expected: FAIL (modules not found)

- [ ] **Step 3: Initialize Vite project and implement layout components**
Configure Vite with `base: './'`, install dependencies (`react`, `react-dom`, `lucide-react`, `tailwindcss`, `vitest`, `@testing-library/react`), configure Tailwind palette with Pearson navy `#022340` and accent blue `#0071c5`. Implement `PearsonHeader` and `PearsonFooter`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/PearsonHeader.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add package.json vite.config.ts src/ tests/
git commit -m "feat: scaffold project with Pearson VUE design system"
```

---

### Task 2: Type Definitions, Cross-Skill Scoring Matrix & Question Models
**Files:**
- Create: `src/types/exam.ts`
- Create: `src/services/scoring/crossSkillMatrix.ts`
- Create: `src/services/scoring/clbMapping.ts`
- Test: `tests/services/crossSkillMatrix.test.ts`
- Test: `tests/services/clbMapping.test.ts`

**Interfaces:**
- Consumes: None
- Produces:
  - `computePteScores(rawScores: TaskRawScore[]): PteScoreReport`
  - `mapPteToClb(pteScore: number, skill: 'speaking' | 'writing' | 'reading' | 'listening'): number`

- [ ] **Step 1: Write failing tests for cross-skill matrix & CLB mapping**
```ts
import { describe, it, expect } from 'vitest';
import { computePteScores } from '../../src/services/scoring/crossSkillMatrix';
import { mapPteToClb } from '../../src/services/scoring/clbMapping';

describe('Cross-Skill Matrix', () => {
  it('aggregates cross-skill points correctly for Read Aloud to Speaking and Reading', () => {
    const report = computePteScores([
      { taskId: 'ra-1', taskType: 'READ_ALOUD', contentScore: 3, fluencyScore: 5, pronunciationScore: 5, maxContent: 3, maxFluency: 5, maxPronunciation: 5 }
    ]);
    expect(report.speaking).toBeGreaterThan(10);
    expect(report.reading).toBeGreaterThan(10);
  });

  it('maps PTE scores accurately to Canadian CLB levels', () => {
    expect(mapPteToClb(88, 'speaking')).toBe(10);
    expect(mapPteToClb(76, 'listening')).toBe(8);
    expect(mapPteToClb(60, 'writing')).toBe(7);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/services/crossSkillMatrix.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/types/exam.ts`, `crossSkillMatrix.ts`, and `clbMapping.ts`**
Define interfaces for all 19 task types (`TaskType`, `PteMode`, `QuestionItem`, `ExamState`). Implement points aggregation using Pearson's official cross-contribution weighting formula and CLB 4-10 scale tables.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/services/crossSkillMatrix.test.ts tests/services/clbMapping.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/types/ src/services/scoring/ tests/services/
git commit -m "feat: implement cross-skill scoring matrix and CLB mapping"
```

---

### Task 3: Web Audio Synth, Recording Engine & Speech Recognition
**Files:**
- Create: `src/services/audio/beepSynthesizer.ts`
- Create: `src/services/audio/recorderEngine.ts`
- Create: `src/services/audio/speechRecognition.ts`
- Test: `tests/services/audioEngine.test.ts`

**Interfaces:**
- Consumes: Web Audio API & Web Speech API
- Produces:
  - `playCountdownBeep(): Promise<void>`
  - `startRecording(onSilenceCutoff: () => void): Promise<MediaRecorder>`
  - `stopRecording(): Promise<Blob>`
  - `startTranscription(onResult: (text: string) => void): void`

- [ ] **Step 1: Write test for beep synthesizer and audio helpers**
```ts
import { describe, it, expect } from 'vitest';
import { calculateSpeechRateAndFluency } from '../../src/services/audio/recorderEngine';

describe('Audio Engine Utilities', () => {
  it('calculates fluency and words-per-minute accurately', () => {
    const result = calculateSpeechRateAndFluency('This is a test sentence spoken aloud clearly', 5.0, 0);
    expect(result.wpm).toBeGreaterThan(80);
    expect(result.fluencyScore).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/services/audioEngine.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Web Audio beep generator, silence detector, and SpeechRecognition wrapper**
Build oscillator-based 1000Hz prep tone, `MediaRecorder` pipeline with RMS volume thresholding to detect 3-second consecutive silence, and Web Speech API event listener.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/services/audioEngine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/services/audio/ tests/services/
git commit -m "feat: implement audio synthesizer, recording engine, and speech recognition"
```

---

### Task 4: Speaking Module Components
**Files:**
- Create: `src/components/speaking/SpeakingStatusBox.tsx`
- Create: `src/components/speaking/ReadAloudItem.tsx`
- Create: `src/components/speaking/RepeatSentenceItem.tsx`
- Create: `src/components/speaking/DescribeImageItem.tsx`
- Create: `src/components/speaking/RespondToSituationItem.tsx` (PTE Core)
- Create: `src/components/speaking/RetellLectureItem.tsx` (PTE Academic)
- Create: `src/components/speaking/AnswerShortQuestionItem.tsx`
- Test: `tests/components/SpeakingStatusBox.test.tsx`

**Interfaces:**
- Consumes: `beepSynthesizer`, `recorderEngine`, `speechRecognition`
- Produces: Interactive Speaking screen components with preparation countdown, recording progress bar, and volume indicator.

- [ ] **Step 1: Write failing test for SpeakingStatusBox**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpeakingStatusBox } from '../../src/components/speaking/SpeakingStatusBox';

describe('SpeakingStatusBox', () => {
  it('renders countdown phase and recording phase states', () => {
    const { rerender } = render(<SpeakingStatusBox status="COUNTDOWN" secondsLeft={15} volumeLevel={0} />);
    expect(screen.getByText(/Beginning in 15 seconds/i)).toBeInTheDocument();

    rerender(<SpeakingStatusBox status="RECORDING" secondsLeft={30} volumeLevel={45} />);
    expect(screen.getByText(/Recording/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/SpeakingStatusBox.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement SpeakingStatusBox and individual Speaking task components**
Create authentic Pearson "Recorded Answer" blue container, countdown timer, audio wave visualizer, and task views for Read Aloud, Repeat Sentence, Describe Image, Respond to Situation, Re-tell Lecture, and Answer Short Question.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/SpeakingStatusBox.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/speaking/ tests/components/
git commit -m "feat: implement speaking components with authentic status box"
```

---

### Task 5: Writing Module Components
**Files:**
- Create: `src/components/writing/WritingEditor.tsx`
- Create: `src/components/writing/SummarizeWrittenTextItem.tsx`
- Create: `src/components/writing/WriteEmailItem.tsx` (PTE Core)
- Create: `src/components/writing/WriteEssayItem.tsx` (PTE Academic)
- Test: `tests/components/WritingEditor.test.tsx`

**Interfaces:**
- Consumes: `src/types/exam.ts`
- Produces: Writing components with Pearson VUE Cut/Copy/Paste toolbar, live dynamic word count, and word limit constraint validators.

- [ ] **Step 1: Write failing test for WritingEditor**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WritingEditor } from '../../src/components/writing/WritingEditor';

describe('WritingEditor', () => {
  it('updates word count live and enforces word limits', () => {
    render(<WritingEditor minWords={5} maxWords={75} value="One two three" onChange={() => {}} />);
    expect(screen.getByText(/Total Word Count: 3/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/WritingEditor.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement WritingEditor and Writing task screens**
Implement authentic textarea with cut/copy/paste action buttons, word counter, Summarize Written Text (5–75 words single sentence validation), Write an Email (PTE Core: 100 words), and Write Essay (PTE Academic: 200–300 words).

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/WritingEditor.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/writing/ tests/components/
git commit -m "feat: implement writing components with word counters and Pearson controls"
```

---

### Task 6: Reading Module Components
**Files:**
- Create: `src/components/reading/ReadingWritingBlanksItem.tsx`
- Create: `src/components/reading/ReorderParagraphsItem.tsx`
- Create: `src/components/reading/ReadingBlanksDragDropItem.tsx`
- Create: `src/components/reading/ReadingMcqItem.tsx`
- Test: `tests/components/ReorderParagraphs.test.tsx`

**Interfaces:**
- Consumes: `src/types/exam.ts`
- Produces: In-line dropdown blanks, Re-order paragraphs with Up/Down and drag buttons, Word bank drag-and-drop, and Single/Multiple Choice items.

- [ ] **Step 1: Write failing test for ReorderParagraphs**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReorderParagraphsItem } from '../../src/components/reading/ReorderParagraphsItem';

describe('ReorderParagraphsItem', () => {
  it('renders target items and allows moving blocks between source and target lists', () => {
    const paragraphs = [
      { id: 'p1', text: 'Paragraph One' },
      { id: 'p2', text: 'Paragraph Two' }
    ];
    render(<ReorderParagraphsItem paragraphs={paragraphs} onChange={() => {}} />);
    expect(screen.getByText('Paragraph One')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/ReorderParagraphs.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement Reading components**
Build in-line dropdown blanks inside passage text, dual-panel Re-order Paragraphs (Source Panel -> Target Panel with Move Right/Left and Up/Down controls), drag-and-drop word bank for Reading Fill in Blanks, and Single/Multi MCQ checkboxes/radios.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/ReorderParagraphs.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/reading/ tests/components/
git commit -m "feat: implement reading components with interactive blanks and reorder controls"
```

---

### Task 7: Listening Module Components
**Files:**
- Create: `src/components/listening/AudioPlayerStatusBox.tsx`
- Create: `src/components/listening/SummarizeSpokenTextItem.tsx`
- Create: `src/components/listening/WriteFromDictationItem.tsx`
- Create: `src/components/listening/HighlightIncorrectWordsItem.tsx`
- Create: `src/components/listening/SelectMissingWordItem.tsx`
- Create: `src/components/listening/ListeningBlanksItem.tsx`
- Test: `tests/components/HighlightIncorrectWords.test.tsx`

**Interfaces:**
- Consumes: `src/types/exam.ts`, `beepSynthesizer`
- Produces: Listening task components with one-time audio player status bar, interactive word highlighter, and dictation input.

- [ ] **Step 1: Write failing test for HighlightIncorrectWords**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HighlightIncorrectWordsItem } from '../../src/components/listening/HighlightIncorrectWordsItem';

describe('HighlightIncorrectWordsItem', () => {
  it('highlights words with yellow background on click and unhighlights on second click', () => {
    render(<HighlightIncorrectWordsItem transcript="The climate changed rapidly" onChange={() => {}} />);
    const word = screen.getByText('climate');
    fireEvent.click(word);
    expect(word).toHaveClass('bg-yellow-200');
    fireEvent.click(word);
    expect(word).not.toHaveClass('bg-yellow-200');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/HighlightIncorrectWords.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement Listening components and AudioPlayerStatusBox**
Build Pearson audio status box ("Current status: Playing in X seconds", progress bar), Summarize Spoken Text (50–70 words), Write from Dictation, Highlight Incorrect Words, Select Missing Word, and Listening Fill in Blanks with inline text inputs.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/HighlightIncorrectWords.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/listening/ tests/components/
git commit -m "feat: implement listening components with one-time audio player and highlighter"
```

---

### Task 8: Mock Exam State Machine & Hybrid Timer Runner
**Files:**
- Create: `src/services/exam/examRunnerState.ts`
- Create: `src/data/questionBanks/pteCoreMock.ts`
- Create: `src/data/questionBanks/pteAcademicMock.ts`
- Create: `src/components/exam/ExamRunner.tsx`
- Test: `tests/services/examRunnerState.test.ts`

**Interfaces:**
- Consumes: Task 4, 5, 6, 7 components
- Produces: Complete full-length timed mock test orchestrator with per-item timers for Speaking & Writing and pooled section timers for Reading & Listening.

- [ ] **Step 1: Write failing test for exam state machine**
```ts
import { describe, it, expect } from 'vitest';
import { createExamSession, advanceQuestion } from '../../src/services/exam/examRunnerState';
import { pteCoreMockQuestions } from '../../src/data/questionBanks/pteCoreMock';

describe('Exam Runner State Machine', () => {
  it('initializes session and transitions between sections properly', () => {
    const session = createExamSession('PTE_CORE', pteCoreMockQuestions);
    expect(session.currentSectionIndex).toBe(0);
    expect(session.questions.length).toBeGreaterThan(10);
    const nextSession = advanceQuestion(session, { taskId: 'q1', rawResponse: 'response' });
    expect(nextSession.currentQuestionIndex).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/services/examRunnerState.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement question banks, session state machine, and ExamRunner view**
Populate high-quality curated sample questions for all 19 task types across both PTE Core and Academic. Implement hybrid timing logic and section navigation with Pearson confirmation modals.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/services/examRunnerState.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/services/exam/ src/data/questionBanks/ src/components/exam/ tests/services/
git commit -m "feat: implement exam runner state machine and curated question banks"
```

---

### Task 9: AI Scoring Engine & Diagnostic Scorecard Report
**Files:**
- Create: `src/services/scoring/deterministicScorer.ts`
- Create: `src/services/scoring/geminiScorer.ts`
- Create: `src/components/scorecard/ScoreReportView.tsx`
- Create: `src/components/scorecard/ClbBadge.tsx`
- Test: `tests/services/deterministicScorer.test.ts`

**Interfaces:**
- Consumes: `crossSkillMatrix`, `clbMapping`
- Produces: Instant client-side scoring + optional Gemini multimodal analysis + Pearson diagnostic score report view.

- [ ] **Step 1: Write failing test for deterministic text & speech evaluation**
```ts
import { describe, it, expect } from 'vitest';
import { scoreReadAloud, scoreSummarizeText } from '../../src/services/scoring/deterministicScorer';

describe('Deterministic Scorer', () => {
  it('evaluates Read Aloud using WER and keyword coverage', () => {
    const target = 'The solar system consists of the sun and celestial bodies';
    const spoken = 'The solar system consists of the sun and celestial objects';
    const score = scoreReadAloud(target, spoken, 6.0);
    expect(score.contentScore).toBeGreaterThanOrEqual(2);
    expect(score.pronunciationScore).toBeGreaterThanOrEqual(3);
  });

  it('penalizes Summarize Text if outside 5-75 words or multiple sentences', () => {
    const score = scoreSummarizeText('Too short.', 'Reference text passage here');
    expect(score.formScore).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/services/deterministicScorer.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement deterministic scorer, Gemini client caller, and ScoreReportView**
Implement phonetic/Levenshtein matching, keyword density, grammar heuristic scoring, Gemini 1.5/2.0 API connector (supporting audio base64 payload), and official Pearson-style score report displaying Overall Score (10–90), Communicative Skills, Enabling Skills, and Canadian CLB mapping.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/services/deterministicScorer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/services/scoring/ src/components/scorecard/ tests/services/
git commit -m "feat: implement dual AI scoring engines and official diagnostic scorecard"
```

---

### Task 10: Learning Center, Template Library & Practice Drill Mode
**Files:**
- Create: `src/components/learning/LearningCenter.tsx`
- Create: `src/components/learning/TemplateLibrary.tsx`
- Create: `src/components/learning/ClbCalculator.tsx`
- Create: `src/data/templates/pteTemplates.ts`
- Test: `tests/components/ClbCalculator.test.tsx`

**Interfaces:**
- Consumes: Question banks and CLB tables
- Produces: Free study hub with proven templates (Describe Image, Email, Essay, Retell/Situation), interactive CLB calculator, and single-task drill modes.

- [ ] **Step 1: Write failing test for ClbCalculator**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClbCalculator } from '../../src/components/learning/ClbCalculator';

describe('ClbCalculator', () => {
  it('computes overall CLB level from four skill scores', () => {
    render(<ClbCalculator />);
    expect(screen.getByText(/Canadian Language Benchmark/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/components/ClbCalculator.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement TemplateLibrary, ClbCalculator, and LearningCenter**
Add copy-to-clipboard proven templates (Describe Image, Write an Email for Core, Write Essay for Academic, Summarize Written Text), tips, strategy guides, and drill modes allowing users to practice any of the 19 task types individually with immediate AI scoring.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/components/ClbCalculator.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/learning/ src/data/templates/ tests/components/
git commit -m "feat: implement learning center, templates, and CLB calculator"
```

---

### Task 11: Main App Navigation, GitHub Pages Deployment & Documentation
**Files:**
- Modify: `src/App.tsx`
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Test: Build verification (`npm run build`)

**Interfaces:**
- Consumes: All views (Mock Exam, Practice Drill, Learning Hub, Settings/API Key)
- Produces: Production-ready build deployed to GitHub Pages via GitHub Actions.

- [ ] **Step 1: Connect all modules in `src/App.tsx` with tabbed navigation and settings modal**
Create navigation between: Full Mock Exam (PTE Core & Academic), Practice by Question Type, Learning Hub & Templates, and Settings (Gemini API Key input with secure localStorage storage).

- [ ] **Step 2: Create automated GitHub Actions workflow `.github/workflows/deploy.yml`**
Configure checkout, Node 20 setup, `npm ci`, `npm run build`, and GitHub Pages deploy action.

- [ ] **Step 3: Write comprehensive `README.md`**
Provide clear instructions on how to use the app, how to run locally (`npm run dev`), how to publish to GitHub Pages for free, and how the dual-layer AI scoring functions.

- [ ] **Step 4: Run full test suite and production build**
Run: `npx vitest run` and `npm run build`
Expected: All tests pass and `dist/` is generated cleanly without errors.

- [ ] **Step 5: Commit**
```bash
git add src/App.tsx .github/ README.md
git commit -m "feat: finalize app navigation, GitHub Pages deploy workflow, and documentation"
```
