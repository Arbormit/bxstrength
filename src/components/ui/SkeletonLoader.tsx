import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'profile' | 'kpi' | 'text' | 'hero';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="bg-[#111111] border border-gray-800 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-800 rounded w-24"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-800 rounded w-16"></div>
            <div className="h-3 bg-gray-800/60 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-[#111111] border border-gray-800 p-6 space-y-4 animate-pulse">
        <div className="h-5 bg-gray-800 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {items.map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-800"></div>
                <div className="space-y-1">
                  <div className="h-3.5 bg-gray-800 rounded w-32"></div>
                  <div className="h-2.5 bg-gray-800/60 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-16"></div>
              <div className="h-4 bg-gray-800 rounded w-20"></div>
              <div className="h-4 bg-gray-800 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="bg-[#111111] border border-gray-800 p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-800"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-800 rounded w-48"></div>
            <div className="h-3 bg-gray-800/60 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="bg-[#111111] border border-gray-800 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-800 rounded w-20"></div>
            <div className="h-4 bg-gray-800 rounded w-12"></div>
          </div>
          <div className="h-6 bg-gray-800 rounded w-3/4"></div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-gray-800/60 rounded w-full"></div>
            <div className="h-3 bg-gray-800/60 rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-gray-800/80 rounded w-full mt-4"></div>
        </div>
      ))}
    </div>
  );
};
