import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [...HlmPaginationImports] }),
  ],
  render: () => ({
    template: `
      <nav hlmPagination>
        <ul hlmPaginationContent>
          <li hlmPaginationItem><hlm-pagination-previous link="/" /></li>
          <li hlmPaginationItem><a hlmPaginationLink link="/" [isActive]="true">1</a></li>
          <li hlmPaginationItem><a hlmPaginationLink link="/">2</a></li>
          <li hlmPaginationItem><a hlmPaginationLink link="/">3</a></li>
          <li hlmPaginationItem><hlm-pagination-ellipsis /></li>
          <li hlmPaginationItem><hlm-pagination-next link="/" /></li>
        </ul>
      </nav>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
