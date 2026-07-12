import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { toast } from 'ngx-sonner';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Sonner (Toast)',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmToasterImports, ...HlmButtonImports] })],
  render: () => ({
    props: {
      showToast: () =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        }),
    },
    template: `
      <hlm-toaster />
      <button hlmBtn variant="outline" (click)="showToast()">Show toast</button>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
