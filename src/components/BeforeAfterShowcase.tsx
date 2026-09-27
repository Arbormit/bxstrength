import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Trophy, ArrowRight, ShieldCheck, CheckCircle2, 
  ChevronLeft, ChevronRight, User, Activity, Maximize2, X 
} from 'lucide-react';

interface TransformationSlide {
  id: number;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  clientName: string;
  startingWeight: string;
  currentWeight: string;
  weightChange: string;
  exerciseName: string;
  duration: string;
  badge: string;
  description: string;
}

interface BeforeAfterShowcaseProps {
  onOpenConsultation: () => void;
  onOpenAssessment: () => void;
}

export const BeforeAfterShowcase: React.FC<BeforeAfterShowcaseProps> = ({
  onOpenConsultation,
}) => {
  const slides: TransformationSlide[] = [
    {
      id: 1,
      image: '/client-transformation.jpg',
      clientName: 'David Vance',
      startingWeight: '86 kg',
      currentWeight: '68 kg',
      weightChange: '-18 kg Fat Loss',
      exerciseName: 'Boxing Power, Footwork & Compound Lifting',
      duration: '16 Weeks 1-on-1 Personal Coaching',
      badge: 'FEATURED TRANSFORMATION',
      description: 'Achieved 18kg body fat loss while increasing bench press & metabolic endurance under Head Coach Shaban Faridi.'
    },
    {
      id: 2,
      image: '/client-transformation-2.jpg',
      clientName: 'Marcus Miller',
      startingWeight: '92 kg',
      currentWeight: '78 kg',
      weightChange: '-14 kg Fat Loss',
      exerciseName: 'High-Yield Metabolic Blast & Core Stability',
      duration: '12 Weeks Dedicated Coaching',
      badge: 'FAT LOSS & RECOMPOSITION',
      description: 'Dramatic body recomposition with high-yield EPOC interval training and tailored macro nutrition protocol.'
    },
    {
      id: 3,
      image: '/client-transformation-3.jpg',
      clientName: 'Alex Turner',
      startingWeight: '72 kg',
      currentWeight: '78 kg',
      weightChange: '+6 kg Muscle Gain',
      exerciseName: 'Progressive Resistance & Heavy Bag Power',
      duration: '16 Weeks Athletic Protocol',
      badge: 'STRENGTH & HYPERTROPHY',
      description: 'Added 6kg of pure lean athletic muscle while improving joint mobility and posture alignment.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play slideshow every 6 seconds
  useEffect(() => {
    if (isPaused || zoomImage) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, zoomImage]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="w-full bg-[#08080a] text-white py-12 sm:py-20 border-b border-zinc-800/80 relative overflow-hidden font-sans select-none">
      
      {/* Ambient Red & Neon Glow Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-[#CCFF00]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">

        {/* SECTION HEADING */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white break-words">
            Real Client Transformations
          </h2>
        </div>

        {/* STUNNING SPLIT TRANSFORMATION SHOWCASE CARD */}
        <div 
          className="max-w-7xl mx-auto bg-[#0d0d12] rounded-3xl p-4 sm:p-7 shadow-2xl transition-all duration-500 relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT SIDE: DUAL BEFORE ---> AFTER IMAGES (BIGGER & PROPER DISPLAY) */}
            <div className="lg:col-span-7 relative w-full rounded-2xl bg-black/80 border border-zinc-800/80 p-3 sm:p-4 shadow-2xl overflow-hidden group">
              
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`transition-opacity duration-700 ease-in-out ${
                    currentIndex === idx ? 'opacity-100 relative z-10 block pointer-events-auto' : 'opacity-0 absolute inset-0 z-0 hidden pointer-events-none'
                  }`}
                >
                  {/* TWO IMAGES SIDE-BY-SIDE: BEFORE ---> AFTER */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 relative items-center">
                    
                    {/* BEFORE IMAGE CONTAINER */}
                    <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[420px] rounded-xl overflow-hidden bg-zinc-950 border border-red-500/40 group/before shadow-lg">
                      {/* BEFORE Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-red-500/40 text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>BEFORE</span>
                        <span className="text-zinc-400 font-mono font-normal ml-0.5">({slide.startingWeight})</span>
                      </div>

                      {/* Image Frame */}
                      <div className="w-full h-full overflow-hidden relative">
                        <img 
                          src={slide.beforeImage || slide.image} 
                          alt={`${slide.clientName} Before`} 
                          title={`${slide.clientName} Before`}
                          loading="eager"
                          className={`w-full h-full block brightness-105 contrast-105 transition-transform duration-500 group-hover/before:scale-105 ${
                            slide.beforeImage ? 'object-cover' : 'w-[200%] max-w-none object-cover object-left'
                          }`}
                        />
                      </div>
                    </div>

                    {/* CENTER ARROW BADGE: BEFORE ---> AFTER */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/95 border-2 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.5)] flex items-center justify-center font-black">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#CCFF00]" />
                      </div>
                    </div>

                    {/* AFTER IMAGE CONTAINER */}
                    <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[420px] rounded-xl overflow-hidden bg-zinc-950 border border-[#CCFF00]/50 group/after shadow-lg">
                      {/* AFTER Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#CCFF00]/50 text-[#CCFF00] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>AFTER</span>
                        <span className="text-emerald-300 font-mono font-normal ml-0.5">({slide.currentWeight})</span>
                      </div>

                      {/* Image Frame */}
                      <div className="w-full h-full overflow-hidden relative">
                        <img 
                          src={slide.afterImage || slide.image} 
                          alt={`${slide.clientName} After`} 
                          title={`${slide.clientName} After`}
                          loading="eager"
                          className={`w-full h-full block brightness-105 contrast-105 transition-transform duration-500 group-hover/after:scale-105 ${
                            slide.afterImage ? 'object-cover' : 'w-[200%] max-w-none object-cover object-right'
                          }`}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Zoom Photo Button Overlay */}
              <button
                type="button"
                onClick={() => setZoomImage(currentSlide.image)}
                className="absolute top-4 right-4 z-30 p-2 bg-black/80 hover:bg-black text-white rounded-lg backdrop-blur-md border border-zinc-700 transition-colors cursor-pointer shadow-lg"
                title="Click to view full transformation image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Left Chevron Navigation Button */}
              <button
                onClick={handlePrev}
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#CCFF00] hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 z-30"
                aria-label="Previous Transformation"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Right Chevron Navigation Button */}
              <button
                onClick={handleNext}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-[#CCFF00] hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 z-30"
                aria-label="Next Transformation"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* RIGHT SIDE: BASIC DETAILS & TRANSFORMATION CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 text-left p-1 sm:p-2">
              
              {/* Badge & Name */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-wider mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentSlide.badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{currentSlide.clientName}</span>
                </h3>
              </div>

              {/* Basic Details Grid */}
              <div className="space-y-3 bg-[#121216] border border-zinc-800/90 rounded-2xl p-4 shadow-inner">
                
                {/* Weight Loss / Result */}
                <div className="flex items-start justify-between border-b border-zinc-800/80 pb-3 gap-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Weight Result</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white font-mono">
                      {currentSlide.startingWeight} <span className="text-zinc-500 font-sans">➔</span> {currentSlide.currentWeight}
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {currentSlide.weightChange}
                    </span>
                  </div>
                </div>

                {/* Exercise Name & Protocol */}
                <div className="border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Dumbbell className="w-4 h-4 text-[#CCFF00] shrink-0" />
                    <span>Exercise & Program</span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                    {currentSlide.exerciseName}
                  </p>
                </div>

                {/* Duration */}
                <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Coaching Duration</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-200 font-mono">
                    {currentSlide.duration}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
                    "{currentSlide.description}"
                  </p>
                </div>

              </div>

              {/* Start Your Transformation Button */}
              <button
                onClick={onOpenConsultation}
                className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>START YOUR TRANSFORMATION TODAY</span>
                <ArrowRight className="w-4 h-4 text-black shrink-0" />
              </button>

              {/* Navigation Indicators */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-zinc-400 font-bold">
                  TRANSFORMATION {currentIndex + 1} OF {slides.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === index
                          ? 'w-6 bg-[#CCFF00]'
                          : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] bg-[#121214] border border-zinc-800 p-3 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Transformation Zoom Preview"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
