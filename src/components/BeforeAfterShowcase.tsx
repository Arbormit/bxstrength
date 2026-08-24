import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Award, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface BeforeAfterShowcaseProps {
  onOpenConsultation: () => void;
  onOpenAssessment: () => void;
}

export interface TransformationItem {
  id: string;
  name: string;
  age: number;
  location: string;
  coach: string;
  coachTitle: string;
  duration: string;
  beforeWeight: string;
  afterWeight: string;
  weightLoss: string;
  beforeImg: string;
  afterImg: string;
  beforeBadges: string[];
  afterBadges: string[];
  quote: string;
  focusArea: string;
}

export const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'marcus-130-80',
    name: 'Marcus Vance',
    age: 34,
    location: 'London, UK',
    coach: 'Shaban Faridi',
    coachTitle: 'Head Coach & Physiotherapy Lead',
    duration: '10 Months (8–12 Mo Protocol)',
    beforeWeight: '130 KG',
    afterWeight: '80 KG FIT',
    weightLoss: '-50 KG FAT LOSS',
    beforeImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    beforeBadges: ['130 kg Body Weight', 'Severe Knee Pain', 'High Visceral Fat', 'Poor Energy'],
    afterBadges: ['80 kg Fit Weight', 'Zero Joint Pain', 'Lean Muscle Build', 'Peak Energy'],
    quote: "I went from 130kg with constant joint pain to 80kg of lean muscle under Head Coach Shaban's direct physiotherapy & boxing supervision.",
    focusArea: 'Executive Recomposition & Joint Rehab'
  },
  {
    id: 'elena-pcos-cycle',
    name: 'Elena Rostova',
    age: 29,
    location: 'Manchester, UK',
    coach: 'Sadeem',
    coachTitle: 'Senior Strength & Virtual Performance Coach',
    duration: '8 Months Protocol',
    beforeWeight: '92 KG',
    afterWeight: '64 KG FIT',
    weightLoss: '-28 KG FAT LOSS',
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
    beforeBadges: ['92 kg Weight', 'PCOS Symptoms', 'Irregular Cycles', 'Water Retention'],
    afterBadges: ['64 kg Fit Weight', '28-Day Cycle Synced', 'Hormonal Balance', 'High Vitality'],
    quote: "My period cycle normalized for the first time in 5 years while losing 28kg with Sadeem's virtual conditioning coaching.",
    focusArea: 'PCOS & Female Cycle Syncing'
  },
  {
    id: 'james-back-rehab',
    name: 'James Sterling',
    age: 41,
    location: 'Birmingham, UK',
    coach: 'Moheeb Khan',
    coachTitle: 'Tactical Conditioning & Functional Lead',
    duration: '9 Months Protocol',
    beforeWeight: '115 KG',
    afterWeight: '82 KG FIT',
    weightLoss: '-33 KG FAT LOSS',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    beforeBadges: ['115 kg Weight', 'L4-L5 Herniation', 'Chronic Back Pain', 'Low Mobility'],
    afterBadges: ['82 kg Fit Weight', 'Pain-Free Spine', 'Strong Core Bracing', 'Full Agility'],
    quote: "Moheeb eliminated my L4-L5 disc pain completely while rebuilding my core and helping me drop 33kg of fat safely.",
    focusArea: 'L4-L5 Spinal Decompression & Tactical Rehab'
  }
];

export const BeforeAfterShowcase: React.FC<BeforeAfterShowcaseProps> = ({
  onOpenConsultation,
  onOpenAssessment,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const activeItem = TRANSFORMATIONS[currentIndex] || TRANSFORMATIONS[0];

  // Auto-advancing slideshow timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TRANSFORMATIONS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRANSFORMATIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TRANSFORMATIONS.length) % TRANSFORMATIONS.length);
  };

  // Touch Swipe Gesture Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext(); // Swiped left -> Next slide
    } else if (distance < -50) {
      handlePrev(); // Swiped right -> Prev slide
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      className="w-full bg-[#0a0a0c] py-12 sm:py-16 text-white border-b border-zinc-800 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-emerald-500/10 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            BEFORE & AFTER <span className="text-emerald-400">RESULTS</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 sm:mt-3 font-medium px-2">
            Visual proof of clients who achieved sustained weight loss and athletic health under BxStrength Expert Coaches.
          </p>
        </div>

        {/* Sliding Carousel Card Container */}
        <div className="relative bg-[#121216] border border-zinc-800/90 rounded-2xl p-4 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8">
          
          {/* Top Carousel Controller & Slide Indicators Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            
            {/* Active Case Info */}
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-black text-xs sm:text-sm flex items-center justify-center border border-emerald-800">
                0{currentIndex + 1}
              </span>
              <div>
                <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight leading-none">
                  {activeItem.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-zinc-400 font-medium">
                  {activeItem.focusArea}
                </span>
              </div>
            </div>

            {/* Carousel Navigation Buttons & Dots */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {TRANSFORMATIONS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                    }`}
                    title={`Go to ${item.name}'s transformation`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrow Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 sm:p-2.5 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

            </div>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
            <div>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">RESULT</span>
              <span className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">{activeItem.weightLoss}</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">START WEIGHT</span>
              <span className="text-xl sm:text-3xl font-black text-red-400 font-mono">{activeItem.beforeWeight}</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">FIT WEIGHT</span>
              <span className="text-xl sm:text-3xl font-black text-emerald-300 font-mono">{activeItem.afterWeight}</span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">DURATION</span>
              <span className="text-lg sm:text-2xl font-black text-white font-mono mt-0.5 block">{activeItem.duration.split(' ')[0]} {activeItem.duration.split(' ')[1]}</span>
            </div>
          </div>

          {/* Side-by-Side Visual Photo Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            
            {/* BEFORE PHOTO CARD */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-red-950/80 shadow-2xl group min-h-[320px] sm:min-h-[420px] flex flex-col justify-between">
              <img
                src={activeItem.beforeImg}
                alt={`${activeItem.name} Before`}
                className="absolute inset-0 w-full h-full object-cover filter contrast-105 brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />
              
              {/* Top Tag */}
              <div className="relative z-10 p-4 sm:p-5 flex justify-between items-center">
                <span className="px-3 py-1 rounded-lg bg-red-950/90 border border-red-800 text-red-300 text-[10px] sm:text-xs font-black tracking-widest uppercase backdrop-blur-md flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  BEFORE • {activeItem.beforeWeight}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-800">
                  Initial State
                </span>
              </div>

              {/* Bottom Visual Badges */}
              <div className="relative z-10 p-4 sm:p-5 space-y-2">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeItem.beforeBadges.map((badge, idx) => (
                    <span key={idx} className="bg-red-950/80 border border-red-900/60 text-red-200 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded">
                      ✕ {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AFTER PHOTO CARD */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-emerald-950/80 shadow-2xl group min-h-[320px] sm:min-h-[420px] flex flex-col justify-between">
              <img
                src={activeItem.afterImg}
                alt={`${activeItem.name} After`}
                className="absolute inset-0 w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />
              
              {/* Top Tag */}
              <div className="relative z-10 p-4 sm:p-5 flex justify-between items-center">
                <span className="px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-[10px] sm:text-xs font-black tracking-widest uppercase backdrop-blur-md flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  AFTER • {activeItem.afterWeight}
                </span>
                <span className="text-[10px] sm:text-[11px] font-black text-black bg-emerald-400 px-2.5 py-1 rounded uppercase">
                  {activeItem.weightLoss}
                </span>
              </div>

              {/* Bottom Visual Badges */}
              <div className="relative z-10 p-4 sm:p-5 space-y-2">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeItem.afterBadges.map((badge, idx) => (
                    <span key={idx} className="bg-emerald-950/90 border border-emerald-800/80 text-emerald-200 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded">
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Quote & Coach Info Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-white italic font-medium text-xs sm:text-sm">"{activeItem.quote}"</p>
                <p className="text-zinc-400 text-[10px] sm:text-[11px] mt-0.5">
                  <strong className="text-emerald-400">{activeItem.name}</strong> ({activeItem.location}) • Supervised by <strong>{activeItem.coach}</strong> ({activeItem.coachTitle})
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
              <button
                onClick={onOpenConsultation}
                className="flex-1 md:flex-none bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black tracking-widest py-3 px-5 sm:px-6 rounded-lg uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>START TRANSFORMATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenAssessment}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-3 px-4 rounded-lg uppercase transition-all cursor-pointer whitespace-nowrap hidden sm:block"
              >
                ASSESSMENT
              </button>
            </div>
          </div>

          {/* Mobile Bottom Slide Dots */}
          <div className="flex sm:hidden justify-center items-center gap-2 pt-2">
            {TRANSFORMATIONS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
