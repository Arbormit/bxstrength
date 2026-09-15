import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '../types';
import { VelocityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Star, Quote, ChevronLeft, ChevronRight, Plus, X, CheckCircle2, 
  MessageSquarePlus, Trophy, ShieldCheck, Upload, Image as ImageIcon, 
  Trash2, AlertCircle, Maximize2 
} from 'lucide-react';

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

  // Photo Upload States (Strict 500KB Limit)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [photoFileSize, setPhotoFileSize] = useState<number | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRealReview = (r: Testimonial) => {
    if (!r || !r.name) return false;
    const lower = r.name.toLowerCase();
    return !lower.includes('test') && r.id !== 'rev-1' && r.id !== 'rev-2' && r.id !== 'rev-3' && r.id !== 't1' && r.id !== 't2' && r.id !== 't3';
  };

  const fetchReviews = async () => {
    try {
      const localReviews = VelocityAPI.getReviews().filter(isRealReview);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const serverReviews: Testimonial[] = await res.json();
        const map = new Map<string, Testimonial>();
        [...serverReviews, ...localReviews].filter(isRealReview).forEach(item => {
          map.set(item.id, item);
        });
        setReviews(Array.from(map.values()));
      } else {
        setReviews(localReviews);
      }
    } catch {
      setReviews(VelocityAPI.getReviews().filter(isRealReview));
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
    handleRemovePhoto();
    setShowModal(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    // Strict 500 KB Image Upload Limit (500 * 1024 = 512,000 bytes)
    const maxBytes = 500 * 1024;
    if (file.size > maxBytes) {
      const sizeKB = (file.size / 1024).toFixed(1);
      setPhotoError(`Selected image is ${sizeKB} KB, which exceeds the 500 KB limit. Please choose a smaller photo.`);
      setPhotoPreview(null);
      setPhotoFileName(null);
      setPhotoFileSize(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPhotoFileName(file.name);
    setPhotoFileSize(Math.round(file.size / 1024));

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName(null);
    setPhotoFileSize(null);
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    if (photoError) return;

    try {
      setIsSubmitting(true);
      const avatarUrl = photoPreview || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

      // Save to Local API Store
      VelocityAPI.addReview({
        name: name.trim(),
        role: role.trim() || 'BxStrength Athlete',
        rating,
        comment: comment.trim(),
        avatar: avatarUrl
      });

      // Save to Backend NeonDB Database API
      const response = await fetch('/api/reviews', {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish review');
      }

      await fetchReviews();
      setCurrentIndex(0);
      setShowModal(false);
      setName('');
      setRole('');
      setRating(5);
      setComment('');
      handleRemovePhoto();
      setToastMsg('Thank you! Your review with photo has been saved to database and published live!');
      setTimeout(() => setToastMsg(null), 4500);
    } catch (err: any) {
      console.error('Failed to post review:', err);
      setPhotoError(err.message || 'Failed to post review. Please ensure your image is under 500 KB.');
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

  const formatAvatarSrc = (avatar: string) => {
    if (avatar && avatar.includes('data:image')) {
      return avatar.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
    }
    return avatar;
  };

  const current = reviews.length > 0 ? reviews[currentIndex] || reviews[0] : null;

  const activeAvatar = current ? formatAvatarSrc(current.avatar) : '';

  return (
    <section className="py-20 bg-[#0a0a0a] text-white border-b border-zinc-800 relative font-sans">
      
      {/* Dedicated Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border-l-4 border-emerald-500 text-white px-5 py-3.5 shadow-2xl rounded-r-lg flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
              Real transformation reviews with photos stored in NeonDB database and submitted directly by our executive gym members.
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
              Be the first member to share your transformation experience with photo! Click the button above to write a review.
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
              <div 
                className="relative group cursor-pointer"
                onClick={() => activeAvatar && setSelectedZoomImage(activeAvatar)}
                title="Click to view full photo"
              >
                <img
                  src={activeAvatar}
                  alt={current.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xl bg-zinc-900 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
                  <span>{current.name}</span>
                  {activeAvatar.includes('data:image') && (
                    <span className="text-[9px] font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-1.5 py-0.5 rounded-full uppercase">
                      PHOTO VERIFIED
                    </span>
                  )}
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
          <div className="relative w-full max-w-lg bg-[#121214] text-white border border-zinc-800 shadow-2xl rounded-xl overflow-hidden font-sans max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-[#18181b] p-5 flex items-center justify-between border-b border-zinc-800 shrink-0">
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

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 overflow-y-auto">
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

              {/* Photo Upload Option with Strict 500KB Limit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Customer Photo / Result (Optional)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    MAX 500 KB
                  </span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="relative bg-[#18181b] border border-emerald-500/50 rounded-xl p-3 flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-zinc-700 bg-zinc-900 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{photoFileName || 'Uploaded Photo'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded border border-emerald-700/50">
                          {photoFileSize} KB / 500 KB max
                        </span>
                        <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Size OK
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 rounded-lg transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 bg-[#18181b] hover:bg-zinc-900/80 p-4 rounded-xl text-center cursor-pointer transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 group-hover:bg-emerald-950/80 group-hover:border group-hover:border-emerald-500/40 flex items-center justify-center transition-colors">
                        <Upload className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">
                        Click to upload customer photo
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        PNG, JPG, WEBP • Strict limit: max 500 KB
                      </span>
                    </div>
                  </div>
                )}

                {photoError && (
                  <div className="mt-2 p-2.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-semibold">{photoError}</span>
                  </div>
                )}
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
                  disabled={isSubmitting || !!photoError}
                  className="px-6 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black text-xs font-black tracking-wider uppercase rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'PUBLISHING...' : 'PUBLISH REVIEW LIVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {selectedZoomImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedZoomImage(null)}
        >
          <div 
            className="relative max-w-2xl max-h-[85vh] bg-[#121214] border border-zinc-800 p-2 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedZoomImage(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedZoomImage}
              alt="Customer Review Photo"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

