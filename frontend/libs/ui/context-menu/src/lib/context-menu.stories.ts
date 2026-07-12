import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

const meta: Meta = {
  title: 'Components/Context Menu',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmContextMenuImports, ...HlmDropdownMenuImports] })],
  render: () => ({
    template: `
      <div
        [hlmContextMenuTrigger]="menu"
        class="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
      >
        Right-click here
      </div>
      <ng-template #menu>
        <div hlmDropdownMenu class="w-52">
          <button hlmDropdownMenuItem>Back</button>
          <button hlmDropdownMenuItem>Forward</button>
          <button hlmDropdownMenuItem>Reload</button>
          <button hlmDropdownMenuItem>Save as...</button>
        </div>
      </ng-template>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
