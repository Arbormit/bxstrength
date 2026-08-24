import React, { useState } from 'react';
import { 
  Dumbbell, Flame, HeartPulse, Activity, Zap, CheckCircle2, AlertCircle, 
  Target, ShieldCheck, RefreshCw, Home, Video, Trophy, Users, Award, Heart, ChevronDown, ChevronRight, Tag 
} from 'lucide-react';

export interface ServiceItem {
  title: string;
  icon: React.ElementType;
  category: string;
  problem: string;
  solution: string;
  result: string;
  discountTag?: string;
  originalPrice?: number;
  discountedPrice?: number;
  priceUnit?: string;
}

interface ServicesSectionProps {
  onOpenBooking: () => void;
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking, onSelectService }) => {
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  const services: ServiceItem[] = [
    {
      title: 'EXECUTIVE METABOLIC CONDITIONING',
      icon: Flame,
      category: 'FAT LOSS',
      discountTag: '15% OFF',
      originalPrice: 40,
      discountedPrice: 34,
      priceUnit: '/ session',
      problem: 'High-stress business schedule leading to low energy, elevated cortisol, poor sleep quality, and sluggish metabolic rate.',
      solution: 'Time-efficient, high-yield metabolic conditioning protocol engineered for maximum EPOC (Excess Post-Exercise Oxygen Consumption).',
      result: 'Sustained daily mental clarity, rapid fat loss, improved HRV (Heart Rate Variability), and peak energy levels.',
    },
    {
      title: 'PROFESSIONAL BOXING TECHNIQUE & MITTWORK',
      icon: Target,
      category: 'BOXING',
      discountTag: '20% OFF',
      originalPrice: 60,
      discountedPrice: 48,
      priceUnit: '/ session',
      problem: 'Wanting to master authentic boxing footwork, punching mechanics, and head movement without injury or repetitive strain.',
      solution: 'Pro boxing drills focusing on stance, weight distribution, punch combinations, defense, and high-tempo mittwork.',
      result: 'Explosive cardiovascular endurance, razor-sharp reflexes, stress relief, and authentic combat sport skill development.',
    },
    {
      title: 'HYPERTROPHY & MUSCLE MASS PROTOCOL',
      icon: Activity,
      category: 'MUSCLE GAIN',
      discountTag: '10% OFF',
      originalPrice: 45,
      discountedPrice: 40,
      priceUnit: '/ session',
      problem: 'Struggling to add lean muscle mass, uneven muscle development, or lack of structured hypertrophy progression.',
      solution: 'Targeted volume optimization, time-under-tension training, and muscle-group specific hypertrophy programming.',
      result: 'Measurable muscle girth gains, symmetrical physique aesthetics, and increased muscular endurance.',
    },
    {
      title: 'PHYSIOTHERAPY & POST-INJURY REHABILITATION',
      icon: HeartPulse,
      category: 'REHAB',
      discountTag: '20% OFF',
      originalPrice: 80,
      discountedPrice: 64,
      priceUnit: '/ session',
      problem: 'Chronic lower back stiffness, knee pain, shoulder impingement, or recovering from a recent surgical procedure.',
      solution: 'In-depth joint biomechanics assessment, corrective muscle activation, kinetic chain realignment, and rehab exercises.',
      result: 'Pain-free daily movement, restored joint range of motion, and reduced risk of re-injury during heavy lifts.',
    },
    {
      title: 'CLINICAL NUTRITION & BODY FAT CUTTING',
      icon: Heart,
      category: 'NUTRITION',
      discountTag: '15% OFF',
      originalPrice: 35,
      discountedPrice: 29,
      priceUnit: '/ session',
      problem: 'Confused by fad diets, extreme calorie restriction, energy crashes, and metabolic rebounding after stopping strict meal plans.',
      solution: 'Flexible macronutrient architecture, circadian-aligned meal timing, and gut-health optimization tailored to your lifestyle.',
      result: 'Zero food anxiety, steady daytime energy, sustained fat loss maintenance, and improved metabolic health markers.',
    },
    {
      title: 'MOBILITY, FLEXIBILITY & JOINT HEALTH',
      icon: RefreshCw,
      category: 'MOBILITY',
      discountTag: '10% OFF',
      originalPrice: 30,
      discountedPrice: 27,
      priceUnit: '/ session',
      problem: 'Feeling stiff from long hours sitting at desk, restricted squat depth, tight hip flexors, or poor spinal articulation.',
      solution: 'Dynamic mobility flows, PNF stretching protocols, joint capsule opening routines, and postural realignment.',
      result: 'Fluid athletic movement, enhanced squat & deadlift depth, improved posture, and instant muscle tension release.',
    },
    {
      title: 'ATHLETIC SPEED & FOOTWORK CONDITIONING',
      icon: Zap,
      category: 'ATHLETICS',
      discountTag: '20% OFF',
      originalPrice: 50,
      discountedPrice: 40,
      priceUnit: '/ session',
      problem: 'Sluggish lateral movement, slow deceleration, poor agility, or lack of explosive first-step quickness.',
      solution: 'Ladder drills, plyometric bounding, change-of-direction mechanics, and fast-twitch muscle fiber stimulation.',
      result: 'Light-on-feet agility, faster reaction time, explosive sprinting acceleration, and improved coordination.',
    },
    {
      title: 'VIRTUAL ONLINE PERSONAL TRAINING (24/7 SUPPORT)',
      icon: Video,
      category: 'VIRTUAL',
      discountTag: '20% OFF',
      originalPrice: 25,
      discountedPrice: 20,
      priceUnit: '/ session',
      problem: 'Frequent travel, unpredictable work shifts, or living far from top-tier professional combat & strength coaches.',
      solution: 'Live 1-on-1 HD virtual sessions via interactive app, video technique breakdown, and 24/7 direct coach messaging support.',
      result: 'Uncompromised workout consistency anywhere in the world with full accountability and expert guidance.',
    },
    {
      title: 'HYBRID HOME & GYM FITNESS WORKOUTS',
      icon: Home,
      category: 'HYBRID',
      discountTag: '15% OFF',
      originalPrice: 35,
      discountedPrice: 29,
      priceUnit: '/ session',
      problem: 'Limited workout gear at home, busy schedule, or wanting to blend home bodyweight training with weekly gym visits.',
      solution: 'Adaptable workout plans structured around dumbbells, bands, or full commercial gym gear tailored to where you train.',
      result: 'Seamless flexibility to workout anywhere without missing sessions or compromising fitness momentum.',
    },
    {
      title: 'CORE STABILITY & POSTURAL REALIGNMENT',
      icon: ShieldCheck,
      category: 'CORE STABILITY',
      discountTag: '10% OFF',
      originalPrice: 40,
      discountedPrice: 36,
      priceUnit: '/ session',
      problem: 'Weak deep core activation, anterior pelvic tilt, rounded shoulders, or lower back strain during compound movements.',
      solution: 'Anti-extension & anti-rotation core conditioning, diaphragmatic breathing mechanics, and posterior chain strengthening.',
      result: 'Rock-solid core stability, upright confident posture, and safer heavy lifting execution.',
    },
    {
      title: 'FIGHTER CONDITIONING & STAMINA BOOST',
      icon: Trophy,
      category: 'CONDITIONING',
      discountTag: '20% OFF',
      originalPrice: 55,
      discountedPrice: 44,
      priceUnit: '/ session',
      problem: 'Gassing out quickly during intense rounds, slow recovery between sets, or lack of anaerobic fight capacity.',
      solution: 'Tabata intervals, heavy bag conditioning rounds, anaerobic threshold pushing, and recovery zone training.',
      result: 'Unshakeable stamina, rapid heart rate recovery, and high-level physical resilience under fatigue.',
    },
    {
      title: 'BEGINNER FITNESS & FOUNDATIONAL HABITS',
      icon: Users,
      category: 'BEGINNERS',
      discountTag: '20% OFF',
      originalPrice: 30,
      discountedPrice: 24,
      priceUnit: '/ session',
      problem: 'Gym intimidation, anxiety about where to start, or previous failed attempts due to overly aggressive programs.',
      solution: 'Step-by-step foundational movement patterns, supportive coaching, positive habit building, and gradual intensity escalation.',
      result: 'Unstoppable gym confidence, safe exercise mastery, consistent habit formation, and early visual progress.',
    },
    {
      title: 'EXECUTIVE STRESS REDUCTION & WELLNESS',
      icon: HeartPulse,
      category: 'WELLNESS',
      discountTag: '15% OFF',
      originalPrice: 45,
      discountedPrice: 38,
      priceUnit: '/ session',
      problem: 'Work burnout, mental fatigue, elevated anxiety, and poor nervous system recovery after high-pressure work weeks.',
      solution: 'Parasympathetic recovery protocols, breathwork integration, moderate intensity movement, and sleep hygiene coaching.',
      result: 'Lower stress levels, restored deep REM sleep, mental clarity, and improved work-life balance.',
    },
    {
      title: 'LONG-TERM FAT LOSS MAINTENANCE PROTOCOL',
      icon: Award,
      category: 'FAT LOSS',
      discountTag: '20% OFF',
      originalPrice: 40,
      discountedPrice: 32,
      priceUnit: '/ session',
      problem: 'Losing weight successfully but repeatedly regaining fat back within 3 to 6 months after completing a diet.',
      solution: 'Reverse dieting strategies, metabolic rate restoration, self-monitoring tools, and sustainable lifestyle habit integration.',
      result: 'Permanent body transformation, stable body weight, healthy relationship with food, and lifelong fitness freedom.',
    },
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
            const IconComp = srv.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#121214] border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl overflow-hidden"
              >
                {/* Visual Top-Left Diagonal Cross Discount Ribbon */}
                {srv.discountTag && (
                  <div className="absolute top-3 -left-9 w-32 bg-[#CCFF00] text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center py-1 -rotate-45 shadow-xl border-y border-black/80 z-10 pointer-events-none select-none">
                    {srv.discountTag}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-800/80 border border-zinc-700 px-2.5 py-1 rounded-md">
                      {srv.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mb-4 leading-snug">
                    {srv.title}
                  </h3>

                  {/* Future-Ready Pricing Display Space */}
                  <div className="mb-6 p-3 bg-[#18181b] border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">SESSION RATE</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        {srv.discountedPrice ? (
                          <>
                            <span className="text-lg font-black text-[#CCFF00]">${srv.discountedPrice}</span>
                            {srv.originalPrice && (
                              <span className="text-xs text-zinc-500 line-through font-bold">${srv.originalPrice}</span>
                            )}
                            <span className="text-[10px] font-bold text-zinc-400">{srv.priceUnit || '/ session'}</span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-zinc-400">Custom Package Rates</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Problem */}
                    <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/30 text-red-200">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-red-400 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>PROBLEM</span>
                      </div>
                      <p className="leading-relaxed text-zinc-300">{srv.problem}</p>
                    </div>

                    {/* Solution */}
                    <div className="p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-zinc-200">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#CCFF00] mb-1">
                        <Zap className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>SOLUTION</span>
                      </div>
                      <p className="leading-relaxed text-zinc-200">{srv.solution}</p>
                    </div>

                    {/* Expected Result */}
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-emerald-400 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>EXPECTED RESULT</span>
                      </div>
                      <p className="leading-relaxed text-zinc-200">{srv.result}</p>
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
