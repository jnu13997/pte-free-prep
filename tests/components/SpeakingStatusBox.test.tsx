import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpeakingStatusBox } from '../../src/components/speaking/SpeakingStatusBox';

describe('SpeakingStatusBox', () => {
  it('renders countdown phase and recording phase states correctly', () => {
    const { rerender } = render(
      <SpeakingStatusBox status="COUNTDOWN" secondsLeft={15} volumeLevel={0} />
    );
    expect(screen.getByText(/Beginning in 15 seconds/i)).toBeInTheDocument();

    rerender(
      <SpeakingStatusBox status="RECORDING" secondsLeft={30} volumeLevel={45} />
    );
    const recordingElements = screen.getAllByText(/Recording/i);
    expect(recordingElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/30s remaining/i)).toBeInTheDocument();
  });

  it('renders completed state when recording finishes', () => {
    render(<SpeakingStatusBox status="COMPLETED" secondsLeft={0} volumeLevel={0} />);
    const completedElements = screen.getAllByText(/Completed/i);
    expect(completedElements.length).toBeGreaterThanOrEqual(1);
  });
});
