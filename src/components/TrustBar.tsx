import React from 'react';
import { Award, Users, CheckCircle, ShieldCheck, Globe } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: Award,
      value: '10+ YEARS',
      label: 'Elite Coaching Experience',
    },
    {
      icon: Users,
      value: '1,000+ CLIENTS',
      label: 'Transformed Worldwide',
    },
    {
      icon: CheckCircle,
      value: '99% SATISFACTION',
      label: 'Client Transformation Rate',
    },
    {
      icon: ShieldCheck,
      value: 'EXPERT VERIFIED',
      label: 'Verified Master Coaches',
    },
    {
      icon: Globe,
      value: 'GLOBAL VIRTUAL',
      label: '100% Bespoke Virtual Coaching',
    },
  ];

  return (
    <section className="w-full bg-[#121214] border-y border-zinc-800 py-6 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {trustItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-2 group">
                <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-2 group-hover:border-white group-hover:bg-zinc-700 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-black tracking-tight text-white uppercase">{item.value}</span>
                <span className="text-[11px] font-medium text-zinc-400 mt-0.5">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
