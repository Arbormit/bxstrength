import React, { useState } from 'react';
import { WorkoutProgram, User } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Dumbbell, Plus, Trash2, UserCheck, X } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface ProgramManagerProps {
  programs: WorkoutProgram[];
  clients: User[];
  onProgramsUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const ProgramManager: React.FC<ProgramManagerProps> = ({
  programs,
  clients,
  onProgramsUpdated,
  onShowToast
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deletingProgram, setDeletingProgram] = useState<{ id: string; title: string } | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState(4);
  const [exReps, setExReps] = useState('8-10');
  const [exMuscle, setExMuscle] = useState('Chest / Triceps');
  const [exercisesList, setExercisesList] = useState<any[]>([]);

  const handleAddExercise = () => {
    if (!exName) return;
    setExercisesList([
      ...exercisesList,
      {
        id: `ex-${Date.now()}`,
        name: exName,
        sets: Number(exSets),
        reps: exReps,
        targetMuscle: exMuscle
      }
    ]);
    setExName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || exercisesList.length === 0) {
      onShowToast('Title and at least 1 exercise are required.');
      return;
    }

    const assignedUser = clients.find((c) => c.id === assignedUserId);

    VelocityAPI.saveProgram({
      title,
      description,
      level,
      durationWeeks: 4,
      assignedToUserId: assignedUser ? assignedUser.id : undefined,
      assignedToUserName: assignedUser ? assignedUser.name : undefined,
      exercises: exercisesList
    });

    onShowToast(`Created & assigned workout program "${title}"!`);
    setShowModal(false);
    onProgramsUpdated();
  };

  const handleDeleteTrigger = (id: string, progTitle: string) => {
    setDeletingProgram({ id, title: progTitle });
  };

  const confirmDelete = () => {
    if (deletingProgram) {
      VelocityAPI.deleteProgram(deletingProgram.id);
      onShowToast(`Deleted program "${deletingProgram.title}"`);
      setDeletingProgram(null);
      onProgramsUpdated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#E52165]" />
            WORKOUT PROGRAM BUILDER & ASSIGNMENTS
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build custom workout routines, set exercises, target muscle groups, and assign directly to client dashboards.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setDescription('');
            setExercisesList([]);
            setShowModal(true);
          }}
          className="bg-[#8C532B] hover:bg-[#70401E] text-white text-xs font-black tracking-widest px-5 py-3 uppercase shadow-md shadow-amber-950/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>BUILD NEW WORKOUT PROGRAM</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-[#111111] border border-gray-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-gray-800 text-pink-400 border border-gray-700">
                  {prog.level}
                </span>
                {prog.assignedToUserName && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Assigned to {prog.assignedToUserName}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black uppercase text-white mb-1">{prog.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{prog.description}</p>

              <div className="bg-gray-900 p-3 border border-gray-800 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Exercise List ({prog.exercises.length}):
                </span>
                {prog.exercises.map((ex) => (
                  <div key={ex.id} className="flex justify-between text-gray-300">
                    <span>• {ex.name}</span>
                    <span className="font-mono text-gray-400">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => handleDeleteTrigger(prog.id, prog.title)}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete Routine
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#111111] text-white border border-gray-800 p-6 shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-4">BUILD NEW WORKOUT PROGRAM</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Program Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hypertrophy 4-Day Split"
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Target Client</label>
                  <select
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-xs outline-none"
                  >
                    <option value="">-- Unassigned Template --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-xs outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Routine focus and muscle hypertrophy goals..."
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-1.5 text-xs outline-none"
                />
              </div>

              {/* Add Exercise Subsection */}
              <div className="bg-gray-900 p-3 border border-gray-800 space-y-2">
                <span className="text-xs font-bold uppercase text-[#E52165] block">Add Exercises To Routine:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exName}
                    onChange={(e) => setExName(e.target.value)}
                    className="col-span-2 bg-black border border-gray-800 text-white px-2 py-1.5 text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Target Muscle"
                    value={exMuscle}
                    onChange={(e) => setExMuscle(e.target.value)}
                    className="bg-black border border-gray-800 text-white px-2 py-1.5 text-xs outline-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>Sets:</span>
                    <input
                      type="number"
                      value={exSets}
                      onChange={(e) => setExSets(Number(e.target.value))}
                      className="w-12 bg-black border border-gray-800 text-white px-1 py-1 text-xs font-mono"
                    />
                    <span>Reps:</span>
                    <input
                      type="text"
                      value={exReps}
                      onChange={(e) => setExReps(e.target.value)}
                      className="w-16 bg-black border border-gray-800 text-white px-1 py-1 text-xs font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-3 py-1 uppercase border border-gray-700"
                  >
                    + ADD EXERCISE
                  </button>
                </div>

                {exercisesList.length > 0 && (
                  <div className="pt-2 border-t border-gray-800 text-xs text-gray-300 space-y-1">
                    {exercisesList.map((e, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span>{idx + 1}. {e.name} ({e.targetMuscle})</span>
                        <span className="font-mono">{e.sets}×{e.reps}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#E52165] hover:bg-[#c41551] text-white text-xs font-black tracking-widest py-3 uppercase shadow-md shadow-pink-500/20"
              >
                SAVE & ASSIGN WORKOUT PROGRAM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Confirm Modal for Delete Program */}
      <ConfirmModal
        isOpen={!!deletingProgram}
        title="DELETE WORKOUT PROGRAM"
        message={`Are you sure you want to permanently delete the workout routine "${deletingProgram?.title}"?`}
        type="danger"
        confirmText="DELETE ROUTINE"
        cancelText="KEEP ROUTINE"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingProgram(null)}
      />
    </div>
  );
};
