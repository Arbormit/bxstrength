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
  const [resetTokenFromUrl, setResetTokenFromUrl] = useState<string>('');
  const [generatedResetLink, setGeneratedResetLink] = useState<string>('');

  React.useEffect(() => {
    if (!isOpen) return;
    const urlStr = window.location.href;
    if (urlStr.includes('reset-password') || urlStr.includes('token=')) {
      try {
        const urlObj = new URL(urlStr.replace('#', '?'));
        const urlEmail = urlObj.searchParams.get('email');
        const token = urlObj.searchParams.get('token');
        if (urlEmail) {
          setEmail(decodeURIComponent(urlEmail));
        }
        if (token) {
          setResetTokenFromUrl(token);
        }
        setStep('set_new_password');
      } catch (e) {
        const match = urlStr.match(/email=([^&]+)/);
        if (match && match[1]) {
          setEmail(decodeURIComponent(match[1]));
          setStep('set_new_password');
        }
      }
    }
  }, [isOpen]);

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

      // 1. Call backend Express Server API to generate token & send email via Brevo API v3
      const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch password reset email via Brevo API.');
      }

      const link = data.resetUrl || `${window.location.origin}/#reset-password?email=${encodeURIComponent(cleanEmail)}&token=${data.resetToken || 'bxreset'}`;
      setGeneratedResetLink(link);

      // Fallback service trigger if needed
      sendPasswordResetEmail({
        toEmail: cleanEmail,
        resetLink: link,
        token: data.resetToken || 'bxreset'
      }).catch(() => {});

      await forgotPassword(cleanEmail).catch(() => {});

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
      
      // Call backend API endpoint to update password in NeonDB PostgreSQL
      const res = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, token: resetTokenFromUrl })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed on server.');
      }

      // Call AuthContext to sync client-side state
      await resetPassword(email, newPassword).catch(() => {});

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
            <img 
              src="https://res.cloudinary.com/yuyxn5b0/image/upload/v1788842924/bxlogo.jpg" 
              alt="BxStrength Logo" 
              className="h-9 w-auto max-w-[150px] object-contain rounded-lg shadow-md"
            />
            <div className="border-l border-zinc-700 pl-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">ACCOUNT RECOVERY</h3>
              <p className="text-[10px] text-zinc-400">Password Reset Service</p>
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
                  Enter your registered account email address. We'll send you a secure link to reset your password.
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
                    <span>SENDING RESET LINK...</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-black" />
                      <span>SEND RESET LINK</span>
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

          {/* STEP 2: CLEAN EMAIL DISPATCHED CONFIRMATION */}
          {step === 'email_dispatched' && (
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  CHECK YOUR INBOX
                </h2>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  We've sent a password reset email to <strong className="text-white font-mono">{email}</strong>. Please check your inbox and click the reset link to choose a new password.
                </p>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 text-left space-y-2 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  <span>⏱️ 5-Minute Time Limit</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  For your security, the reset link will expire in <strong>5 minutes</strong>. If you don't see the email within a minute, please check your spam or junk folder.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => {
                    handleCloseAll();
                    onOpenLogin();
                  }}
                  className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-widest py-3 uppercase transition-all rounded-lg cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>RETURN TO SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setStep('request')}
                  className="text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer uppercase"
                >
                  Didn't get an email? Resend
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 'set_new_password' && (
            <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded inline-block mb-2">
                  🔒 SECURE RESET SESSION ACTIVE
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                  CREATE NEW PASSWORD
                </h2>
                <p className="text-xs text-zinc-400">
                  Account: <strong className="text-white font-mono">{email}</strong>
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

              <div className="pt-2 space-y-2">
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
                      <span>RESET PASSWORD & SIGN IN</span>
                    </>
                  )}
                </button>

                {errorMsg && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setStep('request');
                    }}
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold py-2.5 rounded-lg uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request New Reset Link</span>
                  </button>
                )}
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
