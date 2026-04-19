import { cn } from '@/lib/utils';

interface LoadingShimmerProps {
  lines?: number;
  className?: string;
}

export default function LoadingShimmer({ lines = 3, className }: LoadingShimmerProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer rounded-lg"
          style={{
            height: '14px',
            width: `${85 - i * 15}%`,
          }}
        />
      ))}
    </div>
  );
}
