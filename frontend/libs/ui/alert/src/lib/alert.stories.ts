import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

const meta: Meta = {
  title: 'Components/Alert',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAlertImports] })],
  render: () => ({
    template: `
      <div hlmAlert class="w-96">
        <h4 hlmAlertTitle>Heads up!</h4>
        <p hlmAlertDescription>You can add components to your app using the CLI.</p>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Destructive: Story = {
  render: () => ({
    template: `
      <div hlmAlert variant="destructive" class="w-96">
        <h4 hlmAlertTitle>Error</h4>
        <p hlmAlertDescription>Your session has expired. Please log in again.</p>
      </div>`,
  }),
};
