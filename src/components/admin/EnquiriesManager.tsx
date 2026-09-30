import React, { useState, useEffect, useMemo } from 'react';
import { Enquiry } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Mail, Trash2, CheckCircle2, Phone, Calendar, RefreshCw, Search, X, Filter, UserCheck, Clock, ShieldAlert } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface EnquiriesManagerProps {
  enquiries: Enquiry[];
  onEnquiriesUpdated: () => void;
  onShowToast: (msg: string) => void;
}

// Format submission date safely
const formatEnquiryDate = (rawItem: any): string => {
  if (!rawItem) return 'Recently';
  const rawDate = rawItem.createdAt || rawItem.created_at || rawItem.submittedAt || rawItem.date || rawItem.timestamp;
  if (!rawDate) return 'Recently';

  try {
    const d = typeof rawDate === 'number' ? new Date(rawDate) : new Date(String(rawDate));
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Recently';
  }
};

// Deduplicate and normalize incoming enquiry records
const normalizeAndDeduplicateEnquiries = (rawList: any[]): Enquiry[] => {
  if (!Array.isArray(rawList)) return [];

  const deduppedMap = new Map<string, Enquiry>();

  rawList.forEach((item) => {
    if (!item || typeof item !== 'object') return;

    const rawDate = item.createdAt || item.created_at || item.submittedAt || item.date || item.timestamp;
    let validISO = '';
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        validISO = parsed.toISOString();
      }
    }
    if (!validISO) validISO = new Date().toISOString();

    const id = String(item.id || `enq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`);
    const name = String(item.name || item.client_name || item.userName || 'Website User').trim();
    const email = String(item.email || item.client_email || item.userEmail || '').trim();
    const phone = String(item.phone || item.client_phone || item.userPhone || '').trim();
    const subject = String(item.subject || item.title || 'General Website Enquiry').trim();
    const message = String(item.message || item.notes || item.description || '').trim();
    const status = (item.status === 'in_progress' || item.status === 'resolved' ? item.status : 'new') as 'new' | 'in_progress' | 'resolved';
    const assignedCoach = item.assignedCoach || item.assigned_coach || 'Unassigned';

    const normalized: Enquiry = {
      id,
      name,
      email,
      phone,
      subject,
      message,
      createdAt: validISO,
      status,
      assignedCoach,
      assignedNotes: item.assignedNotes || item.assigned_notes || ''
    };

    // Fingerprint for deduplication: email + subject + truncated message
    const fingerprint = `${email.toLowerCase()}|${subject.toLowerCase()}|${message.slice(0, 40).toLowerCase()}`;

    // Prefer exact ID match first
    if (deduppedMap.has(id)) {
      const existing = deduppedMap.get(id)!;
      // Merge properties if existing has default values
      if (existing.status === 'new' && normalized.status !== 'new') existing.status = normalized.status;
      if (existing.assignedCoach === 'Unassigned' && normalized.assignedCoach !== 'Unassigned') existing.assignedCoach = normalized.assignedCoach;
      if (!existing.phone && normalized.phone) existing.phone = normalized.phone;
    } else {
      // Check if another entry with identical fingerprint exists
      let fingerprintMatchKey: string | null = null;
      for (const [existingId, existingItem] of deduppedMap.entries()) {
        const fp = `${existingItem.email.toLowerCase()}|${existingItem.subject.toLowerCase()}|${existingItem.message.slice(0, 40).toLowerCase()}`;
        if (fp === fingerprint) {
          fingerprintMatchKey = existingId;
          break;
        }
      }

      if (fingerprintMatchKey) {
        const existing = deduppedMap.get(fingerprintMatchKey)!;
        if (existing.status === 'new' && normalized.status !== 'new') existing.status = normalized.status;
        if (existing.assignedCoach === 'Unassigned' && normalized.assignedCoach !== 'Unassigned') existing.assignedCoach = normalized.assignedCoach;
        if (!existing.phone && normalized.phone) existing.phone = normalized.phone;
      } else {
        deduppedMap.set(id, normalized);
      }
    }
  });

  return Array.from(deduppedMap.values());
};

export const EnquiriesManager: React.FC<EnquiriesManagerProps> = ({
  enquiries: propEnquiries,
  onEnquiriesUpdated,
  onShowToast
}) => {
  const [allEnquiries, setAllEnquiries] = useState<Enquiry[]>(() => normalizeAndDeduplicateEnquiries(propEnquiries));
  const [deletingEnquiry, setDeletingEnquiry] = useState<{ id: string; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  const fetchEnquiriesFromDatabase = async () => {
    setIsRefreshing(true);
    try {
      const local = VelocityAPI.getEnquiries();
      let serverData: Enquiry[] = [];

      try {
        const res = await fetch('/api/enquiries');
        if (res.ok) {
          serverData = await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch server enquiries:', e);
      }

      const merged = normalizeAndDeduplicateEnquiries([...local, ...serverData]);
      setAllEnquiries(merged);
    } catch (e) {
      setAllEnquiries(normalizeAndDeduplicateEnquiries(VelocityAPI.getEnquiries()));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiriesFromDatabase();
  }, [propEnquiries]);

  // Filtered & Searched List
  const filteredEnquiries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allEnquiries.filter((e) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && e.status !== statusFilter) {
        return false;
      }

      // 2. Search query matching: Number/Ticket ID, Name, Email, Phone, Subject, Message, Coach
      if (!term) return true;

      const matchId = e.id.toLowerCase().includes(term);
      const matchName = e.name.toLowerCase().includes(term);
      const matchEmail = e.email.toLowerCase().includes(term);
      const matchPhone = e.phone ? e.phone.toLowerCase().includes(term) : false;
      const matchSubject = e.subject.toLowerCase().includes(term);
      const matchMessage = e.message.toLowerCase().includes(term);
      const matchCoach = e.assignedCoach ? e.assignedCoach.toLowerCase().includes(term) : false;

      return matchId || matchName || matchEmail || matchPhone || matchSubject || matchMessage || matchCoach;
    });
  }, [allEnquiries, searchTerm, statusFilter]);

  // Stats Counters
  const stats = useMemo(() => {
    const total = allEnquiries.length;
    const newCount = allEnquiries.filter(e => e.status === 'new').length;
    const inProgressCount = allEnquiries.filter(e => e.status === 'in_progress').length;
    const resolvedCount = allEnquiries.filter(e => e.status === 'resolved').length;
    return { total, newCount, inProgressCount, resolvedCount };
  }, [allEnquiries]);

  const handleUpdateStatus = (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    VelocityAPI.updateEnquiryStatus(id, status);
    onShowToast(`Updated enquiry status to ${status.toUpperCase().replace('_', ' ')}`);
    fetchEnquiriesFromDatabase();
    onEnquiriesUpdated();
  };

  const handleAssignCoach = (id: string, coachName: string) => {
    VelocityAPI.updateEnquiryCoach(id, coachName);
    onShowToast(`Lead assigned to ${coachName}`);
    fetchEnquiriesFromDatabase();
    onEnquiriesUpdated();
  };

  const handleDeleteTrigger = (id: string, name: string) => {
    setDeletingEnquiry({ id, name });
  };

  const confirmDelete = async () => {
    if (deletingEnquiry) {
      const targetId = deletingEnquiry.id;
      const targetName = deletingEnquiry.name;

      // Optimistically remove from UI state immediately
      setAllEnquiries(prev => prev.filter(e => e.id !== targetId));

      // 1. Delete locally
      VelocityAPI.deleteEnquiry(targetId);

      // 2. Delete from server database via API
      try {
        await fetch(`/api/enquiries/${targetId}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Failed to delete enquiry from server:', err);
      }

      onShowToast(`Deleted enquiry from "${targetName}"`);
      setDeletingEnquiry(null);
      onEnquiriesUpdated();
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Top Header */}
      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            WEBSITE ENQUIRIES & DIAGNOSTIC LEADS
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time client submissions, 5-minute self assessments, and 15-minute consultation requests.
          </p>
        </div>

        <button
          onClick={fetchEnquiriesFromDatabase}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg border border-zinc-700 flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>REFRESH DATABASE</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'all' ? 'bg-[#18181b] border-emerald-500/50 shadow-md' : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-zinc-400 block tracking-widest">TOTAL ENQUIRIES</span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.total}</span>
        </div>

        <div
          onClick={() => setStatusFilter('new')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'new' ? 'bg-[#18181b] border-emerald-500/50 shadow-md' : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-widest">NEW LEADS</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.newCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('in_progress')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'in_progress' ? 'bg-[#18181b] border-blue-500/50 shadow-md' : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-blue-400 block tracking-widest">IN PROGRESS</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{stats.inProgressCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('resolved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'resolved' ? 'bg-[#18181b] border-zinc-500/50 shadow-md' : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <span className="text-[10px] font-black uppercase text-zinc-400 block tracking-widest">RESOLVED</span>
          <span className="text-2xl font-black text-zinc-400 mt-1 block">{stats.resolvedCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#121214] border border-zinc-800 p-4 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              placeholder="Search by ticket ID (#enq-...), name, email, or mobile number..."
              className="w-full bg-[#18181b] border border-zinc-700 text-white text-xs rounded-lg pl-10 pr-9 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-500 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer p-0.5"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(['all', 'new', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 text-[11px] font-black uppercase rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-zinc-800 text-white border-emerald-500 shadow-sm'
                    : 'bg-[#18181b] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {st === 'all' ? `ALL (${stats.total})` : `${st.replace('_', ' ')} (${stats[`${st === 'new' ? 'newCount' : st === 'in_progress' ? 'inProgressCount' : 'resolvedCount'}` as keyof typeof stats]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Summary / Reset button */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
            <span>
              Showing <strong className="text-white">{filteredEnquiries.length}</strong> of {allEnquiries.length} enquiries
              {searchTerm && <> matching &quot;<strong className="text-emerald-400">{searchTerm}</strong>&quot;</>}
              {statusFilter !== 'all' && <> in status <strong className="text-emerald-400">{statusFilter.toUpperCase().replace('_', ' ')}</strong></>}
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-emerald-400 hover:underline text-[11px] font-bold uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-12 text-center space-y-3">
          <Mail className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-black uppercase text-white">
            {searchTerm || statusFilter !== 'all' ? 'NO MATCHING ENQUIRIES FOUND' : 'NO ENQUIRIES FOUND'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search terms or resetting status filters to view all submitted queries.'
              : 'All submitted website forms and diagnostic inquiries will appear here.'}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-500/20 cursor-pointer mt-2 inline-block uppercase"
            >
              Clear Search &amp; Show All
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((e) => (
            <div key={e.id} className="bg-[#121214] border border-zinc-800 p-6 rounded-xl space-y-3 hover:border-zinc-700 transition-colors">
              {/* Header row: Ticket ID, User details, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                    #{e.id}
                  </span>
                  <span className="text-sm font-black text-white uppercase">{e.name}</span>
                  <span className="text-xs text-zinc-400">({e.email})</span>
                  {e.phone && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">
                      <Phone className="w-3 h-3 text-emerald-400" /> {e.phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(['new', 'in_progress', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(e.id, st)}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded border transition-all cursor-pointer ${
                        e.status === st
                          ? st === 'new'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-600 shadow-sm'
                            : st === 'in_progress'
                            ? 'bg-blue-950/70 text-blue-400 border-blue-600 shadow-sm'
                            : 'bg-zinc-800 text-white border-zinc-600 shadow-sm'
                          : 'bg-[#18181b] text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}

                  <button
                    onClick={() => handleDeleteTrigger(e.id, e.name)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors ml-2 cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Subject & Body */}
              <div className="bg-[#18181b] p-4 rounded-lg border border-zinc-800/80 text-xs space-y-1.5">
                <span className="text-emerald-400 font-black uppercase block tracking-wider text-[11px]">
                  SUBJECT: {e.subject}
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal whitespace-pre-line">{e.message}</p>
              </div>

              {/* Footer row: Date submitted & Coach selector */}
              <div className="text-[11px] text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 font-semibold">
                <span className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Submitted: <strong className="text-zinc-200 font-bold">{formatEnquiryDate(e)}</strong></span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400">ASSIGN LEAD TO COACH:</span>
                  <select
                    value={e.assignedCoach || 'Unassigned'}
                    onChange={(ev) => handleAssignCoach(e.id, ev.target.value)}
                    className="bg-[#18181b] border border-zinc-700 text-[#CCFF00] text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#CCFF00] cursor-pointer"
                  >
                    <option value="Unassigned">Unassigned (General Lead)</option>
                    <option value="Head Coach & Team">Head Coach & Team</option>
                    <option value="Sadeem (Strength & Conditioning)">Sadeem (Strength & Conditioning)</option>
                    <option value="Moheeb Khan (Boxing Specialist)">Moheeb Khan (Boxing Specialist)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingEnquiry}
        title="Delete Enquiry Record"
        message={`Are you sure you want to permanently delete enquiry from "${deletingEnquiry?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEnquiry(null)}
      />
    </div>
  );
};

