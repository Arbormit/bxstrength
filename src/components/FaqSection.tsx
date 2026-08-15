import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC<{ onOpenConsultation: () => void; onOpenAssessment: () => void }> = ({
  onOpenConsultation,
  onOpenAssessment,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Who are you?',
      answer:
        'BxStrength is the UK’s premier digital performance & strength coaching platform. Founded by UK elite strength coaches, we bridge the gap between scientific sports science and real-world executive lifestyles. We are not a generic gym app — we provide dedicated 1-on-1 human coaching.',
    },
    {
      question: 'Can I trust you?',
      answer:
        'All BxStrength coaches hold higher-degree qualifications in Exercise Science, Strength & Conditioning, or Level 4 CIMSPA accreditation. With over 10+ years of coaching history, 99% client satisfaction, and transparent contract-free coaching, our reputation is built strictly on verified outcomes.',
    },
    {
      question: 'Can you help me?',
      answer:
        'Whether you are a busy executive, plateaued lifter, or someone wanting to shed fat and build structural integrity without spending 2 hours a day in the gym, yes. Every protocol is custom designed for your precise schedule, equipment, and medical background.',
    },
    {
      question: 'What should I do next?',
      answer:
        'Start by taking our free 5-minute Self-Assessment diagnostic or book a 15-minute discovery consultation with a UK Master Coach. There is zero obligation, no upfront payment, and you will leave with actionable clarity on your fitness strategy.',
    },
    {
      question: 'How does remote coaching work compared to in-person?',
      answer:
        'Remote digital coaching provides 24/7 access to your coach, form check reviews, daily nutrition accountability, periodized app programming, and regular video calls — giving you far greater results than a standard 1-hour twice-weekly gym trainer.',
    },
  ];

  return (
    <section className="w-full bg-[#121214] py-20 text-white border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-800 border border-zinc-700 px-3.5 py-1.5 rounded-full inline-block mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CLEAR ANSWERS. NO BS.
          </h2>
          <p className="text-zinc-400 text-sm mt-3">Everything you need to know about starting your coaching journey with BxStrength.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-tight flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-black flex items-center justify-center text-zinc-400">
                      ?
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-in fade-in duration-200">
                    <p className="pl-9">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner inside FAQ */}
        <div className="mt-12 p-8 bg-zinc-900 border border-zinc-800 rounded-xl text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-lg font-black uppercase tracking-tight text-white">Ready to get started?</h4>
            <p className="text-xs text-zinc-400 mt-1">Book your free 15-minute discovery consultation session today.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenAssessment}
              className="w-full sm:w-auto border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-bold text-xs uppercase px-5 py-3 rounded-lg transition-colors cursor-pointer"
            >
              Take Self Assessment
            </button>
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase px-6 py-3 rounded-lg transition-colors shadow-lg cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
