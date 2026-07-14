import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'gold' | 'outline' | 'ghost';
}

export function GoldButton({
  children,
  loading,
  variant = 'gold',
  className,
  disabled,
  ...props
}: GoldButtonProps) {
  const isGold = variant === 'gold';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "flex items-center justify-center font-bold rounded-xl h-11 px-4 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        isGold && "bg-gradient-to-b from-yellow-400 to-amber-600 text-amber-950 hover:opacity-90",
        isOutline && "border border-border text-foreground hover:bg-secondary",
        isGhost && "text-foreground hover:bg-secondary/50",
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : children}
    </button>
  );
}
