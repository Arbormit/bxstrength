import React, { useState, useEffect } from 'react';
import { Enquiry } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Mail, Trash2, CheckCircle2, Phone, Calendar, RefreshCw } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface EnquiriesManagerProps {
  enquiries: Enquiry[];
  onEnquiriesUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const EnquiriesManager: React.FC<EnquiriesManagerProps> = ({
  enquiries: propEnquiries,
  onEnquiriesUpdated,
  onShowToast
}) => {
  const [allEnquiries, setAllEnquiries] = useState<Enquiry[]>(propEnquiries);
  const [deletingEnquiry, setDeletingEnquiry] = useState<{ id: string; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchEnquiriesFromDatabase = async () => {
    setIsRefreshing(true);
    try {
      const local = VelocityAPI.getEnquiries();
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const serverData: Enquiry[] = await res.json();
        // Merge server and local enquiries deduplicating by ID
        const map = new Map<string, Enquiry>();
        [...local, ...serverData].forEach(item => {
          map.set(item.id, item);
        });
        setAllEnquiries(Array.from(map.values()));
      } else {
        setAllEnquiries(local);
      }
    } catch (e) {
      setAllEnquiries(VelocityAPI.getEnquiries());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiriesFromDatabase();
  }, [propEnquiries]);

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

      // 2. Delete from PostgreSQL database via API
      try {
        await fetch(`/api/enquiries/${targetId}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('API delete enquiry note:', err);
      }

      onShowToast(`Deleted enquiry from "${targetName}"`);
      setDeletingEnquiry(null);
      onEnquiriesUpdated();
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header */}
      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            WEBSITE ENQUIRIES & DIAGNOSTIC LEADS DATABASE
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time contact messages, 5-minute self assessments, and 15-minute session bookings stored in server database.
          </p>
        </div>

        <button
          onClick={fetchEnquiriesFromDatabase}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-lg border border-zinc-700 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>REFRESH DATABASE</span>
        </button>
      </div>

      {/* Enquiries List */}
      {allEnquiries.length === 0 ? (
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-12 text-center space-y-3">
          <Mail className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-black uppercase text-white">NO ENQUIRIES FOUND</h3>
          <p className="text-xs text-zinc-400">All submitted website forms and diagnostic inquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allEnquiries.map((e) => (
            <div key={e.id} className="bg-[#121214] border border-zinc-800 p-6 rounded-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-white uppercase">{e.name}</span>
                  <span className="text-xs text-zinc-400">({e.email})</span>
                  {e.phone && <span className="text-xs text-zinc-400 font-mono flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" /> {e.phone}</span>}
                </div>

                <div className="flex items-center gap-2">
                  {(['new', 'in_progress', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(e.id, st)}
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded border transition-all cursor-pointer ${
                        e.status === st
                          ? 'bg-zinc-800 text-white border-zinc-600 shadow-sm'
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

              <div className="bg-[#18181b] p-4 rounded-lg border border-zinc-800/80 text-xs space-y-1">
                <span className="text-emerald-400 font-black uppercase block tracking-wider text-[11px]">
                  SUBJECT: {e.subject}
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal whitespace-pre-line">{e.message}</p>
              </div>

              <div className="text-[11px] text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 font-semibold">
                <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Calendar className="w-3 h-3 text-zinc-400" /> Submitted: {new Date(e.createdAt).toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400">ASSIGN LEAD TO COACH:</span>
                  <select
                    value={e.assignedCoach || 'Unassigned'}
                    onChange={(ev) => handleAssignCoach(e.id, ev.target.value)}
                    className="bg-[#18181b] border border-zinc-700 text-[#CCFF00] text-xs font-bold px-3 py-1 rounded-lg focus:outline-none focus:border-[#CCFF00] cursor-pointer"
                  >
                    <option value="Unassigned">Unassigned (General Lead)</option>
                    <option value="Shaban Faridi (Head Coach)">Shaban Faridi (Head Coach)</option>
                    <option value="Sadeem (Strength & Conditioning)">Sadeem (Strength & Conditioning)</option>
                    <option value="Moheeb Khan (Boxing Specialist)">Moheeb Khan (Boxing Specialist)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
