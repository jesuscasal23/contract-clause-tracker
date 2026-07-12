import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Item',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmItemImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <div hlmItem class="w-96 rounded-lg border">
        <div hlmItemMedia variant="icon">🎵</div>
        <div hlmItemContent>
          <div hlmItemTitle>Midnight City</div>
          <div hlmItemDescription>M83 · Hurry Up, We're Dreaming</div>
        </div>
        <div hlmItemActions>
          <button hlmBtn variant="ghost" size="sm">Play</button>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
