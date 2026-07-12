import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Label',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmLabelImports] })],
  render: () => ({
    template: `<label hlmLabel>Accept terms and conditions</label>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
