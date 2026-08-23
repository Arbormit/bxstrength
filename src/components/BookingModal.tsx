import React, { useState, useEffect, useId } from 'react';
import { ConsultationBooking } from '../types';
import { VelocityAPI } from '../services/api';
import { sendConsultationConfirmationEmail } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle2, X, Dumbbell, ShieldCheck, Bell, UserCheck } from 'lucide-react';

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
  const { user } = useAuth();

  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [goal, setGoal] = useState('Strength & Body Recomposition');
  const [selectedTrainer, setSelectedTrainer] = useState(preSelectedTrainer || 'Assigned Lead Coach');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('Flexible Slot (Coach Will Confirm)');
  
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const goalInputId = useId();

  // Auto-fill logged in user details when modal opens, preserving typed input
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

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];
    const newBooking: ConsultationBooking = {
      id: 'BX-CONS-' + Math.floor(100000 + Math.random() * 900000),
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      goal,
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
        subject: `15-Min Session: ${selectedTrainer}`,
        message: `[15-MIN SESSION BOOKED]\nRef: ${newBooking.id}\nGoal: ${goal}\nAssigned Coach: ${selectedTrainer}`
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
        preferredDate: bookingDate || todayStr,
        preferredTime: selectedTime
      })
    }).catch(() => {});

    // Send Real Confirmation Email to Client
    sendConsultationConfirmationEmail({
      bookingId: newBooking.id,
      clientName: userName,
      clientEmail: userEmail,
      clientPhone: userPhone,
      goal,
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
              <h3 className="text-sm font-black uppercase tracking-wider text-white">BxStrength 15-Min Session</h3>
              <p className="text-[11px] text-zinc-400">15-Minute 1-on-1 Strategy Session (No Obligation)</p>
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
                Confirmation sent to <strong>{confirmedBooking.clientEmail}</strong>. Our coach team will contact you shortly.
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
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">SESSION TYPE</p>
                  <p className="font-bold text-white uppercase">15-Min Strategy Session</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold">STATUS</p>
                  <p className="font-bold text-emerald-400">Confirmed / Scheduled</p>
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
                  placeholder="+91 1234567890"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest py-3.5 rounded-lg uppercase shadow-xl transition-all cursor-pointer"
                id="btn-confirm-booking-submit"
              >
                BOOK 15-MIN SESSION
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

