import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:from-primary/90 dark:to-primary/70 dark:shadow-primary/25 dark:hover:shadow-primary/40',
        destructive:
          'bg-gradient-to-r from-destructive to-destructive/80 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:from-destructive/90 dark:to-destructive/70 dark:shadow-destructive/25 dark:hover:shadow-destructive/40',
        outline:
          'border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:bg-primary/5 hover:border-primary/40 dark:bg-background/30 dark:border-primary/30 dark:hover:bg-primary/10 dark:hover:border-primary/50',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] dark:from-secondary/70 dark:to-secondary/50 dark:shadow-secondary/20 dark:hover:shadow-secondary/30',
        ghost:
          'hover:bg-accent/80 hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] dark:hover:bg-accent/60 dark:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        gradient:
          'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40',
        glass:
          'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] dark:bg-black/20 dark:border-white/10 dark:hover:bg-white/20',
      },
      size: {
        default: 'h-10 px-6 py-2.5 has-[>svg]:px-4 text-sm font-semibold',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs font-medium',
        lg: 'h-12 rounded-lg px-8 has-[>svg]:px-6 text-base font-semibold',
        xl: 'h-14 rounded-xl px-10 has-[>svg]:px-8 text-lg font-bold',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
