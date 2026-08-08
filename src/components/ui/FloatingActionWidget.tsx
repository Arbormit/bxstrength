import React, { useState, useEffect } from 'react';
import { ChevronUp, Mail } from 'lucide-react';

export const FloatingActionWidget: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    const phone = '15550192834'; // Replace with actual business WhatsApp number
    const text = encodeURIComponent('Hello Velocity Fitness Team! I would like to inquire about training programs.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const openEmail = () => {
    window.location.href = 'mailto:support@velocityfitness.com?subject=Inquiry%20from%20Velocity%20Fitness%20Platform';
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto select-none">
      {/* 1. WHATSAPP FLOATING BUTTON WITH OFFICIAL WHATSAPP SVG ICON */}
      <button
        onClick={openWhatsApp}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group border border-emerald-300/40"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.802 0-3.57-.484-5.127-1.401l-.367-.218-3.807.999 1.017-3.712-.239-.38c-1.01-1.606-1.545-3.469-1.545-5.378 0-5.414 4.406-9.82 9.821-9.82 2.624 0 5.09 1.023 6.946 2.879 1.856 1.856 2.878 4.323 2.878 6.947.001 5.415-4.406 9.821-9.821 9.821m0-18.016c-4.52 0-8.201 3.68-8.201 8.196 0 1.62.47 3.197 1.357 4.566l.21.325-.66 2.408 2.463-.646.314.187c1.32.784 2.836 1.198 4.517 1.198 4.52 0 8.202-3.681 8.202-8.197 0-2.19-.852-4.248-2.4-5.795-1.548-1.547-3.606-2.399-5.797-2.399" />
        </svg>
        <span className="absolute right-14 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md border border-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
          WhatsApp Support
        </span>
      </button>

      {/* 2. EMAIL FLOATING BUTTON */}
      <button
        onClick={openEmail}
        aria-label="Send Email Inquiry"
        title="Send Email Inquiry"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#8C532B] hover:bg-[#70401E] text-white shadow-lg shadow-amber-950/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group border border-amber-500/30"
      >
        <Mail className="w-5 h-5" />
        <span className="absolute right-14 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md border border-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
          Email Us
        </span>
      </button>

      {/* 3. GO TO TOP FLOATING BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Scroll to Top"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-black/80 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border border-gray-700 animate-in fade-in zoom-in-75 duration-200 group"
        >
          <ChevronUp className="w-6 h-6 text-[#8C532B] group-hover:animate-bounce" />
          <span className="absolute right-14 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md border border-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
            Back to Top
          </span>
        </button>
      )}
    </div>
  );
};
