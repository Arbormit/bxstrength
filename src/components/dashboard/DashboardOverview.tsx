import React from 'react';
import { User, BodyStat, Booking, WorkoutProgram, NutritionPlan, Announcement, Enquiry } from '../../types';
import { Scale, Activity, Flame, Calendar, Dumbbell, Utensils, Award, ShieldAlert, CheckCircle2, ChevronRight, Zap, Mail } from 'lucide-react';

interface DashboardOverviewProps {
  user: User;
  latestStat?: BodyStat;
  nextBooking?: Booking;
  activeProgram?: WorkoutProgram;
  nutritionPlan?: NutritionPlan;
  announcements: Announcement[];
  enquiries?: Enquiry[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  latestStat,
  nextBooking,
  activeProgram,
  nutritionPlan,
  announcements,
  enquiries = [],
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 via-[#111111] to-black border border-gray-800 p-6 sm:p-8 rounded-none overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(#E52165_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#E52165] p-0.5 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-gray-900 rounded-full" title="Online & Verified"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#E52165] text-white">
                  MEMBER ATHLETE
                </span>
                {user.isVerified && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Profile Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                WELCOME BACK, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-xs text-gray-400 max-w-lg mt-0.5">
                {user.fitnessGoals ? `Goal: "${user.fitnessGoals}"` : 'Track your body transformation, workouts, and nutrition progress in real-time.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('stats')}
              className="bg-[#E52165] hover:bg-[#c41551] text-white text-xs font-black tracking-widest px-5 py-3 uppercase transition-all shadow-md shadow-pink-500/20 flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>LOG BODY WEIGHT</span>
            </button>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-black tracking-widest px-5 py-3 uppercase transition-all border border-gray-700 flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4 text-pink-400" />
              <span>VIEW WORKOUTS</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Weight */}
        <div className="bg-[#111111] border border-gray-800 p-5 relative overflow-hidden group hover:border-[#E52165]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Weight</span>
            <Scale className="w-5 h-5 text-[#E52165]" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {latestStat ? `${latestStat.weightKg} kg` : '80.0 kg'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Down 4.1 kg in last 30 days
          </p>
        </div>

        {/* Card 2: BMI Category */}
        <div className="bg-[#111111] border border-gray-800 p-5 relative overflow-hidden group hover:border-[#E52165]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Calculated BMI</span>
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {latestStat ? latestStat.bmi : '24.7'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
            Category: {latestStat ? latestStat.bmiCategory : 'Normal Weight'}
          </p>
        </div>

        {/* Card 3: Workout Streak */}
        <div className="bg-[#111111] border border-gray-800 p-5 relative overflow-hidden group hover:border-[#E52165]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Workout Streak</span>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            14 DAYS
          </div>
          <p className="text-[11px] text-orange-400 mt-1 font-semibold">
            Consistency level: Elite 🔥
          </p>
        </div>

        {/* Card 4: Daily Nutrition Target */}
        <div className="bg-[#111111] border border-gray-800 p-5 relative overflow-hidden group hover:border-[#E52165]/50 transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Calorie Target</span>
            <Utensils className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {nutritionPlan ? `${nutritionPlan.dailyCalories} kcal` : '2,400 kcal'}
          </div>
          <p className="text-[11px] text-blue-400 mt-1 font-semibold">
            Macro Target: {nutritionPlan ? `${nutritionPlan.targetProteinG}g Protein` : '190g Protein'}
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Next Class & Active Workout Program */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Class Booking Widget */}
          <div className="bg-[#111111] border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E52165]" />
                UPCOMING GYM SESSION
              </h3>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="text-xs text-[#E52165] font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>All Bookings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextBooking ? (
              <div className="bg-gray-900/90 border border-gray-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E52165]">
                    CONFIRMED CLASS BOOKING
                  </span>
                  <h4 className="text-lg font-bold text-white uppercase">{nextBooking.className}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Coach: <span className="text-gray-200">{nextBooking.trainerName}</span> • Date: <span className="text-gray-200">{nextBooking.date}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Time: <span className="text-[#E52165] font-bold">{nextBooking.timeSlot}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-black px-3 py-2 border border-gray-800 text-center">
                    <span className="block text-[9px] uppercase font-bold text-gray-400">BOOKING CODE</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{nextBooking.bookingCode}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-900/40 border border-dashed border-gray-800">
                <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-3">No upcoming class sessions booked yet.</p>
                <button
                  onClick={() => onNavigateTab('bookings')}
                  className="bg-[#E52165] text-white text-xs font-bold tracking-wider px-4 py-2 uppercase"
                >
                  BOOK A CLASS NOW
                </button>
              </div>
            )}
          </div>

          {/* Active Workout Program Widget */}
          <div className="bg-[#111111] border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#E52165]" />
                ASSIGNED TRAINING PROGRAM
              </h3>
              <button
                onClick={() => onNavigateTab('workouts')}
                className="text-xs text-[#E52165] font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>View Full Routine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeProgram ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white uppercase">{activeProgram.title}</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-800 text-pink-400 border border-gray-700">
                    {activeProgram.level} • {activeProgram.durationWeeks} WEEKS
                  </span>
                </div>
                <p className="text-xs text-gray-400">{activeProgram.description}</p>

                <div className="bg-gray-900 p-4 border border-gray-800 space-y-2.5">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Today's Exercises:
                  </div>
                  {activeProgram.exercises.slice(0, 3).map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-800/80 last:border-none">
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ex.isCompleted ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
                        {ex.name}
                      </span>
                      <span className="text-gray-400 font-mono">
                        {ex.sets} sets × {ex.reps} ({ex.targetMuscle})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400">
                No active custom workout routine assigned yet. Ask your coach or create one in the workouts tab.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Announcements & Achievements */}
        <div className="space-y-6">
          {/* Gym Announcements */}
          <div className="bg-[#111111] border border-gray-800 p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-[#E52165]" />
              CLUB ANNOUNCEMENTS
            </h3>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="bg-gray-900/80 border border-gray-800 p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#E52165] bg-pink-950/60 px-1.5 py-0.5 border border-pink-800/40">
                      {ann.priority} priority
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{ann.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-snug">{ann.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Badges Preview */}
          <div className="bg-[#111111] border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                ACHIEVEMENTS UNLOCKED
              </h3>
              <button
                onClick={() => onNavigateTab('achievements')}
                className="text-xs text-[#E52165] font-bold uppercase hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 border border-gray-800 p-3 text-center">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1 font-bold text-sm">
                  🏆
                </div>
                <span className="block text-[11px] font-bold text-white uppercase">First Workout</span>
                <span className="text-[9px] text-emerald-400">Unlocked</span>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-3 text-center">
                <div className="w-9 h-9 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-1 font-bold text-sm">
                  🔥
                </div>
                <span className="block text-[11px] font-bold text-white uppercase">14-Day Streak</span>
                <span className="text-[9px] text-emerald-400">Unlocked</span>
              </div>
            </div>
          </div>

          {/* My Inquiries & Live Support Ticket Status */}
          {enquiries.length > 0 && (
            <div className="bg-[#111111] border border-gray-800 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2 border-b border-gray-800 pb-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                MY INQUIRIES & SUPPORT TICKETS
              </h3>

              <div className="space-y-2.5">
                {enquiries.slice(0, 3).map((enq) => (
                  <div key={enq.id} className="bg-gray-900 border border-gray-800 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase text-[11px] truncate max-w-[150px]">{enq.subject}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                        enq.status === 'resolved'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : enq.status === 'in_progress'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-pink-950 text-pink-400 border-pink-800'
                      }`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] line-clamp-1">{enq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
