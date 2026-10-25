'use client';

import { forwardRef, cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, asChild = false, children, className = '', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const normalizedVariant = variant === 'default' ? 'primary' : variant;

    const variants: Record<string, string> = {
      primary:
        'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 font-semibold',
      secondary:
        'bg-secondary text-secondary-foreground border border-border/80 hover:bg-muted/80 hover:border-border shadow-sm',
      outline:
        'border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground',
      ghost:
        'text-muted-foreground hover:bg-muted hover:text-foreground',
      danger:
        'bg-destructive text-white shadow-sm hover:bg-destructive/90',
    };

    const sizes: Record<string, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-10 px-4 py-2 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    const combinedClassName = cn(
      baseStyles,
      variants[normalizedVariant] || variants.primary,
      sizes[size] || sizes.md,
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string; disabled?: boolean; children?: React.ReactNode }>;
      return cloneElement(child, {
        className: cn(combinedClassName, child.props.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
