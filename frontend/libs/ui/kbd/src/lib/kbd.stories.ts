import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

const meta: Meta = {
  title: 'Components/Kbd',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmKbdImports] })],
  render: () => ({ template: `<kbd hlmKbd>⌘</kbd>` }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Group: Story = {
  render: () => ({
    template: `
      <kbd hlmKbdGroup>
        <kbd hlmKbd>⌘</kbd>
        <kbd hlmKbd>K</kbd>
      </kbd>`,
  }),
};
