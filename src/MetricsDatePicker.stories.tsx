import { DatePicker } from '@/components/ui/DatePicker';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { number } from 'yup';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/UI/DatePicker',
  component: DatePicker,
  decorators: [
    (Story) => (
      <div className="ui-bg-modal ui-p-10 ui-rounded-xl ui-w-full ui-flex ui-justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const DatePickerStory: Story = {
  args: {
    variant: 'linkButton',
    onDateChange: () => {},
    className: 'ui-w-56',
    fixedWeeks: number;
  },
};
