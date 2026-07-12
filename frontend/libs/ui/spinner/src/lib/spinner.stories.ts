import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

const meta: Meta = {
  title: 'Components/Spinner',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSpinnerImports] })],
  render: () => ({ template: `<hlm-spinner />` }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4 text-primary">
        <hlm-spinner class="text-base" />
        <hlm-spinner class="text-2xl" />
        <hlm-spinner class="text-4xl" />
      </div>`,
  }),
};
