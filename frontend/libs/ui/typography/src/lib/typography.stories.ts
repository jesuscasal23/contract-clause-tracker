import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...HlmTypographyImports] })],
  render: () => ({
    template: `
      <div class="max-w-2xl space-y-4">
        <h1 hlmH1>The Joke Tax Chronicles</h1>
        <h2 hlmH2>The King's Plan</h2>
        <h3 hlmH3>The Joke Tax</h3>
        <h4 hlmH4>People stopped telling jokes</h4>
        <p hlmP>
          The king thought long and hard, and finally came up with
          <a href="#" class="text-primary underline">a brilliant plan</a>.
        </p>
        <blockquote hlmBlockquote>
          "After all," he said, "everyone enjoys a good joke, so it's only fair
          that they should pay for the privilege."
        </blockquote>
        <ul hlmUl>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners: 20 gold coins</li>
        </ul>
        <p hlmLead>A modal dialog that interrupts the user with important content.</p>
        <p hlmLarge>Are you absolutely sure?</p>
        <p hlmSmall>Email address</p>
        <p hlmMuted>Enter your email address.</p>
        <p>You can use <code hlmCode>&#64;spartan-ng/helm</code> in your project.</p>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
