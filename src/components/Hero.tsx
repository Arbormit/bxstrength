import React from 'react';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="main-content" className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] bg-[#0a0a0a] overflow-hidden flex items-center justify-center border-b border-zinc-800">
      {/* <h1> Header for Search Engines & Screen Readers */}
      <h1 className="sr-only">
        BxStrength — #1 UK &amp; USA Digital Coaching, Boxing, Strength &amp; Fitness Platform
      </h1>

      {/* Full-Bleed Box Jump Athlete Visual matching reference photo */}
      <img
        src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=2000"
        alt="BxStrength UK and USA Premier Boxing, Fitness, Strength and Conditioning Platform"
        title="BxStrength — Premier Digital Coaching, Boxing &amp; Fitness"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105"
      />

      {/* Atmospheric Gradient Vignette for seamless header/footer integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
    </section>
  );
};
