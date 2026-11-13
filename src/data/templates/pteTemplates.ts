export interface PteTemplateItem {
  id: string;
  category: string;
  examMode: 'BOTH' | 'PTE_CORE' | 'PTE_ACADEMIC';
  title: string;
  description: string;
  targetScore: string;
  templateContent: string;
  guidelines: string[];
}

export const pteStrategyTemplates: PteTemplateItem[] = [
  {
    id: 'di-universal',
    category: 'Speaking',
    examMode: 'BOTH',
    title: 'Describe Image - Universal 40-Second Formula',
    description: 'Works for bar charts, pie charts, line graphs, process diagrams, and maps to guarantee 80+ oral fluency and pronunciation.',
    targetScore: '79 - 90',
    templateContent: `1. Introduction (0 - 8s):
"The given image provides comprehensive information about [Topic / Chart Title]. It displays crucial metrics across various categories."

2. Key Trends & Highest Figure (8 - 20s):
"According to the visual presentation, it is clearly noticeable that the highest figure is represented by [Highest Category / Value], followed closely by [Second Highest Category]."

3. Lowest Figure & Comparison (20 - 30s):
"On the other hand, the lowest quantity is observed in [Lowest Category]. Significant fluctuations and variations can be observed throughout the timeline."

4. Conclusion (30 - 35s):
"In conclusion, it is evident from the chart that [Overall Trend / Main Takeaway] plays an essential role in this analysis."`,
    guidelines: [
      'Maintain continuous speech rhythm. Avoid hesitations or long pauses.',
      'Speak smoothly for 30–35 seconds and click "Next" immediately when finished.',
      'Even if you miss specific numbers, focus on smooth connector transitions.',
    ],
  },

  {
    id: 'rts-core',
    category: 'Speaking',
    examMode: 'PTE_CORE',
    title: 'Respond to a Situation - 4-Step Problem Resolution',
    description: 'Specialized template for PTE Core test-takers to communicate naturally in professional and social scenarios.',
    targetScore: 'CLB 8 - 10',
    templateContent: `1. Polite Greeting & Context:
"Hello [Name / Sir or Madam], this is [Your Name] calling regarding [the situation/order/reservation]."

2. State the Problem Clearly:
"I am calling to inform you that unfortunately [explain what went wrong, e.g., my flight has been delayed by two hours / our delivery arrived damaged]."

3. Express Empathy & Apology:
"I sincerely apologize for any inconvenience this sudden change may cause to your schedule."

4. Propose a Constructive Solution & Polite Closing:
"To resolve this matter, I would like to propose that we [reschedule our meeting / arrange a replacement]. Please let me know if this works for you. Thank you for your understanding."`,
    guidelines: [
      'Match your tone to the scenario (friendly for neighbors, professional for managers/clients).',
      'Address all parts of the prompt clearly within the 40-second recording window.',
      'Keep your voice calm, natural, and assertive.',
    ],
  },

  {
    id: 'we-core',
    category: 'Writing',
    examMode: 'PTE_CORE',
    title: 'Write an Email - 100-Word Structured Layout',
    description: 'Ensures full marks for form, vocabulary, and grammar in PTE Core within the 9-minute limit.',
    targetScore: 'CLB 9 - 10 (80 - 90)',
    templateContent: `Dear [Recipient Title/Name],

I am writing this email to bring to your immediate attention an issue regarding [Main Issue / Topic].

Firstly, [Address Bullet Point 1 with specific details]. This situation has caused significant disruption because [explain consequence].

Secondly, [Address Bullet Point 2]. Despite previous attempts to contact your office, the issue remains unresolved.

Therefore, I kindly request that you [Address Bullet Point 3 - propose immediate solution or deadline]. I would appreciate a prompt confirmation regarding this matter.

Yours sincerely,
[Your Name]`,
    guidelines: [
      'Target word count: exactly 90–110 words to stay safely within the 80–120 word boundary.',
      'Ensure every one of the 3 prompt bullet points is explicitly addressed in its own sentence.',
      'Check for standard punctuation and capitalization before submitting.',
    ],
  },

  {
    id: 'swt-universal',
    category: 'Writing',
    examMode: 'BOTH',
    title: 'Summarize Written Text - Compound-Complex Formula',
    description: 'Proven grammatical structure that produces a single sentence between 35 and 60 words.',
    targetScore: '79 - 90',
    templateContent: `"Although [Main Point 1 from paragraph 1], [Main Point 2 from paragraph 2], which not only [Impact or Cause], but also [Final Outcome or Implication]."

Example:
"Although continuous urbanization accelerates global economic productivity, it simultaneously places severe strain on regional biodiversity, which not only disrupts fragile natural ecosystems, but also demands immediate sustainable infrastructure reform."`,
    guidelines: [
      'MUST be exactly ONE single sentence ending with a single full stop.',
      'Stay strictly between 5 and 75 words (ideal is 40–55 words).',
      'Do not introduce personal opinions or external facts not present in the passage.',
    ],
  },

  {
    id: 'essay-academic',
    category: 'Writing',
    examMode: 'PTE_ACADEMIC',
    title: 'Write Essay - 4-Paragraph Balanced Framework',
    description: 'Bulletproof academic argumentative structure for achieving 85+ in PTE Academic Writing discourse.',
    targetScore: '79 - 90',
    templateContent: `Paragraph 1: Introduction (approx 45 words)
"In contemporary society, whether [Topic/Debate] has emerged as a subject of considerable controversy. While some individuals argue that [Viewpoint A], others contend that [Viewpoint B]. In my opinion, [Your Clear Thesis Statement]."

Paragraph 2: First Supporting Argument (approx 75 words)
"To begin with, there are compelling reasons to support the notion that [Viewpoint A]. Primary among these is that [Main Reason 1]. For example, empirical studies demonstrated that [Realistic Example]. Consequently, [Deduction or Result]."

Paragraph 3: Counter-Argument or Secondary Point (approx 75 words)
"On the other hand, opponents put forward the perspective that [Viewpoint B]. This is largely attributed to the fact that [Main Reason 2]. To illustrate, modern research reveals that [Second Example]. Hence, [Deduction]."

Paragraph 4: Conclusion (approx 40 words)
"In conclusion, although both viewpoints hold distinct validity, I firmly believe that [Restate Thesis in New Words]. Moving forward, balanced policies must be implemented to maximize positive societal outcomes."`,
    guidelines: [
      'Strictly write between 200 and 300 words (220–260 words is ideal).',
      'Proofread carefully during the final 3 minutes for spelling and grammatical agreement.',
    ],
  },
];
