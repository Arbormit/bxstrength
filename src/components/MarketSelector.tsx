import React from 'react';
import { Globe } from 'lucide-react';

interface MarketSelectorProps {
  className?: string;
  variant?: 'header' | 'footer' | 'modal' | 'pill';
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({ className }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1.5 rounded-lg ${className || ''}`}>
      <span className="text-sm">🇬🇧</span>
      <span className="font-mono text-white">GBP (£)</span>
      <Globe className="w-3.5 h-3.5 text-[#CCFF00]" />
    </div>
  );
};

