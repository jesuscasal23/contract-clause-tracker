import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

const meta: Meta = {
  title: 'Components/Collapsible',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmCollapsibleImports] })],
  render: () => ({
    template: `
      <div hlmCollapsible class="w-80">
        <div class="flex items-center justify-between gap-4">
          <span class="text-sm font-semibold">&#64;peduarte starred 3 repositories</span>
          <button hlmCollapsibleTrigger class="rounded-md border px-2 py-1 text-sm hover:bg-muted">
            Toggle
          </button>
        </div>
        <div class="mt-2 rounded-md border px-4 py-2 text-sm">&#64;radix-ui/primitives</div>
        <div hlmCollapsibleContent class="space-y-2">
          <div class="mt-2 rounded-md border px-4 py-2 text-sm">&#64;radix-ui/colors</div>
          <div class="rounded-md border px-4 py-2 text-sm">&#64;stitches/react</div>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
