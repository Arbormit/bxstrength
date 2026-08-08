import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'table-row';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1
}) => {
  const elements = Array.from({ length: count });

  if (variant === 'circle') {
    return (
      <div className={`animate-pulse bg-zinc-800/60 rounded-full ${className}`} />
    );
  }

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {elements.map((_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-[#121214] border border-zinc-800/80 p-6 rounded-2xl space-y-3 ${className}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 bg-zinc-800/80 rounded w-1/4" />
              <div className="h-4 bg-zinc-800/80 rounded w-1/6" />
            </div>
            <div className="h-5 bg-zinc-800/60 rounded w-3/4" />
            <div className="h-16 bg-zinc-900/80 border border-zinc-800/50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {elements.map((_, i) => (
          <tr key={i} className="animate-pulse border-b border-zinc-800/60">
            <td className="p-4"><div className="h-4 bg-zinc-800/80 rounded w-24" /></td>
            <td className="p-4"><div className="h-4 bg-zinc-800/60 rounded w-32" /></td>
            <td className="p-4"><div className="h-4 bg-zinc-800/60 rounded w-20" /></td>
            <td className="p-4"><div className="h-4 bg-zinc-800/80 rounded w-16" /></td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-2">
      {elements.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-zinc-800/60 rounded ${className || 'h-4 w-full'}`}
        />
      ))}
    </div>
  );
};
