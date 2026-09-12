import React, { useState } from 'react';
import { 
  Dumbbell, Flame, HeartPulse, Activity, Zap, CheckCircle2, AlertCircle, 
  Target, ShieldCheck, RefreshCw, Home, Video, Trophy, Users, Award, Heart, ChevronDown, ChevronRight, Tag, Clock, Gift, Calendar, Sparkles, Check, Filter, ArrowRight
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
  badge?: string;
  problem?: string;
  solution?: string;
  result?: string;
}

interface ServicesSectionProps {
  onOpenBooking: () => void;
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking, onSelectService }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
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
      keyDifference: 'Single specialist service; focused 1-on-1 padwork.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Flame,
      badge: 'POPULAR'
    },
    {
      title: 'Strength Training',
      category: 'Individual Service',
      servicePlan: 'Strength Training',
      duration: '20Min / session',
      price: 25,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Build strength, muscle, endurance and overall fitness.',
      whatYouGet: 'Live 1:1 strength focused coaching adapted to your goal and ability.',
      keyDifference: 'Single specialist strength service with bar & dumbbell tracking.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Dumbbell
    },
    {
      title: 'Mobility & Recovery',
      category: 'Individual Service',
      servicePlan: 'Mobility & Recovery',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Improve joint mobility, reduce stiffness, enhance flexibility, and accelerate recovery.',
      whatYouGet: 'Targeted mobility drills, dynamic stretching, PNF techniques & recovery protocols.',
      keyDifference: 'Focus on movement quality and joint health.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: HeartPulse
    },
    {
      title: 'Flexibility Training',
      category: 'Individual Service',
      servicePlan: 'Flexibility Training',
      duration: '20Min / session',
      price: 25,
      sessionType: '1-on-1 Clinical Rehab',
      goalPrimaryOutcome: 'Increase flexibility, reduce muscle stiffness and enhance post-workout recovery.',
      whatYouGet: 'Live 1:1 flexibility focused coaching adapted to client goal and mobility limits.',
      keyDifference: 'Single specialist flexibility & strain prevention service.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Activity
    },
    {
      title: 'Mindset & Wellness',
      category: 'Individual Service',
      servicePlan: 'Mindset & Wellness',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Pro Coaching',
      goalPrimaryOutcome: 'Mindset coaching, stress relief and mental wellness support.',
      whatYouGet: 'Live 1:1 coaching focused on mindset, stress reduction & mental focus resilience.',
      keyDifference: 'Single specialist mindset and mental wellness service.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Sparkles
    },
    {
      title: 'Custom Basic',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '15Min / session',
      price: 30,
      sessionType: 'Fully Personalised',
      goalPrimaryOutcome: 'One tailored focus designed around your specific fitness goal.',
      whatYouGet: 'Goal based personalised coaching, technique control & custom session plan.',
      keyDifference: '£10 above BX Basic care for full custom exercise selection.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Zap
    },
    {
      title: 'Custom Focus',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '30Min / session',
      price: 45,
      sessionType: 'Fully Personalised',
      goalPrimaryOutcome: 'One tailored focus designed around your primary goal.',
      whatYouGet: 'Tailored programme, extra attention to detail, goal mapping & supporting work.',
      keyDifference: '£10 above BX Focus for full custom exercise selection.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Zap,
      badge: 'RECOMMENDED'
    },
    {
      title: 'Custom Performance',
      category: 'Custom',
      servicePlan: 'Custom Package',
      duration: '45Min / session',
      price: 65,
      sessionType: 'Fully Personalised',
      goalPrimaryOutcome: 'Any 2 focus areas, custom-built around your personal targets.',
      whatYouGet: 'Full personalisation, advanced programming, technique refinement & mobility.',
      keyDifference: '£10 above BX Performance for full custom exercise selection.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Zap
    },
    {
      title: 'Custom Complete',
      category: 'Custom',
      servicePlan: 'Custom Complete',
      duration: '60Min / session',
      price: 85,
      sessionType: 'Fully Personalised',
      goalPrimaryOutcome: 'Up to 4 focus areas combined into one bespoke session plan.',
      whatYouGet: '100% tailored programming, advanced exercise selection & technique correction across all focus areas.',
      keyDifference: '£10 above BX Complete for total custom design.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Trophy,
      badge: 'VIP BESPOKE'
    },
    {
      title: 'BX Basic Care',
      category: 'Core Package',
      servicePlan: 'BX Basic Care',
      duration: '15Min / session',
      price: 20,
      sessionType: 'Standard Package',
      goalPrimaryOutcome: 'One primary focus with an accessible coaching experience.',
      whatYouGet: 'Basic warm-up, focused coaching, technique guidance and cool-down.',
      keyDifference: 'Entry level standard package, lower price than custom basic.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: ShieldCheck,
      badge: 'MOST ACCESSIBLE'
    },
    {
      title: 'BX Focus',
      category: 'Core Package',
      servicePlan: 'BX Focus',
      duration: '30Min / session',
      price: 35,
      sessionType: 'Standard Package',
      goalPrimaryOutcome: 'One main focus plus supporting work.',
      whatYouGet: 'Personalised warm-up, goal-based training, supporting exercises and cool-down.',
      keyDifference: 'Standard package offering better value than individual services.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Target
    },
    {
      title: 'BX Performance',
      category: 'Core Package',
      servicePlan: 'BX Performance',
      duration: '45Min / session',
      price: 55,
      sessionType: 'Standard Package',
      goalPrimaryOutcome: 'Any two focus areas in a structured performance session.',
      whatYouGet: 'Structured session, progressive training, technique corrections & mobility.',
      keyDifference: 'Standard package offering better value than individual services.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Activity,
      badge: 'BEST SELLER'
    },
    {
      title: 'BX Complete',
      category: 'Core Package',
      servicePlan: 'BX Complete',
      duration: '60Min / session',
      price: 75,
      sessionType: 'Standard Package',
      goalPrimaryOutcome: 'Up to 4 focus areas for comprehensive coaching.',
      whatYouGet: 'Full-body training, personalised intensity, strength, conditioning & progress tracking.',
      keyDifference: 'Flagship standard package, strongest overall package value.',
      totalSessions: '1 Session',
      discount: '',
      validity: 'Single session booking',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Trophy
    },
    {
      title: 'BX Weekly 3',
      category: 'Programme',
      servicePlan: 'BX Weekly 3',
      duration: 'Varies by selected sessions',
      price: 30,
      sessionType: '3 Session Weekly Programme',
      goalPrimaryOutcome: 'Build weekly consistency and maintain momentum.',
      whatYouGet: 'Choose any 3 sessions from boxing, strength, functional, mobility, flexibility or mindset.',
      keyDifference: 'Programme level discount and structured weekly consistency.',
      totalSessions: '3 Sessions',
      discount: '10% OFF',
      validity: '7 Days',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: Calendar,
      badge: 'SAVE 10%'
    },
    {
      title: 'BX Monthly 12',
      category: 'Programme',
      servicePlan: 'BX Monthly 12',
      duration: 'Varies by selected sessions',
      price: 50,
      sessionType: '12 Session Monthly Programme',
      goalPrimaryOutcome: 'Longer term consistency, progression and sustainable coaching support.',
      whatYouGet: '12 sessions built with coach around your goals combining boxing, strength & mobility.',
      keyDifference: 'Higher volume programme with 20% discount and 30 day validity.',
      totalSessions: '12 Sessions / Month',
      discount: '20% OFF',
      validity: '30 Days (1 day off per week)',
      complimentary: 'Warm-up + cool-down included within booked time.',
      icon: RefreshCw,
      badge: 'SAVE 20%'
    }
  ];

  const categories = [
    { id: 'All', label: 'All Services (15)' },
    { id: 'Individual Service', label: 'Individual Services' },
    { id: 'Custom', label: 'Custom Packages' },
    { id: 'Core Package', label: 'Core Packages' },
    { id: 'Programme', label: 'Weekly & Monthly Programmes' },
  ];

  const filteredServices = activeTab === 'All' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <section id="services-section" className="w-full bg-[#09090b] text-white py-20 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING & CUSTOM PROTOCOLS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            OUR TRAINING SERVICES & PRICING
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            Choose from individual specialist sessions, core packages, or fully custom multi-step protocols with clear, upfront pricing in GBP (£).
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20 font-black scale-105'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv, idx) => {
            const IconComp = srv.icon || Dumbbell;
            const displayDiscount = srv.discount || srv.discountTag;

            return (
              <div
                key={idx}
                className="relative bg-[#121215] border border-zinc-800/90 hover:border-[#CCFF00]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-2xl hover:shadow-[#CCFF00]/5 overflow-hidden"
              >
                {/* Discount Banner Ribbon */}
                {displayDiscount && (
                  <div className="absolute top-3 -right-8 w-32 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-widest text-center py-1 rotate-45 shadow-lg z-10 pointer-events-none select-none">
                    {displayDiscount}
                  </div>
                )}

                <div>
                  {/* Top Header Row: Category Badge & Custom Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 pr-6">
                    <span className="text-[10px] font-black tracking-widest text-[#CCFF00] uppercase bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-2.5 py-1 rounded-md">
                      {srv.category}
                    </span>
                    {srv.badge && (
                      <span className="text-[9px] font-black tracking-wider text-amber-300 uppercase bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#CCFF00] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium mt-0.5">
                        {srv.sessionType}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* HIGH VISIBILITY PRICING BOX */}
                  <div className="mb-5 p-4 bg-gradient-to-br from-zinc-900 to-[#18181b] border-2 border-zinc-800 group-hover:border-[#CCFF00]/40 rounded-xl flex items-center justify-between transition-all">
                    <div>
                      <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                        TOTAL INVESTMENT
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-[#CCFF00]">£{srv.price}</span>
                        {srv.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through font-bold">£{srv.originalPrice}</span>
                        )}
                        <span className="text-xs font-bold text-zinc-300">/ session</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-white bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-md block">
                        {srv.duration}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium mt-1 block">
                        {srv.totalSessions}
                      </span>
                    </div>
                  </div>

                  {/* Details & Features List */}
                  <div className="space-y-3 text-xs mb-6">
                    {/* Primary Goal */}
                    {srv.goalPrimaryOutcome && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-emerald-400 mb-1">
                          <Target className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PRIMARY OUTCOME</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200 text-xs">{srv.goalPrimaryOutcome}</p>
                      </div>
                    )}

                    {/* What You Get */}
                    {srv.whatYouGet && (
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#CCFF00] mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                          <span>WHAT IS INCLUDED</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200 text-xs">
                          {Array.isArray(srv.whatYouGet) ? srv.whatYouGet.join(', ') : srv.whatYouGet}
                        </p>
                      </div>
                    )}

                    {/* Key Advantage */}
                    {srv.keyDifference && (
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30 text-purple-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-purple-400 mb-1">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>WHY CHOOSE THIS</span>
                        </div>
                        <p className="leading-relaxed text-zinc-200 text-xs">{srv.keyDifference}</p>
                      </div>
                    )}

                    {/* Specifications */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Validity Period:</span>
                        </span>
                        <span className="font-bold text-white">{srv.validity}</span>
                      </div>

                      {srv.complimentary && (
                        <div className="flex items-center justify-between text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-[#CCFF00]" />
                            <span>Included Warmup:</span>
                          </span>
                          <span className="font-semibold text-emerald-400 text-right">
                            {srv.complimentary}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => onSelectService ? onSelectService(srv) : onOpenBooking()}
                    className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] group-hover:scale-[1.01]"
                  >
                    <span>SELECT & CHOOSE PLAN — £{srv.price}</span>
                    <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

