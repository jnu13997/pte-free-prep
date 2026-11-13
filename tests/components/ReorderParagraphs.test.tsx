import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReorderParagraphsItem } from '../../src/components/reading/ReorderParagraphsItem';

describe('ReorderParagraphsItem', () => {
  it('renders scrambled source paragraphs and allows moving them to target panel', () => {
    const paragraphs = [
      { id: 'p1', text: 'Paragraph One text content' },
      { id: 'p2', text: 'Paragraph Two text content' },
    ];
    const handleChange = vi.fn();

    render(<ReorderParagraphsItem paragraphs={paragraphs} onChange={handleChange} />);

    expect(screen.getByText('Paragraph One text content')).toBeInTheDocument();
    expect(screen.getByText('Paragraph Two text content')).toBeInTheDocument();

    // Select first paragraph
    const p1 = screen.getByText('Paragraph One text content');
    fireEvent.click(p1);

    // Move to target panel
    const moveRightBtn = screen.getByRole('button', { name: /Move Right/i });
    fireEvent.click(moveRightBtn);

    expect(handleChange).toHaveBeenCalledWith(['p1']);
  });
});
