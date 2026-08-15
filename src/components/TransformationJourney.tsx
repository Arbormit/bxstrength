import React from 'react';
import { ClipboardList, CalendarCheck, UserCheck, Dumbbell, Trophy, ArrowRight, ChevronDown } from 'lucide-react';

interface TransformationJourneyProps {
  onOpenAssessment: () => void;
  onOpenConsultation: () => void;
}

export const TransformationJourney: React.FC<TransformationJourneyProps> = ({
  onOpenAssessment,
  onOpenConsultation,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Digital Assessment',
      desc: 'Complete our 5-minute qualified lifestyle & health diagnostic.',
      icon: ClipboardList,
      ctaText: 'Take Assessment',
      action: onOpenAssessment,
    },
    {
      num: '02',
      title: 'Discovery Session',
      desc: '15-minute 1-on-1 strategy call with our senior strength lead.',
      icon: CalendarCheck,
      ctaText: 'Book Consultation',
      action: onOpenConsultation,
    },
    {
      num: '03',
      title: 'Coach Match',
      desc: 'Hand-picked UK specialist assigned specifically to your goals.',
      icon: UserCheck,
    },
    {
      num: '04',
      title: 'Bespoke Protocol',
      desc: 'Periodized lifting program & macro nutrition built for your schedule.',
      icon: Dumbbell,
    },
    {
      num: '05',
      title: 'Transformation',
      desc: 'Weekly bio-metric tracking, continuous reviews, & sustainable results.',
      icon: Trophy,
    },
  ];

  return (
    <section className="w-full bg-[#0a0a0a] py-20 text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3">
            SCIENTIFIC METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            YOUR TRANSFORMATION JOURNEY
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 font-normal">
            No guess work. Every step of your progression is structured, monitored, and optimized for maximum efficiency.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-zinc-600 group-hover:text-white transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-white">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold uppercase tracking-tight text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {step.action && (
                  <div className="pt-6 mt-4 border-t border-zinc-800/80">
                    <button
                      onClick={step.action}
                      className="w-full text-left text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-300 flex items-center justify-between group/btn cursor-pointer"
                    >
                      <span>{step.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
