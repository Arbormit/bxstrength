import React from 'react';
import { ShieldCheck, FileText, Scale, AlertTriangle, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      {/* Header Banner */}
      <div className="bg-[#111111] text-white py-16 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black tracking-widest text-[#E52165] uppercase flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" />
            LEGAL AGREEMENT & MEMBERSHIP TERMS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-2xl mx-auto">
            Please read these terms carefully before utilizing Velocity Fitness facilities, digital services, or membership subscriptions.
          </p>
          <div className="w-16 h-1 bg-[#E52165] mx-auto mt-4"></div>
          <span className="text-[10px] text-gray-500 font-mono block mt-3">Effective Date: January 1, 2026 | Last Updated: July 2026</span>
        </div>
      </div>

      {/* Main Legal Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-gray-800 text-sm leading-relaxed">

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E52165]" />
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            By registering an account, purchasing a membership subscription, or entering any Velocity Fitness club location, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, you must refrain from using our facility and digital applications.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 text-xs">
            <li>Members must be at least 18 years of age, or 16 years of age with written parental consent.</li>
            <li>Members must provide accurate, verifiable identity details upon registration.</li>
            <li>Velocity Fitness reserves the right to refuse service or terminate memberships for violation of facility rules.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E52165]" />
            2. Health Screening & Physical Readiness Waiver
          </h2>
          <p>
            Participation in physical exercises, strength training, HIIT, spin classes, and martial arts involves inherent physical risk. You represent and warrant that you are in good physical health and have no medical condition that would prevent your safe participation in athletic activities.
          </p>
          <div className="bg-pink-50 border border-pink-200 p-4 text-xs text-gray-800 rounded">
            <strong className="text-[#E52165] block font-bold mb-1 uppercase">Physical Activity Readiness Disclaimer:</strong>
            You consult a qualified medical professional prior to commencing any strenuous exercise regime. Velocity Fitness and its coaches accept no liability for personal injury sustained as a result of improper equipment usage or undisclosed pre-existing medical conditions.
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#E52165]" />
            3. Membership Subscriptions, Recurring Billing & Cancellations
          </h2>
          <p>
            Membership tiers (Basic Club, Premium Elite, VIP Master) are billed on a recurring monthly or annual basis as specified during registration.
          </p>
          <div className="space-y-2 text-xs text-gray-700">
            <p><strong>3.1 Auto-Renewal:</strong> Subscriptions automatically renew at the end of each billing cycle unless cancelled at least 7 business days prior to your next renewal date.</p>
            <p><strong>3.2 Refunds:</strong> Membership dues and personal training session fees are non-refundable after the 3-day statutory cooling-off period following initial sign-up.</p>
            <p><strong>3.3 Past Due Accounts:</strong> Accounts with failed payments will be suspended after 5 consecutive days of non-payment until all outstanding dues are settled.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E52165]" />
            4. Facility Code of Conduct & Etiquette
          </h2>
          <p>To ensure a safe and respectful training environment, all members must strictly adhere to the following rules:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded space-y-1">
              <strong className="text-gray-900 block font-bold uppercase">Gym Floor Rules:</strong>
              <p>Re-rack all free weights and plates after use. Wipe down equipment after exercise. Proper athletic footwear and apparel required at all times.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-3 rounded space-y-1">
              <strong className="text-gray-900 block font-bold uppercase">Zero Tolerance Policy:</strong>
              <p>Harassment, abusive language, equipment vandalism, or illicit substance distribution will result in immediate permanent banning without refund.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-l-4 border-[#E52165] pl-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#E52165]" />
            5. Class Booking & Reservation Policies
          </h2>
          <p className="text-xs">
            Group sessions (Boxing, Cycling, CrossFit) require prior reservation via the Velocity Fitness portal. Members who accumulate more than 3 unexcused no-shows within 30 days may have their advance booking privileges restricted for 14 calendar days.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
            6. Governing Law & Contact Information
          </h2>
          <p className="text-xs text-gray-600">
            These Terms shall be governed by and construed in accordance with the laws of India. For legal inquiries, dispute resolution, or membership support, contact our legal desk at <a href="mailto:support@bxstrength.com" className="text-emerald-600 font-bold underline">support@bxstrength.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
};
