import React, { useState } from 'react';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

interface AssessmentSectionProps {
  onOpenAssessment: () => void;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({ onOpenAssessment }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="assessment-section" className="w-full bg-gradient-to-b from-[#09090b] via-[#101014] to-[#09090b] text-white py-20 border-b border-zinc-800/80 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#CCFF00]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HANGING CORDS & SUSPENDED CARD WRAPPER */}
        <div className="relative w-full max-w-6xl mx-auto pt-6">
          
          {/* Left Hanging Wire */}
          <div className="absolute top-0 left-12 sm:left-24 w-[2px] h-9 bg-gradient-to-b from-zinc-700 via-zinc-800 to-[#CCFF00]/80 z-20 pointer-events-none flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-400 -top-1 absolute shadow-sm" />
          </div>

          {/* Right Hanging Wire */}
          <div className="absolute top-0 right-12 sm:right-24 w-[2px] h-9 bg-gradient-to-b from-zinc-700 via-zinc-800 to-[#CCFF00]/80 z-20 pointer-events-none flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-400 -top-1 absolute shadow-sm" />
          </div>

          {/* MAIN HANGING CARD CONTAINER */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-gradient-to-b from-[#1c1c24] via-[#14141a] to-[#0e0e12] border-t-2 border-t-[#CCFF00]/80 border-x border-b border-zinc-800/90 rounded-3xl p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_10px_25px_rgba(204,255,0,0.06)] transition-all duration-500 ease-out relative overflow-hidden ${
              isHovered ? '-translate-y-1.5 rotate-[-0.2deg] shadow-[0_30px_70px_-15px_rgba(204,255,0,0.15)] border-zinc-700' : ''
            }`}
          >
            {/* Top Metallic Hanging Grommets */}
            <div className="absolute top-3 left-12 sm:left-24 -translate-x-1/2 flex items-center justify-center z-30">
              <div className="w-5 h-5 rounded-full bg-zinc-950 border-2 border-[#CCFF00] shadow-[0_0_10px_#CCFF00] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping opacity-75" />
              </div>
            </div>
            <div className="absolute top-3 right-12 sm:right-24 translate-x-1/2 flex items-center justify-center z-30">
              <div className="w-5 h-5 rounded-full bg-zinc-950 border-2 border-[#CCFF00] shadow-[0_0_10px_#CCFF00] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping opacity-75" />
              </div>
            </div>

            {/* Inner Glass Highlight & Background Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/60 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#CCFF00]/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header Tag Badge */}
            <div className="flex justify-center sm:justify-start mb-6 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <span>60-SECOND INTERACTIVE QUIZ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] inline-block ml-1 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Content Column */}
              <div className="lg:col-span-8 text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  NOT SURE WHICH PROGRAM IS RIGHT FOR YOU?
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                  Take our quick 60-second assessment. Get instant personalized recommendations matched to your specific fitness goals, schedule, and experience level.
                </p>

                {/* 3 Interactive Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div 
                    onClick={onOpenAssessment}
                    className="p-3.5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/50 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
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
                    className="p-3.5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/50 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
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
                    className="p-3.5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl flex items-center gap-3.5 hover:border-[#CCFF00]/50 hover:bg-zinc-800/90 transition-all group cursor-pointer shadow-md"
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
