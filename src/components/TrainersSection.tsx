import React, { useState, useEffect } from 'react';
import { Trainer, ViewPage } from '../types';
import { BxTrainer } from '../data/gymData';
import { Star, Calendar, ShieldCheck, Globe, Clock, Award, Trophy, CheckCircle2, X, ExternalLink, Database, RefreshCw } from 'lucide-react';

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
  const [trainers, setTrainers] = useState<BxTrainer[]>([]);
  const [lightboxMedia, setLightboxMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);

  const fetchLiveTrainers = () => {
    fetch('/api/trainers')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setTrainers(data);
        }
      })
      .catch(() => {
        setTrainers([]);
      });
  };

  useEffect(() => {
    fetchLiveTrainers();
    window.addEventListener('bxstrength_trainers_updated', fetchLiveTrainers);
    return () => {
      window.removeEventListener('bxstrength_trainers_updated', fetchLiveTrainers);
    };
  }, []);

  return (
    <section id="trainers-section" className="py-12 sm:py-20 bg-[#0a0a0a] text-white border-b border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#CCFF00] uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block">
            EXPERT PERFORMANCE &amp; COMBAT COACHES
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            MEET OUR COACHES
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Our head coaches combine 10+ years of boxing instruction, strength &amp; conditioning, and physiotherapy-based rehabilitation.
          </p>
        </div>

        {/* Coach Cards List */}
        {trainers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl max-w-md mx-auto space-y-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">No coach data available</h3>
          </div>
        ) : (
          <div className="space-y-16 lg:space-y-24">
          {trainers.map((trainer: BxTrainer) => {
            const headlines: Record<string, string> = {
              'Shaban Faridi': 'HEAD COACH | BOXING INSTRUCTOR | PHYSIOTHERAPY PROFESSIONAL',
              'Sadeem': 'FITNESS TRAINER | STRENGTH & CONDITIONING COACH | VIRTUAL FITNESS COACH',
              'Moheeb Khan': 'FITNESS TRAINER | STRENGTH & CONDITIONING COACH | VIRTUAL FITNESS COACH',
            };
            const headline = trainer.headline || headlines[trainer.name] || headlines[trainer.id] || 'THE ARCHITECT OF PERFORMANCE';

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
                      {trainer.secondaryBio ? (
                        <p>{trainer.secondaryBio}</p>
                      ) : (
                        <p>
                          His methodology bridges the gap between traditional strength training and the chaotic demands of high-performance conditioning. Whether peaking for elite competition or building a foundation for sustainable power, {trainer.name.split(' ')[0]} applies a data-driven, precision-focused approach to every session.
                        </p>
                      )}
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
                        <p className="text-2xl sm:text-3xl font-black text-white">{trainer.clientsServed ? `${trainer.clientsServed}+` : '1000+'}</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                          CLIENTS SERVED GLOBALLY
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Pill Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      onClick={() => setSelectedTrainerForProfile(trainer)}
                      className="w-full sm:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs tracking-widest uppercase px-7 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-[#CCFF00]/10"
                    >
                      <span>VIEW QUALIFICATIONS</span>
                      <span className="text-base font-extrabold">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

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
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                CERTIFICATIONS &amp; QUALIFICATIONS
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

            {/* Coach Physique & Fitness Media Gallery Showcase (Photos & Videos) */}
            {((selectedTrainerForProfile.galleryPhotos && selectedTrainerForProfile.galleryPhotos.length > 0) ||
              (selectedTrainerForProfile.galleryVideos && selectedTrainerForProfile.galleryVideos.length > 0)) && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="flex items-center gap-2 text-[#CCFF00]">
                    <Award className="w-4 h-4 text-[#CCFF00]" />
                    ATHLETE PHYSIQUE & CONDITIONING GALLERY
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Real Physique Showcase</span>
                </h4>

                {/* Photos Grid */}
                {selectedTrainerForProfile.galleryPhotos && selectedTrainerForProfile.galleryPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedTrainerForProfile.galleryPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxMedia({ type: 'photo', url: photo })}
                        className="group relative rounded-xl overflow-hidden aspect-square border border-zinc-800 bg-zinc-900 cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`${selectedTrainerForProfile.name} Physique ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                          <span className="text-[10px] font-black uppercase text-black bg-[#CCFF00] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> CLICK TO EXPAND
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Videos Showcase */}
                {selectedTrainerForProfile.galleryVideos && selectedTrainerForProfile.galleryVideos.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <p className="text-[10px] font-black uppercase text-[#CCFF00] tracking-wider">TRAINING &amp; ATHLETE PERFORMANCE CLIPS:</p>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedTrainerForProfile.galleryVideos.map((vidUrl, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
                          <video
                            controls
                            preload="metadata"
                            playsInline
                            className="w-full max-h-64 object-cover rounded-xl"
                            poster={selectedTrainerForProfile.image}
                          >
                            <source src={vidUrl} type="video/mp4" />
                            Your browser does not support HTML5 video playback.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Full-Screen Coach Gallery Lightbox Preview Overlay */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute -top-12 right-0 text-white bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-full shadow-2xl cursor-pointer"
            >
              <X className="w-6 h-6 text-[#CCFF00]" />
            </button>

            {lightboxMedia.type === 'photo' ? (
              <img
                src={lightboxMedia.url}
                alt="Coach Gallery Preview"
                className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-zinc-700 shadow-2xl"
              />
            ) : (
              <video
                controls
                autoPlay
                className="max-h-[80vh] w-full rounded-2xl border-2 border-zinc-700 shadow-2xl"
              >
                <source src={lightboxMedia.url} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
