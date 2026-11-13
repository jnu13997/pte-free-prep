export type CommunicativeSkill = 'speaking' | 'writing' | 'reading' | 'listening';

interface ClbThreshold {
  clb: number;
  minPte: number;
}

const CLB_THRESHOLDS: Record<CommunicativeSkill, ClbThreshold[]> = {
  speaking: [
    { clb: 10, minPte: 89 },
    { clb: 9, minPte: 84 },
    { clb: 8, minPte: 76 },
    { clb: 7, minPte: 68 },
    { clb: 6, minPte: 59 },
    { clb: 5, minPte: 51 },
    { clb: 4, minPte: 42 },
  ],
  listening: [
    { clb: 10, minPte: 89 },
    { clb: 9, minPte: 82 },
    { clb: 8, minPte: 71 },
    { clb: 7, minPte: 60 },
    { clb: 6, minPte: 50 },
    { clb: 5, minPte: 39 },
    { clb: 4, minPte: 28 },
  ],
  reading: [
    { clb: 10, minPte: 88 },
    { clb: 9, minPte: 78 },
    { clb: 8, minPte: 69 },
    { clb: 7, minPte: 60 },
    { clb: 6, minPte: 51 },
    { clb: 5, minPte: 42 },
    { clb: 4, minPte: 33 },
  ],
  writing: [
    { clb: 10, minPte: 90 },
    { clb: 9, minPte: 88 },
    { clb: 8, minPte: 79 },
    { clb: 7, minPte: 69 },
    { clb: 6, minPte: 60 },
    { clb: 5, minPte: 51 },
    { clb: 4, minPte: 41 },
  ],
};

export function mapPteToClb(pteScore: number, skill: CommunicativeSkill): number {
  const table = CLB_THRESHOLDS[skill];
  for (const entry of table) {
    if (pteScore >= entry.minPte) {
      return entry.clb;
    }
  }
  return 3; // Below CLB 4
}

export function getClbDescription(clbLevel: number): string {
  switch (clbLevel) {
    case 10:
      return 'CLB 10 - Initial Advanced Ability (Fully fluent in professional & complex contexts)';
    case 9:
      return 'CLB 9 - Initial Advanced Ability (Expresses ideas fluently for Canadian PR Express Entry high tier)';
    case 8:
      return 'CLB 8 - Fluent Intermediate Ability (Solid workplace and academic communication)';
    case 7:
      return 'CLB 7 - Adequate Intermediate Ability (Federal Skilled Worker minimum benchmark)';
    case 6:
      return 'CLB 6 - Developing Intermediate Ability (Everyday social and work communication)';
    case 5:
      return 'CLB 5 - Initial Intermediate Ability (Express Entry trade stream benchmark)';
    case 4:
      return 'CLB 4 - Basic Ability (Satisfies basic everyday communication)';
    default:
      return 'Below CLB 4 - Developing Basic English Proficiency';
  }
}
