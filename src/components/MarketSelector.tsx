import React, { useState, useEffect } from 'react';
import { MarketCountry, MarketConfig } from '../types';
import { MARKETS, getActiveMarketCountry, setActiveMarketCountry } from '../utils/marketService';
import { Globe, Check } from 'lucide-react';

interface MarketSelectorProps {
  className?: string;
  variant?: 'header' | 'footer' | 'modal' | 'pill';
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({ className, variant = 'header' }) => {
  const [currentCountry, setCurrentCountry] = useState<MarketCountry>('GB');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentCountry(getActiveMarketCountry());

    const handleMarketChange = (e: any) => {
      if (e.detail?.country) {
        setCurrentCountry(e.detail.country);
      }
    };

    window.addEventListener('bxstrength_market_changed', handleMarketChange);
    return () => window.removeEventListener('bxstrength_market_changed', handleMarketChange);
  }, []);

  const handleSelect = (country: MarketCountry) => {
    setActiveMarketCountry(country);
    setCurrentCountry(country);
    setIsOpen(false);
  };

  const activeConfig = MARKETS[currentCountry] || MARKETS.GB;

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1 bg-[#18181b] border border-zinc-800 p-1 rounded-xl ${className || ''}`}>
        {(Object.keys(MARKETS) as MarketCountry[]).map((code) => {
          const m = MARKETS[code];
          const isSelected = currentCountry === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#CCFF00] text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>{m.flagEmoji}</span>
              <span>{m.currency} ({m.symbol})</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
        title="Change Country / Currency Market"
      >
        <span className="text-sm">{activeConfig.flagEmoji}</span>
        <span className="font-mono">{activeConfig.currency} ({activeConfig.symbol})</span>
        <Globe className="w-3.5 h-3.5 text-[#CCFF00]" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[#121214] border border-zinc-800 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in duration-150">
            <div className="px-3 py-1.5 border-b border-zinc-800 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
              Select Regional Market
            </div>

            {(Object.keys(MARKETS) as MarketCountry[]).map((code) => {
              const m = MARKETS[code];
              const isSelected = currentCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 text-[#CCFF00]'
                      : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.flagEmoji}</span>
                    <div>
                      <div className="font-bold">{m.countryName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{m.currency} ({m.symbol})</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#CCFF00]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
