import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, User, Clock, ArrowRight, Dumbbell, Shield, BookOpen, TrendingUp, ShieldCheck, AlertCircle, Command } from 'lucide-react';
import { 
  CLASSES_DATA, 
  TRAINERS_DATA, 
  SERVICES_DATA, 
  BLOG_POSTS_DATA, 
  MEMBERSHIP_PLANS 
} from '../data/gymData';
import { FitnessClass, Trainer, ServiceItem, BlogPost, MembershipPlan, ViewPage } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: ViewPage, elementId?: string) => void;
  onOpenBookingWithClass: (className: string) => void;
  onOpenBookingWithTrainer: (trainerName: string) => void;
  onSelectPlan: (planName: string) => void;
  onSelectBlogPost: (postId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenBookingWithClass,
  onOpenBookingWithTrainer,
  onSelectPlan,
  onSelectBlogPost
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    classes: FitnessClass[];
    trainers: Trainer[];
    services: ServiceItem[];
    blogs: BlogPost[];
    plans: MembershipPlan[];
  }>({
    classes: [],
    trainers: [],
    services: [],
    blogs: [],
    plans: []
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Popular search recommendations matching BxStrength
  const popularSearches = ['Strength', 'Recomp', 'Personal Training', 'Assessment', 'David Williams', 'Nutrition'];

  // Handle escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle clicks outside the modal content box
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Perform search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults({ classes: [], trainers: [], services: [], blogs: [], plans: [] });
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const searchTerms = [cleanQuery];

    if (cleanQuery.includes('gym') || cleanQuery.includes('muscle') || cleanQuery.includes('lift') || cleanQuery.includes('strength')) {
      searchTerms.push('strength', 'hypertrophy', 'weight');
    }
    if (cleanQuery.includes('trainer') || cleanQuery.includes('coach') || cleanQuery.includes('instructor')) {
      searchTerms.push('fitness trainer', 'coaching', 'specialist');
    }

    const matchesQuery = (text: string) => {
      return searchTerms.some(term => text.toLowerCase().includes(term));
    };

    // Filter Classes
    const matchedClasses = CLASSES_DATA.filter(cls => 
      matchesQuery(cls.title) || 
      matchesQuery(cls.description) || 
      matchesQuery(cls.category) || 
      matchesQuery(cls.trainerName) || 
      matchesQuery(cls.intensity)
    );

    // Filter Trainers
    const matchedTrainers = TRAINERS_DATA.filter(trainer => 
      matchesQuery(trainer.name) || 
      matchesQuery(trainer.role) || 
      matchesQuery(trainer.bio) || 
      trainer.specialties.some(spec => matchesQuery(spec))
    );

    // Filter Services
    const matchedServices = SERVICES_DATA.filter(svc => 
      matchesQuery(svc.title) || 
      matchesQuery(svc.description) || 
      svc.benefits.some(ben => matchesQuery(ben))
    );

    // Filter Blogs
    const matchedBlogs = BLOG_POSTS_DATA.filter(post => 
      matchesQuery(post.title) || 
      matchesQuery(post.excerpt) || 
      matchesQuery(post.content) || 
      matchesQuery(post.category) || 
      matchesQuery(post.author)
    );

    // Filter Plans
    const matchedPlans = MEMBERSHIP_PLANS.filter(plan => 
      matchesQuery(plan.name) || 
      plan.features.some(feat => matchesQuery(feat))
    );

    setResults({
      classes: matchedClasses,
      trainers: matchedTrainers,
      services: matchedServices,
      blogs: matchedBlogs,
      plans: matchedPlans
    });
  }, [query]);

  if (!isOpen) return null;

  const totalResults = 
    results.classes.length + 
    results.trainers.length + 
    results.services.length + 
    results.blogs.length + 
    results.plans.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-[#121214] text-white w-full max-w-2xl rounded-xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] my-6 sm:my-10 animate-in slide-in-from-top-6 duration-200"
      >
        {/* Search Input Bar Header */}
        <div className="relative border-b border-zinc-800 flex items-center bg-[#18181b] px-5 py-4">
          <Search className="w-5 h-5 text-zinc-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search BxStrength services, coaches, articles, plans... (e.g. Strength, Rehab)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-white placeholder-zinc-500 focus:outline-none py-1"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-white mr-3 uppercase font-black cursor-pointer"
            >
              Clear
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 mr-2">
            ESC
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 cursor-pointer"
            title="Close Search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Default state: show popular suggestions */}
          {!query.trim() ? (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-zinc-400 uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>POPULAR SEARCHES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-2 bg-[#18181b] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Informative Help Guide */}
              <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed font-normal">
                <p className="font-bold text-white uppercase mb-2 flex items-center gap-1.5">
                  <Command className="w-3.5 h-3.5 text-zinc-400" /> BxStrength Search Directory:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>Find bespoke protocols: <strong className="text-white">Strength & Recomp</strong>, <strong className="text-white">Postural Rehab</strong>.</li>
                  <li>Lookup head coaches: <strong className="text-white">David Williams</strong>, <strong className="text-white">Dr. Sophia Chen</strong>, <strong className="text-white">Marcus Vance</strong>.</li>
                  <li>Explore scientific articles: <strong className="text-white">Nutrition</strong>, periodization, and recovery.</li>
                </ul>
              </div>
            </div>
          ) : totalResults === 0 ? (
            /* No results state */
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-300 uppercase">
                No matching results found for "{query}"
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try searching for related terms like "Strength", "Rehab", "David Williams", or "Nutrition".
              </p>
            </div>
          ) : (
            /* Results display grouped by category */
            <div className="space-y-6">
              <div className="text-xs font-black text-zinc-400 tracking-wider">
                FOUND {totalResults} MATCHES FOR "{query.toUpperCase()}"
              </div>

              {/* Group: Services */}
              {results.services.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BESPOKE SERVICES ({results.services.length})</span>
                  </h4>
                  <div className="grid gap-2">
                    {results.services.map(svc => (
                      <div 
                        key={svc.id}
                        className="bg-[#18181b] border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <h5 className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors">
                            {svc.title}
                          </h5>
                          <p className="text-xs text-zinc-400 font-normal line-clamp-1">{svc.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {svc.benefits.slice(0, 2).map(ben => (
                              <span key={ben} className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                                ✓ {ben}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onNavigate('home', 'services-section');
                          }}
                          className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black tracking-widest px-4 py-2 rounded uppercase transition-colors self-start sm:self-center cursor-pointer"
                        >
                          VIEW SERVICE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Trainers / Coaches */}
              {results.trainers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-white" />
                    <span>UK HEAD COACHES ({results.trainers.length})</span>
                  </h4>
                  <div className="grid gap-2">
                    {results.trainers.map(trainer => (
                      <div 
                        key={trainer.id}
                        className="bg-[#18181b] border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex gap-3 items-center">
                          <img 
                            src={trainer.image} 
                            alt={trainer.name} 
                            className="w-10 h-10 object-cover rounded-full border border-zinc-700"
                          />
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors">
                              {trainer.name}
                            </h5>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{trainer.role}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {trainer.specialties.map(spec => (
                                <span key={spec} className="text-[8px] font-bold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded uppercase">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenBookingWithTrainer(trainer.name);
                            }}
                            className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black tracking-widest px-4 py-2 rounded uppercase transition-colors cursor-pointer"
                          >
                            BOOK COACH
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Blog Posts */}
              {results.blogs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>ARTICLES & RESEARCH ({results.blogs.length})</span>
                  </h4>
                  <div className="grid gap-2">
                    {results.blogs.map(blog => (
                      <div 
                        key={blog.id}
                        className="bg-[#18181b] border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-wider text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                              {blog.category}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">{blog.date}</span>
                          </div>
                          <h5 className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors leading-tight">
                            {blog.title}
                          </h5>
                          <p className="text-xs text-zinc-400 font-normal line-clamp-1">{blog.excerpt}</p>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectBlogPost(blog.id);
                          }}
                          className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black tracking-widest px-4 py-2 rounded uppercase transition-colors self-start sm:self-center flex items-center gap-1 cursor-pointer"
                        >
                          READ ARTICLE <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: Membership Plans */}
              {results.plans.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>MEMBERSHIP TIERS ({results.plans.length})</span>
                  </h4>
                  <div className="grid gap-2">
                    {results.plans.map(plan => (
                      <div 
                        key={plan.id}
                        className="bg-[#18181b] border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors">
                              {plan.name}
                            </h5>
                            {plan.popular && (
                              <span className="text-[8px] font-black bg-white text-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-zinc-300">
                            £{plan.price} / {plan.period}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectPlan(plan.name);
                          }}
                          className="bg-white hover:bg-zinc-200 text-black text-[10px] font-black tracking-widest px-4 py-2 rounded uppercase transition-colors self-start sm:self-center cursor-pointer"
                        >
                          SELECT TIER
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

