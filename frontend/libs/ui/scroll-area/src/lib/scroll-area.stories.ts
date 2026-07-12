import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';

const meta: Meta = {
  title: 'Components/Scroll Area',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmScrollAreaImports] })],
  render: () => ({
    template: `
      <ng-scrollbar hlm class="h-72 w-56 rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
          @for (i of tags; track i) {
            <div class="text-sm">v1.2.0-beta.{{ i }}</div>
            <hr class="my-2 border-border" />
          }
        </div>
      </ng-scrollbar>`,
    props: { tags: Array.from({ length: 25 }, (_, i) => i + 1) },
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
