import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

const meta: Meta = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmBadgeImports] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `<span hlmBadge [variant]="variant">Badge</span>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <span hlmBadge>Default</span>
        <span hlmBadge variant="secondary">Secondary</span>
        <span hlmBadge variant="destructive">Destructive</span>
        <span hlmBadge variant="outline">Outline</span>
      </div>`,
  }),
};
