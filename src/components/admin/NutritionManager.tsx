import React, { useState } from 'react';
import { NutritionPlan, User } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Utensils, Plus, UserCheck, Trash2, X } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface NutritionManagerProps {
  plans: NutritionPlan[];
  clients: User[];
  onPlansUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const NutritionManager: React.FC<NutritionManagerProps> = ({
  plans,
  clients,
  onPlansUpdated,
  onShowToast
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<{ id: string; title: string } | null>(null);

  const [title, setTitle] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [dailyCalories, setDailyCalories] = useState(2400);
  const [proteinG, setProteinG] = useState(190);
  const [carbsG, setCarbsG] = useState(220);
  const [fatG, setFatG] = useState(70);

  const handleDeleteTrigger = (id: string, planTitle: string) => {
    setDeletingPlan({ id, title: planTitle });
  };

  const confirmDelete = () => {
    if (deletingPlan) {
      VelocityAPI.deleteNutritionPlan(deletingPlan.id);
      onShowToast(`Deleted diet plan "${deletingPlan.title}"`);
      setDeletingPlan(null);
      onPlansUpdated();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      onShowToast('Title is required');
      return;
    }

    const assignedUser = clients.find((c) => c.id === assignedUserId);

    VelocityAPI.saveNutritionPlan({
      title,
      assignedToUserId: assignedUser ? assignedUser.id : undefined,
      assignedToUserName: assignedUser ? assignedUser.name : undefined,
      dailyCalories: Number(dailyCalories),
      targetProteinG: Number(proteinG),
      targetCarbsG: Number(carbsG),
      targetFatG: Number(fatG),
      meals: [
        { id: 'm-1', mealName: 'Power Breakfast', timeSlot: '08:00 AM', description: '4 Eggs, Oats, Berries', calories: 550, proteinG: 40, carbsG: 50, fatG: 18 },
        { id: 'm-2', mealName: 'Post-Workout Fuel', timeSlot: '01:00 PM', description: 'Grilled Chicken, Rice, Greens', calories: 650, proteinG: 55, carbsG: 70, fatG: 12 },
        { id: 'm-3', mealName: 'Dinner', timeSlot: '07:30 PM', description: 'Salmon, Sweet Potato', calories: 750, proteinG: 55, carbsG: 60, fatG: 25 }
      ]
    });

    onShowToast(`Created & assigned diet plan "${title}"!`);
    setShowModal(false);
    onPlansUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#8C532B]" />
            NUTRITION & DIET PLAN ASSIGNMENT
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build custom diet plans, set daily calorie targets, and assign macronutrients to client profiles.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setShowModal(true);
          }}
          className="bg-[#8C532B] hover:bg-[#70401E] text-white text-xs font-black tracking-widest px-5 py-3 uppercase shadow-md shadow-amber-950/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>BUILD DIET PLAN</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-[#111111] border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-pink-400">{p.dailyCalories} KCAL / DAY</span>
              <div className="flex items-center gap-2">
                {p.assignedToUserName && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Assigned: {p.assignedToUserName}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteTrigger(p.id, p.title)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
                  title="Delete Diet Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-black uppercase text-white mb-2">{p.title}</h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-gray-900 p-3 border border-gray-800">
              <div>
                <span className="block text-gray-400 text-[10px]">PROTEIN</span>
                <span className="text-pink-400 font-bold">{p.targetProteinG}g</span>
              </div>
              <div>
                <span className="block text-gray-400 text-[10px]">CARBS</span>
                <span className="text-blue-400 font-bold">{p.targetCarbsG}g</span>
              </div>
              <div>
                <span className="block text-gray-400 text-[10px]">FATS</span>
                <span className="text-amber-400 font-bold">{p.targetFatG}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111111] text-white border border-gray-800 p-6 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-4">BUILD DIET PLAN</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Plan Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High Protein Lean Muscle Diet"
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Assign Client</label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-xs outline-none"
                >
                  <option value="">-- Unassigned Plan --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Daily Calories</label>
                  <input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbsG}
                    onChange={(e) => setCarbsG(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={fatG}
                    onChange={(e) => setFatG(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-1.5 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E52165] hover:bg-[#c41551] text-white text-xs font-black tracking-widest py-3 uppercase shadow-md shadow-pink-500/20"
              >
                SAVE & ASSIGN DIET PLAN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Confirm Modal for Delete Diet Plan */}
      <ConfirmModal
        isOpen={!!deletingPlan}
        title="DELETE DIET PLAN"
        message={`Are you sure you want to delete the diet plan "${deletingPlan?.title}"?`}
        type="danger"
        confirmText="DELETE DIET PLAN"
        cancelText="KEEP DIET PLAN"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingPlan(null)}
      />
    </div>
  );
};
