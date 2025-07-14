'use client';

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Select({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const actualValue = value ?? internalValue;
  const actualOpen = open ?? internalOpen;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);

      // Close the select when a value is selected
      if (open === undefined) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    },
    [value, onValueChange, open, onOpenChange]
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [open, onOpenChange]
  );

  return (
    <SelectContext.Provider
      value={{
        value: actualValue,
        onValueChange: handleValueChange,
        open: actualOpen,
        onOpenChange: handleOpenChange,
      }}
    >
      <div data-slot="select">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectGroup({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="select-group" {...props}>
      {children}
    </div>
  );
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

function SelectValue({ placeholder, className, ...props }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');

  const displayValue = context.value || placeholder;

  return (
    <span data-slot="select-value" className={className} {...props}>
      {displayValue}
    </span>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'default';
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      aria-expanded={context.open}
      onClick={() => context.onOpenChange(!context.open)}
      className={cn(
        "focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-500 dark:aria-invalid:border-red-400 aria-invalid:border-2 dark:bg-input/30 dark:hover:bg-input/50 shadow-xs flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md border-2 border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] hover:border-2 hover:border-blue-400 focus-visible:border-2 focus-visible:border-blue-500 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:border-gray-600 dark:hover:border-blue-500 dark:focus-visible:border-blue-400 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  );
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'popper';
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: SelectContentProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
    width: number;
    showAbove: boolean;
  }>({ top: 0, left: 0, width: 0, showAbove: false });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Update position when dropdown opens or scrolls
  const updatePosition = React.useCallback(() => {
    if (!context.open) return;
    const trigger = triggerRef.current?.parentElement?.querySelector(
      '[data-slot="select-trigger"]'
    );
    if (trigger) {
      const rect = (trigger as HTMLElement).getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine if dropdown should appear above or below
      const shouldShowAbove = spaceBelow < 200 && spaceAbove > spaceBelow;

      // Calculate position
      const top = shouldShowAbove
        ? rect.top + window.scrollY - 200 // Show above
        : rect.bottom + window.scrollY; // Show below

      let left = rect.left + window.scrollX;

      // Ensure dropdown doesn't go off-screen horizontally
      if (left + rect.width > viewportWidth + window.scrollX) {
        left = viewportWidth + window.scrollX - rect.width - 8;
      }

      // Ensure dropdown doesn't go off-screen to the left
      if (left < window.scrollX) {
        left = window.scrollX + 8;
      }

      setCoords({
        top,
        left,
        width: rect.width,
        showAbove: shouldShowAbove,
      });
    }
  }, [context.open]);

  React.useEffect(() => {
    if (!context.open) return;

    // Update position when dropdown opens
    updatePosition();

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [context.open, updatePosition]);

  // Close on outside click
  React.useEffect(() => {
    if (!context.open) return;
    function handleClick(event: MouseEvent) {
      const trigger = triggerRef.current?.parentElement?.querySelector(
        '[data-slot="select-trigger"]'
      );
      const content = contentRef.current;
      if (
        content &&
        !content.contains(event.target as Node) &&
        trigger &&
        !(trigger as HTMLElement).contains(event.target as Node)
      ) {
        context?.onOpenChange(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [context.open, context.onOpenChange]);

  if (!context.open || !mounted) return null;

  const content = (
    <div
      ref={contentRef}
      data-slot="select-content"
      className={cn(
        'fixed z-50 max-h-96 min-w-[20ch] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
        position === 'popper' && (coords.showAbove ? 'mb-1' : 'mt-1'),
        className
      )}
      style={{
        top: coords.top,
        left: coords.left,
        width: coords.width,
      }}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );

  return (
    <div ref={triggerRef} style={{ display: 'contents' }}>
      {createPortal(content, document.body)}
    </div>
  );
}

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function SelectItem({ className, children, value, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const isSelected = context.value === value;

  return (
    <div
      data-slot="select-item"
      className={cn(
        "outline-hidden relative flex w-full cursor-default select-none items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm py-1.5 pl-2 pr-8 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      onClick={() => context.onValueChange?.(value)}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

// These components are not strictly necessary for basic functionality
// but included for API compatibility
function SelectScrollUpButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
