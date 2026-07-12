import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

const meta: Meta = {
  title: 'Components/Resizable',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmResizableImports] })],
  render: () => ({
    template: `
      <hlm-resizable-group class="h-48 w-96 rounded-lg border">
        <hlm-resizable-panel>
          <div class="flex h-full items-center justify-center p-6 text-sm font-medium">One</div>
        </hlm-resizable-panel>
        <hlm-resizable-handle />
        <hlm-resizable-panel>
          <div class="flex h-full items-center justify-center p-6 text-sm font-medium">Two</div>
        </hlm-resizable-panel>
      </hlm-resizable-group>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
