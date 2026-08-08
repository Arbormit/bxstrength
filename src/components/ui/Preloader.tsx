import React, { useState, useEffect } from 'react';
import { Dumbbell, Flame, Trophy, Activity, Zap, ShieldCheck, WifiOff, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING ATHLETIC STRENGTH ENGINE...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const textSequence = [
      { threshold: 15, text: 'INITIALIZING ATHLETIC STRENGTH ENGINE...' },
      { threshold: 45, text: isSlowConnection ? 'OPTIMIZING ASSETS FOR SLOW NETWORK...' : 'LOADING PERIODIZED HYPERSTROPHY MODULES...' },
      { threshold: 75, text: 'CONNECTING HIGH-PERFORMANCE COACHING NETWORK...' },
      { threshold: 95, text: 'PREPARING BXSTRENGTH ARENA EXPERIENCE...' }
    ];

    const stepSpeed = isSlowConnection ? 160 : 110;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * (isSlowConnection ? 4 : 8)) + 3;
        const currentTextObj = textSequence.find(t => next >= t.threshold);
        if (currentTextObj) setLoadingText(currentTextObj.text);

        return next > 100 ? 100 : next;
      });
    }, stepSpeed);

    return () => clearInterval(interval);
  }, [onComplete, isSlowConnection]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070708] text-white font-sans transition-opacity duration-700 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-black to-[#070708] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center space-y-8">
        
        {/* Slow Network / Offline Alert Badge */}
        {!isOnline ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE: LOADING CACHED ARENA DATA</span>
          </div>
        ) : isSlowConnection ? (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SLOW INTERNET: HOLD ON, LOADING MEDIA...</span>
          </div>
        ) : null}

        {/* Animated Icon Arena */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          
          {/* Spinning Ring Outer Plate */}
          <div className="absolute inset-0 border-2 border-dashed border-emerald-500/40 rounded-full animate-spin [animation-duration:8s]" />
          
          {/* Pulsing Glow Ring */}
          <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-ping [animation-duration:2.5s]" />

          {/* Floating Fitness Icons Carousel */}
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl animate-bounce [animation-delay:0ms]">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="p-3.5 bg-emerald-500 text-black rounded-2xl shadow-2xl animate-pulse">
              <Zap className="w-9 h-9 fill-black" />
            </div>

            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl animate-bounce [animation-delay:150ms]">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          {/* Floating Orbiting Mini Badges */}
          <div className="absolute -top-1 right-0 p-1.5 bg-zinc-900 border border-emerald-500/50 rounded-full animate-pulse">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>

          <div className="absolute -bottom-1 left-0 p-1.5 bg-zinc-900 border border-blue-500/50 rounded-full animate-pulse">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-zinc-400">
              BxStrength
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            HIGH PERFORMANCE <span className="text-emerald-400">ATHLETICS</span>
          </h1>

          <p className="text-xs font-mono font-medium text-emerald-400/90 tracking-widest h-5">
            {loadingText}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold px-1">
            <span>LOADING ARENA DATA</span>
            <span className="text-emerald-400 font-black">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
