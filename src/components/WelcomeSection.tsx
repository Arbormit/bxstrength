import React from 'react';
import { ViewPage } from '../types';
import { CheckCircle2, Award, Users, ShieldCheck } from 'lucide-react';

interface WelcomeSectionProps {
  onNavigate: (page: ViewPage) => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#E52165] uppercase">
                ABOUT FITZONE CLUB
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase leading-tight">
                WELCOME TO OUR BEST <br />
                FITNESS CLUB
              </h2>
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              In seas is man brought it them that void fill land fourth. All thing air gathering day replenish bearing 
              very. Together first good given firmament moving, night moved moved also them void land.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              In seas is man brought it them that void fill land fourth. All thing air gathering day, days replenish 
              bearing very. Together first good given firmament moving, is moved are moved also them void land. 
              Hath creeping subdue he. Fish. Green face whose it be seasons multiply female midst.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">State-of-the-Art Gym Equipment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Certified Elite Personal Trainers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Customized Nutrition & Body Scans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E52165] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-800">Clean & Hygienic Locker Facilities</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('about')}
                className="bg-[#E52165] hover:bg-[#c41551] text-white font-extrabold text-xs tracking-widest uppercase px-8 py-4 transition-all shadow-md shadow-pink-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
                id="btn-welcome-learn-more"
              >
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Right Image with Signature Pink Accent Outline Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative p-3">
              {/* Hot Pink Accent Border Frame behind image (Exactly matching screenshot) */}
              <div className="absolute top-0 right-0 w-[92%] h-[92%] border-2 border-[#E52165] pointer-events-none z-0 transform translate-x-3 translate-y-3"></div>

              {/* Main Photo Card */}
              <div className="relative z-10 bg-white p-2 shadow-xl border border-gray-100 max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                  alt="Fitness Partners Workout"
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                />
                
                {/* Bottom caption bar */}
                <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-[#E52165]" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">Top Rated Gym 2026</p>
                      <p className="text-[11px] text-gray-400">Awarded for Facility Excellence</p>
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
