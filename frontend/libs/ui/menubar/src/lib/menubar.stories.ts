import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

const meta: Meta = {
  title: 'Components/Menubar',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmMenubarImports, ...HlmDropdownMenuImports] })],
  render: () => ({
    template: `
      <div hlmMenubar>
        <button hlmMenubarTrigger [hlmMenubarTrigger]="fileMenu">File</button>
        <button hlmMenubarTrigger [hlmMenubarTrigger]="editMenu">Edit</button>
      </div>
      <ng-template #fileMenu>
        <div hlmDropdownMenu class="w-48">
          <button hlmDropdownMenuItem>New Tab</button>
          <button hlmDropdownMenuItem>New Window</button>
          <button hlmDropdownMenuItem>Print</button>
        </div>
      </ng-template>
      <ng-template #editMenu>
        <div hlmDropdownMenu class="w-48">
          <button hlmDropdownMenuItem>Undo</button>
          <button hlmDropdownMenuItem>Redo</button>
          <button hlmDropdownMenuItem>Cut</button>
        </div>
      </ng-template>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
