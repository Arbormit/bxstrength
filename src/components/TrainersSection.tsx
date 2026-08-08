import React, { useState } from 'react';
import { Trainer, ViewPage } from '../types';
import { TRAINERS_DATA, BxTrainer } from '../data/gymData';
import { Star, Calendar, ShieldCheck, Globe, Clock, Award, Trophy, CheckCircle2, X, ExternalLink } from 'lucide-react';

interface TrainersSectionProps {
  onSelectTrainer: (trainer: Trainer) => void;
  onNavigate: (page: ViewPage) => void;
  onOpenBookingWithTrainer?: (trainerName: string) => void;
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({
  onSelectTrainer,
  onNavigate,
  onOpenBookingWithTrainer
}) => {
  const [selectedTrainerForProfile, setSelectedTrainerForProfile] = useState<BxTrainer | null>(null);

  return (
    <section id="trainers-section" className="py-12 sm:py-20 bg-[#0a0a0a] text-white border-b border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block">
            UK CERTIFIED MASTERS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            MEET OUR COACHES
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every BxStrength coach undergoes strict UK background verification, clinical vetting, and elite performance certification.
          </p>
        </div>

        {/* Coach Cards List - Borderless Design Matching Reference Sample */}
        <div className="space-y-16 lg:space-y-24">
          {TRAINERS_DATA.map((trainer: BxTrainer) => {
            const headlines: Record<string, string> = {
              'david-williams': 'THE ARCHITECT OF PERFORMANCE',
              'sophia-chen': 'CLINICAL METABOLIC MASTER',
              'marcus-vance': 'THE POSTURAL RECONSTRUCTIONIST',
              'alex-mercer': 'TACTICAL ATHLETIC CONDITIONER'
            };
            const headline = headlines[trainer.id] || 'THE ARCHITECT OF PERFORMANCE';

            return (
              <div
                key={trainer.id}
                className="w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-14 bg-transparent border-0 py-4"
              >
                {/* Left Column: Borderless Coach Portrait Image matching sample */}
                <div
                  onClick={() => setSelectedTrainerForProfile(trainer)}
                  className="w-full lg:w-[440px] flex-shrink-0 relative rounded-2xl overflow-hidden aspect-[4/5] sm:h-[500px] lg:h-[520px] bg-zinc-900 shadow-2xl cursor-pointer group"
                >
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-center filter contrast-105 brightness-95 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle bottom vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Bottom Left Overlay Badge & Name matching uploaded sample */}
                  <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                    <span className="inline-block bg-black/75 backdrop-blur-md text-[#CCFF00] border border-zinc-800/80 text-[10px] font-black tracking-widest px-3 py-1 rounded-md uppercase mb-2">
                      {trainer.coachPosition || (trainer.role.toLowerCase().includes('head') ? 'HEAD COACH' : 'SENIOR COACH')}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
                      {trainer.name}
                    </h3>
                  </div>
                </div>

                {/* Right Column: Editorial Bio, Headline, Stats & CTAs */}
                <div className="flex-grow flex flex-col justify-between text-left space-y-6">
                  <div>
                    {/* Headline Title in Lime-Yellow */}
                    <h4 className="text-[#CCFF00] font-serif tracking-widest text-sm sm:text-base font-bold uppercase mb-4">
                      {headline}
                    </h4>

                    {/* Paragraph Bio matching sample formatting */}
                    <div className="text-zinc-300 text-xs sm:text-sm font-normal leading-relaxed space-y-4 max-w-3xl">
                      <p>{trainer.bio}</p>
                      <p>
                        His methodology bridges the gap between traditional strength training and the chaotic demands of high-performance conditioning. Whether peaking for elite competition or building a foundation for sustainable power, {trainer.name.split(' ')[0]} applies a data-driven, precision-focused approach to every session.
                      </p>
                    </div>
                  </div>

                  {/* Two Side-by-Side Stat Cards matching sample */}
                  <div className="grid grid-cols-2 gap-4 max-w-xl">
                    <div className="bg-[#141416] p-5 rounded-2xl border-0 shadow-inner flex flex-col justify-between">
                      <Clock className="w-5 h-5 text-[#CCFF00]" />
                      <div className="mt-3">
                        <p className="text-2xl sm:text-3xl font-black text-white">{trainer.experienceYears}+</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          YEARS EXPERIENCE
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#141416] p-5 rounded-2xl border-0 shadow-inner flex flex-col justify-between">
                      <Trophy className="w-5 h-5 text-[#CCFF00]" />
                      <div className="mt-3">
                        <p className="text-2xl sm:text-3xl font-black text-white">50+</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          PRO FIGHTERS TRAINED
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Two Action Pill Buttons matching sample */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      onClick={() => setSelectedTrainerForProfile(trainer)}
                      className="w-full sm:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs tracking-widest uppercase px-7 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-[#CCFF00]/10"
                    >
                      <span>VIEW QUALIFICATIONS</span>
                      <span className="text-base font-extrabold">→</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenBookingWithTrainer) {
                          onOpenBookingWithTrainer(trainer.name);
                        }
                      }}
                      className="w-full sm:w-auto border border-zinc-700 hover:border-white bg-[#141416] hover:bg-zinc-800 text-white font-black text-xs tracking-widest uppercase px-7 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>BOOK CONSULTATION</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* COACH CREDENTIALS & CERTIFICATES MODAL */}
      {selectedTrainerForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedTrainerForProfile(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Coach Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedTrainerForProfile.image}
                alt={selectedTrainerForProfile.name}
                className="w-20 h-20 rounded-xl object-cover object-top border-2 border-emerald-500 shadow-xl"
              />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {selectedTrainerForProfile.name}
                </h3>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                  {selectedTrainerForProfile.role}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                  <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-bold">{selectedTrainerForProfile.experienceYears} Yrs Experience</span>
                  <span className="flex items-center gap-1 bg-amber-950/60 border border-amber-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {selectedTrainerForProfile.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Certifications List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                VERIFIED UK CERTIFICATIONS
              </h4>
              <div className="space-y-2">
                {(selectedTrainerForProfile.certifications || [selectedTrainerForProfile.certification]).map((cert, idx) => (
                  <div key={idx} className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-zinc-200">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Achievements List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                KEY ACHIEVEMENTS & MILESTONES
              </h4>
              <div className="space-y-2">
                {(selectedTrainerForProfile.achievements || ['Over 98% Client Goal Success Rate', 'Verified UK Master Coach']).map((ach, idx) => (
                  <div key={idx} className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-zinc-300">{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                const name = selectedTrainerForProfile.name;
                setSelectedTrainerForProfile(null);
                if (onOpenBookingWithTrainer) {
                  onOpenBookingWithTrainer(name);
                }
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK 1-ON-1 SESSION WITH {selectedTrainerForProfile.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
