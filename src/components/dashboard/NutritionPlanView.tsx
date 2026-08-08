import React, { useState } from 'react';
import { NutritionPlan } from '../../types';
import { Utensils, Droplets, Plus, CheckCircle2, Flame, Award } from 'lucide-react';

interface NutritionPlanViewProps {
  plans: NutritionPlan[];
  onShowToast: (msg: string) => void;
}

export const NutritionPlanView: React.FC<NutritionPlanViewProps> = ({ plans, onShowToast }) => {
  const plan = plans[0];
  const [waterMl, setWaterMl] = useState(1750);

  const addWater = (ml: number) => {
    const next = waterMl + ml;
    setWaterMl(next);
    onShowToast(`Logged +${ml}ml water intake! Total: ${next}ml / 3000ml`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#E52165]" />
            NUTRITION & MACRONUTRIENT PLAN
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Target calorie budget, protein breakdown, meal schedules, and hydration tracking.
          </p>
        </div>

        {plan && (
          <div className="bg-pink-950/40 border border-pink-800/60 px-4 py-2 text-right">
            <span className="block text-[9px] uppercase font-bold text-gray-400">ASSIGNED DIET</span>
            <span className="text-xs font-black text-pink-400 uppercase">{plan.title}</span>
          </div>
        )}
      </div>

      {plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns: Macros & Meal Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Macro Targets Visual Breakdown */}
            <div className="bg-[#111111] border border-gray-800 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                DAILY MACRONUTRIENT TARGETS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 border border-gray-800 p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Daily Energy</span>
                  <div className="text-2xl font-black text-white font-mono">{plan.dailyCalories}</div>
                  <span className="text-[10px] text-[#E52165] font-bold">KCAL / DAY</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Target Protein</span>
                  <div className="text-2xl font-black text-pink-400 font-mono">{plan.targetProteinG}g</div>
                  <span className="text-[10px] text-gray-400">35% of Calories</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Target Carbs</span>
                  <div className="text-2xl font-black text-blue-400 font-mono">{plan.targetCarbsG}g</div>
                  <span className="text-[10px] text-gray-400">45% of Calories</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Target Healthy Fats</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">{plan.targetFatG}g</div>
                  <span className="text-[10px] text-gray-400">20% of Calories</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-pink-400">PROTEIN INTAKE</span>
                    <span className="text-gray-300 font-mono">145g / {plan.targetProteinG}g</span>
                  </div>
                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E52165] h-full rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-400">CARBOHYDRATES</span>
                    <span className="text-gray-300 font-mono">180g / {plan.targetCarbsG}g</span>
                  </div>
                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Schedule List */}
            <div className="bg-[#111111] border border-gray-800 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 border-b border-gray-800 pb-3">
                MEAL TIMELINE & RECIPE INSTRUCTIONS
              </h3>

              <div className="space-y-3">
                {plan.meals.map((meal) => (
                  <div key={meal.id} className="bg-gray-900/90 border border-gray-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#E52165] text-white px-2 py-0.5">
                          {meal.timeSlot}
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase">{meal.mealName}</h4>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{meal.description}</p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold bg-black px-3 py-2 border border-gray-800 self-start sm:self-auto">
                      <span className="text-white">{meal.calories} kcal</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-pink-400">{meal.proteinG}g P</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-blue-400">{meal.carbsG}g C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Water Tracker */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-gray-800 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Droplets className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                DAILY HYDRATION LOG
              </span>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {waterMl} <span className="text-xs text-blue-400">/ 3000 ml</span>
              </div>

              <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden my-4 border border-gray-800">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterMl / 3000) * 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addWater(250)}
                  className="bg-gray-800 hover:bg-blue-600 text-white text-xs font-bold py-2.5 uppercase transition-colors border border-gray-700 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> +250 ML GLASS
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="bg-gray-800 hover:bg-blue-600 text-white text-xs font-bold py-2.5 uppercase transition-colors border border-gray-700 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> +500 ML BOTTLE
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111111] border border-gray-800 p-8 text-center text-xs text-gray-400">
          No diet plans assigned yet.
        </div>
      )}
    </div>
  );
};
