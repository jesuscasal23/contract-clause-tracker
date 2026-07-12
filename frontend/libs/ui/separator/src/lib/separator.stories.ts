import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

const meta: Meta = {
  title: 'Components/Separator',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSeparatorImports] })],
  render: () => ({
    template: `
      <div class="w-64">
        <div class="text-sm font-medium">Spartan UI</div>
        <p class="text-sm text-muted-foreground">An Angular component library.</p>
        <hlm-separator class="my-4" />
        <div class="flex h-5 items-center gap-4 text-sm">
          <span>Docs</span>
          <hlm-separator orientation="vertical" />
          <span>Source</span>
          <hlm-separator orientation="vertical" />
          <span>About</span>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
