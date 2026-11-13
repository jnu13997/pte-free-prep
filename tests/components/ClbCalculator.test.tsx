import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClbCalculator } from '../../src/components/learning/ClbCalculator';

describe('ClbCalculator', () => {
  it('computes Canadian Language Benchmark (CLB) levels dynamically as PTE scores change', () => {
    render(<ClbCalculator />);
    expect(screen.getByText(/Canadian Language Benchmark/i)).toBeInTheDocument();

    const speakingInput = screen.getByLabelText(/Speaking PTE Score/i);
    fireEvent.change(speakingInput, { target: { value: '85' } });

    // 85 on speaking maps to CLB 9
    const clb9Elements = screen.getAllByText(/CLB 9/i);
    expect(clb9Elements.length).toBeGreaterThanOrEqual(1);
  });
});
