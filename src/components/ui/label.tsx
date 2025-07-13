'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 outline-none border-none shadow-none focus:outline-none focus:border-none focus:shadow-none',
        className
      )}
      {...props}
    />
  );
}

export { Label };
