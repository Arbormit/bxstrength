import React, { useState, useEffect } from 'react';
import { User, ClassSchedule, Subscription, AuditLog, Enquiry, LeadPipelineStage } from '../../types';
import { VelocityAPI } from '../../services/api';
import { ConfirmModal } from '../ui/ConfirmModal';
import { 
  Users, DollarSign, Dumbbell, ShieldCheck, Activity, TrendingUp, 
  ChevronRight, AlertCircle, BarChart3, Filter, PieChart, CheckCircle2, 
  ArrowRight, Plus, Trash2, X, Zap, Phone, Mail 
} from 'lucide-react';

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  goal?: string;
  assignedCoach: string;
  stage: LeadPipelineStage;
  source: string;
  createdAt: string;
}

interface CRMOverviewProps {
  users: User[];
  classes: ClassSchedule[];
  subscriptions: Subscription[];
  auditLogs: AuditLog[];
  enquiries: Enquiry[];
  isCoach?: boolean;
  onNavigateTab: (tab: string) => void;
}

const STORAGE_LEADS_KEY = 'bxstrength_crm_leads';

export const CRMOverview: React.FC<CRMOverviewProps> = ({
  users,
  classes,
  subscriptions,
  auditLogs,
  enquiries,
  isCoach = false,
  onNavigateTab
}) => {
  const [selectedFilterCoach, setSelectedFilterCoach] = useState<string>('All');
  const [selectedFilterStage, setSelectedFilterStage] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dedicated Confirm Modals State
  const [deletingLead, setDeletingLead] = useState<{ id: string; name: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Initial seed helper
  const getInitialLeads = (): CRMLead[] => {
    const saved = localStorage.getItem(STORAGE_LEADS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }

    // Seed default real leads from clients & enquiries
    const initial: CRMLead[] = [];

    // Add clients as leads
    users.filter(u => u.role === 'client').forEach((u, idx) => {
      initial.push({
        id: `lead-user-${u.id}`,
        name: u.name,
        email: u.email,
        phone: u.phone || '+44 20 7946 0921',
        goal: u.fitnessGoals || 'Strength & Recomp',
        assignedCoach: idx % 2 === 0 ? 'Shaban Faridi' : 'Sadeem',
        stage: idx === 0 ? 'Active Client' : 'Coach Assigned',
        source: 'Self Assessment Diagnostic',
        createdAt: u.createdAt || new Date().toISOString()
      });
    });

    // Add website enquiries as leads
    enquiries.forEach((e) => {
      initial.push({
        id: `lead-enq-${e.id}`,
        name: e.name,
        email: e.email,
        phone: e.phone || '+44 7700 900077',
        goal: e.subject || 'VIP Coaching Consultation',
        assignedCoach: 'Moheeb Khan',
        stage: 'Lead',
        source: 'Website Contact Form',
        createdAt: e.createdAt || new Date().toISOString()
      });
    });

    return initial;
  };

  const [leads, setLeads] = useState<CRMLead[]>(getInitialLeads);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  // Form State for Add Lead
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [goalInput, setGoalInput] = useState('Body Reconstitution & Strength');
  const [coachInput, setCoachInput] = useState('Shaban Faridi');
  const [stageInput, setStageInput] = useState<LeadPipelineStage>('Lead');
  const [sourceInput, setSourceInput] = useState('Manual Admin Entry');

  const pipelineStages: LeadPipelineStage[] = [
    'Lead',
    'Assessment',
    'Consultation',
    'Recommendation',
    'Payment',
    'Coach Assigned',
    'Active Client',
    'Review',
    'Renewal',
    'Referral',
  ];

  // Calculate dynamic stage counts
  const pipelineCounts: Record<LeadPipelineStage, number> = {
    'Lead': 0,
    'Assessment': 0,
    'Consultation': 0,
    'Recommendation': 0,
    'Payment': 0,
    'Coach Assigned': 0,
    'Active Client': 0,
    'Review': 0,
    'Renewal': 0,
    'Referral': 0,
  };

  leads.forEach((l) => {
    if (pipelineCounts[l.stage] !== undefined) {
      pipelineCounts[l.stage] += 1;
    }
  });

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchCoach = selectedFilterCoach === 'All' || l.assignedCoach === selectedFilterCoach;
    const matchStage = selectedFilterStage === 'All' || l.stage === selectedFilterStage;
    return matchCoach && matchStage;
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      alert('Please provide lead name and email address.');
      return;
    }

    const newLead: CRMLead = {
      id: `lead-${Date.now()}`,
      name: nameInput.trim(),
      email: emailInput.trim(),
      phone: phoneInput.trim() || '+44 20 7946 0921',
      goal: goalInput,
      assignedCoach: coachInput,
      stage: stageInput,
      source: sourceInput,
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setNameInput('');
    setEmailInput('');
    setPhoneInput('');

    // Trigger toast alert
    setToastMessage(`Lead "${newLead.name}" added successfully to ${newLead.stage} stage.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateStage = (id: string, newStage: LeadPipelineStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
    setToastMessage('Lead stage updated successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const confirmDeleteLead = () => {
    if (deletingLead) {
      setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
      setToastMessage(`Lead "${deletingLead.name}" removed.`);
      setDeletingLead(null);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const confirmClearAllLeads = () => {
    setLeads([]);
    setShowClearConfirm(false);
    setToastMessage('All CRM leads cleared.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6 text-white relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border-l-4 border-emerald-500 text-white px-5 py-3.5 shadow-2xl rounded-r-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wide">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Executive Banner */}
      <div className="bg-[#121214] border border-zinc-800 p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                {isCoach ? `COACH PORTAL • ${VelocityAPI.getCurrentUser()?.coachPosition || 'Head Coach'}` : 'BxStrength CRM EXECUTIVE'}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Lead Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-2">
              {isCoach ? 'FITNESS COACH CONTROL CENTER' : 'CLIENT PIPELINE & BUSINESS ANALYTICS'}
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl mt-1">
              {isCoach
                ? 'Manage your assigned client roster, 15-min strategy call sessions, workout programs, and nutrition plans.'
                : 'Track real lead progress from digital assessment to consultation, coach assignment, active retention, and client renewals.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {leads.length > 0 && !isCoach && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold tracking-wider px-3.5 py-3 rounded-lg uppercase transition-all cursor-pointer"
                title="Clear leads to test empty state"
              >
                Clear Leads
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest px-5 py-3 rounded-lg uppercase transition-all shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isCoach ? 'ADD ATHLETE / CLIENT' : 'NEW LEAD ENTRY'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121214] border border-zinc-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold uppercase text-zinc-400">
          <Filter className="w-4 h-4 text-white" />
          <span>{isCoach ? 'Athlete Roster Filters:' : 'Pipeline Filters:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isCoach && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 uppercase font-bold">Coach:</span>
              <select
                value={selectedFilterCoach}
                onChange={(e) => setSelectedFilterCoach(e.target.value)}
                className="bg-[#18181b] border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-600"
              >
                <option value="All">All UK Coaches</option>
                <option value="Shaban Faridi">Shaban Faridi</option>
                <option value="Sadeem">Sadeem</option>
                <option value="Moheeb Khan">Moheeb Khan</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">Stage:</span>
            <select
              value={selectedFilterStage}
              onChange={(e) => setSelectedFilterStage(e.target.value)}
              className="bg-[#18181b] border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-600"
            >
              <option value="All">All Pipeline Stages</option>
              {pipelineStages.map((stg) => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 10-Stage Pipeline Horizontal Visualiser (Only Shown to Admin, Hidden for Coaches) */}
      {!isCoach && (
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              CLIENT CRM CONVERSION PIPELINE (10 STAGES)
            </h3>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Active Leads: <strong className="text-white">{leads.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 text-center pt-2">
            {pipelineStages.map((stage, idx) => {
              const count = pipelineCounts[stage] || 0;
              const isSelected = selectedFilterStage === stage;
              return (
                <div
                  key={stage}
                  onClick={() => setSelectedFilterStage(isSelected ? 'All' : stage)}
                  className={`bg-[#18181b] border rounded-lg p-2.5 flex flex-col justify-between transition-all group cursor-pointer ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-950/20' 
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Step {idx + 1}</span>
                  <span className={`text-base font-black my-1 ${count > 0 ? 'text-white' : 'text-zinc-600'}`}>
                    {count}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase truncate group-hover:text-white">
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metric Analytics Cards (Tailored for Coach vs Admin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isCoach ? (
          <>
            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">My Assigned Clients</span>
                <Users className="w-5 h-5 text-[#CCFF00]" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {users.filter(u => u.role === 'client').length}
              </div>
              <p className="text-[11px] text-[#CCFF00] mt-1 font-semibold">Active Client Roster</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">15-Min Strategy Calls</span>
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {enquiries.length}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Client Consultations Received</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Workout & Diet Programs</span>
                <Dumbbell className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {VelocityAPI.getPrograms().length}
              </div>
              <p className="text-[11px] text-pink-400 mt-1 font-semibold">Active Training Plans</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Enquiries & Tickets</span>
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {enquiries.filter(e => e.status === 'new').length}
              </div>
              <p className="text-[11px] text-amber-400 mt-1 font-semibold">New Client Requests</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total CRM Leads</span>
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{leads.length}</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-semibold">Active in Pipeline</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Monthly Revenue</span>
                <DollarSign className="w-5 h-5 text-[#CCFF00]" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">£{totalRevenue}</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-semibold">Active Subscriptions Total</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Memberships</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {subscriptions.filter(s => s.status === 'active').length}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Verified Paid Clients</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries &amp; Leads</span>
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {enquiries.length}
              </div>
              <p className="text-[11px] text-amber-400 mt-1 font-semibold">Active Inbound Client Leads</p>
            </div>
          </>
        )}
      </div>

      {/* Coach Quick Actions Bar */}
      {isCoach && (
        <div className="bg-[#141416] border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#CCFF00] flex items-center gap-2">
              <Zap className="w-4 h-4" />
              COACH QUICK WORKSPACE SHORTCUTS
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Direct Tab Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigateTab('users')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-zinc-300 group-hover:text-white mb-1">
                <span className="text-xs font-bold uppercase">Athlete Roster</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#CCFF00]" />
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">View &amp; edit assigned client profiles</p>
            </button>

            <button
              onClick={() => onNavigateTab('programs')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-zinc-300 group-hover:text-white mb-1">
                <span className="text-xs font-bold uppercase">Workout Plans</span>
                <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">Create &amp; assign training routines</p>
            </button>

            <button
              onClick={() => onNavigateTab('nutrition')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-zinc-300 group-hover:text-white mb-1">
                <span className="text-xs font-bold uppercase">Nutrition Diets</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">Build macro &amp; meal plans</p>
            </button>

            <button
              onClick={() => onNavigateTab('tickets')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-zinc-300 group-hover:text-white mb-1">
                <span className="text-xs font-bold uppercase">Support Desk</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">Respond to athlete support tickets</p>
            </button>
          </div>
        </div>
      )}

      {/* Main Roster & Empty Lead State */}
      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              {isCoach ? 'MY ASSIGNED ATHLETE LEADS & DIAGNOSTIC REQUESTS' : 'LIVE CRM LEADS & ASSIGNED UK COACHES'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isCoach
                ? 'Review diagnostic submissions, 15-min strategy call bookings, and client status.'
                : 'Manage lead conversion pipeline, update stages, and view assigned specialist coaches.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest px-4 py-2 rounded uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {isCoach ? 'ADD ATHLETE' : 'ADD LEAD'}
          </button>
        </div>

        {/* Empty State vs Real Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-12 text-center space-y-4 my-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Users className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase text-white tracking-tight">NO LEADS AVAILABLE</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
                {selectedFilterStage !== 'All' 
                  ? `No leads currently match the stage filter "${selectedFilterStage}". Reset filters or add a new lead entry.`
                  : 'No CRM leads or client diagnostic entries recorded yet. Add your first lead to begin tracking client conversions.'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest px-6 py-3 rounded-lg uppercase transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD FIRST LEAD</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#18181b] border-b border-zinc-800 text-zinc-400 uppercase font-bold">
                  <th className="py-3 px-3">Lead Contact</th>
                  <th className="py-3 px-3">Fitness Goal</th>
                  <th className="py-3 px-3">Assigned Coach</th>
                  <th className="py-3 px-3">Lead Source</th>
                  <th className="py-3 px-3">Pipeline Stage</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(lead.name)}`}
                          alt={lead.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700 bg-zinc-900"
                        />
                        <div>
                          <span className="font-bold text-white block">{lead.name}</span>
                          <span className="text-[10px] text-zinc-400 block">{lead.email}</span>
                          {lead.phone && <span className="text-[9px] text-zinc-500 block">{lead.phone}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-semibold">{lead.goal || 'Strength & Hypertrophy'}</td>
                    <td className="py-3 px-3 font-bold text-white">{lead.assignedCoach}</td>
                    <td className="py-3 px-3 text-zinc-400 text-[11px]">{lead.source}</td>
                    <td className="py-3 px-3">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleUpdateStage(lead.id, e.target.value as LeadPipelineStage)}
                        className="bg-[#18181b] text-white border border-zinc-700 font-bold uppercase text-[10px] rounded px-2.5 py-1 focus:outline-none focus:border-zinc-500 cursor-pointer"
                      >
                        {pipelineStages.map((stg) => (
                          <option key={stg} value={stg}>{stg}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setDeletingLead({ id: lead.id, name: lead.name })}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                        title="Delete lead entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> ADD NEW CRM LEAD ENTRY
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Create a new lead entry and assign a UK specialist coach.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                  Lead Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900123"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                  Primary Fitness Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Powerlifting & Recomposition"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Assigned UK Coach
                  </label>
                  <select
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-600"
                  >
                    <option value="Shaban Faridi">Shaban Faridi (Head Coach)</option>
                    <option value="Sadeem">Sadeem (Senior Strength Lead)</option>
                    <option value="Moheeb Khan">Moheeb Khan (Tactical Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                    Initial Pipeline Stage
                  </label>
                  <select
                    value={stageInput}
                    onChange={(e) => setStageInput(e.target.value as LeadPipelineStage)}
                    className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-600"
                  >
                    {pipelineStages.map(stg => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300 mb-1">
                  Lead Channel / Source
                </label>
                <select
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="Manual Admin Entry">Manual Admin Entry</option>
                  <option value="Self Assessment Diagnostic">Self Assessment Diagnostic</option>
                  <option value="Website Contact Form">Website Contact Form</option>
                  <option value="WhatsApp Direct Inquiry">WhatsApp Direct Inquiry</option>
                  <option value="Client Referral">Client Referral</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Lead Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingLead}
        title="Delete Lead Entry"
        message={`Are you sure you want to permanently remove lead "${deletingLead?.name}" from the CRM pipeline?`}
        confirmText="DELETE LEAD"
        cancelText="CANCEL"
        onConfirm={confirmDeleteLead}
        onCancel={() => setDeletingLead(null)}
      />

      {/* Confirm Clear All Leads Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear All CRM Leads"
        message="Are you sure you want to clear ALL CRM leads? This will demonstrate the 'NO LEADS AVAILABLE' empty state."
        confirmText="CLEAR ALL LEADS"
        cancelText="CANCEL"
        onConfirm={confirmClearAllLeads}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
