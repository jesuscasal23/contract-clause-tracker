import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Hover Card',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmHoverCardImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <hlm-hover-card>
        <button hlmBtn variant="link" hlmHoverCardTrigger [hlmHoverCardTriggerFor]="content">
          &#64;spartan-ng
        </button>
        <ng-template #content>
          <div hlmHoverCardContent class="w-64">
            <div class="text-sm font-semibold">&#64;spartan-ng</div>
            <p class="text-sm text-muted-foreground">The Angular UI library you've been waiting for.</p>
          </div>
        </ng-template>
      </hlm-hover-card>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
