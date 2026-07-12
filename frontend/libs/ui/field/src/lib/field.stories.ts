import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

const meta: Meta = {
  title: 'Components/Field',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmFieldImports, ...HlmInputImports] })],
  render: () => ({
    template: `
      <div hlmField class="w-80">
        <label hlmFieldLabel for="username">Username</label>
        <input hlmInput id="username" placeholder="spartan" />
        <p hlmFieldDescription>This is your public display name.</p>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
