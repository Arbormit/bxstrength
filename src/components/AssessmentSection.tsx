import React, { useState } from 'react';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

interface AssessmentSectionProps {
  onOpenAssessment: () => void;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({ onOpenAssessment }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="assessment-section" className="w-full bg-[#09090b] text-white py-16 sm:py-20 border-b border-zinc-800/80 relative overflow-hidden font-sans">
      {/* Background Ambient Neon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[#CCFF00]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* PREMIUM SUSPENDED CARD WRAPPER — PROPERLY SPACED, NO OVERLAP WITH HERO */}
        <div className="relative w-full max-w-6xl mx-auto pt-6">
          
          {/* Top Hanging Cables (Confined Within Section) */}
          <div className="absolute top-0 left-12 sm:left-24 w-[2px] h-6 bg-gradient-to-b from-zinc-700 via-[#CCFF00]/60 to-[#CCFF00] z-20 pointer-events-none flex flex-col items-center shadow-[0_0_8px_#CCFF00]">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-[#CCFF00] -top-1 absolute shadow-[0_0_6px_#CCFF00]" />
          </div>

          <div className="absolute top-0 right-12 sm:right-24 w-[2px] h-6 bg-gradient-to-b from-zinc-700 via-[#CCFF00]/60 to-[#CCFF00] z-20 pointer-events-none flex flex-col items-center shadow-[0_0_8px_#CCFF00]">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-[#CCFF00] -top-1 absolute shadow-[0_0_6px_#CCFF00]" />
          </div>

          {/* MAIN HANGING CARD CONTAINER */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-gradient-to-b from-[#181820] via-[#121218] to-[#0c0c10] border-t-2 border-t-[#CCFF00] border-x border-b border-zinc-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_10px_30px_rgba(204,255,0,0.08)] transition-all duration-500 ease-out relative overflow-hidden backdrop-blur-xl ${
              isHovered ? '-translate-y-1.5 shadow-[0_35px_80px_-15px_rgba(204,255,0,0.18)] border-zinc-700' : ''
            }`}
          >
            {/* Top Metallic Grommet Anchors */}
            <div className="absolute top-2 left-12 sm:left-24 -translate-x-1/2 flex items-center justify-center z-30">
              <div className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-[#CCFF00] shadow-[0_0_10px_#CCFF00] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping opacity-80" />
              </div>
            </div>
            <div className="absolute top-2 right-12 sm:right-24 translate-x-1/2 flex items-center justify-center z-30">
              <div className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-[#CCFF00] shadow-[0_0_10px_#CCFF00] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping opacity-80" />
              </div>
            </div>

            {/* Inner Glass Highlight & Ambient Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/60 to-transparent pointer-events-none" />
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#CCFF00]/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header Tag Badge */}
            <div className="flex justify-center sm:justify-start mb-6 pt-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <span>60-SECOND INTERACTIVE ASSESSMENT</span>
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] inline-block ml-1 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Content Column */}
              <div className="lg:col-span-8 text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  NOT SURE WHICH PROGRAM IS RIGHT FOR YOU?
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed font-normal">
                  Take our quick 60-second assessment. Get instant personalized recommendations matched to your specific fitness goals, schedule, and experience level.
                </p>

                {/* 3 Interactive Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
                  <div 
                    onClick={onOpenAssessment}
                    className="p-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/60 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 group-hover:bg-[#CCFF00] group-hover:text-black transition-all shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                      1
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Step 01</span>
                      <span className="text-xs font-black text-zinc-100 group-hover:text-[#CCFF00] transition-colors">Select Goal</span>
                    </div>
                  </div>

                  <div 
                    onClick={onOpenAssessment}
                    className="p-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/60 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 group-hover:bg-[#CCFF00] group-hover:text-black transition-all shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                      2
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Step 02</span>
                      <span className="text-xs font-black text-zinc-100 group-hover:text-[#CCFF00] transition-colors">Experience Level</span>
                    </div>
                  </div>

                  <div 
                    onClick={onOpenAssessment}
                    className="p-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/60 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-xs shrink-0 group-hover:scale-110 group-hover:bg-[#CCFF00] group-hover:text-black transition-all shadow-[0_0_10px_rgba(204,255,0,0.2)]">
                      3
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Step 03</span>
                      <span className="text-xs font-black text-zinc-100 group-hover:text-[#CCFF00] transition-colors">Custom Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Action CTA Column */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-end justify-center">
                <button
                  onClick={onOpenAssessment}
                  className="w-full sm:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(204,255,0,0.3)] hover:shadow-[0_15px_35px_rgba(204,255,0,0.45)] hover:scale-105 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>START FREE ASSESSMENT</span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1.5 transition-transform" />
                </button>
                <p className="text-[11px] text-zinc-400 mt-3.5 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free • Takes under 60 seconds</span>
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
