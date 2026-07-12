import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';

const meta: Meta = {
  title: 'Components/Autocomplete',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAutocompleteImports] })],
  render: () => ({
    template: `
      <hlm-autocomplete class="w-64">
        <hlm-autocomplete-input placeholder="Search fruit..." />
        <hlm-autocomplete-content>
          <div hlmAutocompleteList>
            <hlm-autocomplete-item value="apple">Apple</hlm-autocomplete-item>
            <hlm-autocomplete-item value="banana">Banana</hlm-autocomplete-item>
            <hlm-autocomplete-item value="cherry">Cherry</hlm-autocomplete-item>
            <hlm-autocomplete-item value="grape">Grape</hlm-autocomplete-item>
          </div>
          <div hlmAutocompleteEmpty>No results.</div>
        </hlm-autocomplete-content>
      </hlm-autocomplete>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
