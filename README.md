# PTE Free Prep - Official Mock Test & AI Learning Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/actions/deploy-pages/actions/workflows/pages.yml/badge.svg)](https://pages.github.com/)

A **100% free, open-source, full-length PTE (Pearson Test of English) preparation and mock exam platform** built for test-takers worldwide preparing for **Canadian Immigration / PR (PTE Core)** and **International University Admissions / Visas (PTE Academic)**.

Deployable **100% free to GitHub Pages** with **zero server backend or operational fees**.

---

## 🌟 Key Features

### 1. Authentic Pearson VUE Testing Interface
- **Exact Layout & Ergonomics:** Pearson deep navy theme (`#022340`), split navigation, section titles, item countdowns, and official instruction headers.
- **Real Audio Recording Engine:** Preparation countdown (25s–40s), 1000Hz synthesizer beep tone, live microphone waveform volume visualizer, and the **official 3-second silence auto-cutoff**.
- **One-Time Audio Playback:** Authentic listening audio player with strict one-time playback constraints and volume sliders.
- **Pearson Editor Controls:** Integrated Cut, Copy, and Paste toolbar buttons with live dynamic word count tracking.

### 2. Dual Exam Mode Support
- **PTE Core (Canadian Immigration & Work):**
  - *Respond to a Situation* (PTE Core unique speaking task)
  - *Write an Email* (9 minutes, 100 words, 3 prompt bullet points)
  - *Summarize Spoken Text* (50–70 words)
- **PTE Academic (Study Abroad & Global Visas):**
  - *Re-tell Lecture* (with interactive note-taking scratchpad)
  - *Write Essay* (20 minutes, 200–300 words)

### 3. Dual-Layer AI Scoring Engine
- **Layer 1: 100% Free In-Browser Engine (Instant & Offline-Capable):**
  - Real-time speech-to-text via browser Web Speech API.
  - Levenshtein phonetic distance & Word Error Rate (WER) scoring.
  - Oral fluency calculation based on words-per-minute (WPM) and hesitation pause detection.
  - Word boundary enforcement, grammar heuristics, and adjacent pair scoring for Re-order Paragraphs.
- **Layer 2: Enhanced Multimodal AI Examiner (Optional):**
  - Test-takers can optionally supply their free personal **Google Gemini API Key** (saved strictly in private browser `localStorage`).
  - Sends raw audio recordings to Gemini for genuine acoustic pronunciation, oral stress, and detailed examiner remarks.

### 4. Official Diagnostic Score Report & CLB Converter
- Pearson 10–90 scale score distribution across **Listening, Reading, Speaking, and Writing**.
- Enabling skills breakdown: **Grammar, Oral Fluency, Pronunciation, Spelling, Vocabulary, and Written Discourse**.
- Full automatic mapping to **Canadian Language Benchmark (CLB 4 to CLB 10)** for Express Entry (FSWP, CEC, PNP).
- One-click **Print / Save as PDF** scorecard generation.

### 5. Learning Center & Proven Templates
- **Describe Image Formula:** 40-second universal 3-step formula for bar charts, maps, line graphs, and processes.
- **Respond to Situation Framework:** 4-step communication template for workplace and social scenarios.
- **Summarize Written Text Formula:** Compound-complex sentence structure guaranteed to produce 35–60 words in a single sentence.
- **Write an Email Framework:** 100-word template with prompt bullet point integration.
- **Write Essay Framework:** 4-paragraph balanced academic structure.
- **Interactive CLB Calculator:** Instant score converter from PTE to Canadian CLB tiers.

---

## 🚀 How to Publish to GitHub Pages for Free

Anyone can fork or publish this platform to GitHub Pages in under 2 minutes with **zero hosting costs**:

1. **Push this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of PTE prep platform"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your Repository Settings**:
   - Go to your repository on GitHub.
   - Click **Settings** ➔ **Pages** (under Code and automation).
   - Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.

3. **That's it!** The included `.github/workflows/deploy.yml` workflow will automatically test, build, and publish your website to:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

## 💻 Local Development & Testing

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed:

```bash
# Clone the repository
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd "PTE Core"

# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit & functional test suite
npm test

# Build production assets for deployment
npm run build
```

---

## 📂 Project Architecture

```
PTE Core/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── docs/
│   └── superpowers/
│       ├── specs/                # Full design specification document
│       └── plans/                # Step-by-step implementation plan
├── src/
│   ├── components/
│   │   ├── exam/                 # Full Mock Exam runner & state machine
│   │   ├── layout/               # Pearson VUE Header & Footer
│   │   ├── learning/             # Study Hub, Templates & CLB Calculator
│   │   ├── listening/            # Listening task components & audio player
│   │   ├── reading/              # Reading dropdowns, drag-and-drop & MCQs
│   │   ├── scorecard/            # Diagnostic scorecard & CLB badges
│   │   ├── speaking/             # Recorded Answer box & Speaking components
│   │   └── writing/              # Writing editor with word counters
│   ├── data/
│   │   ├── questionBanks/        # Curated mock question banks (Core & Academic)
│   │   └── templates/            # Proven high-scoring PTE templates
│   ├── services/
│   │   ├── audio/                # Beep synthesizer, recorder & speech recognition
│   │   ├── exam/                 # Session state machine & timing controller
│   │   └── scoring/              # Cross-skill matrix, deterministic & Gemini AI
│   ├── types/                    # TypeScript interfaces for all PTE tasks
│   ├── App.tsx                   # Main navigation shell & modal controller
│   ├── index.css                 # Tailwind & typography styling
│   └── main.tsx                  # Application entry point
├── tests/                        # Vitest automated test suites
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 📄 License & Disclaimer

This project is open-source under the [MIT License](LICENSE).

*Disclaimer: This project is an independent educational training simulator created for students and immigrants. It is not affiliated with, authorized, or endorsed by Pearson PLC or Pearson VUE. PTE is a registered trademark of Pearson PLC.*
