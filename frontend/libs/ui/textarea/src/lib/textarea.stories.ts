import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmLabelImports } from '@spartan-ng/helm/label';

const meta: Meta = {
  title: 'Components/Textarea',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmTextareaImports, ...HlmLabelImports] })],
  render: () => ({
    template: `<textarea hlmTextarea placeholder="Type your message here." class="w-72"></textarea>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithLabel: Story = {
  render: () => ({
    template: `
      <div class="grid w-72 gap-1.5">
        <label hlmLabel for="msg">Your message</label>
        <textarea hlmTextarea id="msg" placeholder="Type your message here."></textarea>
      </div>`,
  }),
};
export const Disabled: Story = {
  render: () => ({
    template: `<textarea hlmTextarea placeholder="Disabled" class="w-72" disabled></textarea>`,
  }),
};
