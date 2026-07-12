import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmTooltipImports, ...HlmButtonImports] })],
  render: () => ({
    template: `<button hlmBtn variant="outline" [hlmTooltip]="'Add to library'">Hover me</button>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
