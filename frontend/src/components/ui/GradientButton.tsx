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
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-brand text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30',
    outline: 'border border-[var(--q-purple)] text-[var(--q-purple)] hover:bg-[var(--q-purple)] hover:text-white',
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'relative rounded-xl font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--q-purple)]',
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
