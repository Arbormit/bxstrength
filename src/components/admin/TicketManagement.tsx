import React, { useState, useEffect } from 'react';
import { SupportTicket, TicketStatus } from '../../types';
import { VelocityAPI } from '../../services/api';
import { ConfirmModal } from '../ui/ConfirmModal';
import { LifeBuoy, CheckCircle2, Clock, AlertCircle, MessageSquare, Search, Filter, ShieldAlert, Send, Trash2 } from 'lucide-react';

import { Skeleton } from '../ui/Skeleton';

interface TicketManagementProps {
  onShowToast: (msg: string) => void;
}

export const TicketManagement: React.FC<TicketManagementProps> = ({ onShowToast }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [responseInputs, setResponseInputs] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllTickets = async () => {
    try {
      const localTickets = VelocityAPI.getTickets();
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const serverTickets: SupportTicket[] = await res.json();
        const map = new Map<string, SupportTicket>();
        [...localTickets, ...serverTickets].forEach(t => {
          if (t.id !== 'TICKET-849201' && t.id !== 'TICKET-739104') {
            map.set(t.id, t);
          }
        });
        setTickets(Array.from(map.values()));
      } else {
        setTickets(localTickets.filter(t => t.id !== 'TICKET-849201' && t.id !== 'TICKET-739104'));
      }
    } catch {
      setTickets(VelocityAPI.getTickets().filter(t => t.id !== 'TICKET-849201' && t.id !== 'TICKET-739104'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
    const interval = setInterval(fetchAllTickets, 3000); // 3 sec real-time sync
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      setUpdatingId(ticketId);
      const resMsg = responseInputs[ticketId] !== undefined ? responseInputs[ticketId] : undefined;

      // Optimistically update React state immediately so UI changes without delay
      setTickets(prev =>
        prev.map(t =>
          t.id === ticketId
            ? { ...t, status: newStatus, adminResponse: resMsg !== undefined ? resMsg : t.adminResponse, updatedAt: new Date().toISOString() }
            : t
        )
      );

      // 1. Update in local store
      VelocityAPI.updateTicketStatus(ticketId, newStatus, resMsg);

      // 2. Update via server backend DB endpoint
      await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: resMsg
        })
      });

      onShowToast(`Ticket #${ticketId} status updated to "${newStatus.toUpperCase().replace('_', ' ')}"! Live sync enabled.`);
    } catch (err) {
      console.error('Failed to update ticket:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;
    const targetId = ticketToDelete.id;

    try {
      // Optimistically remove from state immediately
      setTickets(prev => prev.filter(t => t.id !== targetId));

      // 1. Delete from local store
      VelocityAPI.deleteTicket(targetId);

      // 2. Delete from PostgreSQL database via API
      await fetch(`/api/tickets/${targetId}`, {
        method: 'DELETE'
      });

      onShowToast(`Ticket #${targetId} deleted permanently from database and system.`);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    } finally {
      setTicketToDelete(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> OPEN
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> IN PROGRESS
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> RESOLVED
          </span>
        );
      default:
        return (
          <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            CLOSED
          </span>
        );
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'urgent':
        return <span className="bg-red-600 text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">URGENT</span>;
      case 'high':
        return <span className="bg-orange-600 text-white font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">HIGH</span>;
      case 'medium':
        return <span className="bg-zinc-800 text-zinc-300 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">MEDIUM</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-500 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">SUPPORT TICKETS DESK</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time client support queue. Resolve or delete tickets; updates sync live to user dashboards and database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
            TOTAL TICKETS: {tickets.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121214] border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ticket ID or client..."
            className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white pl-9 pr-3 py-2 text-xs font-bold rounded-lg outline-none placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <Skeleton variant="card" count={3} />
      ) : filteredTickets.length === 0 ? (
        <div className="bg-[#121214] border border-zinc-800 p-12 text-center rounded-2xl space-y-2">
          <LifeBuoy className="w-10 h-10 text-zinc-700 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300 uppercase">No active support tickets raised yet</h3>
          <p className="text-xs text-zinc-500">When customers or clients submit a support ticket, it will appear here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((t) => (
            <div key={t.id} className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-4">
              
              {/* Ticket Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded">
                    #{t.id}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase">{t.userName}</span>
                    <span className="text-[11px] text-zinc-400 font-mono ml-2">({t.userEmail})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{t.category}</span>
                  {getPriorityBadge(t.priority)}
                  {getStatusBadge(t.status)}

                  {/* DELETE TICKET BUTTON */}
                  <button
                    onClick={() => setTicketToDelete(t)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-2"
                    title="Delete Ticket Permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject & Description */}
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">{t.subject}</h3>
                <p className="text-xs text-zinc-300 bg-[#18181b] p-3.5 rounded-xl border border-zinc-800 font-normal leading-relaxed">
                  "{t.description}"
                </p>
              </div>

              {/* Admin Resolution Section */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Admin / Coach Resolution Response Note
                </label>
                <textarea
                  rows={2}
                  value={responseInputs[t.id] !== undefined ? responseInputs[t.id] : (t.adminResponse || '')}
                  onChange={(e) => setResponseInputs({ ...responseInputs, [t.id]: e.target.value })}
                  placeholder="Type resolution instructions, exercise changes, or dietary recommendations to update client..."
                  className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white p-3 text-xs font-medium rounded-lg outline-none placeholder-zinc-500 resize-none"
                />

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(t.id, 'in_progress')}
                    disabled={updatingId === t.id}
                    className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>MARK IN PROGRESS</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(t.id, 'resolved')}
                    disabled={updatingId === t.id}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SAVE & MARK RESOLVED</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(t.id, 'closed')}
                    disabled={updatingId === t.id}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    CLOSE TICKET
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CONFIRM TICKET DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(ticketToDelete)}
        title="DELETE SUPPORT TICKET"
        message={`Are you sure you want to permanently delete Ticket #${ticketToDelete?.id} raised by ${ticketToDelete?.userName}? This action is irreversible and will remove the record from NeonDB.`}
        type="danger"
        confirmText="DELETE TICKET"
        cancelText="CANCEL"
        onConfirm={confirmDeleteTicket}
        onCancel={() => setTicketToDelete(null)}
      />

    </div>
  );
};
