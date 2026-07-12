import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';

const meta: Meta = {
  title: 'Components/Calendar',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideNativeDateAdapter()] }),
    moduleMetadata({ imports: [...HlmCalendarImports] }),
  ],
  render: () => ({
    template: `<hlm-calendar class="rounded-md border p-3" />`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
