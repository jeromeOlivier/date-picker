import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Calendar, CalendarIcon } from '@/index';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const DEFAULT_TRIGGER_LABEL = format(new Date(), 'PPP');

const datePickerVariants = cva(
  [
    'ui-relative',
    'ui-flex',
    'ui-justify-center',
    'ui-items-center',
    'ui-rounded-full',
    'ui-bg-transparent',
    'ui-text-muted-100',
    'ui-text-sm',
    'ui-text-left',
    'disabled:ui-cursor-not-allowed',
    'disabled:ui-opacity-50',
    'focus:ui-outline-none',
  ],
  {
    variants: {
      variant: {
        button: [
          'ui-border-purple-25',
          'hover:ui-bg-purple-25',
          'hover:ui-text-white',
          'ui-border',
          'ui-py-1',
          'ui-px-3',
          'ui-items-center',
          'ui-rounded-md',
          'ui-justify-between',
          'ui-font-normal',
        ],
        linkButton: ['ui-bg-transparent, hover:ui-underline'],
        iconButton: [
          'ui-md:transition',
          'ui-ease-in-out',
          'ui-w-9',
          'ui-h-9',
          'ui-rounded-lg',
          'ui-bg-muted-250',
          'ui-opacity-40',
          'hover:ui-opacity-70',
          'hover:ui-text-white',
          'ui-border',
        ],
      },
    },
    defaultVariants: {
      variant: 'linkButton',
    },
  },
);

type DatePickerProps = VariantProps<typeof datePickerVariants> & {
  onDateChange: (date: Date) => void;
  className?: string;
  label?: string;
  fixedWeeks?: boolean;
};

const DatePicker = React.forwardRef<
  React.ElementRef<'button'>,
  DatePickerProps
>(
  (
    { onDateChange, className, variant, label = DEFAULT_TRIGGER_LABEL },
    ref,
  ) => {
    const [date, setDate] = useState<Date>();
    const [isCalendarOpen, setCalendarOpen] = useState<boolean>(false);

    useEffect(() => {
      if (date) {
        onDateChange(date);
      }
    }, [date]);

    return (
      <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger ref={ref} asChild>
          <button
            className={twMerge(datePickerVariants({ variant }), className)}
          >
            {variant !== 'iconButton' && (
              <span>{date ? format(date, 'PPP') : label}</span>
            )}
            {variant !== 'linkButton' && (
              <CalendarIcon className="w-4 h-4 ml-2" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="ui-w-auto ui-p-0" align="start">
          <Calendar
            mode="single"
            onSelect={setDate}
            onDayClick={() => {
              setCalendarOpen(false);
            }}
            className={className}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
