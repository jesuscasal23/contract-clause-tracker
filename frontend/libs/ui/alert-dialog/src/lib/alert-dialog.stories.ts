import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Alert Dialog',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAlertDialogImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <hlm-alert-dialog>
        <button hlmBtn variant="outline" hlmAlertDialogTrigger [hlmAlertDialogTriggerFor]="content">
          Delete account
        </button>
        <ng-template #content>
          <hlm-alert-dialog-content>
            <div hlmAlertDialogHeader>
              <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
              <p hlmAlertDialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </p>
            </div>
            <div hlmAlertDialogFooter>
              <button hlmBtn variant="outline" hlmAlertDialogCancel>Cancel</button>
              <button hlmBtn hlmAlertDialogAction>Continue</button>
            </div>
          </hlm-alert-dialog-content>
        </ng-template>
      </hlm-alert-dialog>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
