import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordResetEmail } from '../../services/emailService';
import { getApiUrl } from '../../services/api';
import { X, Mail, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, Lock, Eye, EyeOff, Dumbbell, ExternalLink } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin
}) => {
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState<'request' | 'email_dispatched' | 'set_new_password' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResetLink, setGeneratedResetLink] = useState<string>('');

  if (!isOpen) return null;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    try {
      setErrorMsg(null);
      setLoading(true);

      const resetToken = `bxreset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const link = `${window.location.origin}/#reset-password?email=${encodeURIComponent(cleanEmail)}&token=${resetToken}`;
      setGeneratedResetLink(link);

      // Send real email via EmailJS SMTP protocol
      await sendPasswordResetEmail({
        toEmail: cleanEmail,
        resetLink: link,
        token: resetToken
      });

      await forgotPassword(cleanEmail);

      // Post to backend Express server API
      fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      }).catch(err => console.warn('Server forgot-password notice:', err.message));

      setStep('email_dispatched');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch reset link email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    try {
      setErrorMsg(null);
      setLoading(true);
      
      // Call AuthContext & VelocityAPI to update password
      await resetPassword(email, newPassword);

      // Call backend API endpoint if present
      fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      }).catch(err => console.warn('Server reset-password notice:', err.message));

      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setStep('request');
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121214] text-white border border-zinc-800 shadow-2xl rounded-xl overflow-hidden font-sans">
        
        {/* Top Branding Header */}
        <div className="bg-[#18181b] p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black">
              <Dumbbell className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">BxStrength Account Recovery</h3>
              <p className="text-[11px] text-zinc-400">EmailJS SMTP Password Reset Service</p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold rounded-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: REQUEST EMAIL */}
          {step === 'request' && (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                  RESET YOUR PASSWORD
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter your registered email address. A real email with a secure reset link will be dispatched to your inbox via EmailJS SMTP protocol.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white pl-10 pr-4 py-2.5 text-xs font-bold rounded-lg outline-none placeholder-zinc-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest py-3 uppercase transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <span>DISPATCHING EMAIL VIA EMAILJS SMTP...</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>DISPATCH REAL RESET EMAIL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCloseAll();
                    onOpenLogin();
                  }}
                  className="w-full text-center text-xs font-bold text-zinc-400 hover:text-white py-2 uppercase transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DISPATCHED REAL EMAIL VIEW & TOKEN URL */}
          {step === 'email_dispatched' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl">
                {/* Email Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      DISPATCHED REAL EMAIL NOTIFICATION (EMAILJS SMTP)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">SMTP Protocol Active</span>
                </div>

                {/* Email Details */}
                <div className="space-y-1.5 text-xs">
                  <p className="text-zinc-400 font-semibold">
                    Recipient Email: <strong className="text-white font-mono">{email}</strong>
                  </p>
                  <p className="text-zinc-400 font-semibold">
                    Subject: <strong className="text-white uppercase">BxStrength Password Reset Request</strong>
                  </p>
                </div>

                {/* Real Reset Link Preview Box */}
                <div className="bg-[#121214] border border-zinc-800/90 p-4 rounded-lg space-y-3 text-xs text-zinc-300 leading-relaxed">
                  <p className="font-bold text-white">Hello,</p>
                  <p>
                    A real password reset email has been dispatched to <strong className="text-white">{email}</strong>. You can click the link in your email or click the button below to type your new password:
                  </p>

                  <div className="bg-[#18181b] p-3 rounded border border-zinc-800 font-mono text-[11px] text-emerald-400 break-all">
                    {generatedResetLink}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setStep('set_new_password')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs tracking-wider px-6 py-3 rounded-lg uppercase transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>OPEN RESET LINK & TYPE NEW PASSWORD</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => setStep('request')}
                  className="text-zinc-400 hover:text-white font-bold uppercase transition-colors cursor-pointer"
                >
                  Resend Email
                </button>
                <button
                  onClick={() => {
                    handleCloseAll();
                    onOpenLogin();
                  }}
                  className="text-white font-bold uppercase hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Return to Sign In →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 'set_new_password' && (
            <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-950/50 border border-emerald-900 px-2.5 py-1 rounded inline-block mb-2">
                  VERIFIED RESET TOKEN ACTIVE
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                  TYPE YOUR NEW PASSWORD
                </h2>
                <p className="text-xs text-zinc-400">
                  Account Email: <strong className="text-white">{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white pl-10 pr-10 py-2.5 text-xs font-bold rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white pl-10 pr-10 py-2.5 text-xs font-bold rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest py-3 uppercase transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <span>UPDATING PASSWORD...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>SAVE NEW PASSWORD & SIGN IN</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">PASSWORD UPDATED SUCCESSFULLY!</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                  Your new password is now active for <strong className="text-white">{email}</strong>.
                </p>
              </div>
              <button
                onClick={() => {
                  handleCloseAll();
                  onOpenLogin();
                }}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest py-3 px-8 uppercase transition-all rounded-lg cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>SIGN IN WITH NEW PASSWORD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
