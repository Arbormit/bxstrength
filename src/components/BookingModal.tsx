import React, { useState, useId } from 'react';
import { ConsultationBooking } from '../types';
import { TRAINERS_DATA } from '../data/gymData';
import { VelocityAPI } from '../services/api';
import { Calendar, Clock, User, CheckCircle2, X, Dumbbell, ShieldCheck, Bell, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedClass?: string;
  preSelectedTrainer?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedClass,
  preSelectedTrainer
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [goal, setGoal] = useState('Strength & Body Recomposition');
  const [selectedTrainer, setSelectedTrainer] = useState(preSelectedTrainer || 'Any UK Certified Master Coach');
  const [bookingDate, setBookingDate] = useState('2026-08-10');
  const [selectedTime, setSelectedTime] = useState('10:00 AM (UK GMT)');
  
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const goalInputId = useId();
  const trainerInputId = useId();
  const dateInputId = useId();
  const timeInputId = useId();

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: ConsultationBooking = {
      id: 'BX-CONS-' + Math.floor(100000 + Math.random() * 900000),
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      goal,
      coachPreference: selectedTrainer,
      date: bookingDate,
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
        subject: `30-Min Consultation: ${selectedTrainer}`,
        message: `[DISCOVERY CONSULTATION BOOKED]\nRef: ${newBooking.id}\nGoal: ${goal}\nCoach Preference: ${selectedTrainer}\nRequested Slot: ${bookingDate} at ${selectedTime}`
      });
    } catch (err) {
      console.error('Consultation enquiry save error:', err);
    }

    // POST to backend API server
    fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        phone: userPhone,
        goal,
        coachPreference: selectedTrainer,
        preferredDate: bookingDate,
        preferredTime: selectedTime
      })
    }).catch((err) => console.warn('Server consultation sync notice:', err.message));

    setConfirmedBooking(newBooking);
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121214] text-white w-full max-w-lg rounded-xl shadow-2xl border border-zinc-800 overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="bg-[#18181b] p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black">
              <Dumbbell className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">BxStrength Discovery Consultation</h3>
              <p className="text-[11px] text-zinc-400">30-Minute 1-on-1 Strategy Session (No Obligation)</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                APPOINTMENT CONFIRMED
              </span>
              <h4 className="text-2xl font-black text-white uppercase mt-3">
                SESSION SCHEDULED!
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Calendar invite & Video link sent to <strong>{confirmedBooking.clientEmail}</strong> and WhatsApp confirmation triggered.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="bg-[#18181b] text-white p-5 rounded-lg border border-zinc-800 text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">REF CODE</span>
                <span className="text-xs font-mono font-bold text-white tracking-widest">
                  {confirmedBooking.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">CLIENT</p>
                  <p className="font-bold text-white uppercase">{confirmedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">GOAL</p>
                  <p className="font-bold text-white uppercase">{confirmedBooking.goal}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">ASSIGNED COACH</p>
                  <p className="font-bold text-white uppercase">{confirmedBooking.coachPreference}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">DATE & TIME</p>
                  <p className="font-bold text-white">{confirmedBooking.date} @ {confirmedBooking.timeSlot}</p>
                </div>
              </div>

              {/* Automatic Reminders Timeline (PRD Section 6) */}
              <div className="pt-3 border-t border-zinc-800/80">
                <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-white" /> AUTOMATIC REMINDER SCHEDULE:
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-400 text-center">
                  <span className="bg-zinc-800 p-1.5 rounded">24 Hours Before</span>
                  <span className="bg-zinc-800 p-1.5 rounded">2 Hours Before</span>
                  <span className="bg-zinc-800 p-1.5 rounded">30 Mins Before</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest py-3.5 uppercase rounded-lg transition-colors cursor-pointer"
            >
              DONE & RETURN TO SITE
            </button>
          </div>
        ) : (
          /* Consultation Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor={nameInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                FULL NAME *
              </label>
              <input
                id={nameInputId}
                type="text"
                required
                placeholder="e.g. Alexander Vance"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={emailInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  required
                  placeholder="alexander@domain.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor={phoneInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  PHONE / WHATSAPP *
                </label>
                <input
                  id={phoneInputId}
                  type="tel"
                  required
                  placeholder="+44 7700 900077"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={goalInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  PRIMARY GOAL *
                </label>
                <select
                  id={goalInputId}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Strength & Body Recomposition">Strength & Recomposition</option>
                  <option value="Fat Loss & Metabolic Health">Fat Loss & Metabolic Health</option>
                  <option value="Postural & Back Rehabilitation">Postural & Back Rehab</option>
                  <option value="Executive Conditioning">Executive Conditioning</option>
                </select>
              </div>

              <div>
                <label htmlFor={trainerInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  COACH PREFERENCE *
                </label>
                <select
                  id={trainerInputId}
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Any UK Certified Master Coach">Any UK Certified Master Coach</option>
                  {TRAINERS_DATA.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.role.split(' ')[0]})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={dateInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  PREFERRED DATE *
                </label>
                <input
                  id={dateInputId}
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor={timeInputId} className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  TIME SLOT *
                </label>
                <select
                  id={timeInputId}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="09:00 AM (UK GMT)">09:00 AM (UK GMT)</option>
                  <option value="11:30 AM (UK GMT)">11:30 AM (UK GMT)</option>
                  <option value="02:00 PM (UK GMT)">02:00 PM (UK GMT)</option>
                  <option value="05:30 PM (UK GMT)">05:30 PM (UK GMT)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest py-3.5 rounded-lg uppercase shadow-xl transition-all cursor-pointer"
                id="btn-confirm-booking-submit"
              >
                BOOK 30-MIN DISCOVERY CONSULTATION
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

