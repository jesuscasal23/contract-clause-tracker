import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Radio Group',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmRadioGroupImports, ...HlmLabelImports] })],
  render: () => ({
    template: `
      <hlm-radio-group class="grid gap-3">
        <label hlmLabel class="flex items-center gap-2">
          <hlm-radio value="default"><hlm-radio-indicator /></hlm-radio>
          Default
        </label>
        <label hlmLabel class="flex items-center gap-2">
          <hlm-radio value="comfortable"><hlm-radio-indicator /></hlm-radio>
          Comfortable
        </label>
        <label hlmLabel class="flex items-center gap-2">
          <hlm-radio value="compact"><hlm-radio-indicator /></hlm-radio>
          Compact
        </label>
      </hlm-radio-group>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
