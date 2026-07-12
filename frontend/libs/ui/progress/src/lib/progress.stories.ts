import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

const meta: Meta = {
  title: 'Components/Progress',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmProgressImports] })],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  args: { value: 60 },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-72">
        <hlm-progress [value]="value"><hlm-progress-indicator /></hlm-progress>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Full: Story = { args: { value: 100 } };
