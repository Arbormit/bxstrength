import React from 'react';
import { Target, CheckCircle2, ArrowRight, Activity, ShieldCheck, Dumbbell } from 'lucide-react';

interface AssessmentSectionProps {
  onOpenAssessment: () => void;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({ onOpenAssessment }) => {
  return (
    <section id="assessment-section" className="w-full bg-gradient-to-b from-[#0a0a0c] via-[#121216] to-[#0a0a0c] text-white py-16 border-b border-zinc-800/80 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#16161a] border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Top Decorative Tag */}
          <div className="flex justify-center sm:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-black uppercase tracking-widest">
              <Target className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>60-SECOND INTERACTIVE QUIZ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                NOT SURE WHICH PROGRAM IS RIGHT FOR YOU?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                Take our quick 60-second assessment. Get instant personalized recommendations matched to your specific fitness goals, schedule, and experience level.
              </p>

              {/* 3 Quick Step Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0">
                    1
                  </div>
                  <span className="text-xs font-extrabold text-zinc-200">Select Goal</span>
                </div>
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0">
                    2
                  </div>
                  <span className="text-xs font-extrabold text-zinc-200">Experience Level</span>
                </div>
                <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0">
                    3
                  </div>
                  <span className="text-xs font-extrabold text-zinc-200">Custom Match</span>
                </div>
              </div>
            </div>

            {/* Right Action CTA Column */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-end justify-center">
              <button
                onClick={onOpenAssessment}
                className="w-full sm:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-[#CCFF00]/20 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>START FREE ASSESSMENT</span>
                <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-zinc-400 mt-3 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free • Takes under 60 seconds</span>
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
