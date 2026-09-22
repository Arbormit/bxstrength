import React from 'react';
import { ViewPage } from '../types';
import { CheckCircle2, Award, Users, ShieldCheck } from 'lucide-react';

interface WelcomeSectionProps {
  onNavigate: (page: ViewPage) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#E52165] uppercase">
                ABOUT BXSTRENGTH
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase leading-tight">
                WELCOME TO BXSTRENGTH <br className="hidden sm:inline" />
                PERFORMANCE &amp; FITNESS
              </h2>
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              At BxStrength, we deliver elite 1-on-1 personal coaching, technical fitness boxing, strength &amp; conditioning, and mobility protocols. Engineered by Head Coach Shahban Faridi, every workout is custom-built for your specific body composition and athletic goals.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              Whether you are training for weight loss, lean muscle definition, fight endurance, or functional mobility, BxStrength provides transparent pricing, real-time tracking, and dedicated master coaching every step of the way.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">1:1 Technical Boxing &amp; Padwork</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Certified Elite Personal Coaches</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Custom Nutrition &amp; Macro Guidance</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Live Virtual &amp; In-Person Sessions</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto bg-[#E52165] hover:bg-[#c41551] text-white font-extrabold text-xs tracking-widest uppercase px-8 py-4 transition-all shadow-md shadow-pink-500/20 transform hover:-translate-y-0.5 active:translate-y-0 min-h-[44px] flex items-center justify-center"
                id="btn-welcome-learn-more"
              >
                LEARN MORE ABOUT US
              </button>
            </div>
          </div>

          {/* Right Image with Signature Pink Accent Outline Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative p-2 sm:p-3 w-full max-w-md">
              {/* Hot Pink Accent Border Frame behind image */}
              <div className="absolute top-0 right-0 w-[90%] h-[90%] sm:w-[92%] sm:h-[92%] border-2 border-[#E52165] pointer-events-none z-0 transform translate-x-2 sm:translate-x-3 translate-y-2 sm:translate-y-3"></div>

              {/* Main Photo Card */}
              <div className="relative z-10 bg-white p-2 shadow-xl border border-gray-100 w-full">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                  alt="Fitness Partners Workout"
                  className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover"
                />
                
                {/* Bottom caption bar */}
                <div className="bg-gray-900 text-white p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-[#E52165] shrink-0" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">Top Rated Coaching 2026</p>
                      <p className="text-[11px] text-gray-400">Awarded for Personal Coaching Excellence</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
