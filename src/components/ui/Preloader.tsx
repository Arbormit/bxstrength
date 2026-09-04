import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fast, responsive loading progression (~600ms - 900ms)
    const stepSpeed = isSlowConnection ? 40 : 25;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 400);
          }, 150);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 12) + 8;
        return next > 100 ? 100 : next;
      });
    }, stepSpeed);

    return () => clearInterval(interval);
  }, [onComplete, isSlowConnection]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c] text-white font-sans transition-opacity duration-500 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-[#0a0a0c] to-[#0a0a0c] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        
        {/* Simple & Clean Brand Logo Badge */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#CCFF00]/10 rounded-2xl blur-sm" />
            <Zap className="w-8 h-8 text-[#CCFF00] relative z-10 animate-pulse" />
          </div>
        </div>

        {/* Brand Name & Friendly Tagline */}
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-widest uppercase text-white flex items-center justify-center gap-2">
            <span>BXSTRENGTH</span>
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
          </h1>

          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            {!isOnline ? 'Loading offline data...' : 'Preparing your fitness experience...'}
          </p>
        </div>

        {/* Minimal User-Centric Progress Bar */}
        <div className="w-48 space-y-2">
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
            <div
              className="h-full bg-[#CCFF00] rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(204,255,0,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold px-0.5">
            <span>LOADING</span>
            <span className="text-[#CCFF00]">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
