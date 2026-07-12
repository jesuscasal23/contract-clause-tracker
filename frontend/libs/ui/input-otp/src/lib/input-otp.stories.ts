import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

const meta: Meta = {
  title: 'Components/Input OTP',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [...BrnInputOtpImports, ...HlmInputOtpImports] })],
  render: () => ({
    template: `
      <brn-input-otp hlm [maxLength]="6">
        <hlm-input-otp-group>
          <hlm-input-otp-slot [index]="0" />
          <hlm-input-otp-slot [index]="1" />
          <hlm-input-otp-slot [index]="2" />
        </hlm-input-otp-group>
        <hlm-input-otp-separator />
        <hlm-input-otp-group>
          <hlm-input-otp-slot [index]="3" />
          <hlm-input-otp-slot [index]="4" />
          <hlm-input-otp-slot [index]="5" />
        </hlm-input-otp-group>
      </brn-input-otp>`,
  }),
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};
