import React from 'react';
import { Award, ShieldCheck, Flame, Trophy, Star, Zap } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const badges = [
    { id: 1, title: 'First Rep Master', desc: 'Completed your 1st workout log', icon: '🏋️', unlocked: true, category: 'Milestone' },
    { id: 2, title: 'Consistent Beast', desc: 'Maintained 14 consecutive daily workout streaks', icon: '🔥', unlocked: true, category: 'Streak' },
    { id: 3, title: 'Sub-25 BMI Club', desc: 'Achieved Healthy WHO Normal Weight category', icon: '⚡', unlocked: true, category: 'Health' },
    { id: 4, title: 'Macro Titan', desc: 'Hit daily protein target 7 days in a row', icon: '🥩', unlocked: true, category: 'Nutrition' },
    { id: 5, title: 'Heavy Compound 100', desc: 'Lifted over 100kg total squat/deadlift volume', icon: '🥇', unlocked: false, category: 'Strength' },
    { id: 6, title: 'Spin Master', desc: 'Attended 10 RPM Cycling classes', icon: '🚴', unlocked: false, category: 'Class' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-gray-800 p-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          FITNESS MILESTONES & BADGES
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Unlock achievements by hitting strength targets, maintaining streaks, and completing classes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-6 border flex items-start gap-4 transition-all ${
              b.unlocked
                ? 'bg-[#111111] border-gray-800 hover:border-amber-500/50'
                : 'bg-gray-950/40 border-gray-900 opacity-50 grayscale'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
              {b.icon}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/40 px-2 py-0.5 border border-amber-800/60">
                  {b.category}
                </span>
                {b.unlocked && <span className="text-[10px] text-emerald-400 font-bold">UNLOCKED</span>}
              </div>
              <h3 className="text-sm font-bold text-white uppercase">{b.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
