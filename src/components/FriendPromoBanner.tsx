import React from 'react';
import { Users } from 'lucide-react';

interface FriendPromoBannerProps {
  onOpenMembership: () => void;
}

export const FriendPromoBanner: React.FC<FriendPromoBannerProps> = ({ onOpenMembership }) => {
  return (
    <section className="relative bg-[#070114] py-20 overflow-hidden text-white border-t border-purple-950">
      {/* Dark Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0323] via-[#1A032E] to-[#080214] opacity-90"></div>
      
      {/* Background imagery */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600"
          alt="Group Workout Friends Promo"
          className="w-full h-full object-cover filter contrast-125"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#E52165] text-xs font-black tracking-widest uppercase">
          <Users className="w-3.5 h-3.5" /> REFERRAL SPECIAL PROGRAM
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          BRING ALL YOUR FRIENDS. <br />
          <span className="text-[#E52165]">GET 50% DISCOUNT!</span>
        </h2>

        <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
          Give dry stars form us called won't winged had abundantly land Midst appear for you eden
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenMembership}
            className="bg-[#E52165] hover:bg-[#c41551] text-white font-extrabold text-xs tracking-widest uppercase px-10 py-4 transition-all shadow-xl shadow-pink-600/30 transform hover:-translate-y-0.5 active:translate-y-0"
            id="btn-join-friends-promo"
          >
            JOIN WITH US
          </button>
        </div>

      </div>
    </section>
  );
};
