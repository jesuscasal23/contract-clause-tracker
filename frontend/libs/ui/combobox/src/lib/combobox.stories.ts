import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

const meta: Meta = {
  title: 'Components/Combobox',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmComboboxImports] })],
  render: () => ({
    template: `
      <hlm-combobox class="w-64">
        <hlm-combobox-input placeholder="Select framework..." />
        <hlm-combobox-content>
          <div hlmComboboxList>
            <hlm-combobox-item value="angular">Angular</hlm-combobox-item>
            <hlm-combobox-item value="react">React</hlm-combobox-item>
            <hlm-combobox-item value="vue">Vue</hlm-combobox-item>
            <hlm-combobox-item value="svelte">Svelte</hlm-combobox-item>
          </div>
          <div hlmComboboxEmpty>No framework found.</div>
        </hlm-combobox-content>
      </hlm-combobox>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
