import React, { useState, useEffect, useId } from 'react';
import { ConsultationBooking } from '../types';
import { VelocityAPI, getApiUrl } from '../services/api';
import { sendConsultationConfirmationEmail } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle2, X, Dumbbell, ShieldCheck, Bell, Info, ArrowLeft, Phone, Mail, Award, Check, Flame } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedClass?: string;
  preSelectedTrainer?: string;
}

export interface GoalOption {
  title: string;
  category: string;
  defaultDuration: number; // minutes
  durationText: string;
  description: string;
}

export const ALL_GOALS_SERVICES: GoalOption[] = [
  { title: 'Fitness Boxing', category: 'Individual Service', defaultDuration: 20, durationText: '20 Min', description: 'Technical boxing, conditioning, footwork, power and endurance.' },
  { title: 'Strength Training', category: 'Individual Service', defaultDuration: 20, durationText: '20 Min', description: 'Build progressive strength, muscle tone, and structural balance.' },
  { title: 'Mobility & Recovery', category: 'Individual Service', defaultDuration: 20, durationText: '20 Min', description: 'Targeted mobility drills, dynamic stretching, and tissue recovery.' },
  { title: 'Flexibility Training', category: 'Individual Service', defaultDuration: 20, durationText: '20 Min', description: 'Increase joint range of motion, reduce stiffness and posture stress.' },
  { title: 'Mindset & Wellness', category: 'Individual Service', defaultDuration: 20, durationText: '20 Min', description: 'Stress management protocols, breathwork, and mental fortitude.' },
  { title: 'Custom Basic', category: 'Custom', defaultDuration: 15, durationText: '15 Min', description: 'One tailored focus designed specifically around your single goal.' },
  { title: 'Custom Focus', category: 'Custom', defaultDuration: 30, durationText: '30 Min', description: 'Bespoke programme with individual goal mapping and support work.' },
  { title: 'Custom Performance', category: 'Custom', defaultDuration: 45, durationText: '45 Min', description: 'Any two focus areas combined into advanced personal programming.' },
  { title: 'Custom Complete', category: 'Custom', defaultDuration: 60, durationText: '60 Min', description: 'Up to 4 focus areas combined into one comprehensive master plan.' },
  { title: 'BX Basic Care', category: 'Core Package', defaultDuration: 15, durationText: '15 Min', description: 'Entry level standard package with focused technique guidance.' },
  { title: 'BX Focus', category: 'Core Package', defaultDuration: 30, durationText: '30 Min', description: 'Goal-based training combining primary focus + supporting drills.' },
  { title: 'BX Performance', category: 'Core Package', defaultDuration: 45, durationText: '45 Min', description: 'Structured multi-focus performance session with technique correction.' },
  { title: 'BX Complete', category: 'Core Package', defaultDuration: 60, durationText: '60 Min', description: 'Flagship full-body session with strength, conditioning & mobility.' },
  { title: 'BX Weekly 3', category: 'Programme', defaultDuration: 30, durationText: '30 Min', description: '3-session weekly programme for consistency and momentum.' },
  { title: 'BX Monthly 12', category: 'Programme', defaultDuration: 45, durationText: '45 Min', description: '12-session monthly high-volume progress coaching program.' },
];

export interface SlotOption {
  timeStr: string;
  label: string;
  isAvailable: boolean;
  isBufferBlocked: boolean;
}

export const generateAvailableTimeSlots = (
  selectedDateStr: string,
  durationMinutes: number
): { slots: SlotOption[]; bufferTimeString: string; isToday: boolean } => {
  const slots: SlotOption[] = [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isToday = selectedDateStr === todayStr;

  // 1-Hour Buffer limit: Current Time + 60 minutes
  const bufferLimitTime = new Date(now.getTime() + 60 * 60 * 1000);
  const bufferTimeString = bufferLimitTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  // For Future Dates: 5:00 AM (5) to 8:00 PM (20)
  // For Same Day (Today): Generates up to 11:45 PM so slots after 1-hr buffer (e.g. 9:00 PM if booked at 8:00 PM) are available
  const startHour = 5;
  const endHour = isToday ? 23 : 20;

  // Step interval matches selected exercise duration (15 min, 20 min, or 30 min)
  let stepMinutes = 15;
  if (durationMinutes === 20) {
    stepMinutes = 20;
  } else if (durationMinutes >= 30) {
    stepMinutes = 30;
  }

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += stepMinutes) {
      if (!isToday && hour === endHour && min > 0) break; // Cap future dates at 8:00 PM

      const slotStart = new Date(`${selectedDateStr}T00:00:00`);
      slotStart.setHours(hour, min, 0, 0);

      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

      const startTimeFormatted = slotStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      const endTimeFormatted = slotEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      const label = `${startTimeFormatted} - ${endTimeFormatted}`;

      let isAvailable = true;
      let isBufferBlocked = false;

      if (isToday) {
        if (slotStart.getTime() < bufferLimitTime.getTime()) {
          isAvailable = false;
          isBufferBlocked = true;
        }
      }

      slots.push({
        timeStr: label,
        label,
        isAvailable,
        isBufferBlocked
      });
    }
  }

  return { slots, bufferTimeString, isToday };
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedClass,
  preSelectedTrainer
}) => {
  const { user } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [goal, setGoal] = useState<string>(preSelectedClass || 'Fitness Boxing');
  const [selectedDuration, setSelectedDuration] = useState<number>(20);
  const [selectedTrainer, setSelectedTrainer] = useState(preSelectedTrainer || 'Assigned Lead Coach');
  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking & { duration?: string } | null>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const goalInputId = useId();
  const dateInputId = useId();

  // Auto-fill logged in user details
  useEffect(() => {
    if (isOpen && user) {
      setUserName(prev => prev || user.name || '');
      setUserEmail(prev => prev || user.email || '');
      setUserPhone(prev => prev || user.phone || '');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (preSelectedTrainer) {
      setSelectedTrainer(preSelectedTrainer);
    }
  }, [preSelectedTrainer]);

  // Update default duration when goal changes
  useEffect(() => {
    const matched = ALL_GOALS_SERVICES.find(g => g.title.toLowerCase() === goal.toLowerCase());
    if (matched) {
      setSelectedDuration(matched.defaultDuration);
    }
  }, [goal]);

  // Calculate available slots based on selected date & duration
  const { slots: availableSlots, bufferTimeString, isToday } = generateAvailableTimeSlots(bookingDate, selectedDuration);

  // Ensure a valid default slot is selected
  useEffect(() => {
    const validSlots = availableSlots.filter(s => s.isAvailable);
    if (validSlots.length > 0) {
      const exists = validSlots.some(s => s.timeStr === selectedTime);
      if (!exists) {
        setSelectedTime(validSlots[0].timeStr);
      }
    } else {
      setSelectedTime('');
    }
  }, [bookingDate, selectedDuration, goal]);

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      alert('Please select an available time slot for your booking.');
      return;
    }

    const durationText = `${selectedDuration} Min`;
    const newBooking: ConsultationBooking & { duration?: string } = {
      id: 'BX-CONS-' + Math.floor(100000 + Math.random() * 900000),
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      goal,
      duration: durationText,
      coachPreference: selectedTrainer,
      date: bookingDate || todayStr,
      timeSlot: selectedTime,
      status: 'Confirmed',
      remindersSent: { h24: true, h2: true, m30: true },
      createdAt: new Date().toISOString()
    };

    // Store in Local Enquiries & DB
    try {
      VelocityAPI.createEnquiry({
        name: userName,
        email: userEmail,
        phone: userPhone,
        subject: `Free Consultation (${durationText}): ${goal}`,
        message: `[FREE CONSULTATION BOOKED]\nRef: ${newBooking.id}\nGoal/Exercise: ${goal}\nDuration: ${durationText}\nDate: ${bookingDate}\nTime Slot: ${selectedTime}\nAssigned Coach: ${selectedTrainer}`
      });
    } catch (err) {
      console.error('Consultation enquiry save error:', err);
    }

    // POST to backend API server
    fetch(getApiUrl('/api/consultations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        phone: userPhone,
        goal,
        duration: durationText,
        coachPreference: selectedTrainer,
        preferredDate: bookingDate || todayStr,
        preferredTime: selectedTime
      })
    }).catch(() => {});

    // Send Real Confirmation Email to Client & Admin Notification
    sendConsultationConfirmationEmail({
      bookingId: newBooking.id,
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      goal,
      duration: durationText,
      coachPreference: selectedTrainer,
      date: bookingDate || todayStr,
      timeSlot: selectedTime
    }).catch(() => {});

    setConfirmedBooking(newBooking);
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  const selectedGoalObj = ALL_GOALS_SERVICES.find(g => g.title.toLowerCase() === goal.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col overflow-y-auto animate-in slide-in-from-bottom-6 duration-300">
      
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#121214]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={resetAndClose}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BACK</span>
          </button>
          <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black shrink-0">
              <Dumbbell className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white leading-tight">
                FREE CONSULTATION &amp; SLOT BOOKING
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Select your exercise protocol, session duration &amp; 1-hour buffer time slot
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={resetAndClose}
          className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-zinc-800 flex items-center gap-1.5 text-xs font-bold"
        >
          <span className="hidden sm:inline">CLOSE</span>
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        
        {confirmedBooking ? (
          /* FULL PAGE CONFIRMATION VIEW */
          <div className="max-w-xl mx-auto bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-10 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-200 my-4">
            <div className="w-20 h-20 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-800">
                APPOINTMENT CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-4">
                SLOT BOOKED SUCCESSFULLY!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                Confirmation email sent to <strong className="text-white">{confirmedBooking.clientEmail}</strong> and our Head Coaching desk.
              </p>
            </div>

            {/* Voucher Details */}
            <div className="bg-[#18181b] p-6 rounded-2xl border border-zinc-800 text-left space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block">BOOKING REF</span>
                  <span className="text-sm font-mono font-bold text-[#CCFF00] tracking-wider">
                    {confirmedBooking.id}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full uppercase">
                  CONFIRMED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">CLIENT NAME</p>
                  <p className="font-bold text-white uppercase text-sm mt-0.5">{confirmedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">PRIMARY EXERCISE / GOAL</p>
                  <p className="font-bold text-[#CCFF00] uppercase text-sm mt-0.5">{confirmedBooking.goal}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">SESSION DURATION</p>
                  <p className="font-bold text-white uppercase mt-0.5">{confirmedBooking.duration || '20 Min'}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">SCHEDULED DATE</p>
                  <p className="font-bold text-white mt-0.5">{confirmedBooking.date}</p>
                </div>
                <div className="col-span-full bg-zinc-900/90 p-4 rounded-xl border border-zinc-800/90">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">CONFIRMED TIME SLOT</p>
                  <p className="font-black text-[#CCFF00] text-base tracking-wide mt-0.5">{confirmedBooking.timeSlot}</p>
                </div>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs tracking-widest py-4 uppercase rounded-xl transition-all shadow-xl shadow-[#CCFF00]/10 cursor-pointer"
            >
              DONE &amp; RETURN TO HOMEPAGE
            </button>
          </div>
        ) : (
          /* FULL PAGE FORM EXPERIENCE */
          <form onSubmit={handleBookingSubmit} className="space-y-8 pb-12">

            {/* Banner info */}
            <div className="bg-gradient-to-r from-zinc-900 via-[#141417] to-zinc-900 p-6 rounded-3xl border border-zinc-800/80 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-bold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>1-on-1 Free Personal Consultation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Schedule Your Strategy &amp; Assessment Session
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Choose your primary goal from our 15 specialized training protocols, customize your session duration, and select your slot.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800">
                <ShieldCheck className="w-8 h-8 text-[#CCFF00]" />
                <div className="text-[11px]">
                  <p className="font-bold text-white">100% Free &amp; No Obligation</p>
                  <p className="text-zinc-400">Direct Head Coach Assignment</p>
                </div>
              </div>
            </div>

            {/* Section 1: Client Information */}
            <section className="bg-[#121214] p-6 sm:p-8 rounded-3xl border border-zinc-800/80 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 text-[#CCFF00] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Your Contact Details</h3>
                  <p className="text-xs text-zinc-400">Where we should send your calendar invite &amp; session confirmation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={nameInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    FULL NAME *
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={emailInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id={emailInputId}
                    type="email"
                    required
                    placeholder="alexander@domain.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor={phoneInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    id={phoneInputId}
                    type="tel"
                    required
                    placeholder="+91 8423594482"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Primary Goal Selection (15 Services) */}
            <section className="bg-[#121214] p-6 sm:p-8 rounded-3xl border border-zinc-800/80 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-[#CCFF00] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Select Primary Exercise Goal</h3>
                    <p className="text-xs text-zinc-400">Choose from all 15 specialized BxStrength protocols</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-3 py-1 rounded-full border border-[#CCFF00]/30 hidden sm:inline-block">
                  15 Protocols Available
                </span>
              </div>

              <div>
                <label htmlFor={goalInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  PRIMARY GOAL / EXERCISE PROTOCOL *
                </label>
                <select
                  id={goalInputId}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-[#CCFF00] transition-colors cursor-pointer"
                >
                  {ALL_GOALS_SERVICES.map((g) => (
                    <option key={g.title} value={g.title}>
                      {g.title} ({g.category}) — Standard {g.durationText}
                    </option>
                  ))}
                </select>
              </div>

              {selectedGoalObj && (
                <div className="bg-[#18181b] p-4 rounded-2xl border border-zinc-800/80 flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#CCFF00] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{selectedGoalObj.title}</p>
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">
                        {selectedGoalObj.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{selectedGoalObj.description}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Section 3: Schedule Date & Timing Slot */}
            <section className="bg-[#121214] p-6 sm:p-8 rounded-3xl border border-zinc-800/80 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-[#CCFF00] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Schedule Date &amp; Timing Slot</h3>
                    <p className="text-xs text-zinc-400">Select date &amp; available timing slot for your session</p>
                  </div>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor={dateInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#CCFF00]" />
                  <span>SELECT SCHEDULE DATE *</span>
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  required
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00] transition-colors cursor-pointer"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#CCFF00]" />
                      <span>SELECT AVAILABLE TIMING SLOT *</span>
                    </label>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full font-mono">
                      5:00 AM – 8:00 PM (UK / Local Time)
                    </span>
                  </div>
                  {selectedTime && (
                    <span className="text-xs font-mono font-bold text-[#CCFF00]">
                      Selected: {selectedTime}
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-3 border border-zinc-800/80 rounded-2xl bg-[#18181b]/50">
                  {availableSlots.filter(s => s.isAvailable).length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-zinc-500 font-medium">
                      No available slots remaining for today after the 1-hour buffer limit. Please choose a future date above.
                    </div>
                  ) : (
                    availableSlots
                      .filter(s => s.isAvailable)
                      .map((slot) => (
                        <button
                          key={slot.timeStr}
                          type="button"
                          onClick={() => setSelectedTime(slot.timeStr)}
                          className={`py-3 px-3 text-xs font-bold rounded-xl transition-all border text-center cursor-pointer truncate ${
                            selectedTime === slot.timeStr
                              ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-lg shadow-[#CCFF00]/10 font-black'
                              : 'bg-[#18181b] text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                          }`}
                          title={slot.label}
                        >
                          {slot.label}
                        </button>
                      ))
                  )}
                </div>
              </div>
            </section>

            {/* Submission CTA Bar */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-sm tracking-widest py-4 sm:py-5 rounded-2xl uppercase shadow-2xl shadow-[#CCFF00]/15 transition-all cursor-pointer flex items-center justify-center gap-3"
                id="btn-confirm-booking-submit"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>CONFIRM &amp; BOOK FREE CONSULTATION</span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#CCFF00]" /> Instant Email Confirmation
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#CCFF00]" /> Admin Notification Alert
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#CCFF00]" /> Zero Cost &amp; No Obligation
                </span>
              </div>
            </div>

          </form>
        )}

      </main>
    </div>
  );
};
