import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

const meta: Meta = {
  title: 'Components/Skeleton',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSkeletonImports] })],
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <div hlmSkeleton class="h-12 w-12 rounded-full"></div>
        <div class="grid gap-2">
          <div hlmSkeleton class="h-4 w-48"></div>
          <div hlmSkeleton class="h-4 w-40"></div>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
