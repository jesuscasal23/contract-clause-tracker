import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmTableImports } from '@spartan-ng/helm/table';

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmTableImports] })],
  render: () => ({
    template: `
      <div hlmTableContainer class="w-[36rem]">
        <table hlmTable class="w-full">
          <caption hlmCaption>A list of your recent invoices.</caption>
          <thead hlmTHead>
            <tr hlmTr>
              <th hlmTh>Invoice</th>
              <th hlmTh>Status</th>
              <th hlmTh>Method</th>
              <th hlmTh class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody hlmTBody>
            <tr hlmTr>
              <td hlmTd class="font-medium">INV001</td>
              <td hlmTd>Paid</td>
              <td hlmTd>Credit Card</td>
              <td hlmTd class="text-right">$250.00</td>
            </tr>
            <tr hlmTr>
              <td hlmTd class="font-medium">INV002</td>
              <td hlmTd>Pending</td>
              <td hlmTd>PayPal</td>
              <td hlmTd class="text-right">$150.00</td>
            </tr>
            <tr hlmTr>
              <td hlmTd class="font-medium">INV003</td>
              <td hlmTd>Unpaid</td>
              <td hlmTd>Bank Transfer</td>
              <td hlmTd class="text-right">$350.00</td>
            </tr>
          </tbody>
        </table>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
