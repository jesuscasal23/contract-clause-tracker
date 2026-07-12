import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const meta: Meta = {
  title: 'Components/Sheet',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmSheetImports, ...HlmButtonImports] })],
  render: () => ({
    template: `
      <hlm-sheet>
        <button hlmBtn variant="outline" hlmSheetTrigger>Open sheet</button>
        <hlm-sheet-content>
          <div hlmSheetHeader>
            <h3 hlmSheetTitle>Edit profile</h3>
            <p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
          </div>
          <div hlmSheetFooter>
            <button hlmBtn>Save changes</button>
          </div>
        </hlm-sheet-content>
      </hlm-sheet>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
