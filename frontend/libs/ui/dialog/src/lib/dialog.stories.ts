import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [...HlmDialogImports, ...HlmButtonImports, ...HlmInputImports, ...HlmLabelImports],
    }),
  ],
  render: () => ({
    template: `
      <hlm-dialog>
        <button hlmBtn variant="outline" hlmDialogTrigger>Edit profile</button>
        <hlm-dialog-content class="sm:max-w-md">
          <div hlmDialogHeader>
            <h3 hlmDialogTitle>Edit profile</h3>
            <p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
          </div>
          <div class="grid gap-1.5 py-2">
            <label hlmLabel for="name">Name</label>
            <input hlmInput id="name" value="Pedro Duarte" />
          </div>
          <div hlmDialogFooter>
            <button hlmBtn>Save changes</button>
          </div>
        </hlm-dialog-content>
      </hlm-dialog>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
