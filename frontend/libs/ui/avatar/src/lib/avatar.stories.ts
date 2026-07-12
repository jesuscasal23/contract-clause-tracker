import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

const meta: Meta = {
  title: 'Components/Avatar',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAvatarImports] })],
  render: () => ({
    template: `
      <hlm-avatar>
        <img hlmAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <span hlmAvatarFallback>CN</span>
      </hlm-avatar>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Fallback: Story = {
  render: () => ({
    template: `
      <hlm-avatar>
        <span hlmAvatarFallback>AB</span>
      </hlm-avatar>`,
  }),
};
export const Group: Story = {
  render: () => ({
    template: `
      <div hlmAvatarGroup>
        <hlm-avatar><span hlmAvatarFallback>CN</span></hlm-avatar>
        <hlm-avatar><span hlmAvatarFallback>AB</span></hlm-avatar>
        <hlm-avatar><span hlmAvatarFallback>XY</span></hlm-avatar>
        <span hlmAvatarGroupCount>+3</span>
      </div>`,
  }),
};
