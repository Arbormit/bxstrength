import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Trophy, Plus, Edit2, Trash2, Award, CheckCircle2, X } from 'lucide-react';

interface Achievement {
  id: string;
  userId: string;
  title: string;
  category: 'Strength' | 'Weight Loss' | 'Consistency' | 'Nutrition' | 'General';
  icon: string;
  date: string;
  desc: string;
}

interface AchievementsViewProps {
  user: User;
  onShowToast: (msg: string) => void;
}

const STORAGE_PREFIX = 'velocity_user_achievements_';

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user, onShowToast }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Strength' | 'Weight Loss' | 'Consistency' | 'Nutrition' | 'General'>('Strength');
  const [icon, setIcon] = useState('🏆');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');

  // Load user achievements from localStorage (zero dummy data by default)
  useEffect(() => {
    const key = `${STORAGE_PREFIX}${user.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setAchievements(JSON.parse(raw));
      } catch {
        setAchievements([]);
      }
    } else {
      setAchievements([]);
    }
  }, [user.id]);

  const saveAchievementsToStore = (newItems: Achievement[]) => {
    setAchievements(newItems);
    localStorage.setItem(`${STORAGE_PREFIX}${user.id}`, JSON.stringify(newItems));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Strength');
    setIcon('🏆');
    setDate(new Date().toISOString().split('T')[0]);
    setDesc('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setIcon(item.icon);
    setDate(item.date);
    setDesc(item.desc);
    setShowModal(true);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    const filtered = achievements.filter((a) => a.id !== id);
    saveAchievementsToStore(filtered);
    onShowToast(`Deleted achievement "${itemTitle}"`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Please enter an achievement title');
      return;
    }

    if (editingItem) {
      const updatedList = achievements.map((a) =>
        a.id === editingItem.id ? { ...a, title, category, icon, date, desc } : a
      );
      saveAchievementsToStore(updatedList);
      onShowToast(`Updated achievement "${title}"`);
    } else {
      const newItem: Achievement = {
        id: `ach-${Date.now()}`,
        userId: user.id,
        title: title.trim(),
        category,
        icon,
        date,
        desc: desc.trim()
      };
      saveAchievementsToStore([newItem, ...achievements]);
      onShowToast(`Recorded new achievement "${title}"! 🎉`);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            MY PERSONAL FITNESS ACHIEVEMENTS
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Log and track personal strength PRs, weight loss milestones, and consistency streak badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black tracking-widest px-5 py-3 rounded uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW ACHIEVEMENT</span>
        </button>
      </div>

      {/* Empty State vs Real User Achievement Cards */}
      {achievements.length === 0 ? (
        <div className="bg-[#111111] border border-gray-800 p-12 text-center space-y-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-white tracking-tight">NO ACHIEVEMENTS LOGGED YET</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
              Log your personal fitness milestones, strength PRs, weight loss targets, or habit streaks to build your personal trophy room.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleOpenAdd}
              className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest px-6 py-3 rounded uppercase transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>LOG YOUR FIRST ACHIEVEMENT</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#111111] border border-gray-800 hover:border-amber-500/50 transition-all rounded-xl flex flex-col justify-between group space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 border border-amber-800/60">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                    title="Edit Achievement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
                    title="Delete Achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.desc && (
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              )}

              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>ACHIEVED DATE</span>
                <span className="text-emerald-400 font-bold">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-gray-800 w-full max-w-md p-6 rounded-xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                {editingItem ? 'EDIT ACHIEVEMENT' : 'LOG NEW FITNESS ACHIEVEMENT'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 150kg Squat PR or Lost 10kg Fat"
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3.5 py-2.5 text-xs outline-none focus:border-amber-500 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-xs outline-none rounded"
                  >
                    <option value="Strength">Strength PR</option>
                    <option value="Weight Loss">Weight Loss Target</option>
                    <option value="Consistency">Consistency Streak</option>
                    <option value="Nutrition">Nutrition Milestone</option>
                    <option value="General">General Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Badge Emoji
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-xs outline-none rounded"
                  >
                    <option value="🏆">🏆 Trophy</option>
                    <option value="🏋️">🏋️ Weightlifting</option>
                    <option value="🔥">🔥 Streak Fire</option>
                    <option value="⚡">⚡ Energy Titan</option>
                    <option value="🥇">🥇 Gold Medal</option>
                    <option value="🎯">🎯 Target Hit</option>
                    <option value="💪">💪 Muscle Power</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Date Achieved
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 text-xs font-mono outline-none rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Description / Personal Notes
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Record coaching feedback, weights lifted, or personal feelings..."
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3 text-xs outline-none resize-none rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-black tracking-widest py-3 uppercase rounded shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {editingItem ? 'SAVE CHANGES' : 'RECORD ACHIEVEMENT NOW'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
