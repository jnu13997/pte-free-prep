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
