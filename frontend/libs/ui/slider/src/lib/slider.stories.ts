import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

const meta: Meta = {
  title: 'Components/Slider',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSliderImports] })],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  args: { value: 50 },
  render: (args) => ({
    props: args,
    template: `<hlm-slider class="w-64" [value]="value" [min]="0" [max]="100" [step]="1" />`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
