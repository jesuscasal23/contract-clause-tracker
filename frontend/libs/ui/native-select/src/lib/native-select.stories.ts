import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

const meta: Meta = {
  title: 'Components/Native Select',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmNativeSelectImports] })],
  render: () => ({
    template: `
      <hlm-native-select class="w-56">
        <option hlmNativeSelectOption value="apple">Apple</option>
        <option hlmNativeSelectOption value="banana">Banana</option>
        <option hlmNativeSelectOption value="blueberry">Blueberry</option>
        <option hlmNativeSelectOption value="grapes">Grapes</option>
      </hlm-native-select>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithGroups: Story = {
  render: () => ({
    template: `
      <hlm-native-select class="w-56">
        <optgroup hlmNativeSelectOptGroup label="Fruits">
          <option hlmNativeSelectOption value="apple">Apple</option>
          <option hlmNativeSelectOption value="banana">Banana</option>
        </optgroup>
        <optgroup hlmNativeSelectOptGroup label="Vegetables">
          <option hlmNativeSelectOption value="carrot">Carrot</option>
        </optgroup>
      </hlm-native-select>`,
  }),
};
