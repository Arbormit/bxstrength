import React, { useState, useEffect } from 'react';
import { User, BodyStat, Booking, WorkoutProgram, NutritionPlan, Announcement, Subscription, Enquiry } from '../../types';
import { VelocityAPI } from '../../services/api';
import { DashboardOverview } from './DashboardOverview';
import { ProfileManagement } from './ProfileManagement';
import { BodyStatsTracker } from './BodyStatsTracker';
import { WorkoutPlansView } from './WorkoutPlansView';
import { NutritionPlanView } from './NutritionPlanView';
import { MyBookingsView } from './MyBookingsView';
import { AchievementsView } from './AchievementsView';
import { SubscriptionView } from './SubscriptionView';
import { SupportTicketsView } from './SupportTicketsView';
import {
  LayoutDashboard, UserCheck, Scale, Dumbbell, Utensils,
  Calendar, Award, CreditCard, LogOut, CheckCircle2, X, LifeBuoy
} from 'lucide-react';

import { SkeletonLoader } from '../ui/SkeletonLoader';

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  user,
  onLogout,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Loaded data state
  const [bodyStats, setBodyStats] = useState<BodyStat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const loadDashboardData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const statsData = VelocityAPI.getBodyStats(user.id);
      setBodyStats(statsData);

      const bookingsData = VelocityAPI.getBookings(user.id);
      setBookings(bookingsData);

      const progData = VelocityAPI.getPrograms(user.id);
      setPrograms(progData);

      const nutData = VelocityAPI.getNutritionPlans(user.id);
      setNutritionPlans(nutData);

      const annData = VelocityAPI.getAnnouncements();
      setAnnouncements(annData);

      const subData = VelocityAPI.getSubscriptions();
      setSubscriptions(subData);

      const enqData = VelocityAPI.getEnquiries(user.email);
      setEnquiries(enqData);

      setIsLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'stats', label: 'BODY STATS & BMI', icon: Scale },
    { id: 'workouts', label: 'WORKOUT PLANS', icon: Dumbbell },
    { id: 'nutrition', label: 'NUTRITION DIET', icon: Utensils },
    { id: 'bookings', label: 'MY BOOKINGS', icon: Calendar },
    { id: 'achievements', label: 'ACHIEVEMENTS', icon: Award },
    { id: 'tickets', label: 'SUPPORT TICKETS', icon: LifeBuoy },
    { id: 'subscription', label: 'SUBSCRIPTION', icon: CreditCard },
    { id: 'profile', label: 'MY PROFILE', icon: UserCheck }
  ];

  const latestStat = bodyStats.length > 0 ? bodyStats[bodyStats.length - 1] : undefined;
  const nextBooking = bookings.find((b) => b.status === 'Confirmed');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] text-white border-l-4 border-white px-5 py-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wide">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Sidebar Top User Card */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700"
              />
              <div className="overflow-hidden">
                <h2 className="text-sm font-black uppercase text-white truncate">{user.name}</h2>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  BxStrength Client Athlete
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors text-left rounded-lg ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold tracking-wider py-2.5 px-4 uppercase text-center transition-colors block rounded-lg border border-zinc-800"
          >
            ← BACK TO PUBLIC SITE
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-red-950/40 hover:bg-red-900 text-red-300 text-xs font-bold tracking-wider py-2.5 px-4 uppercase text-center transition-colors flex items-center justify-center gap-2 border border-red-900/40 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <SkeletonLoader type="profile" />
            <SkeletonLoader type="kpi" count={4} />
            <SkeletonLoader type="card" count={2} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                user={user}
                latestStat={latestStat}
                nextBooking={nextBooking}
                activeProgram={programs.find(p => p.assignedToUserId === user.id) || programs[0]}
                nutritionPlan={nutritionPlans.find(n => n.assignedToUserId === user.id) || nutritionPlans[0]}
                announcements={announcements}
                enquiries={enquiries}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'stats' && (
              <BodyStatsTracker
                userId={user.id}
                stats={bodyStats}
                onStatsUpdated={loadDashboardData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'workouts' && (
              <WorkoutPlansView
                programs={[...programs].sort((a, b) => (a.assignedToUserId === user.id ? -1 : 1))}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionPlanView
                plans={[...nutritionPlans].sort((a, b) => (a.assignedToUserId === user.id ? -1 : 1))}
                onShowToast={showToast}
              />
            )}

        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onBookingsUpdated={loadDashboardData}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'achievements' && <AchievementsView />}

        {activeTab === 'tickets' && (
          <SupportTicketsView user={user} onShowToast={showToast} />
        )}

        {activeTab === 'subscription' && (
          <SubscriptionView
            subscription={subscriptions.find(s => s.userId === user.id || s.userEmail.toLowerCase() === user.email.toLowerCase())}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileManagement user={user} onShowToast={showToast} />
        )}
          </>
        )}
      </main>
    </div>
  );
};
