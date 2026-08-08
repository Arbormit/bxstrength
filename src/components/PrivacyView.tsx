import React from 'react';
import { ShieldCheck, Lock, Eye, Server, UserCheck, Key, FileCheck } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-16 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black tracking-widest text-[#E52165] uppercase flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            ENTERPRISE DATA SECURITY & PRIVACY POLICY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-2xl mx-auto">
            Velocity Fitness is committed to protecting your personal health metrics, payment credentials, and privacy across all physical and digital platforms.
          </p>
          <div className="w-16 h-1 bg-[#E52165] mx-auto mt-4"></div>
          <span className="text-[10px] text-gray-500 font-mono block mt-3">Compliance Standard: GDPR & DPDP Act 2026 | Last Updated: July 2026</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-gray-800 text-sm leading-relaxed">

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#E52165]" />
            1. Information We Collect
          </h2>
          <p>
            When you register, book classes, or track body statistics on Velocity Fitness, we collect specific information necessary to deliver personalized athletic and health services:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-1">
              <strong className="text-gray-900 block font-bold uppercase">Personal Identity Data:</strong>
              <p className="text-gray-600">Full name, email address, phone number, date of birth, emergency contact details, and encrypted password hashes.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-1">
              <strong className="text-gray-900 block font-bold uppercase">Health & Fitness Telemetry:</strong>
              <p className="text-gray-600">Body weight, body fat %, muscle mass, caloric intake, workout logging, and coach assigned training routines.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-[#E52165]" />
            2. How We Use Your Data
          </h2>
          <p>Your information is used strictly to fulfill athletic services and maintain platform performance:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-700">
            <li>Generating personalized fitness routines, diet plan recommendations, and tracking historical progress.</li>
            <li>Processing subscription billing, membership status updates, and digital class reservation receipts.</li>
            <li>Enforcing enterprise platform security via security audit logs, rate-limiting, and IP tracking against DDoS attacks.</li>
            <li>Broadcasting critical club updates, schedule alterations, or emergency announcements via email/SMS.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#E52165]" />
            3. Data Encryption & Storage Infrastructure
          </h2>
          <p>
            All member data is encrypted in transit using 256-bit TLS 1.3 encryption and stored securely in our enterprise NeonDB PostgreSQL database with encrypted SSL modes (<code className="text-[#E52165] font-mono text-xs">sslmode=verify-full</code>).
          </p>
          <div className="bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 rounded space-y-1">
            <strong className="block font-bold uppercase">Zero Plaintext Password Guarantee:</strong>
            <p>Passwords are never stored in plaintext. We utilize salt-hashed Bcrypt algorithm with high work factors to ensure account safety against database breaches.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#E52165]" />
            4. Your Data Protection Rights
          </h2>
          <p className="text-xs">Under global data protection frameworks, you maintain the following rights:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 p-3 border border-gray-200 rounded">
              <strong className="block font-bold text-gray-900 mb-1 uppercase">Right to Access:</strong>
              <p className="text-gray-600">Request a full copy of your health & subscription records stored in our database.</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200 rounded">
              <strong className="block font-bold text-gray-900 mb-1 uppercase">Right to Rectify:</strong>
              <p className="text-gray-600">Update your profile parameters or request corrections to erroneous entries anytime.</p>
            </div>
            <div className="bg-gray-50 p-3 border border-gray-200 rounded">
              <strong className="block font-bold text-gray-900 mb-1 uppercase">Right to Erasure:</strong>
              <p className="text-gray-600">Request account deletion ("Right to be Forgotten") by submitting a privacy ticket.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
            5. Contact Our Data Protection Officer (DPO)
          </h2>
          <p className="text-xs text-gray-600">
            If you have questions regarding this Privacy Policy or wish to exercise your data rights, reach out to our DPO at <a href="mailto:privacy@velocityfitness.com" className="text-[#E52165] font-bold underline">privacy@velocityfitness.com</a> or write to: Velocity Fitness Data Protection Office, New Delhi, India.
          </p>
        </section>

      </div>
    </div>
  );
};
