import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmTabsImports] })],
  render: () => ({
    template: `
      <hlm-tabs tab="account" class="w-96">
        <hlm-tabs-list class="w-full">
          <button hlmTabsTrigger="account">Account</button>
          <button hlmTabsTrigger="password">Password</button>
        </hlm-tabs-list>
        <div hlmTabsContent="account" class="p-4 text-sm">
          Make changes to your account here. Click save when you're done.
        </div>
        <div hlmTabsContent="password" class="p-4 text-sm">
          Change your password here. After saving, you'll be logged out.
        </div>
      </hlm-tabs>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
