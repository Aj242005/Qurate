import { useEffect, useRef } from 'react';
import { useInView, animate } from 'motion/react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, target, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
