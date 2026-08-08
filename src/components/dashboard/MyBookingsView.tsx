import React from 'react';
import { Booking } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Calendar, CheckCircle2, XCircle, Clock, MapPin, Tag } from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  onBookingsUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onBookingsUpdated,
  onShowToast
}) => {
  const handleCancel = (id: string, code: string) => {
    try {
      VelocityAPI.cancelBooking(id);
      onShowToast(`Booking ${code} successfully cancelled.`);
      onBookingsUpdated();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-gray-800 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E52165]" />
            MY BOOKED CLASS SESSIONS & TIMETABLE
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            View all confirmed class reservations, booking codes, and attendance history.
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-[#111111] border border-gray-800 p-12 text-center text-xs text-gray-400">
          <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p>No class bookings found under your account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`bg-[#111111] border p-6 flex flex-col justify-between transition-all ${
                b.status === 'Confirmed'
                  ? 'border-gray-800 hover:border-[#E52165]/60'
                  : 'border-red-950/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 border border-emerald-800">
                    CODE: {b.bookingCode}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="text-lg font-black uppercase text-white mb-1">{b.className}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#E52165]" />
                  <span>Date: {b.date} • Time: {b.timeSlot}</span>
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                  <span>Trainer: <strong className="text-gray-200">{b.trainerName}</strong></span>
                </p>
              </div>

              {b.status === 'Confirmed' && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => handleCancel(b.id, b.bookingCode)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 uppercase flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
