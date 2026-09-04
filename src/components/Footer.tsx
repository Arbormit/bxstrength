import React from 'react';
import { ViewPage } from '../types';
import { Dumbbell, MapPin, Mail, ArrowRight, Instagram, Youtube, X } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: ViewPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: ViewPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0a0a] text-zinc-400 pt-16 pb-8 border-t border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Grid - Balanced 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-zinc-800">
          
          {/* Column 1: BRAND ABOUT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black">
                <Dumbbell className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                BX<span className="text-[#CCFF00]">STRENGTH</span>
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              #1 UK &amp; USA Direct Boxing, Strength &amp; Conditioning Coaching Platform. Engineered by Head Coach Shaban Faridi for elite physical transformation.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <p className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                <span className="leading-snug text-white font-semibold">185/A, Streetno. 3, Zakir nagar, Okhla, New Delhi - 110025</span>
              </p>
              <p className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <a href="mailto:support@bxstrength.com" className="hover:text-[#CCFF00] transition-colors font-bold text-white">support@bxstrength.com</a>
              </p>
              <p className="flex items-center gap-2 text-zinc-300">
                <span className="text-[#CCFF00] font-bold">Call / WhatsApp:</span>
                <a href="https://wa.me/918423594482" target="_blank" rel="noopener noreferrer" className="hover:text-[#CCFF00] transition-colors font-black text-white text-sm">8423594482</a>
              </p>
            </div>
          </div>

          {/* Column 2: PLATFORM NAVIGATION */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-b border-zinc-800 pb-2">
              PLATFORM NAVIGATION
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> About BxStrength
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trainers')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Coaching Roster
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('schedule')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Class Timetable
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Articles &amp; Insights
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Contact Headquarters
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: CONNECT & SOCIAL MEDIA */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-b border-zinc-800 pb-2">
              CONNECT &amp; SOCIAL MEDIA
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Follow BxStrength for workout techniques, fight training highlights, macro tips, and real athlete transformations.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bxstrength_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#CCFF00]/60 p-2.5 rounded-xl transition-all group overflow-hidden"
                title="Follow BxStrength on Instagram"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">Instagram</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@bxstrength_</p>
                </div>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.net/@bxstrength_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#CCFF00]/60 p-2.5 rounded-xl transition-all group overflow-hidden"
                title="Follow BxStrength on Threads"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#CCFF00] shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.186 24.004c-3.262 0-6.07-.98-8.125-2.836C2.012 19.317 1 16.574 1 13.153c0-3.328.984-6.024 2.846-7.808C5.696 3.57 8.358 2.65 11.53 2.65c3.218 0 5.894.945 7.739 2.732 1.83 1.774 2.76 4.382 2.76 7.753v1.393c0 .874-.236 1.624-.702 2.228-.466.604-1.127.945-1.966.945-.964 0-1.745-.443-2.261-1.285-.98 1.137-2.316 1.737-3.864 1.737-1.42 0-2.58-.456-3.355-1.32-.774-.863-1.178-2.072-1.178-3.498 0-1.442.42-2.656 1.214-3.512.795-.856 1.942-1.29 3.318-1.29 1.05 0 1.986.275 2.781.819v-.607c0-1.954-.486-3.415-1.444-4.343-.959-.928-2.424-1.399-4.354-1.399-1.579 0-2.955.334-3.978.992-.93.597-1.52 1.488-1.706 2.576l-2.02-.349c.277-1.637 1.168-2.986 2.577-3.905C9.096.58 11.144.1 13.784.1c2.673 0 4.757.676 6.19 2.01 1.434 1.334 2.16 3.447 2.16 6.28v6.463c0 1.543.435 2.731 1.293 3.535l-1.41 1.425c-.569-.533-.996-1.233-1.268-2.083-.759 1.392-1.97 2.148-3.528 2.148-1.378 0-2.502-.456-3.25-1.33-.749-.874-1.14-2.032-1.14-3.352 0-1.44.402-2.627 1.162-3.432.76-.805 1.842-1.213 3.129-1.213.91 0 1.713.203 2.387.594v-.482c0-1.312-.34-2.317-.988-2.909-.648-.592-1.658-.892-2.93-.892-1.173 0-2.186.236-2.93.702-.743.466-1.213 1.171-1.362 2.059l-1.955-.386C8.835 6.07 9.544 4.9 10.74 4.09c1.196-.81 2.825-1.22 4.71-1.22 2.062 0 3.693.525 4.847 1.562 1.154 1.037 1.74 2.613 1.74 4.68v6.741c0 1.408.4 2.457 1.164 3.074l-1.378 1.455c-.532-.432-.937-1.045-1.182-1.802-.821 1.196-2.08 1.802-3.695 1.802z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">Threads</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@bxstrength_</p>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@BXSTRENGTH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#CCFF00]/60 p-2.5 rounded-xl transition-all group overflow-hidden"
                title="Subscribe to BxStrength on YouTube"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">YouTube</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@BXSTRENGTH</p>
                </div>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://www.x.com/Bxstrength_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#CCFF00]/60 p-2.5 rounded-xl transition-all group overflow-hidden"
                title="Follow BxStrength on X (Twitter)"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <X className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">X (Twitter)</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@Bxstrength_</p>
                </div>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/bxstrength"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2.5 bg-[#18181b] hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#CCFF00]/60 p-2.5 rounded-xl transition-all group overflow-hidden"
                title="Join BxStrength on Telegram"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">Telegram</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@BxStrength</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="text-center sm:text-left">
            © 2026 BxStrength. All rights reserved. | Design &amp; Developed by : <a href="https://www.arbormit.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline font-semibold">Arbormit</a>
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <span>•</span>
            <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <span>•</span>
            <span className="text-zinc-400">support@bxstrength.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
