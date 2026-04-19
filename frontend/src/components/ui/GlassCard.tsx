import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'purple' | 'cyan' | 'none';
  onClick?: () => void;
}

export default function GlassCard({ children, className, hover = false, glow = 'none', onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-6',
        glow === 'purple' && 'glow-purple',
        glow === 'cyan' && 'glow-cyan',
        hover && 'cursor-pointer transition-shadow duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
