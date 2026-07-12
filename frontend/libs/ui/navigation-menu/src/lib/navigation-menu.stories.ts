import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

const meta: Meta = {
  title: 'Components/Navigation Menu',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [...HlmNavigationMenuImports] }),
  ],
  render: () => ({
    template: `
      <nav hlmNavigationMenu>
        <ul hlmNavigationMenuList>
          <li hlmNavigationMenuItem>
            <button hlmNavigationMenuTrigger>Getting started</button>
            <div hlmNavigationMenuContent class="p-4">
              <a hlmNavigationMenuLink>Introduction</a>
              <a hlmNavigationMenuLink>Installation</a>
            </div>
          </li>
          <li hlmNavigationMenuItem>
            <a hlmNavigationMenuLink>Documentation</a>
          </li>
        </ul>
      </nav>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
