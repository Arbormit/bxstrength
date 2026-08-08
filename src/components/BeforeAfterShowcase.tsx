import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Dumbbell, Activity, Calendar, Trophy, ChevronRight, CheckCircle2, AlertTriangle, Sparkles, User, HeartPulse } from 'lucide-react';

interface BeforeAfterShowcaseProps {
  onOpenConsultation: () => void;
  onOpenAssessment: () => void;
}

export interface TransformationItem {
  id: string;
  name: string;
  age: number;
  location: string;
  coach: string;
  coachTitle: string;
  duration: string;
  beforeWeight: string;
  afterWeight: string;
  weightLoss: string;
  beforeImg: string;
  afterImg: string;
  beforeTraits: string[];
  afterTraits: string[];
  quote: string;
  focusArea: string;
}

export const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'marcus-130-80',
    name: 'Marcus Vance',
    age: 34,
    location: 'London, UK',
    coach: 'David Williams',
    coachTitle: 'Head of Strength & Conditioning',
    duration: '10 Months (8–12 Mo Protocol)',
    beforeWeight: '130 kg (286 lbs)',
    afterWeight: '80 kg (176 lbs)',
    weightLoss: '-50 kg (110 lbs)',
    beforeImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    beforeTraits: [
      'Body Weight: 130 kg with High Visceral Fat',
      'Severe Knee Discomfort & Lower Back Fatigue',
      'Chronic Sluggishness & Poor Metabolic Markers',
      'Struggled with Unstructured Crash Diets'
    ],
    afterTraits: [
      'Fit Weight: 80 kg (50 kg Sustained Fat Loss)',
      'Zero Joint Pain & Peak Athletic Mobility',
      'Restored Blood Sugar & High Daily Energy',
      'Supervised Biomechanical Strength Protocol'
    ],
    quote: "Joining BxStrength changed my life. I went from 130kg with joint pain to 80kg of lean muscle under Coach David's direct supervision.",
    focusArea: 'Executive Recomposition & Joint Health'
  },
  {
    id: 'elena-pcos-cycle',
    name: 'Elena Rostova',
    age: 29,
    location: 'Manchester, UK',
    coach: 'Dr. Sophia Chen',
    coachTitle: 'Lead Metabolic & Women\'s Health Specialist',
    duration: '8 Months Protocol',
    beforeWeight: '92 kg (202 lbs)',
    afterWeight: '64 kg (141 lbs)',
    weightLoss: '-28 kg (61 lbs)',
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
    beforeTraits: [
      'Body Weight: 92 kg with PCOS Symptoms',
      'Irregular Period Cycles (2–3 Month Gaps)',
      'Severe Water Retention & Knee Joint Strain',
      'Insulin Resistance & Mood Fluctuations'
    ],
    afterTraits: [
      'Fit Weight: 64 kg (28 kg Fat Loss)',
      'Regular 28-Day Period Cycle Synchronization',
      'Restored Hormonal Balance & Clear Skin',
      'Cycle-Synced Strength & Resistance Training'
    ],
    quote: "Dr. Sophia adapted my training to my menstrual cycle and PCOS. My period cycle normalized for the first time in 5 years while losing 28kg!",
    focusArea: 'PCOS & Female Cycle Syncing'
  },
  {
    id: 'james-back-rehab',
    name: 'James Sterling',
    age: 41,
    location: 'Birmingham, UK',
    coach: 'Marcus Vance',
    coachTitle: 'Senior Biomechanics & Rehabilitation Coach',
    duration: '9 Months Protocol',
    beforeWeight: '115 kg (253 lbs)',
    afterWeight: '82 kg (180 lbs)',
    weightLoss: '-33 kg (73 lbs)',
    beforeImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800',
    beforeTraits: [
      'Body Weight: 115 kg with L4-L5 Back Discomfort',
      'Sedentary Desk Posture & Weak Core Stability',
      'Knee Pain on Stairs & Inability to Squat',
      'High Stress & Restless Sleep Patterns'
    ],
    afterTraits: [
      'Fit Weight: 82 kg (33 kg Fat Loss)',
      'Pain-Free 180kg Deadlift & Reinforced Core',
      'Corrected Postural Alignment & Spinal Health',
      'Restorative Sleep & Elevated Testosterone'
    ],
    quote: "I thought chronic back pain was permanent. BxStrength fixed my biomechanics first, then transformed my body completely.",
    focusArea: 'Postural Rehab & Back Health'
  }
];

export const BeforeAfterShowcase: React.FC<BeforeAfterShowcaseProps> = ({
  onOpenConsultation,
  onOpenAssessment,
}) => {
  const [activeTab, setActiveTab] = useState<string>(TRANSFORMATIONS[0].id);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');

  const activeItem = TRANSFORMATIONS.find((t) => t.id === activeTab) || TRANSFORMATIONS[0];

  return (
    <section className="w-full bg-[#0a0a0c] py-20 text-white border-b border-zinc-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-[11px] font-black tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL RESULTS • EXPERT SUPERVISION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            BEFORE & AFTER <span className="text-emerald-400">TRANSFORMATIONS</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 font-normal leading-relaxed">
            Real clients who transformed their lives under the direct supervision of BxStrength Expert Coaches. From 130kg to 80kg fit weight, joint rehabilitation, and metabolic health.
          </p>
        </div>

        {/* Transformation Case Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {TRANSFORMATIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setViewMode('after');
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === item.id
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-[#121214] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <span>{item.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                activeTab === item.id ? 'bg-black/30 text-black font-bold' : 'bg-zinc-800 text-zinc-300'
              }`}>
                {item.weightLoss}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Transformation Main Card */}
        <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 5 Cols: Before / After Visual Card with Toggle */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-800 shadow-2xl group">
                <img
                  src={viewMode === 'after' ? activeItem.afterImg : activeItem.beforeImg}
                  alt={activeItem.name}
                  className="w-full h-full object-cover filter contrast-105 transition-all duration-500"
                />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                    viewMode === 'after'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                      : 'bg-red-950/90 text-red-300 border-red-800'
                  }`}>
                    {viewMode === 'after' ? 'AFTER: FIT & ENERGIZED' : 'BEFORE: INITIAL TRAITS'}
                  </span>

                  <span className="bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded border border-zinc-800">
                    {activeItem.duration}
                  </span>
                </div>

                {/* Bottom Overlay Stats */}
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tight">{activeItem.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium">{activeItem.focusArea}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400 block">{activeItem.afterWeight}</span>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">Was {activeItem.beforeWeight}</span>
                    </div>
                  </div>

                  {/* Toggle Mode Switcher */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setViewMode('before')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded border transition-all cursor-pointer ${
                        viewMode === 'before'
                          ? 'bg-red-500 text-black border-red-400 font-extrabold'
                          : 'bg-black/60 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      View Before ({activeItem.beforeWeight.split(' ')[0]})
                    </button>
                    <button
                      onClick={() => setViewMode('after')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded border transition-all cursor-pointer ${
                        viewMode === 'after'
                          ? 'bg-emerald-400 text-black border-emerald-300 font-extrabold'
                          : 'bg-black/60 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      View After ({activeItem.afterWeight.split(' ')[0]} Fit)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Metrics & Traits Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header Info */}
              <div className="border-b border-zinc-800/80 pb-5">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-zinc-800 text-emerald-400 px-3 py-1 rounded border border-zinc-700 uppercase">
                    BxStrength Verified Case Study
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Supervised by <strong className="text-white">{activeItem.coach}</strong> ({activeItem.coachTitle})
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {activeItem.weightLoss} TRANSFORMATION IN {activeItem.duration.toUpperCase()}
                </h3>
              </div>

              {/* Traits Side-by-Side Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Before Traits Box */}
                <div className="bg-[#18181c] border border-red-950/60 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider border-b border-red-900/40 pb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>BEFORE BXSTRENGTH</span>
                  </div>
                  <ul className="space-y-2">
                    {activeItem.beforeTraits.map((trait, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After Traits Box */}
                <div className="bg-[#18181c] border border-emerald-950/80 p-4 rounded-xl space-y-3 shadow-lg shadow-emerald-950/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider border-b border-emerald-900/40 pb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AFTER EXPERT COACHING</span>
                  </div>
                  <ul className="space-y-2">
                    {activeItem.afterTraits.map((trait, idx) => (
                      <li key={idx} className="text-xs text-zinc-200 flex items-start gap-2 leading-relaxed font-medium">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Client Testimony Quote */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl italic text-xs text-zinc-300 relative">
                <p className="relative z-10">"{activeItem.quote}"</p>
                <span className="block mt-2 not-italic font-bold text-emerald-400 text-[10px] uppercase">
                  — {activeItem.name}, {activeItem.location}
                </span>
              </div>

              {/* Call to Action Triggers */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onOpenConsultation}
                  className="flex-1 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black tracking-widest py-3.5 px-6 rounded-lg uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>START YOUR TRANSFORMATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenAssessment}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold tracking-wider py-3.5 px-6 rounded-lg uppercase transition-all cursor-pointer"
                >
                  Take 5-Min Assessment
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
