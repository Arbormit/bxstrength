import React from 'react';
import { Dumbbell, Flame, HeartPulse, Activity, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const services = [
    {
      title: '1-ON-1 BESPOKE STRENGTH & RECOMPOSITION',
      icon: Dumbbell,
      problem: 'Stuck in training plateaus with generic workout apps, inconsistent form, or losing lean muscle during weight loss attempts.',
      solution: 'Scientifically periodized strength programming with strict video form feedback, structural balance work, and targeted hypertrophy splits.',
      result: 'Noticeable strength gains within 4 weeks, optimized posture, and sustainable body recomposition without overtraining.',
    },
    {
      title: 'EXECUTIVE CONDITIONING & METABOLIC HEALTH',
      icon: Flame,
      problem: 'High-stress business schedule leading to low energy, elevated cortisol, poor sleep quality, and sluggish metabolic rate.',
      solution: 'Time-efficient, high-yield metabolic conditioning protocol engineered for maximum EPOC (Excess Post-Exercise Oxygen Consumption).',
      result: 'Sustained daily mental clarity, rapid fat loss, improved HRV (Heart Rate Variability), and peak cardiovascular output.',
    },
    {
      title: 'CLINICAL & SUSTAINABLE NUTRITION STRATEGY',
      icon: HeartPulse,
      problem: 'Confused by fad diets, extreme calorie restriction, energy crashes, and rebounding after stopping strict meal plans.',
      solution: 'Flexible macronutrient architecture, circadian-aligned meal timing, and gut-health optimization tailored to your lifestyle.',
      result: 'Flexible eating habits, zero food anxiety, sustained daytime vigor, and long-term fat loss maintenance.',
    },
  ];

  return (
    <section id="services-section" className="w-full bg-[#0a0a0a] text-white py-20 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3">
            INTERACTIVE SERVICES ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            SCIENTIFIC PROBLEM-SOLVING
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Every BxStrength service addresses your exact bottlenecks with a structured protocol and measurable result.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <div
                key={idx}
                className="bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-6 leading-tight">
                    {srv.title}
                  </h3>

                  <div className="space-y-4 text-xs">
                    {/* Problem */}
                    <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-200">
                      <div className="flex items-center gap-2 font-bold uppercase text-[10px] text-red-400 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        PROBLEM
                      </div>
                      <p className="leading-relaxed">{srv.problem}</p>
                    </div>

                    {/* Solution */}
                    <div className="p-3.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-200">
                      <div className="flex items-center gap-2 font-bold uppercase text-[10px] text-zinc-300 mb-1">
                        <Zap className="w-3.5 h-3.5 text-white" />
                        SOLUTION
                      </div>
                      <p className="leading-relaxed">{srv.solution}</p>
                    </div>

                    {/* Expected Result */}
                    <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
                      <div className="flex items-center gap-2 font-bold uppercase text-[10px] text-emerald-400 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        EXPECTED RESULT
                      </div>
                      <p className="leading-relaxed">{srv.result}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800">
                  <button
                    onClick={onOpenBooking}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    CONSULT FOR THIS SERVICE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

