import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmCardImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <div hlmCard class="w-80">
        <div hlmCardHeader>
          <h3 hlmCardTitle>Create project</h3>
          <p hlmCardDescription>Deploy your new project in one click.</p>
        </div>
        <div hlmCardContent>
          <p class="text-sm text-muted-foreground">
            Give your project a name and pick a region to get started.
          </p>
        </div>
        <div hlmCardFooter class="flex justify-between">
          <button hlmBtn variant="outline">Cancel</button>
          <button hlmBtn>Deploy</button>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
