import type { Meta, StoryObj } from '@storybook/angular';

/**
 * The design system is themed entirely through CSS variables declared in
 * `projects/playground/src/styles.css`. Change a single variable — e.g. `--primary` —
 * and every component that references it updates automatically.
 *
 * Use the Theme toolbar (top) to toggle light / dark.
 */
const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `
      <div class="bg-background text-foreground min-h-screen p-8">
        <h1 class="text-2xl font-semibold tracking-tight">Color tokens</h1>
        <p class="text-muted-foreground mt-1 mb-6 text-sm">
          Each swatch is a semantic CSS variable. Edit it in <code class="text-primary">styles.css</code>
          to re-skin the whole library. Toggle the Theme toolbar for dark mode.
        </p>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div class="rounded-lg border p-3">
            <div class="bg-background border h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">background</div>
            <div class="text-muted-foreground text-xs">--background</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-primary h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">primary</div>
            <div class="text-muted-foreground text-xs">--primary</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-secondary h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">secondary</div>
            <div class="text-muted-foreground text-xs">--secondary</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-muted h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">muted</div>
            <div class="text-muted-foreground text-xs">--muted</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-accent h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">accent</div>
            <div class="text-muted-foreground text-xs">--accent</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-destructive h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">destructive</div>
            <div class="text-muted-foreground text-xs">--destructive</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="bg-card border h-14 w-full rounded-md"></div>
            <div class="mt-2 text-sm font-medium">card</div>
            <div class="text-muted-foreground text-xs">--card</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="h-14 w-full rounded-md border-4" style="border-color: var(--border)"></div>
            <div class="mt-2 text-sm font-medium">border</div>
            <div class="text-muted-foreground text-xs">--border</div>
          </div>
        </div>

        <h2 class="mt-8 mb-3 text-lg font-semibold">Primary scale in use</h2>
        <div class="flex flex-wrap items-center gap-3">
          <div class="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm">
            bg-primary / text-primary-foreground
          </div>
          <div class="text-primary border-primary rounded-md border px-4 py-2 text-sm">
            text-primary / border-primary
          </div>
        </div>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Colors: Story = {};
