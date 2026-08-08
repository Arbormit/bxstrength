import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  type = 'danger',
  confirmText = 'CONFIRM ACTION',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  let icon = <AlertTriangle className="w-8 h-8 text-red-500" />;
  let accentBorder = 'border-red-500/60';
  let buttonBg = 'bg-red-600 hover:bg-red-700 text-white';

  if (type === 'warning') {
    icon = <AlertTriangle className="w-8 h-8 text-amber-400" />;
    accentBorder = 'border-amber-500/60';
    buttonBg = 'bg-amber-500 hover:bg-amber-600 text-black';
  } else if (type === 'success') {
    icon = <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
    accentBorder = 'border-emerald-500/60';
    buttonBg = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  } else if (type === 'info') {
    icon = <Info className="w-8 h-8 text-blue-400" />;
    accentBorder = 'border-blue-500/60';
    buttonBg = 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md bg-[#111111] text-white border ${accentBorder} p-6 sm:p-8 shadow-2xl space-y-4`}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 border border-gray-800 rounded-full flex-shrink-0">
            {icon}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E52165]">
              CONFIRMATION REQUIRED
            </span>
            <h3 className="text-lg font-black uppercase text-white tracking-tight">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-3.5 border border-gray-800">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold tracking-wider py-3 uppercase border border-gray-700 transition-colors text-center"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full ${buttonBg} text-xs font-black tracking-widest py-3 uppercase transition-all shadow-md text-center`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
