import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, TrendingUp, Heart, Zap, ArrowRight, ShieldCheck, CheckCircle2, 
  ChevronLeft, ChevronRight, Sparkles, Trophy
} from 'lucide-react';

interface TransformationSlide {
  id: number;
  image: string;
  title: string;
  clientName: string;
  achievement: string;
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
  onOpenAssessment,
}) => {
  const slides: TransformationSlide[] = [
    {
      id: 1,
      image: '/client-transformation.jpg',
      title: 'SHAHBAN FARIDI — VERIFIED CLIENT TRANSFORMATION',
      clientName: "Shahban's Client",
      achievement: '-18kg Body Fat Loss',
      duration: '16 Weeks Personal Coaching',
      badge: 'FEATURED TRANSFORMATION',
      description: 'Custom 1-on-1 progressive resistance, boxing conditioning & tailored nutrition protocol.'
    },
    {
      id: 2,
      image: '/client-transformation-2.jpg',
      title: '12-WEEK SHREDDED BODY RECOMPOSITION',
      clientName: 'BX Client',
      achievement: '-14kg Weight Loss',
      duration: '12 Weeks Dedicated Coaching',
      badge: 'FAT LOSS & DEFINITION',
      description: 'Targeted strength training paired with structured metabolic conditioning.'
    },
    {
      id: 3,
      image: '/client-transformation-3.jpg',
      title: '16-WEEK ATHLETIC STRENGTH & LEAN MUSCLE GAIN',
      clientName: 'BX Athlete',
      achievement: '+6kg Lean Muscle Gain',
      duration: '16 Weeks Athletic Protocol',
      badge: 'STRENGTH & MUSCLE',
      description: 'Hypertrophy programming combined with joint mobility & active recovery.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-play slideshow every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

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
      handleNext(); // Swiped left -> Next
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // Swiped right -> Prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="w-full bg-[#08080a] text-white py-16 sm:py-24 border-b border-zinc-800/80 relative overflow-hidden font-sans select-none">
      
      {/* Ambient Red & Lime Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF2A2A]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF2A2A]/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">

        {/* SECTION HEADER & SLIDE COUNTER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            BEFORE & AFTER TRANSFORMATIONS
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Browse through real 1-on-1 coaching results delivered by Head Coach Shahban. Use arrows or swipe to explore multiple transformation stories.
          </p>
        </div>

        {/* MAIN TRANSFORMATION DISPLAY SLIDESHOW FRAME */}
        <div 
          className="max-w-5xl mx-auto bg-[#0d0d12] border-2 border-zinc-800 hover:border-[#FF2A2A]/60 rounded-3xl p-3 sm:p-5 shadow-[0_25px_70px_-15px_rgba(255,42,42,0.15)] transition-all duration-500 relative overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* High-Resolution Preloaded Zero-Flicker Transformation Artwork Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-black border border-zinc-800 group/img">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  currentIndex === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  title={slide.title}
                  loading="eager"
                  className="w-full h-full object-contain block brightness-105 contrast-105"
                />
              </div>
            ))}

            {/* Left Chevron Navigation Button */}
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#FF2A2A] border border-zinc-700 hover:border-[#FF2A2A] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 z-30"
              aria-label="Previous Transformation Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Right Chevron Navigation Button */}
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#FF2A2A] border border-zinc-700 hover:border-[#FF2A2A] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 z-30"
              aria-label="Next Transformation Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          {/* Centered Slideshow Navigation Bullets */}
          <div className="flex items-center justify-center pt-4">
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index
                      ? 'w-8 bg-[#FF2A2A] shadow-[0_0_12px_#FF2A2A]'
                      : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to transformation slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>


        {/* CTA ACTION BUTTON & FOOTER DISCLAIMS */}
        <div className="text-center max-w-xl mx-auto space-y-4 pt-4">
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto bg-[#FF2A2A] hover:bg-[#e02020] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,42,42,0.35)] hover:shadow-[0_15px_40px_rgba(255,42,42,0.5)] hover:scale-105 active:scale-[0.98] inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>START YOUR TRANSFORMATION TODAY</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <p className="text-[11px] text-zinc-400 italic">
            Individual results may vary. All coaching protocols are 1-on-1 personalized by Head Coach Shahban.
          </p>
        </div>

      </div>
    </section>
  );
};
