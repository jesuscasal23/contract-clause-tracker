import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [...HlmBreadcrumbImports] }),
  ],
  render: () => ({
    template: `
      <nav hlmBreadcrumb>
        <ol hlmBreadcrumbList>
          <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/">Home</a></li>
          <li hlmBreadcrumbSeparator></li>
          <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/components">Components</a></li>
          <li hlmBreadcrumbSeparator></li>
          <li hlmBreadcrumbItem><span hlmBreadcrumbPage>Breadcrumb</span></li>
        </ol>
      </nav>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
