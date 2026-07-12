import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSelectImports } from '@spartan-ng/helm/select';

const meta: Meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSelectImports] })],
  render: () => ({
    template: `
      <hlm-select>
        <hlm-select-trigger class="w-56">
          <hlm-select-value placeholder="Select a fruit" />
        </hlm-select-trigger>
        <hlm-select-content>
          <hlm-select-item value="apple">Apple</hlm-select-item>
          <hlm-select-item value="banana">Banana</hlm-select-item>
          <hlm-select-item value="blueberry">Blueberry</hlm-select-item>
          <hlm-select-item value="grapes">Grapes</hlm-select-item>
        </hlm-select-content>
      </hlm-select>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
