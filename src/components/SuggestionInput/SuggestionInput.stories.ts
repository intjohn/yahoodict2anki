import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { action } from 'storybook/actions';
import SuggestionInput from './SuggestionInput.svelte';

const meta = {
  title: 'Components/SuggestionInput',
  component: SuggestionInput,
  argTypes: {
    value: { control: 'text' },
    suggestions: { control: 'object' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onEnter: { action: 'onEnter' },
  },
} satisfies Meta<typeof SuggestionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    suggestions: ['Apple', 'Banana', 'Orange'],
    placeholder: 'Type a fruit...',
    disabled: false,
    onEnter: action('onEnter'),
  },
};

export const WithValue: Story = {
  args: {
    value: 'Apple',
    suggestions: ['Apple', 'Apple Pie', 'Apple Juice'],
    placeholder: 'Type a fruit...',
    disabled: false,
    onEnter: action('onEnter'),
  },
};

export const EmptySuggestions: Story = {
  args: {
    value: '',
    suggestions: [],
    placeholder: 'Type something...',
    disabled: false,
    onEnter: action('onEnter'),
  },
};

export const Disabled: Story = {
  args: {
    value: 'Cannot edit',
    suggestions: ['Option 1', 'Option 2'],
    placeholder: 'Disabled input',
    disabled: true,
    onEnter: action('onEnter'),
  },
};

export const LongSuggestions: Story = {
  args: {
    value: '',
    suggestions: [
      'This is a very long suggestion that might need to be truncated',
      'Another long suggestion with different content',
      'Short one',
      'Yet another long suggestion to test the layout',
    ],
    placeholder: 'Type something...',
    disabled: false,
    onEnter: action('onEnter'),
  },
};
