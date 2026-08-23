import React, { useState } from 'react';
import { ViewPage } from '../types';
import { Dumbbell, MapPin, Mail, ArrowRight, Shield, FileText, Lock, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: ViewPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedToast, setSubscribedToast] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribedToast(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribedToast(false), 4000);
    }
  };

  const handleNav = (page: ViewPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0a0a] text-zinc-400 pt-16 pb-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-zinc-800">
          
          {/* Column 1: BRAND ABOUT */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black">
                <Dumbbell className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                BxStrength<span className="text-zinc-500">.</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              UK's premier digital strength & high-performance coaching platform. 1-on-1 expert coaching engineered for sustainable body recomposition and athletic longevity.
            </p>
            <div className="text-xs text-zinc-400 space-y-1 pt-1 font-medium">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-zinc-500" /> Mayfair, London, UK</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-zinc-500" /> info@bxstrength.com</p>
            </div>
          </div>

          {/* Column 2: NAVIGATION */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-b border-zinc-800 pb-2">
              PLATFORM NAVIGATION
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> About BxStrength
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('trainers')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> UK Certified Coaches
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('schedule')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Class Timetable
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Performance Articles
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-zinc-500" /> Contact & HQ Support
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
            <div className="space-y-2 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#18181b] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors">Instagram</p>
                  <p className="text-[10px] text-zinc-500 font-mono">@bxstrength_official</p>
                </div>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#18181b] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors">Facebook</p>
                  <p className="text-[10px] text-zinc-500 font-mono">BxStrength Performance</p>
                </div>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#18181b] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors">YouTube</p>
                  <p className="text-[10px] text-zinc-500 font-mono">BxStrength Training</p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4: NEWSLETTER */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-b border-zinc-800 pb-2">
              INSIGHTS NEWSLETTER
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe to get scientific periodization guides, macro nutrition updates, and performance insights.
            </p>

            <form onSubmit={handleNewsletter} className="flex items-stretch pt-1">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 text-white placeholder-zinc-500 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-white rounded-l-lg"
              />
              <button
                type="submit"
                className="bg-white hover:bg-zinc-200 text-black px-4 flex items-center justify-center transition-colors flex-shrink-0 rounded-r-lg font-bold"
                aria-label="Subscribe Newsletter"
                id="btn-footer-subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {subscribedToast && (
              <p className="text-[11px] text-emerald-400 font-bold animate-in fade-in">
                ✓ Subscribed successfully! Check your inbox for updates.
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="text-center sm:text-left">
            © 2026 BxStrength. All rights reserved. | Design & Developed by : <a href="https://www.arbormit.com">Arbormit</a>
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">Terms</button>
            <span>•</span>
            <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">Privacy</button>
            <span>•</span>
            <span className="text-zinc-400">info@bxstrength.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

