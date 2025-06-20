import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { action } from 'storybook/actions';
import Input from './Input.svelte';

const meta = {
  title: 'Components/Form/Input',
  component: Input,
  argTypes: {
    type: { control: 'text' },
    id: { control: 'text' },
    label: { control: 'text' },
    errorMessage: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Input value',
    type: 'text',
    id: 'input',
    label: 'Input',
    oninput: action('oninput'),
    onchange: action('onchange'),
  },
};

export const WithError: Story = {
  args: {
    value: 'Input value',
    type: 'text',
    id: 'input',
    label: 'Input',
    errorMessage: 'Error message',
    oninput: action('oninput'),
    onchange: action('onchange'),
  },
};

export const Disabled: Story = {
  args: {
    value: 'Input value',
    type: 'text',
    id: 'input',
    label: 'Input',
    disabled: true,
    oninput: action('oninput'),
    onchange: action('onchange'),
  },
};
