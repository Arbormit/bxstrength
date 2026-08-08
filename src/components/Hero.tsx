import React from 'react';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] bg-[#0a0a0a] overflow-hidden flex items-center justify-center border-b border-zinc-800">
      {/* Full-Bleed Box Jump Athlete Visual matching reference photo */}
      <img
        src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=2000"
        alt="High Performance Athlete Box Jump"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105"
      />

      {/* Atmospheric Gradient Vignette for seamless header/footer integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
    </section>
  );
};
