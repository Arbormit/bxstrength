import React, { useState, useEffect } from 'react';
import { ViewPage } from '../types';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Menu, X, Calendar, Phone, Search, LogIn, UserPlus, LayoutDashboard, ClipboardList } from 'lucide-react';

interface HeaderProps {
  currentPage: ViewPage;
  onNavigate: (page: ViewPage) => void;
  onOpenBooking: () => void;
  onOpenAssessment: () => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  onOpenAssessment,
  onOpenSearch,
  onOpenLogin,
  onOpenRegister
}) => {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: ViewPage }[] = [
    { label: 'HOME', page: 'home' },
    { label: 'ABOUT', page: 'about' },
    { label: 'SERVICES', page: 'home' }, // scrolls/navigates to services
    { label: 'COACHES', page: 'trainers' },
    { label: 'TIMETABLE', page: 'schedule' },
    { label: 'BLOG', page: 'blog' },
    { label: 'CONTACT', page: 'contact' },
  ];

  const handleNav = (page: ViewPage, targetElementId?: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    if (targetElementId) {
      setTimeout(() => {
        const elem = document.getElementById(targetElementId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCoachOrAdmin = user && (user.role === 'admin' || user.role === 'coach');

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="hidden md:block bg-[#121214] text-zinc-400 text-xs py-1.5 px-6 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors text-zinc-300">
              <Phone className="w-3.5 h-3.5 text-zinc-400" /> +44 20 7946 0921 (UK Advisory)
            </span>
            <span>📍 Mayfair, London W1J 8AJ & Remote UK</span>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Coach Support Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {isAuthenticated ? (
              <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                <span>Welcome,</span>
                <strong className="text-white uppercase font-black">{user?.name}</strong>
              </span>
            ) : (
              <div className="flex items-center gap-3 text-zinc-300 font-bold uppercase">
                <button
                  onClick={onOpenLogin}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" /> Sign In
                </button>
                <span className="text-zinc-700">|</span>
                <button
                  onClick={onOpenRegister}
                  className="text-white hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BRAND & ACTION BAR */}
      <div className={`transition-all duration-300 border-b border-zinc-800 ${scrolled ? 'py-2.5 bg-[#0a0a0a]/95 backdrop-blur-md' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-black shadow-lg group-hover:bg-zinc-200 transition-colors">
              <Dumbbell className="w-5 h-5 transform -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                BxStrength<span className="text-zinc-400">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">UK Digital Coaching</span>
            </div>
          </button>

          {/* Primary Action Suite */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
              title="Search Platform"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAssessment}
              className="border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer bg-zinc-900/60"
            >
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              SELF ASSESSMENT
            </button>

            <button
              onClick={onOpenBooking}
              className="bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              BOOK CONSULTATION
            </button>

            {isAuthenticated && user ? (
              <button
                onClick={() => handleNav(isCoachOrAdmin ? 'admin' : 'dashboard')}
                className="bg-[#18181b] hover:bg-zinc-800 text-white rounded-lg transition-all ml-1 border border-zinc-700/80 px-3 py-1.5 flex items-center gap-2.5 cursor-pointer shadow-sm group"
                title={`Logged in as ${user.name} - Open ${isCoachOrAdmin ? 'Admin CRM' : 'Client Dashboard'}`}
              >
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-600 group-hover:border-white transition-colors"
                />
                <div className="text-left flex flex-col">
                  <span className="text-xs font-black uppercase text-white tracking-wide truncate max-w-[130px] leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                    {user.role} Portal
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-zinc-300 hover:text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 ml-1"
                title="Sign In to Account"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="bg-white text-black text-[10px] font-black tracking-wider px-3 py-1.5 rounded uppercase cursor-pointer"
            >
              CONSULT
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DEDICATED SUB-NAVBAR FOR SPACED & UNCLUTTERED LINKS */}
      <div className="hidden lg:block bg-[#121214]/90 backdrop-blur-sm border-b border-zinc-800/80 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'SERVICES') {
                      handleNav('home', 'services-section');
                    } else {
                      handleNav(item.page);
                    }
                  }}
                  className={`text-xs font-black tracking-widest uppercase transition-all px-3 py-1.5 rounded-md cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121214] border-b border-zinc-800 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'SERVICES') {
                    handleNav('home', 'services-section');
                  } else {
                    handleNav(item.page);
                  }
                }}
                className={`text-left text-xs font-black tracking-widest py-2.5 uppercase border-b border-zinc-800 flex items-center justify-between ${
                  currentPage === item.page ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-4 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNav(isCoachOrAdmin ? 'admin' : 'dashboard');
                  }}
                  className="w-full bg-[#18181b] border border-zinc-700 text-white p-3 rounded-lg flex items-center justify-between cursor-pointer mb-1"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-600"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black uppercase text-white block">{user.name}</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">{user.role} Portal</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">OPEN →</span>
                </button>
              ) : null}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssessment();
                }}
                className="w-full border border-zinc-700 text-white text-xs font-black tracking-widest py-3 rounded-lg uppercase text-center flex items-center justify-center gap-2 bg-zinc-900"
              >
                <ClipboardList className="w-4 h-4 text-emerald-400" /> TAKE SELF ASSESSMENT
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full bg-white text-black text-xs font-black tracking-widest py-3 rounded-lg uppercase text-center flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" /> BOOK CONSULTATION
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};



