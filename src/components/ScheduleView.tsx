import React, { useState, useEffect } from 'react';
import { SCHEDULE_DATA } from '../data/gymData';
import { ClassSchedule } from '../types';
import { VelocityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal } from './ui/ConfirmModal';
import { Calendar, Clock, User, MapPin, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ScheduleViewProps {
  onOpenBookingWithDetails: (className: string, trainerName: string) => void;
  onNavigateToAdmin?: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  onOpenBookingWithDetails,
  onNavigateToAdmin
}) => {
  const { user, isAuthenticated } = useAuth();
  const isCoachOrAdmin = isAuthenticated && user && (user.role === 'admin' || user.role === 'coach');

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classesList, setClassesList] = useState<ClassSchedule[]>([]);

  // Dedicated Popup Toast & Confirm Modal States
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadSchedule = () => {
    const apiClasses = VelocityAPI.getClasses();
    if (apiClasses && apiClasses.length > 0) {
      setClassesList(apiClasses);
    } else {
      // Map legacy SCHEDULE_DATA
      const mapped: ClassSchedule[] = SCHEDULE_DATA.map(s => ({
        id: s.id,
        title: s.className,
        category: 'strength',
        trainerId: 'trainer-1',
        trainerName: s.trainer,
        dayOfWeek: s.day,
        startTime: s.time.split(' - ')[0] || s.time,
        endTime: s.time.split(' - ')[1] || '08:00 AM',
        room: s.room,
        maxCapacity: 20,
        bookedCount: 20 - s.spotsLeft,
        price: 25
      }));
      setClassesList(mapped);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSchedule = classesList.filter((slot) => {
    const matchesDay = selectedDay === 'All' || slot.dayOfWeek === selectedDay;
    const matchesQuery = 
      slot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesQuery;
  });

  const handleDeleteTrigger = (id: string, classTitle: string) => {
    if (!isCoachOrAdmin) return;
    setDeletingTarget({ id, title: classTitle });
  };

  const confirmDeleteClass = () => {
    if (deletingTarget) {
      VelocityAPI.deleteClass(deletingTarget.id);
      loadSchedule();
      setToastMessage(`Timetable slot "${deletingTarget.title}" deleted successfully.`);
      setDeletingTarget(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-12 text-white font-sans border-b border-zinc-800 relative">
      {/* Dedicated Popup Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border-l-4 border-emerald-500 text-white px-5 py-3.5 shadow-2xl rounded-r-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wide">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-[#121214] text-white py-16 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3">
              LIVE WEEKLY TIMETABLE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              BxStrength CLASS SCHEDULE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-2 leading-relaxed">
              Book your periodized strength sessions, powerlifting slots, and metabolic conditioning classes.
            </p>
          </div>

          {/* Admin & Coach Management Direct Access */}
          {isCoachOrAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToAdmin}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-wider uppercase px-5 py-3.5 rounded-lg transition-all shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>MANAGE TIMETABLE (DASHBOARD)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800">
          
          {/* Day Tabs */}
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  selectedDay === day
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md'
                    : 'bg-[#121214] text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search class or coach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-16 bg-[#121214] border border-dashed border-zinc-800 rounded-xl space-y-2">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400 uppercase">
                No classes scheduled for {selectedDay}.
              </p>
            </div>
          ) : (
            filteredSchedule.map((slot) => {
              const spotsLeft = Math.max(0, slot.maxCapacity - slot.bookedCount);
              return (
                <div
                  key={slot.id}
                  className="bg-[#121214] hover:bg-[#18181b] border border-zinc-800 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 border-l-4 border-l-emerald-500 hover:border-zinc-700"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-grow items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1 rounded inline-block mb-1.5">
                        {slot.dayOfWeek}
                      </span>
                      <p className="text-xs font-black text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> {slot.startTime} - {slot.endTime}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">
                        {slot.title}
                      </h3>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {slot.room}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">HEAD COACH</span>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" /> {slot.trainerName}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block">AVAILABILITY</span>
                      <p className="text-xs font-extrabold text-white mt-0.5">
                        {spotsLeft > 0 ? (
                          <span className="text-emerald-400">{spotsLeft} SPOTS OPEN</span>
                        ) : (
                          <span className="text-red-400">CLASS FULL</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800">
                    {/* Admin / Coach Management Controls */}
                    {isCoachOrAdmin && (
                      <div className="flex items-center gap-2 mr-2">
                        <button
                          onClick={onNavigateToAdmin}
                          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700 cursor-pointer"
                          title="Edit Timetable Slot in Admin Dashboard"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrigger(slot.id, slot.title)}
                          className="p-2.5 bg-zinc-900 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-zinc-800 cursor-pointer"
                          title="Delete Timetable Slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenBookingWithDetails(slot.title, slot.trainerName)}
                      className="w-full md:w-auto bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest px-5 py-3 rounded-lg uppercase transition-all cursor-pointer whitespace-nowrap shadow-md"
                    >
                      BOOK SLOT
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dedicated Confirm Modal */}
      <ConfirmModal
        isOpen={!!deletingTarget}
        title="Delete Timetable Slot"
        message={`Are you sure you want to permanently delete class "${deletingTarget?.title}" from the live timetable?`}
        confirmText="DELETE TIMETABLE SLOT"
        cancelText="CANCEL"
        onConfirm={confirmDeleteClass}
        onCancel={() => setDeletingTarget(null)}
      />
    </div>
  );
};
