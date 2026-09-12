import React from 'react';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="main-content" className="relative w-full h-[65vh] sm:h-[80vh] md:h-[85vh] min-h-[420px] sm:min-h-[500px] max-h-[900px] bg-[#0a0a0a] overflow-hidden flex items-end justify-start border-b border-zinc-800 font-sans pb-8 sm:pb-14">
      {/* <h1> Header for Search Engines & Screen Readers */}
      <h1 className="sr-only">
        BxStrength — #1 UK &amp; USA Digital Coaching, Boxing, Strength &amp; Fitness Platform
      </h1>

      {/* Full-Bleed Box Jump Athlete Visual precisely framed for mobile & desktop */}
      <img
        src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=2000"
        alt="BxStrength UK and USA Premier Boxing, Fitness, Strength and Conditioning Platform"
        title="BxStrength — Premier Digital Coaching, Boxing &amp; Fitness"
        className="absolute inset-0 w-full h-full object-cover object-[50%_25%] sm:object-center filter brightness-[0.90] sm:brightness-[0.85] contrast-105 transition-all duration-500"
      />

      {/* Atmospheric Gradient Vignette for seamless header/footer integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/50 sm:to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 sm:from-black/70 via-black/20 sm:via-transparent to-transparent pointer-events-none" />
    </section>
  );
};
