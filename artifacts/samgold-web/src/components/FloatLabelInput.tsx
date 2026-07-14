import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

export interface FloatLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  hint?: string;
}

export const FloatLabelInput = forwardRef<HTMLInputElement, FloatLabelInputProps>(
  ({ label, leftIcon, rightElement, error, hint, className, id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;

    return (
      <div className={cn('relative w-full', className)}>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            placeholder=" "
            className={cn(
              "peer w-full bg-transparent border rounded-xl px-4 pt-6 pb-2 text-foreground text-base outline-none transition-all placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-50",
              error ? "border-destructive focus:border-destructive focus:ring-destructive/30" : "border-border",
              leftIcon ? "pr-11" : "",
              rightElement ? "pl-11" : ""
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute right-4 text-muted-foreground pointer-events-none transition-all duration-150",
              "top-4 text-base",
              "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs",
              error && "peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive",
              !error && "peer-[:not(:placeholder-shown)]:text-muted-foreground",
              leftIcon && "peer-[:placeholder-shown]:right-11 peer-focus:right-4 peer-[:not(:placeholder-shown)]:right-4"
            )}
          >
            {label}
          </label>
          
          {leftIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors">
              {leftIcon}
            </div>
          )}
          
          {rightElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-destructive text-xs mt-1 px-1" data-testid={`error-${inputId}`}>{error}</p>
        )}
        {hint && !error && (
          <p className="text-muted-foreground text-xs mt-1 px-1">{hint}</p>
        )}
      </div>
    );
  }
);

FloatLabelInput.displayName = 'FloatLabelInput';
