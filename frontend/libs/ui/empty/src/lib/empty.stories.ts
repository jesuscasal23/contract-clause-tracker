import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Empty',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmEmptyImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <div hlmEmpty class="w-96 rounded-lg border">
        <div hlmEmptyHeader>
          <div hlmEmptyMedia variant="icon">📭</div>
          <h3 hlmEmptyTitle>No notifications</h3>
          <p hlmEmptyDescription>You're all caught up. New notifications will appear here.</p>
        </div>
        <div hlmEmptyContent>
          <button hlmBtn variant="outline">Refresh</button>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
