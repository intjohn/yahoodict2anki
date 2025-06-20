import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { action } from 'storybook/actions';
import TagPicker from './TagPicker.svelte';

const meta = {
  title: 'Components/TagPicker',
  component: TagPicker,
  argTypes: {
    inputValue: { control: 'text' },
    suggestions: { control: 'object' },
    pickedTags: { control: 'object' },
    disabled: { control: 'boolean' },
    onPick: { action: 'onPick' },
    onInput: { action: 'onInput' },
    onRemove: { action: 'onRemove' },
  },
} satisfies Meta<typeof TagPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Tags',
    inputValue: 'Some typed t...',
    suggestions: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte'],
    pickedTags: ['JavaScript', 'React'],
    disabled: false,
    onPick: action('onPick'),
    onInput: action('onInput'),
    onRemove: action('onRemove'),
  },
};

export const Empty: Story = {
  args: {
    label: 'Tags',
    inputValue: '',
    suggestions: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte'],
    pickedTags: [],
    disabled: false,
    onPick: action('onPick'),
    onInput: action('onInput'),
    onRemove: action('onRemove'),
  },
};

export const ManyTags: Story = {
  args: {
    label: 'Tags',
    inputValue: '',
    suggestions: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Angular', 'Node.js'],
    pickedTags: [
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Svelte',
      'Angular',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
    ],
    disabled: false,
    onPick: action('onPick'),
    onInput: action('onInput'),
    onRemove: action('onRemove'),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Tags',
    inputValue: '',
    suggestions: ['JavaScript', 'TypeScript', 'React'],
    pickedTags: ['JavaScript'],
    disabled: true,
    onPick: action('onPick'),
    onInput: action('onInput'),
    onRemove: action('onRemove'),
  },
};
