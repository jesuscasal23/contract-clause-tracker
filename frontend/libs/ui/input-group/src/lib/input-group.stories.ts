import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

const meta: Meta = {
  title: 'Components/Input Group',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmInputGroupImports] })],
  render: () => ({
    template: `
      <div hlmInputGroup class="w-72">
        <span hlmInputGroupAddon>&#64;</span>
        <input hlmInputGroupInput placeholder="username" />
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithText: Story = {
  render: () => ({
    template: `
      <div hlmInputGroup class="w-72">
        <input hlmInputGroupInput placeholder="0.00" />
        <span hlmInputGroupText>USD</span>
      </div>`,
  }),
};
