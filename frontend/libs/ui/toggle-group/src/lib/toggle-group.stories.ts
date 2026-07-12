import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

const meta: Meta = {
  title: 'Components/Toggle Group',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmToggleGroupImports] })],
  render: () => ({
    template: `
      <hlm-toggle-group>
        <button hlmToggleGroupItem value="bold" aria-label="Bold">B</button>
        <button hlmToggleGroupItem value="italic" aria-label="Italic">I</button>
        <button hlmToggleGroupItem value="underline" aria-label="Underline">U</button>
      </hlm-toggle-group>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Outline: Story = {
  render: () => ({
    template: `
      <hlm-toggle-group variant="outline">
        <button hlmToggleGroupItem value="left" aria-label="Left">L</button>
        <button hlmToggleGroupItem value="center" aria-label="Center">C</button>
        <button hlmToggleGroupItem value="right" aria-label="Right">R</button>
      </hlm-toggle-group>`,
  }),
};
