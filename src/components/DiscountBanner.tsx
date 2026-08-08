import React, { useState } from 'react';
import { Tag, CheckCircle2, Copy } from 'lucide-react';

export const DiscountBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FITZONE25OFF');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="relative bg-[#0D061A] py-16 overflow-hidden text-white border-t border-b border-purple-950">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600"
          alt="Discount Gym Banner"
          className="w-full h-full object-cover filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D061A] via-[#120726]/90 to-[#0D061A]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 bg-[#E52165]/20 border border-[#E52165]/40 text-[#E52165] px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase">
          <Tag className="w-3.5 h-3.5" /> SPECIAL EXCLUSIVE OFFER
        </div>

        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
          <span className="text-[#E52165]">25%</span> DISCOUNT
        </h2>

        <p className="text-gray-300 text-sm sm:text-base font-medium max-w-lg mx-auto">
          Subscribe to our newsletter and get a coupon code!
        </p>

        {subscribed ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-lg max-w-md mx-auto backdrop-blur-md animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-sm uppercase mb-2">
              <CheckCircle2 className="w-5 h-5" /> Coupon Code Unlocked!
            </div>
            <p className="text-xs text-gray-300 mb-4">
              Thank you for subscribing! Present this coupon code at checkout or booking:
            </p>
            <div className="flex items-center justify-between bg-black/60 p-3 rounded border border-white/20">
              <span className="text-lg font-mono font-black text-amber-400 tracking-wider">
                FITZONE25OFF
              </span>
              <button
                onClick={handleCopyCode}
                className="bg-[#E52165] hover:bg-pink-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-500 px-5 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E52165]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#E52165] hover:bg-[#c41551] text-white font-extrabold text-xs tracking-widest uppercase px-8 py-3.5 transition-all shadow-lg shadow-pink-600/30 flex-shrink-0"
              id="btn-subscribe-discount"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
