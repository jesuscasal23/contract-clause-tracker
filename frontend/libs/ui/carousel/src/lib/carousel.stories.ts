import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';

const meta: Meta = {
  title: 'Components/Carousel',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmCarouselImports] })],
  render: () => ({
    template: `
      <hlm-carousel class="w-64">
        <hlm-carousel-content>
          @for (n of [1, 2, 3, 4, 5]; track n) {
            <div hlmCarouselItem>
              <div class="flex aspect-square items-center justify-center rounded-md border p-6 text-4xl font-semibold">
                {{ n }}
              </div>
            </div>
          }
        </hlm-carousel-content>
        <button hlmCarouselPrevious></button>
        <button hlmCarouselNext></button>
      </hlm-carousel>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
