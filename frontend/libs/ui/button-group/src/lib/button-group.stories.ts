import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmButtonGroupImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <div hlmButtonGroup>
        <button hlmBtn variant="outline">Previous</button>
        <button hlmBtn variant="outline">Next</button>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithText: Story = {
  render: () => ({
    template: `
      <div hlmButtonGroup>
        <button hlmBtn variant="outline">Copy</button>
        <span hlmButtonGroupText>or</span>
        <button hlmBtn variant="outline">Paste</button>
      </div>`,
  }),
};
