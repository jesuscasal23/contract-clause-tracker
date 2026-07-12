import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmDrawerImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <hlm-drawer>
        <button hlmBtn variant="outline" hlmDrawerTrigger>Open drawer</button>
        <hlm-drawer-content>
          <div hlmDrawerHeader>
            <h3 hlmDrawerTitle>Move goal</h3>
            <p hlmDrawerDescription>Set your daily activity goal.</p>
          </div>
          <div hlmDrawerFooter>
            <button hlmBtn>Submit</button>
            <button hlmBtn variant="outline" hlmDrawerClose>Cancel</button>
          </div>
        </hlm-drawer-content>
      </hlm-drawer>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
