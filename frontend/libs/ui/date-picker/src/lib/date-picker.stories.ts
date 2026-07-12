import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';

const meta: Meta = {
  title: 'Components/Date Picker',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideNativeDateAdapter()] }),
    moduleMetadata({ imports: [...HlmDatePickerImports] }),
  ],
  render: () => ({
    template: `<hlm-date-picker class="w-64">Pick a date</hlm-date-picker>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
