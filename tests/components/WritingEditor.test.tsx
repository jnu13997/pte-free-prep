import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WritingEditor } from '../../src/components/writing/WritingEditor';

describe('WritingEditor', () => {
  it('updates word count live and enforces word boundaries', () => {
    const handleChange = vi.fn();
    render(
      <WritingEditor
        value="This is three words"
        minWords={5}
        maxWords={75}
        onChange={handleChange}
        placeholder="Type your response here..."
      />
    );

    expect(screen.getByText(/Total Word Count: 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Words: 5 - 75/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Type your response here.../i);
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalledWith('New text');
  });

  it('renders Cut, Copy, Paste toolbar buttons', () => {
    render(<WritingEditor value="" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /Cut/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Paste/i })).toBeInTheDocument();
  });
});
