'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onChange, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={cn('peer sr-only', className)}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border shadow-sm outline-none transition-all',
            'peer-focus-visible:ring-ring/20 peer-focus-visible:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            checked ? 'bg-primary' : 'bg-muted'
          )}
        >
          <div
            className={cn(
              'pointer-events-none block size-5 rounded-full shadow-sm ring-0 transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0.5',
              'bg-foreground dark:bg-background'
            )}
          />
        </div>
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
