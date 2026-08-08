import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { VelocityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Quote, ChevronLeft, ChevronRight, Plus, X, CheckCircle2, MessageSquarePlus, Trophy, ShieldCheck } from 'lucide-react';

import { Skeleton } from './ui/Skeleton';

export const TestimonialsSection: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Review Form States
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const localReviews = VelocityAPI.getReviews();
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const serverReviews: Testimonial[] = await res.json();
        const map = new Map<string, Testimonial>();
        [...serverReviews, ...localReviews].forEach(item => {
          map.set(item.id, item);
        });
        setReviews(Array.from(map.values()));
      } else {
        setReviews(localReviews);
      }
    } catch {
      setReviews(VelocityAPI.getReviews());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenModal = () => {
    if (user) {
      setName(user.name);
      setRole('BxStrength Executive Client');
    }
    setShowModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    try {
      setIsSubmitting(true);
      const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

      // Save to Local API Store
      VelocityAPI.addReview({
        name: name.trim(),
        role: role.trim() || 'BxStrength Athlete',
        rating,
        comment: comment.trim(),
        avatar: avatarUrl
      });

      // Save to Backend Database API
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'BxStrength Athlete',
          rating,
          comment: comment.trim(),
          avatar: avatarUrl
        })
      });

      await fetchReviews();
      setCurrentIndex(0);
      setShowModal(false);
      setName('');
      setRole('');
      setRating(5);
      setComment('');
      setToastMsg('Thank you! Your review has been published live to the website.');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevTestimonial = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const current = reviews[currentIndex] || {
    name: 'BxStrength Athlete',
    role: 'Executive Member',
    rating: 5,
    comment: 'Elite strength training, periodized nutrition, and world-class private facilities.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  };

  return (
    <section className="py-20 bg-[#0a0a0a] text-white border-b border-zinc-800 relative font-sans">
      
      {/* Dedicated Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border-l-4 border-emerald-500 text-white px-5 py-3.5 shadow-2xl rounded-r-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wide">{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Write Review CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-zinc-800/80 pb-6">
          <div>
            <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-block mb-3">
              VERIFIED CLIENT REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              ATHLETE & MEMBER TESTIMONIALS
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Real transformation reviews stored in database and submitted directly by our executive gym members.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-wider uppercase px-5 py-3.5 rounded-lg transition-all shadow-lg cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>+ WRITE A REVIEW</span>
          </button>
        </div>

        {/* Testimonial Showcase Card */}
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton variant="card" count={1} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-[#121214] border border-zinc-800 p-12 text-center rounded-2xl space-y-3">
            <Quote className="w-10 h-10 text-zinc-700 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">No Client Reviews Published Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Be the first member to share your transformation experience with BxStrength! Click the button above to write a review.
            </p>
          </div>
        ) : current ? (
          <div className="max-w-4xl mx-auto bg-[#121214] border border-zinc-800 p-8 sm:p-12 relative shadow-2xl text-center rounded-2xl">
            <Quote className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />

            {/* Star Rating */}
            <div className="flex justify-center gap-1.5 text-amber-400 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700 fill-zinc-800'}`} 
                />
              ))}
            </div>

            <p className="text-zinc-200 text-base sm:text-xl font-medium leading-relaxed mb-8 max-w-3xl mx-auto italic">
              "{current.comment}"
            </p>

            <div className="flex flex-col items-center justify-center gap-3">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xl bg-zinc-900"
              />
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">
                  {current.name}
                </h3>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                  {current.role}
                </p>
              </div>
            </div>

            {/* Carousel Controls */}
            {reviews.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-zinc-400">
                  {currentIndex + 1} / {reviews.length} REVIEWS
                </span>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : null}

      </div>

      {/* WRITE REVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#121214] text-white border border-zinc-800 shadow-2xl rounded-xl overflow-hidden font-sans">
            
            {/* Header */}
            <div className="bg-[#18181b] p-5 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wider">WRITE A CLIENT REVIEW</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white px-3.5 py-2.5 text-xs font-bold rounded-lg outline-none placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Member Role / Transformation Result (Optional)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lost 10kg Body Fat & Gained Strength"
                  className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white px-3.5 py-2.5 text-xs font-bold rounded-lg outline-none placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Star Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700 fill-zinc-900'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Your Review & Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your transformation experience, coaching quality, and facility feedback..."
                  className="w-full bg-[#18181b] border border-zinc-800 focus:border-zinc-600 text-white p-3 text-xs font-medium rounded-lg outline-none placeholder-zinc-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'PUBLISHING...' : 'PUBLISH REVIEW LIVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
