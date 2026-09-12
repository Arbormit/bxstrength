import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC<{ onOpenConsultation: () => void; onOpenAssessment: () => void }> = ({
  onOpenConsultation,
  onOpenAssessment,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [showAllFaqs, setShowAllFaqs] = useState<boolean>(false);

  const faqs = [
    {
      question: 'How does virtual personal training work?',
      answer:
        'We start with a detailed assessment of your fitness level, mobility, flexibility, endurance, goals, and previous injuries. Based on your assessment, we create a personalized training program and work specifically on your strengths, weaknesses, and individual needs.',
    },
    {
      question: 'Will my workout program be customized for me?',
      answer:
        'Absolutely. Personalization is our first priority. Every client receives a tailor-made training program based on their fitness level, goals, lifestyle, limitations, and progress.',
    },
    {
      question: 'How do you assess my fitness level and goals?',
      answer:
        'We assess important factors such as your mobility, flexibility, strength, endurance, previous injuries, daily activity level, and fitness goals. This helps us understand your body and create the right training approach for you.',
    },
    {
      question: 'What happens during my first session?',
      answer:
        'Your first session begins with a simple fitness and movement assessment. We also explain how our virtual training system works and understand your goals before starting your personalized program.',
    },
    {
      question: 'Can you correct my exercise technique during online sessions?',
      answer:
        'Yes. Technique correction is an important part of our coaching. We closely observe your movements during the session and provide real-time guidance to improve your form, movement quality, and training safety.',
    },
    {
      question: 'Can I train at home without equipment?',
      answer: 'Yes. You can start with bodyweight exercises and minimal equipment. As you progress, we may recommend basic equipment such as a pair of dumbbells and resistance bands to expand your training options.',
    },
    {
      question: 'Can you combine boxing, strength, conditioning, and mobility?',
      answer: 'Yes. Your program can include a combination of boxing, strength training, conditioning, mobility, and functional training, depending on your goals, fitness level, and individual program.',
    },
    {
      question: 'Do you provide a personalized diet or nutrition plan?',
      answer: 'Yes. We provide personalized nutrition guidance based on your goals, lifestyle, training routine, and individual requirements.',
    },
    {
      question: 'How do you track my progress?',
      answer: 'During your first paid session, we record your key fitness and body parameters. We then monitor your progress regularly and use this information to adjust your training and keep you moving toward your goals.',
    },
    {
      question: 'How long will it take to see results?',
      answer: 'Everyone responds differently to training. We aim to help you achieve meaningful and sustainable results over approximately 6 months, but your progress depends heavily on what you do outside your training sessions — including your nutrition, sleep, stress management, daily activity, and consistency.',
    },
    {
      question: 'Can you help me lose fat while maintaining or building muscle?',
      answer: 'Yes. Our goal is to help you reduce body fat while maintaining as much lean muscle as possible. Your training and nutrition program will be designed around your specific body composition and goals.',
    },
    {
      question: 'Can you modify training around injuries or physical limitations?',
      answer: 'Yes. Our team includes fitness professionals and physiotherapy expertise, allowing us to adapt exercises around appropriate physical limitations and previous injuries. Your program is tailored to your individual needs and training capacity.',
    },
    {
      question: 'How often will my training program be updated?',
      answer: 'Generally, we review and update your program every 4–6 weeks. However, adjustments can also be made earlier when your progress, goals, or training needs change.',
    },
    {
      question: 'How much does virtual coaching cost and what is included?',
      answer: 'We offer multiple coaching options to suit different needs and budgets, starting from $20 per session, with packages and higher levels of coaching available at $40, $60, and $80. The exact package and inclusions depend on the level of support you choose.',
    },
    {
      question: 'Why should I choose you as my online coach?',
      answer: 'We have trained 1,000+ clients and helped people from different backgrounds and fitness levels work toward their goals.',
    }
  ];

  const displayedFaqs = showAllFaqs ? faqs : faqs.slice(0, 4);

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
          {displayedFaqs.map((faq, idx) => {
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
                    <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-black flex items-center justify-center text-[#CCFF00]">
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

        {/* View All FAQs Toggle Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllFaqs(!showAllFaqs)}
            className="bg-zinc-800 hover:bg-zinc-700 text-[#CCFF00] border border-zinc-700 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            <span>{showAllFaqs ? 'SHOW LESS FAQS' : `VIEW ALL FAQS (${faqs.length} QUESTIONS)`}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllFaqs ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};
