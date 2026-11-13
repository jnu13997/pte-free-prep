import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HighlightIncorrectWordsItem } from '../../src/components/listening/HighlightIncorrectWordsItem';

describe('HighlightIncorrectWordsItem', () => {
  it('highlights words with yellow background on click and unhighlights on second click', () => {
    const handleChange = vi.fn();
    render(
      <HighlightIncorrectWordsItem
        transcript="The climate changed rapidly during the previous century"
        highlightedIndices={[]}
        onChange={handleChange}
      />
    );

    const word = screen.getByText('climate');
    fireEvent.click(word);
    expect(handleChange).toHaveBeenCalledWith([1]);
  });
});
