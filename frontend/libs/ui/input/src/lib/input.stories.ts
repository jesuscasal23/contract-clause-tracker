import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Input',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmInputImports, ...HlmLabelImports] })],
  render: () => ({
    template: `<input hlmInput placeholder="Email" class="w-64" />`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => ({
    template: `
      <div class="grid w-64 gap-1.5">
        <label hlmLabel for="email">Email</label>
        <input hlmInput id="email" type="email" placeholder="you@example.com" />
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<input hlmInput placeholder="Disabled" class="w-64" disabled />`,
  }),
};
