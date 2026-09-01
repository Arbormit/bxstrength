import React, { useState } from 'react';
import { 
  Dumbbell, Flame, HeartPulse, Activity, Zap, CheckCircle2, AlertCircle, 
  Target, ShieldCheck, RefreshCw, Home, Video, Trophy, Users, Award, Heart, ChevronDown, ChevronRight, Tag, Clock, Gift, Calendar, Sparkles, Check
} from 'lucide-react';

export interface ServiceItem {
  title: string;
  category: string;
  servicePlan: string;            // Service/plan
  duration: string;               // duration
  price: number | string;         // price
  sessionType: string;            // session type
  goalPrimaryOutcome: string;     // goal/primary outcome
  whatYouGet: string | string[];  // what you get
  keyDifference: string;          // key difference
  totalSessions: number | string; // total session
  discount: string | number;      // discount
  validity: string;               // validity
  complimentary: string;          // complimentary
  // UI Icon & Compatibility
  icon?: React.ElementType;
  discountTag?: string;
  originalPrice?: number;
  discountedPrice?: number;
  priceUnit?: string;
  problem?: string;
  solution?: string;
  result?: string;
}

interface ServicesSectionProps {
  onOpenBooking: () => void;
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking, onSelectService }) => {
  const [showAllServices, setShowAllServices] = useState<boolean>(false);
  const [expandedComplimentary, setExpandedComplimentary] = useState<Record<number, boolean>>({});

  const services: ServiceItem[] = [
    {
      title: 'Fitness Boxing',
      category: 'Individual Service',
      servicePlan: 'Fitness Boxing',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Personal Session',
      goalPrimaryOutcome: 'Technical Boxing, Conditioning, footwork, power and endurance.',
      whatYouGet: 'Live 1:1 coaching focused on boxing technique, conditioning, footwork, power and endurance.',
      keyDifference: 'Single specialist service; no multi-focus package structure.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
    },
    {
      title: 'Strength Training',
      category: 'Individual Service',
      servicePlan: 'Strength Training',
      duration: '20Min / session',
      price: 25,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Build strength, muscle, endurance and overall fitness.',
      whatYouGet: 'Live 1:1 strength focused coaching adapted to the clients goal and ability',
      keyDifference: 'Single specialist strength service.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
    },
    {
      title: 'Mobility & Recovery',
      category: 'Individual Service',
      servicePlan: 'Mobility & Recovery',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Improve joint mobility, reduce stiffness, enhance flexibility, and accelerate muscle recovery.',
      whatYouGet: 'Targeted mobility drills, dynamic stretching, PNF techniques, and personalized recovery protocols.',
      keyDifference: 'Focus on movement quality and recovery, not just strength or cardio.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
    },
    {
      title: 'Flexibility Training',
      category: 'Individual Service',
      servicePlan: 'Flexibility Training',
      duration: '20Min / session',
      price: 25,
      sessionType: '1-on-1 Clinical Rehab',
      goalPrimaryOutcome: 'Increase flexibility, reduce stiffness and enhance recovery.',
      whatYouGet: 'Live 1:1 flexibility focused coaching adapted to the clients goal and ability',
      keyDifference: 'Single specialist flexibility service.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
    },
    {
      title: 'Mindset & Wellness',
      category: 'Individual Service',
      servicePlan: 'Mindset & Wellness',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Mindset coaching, stress relief and mental wellness support.',
      whatYouGet: 'Live 1:1 coaching focused on mindset and mental wellness, stress relief and mental wellness support.',
      keyDifference: 'Single specialist mindset and mental wellness service.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
     },
    {
      title: 'Custom Basic',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '15Min / session',
      price: 30,
      sessionType: 'fully personalised',
      goalPrimaryOutcome: 'One tailored focus designed around the clients goal.',
      whatYouGet: 'Goal based personalised coaching, technique/intensity control and tailored session structure.',
      keyDifference: '10Euro above BX Basic care for additional personalisation.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / Booking',
      complimentary: 'warm-up + cool-down included within booked time.',
      },
    {
      title: 'Custom Focus',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '30Min / session',
      price: 45,
      sessionType: 'Fully personalised',
      goalPrimaryOutcome: 'One tailored focus designed around the clients goal.',
      whatYouGet: 'Tailored programme, extra attention to detail, individual goal mapping and supporting work.',
      keyDifference: '10 Euro above BX Basic care for additional personalisation.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / Booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      },
    {
      title: 'Custom Performance',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '45Min / session',
      price: 65,
      sessionType: 'Fully personalised',
      goalPrimaryOutcome: 'Any two focus areas, custom-built around the client.',
      whatYouGet: 'Fully personlisation, advanced programming, technique refinement, mobility/cool-down and session tracking.',
      keyDifference: '10 Euro above BX Performance for additional personalisation.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / Booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      },
    {
      title: 'Custom Complete',
      category: 'Custom',
      servicePlan: 'Custom Complete',
      duration: '60Min / session',
      price: 85,
      sessionType: 'Fully personalised',
      goalPrimaryOutcome: 'Upto 4 focus areas combined into one bespoke session plan.',
      whatYouGet: '100% tailored programming, advanced exercise selection and technique correction across all focus areas.',
      keyDifference: '10 Euro above BX Complete for additional personalisation.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / Booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX Basic Care',
      category: 'Core Package',
      servicePlan: 'BX Basic Care',
      duration: '15Min / session',
      price: 20,
      sessionType: 'Standard Package / best value',
      goalPrimaryOutcome: 'One primary focus with an accessible coaching experience.',
      whatYouGet: 'Basic warm-up, focused coaching, technique and guidance and cool-down',
      keyDifference: 'Entry level standard package, lower price than custom basic.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'single session / booking',
      complimentary: 'warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX Focus',
      category: 'Core Package',
      servicePlan: 'BX Focus',
      duration: '30Min / session',
      price: 35,
      sessionType: 'Standard Package / best value',
      goalPrimaryOutcome: 'One main focus plus supporting work.',
      whatYouGet: 'Personalised warm-up, goal-based training, supporting exercises and cool-down.',
      keyDifference: 'Standard package offering better value than individual services.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX Performance',
      category: 'Core Package',
      servicePlan: 'BX Performance',
      duration: '45Min / session',
      price: 55,
      sessionType: 'Standard Package / best value',
      goalPrimaryOutcome: 'Any two focus area in a structured performance session.',
      whatYouGet: 'Structured session, progressive training, technique corrections, mobility/cool-down and session notes.',
      keyDifference: 'Standard package offering better value than individual services.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / booking',
      complimentary: 'warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX Complete',
      category: 'Core Package',
      servicePlan: 'BX Complete',
      duration: '60Min / session',
      price: 75,
      sessionType: 'Standard Package / best value',
      goalPrimaryOutcome: 'upto 4 focus areas for comprehensive coaching.',
      whatYouGet: 'Full-body training, personalised intensity, strength and conditioning, mobility and progress tracking.',
      keyDifference: 'Flagship standard package, strongest overall package value.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session / Booking',
      complimentary: 'warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX weekly 3',
      category: 'Programme',
      servicePlan: 'BX Weekly 3',
      duration: 'Varies by selected sessions',
      price: 30,
      sessionType: '3 session weekly programme',
      goalPrimaryOutcome: 'build weekly consistency and maintain momentum.',
      whatYouGet: 'choose any 3 sessions from boxing, strength, functional, mobility, flexibility or mindset and wellness.',
      keyDifference: 'Programme level discount and structured weekly consistency.',
      totalSessions: '3 Session',
      discount: '10% OFF',
      validity: '7 Days',
      complimentary: 'warm-up + cool-down included within booked time.',
      },
    {
      title: 'BX Monthly 12',
      category: 'Programme',
      servicePlan: 'BX Monthly 12',
      duration: 'Varies by selected sessions',
      price: 50,
      sessionType: '12 session monthly programme',
      goalPrimaryOutcome: 'Longer term consistency, progression and sustainable coaching support.',
      whatYouGet: '12 sessions built with the coach around client goals, example mixes can combine boxing, strength, functional and mobility.',
      keyDifference: 'Higher volume programme with 20% discount and 30 day validity.',
      totalSessions: '12 Session Monthly',
      discount: '20% OFF',
      validity: '30 Days (1 day off per week)',
      complimentary: 'warm-up + cool-down included within booked time.',
      }
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 6);

  return (
    <section id="services-section" className="w-full bg-[#0a0a0a] text-white py-20 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            OUR SERVICES
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            15 specialized strength, boxing, conditioning, mobility, and nutritional protocols with promotional session rates.
          </p>
        </div>

        {/* Services Grid (Shows 6 cards initially, 15 on expansion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedServices.map((srv, idx) => {
            const IconComp = srv.icon || Dumbbell;
            const displayDiscount = srv.discount || srv.discountTag;

            return (
              <div
                key={idx}
                className="relative bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl overflow-hidden"
              >
                {/* Visual Top-Left Diagonal Cross Discount Ribbon */}
                {displayDiscount && (
                  <div className="absolute top-3 -left-9 w-32 bg-[#CCFF00] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center py-1 -rotate-45 shadow-xl border-y border-black/80 z-10 pointer-events-none select-none">
                    {displayDiscount}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {srv.servicePlan && (
                        <span className="text-[9px] font-extrabold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                          {srv.servicePlan}
                        </span>
                      )}
                      <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-800/80 border border-zinc-700 px-2.5 py-1 rounded-md">
                        {srv.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mb-4 leading-snug">
                    {srv.title}
                  </h3>

                  {/* Pricing & Duration Banner */}
                  <div className="mb-6 p-3 bg-[#18181b] border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                        PRICE / SESSION
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-lg font-black text-[#CCFF00]">${srv.price}</span>
                        {srv.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through font-bold">${srv.originalPrice}</span>
                        )}
                        <span className="text-[10px] font-bold text-zinc-400">{srv.duration}</span>
                      </div>
                    </div>
                    {srv.sessionType && (
                      <span className="text-[10px] font-extrabold text-zinc-300 uppercase bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">
                        {srv.sessionType}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Goal / Primary Outcome */}
                    {srv.goalPrimaryOutcome && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-emerald-400 mb-1">
                          <Target className="w-3.5 h-3.5 text-emerald-400" />
                          <span>GOAL / PRIMARY OUTCOME</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200">{srv.goalPrimaryOutcome}</p>
                      </div>
                    )}

                    {/* What You Get */}
                    {srv.whatYouGet && (
                      <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-zinc-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#CCFF00] mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                          <span>WHAT YOU GET</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200">
                          {Array.isArray(srv.whatYouGet) ? srv.whatYouGet.join(', ') : srv.whatYouGet}
                        </p>
                      </div>
                    )}

                    {/* Key Difference */}
                    {srv.keyDifference && (
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30 text-purple-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-purple-400 mb-1">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>KEY DIFFERENCE</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200">{srv.keyDifference}</p>
                      </div>
                    )}

                    {/* Specifications Row: Total Sessions, Validity, Complimentary */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-[11px] text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>Total Sessions:</span>
                        </span>
                        <span className="font-bold text-white">{srv.totalSessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>Validity:</span>
                        </span>
                        <span className="font-bold text-white">{srv.validity}</span>
                      </div>
                      {srv.complimentary && (() => {
                        const isExpanded = !!expandedComplimentary[idx];
                        const text = srv.complimentary;
                        const isLong = text.length > 32;
                        const shortText = isLong ? text.slice(0, 30) : text;

                        return (
                          <div className="pt-2 border-t border-zinc-800/60 text-[11px]">
                            <div className="flex items-start justify-between gap-3">
                              <span className="flex items-center gap-1.5 text-zinc-400 font-medium shrink-0 mt-0.5">
                                <Gift className="w-3.5 h-3.5 text-[#CCFF00]" />
                                <span>Complimentary:</span>
                              </span>

                              {!isLong ? (
                                <span className="font-semibold text-white text-right leading-snug">
                                  {text}
                                </span>
                              ) : (
                                <div className="text-right flex-1">
                                  {!isExpanded ? (
                                    <span className="font-semibold text-zinc-200 leading-snug">
                                      {shortText}...{' '}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedComplimentary(prev => ({ ...prev, [idx]: true }));
                                        }}
                                        className="text-[#CCFF00] hover:text-[#b8e600] font-bold text-[10px] tracking-wide underline ml-1 cursor-pointer inline-block"
                                      >
                                        read more...
                                      </button>
                                    </span>
                                  ) : (
                                    <div className="text-left sm:text-right space-y-1">
                                      <p className="font-semibold text-white leading-relaxed text-xs">
                                        {text}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedComplimentary(prev => ({ ...prev, [idx]: false }));
                                        }}
                                        className="text-zinc-400 hover:text-[#CCFF00] font-bold text-[10px] tracking-wide underline cursor-pointer inline-block"
                                      >
                                        read less
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800">
                  <button
                    onClick={() => onSelectService ? onSelectService(srv) : onOpenBooking()}
                    className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99]"
                  >
                    <span>SELECT SERVICE</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Toggle Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="bg-zinc-900 hover:bg-zinc-800 text-[#CCFF00] border border-zinc-700 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all cursor-pointer shadow-xl inline-flex items-center gap-2"
          >
            <span>{showAllServices ? 'SHOW LESS SERVICES' : `VIEW ALL SERVICES (${services.length} PROGRAMS)`}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

