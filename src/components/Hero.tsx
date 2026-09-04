import React from 'react';
import { Phone } from 'lucide-react';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const phoneNumber = "+918423594482";
  const whatsappNumber = "918423594482";
  const whatsappMessage = encodeURIComponent("Hi BxStrength! I would like to inquire about 1-on-1 Virtual Fitness & Boxing Coaching.");

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

      {/* Compact Left-Aligned CTA Buttons Only */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3">
        
        {/* 1. Compact Call CTA Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-wider uppercase px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-xl cursor-pointer"
          id="btn-hero-call-now"
        >
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
            <Phone className="w-2.5 h-2.5 fill-white text-white" />
          </div>
          <span>CALL US NOW</span>
        </a>

        {/* 2. Compact WhatsApp CTA Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs tracking-wider uppercase px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#25D366]/20 cursor-pointer"
          id="btn-hero-whatsapp"
        >
          <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <span>WHATSAPP CHAT</span>
        </a>

      </div>
    </section>
  );
};
