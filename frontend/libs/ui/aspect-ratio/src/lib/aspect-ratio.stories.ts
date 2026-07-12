import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';

const meta: Meta = {
  title: 'Components/Aspect Ratio',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAspectRatioImports] })],
  render: () => ({
    template: `
      <div hlmAspectRatio [ratio]="16 / 9" class="w-80 overflow-hidden rounded-md bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo"
          class="h-full w-full object-cover"
        />
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Square: Story = {
  render: () => ({
    template: `<div hlmAspectRatio [ratio]="1" class="w-56 rounded-md bg-muted"></div>`,
  }),
};
