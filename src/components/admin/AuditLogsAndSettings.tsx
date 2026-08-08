import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { VelocityAPI } from '../../services/api';
import { ShieldCheck, Activity, Lock, Database, Trash2 } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface AuditLogsAndSettingsProps {
  auditLogs: AuditLog[];
  onAuditLogsUpdated?: () => void;
  onShowToast: (msg: string) => void;
}

export const AuditLogsAndSettings: React.FC<AuditLogsAndSettingsProps> = ({
  auditLogs,
  onAuditLogsUpdated,
  onShowToast
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60);
  const [rateLimiting, setRateLimiting] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Platform security configuration updated successfully!');
  };

  const confirmClearLogs = () => {
    VelocityAPI.clearAuditLogs();
    onShowToast('Cleared all security audit logs to free up database storage space!');
    setShowClearConfirm(false);
    if (onAuditLogsUpdated) onAuditLogsUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8C532B]" />
            SECURITY AUDIT LOGS & PLATFORM CONFIGURATION
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete enterprise security audit trail, session parameters, and database storage management.
          </p>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-black tracking-widest px-4 py-2.5 uppercase border border-red-800 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>PURGE LOGS (FREE STORAGE)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Log Stream */}
        <div className="lg:col-span-2 bg-[#111111] border border-gray-800 p-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            SECURITY AUDIT TRAIL ({auditLogs.length} EVENTS)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 uppercase font-bold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / User</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-900/50">
                    <td className="py-2.5 px-3 font-mono text-[10px] text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-white block">{log.userName}</span>
                      <span className="text-[9px] text-[#E52165] uppercase font-bold">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-gray-800 text-pink-300 font-bold uppercase text-[9px] font-mono border border-gray-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-300 text-[11px] max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-gray-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Configuration Panel */}
        <div className="bg-[#111111] border border-gray-800 p-6 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E52165]" />
            PLATFORM SYSTEM SETTINGS
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800">
              <div>
                <span className="font-bold text-white block">Maintenance Mode</span>
                <span className="text-[10px] text-gray-400">Restrict client login during upgrades</span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="rounded border-gray-700 text-[#E52165] focus:ring-[#E52165]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800">
              <div>
                <span className="font-bold text-white block">API Rate Limiting</span>
                <span className="text-[10px] text-gray-400">Protect against brute-force DDoS</span>
              </div>
              <input
                type="checkbox"
                checked={rateLimiting}
                onChange={(e) => setRateLimiting(e.target.checked)}
                className="rounded border-gray-700 text-[#E52165] focus:ring-[#E52165]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Session Idle Timeout (Minutes)
              </label>
              <input
                type="number"
                value={sessionTimeoutMins}
                onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-800 text-white px-3 py-2 outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E52165] hover:bg-[#c41551] text-white font-black tracking-widest py-2.5 uppercase transition-all shadow-md shadow-pink-500/20"
            >
              SAVE CONFIGURATION
            </button>
          </form>

          {/* Database Integration Info Box */}
          <div className="p-4 bg-gray-900/90 border border-gray-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" /> NeonDB Sync Status
            </h4>
            <p className="text-[11px] text-gray-400">
              Backend PostgreSQL schema ready. Connects directly via <code className="text-pink-400 font-mono">DATABASE_URL</code> in environment variables with client fallback.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="PURGE AUDIT LOG RECORDS"
        message="Are you sure you want to permanently clear all security audit logs to free up database storage space? This operation cannot be reversed."
        type="danger"
        confirmText="PURGE LOGS NOW"
        cancelText="CANCEL"
        onConfirm={confirmClearLogs}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
