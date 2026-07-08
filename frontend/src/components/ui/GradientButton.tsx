import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'min-h-10 px-4 text-sm',
    md: 'min-h-11 px-5 text-sm',
    lg: 'min-h-12 px-6 text-base',
  };

  const variantClasses = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--q-purple-deep)] disabled:hover:bg-[var(--primary)]',
    outline: 'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
    ghost: 'text-[var(--foreground)] hover:bg-[var(--accent)]',
  };

  // Omit conflicting drag event props to avoid type errors with motion.button
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    ...restProps
  } = props;

  return (
    <>
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn(
          'focus-ring inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...restProps}
      >
        {children}
      </motion.button>
    </>
  );
}
