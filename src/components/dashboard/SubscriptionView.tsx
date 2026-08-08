import React from 'react';
import { Subscription } from '../../types';
import { CreditCard, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface SubscriptionViewProps {
  subscription?: Subscription;
  onShowToast: (msg: string) => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ subscription, onShowToast }) => {
  const current = subscription || {
    id: 'sub-demo',
    userId: 'user-client-1',
    userName: 'David Miller',
    userEmail: 'david@client.com',
    planName: 'Premium Elite' as const,
    billingCycle: 'monthly' as const,
    price: 89,
    startDate: '2025-02-10',
    nextBillingDate: '2026-08-10',
    status: 'active' as const,
    autoRenew: true
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#E52165]" />
            MY MEMBERSHIP SUBSCRIPTION & BILLING
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Active plan tier, automated billing schedules, payment receipts, and upgrade options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Active Card */}
        <div className="lg:col-span-2 bg-[#111111] border border-gray-800 p-6 relative overflow-hidden">
          <div className="h-1 w-full bg-[#E52165] absolute top-0 left-0"></div>

          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E52165] bg-pink-950/60 px-2 py-0.5 border border-pink-800/60">
                ACTIVE CLUB TIER
              </span>
              <h3 className="text-2xl font-black uppercase text-white mt-1">{current.planName}</h3>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono">${current.price}</span>
              <span className="text-xs text-gray-400 block">/ {current.billingCycle}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-gray-300">
            <div>
              <span className="text-gray-500 font-bold uppercase block">Subscription Status</span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> {current.status.toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-gray-500 font-bold uppercase block">Next Renewal Date</span>
              <span className="text-white font-mono font-bold mt-0.5 block">{current.nextBillingDate}</span>
            </div>
          </div>

          {/* Included Features */}
          <div className="border-t border-gray-800 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Included Membership Privileges:</h4>
            {['Unlimited access to all gym facilities & heavy iron zones', 'Free admission to all group classes (HIIT, Spin, Boxing, Yoga)', 'Custom workout & diet plans assigned by personal coach', 'Steam room, sauna & locker access'].map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#E52165] flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Download */}
        <div className="bg-[#111111] border border-gray-800 p-6 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-gray-800 pb-3">
            BILLING STATEMENTS
          </h3>

          <div className="space-y-2">
            {['INV-2026-07 (Jul 10, 2026)', 'INV-2026-06 (Jun 10, 2026)', 'INV-2026-05 (May 10, 2026)'].map((inv, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-white font-bold">{inv}</span>
                  <span className="text-gray-400 font-mono">${current.price}.00 • Paid</span>
                </div>
                <button
                  onClick={() => onShowToast(`Downloaded tax receipt PDF for ${inv}`)}
                  className="p-1.5 text-[#E52165] hover:bg-gray-800 rounded transition-colors"
                  title="Download Receipt PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
