import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, Dumbbell, ShieldCheck, Flame, ArrowRight, Activity, Clock, Target, UserCheck } from 'lucide-react';
import { SelfAssessmentData } from '../types';
import { VelocityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SelfAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteAndBookConsultation: (assessment: SelfAssessmentData) => void;
}

export const SelfAssessmentModal: React.FC<SelfAssessmentModalProps> = ({
  isOpen,
  onClose,
  onCompleteAndBookConsultation,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SelfAssessmentData>({
    goal: '',
    obstacle: '',
    experience: '',
    commitment: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    submittedAt: '',
  });

  // Auto-fill user details whenever user or modal state updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user, isOpen]);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectGoal = (goal: string) => {
    setFormData((prev) => ({ ...prev, goal }));
    setStep(2);
  };

  const handleSelectObstacle = (obstacle: string) => {
    setFormData((prev) => ({ ...prev, obstacle }));
    setStep(3);
  };

  const handleSelectExperience = (experience: string) => {
    setFormData((prev) => ({ ...prev, experience }));
    setStep(4);
  };

  const handleSelectCommitment = (commitment: string) => {
    setFormData((prev) => ({ ...prev, commitment }));
    setStep(5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAssessment = {
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    // Store in Local Enquiries & DB
    try {
      VelocityAPI.createEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Digital Diagnostic: ${formData.goal}`,
        message: `[SELF ASSESSMENT DIAGNOSTIC]\nGoal: ${formData.goal}\nObstacle: ${formData.obstacle}\nExperience: ${formData.experience}\nCommitment: ${formData.commitment}`
      });
    } catch (err) {
      console.error('Diagnostic enquiry save error:', err);
    }

    // POST to backend API server
    fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        primaryGoal: formData.goal,
        mainObstacle: formData.obstacle,
        experienceLevel: formData.experience,
        weeklyCommitment: formData.commitment
      })
    }).catch(err => console.warn('Server assessment sync notice:', err.message));

    setIsCompleted(true);
  };

  const handleFinalBooking = () => {
    onCompleteAndBookConsultation(formData);
    onClose();
    setStep(1);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121214] text-white border border-zinc-800 shadow-2xl rounded-xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-5 bg-[#18181b] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black">
              <Dumbbell className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">BxStrength Self-Assessment</h3>
              <p className="text-[11px] text-zinc-400 font-medium">Free 5-Minute Qualified Digital Diagnostic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {!isCompleted ? (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Step {step} of 5
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i <= step ? 'w-8 bg-white' : 'w-3 bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: GOAL */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                      What is your primary fitness goal?
                    </h2>
                    <p className="text-xs text-zinc-400">Select the main outcome you want to achieve with BxStrength coaching.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Fat Loss & Recomposition', desc: 'Shed body fat while preserving lean muscle mass' },
                      { title: 'Strength & Hypertrophy', desc: 'Build raw compound power and muscular hypertrophy' },
                      { title: 'Postural & Longevity', desc: 'Fix mobility, back pain, and optimize metabolic health' },
                      { title: 'Executive Performance', desc: 'High-energy conditioning for busy professionals' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleSelectGoal(item.title)}
                        className={`p-4 rounded-lg text-left border transition-all flex flex-col justify-between group ${
                          formData.goal === item.title
                            ? 'border-white bg-zinc-800'
                            : 'border-zinc-800 bg-[#18181b] hover:border-zinc-600 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold uppercase text-white group-hover:text-white flex items-center justify-between">
                            {item.title}
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </p>
                          <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: OBSTACLE */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                      What has been your biggest obstacle?
                    </h2>
                    <p className="text-xs text-zinc-400">Understanding your bottlenecks allows us to assign the perfect coach.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: 'Lack of Structure', desc: 'Doing random workouts without periodized planning' },
                      { title: 'Time Constraints', desc: 'Busy corporate/business schedule with unpredictable travel' },
                      { title: 'Lack of Accountability', desc: 'Starting strong but losing motivation after a few weeks' },
                      { title: 'Nutrition Confusion', desc: 'Unsure how to eat for sustained performance without crash dieting' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleSelectObstacle(item.title)}
                        className="p-4 rounded-lg text-left border border-zinc-800 bg-[#18181b] hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
                      >
                        <p className="text-sm font-bold uppercase text-white flex items-center justify-between">
                          {item.title}
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: EXPERIENCE */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                      What is your current training experience?
                    </h2>
                    <p className="text-xs text-zinc-400">Be honest — we coach all levels from absolute beginners to athletes.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { title: 'Beginner (0 - 1 Year)', desc: 'New to structured lifting or returning after a long break' },
                      { title: 'Intermediate (1 - 3 Years)', desc: 'Familiar with core lifts but plateaued in progress' },
                      { title: 'Advanced (3+ Years)', desc: 'Consistent training history requiring advanced periodization' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleSelectExperience(item.title)}
                        className="p-4 rounded-lg text-left border border-zinc-800 bg-[#18181b] hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
                      >
                        <p className="text-sm font-bold uppercase text-white flex items-center justify-between">
                          {item.title}
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: COMMITMENT */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                      How many days per week can you commit?
                    </h2>
                    <p className="text-xs text-zinc-400">We design programs tailored around your real-life availability.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { title: '2 - 3 Days / Wk', desc: 'Focused high-efficiency full body sessions' },
                      { title: '3 - 4 Days / Wk', desc: 'Optimal split for lean gains and strength' },
                      { title: '5+ Days / Wk', desc: 'Comprehensive athletic training protocol' },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleSelectCommitment(item.title)}
                        className="p-4 rounded-lg text-left border border-zinc-800 bg-[#18181b] hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
                      >
                        <p className="text-sm font-bold uppercase text-white flex items-center justify-between">
                          {item.title}
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: CONTACT DETAILS */}
              {step === 5 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                      Generate Your Diagnostic Report
                    </h2>
                    <p className="text-xs text-zinc-400">Enter your details so your assigned UK coach can review your profile before your free 15-min session.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alexander Vance"
                        className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alexander@domain.com"
                          className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+44 7700 900077"
                          className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest uppercase py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Activity className="w-4 h-4" />
                      SUBMIT & VIEW ASSESSMENT RESULT
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* COMPLETED ASSESSMENT RESULT */
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">
                  QUALIFIED MATCH: 96% COACHING COMPATIBILITY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-3">
                  Assessment Complete, {formData.name.split(' ')[0]}!
                </h2>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2">
                  Based on your goal (<strong className="text-white">{formData.goal}</strong>) and schedule, you qualify for our 1-on-1 15-min session.
                </p>
              </div>

              {/* Assessment summary pill cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs bg-[#18181b] p-4 rounded-lg border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Goal</span>
                  <span className="font-bold text-white truncate block">{formData.goal || 'General'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Obstacle</span>
                  <span className="font-bold text-white truncate block">{formData.obstacle || 'Structure'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Level</span>
                  <span className="font-bold text-white truncate block">{formData.experience || 'Intermediate'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Frequency</span>
                  <span className="font-bold text-white truncate block">{formData.commitment || '3-4 Days'}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleFinalBooking}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-widest uppercase px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  BOOK 15-MIN SESSION
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto text-zinc-400 hover:text-white font-bold text-xs tracking-wider uppercase px-4 py-3 cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
