import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmCommandImports } from '@spartan-ng/helm/command';

const meta: Meta = {
  title: 'Components/Command',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmCommandImports] })],
  render: () => ({
    template: `
      <div hlmCommand class="w-80 rounded-lg border shadow-md">
        <hlm-command-input placeholder="Type a command or search..." />
        <div hlmCommandList>
          <div hlmCommandGroup>
            <span hlmCommandGroupLabel>Suggestions</span>
            <button hlmCommandItem>Calendar</button>
            <button hlmCommandItem>Search Emoji</button>
            <button hlmCommandItem>Calculator</button>
          </div>
          <div hlmCommandSeparator></div>
          <div hlmCommandGroup>
            <span hlmCommandGroupLabel>Settings</span>
            <button hlmCommandItem>Profile</button>
            <button hlmCommandItem>Billing</button>
          </div>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
