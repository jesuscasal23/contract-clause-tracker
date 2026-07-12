import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmAccordionImports] })],
  render: () => ({
    template: `
      <div hlmAccordion class="w-96">
        <div hlmAccordionItem>
          <hlm-accordion-trigger>Is it accessible?</hlm-accordion-trigger>
          <hlm-accordion-content>Yes. It adheres to the WAI-ARIA design pattern.</hlm-accordion-content>
        </div>
        <div hlmAccordionItem>
          <hlm-accordion-trigger>Is it styled?</hlm-accordion-trigger>
          <hlm-accordion-content>Yes. It comes with default styles that match the rest of the system.</hlm-accordion-content>
        </div>
        <div hlmAccordionItem>
          <hlm-accordion-trigger>Is it animated?</hlm-accordion-trigger>
          <hlm-accordion-content>Yes. It is animated by default, but you can disable it.</hlm-accordion-content>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
