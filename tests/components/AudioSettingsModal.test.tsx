import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioSettingsModal } from '../../src/components/layout/AudioSettingsModal';
import { naturalSpeech } from '../../src/services/audio/naturalSpeechService';

describe('AudioSettingsModal', () => {
  it('renders accent options when open', () => {
    const handleClose = vi.fn();
    render(<AudioSettingsModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('PTE Voice & Accent Settings')).toBeInTheDocument();
    expect(screen.getByText('Canadian English')).toBeInTheDocument();
    expect(screen.getByText('British English')).toBeInTheDocument();
    expect(screen.getByText('Australian English')).toBeInTheDocument();
    expect(screen.getByText('North American')).toBeInTheDocument();
  });

  it('updates accent preference when clicking an accent card', () => {
    const handleClose = vi.fn();
    render(<AudioSettingsModal isOpen={true} onClose={handleClose} />);

    const canadianBtn = screen.getByText('Canadian English').closest('button');
    expect(canadianBtn).not.toBeNull();
    if (canadianBtn) {
      fireEvent.click(canadianBtn);
      expect(naturalSpeech.getPreferredAccent()).toBe('canadian');
    }
  });

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const { container } = render(<AudioSettingsModal isOpen={false} onClose={handleClose} />);
    expect(container.firstChild).toBeNull();
  });
});
