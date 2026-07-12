import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Popover',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmPopoverImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <hlm-popover>
        <button hlmBtn variant="outline" hlmPopoverTrigger [hlmPopoverTriggerFor]="content">
          Open popover
        </button>
        <ng-template #content>
          <div hlmPopoverContent class="w-80">
            <div hlmPopoverHeader>
              <h4 hlmPopoverTitle>Dimensions</h4>
              <p hlmPopoverDescription>Set the dimensions for the layer.</p>
            </div>
          </div>
        </ng-template>
      </hlm-popover>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
