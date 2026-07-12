import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Switch',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSwitchImports, ...HlmLabelImports] })],
  render: () => ({ template: `<hlm-switch aria-label="Airplane mode" />` }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Checked: Story = { render: () => ({ template: `<hlm-switch checked aria-label="On" />` }) };
export const Disabled: Story = { render: () => ({ template: `<hlm-switch disabled aria-label="Disabled" />` }) };
export const WithLabel: Story = {
  render: () => ({
    template: `
      <label hlmLabel class="flex items-center gap-2">
        <hlm-switch /> Airplane Mode
      </label>`,
  }),
};
