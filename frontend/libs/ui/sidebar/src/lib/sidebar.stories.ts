import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

const meta: Meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [moduleMetadata({ imports: [...HlmSidebarImports] })],
  render: () => ({
    template: `
      <div hlmSidebarWrapper class="min-h-96">
        <hlm-sidebar>
          <div hlmSidebarContent>
            <div hlmSidebarGroup>
              <ul hlmSidebarMenu>
                <li hlmSidebarMenuItem><button hlmSidebarMenuButton>Home</button></li>
                <li hlmSidebarMenuItem><button hlmSidebarMenuButton>Inbox</button></li>
                <li hlmSidebarMenuItem><button hlmSidebarMenuButton>Settings</button></li>
              </ul>
            </div>
          </div>
        </hlm-sidebar>
        <main hlmSidebarInset>
          <header class="flex h-12 items-center gap-2 border-b px-4">
            <button hlmSidebarTrigger></button>
            <span class="text-sm font-medium">Dashboard</span>
          </header>
          <div class="p-4 text-sm text-muted-foreground">Main content area.</div>
        </main>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
