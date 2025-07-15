'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}>({});

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const actualValue = value ?? internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange]
    );

    return (
      <RadioGroupContext.Provider
        value={{ value: actualValue, onValueChange: handleValueChange, name }}
      >
        <div
          ref={ref}
          data-slot="radio-group"
          className={cn('grid gap-2 sm:gap-3', className)}
          role="radiogroup"
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const isChecked = context.value === value;

    const handleChange = () => {
      context.onValueChange?.(value);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={isChecked}
          onChange={handleChange}
          name={context.name}
          data-slot="radio-group-item"
          className={cn(
            'focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs aspect-square size-5 sm:size-4 shrink-0 appearance-none rounded-full border-2 border-gray-300 bg-white text-primary outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800',
            className
          )}
          {...props}
        />
        {isChecked && (
          <div
            data-slot="radio-group-indicator"
            className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 sm:size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500"
          />
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
