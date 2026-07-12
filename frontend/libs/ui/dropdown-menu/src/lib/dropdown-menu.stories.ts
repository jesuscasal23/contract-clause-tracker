import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Dropdown Menu',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmDropdownMenuImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <button hlmBtn variant="outline" [hlmDropdownMenuTrigger]="menu">Open menu</button>
      <ng-template #menu>
        <div hlmDropdownMenu class="w-56">
          <button hlmDropdownMenuItem>Profile</button>
          <button hlmDropdownMenuItem>Billing</button>
          <button hlmDropdownMenuItem>Settings</button>
          <button hlmDropdownMenuItem>Log out</button>
        </div>
      </ng-template>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
