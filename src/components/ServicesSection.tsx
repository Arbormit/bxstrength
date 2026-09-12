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
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  const services: ServiceItem[] = [
    {
      title: 'Fitness Boxing',
      category: 'Individual Service',
      servicePlan: 'Fitness Boxing',
      duration: '20Min / session',
      price: 30,
      sessionType: '1-on-1 Personal Session',
      goalPrimaryOutcome: 'Technical Boxing, Conditioning, footwork & power.',
      whatYouGet: 'Live 1:1 padwork & boxing conditioning coaching.',
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
      goalPrimaryOutcome: 'Build muscle, raw strength & overall fitness.',
      whatYouGet: 'Live 1:1 strength coaching tailored to your goal.',
      keyDifference: 'Single specialist strength service with progressive overload.',
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
      goalPrimaryOutcome: 'Improve joint mobility & accelerate muscle recovery.',
      whatYouGet: 'Targeted mobility drills & dynamic stretching protocols.',
      keyDifference: 'Focus on movement quality & joint longevity.',
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
      goalPrimaryOutcome: 'Increase flexibility & reduce muscle stiffness.',
      whatYouGet: 'Live 1:1 flexibility & posture alignment coaching.',
      keyDifference: 'Single specialist flexibility & strain prevention.',
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
      goalPrimaryOutcome: 'Stress relief, focus resilience & mental wellness.',
      whatYouGet: '1:1 mindset coaching & stress reduction strategies.',
      keyDifference: 'Single specialist mindset & performance wellness.',
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
      goalPrimaryOutcome: 'One tailored focus designed around your goal.',
      whatYouGet: 'Personalised coaching & custom session structure.',
      keyDifference: 'Full custom exercise selection.',
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
      goalPrimaryOutcome: 'One tailored focus with deep exercise customization.',
      whatYouGet: 'Tailored programme, technique focus & goal mapping.',
      keyDifference: 'High-yield custom protocol.',
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
      goalPrimaryOutcome: 'Combine any 2 focus areas into 1 session.',
      whatYouGet: 'Full personalisation & advanced technique correction.',
      keyDifference: 'Dual focus area custom program.',
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
      goalPrimaryOutcome: 'Up to 4 focus areas combined into bespoke plan.',
      whatYouGet: '100% tailored multi-focus coaching plan.',
      keyDifference: 'VIP complete custom protocol.',
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
      goalPrimaryOutcome: 'One primary focus with accessible entry rate.',
      whatYouGet: 'Basic warm-up, focused coaching & cool-down.',
      keyDifference: 'Entry level standard value package.',
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
      goalPrimaryOutcome: 'One main focus plus supporting workout.',
      whatYouGet: 'Goal-based training & supporting exercises.',
      keyDifference: 'Better value than single session bookings.',
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
      goalPrimaryOutcome: 'Any 2 focus areas in structured performance plan.',
      whatYouGet: 'Progressive training & technique corrections.',
      keyDifference: 'High popularity performance package.',
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
      goalPrimaryOutcome: 'Up to 4 focus areas for full coaching.',
      whatYouGet: 'Full-body strength, conditioning & mobility.',
      keyDifference: 'Flagship complete standard package.',
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
      goalPrimaryOutcome: 'Build weekly consistency & momentum.',
      whatYouGet: 'Choose any 3 sessions from boxing, strength, mobility or mindset.',
      keyDifference: '10% discount on weekly commitment.',
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
      goalPrimaryOutcome: 'Longer term progression & coaching support.',
      whatYouGet: '12 sessions built with coach around your targets.',
      keyDifference: '20% discount on monthly commitment.',
      totalSessions: '12 Sessions / Month',
      discount: '20% OFF',
      validity: '30 Days',
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

  // Show only 6 cards by default, expand to all when showAllServices is true
  const visibleServices = showAllServices ? filteredServices : filteredServices.slice(0, 6);

  return (
    <section id="services-section" className="w-full bg-[#09090b] text-white py-20 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING & CUSTOM PROTOCOLS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            OUR TRAINING SERVICES & PRICING
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
            Select a specialist service or custom protocol below. Upfront pricing in GBP (£) with zero hidden fees.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setShowAllServices(false); // Reset to 6 cards when changing tab
                }}
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

        {/* Services Grid (Concise & Easy to Read Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((srv, idx) => {
            const IconComp = srv.icon || Dumbbell;
            const displayDiscount = srv.discount || srv.discountTag;

            return (
              <div
                key={idx}
                className="relative bg-[#121215] border border-zinc-800/90 hover:border-[#CCFF00]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-2xl hover:shadow-[#CCFF00]/5 overflow-hidden"
              >
                {/* Discount Ribbon Tag */}
                {displayDiscount && (
                  <div className="absolute top-3 -right-8 w-32 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-widest text-center py-1 rotate-45 shadow-lg z-10 pointer-events-none select-none">
                    {displayDiscount}
                  </div>
                )}

                <div>
                  {/* Top Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3 pr-6">
                    <span className="text-[10px] font-black tracking-widest text-[#CCFF00] uppercase bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    {srv.badge && (
                      <span className="text-[9px] font-black tracking-wider text-amber-300 uppercase bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Icon Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#CCFF00] transition-colors leading-snug">
                        {srv.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        {srv.sessionType}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* HIGH VISIBILITY PRICING BOX */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-zinc-900 to-[#18181b] border-2 border-zinc-800 group-hover:border-[#CCFF00]/40 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                        PRICE / SESSION
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-[#CCFF00]">£{srv.price}</span>
                        <span className="text-xs font-bold text-zinc-300">/ {srv.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-md inline-block">
                        {srv.totalSessions}
                      </span>
                    </div>
                  </div>

                  {/* Instant Bite-Sized Information (Quick to Read) */}
                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex items-start gap-2 text-zinc-200">
                      <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs leading-snug font-medium">{srv.goalPrimaryOutcome}</span>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                      <span className="text-xs leading-snug text-zinc-300">{Array.isArray(srv.whatYouGet) ? srv.whatYouGet.join(', ') : srv.whatYouGet}</span>
                    </div>
                  </div>
                </div>

                {/* Single High-Contrast Action Button */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => onSelectService ? onSelectService(srv) : onOpenBooking()}
                    className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                  >
                    <span>SELECT & BOOK — £{srv.price}</span>
                    <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Expand/Collapse Button (Shows all 15 programs when clicked) */}
        {filteredServices.length > 6 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="bg-zinc-900 hover:bg-zinc-800 text-[#CCFF00] border border-zinc-700 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all cursor-pointer shadow-xl inline-flex items-center gap-3 active:scale-[0.98]"
            >
              <span>
                {showAllServices 
                  ? 'SHOW LESS PROGRAMS' 
                  : `VIEW ALL ${filteredServices.length} TRAINING PROGRAMS`}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#CCFF00] transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

