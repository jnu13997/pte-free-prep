import React from 'react';
import { getClbDescription } from '../../services/scoring/clbMapping';

export interface ClbBadgeProps {
  skill: string;
  clbLevel: number;
}

export const ClbBadge: React.FC<ClbBadgeProps> = ({ skill, clbLevel }) => {
  const getBadgeColor = (level: number) => {
    if (level >= 9) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (level >= 7) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level >= 5) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div
      title={getClbDescription(clbLevel)}
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${getBadgeColor(
        clbLevel
      )}`}
    >
      <span className="capitalize">{skill}:</span>
      <span>CLB {clbLevel}</span>
    </div>
  );
};
