import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

const meta: Meta = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmToggleImports] })],
  render: () => ({ template: `<button hlmToggle aria-label="Toggle bold">B</button>` }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Outline: Story = {
  render: () => ({ template: `<button hlmToggle variant="outline" aria-label="Toggle italic">I</button>` }),
};
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <button hlmToggle size="sm" aria-label="Small">S</button>
        <button hlmToggle size="default" aria-label="Default">M</button>
        <button hlmToggle size="lg" aria-label="Large">L</button>
      </div>`,
  }),
};
