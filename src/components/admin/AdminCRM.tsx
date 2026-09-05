import React, { useState, useEffect } from 'react';
import { User, UserRole, ClassSchedule, Subscription, AuditLog, Enquiry, WorkoutProgram, NutritionPlan, Announcement } from '../../types';
import { VelocityAPI } from '../../services/api';
import { CRMOverview } from './CRMOverview';
import { UserManagement } from './UserManagement';
import { ClassScheduleManager } from './ClassScheduleManager';
import { ProgramManager } from './ProgramManager';
import { NutritionManager } from './NutritionManager';
import { FinancialSubscriptions } from './FinancialSubscriptions';
import { EnquiriesManager } from './EnquiriesManager';
import { AnnouncementsManager } from './AnnouncementsManager';
import { AuditLogsAndSettings } from './AuditLogsAndSettings';
import { TicketManagement } from './TicketManagement';
import { CoachesManager } from './CoachesManager';
import {
  LayoutDashboard, Users, Calendar, Dumbbell, Utensils,
  CreditCard, Mail, ShieldAlert, ShieldCheck, LogOut, CheckCircle2, X, LifeBuoy, UserCheck
} from 'lucide-react';

import { SkeletonLoader } from '../ui/SkeletonLoader';

interface AdminCRMProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminCRM: React.FC<AdminCRMProps> = ({ user, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Loaded data state
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const rawUsers = await res.json();
        if (Array.isArray(rawUsers)) {
          const formattedUsers: User[] = rawUsers.map((u: any) => {
            let statements: any[] = [];
            if (u.billing_statements) {
              if (Array.isArray(u.billing_statements)) statements = u.billing_statements;
              else if (typeof u.billing_statements === 'string') {
                try { statements = JSON.parse(u.billing_statements); } catch { statements = []; }
              }
            } else if (u.billingStatements) {
              statements = Array.isArray(u.billingStatements) ? u.billingStatements : [];
            }

            return {
              id: String(u.id || `user-${Date.now()}`),
              name: String(u.name || u.email || 'User'),
              email: String(u.email || ''),
              role: (u.role || 'client') as UserRole,
              coachPosition: u.coach_position || u.coachPosition || (u.role === 'coach' ? 'Senior Coach' : undefined),
              phone: u.phone || '',
              age: u.age || 25,
              heightCm: (u.height_cm !== undefined && u.height_cm !== null && !isNaN(Number(u.height_cm))) ? Number(u.height_cm) : (u.heightCm || 175),
              gender: u.gender || 'Other',
              subscriptionTier: u.subscription_tier || u.subscriptionTier || 'Normal User',
              billingStatements: statements,
              avatarUrl: u.avatar_url || u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || u.email || 'User')}`,
              fitnessGoals: u.fitness_goals || u.fitnessGoals || '',
              isVerified: u.is_verified !== undefined ? Boolean(u.is_verified) : (u.isVerified !== undefined ? Boolean(u.isVerified) : true),
              status: u.status || 'active',
              createdAt: u.created_at || u.createdAt || new Date().toISOString()
            };
          });
          setUsers(formattedUsers);
        } else {
          setUsers(VelocityAPI.getUsers());
        }
      } else {
        setUsers(VelocityAPI.getUsers());
      }
    } catch {
      setUsers(VelocityAPI.getUsers());
    }

    setClasses(VelocityAPI.getClasses());
    setSubscriptions(VelocityAPI.getSubscriptions());
    setAuditLogs(VelocityAPI.getAuditLogs());
    setEnquiries(VelocityAPI.getEnquiries());
    setPrograms(VelocityAPI.getPrograms());
    setNutritionPlans(VelocityAPI.getNutritionPlans());
    setAnnouncements(VelocityAPI.getAnnouncements());
    setIsLoading(false);
  };

  useEffect(() => {
    loadCRMData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const isCoach = user.role === 'coach';
  const isAdmin = user.role === 'admin';

  // Dynamic Coach Tab Access Control configured by Admin
  const coachPerms = VelocityAPI.getCoachPermissions();
  const allowedCoachTabs: string[] = [];
  if (coachPerms.allowLeadPipeline) allowedCoachTabs.push('overview');
  if (coachPerms.allowClientRoster) allowedCoachTabs.push('users');
  if (coachPerms.allowClassSchedules) allowedCoachTabs.push('schedule');
  if (coachPerms.allowWorkoutPrograms) allowedCoachTabs.push('programs');
  if (coachPerms.allowNutritionPlans) allowedCoachTabs.push('nutrition');
  if (coachPerms.allowFinancials) allowedCoachTabs.push('subscriptions'); // Only visible if Admin explicitly enables it!
  if (coachPerms.allowSupportTickets) allowedCoachTabs.push('tickets');

  const allNavItems = [
    { id: 'overview', label: isCoach ? 'COACH DASHBOARD' : 'CRM OVERVIEW', icon: LayoutDashboard },
    { id: 'users', label: isCoach ? 'CLIENT ROSTER' : 'USER DIRECTORY', icon: Users },
    { id: 'schedule', label: 'CLASS SCHEDULES', icon: Calendar },
    { id: 'programs', label: 'WORKOUT PROGRAMS', icon: Dumbbell },
    { id: 'nutrition', label: 'DIET PLANS', icon: Utensils },
    { id: 'subscriptions', label: 'FINANCIAL BILLING', icon: CreditCard },
    { id: 'enquiries', label: 'WEBSITE ENQUIRIES', icon: Mail },
    { id: 'tickets', label: 'SUPPORT TICKETS', icon: LifeBuoy },
    { id: 'announcements', label: 'ANNOUNCEMENTS', icon: ShieldAlert },
    { id: 'audit', label: 'AUDIT LOGS & PERMISSIONS', icon: ShieldCheck }
  ];

  const navItems = isCoach
    ? allNavItems.filter((item) => allowedCoachTabs.includes(item.id))
    : allNavItems;

  const groupedNavSections = [
    {
      category: 'CORE MANAGEMENT',
      items: [
        { id: 'overview', label: isCoach ? 'COACH DASHBOARD' : 'CRM OVERVIEW', icon: LayoutDashboard },
        { id: 'users', label: isCoach ? 'CLIENT ROSTER' : 'USER DIRECTORY', icon: Users },
      ]
    },
    {
      category: 'ATHLETIC PROGRAMMING',
      items: [
        { id: 'schedule', label: 'CLASS SCHEDULES', icon: Calendar },
        { id: 'programs', label: 'WORKOUT PROGRAMS', icon: Dumbbell },
        { id: 'nutrition', label: 'DIET PLANS', icon: Utensils },
      ]
    },
    {
      category: 'FINANCE & COMMUNICATIONS',
      items: [
        { id: 'subscriptions', label: 'FINANCIAL BILLING', icon: CreditCard },
        { id: 'enquiries', label: 'WEBSITE ENQUIRIES', icon: Mail },
        { id: 'tickets', label: 'SUPPORT TICKETS', icon: LifeBuoy },
        { id: 'announcements', label: 'ANNOUNCEMENTS', icon: ShieldAlert },
      ]
    },
    {
      category: 'GOVERNANCE & SECURITY',
      items: [
        { id: 'audit', label: 'SECURITY & PERMISSIONS', icon: ShieldCheck }
      ]
    }
  ];

  // Auto-redirect coach if currently on a restricted tab (e.g., Financial Billing)
  useEffect(() => {
    if (isCoach && !allowedCoachTabs.includes(activeTab)) {
      const fallbackTab = allowedCoachTabs[0] || 'overview';
      setActiveTab(fallbackTab);
      showToast('Tab access restricted by System Administrator.');
    }
  }, [isCoach, activeTab, allowedCoachTabs]);

  const coaches = users.filter((u) => u.role === 'coach' || u.role === 'admin');
  const clients = users.filter((u) => u.role === 'client');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] text-white border-l-4 border-white px-5 py-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <p className="text-xs font-bold uppercase tracking-wide">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Header Info */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-black uppercase text-white truncate">{user.name}</h2>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  {isCoach ? `BxStrength Coach • ${user.coachPosition || 'Head Coach'}` : 'BxStrength System Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Grouped Nav Items */}
          <nav className="p-3 space-y-4">
            {groupedNavSections.map((group) => {
              const visibleItems = group.items.filter((item) => navItems.some((n) => n.id === item.id));
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.category} className="space-y-1">
                  <div className="px-3 pt-3 pb-1.5 border-b border-zinc-800/60 mb-1">
                    <h3 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">
                      {group.category}
                    </h3>
                  </div>
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left rounded-lg ${
                          isActive
                            ? 'bg-white text-black shadow-md font-extrabold ring-1 ring-white/50'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
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
            <span>EXIT SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main CRM Workspace */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <SkeletonLoader type="kpi" count={4} />
            <SkeletonLoader type="table" count={5} />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <CRMOverview
                users={users}
                classes={classes}
                subscriptions={subscriptions}
                auditLogs={auditLogs}
                enquiries={enquiries}
                isCoach={isCoach}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'users' && (
              <UserManagement
                users={users}
                isCoach={isCoach}
                onUsersUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'schedule' && (
              <ClassScheduleManager
                classes={classes}
                coaches={coaches}
                clients={clients}
                onClassesUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'programs' && (
              <ProgramManager
                programs={programs}
                clients={clients}
                onProgramsUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'nutrition' && (
              <NutritionManager
                plans={nutritionPlans}
                clients={clients}
                onPlansUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'subscriptions' && (
              <FinancialSubscriptions
                subscriptions={subscriptions}
                clients={clients}
                onSubscriptionsUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'enquiries' && (
              <EnquiriesManager
                enquiries={enquiries}
                onEnquiriesUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'tickets' && (
              <TicketManagement onShowToast={showToast} />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsManager
                announcements={announcements}
                onAnnouncementsUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}

            {isAdmin && activeTab === 'audit' && (
              <AuditLogsAndSettings
                auditLogs={auditLogs}
                onAuditLogsUpdated={loadCRMData}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
