import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmButtonImports] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['default', 'xs', 'sm', 'lg', 'icon'] },
  },
  args: { variant: 'default', size: 'default' },
  render: (args) => ({
    props: args,
    template: `<button hlmBtn [variant]="variant" [size]="size">Button</button>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button hlmBtn>Default</button>
        <button hlmBtn variant="secondary">Secondary</button>
        <button hlmBtn variant="outline">Outline</button>
        <button hlmBtn variant="ghost">Ghost</button>
        <button hlmBtn variant="destructive">Destructive</button>
        <button hlmBtn variant="link">Link</button>
      </div>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <button hlmBtn size="xs">Extra small</button>
        <button hlmBtn size="sm">Small</button>
        <button hlmBtn size="default">Default</button>
        <button hlmBtn size="lg">Large</button>
      </div>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<button hlmBtn disabled>Disabled</button>`,
  }),
};
