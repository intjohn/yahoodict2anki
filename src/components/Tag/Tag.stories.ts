import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { action } from 'storybook/actions';
import Tag from './Tag.svelte';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    text: { control: 'text' },
    disabled: { control: 'boolean' },
    onClose: { table: { disable: true } },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Short tag',
    onClose: action('onClose'),
    disabled: false,
  },
};

export const LongText: Story = {
  args: {
    text: 'This is a very long tag text that should be truncated',
    onClose: action('onClose'),
    disabled: false,
  },
};

export const Empty: Story = {
  args: {
    text: '',
    onClose: action('onClose'),
    disabled: false,
  },
};

export const SpecialCharacters: Story = {
  args: {
    text: 'Tag with 特殊字符!@#$%',
    onClose: action('onClose'),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    text: 'Disabled tag',
    onClose: action('onClose'),
    disabled: true,
  },
};
