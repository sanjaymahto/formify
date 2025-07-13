import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-500 dark:aria-invalid:border-red-400 aria-invalid:border-2 dark:bg-input/30 dark:hover:bg-input/50 shadow-xs flex min-h-[80px] w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-blue-500 dark:focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:border-2 hover:border-blue-400 dark:hover:border-blue-500 hover:border-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
