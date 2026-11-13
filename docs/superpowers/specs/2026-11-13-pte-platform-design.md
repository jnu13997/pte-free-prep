# PTE Free Mock Test & AI Learning Platform - Design Specification

**Date:** 2026-11-13  
**Status:** Approved Specification  
**Target Platform:** Web (Static SPA deployable to GitHub Pages)  
**License:** Open Source (MIT)

---

## 1. Executive Summary & Intent

### 1.1 Intent & The "Why"
PTE (Pearson Test of English), including **PTE Core** (for Canadian immigration/PR) and **PTE Academic** (for international study and work visas), is a high-stakes, computer-delivered English proficiency examination. Official practice tests charge recurring fees ($30–$100+ per test) and lock test questions behind paywalls. Furthermore, many free web tools fail to replicate the exact Pearson VUE testing interface and timed stress conditions.

This project delivers a **100% free, open-source, production-grade PTE preparation web platform** designed to be hosted directly on GitHub Pages with zero operational server cost. It provides:
1. **Full-Length Timed Mock Tests** and **Targeted Practice Modes** for both **PTE Core** and **PTE Academic**.
2. **Authentic Pearson VUE Interface Simulation** (exact color schemes, status boxes, countdown beeps, audio player states, 3-second microphone silence detection, word counters, and navigation controls).
3. **Dual-Layer AI Scoring Engine**:
   - **Layer 1 (Free In-Browser Engine):** Client-side Web Speech API transcription, Levenshtein distance, Word Error Rate (WER), keyword extraction, and grammar/spelling heuristics.
   - **Layer 2 (Enhanced Multimodal AI Examiner):** Optional user-supplied Gemini API key (stored securely in `localStorage`) accepting direct multimodal audio recordings and text to deliver official rubric scoring (Content, Oral Fluency, Pronunciation, Grammar, Vocabulary, Spelling) mapped to the PTE 10–90 scale and Canadian Language Benchmark (CLB 4–10).
4. **Learning & Strategy Hub**: Proven test-taking templates (Describe Image, Email, Essay, Summarize Written Text), time-management guides, and scoring rubrics.

---

## 2. Goals, Non-Goals & Anti-Goals

### 2.1 Goals
- Replicate all 19+ PTE task types across Speaking, Writing, Reading, and Listening.
- Provide full support for **PTE Core** (including *Respond to a Situation* and *Write an Email*) and **PTE Academic** (including *Re-tell Lecture* and *Write Essay*).
- Zero server backend required: audio recording, playback, speech recognition, scoring, and progress tracking run client-side.
- 100% free hosting compatibility with GitHub Pages, Cloudflare Pages, Vercel, or Netlify.
- Detailed score report generation mirroring Pearson's official diagnostic scorecard with cross-skill distribution and CLB mapping.
- Desktop-first responsive design matching Pearson VUE test centers.

### 2.2 Non-Goals
- Hosting a centralized multi-tenant database of user accounts (progress is preserved locally via browser `localStorage` and exportable as JSON).
- Requiring paid server infrastructure.
- Infringing copyrighted test bank items (all sample questions and passages are original or open educational resources).

### 2.3 Anti-Goals
- Do not create a generic quiz app: the UI must faithfully simulate the official Pearson VUE computer-based exam ergonomics.
- Do not make external API keys mandatory: the platform must function out-of-the-box with immediate client-side AI scoring.

---

## 3. Builder Architectural Decisions & Specifications

The following engineering decisions have been established to ensure maximum fidelity and technical robustness:

### 3.1 Audio Prompt Delivery Architecture
- **Dual Delivery Strategy:**
  - **Curated Mock Exams:** Curated audio clips for listening and speaking prompts (*Repeat Sentence*, *Select Missing Word*, *Write from Dictation*, *Highlight Incorrect Words*, *Re-tell Lecture*) utilize clean pre-rendered audio assets (stored under `public/audio/` in lightweight MP3 format) to ensure authentic regional accents (Australian, British, North American) and precise millisecond timing for beeped-out words.
  - **Dynamic Practice & Custom Items:** Utilizes browser `SpeechSynthesis` with rate/pitch control as an automatic fallback when no pre-recorded audio asset exists for user-created practice items.

### 3.2 Client-Side Browser Speech Recognition Support
- Uses browser `webkitSpeechRecognition` / `SpeechRecognition` supported out-of-the-box in Chrome, Edge, Safari, and Chromium-based browsers.
- Clear non-blocking banner detection for Firefox or unsupported browsers with graceful fallback to manual transcription entry.
- Runs without any custom backend server, ensuring zero hosting costs on GitHub Pages.

### 3.3 Multimodal Audio AI Scoring (Layer 2)
- When a user inputs their free Gemini API key, speaking tasks (*Describe Image*, *Respond to a Situation*, *Re-tell Lecture*, *Read Aloud*) capture the raw user audio via `MediaRecorder` (`audio/webm` or `audio/mp4`), encode to base64, and transmit it directly to Gemini's multimodal API.
- Enables genuine assessment of **Oral Fluency** (rhythm, hesitation, pace) and **Pronunciation** (phonetics, stress), alongside Content and Grammar.
- When no API key is supplied, Layer 1 handles scoring immediately using client-side speech recognition text comparison + audio pause and duration analysis.

### 3.4 Authentic Pearson Hybrid Timing & Navigation State Machine
- **Speaking:** Strict per-item prep countdown (25s–40s), beep tone, recording window (15s–40s), 3-second silence auto-cutoff, auto-advance or clean "Next" advance.
- **Writing:** Strict per-item countdown timers (*Summarize Written Text* = 10 mins each; *Write an Email* = 9 mins; *Write Essay* = 20 mins) with no time rollover between items.
- **Reading & Listening:** Section-pooled countdown timers (e.g. 27–32 minutes total for Reading), allowing test-takers to navigate between questions within the section.

### 3.5 Cross-Skill Credit Allocation Matrix
- Faithful replication of Pearson's integrated scoring matrix:
  - *Read Aloud* awards points to both **Speaking** and **Reading**.
  - *Repeat Sentence* awards points to both **Listening** and **Speaking**.
  - *Summarize Written Text* awards points to both **Reading** and **Writing**.
  - *Re-tell Lecture / Respond to Situation* awards points to **Listening** and **Speaking**.
  - *Summarize Spoken Text* awards points to **Listening** and **Writing**.
  - *Highlight Incorrect Words* awards points to **Listening** and **Reading**.
  - *Write from Dictation* awards points to **Listening** and **Writing**.
- Outputs both Communicative Skills (10–90) and Enabling Skills (Fluency, Pronunciation, Grammar, Vocabulary, Spelling), directly mapped to **Canadian Language Benchmark (CLB 4–10)**.

---

## 4. Exam Specifications & Question Types

The platform supports both **PTE Core** and **PTE Academic** across 3 timed exam parts:

### Part 1: Speaking & Writing (Combined: 50–65 mins)
| Task Type | Exam Type | Time/Constraints | Interactive Mechanic |
|---|---|---|---|
| **Personal Introduction** | Core & Academic | 25s prep, 30s record | Audio record, unscored warm-up |
| **Read Aloud** | Core & Academic | 35–40s prep, 40s record | Text display + live voice capture |
| **Repeat Sentence** | Core & Academic | Audio clip (3–9s), 15s record | Audio play once, no prep tone, instant record |
| **Describe Image** | Core & Academic | 25s prep, 40s record | Graph/chart/image + audio recording |
| **Respond to a Situation** | **PTE Core** | 25s prep, 40s record | Audio/text scenario prompt + response |
| **Re-tell Lecture** | **PTE Academic** | Audio clip (60–90s), 10s prep, 40s record | Audio play + image + note-taking box + record |
| **Answer Short Question** | Core & Academic | Audio prompt (3–9s), 10s record | Audio play + 1-2 word voice answer |
| **Summarize Written Text** | Core & Academic | 10 mins timed | Text passage + single-sentence box (5–75 words) |
| **Write an Email** | **PTE Core** | 9 mins timed | Scenario prompt + email composer (approx 100 words) |
| **Write Essay** | **PTE Academic** | 20 mins timed | Essay prompt + text editor (200–300 words) |

### Part 2: Reading (27–37 mins)
| Task Type | Exam Type | Interactive Mechanic |
|---|---|---|
| **Reading & Writing: Fill in Blanks** | Core & Academic | In-line interactive dropdown menus within passage |
| **Multiple Choice, Multiple Answer** | Core & Academic | Checkbox selection with partial credit scoring |
| **Re-order Paragraphs** | Core & Academic | Scrambled text blocks with Drag-and-Drop + Up/Down ordering buttons |
| **Reading: Fill in the Blanks** | Core & Academic | Word bank drag-and-drop into target text gaps |
| **Multiple Choice, Single Answer** | Core & Academic | Radio button selection |

### Part 3: Listening (22–37 mins)
| Task Type | Exam Type | Interactive Mechanic |
|---|---|---|
| **Summarize Spoken Text** | Core & Academic | Audio prompt (60–90s) + 10 min timer + 50–70 word summary |
| **Multiple Choice, Multiple Answer** | Core & Academic | Audio playback once + multi-select checkboxes |
| **Fill in the Blanks** | Core & Academic | Audio playback once + transcript with editable text input blanks |
| **Highlight Correct Summary** | Core & Academic | Audio playback once + choose single paragraph summary |
| **Multiple Choice, Single Answer** | Core & Academic | Audio playback once + radio button option |
| **Select Missing Word** | Core & Academic | Audio with final word beeped out + radio button choice |
| **Highlight Incorrect Words** | Core & Academic | Clickable words in transcript that turn yellow/highlighted on click |
| **Write from Dictation** | Core & Academic | Audio sentence spoken once + verbatim text input box |

---

## 5. User Interface & Pearson VUE Ergonomics

The application interface strictly adheres to official Pearson VUE test conventions:
1. **Header Bar:**
   - Deep Pearson Navy (`#022340`) background.
   - Left: Platform Branding & Test Mode indicator (PTE Core / PTE Academic).
   - Center: Current Item ("Question X of Y") and Section Name.
   - Right: "Time Remaining" countdown timer with warning highlight under 5 minutes.
2. **Instruction Banner:**
   - Official styling with clear bold instruction header.
3. **Speaking Audio Box:**
   - Status header: **Recorded Answer**
   - Current status: **"Current status: Beginning in X seconds"** -> Beep sound -> **"Current status: Recording"** (with live blue progress bar).
   - Live microphone volume meter.
   - **3-Second Silence Rule**: Automatically cuts off recording if no voice activity is detected for 3 seconds.
   - Manual **"Next"** button cuts off recording cleanly.
4. **Writing Editor Controls:**
   - Word count counter dynamically updated on keystroke.
   - Cut, Copy, Paste utility buttons matching the exam screen.
5. **Navigation & Flow:**
   - "Next" button in bottom right.
   - Section transition warning dialogs.
   - Diagnostic Score Report screen with overall score (10–90), communicative skills, enabling skills, and Canadian CLB level equivalencies.

---

## 6. Learning, Templates & Practice Center

A dedicated section accessible without entering a full mock test:
- **Practice by Question Type:** Drill individual question types with immediate AI evaluation.
- **Template Library:**
  - *Describe Image:* 3-step structured template (Introduction, Key Trends/Extremes, Conclusion).
  - *Respond to Situation (PTE Core):* Polite greeting, reason for speaking, proposed resolution, polite closing.
  - *Summarize Written Text:* Formula for crafting single complex/compound sentences under 75 words.
  - *Write an Email (PTE Core):* Formal and informal email templates with bullet-point address guidelines.
  - *Write Essay (PTE Academic):* 4-paragraph argumentative and problem-solution templates.
- **CLB & Score Conversion Table:** Interactive mapping between PTE Core scores, CLB Levels (4–10), and IELTS/CELPIP equivalencies.

---

## 7. Technology Stack & GitHub Pages Deployment

- **Framework:** React 18 with TypeScript.
- **Bundler:** Vite (configured with relative `base: './'` for clean GitHub Pages asset resolution).
- **Styling:** Tailwind CSS (customized for Pearson VUE color palette: `#022340`, `#0071c5`, `#f4f6f8`).
- **Icons:** Lucide React.
- **Audio Processing:** Web Audio API (synthesizer beeps, microphone volume visualizer) + HTML5 Audio.
- **Storage:** Browser `localStorage` for test attempts, scores, and optional API key.
- **Deployment:** GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated building and publishing to `gh-pages`.
