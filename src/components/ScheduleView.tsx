import React, { useState, useEffect } from 'react';
import { SCHEDULE_DATA, TRAINERS_DATA } from '../data/gymData';
import { ClassSchedule, Booking } from '../types';
import { VelocityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal } from './ui/ConfirmModal';
import { Calendar, Clock, User, MapPin, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X, Globe, Sparkles, Check, AlertCircle } from 'lucide-react';

interface ScheduleViewProps {
  onOpenBookingWithDetails: (className: string, trainerName: string) => void;
  onNavigateToAdmin?: () => void;
}

interface CoachScheduleProfile {
  id: string;
  name: string;
  role: string;
  category: string;
  location: string;
  workingHours: string;
  startHour: number; // 24-hour format
  endHour: number;   // 24-hour format
  daysAvailable: string[];
  timeZone: string;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  onOpenBookingWithDetails,
  onNavigateToAdmin
}) => {
  const { user, isAuthenticated } = useAuth();
  const isCoachOrAdmin = isAuthenticated && user && (user.role === 'admin' || user.role === 'coach');

  const [viewMode, setViewMode] = useState<'coach' | 'class'>('coach');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedCoachId, setSelectedCoachId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classesList, setClassesList] = useState<ClassSchedule[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Notification toast and confirmation modal state
  const [deletingTarget, setDeletingTarget] = useState<{ id: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const coachesProfiles: CoachScheduleProfile[] = [
    {
      id: 'head-coach',
      name: 'Head Coach Shaban Faridi',
      role: 'Master Boxing & Physiotherapy Specialist',
      category: 'Boxing Technique & Physical Rehab',
      location: 'London & Online Session',
      workingHours: '08:00 AM - 04:00 PM UK BST',
      startHour: 8,
      endHour: 16,
      daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeZone: 'UK BST / GMT'
    },
    {
      id: 'sadeem',
      name: 'Trainer Sadeem',
      role: 'Senior Strength & Conditioning Coach',
      category: 'Strength Training & Body Recomposition',
      location: 'Delhi & Online Session',
      workingHours: '10:00 AM - 06:00 PM UK BST',
      startHour: 10,
      endHour: 18,
      daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeZone: 'UK BST / GMT'
    },
    {
      id: 'moheeb-khan',
      name: 'Trainer Moheeb Khan',
      role: 'Endurance & Tactical Metabolic Specialist',
      category: 'Tactical Cardio & Combat Conditioning',
      location: 'Online Session',
      workingHours: '01:00 PM - 09:00 PM UK BST',
      startHour: 13,
      endHour: 21,
      daysAvailable: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeZone: 'UK BST / GMT'
    }
  ];

  const loadScheduleAndBookings = () => {
    const apiClasses = VelocityAPI.getClasses();
    if (apiClasses && apiClasses.length > 0) {
      setClassesList(apiClasses);
    } else {
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

    // Load real-time existing bookings to evaluate dynamic availability
    const bookings = VelocityAPI.getBookings();
    setExistingBookings(bookings || []);
  };

  useEffect(() => {
    loadScheduleAndBookings();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper to format 24h hour number to 12h time string
  const formatHourString = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    const formattedHour = h12 < 10 ? `0${h12}` : `${h12}`;
    return `${formattedHour}:00 ${period}`;
  };

  // Generate dynamic 1-hour slots for a coach within their configured working hours
  const generateCoachDaySlots = (coach: CoachScheduleProfile, day: string) => {
    if (!coach.daysAvailable.includes(day)) {
      return [];
    }

    const slots = [];
    for (let h = coach.startHour; h < coach.endHour; h++) {
      const startTime = formatHourString(h);
      const endTime = formatHourString(h + 1);
      const slotTimeLabel = `${startTime} - ${endTime}`;

      // Check if slot is occupied by an existing booking
      const isOccupied = existingBookings.some(b => {
        const matchesCoach = b.trainerName?.toLowerCase().includes(coach.name.toLowerCase()) || 
                             coach.name.toLowerCase().includes(b.trainerName?.toLowerCase() || '');
        const matchesDateOrDay = b.date === day || b.timeSlot === slotTimeLabel;
        const isActiveStatus = b.status === 'Confirmed';
        return matchesCoach && matchesDateOrDay && isActiveStatus;
      });

      slots.push({
        id: `${coach.id}-${day}-${h}`,
        coachName: coach.name,
        category: coach.category,
        location: coach.location,
        day,
        startTime,
        endTime,
        slotTimeLabel,
        isOccupied,
        timeZone: coach.timeZone
      });
    }

    return slots;
  };

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
      loadScheduleAndBookings();
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
      <div className="bg-[#121214] text-white py-14 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#CCFF00] uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-sm">
              REAL-TIME COACH TIMETABLE &amp; AVAILABILITY
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              COACH AVAILABILITY SYSTEM
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-2 leading-relaxed">
              Explore dynamic, real-time booking availability derived from each coach’s verified working hours and active bookings.
            </p>
          </div>

          {/* Admin & Coach Management Direct Access */}
          {isCoachOrAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToAdmin}
                className="bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black tracking-wider uppercase px-5 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>MANAGE TIMETABLE (ADMIN)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TIME ZONE NOTICE BANNER */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-[#CCFF00]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white">
                ALL SESSION TIMES ARE DISPLAYED IN UK BST / GMT
              </p>
              <p className="text-[11px] text-zinc-400 font-medium">
                Serving athletes in United Kingdom, India, Europe &amp; Global Remote Locations.
              </p>
            </div>
          </div>

          {/* VIEW MODE TOGGLE (COACH AVAILABILITY VS CLASS SCHEDULE) */}
          <div className="flex items-center bg-black/90 p-1 rounded-xl border border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('coach')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                viewMode === 'coach' ? 'bg-[#CCFF00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              COACH-WISE AVAILABILITY
            </button>
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                viewMode === 'class' ? 'bg-[#CCFF00] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              WEEKLY CLASS TIMETABLE
            </button>
          </div>
        </div>

        {/* DAY TABS & COACH FILTERING CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          
          {/* Day Selector */}
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#CCFF00] text-black shadow-md font-extrabold'
                    : 'bg-[#121214] text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Coach Filter dropdown in Coach Mode */}
          {viewMode === 'coach' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">Coach:</span>
              <select
                value={selectedCoachId}
                onChange={(e) => setSelectedCoachId(e.target.value)}
                className="bg-[#121214] border border-zinc-800 text-xs font-bold text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#CCFF00]"
              >
                <option value="all">ALL COACHES</option>
                {coachesProfiles.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* VIEW MODE 1: DYNAMIC COACH-WISE AVAILABILITY TIMETABLE */}
        {viewMode === 'coach' && (
          <div className="space-y-8">
            {coachesProfiles
              .filter(c => selectedCoachId === 'all' || c.id === selectedCoachId)
              .map((coach) => {
                const slots = generateCoachDaySlots(coach, selectedDay);
                const isDayOff = !coach.daysAvailable.includes(selectedDay);

                return (
                  <div 
                    key={coach.id}
                    className="bg-[#121214] border border-zinc-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden"
                  >
                    {/* Coach Header & Profile Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                            {coach.name}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-400 font-semibold">{coach.role}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="bg-[#18181b] border border-zinc-700 text-[#CCFF00] font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#CCFF00]" /> {coach.workingHours}
                        </span>
                        <span className="bg-[#18181b] border border-zinc-700 text-zinc-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {coach.location}
                        </span>
                        <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold px-3 py-1.5 rounded-lg">
                          Category: {coach.category}
                        </span>
                      </div>
                    </div>

                    {/* Slots Grid */}
                    {isDayOff ? (
                      <div className="text-center py-10 bg-[#18181b]/60 border border-dashed border-zinc-800 rounded-2xl space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                        <p className="text-xs font-bold text-zinc-400 uppercase">
                          {coach.name} is off duty on {selectedDay}s.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                        {slots.map((slot) => {
                          return (
                            <div
                              key={slot.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                                slot.isOccupied
                                  ? 'bg-red-950/20 border-red-900/40 opacity-75'
                                  : 'bg-[#18181b] hover:bg-zinc-800 border-zinc-800 hover:border-[#CCFF00]/60'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                                  {slot.timeZone}
                                </span>
                                <p className="text-xs sm:text-sm font-black font-mono text-white flex items-center gap-1.5">
                                  <Clock className={`w-3.5 h-3.5 ${slot.isOccupied ? 'text-red-400' : 'text-[#CCFF00]'}`} />
                                  <span>{slot.slotTimeLabel}</span>
                                </p>
                              </div>

                              <div>
                                {slot.isOccupied ? (
                                  <div className="w-full bg-red-900/30 text-red-400 border border-red-800/40 text-[10px] font-black uppercase tracking-wider py-2 rounded-xl text-center">
                                    SLOT BOOKED
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => onOpenBookingWithDetails(coach.category, coach.name)}
                                    className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                                  >
                                    BOOK SLOT
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
          </div>
        )}

        {/* VIEW MODE 2: WEEKLY CLASS TIMETABLE */}
        {viewMode === 'class' && (
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
                    className="bg-[#121214] hover:bg-[#18181b] border border-zinc-800 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 border-l-4 border-l-[#CCFF00] hover:border-zinc-700"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-grow items-center">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1 rounded inline-block mb-1.5">
                          {slot.dayOfWeek}
                        </span>
                        <p className="text-xs font-black text-white flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#CCFF00]" /> {slot.startTime} - {slot.endTime}
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
                          <User className="w-3.5 h-3.5 text-[#CCFF00]" /> {slot.trainerName}
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
                        className="w-full md:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black tracking-widest px-5 py-3 rounded-xl uppercase transition-all cursor-pointer whitespace-nowrap shadow-md"
                      >
                        BOOK SLOT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

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
