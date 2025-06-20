import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Tag from '../src/components/Tag/Tag.svelte';

describe('Tag', () => {
  it('renders with short text', () => {
    const { getByText } = render(Tag, {
      props: {
        text: 'Short tag',
        onClose: () => {},
      },
    });
    expect(getByText('Short tag')).toBeInTheDocument();
  });

  it('truncates long text', () => {
    const longText = 'This is a very long tag text that should be truncated';
    const { getByText } = render(Tag, {
      props: {
        text: longText,
        onClose: () => {},
      },
    });
    expect(getByText('This is a very long ...')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const { getByRole } = render(Tag, {
      props: {
        text: 'Test tag',
        onClose,
      },
    });

    const closeButton = getByRole('button', { name: 'Remove tag' });
    await fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('handles empty text', () => {
    const { container } = render(Tag, {
      props: {
        text: '',
        onClose: () => {},
      },
    });
    expect(container).toBeInTheDocument();
  });
});
