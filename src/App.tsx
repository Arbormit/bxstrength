import React, { useState, useEffect } from 'react';
import { ViewPage, Trainer, UserRole, SelfAssessmentData } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { TransformationJourney } from './components/TransformationJourney';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { ServicesSection } from './components/ServicesSection';
import { TrainersSection } from './components/TrainersSection';
import { FaqSection } from './components/FaqSection';
import { SelfAssessmentModal } from './components/SelfAssessmentModal';
import { BookingModal } from './components/BookingModal';
import { MembershipModal } from './components/MembershipModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ScheduleView } from './components/ScheduleView';
import { AboutView } from './components/AboutView';
import { BlogView } from './components/BlogView';
import { ContactView } from './components/ContactView';
import { TermsView } from './components/TermsView';
import { PrivacyView } from './components/PrivacyView';
import { SearchModal } from './components/SearchModal';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AdminCRM } from './components/admin/AdminCRM';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { SeoHead } from './components/SeoHead';
import { FloatingActionWidget } from './components/ui/FloatingActionWidget';
import { Lock } from 'lucide-react';
import { ChatbotWidget } from './components/ui/ChatbotWidget';
import { ServiceCustomizationModal } from './components/ServiceCustomizationModal';
import { Preloader } from './components/ui/Preloader';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { CheckCircle2, X, WifiOff, AlertTriangle } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const network = useNetworkStatus();
  const [currentPage, setCurrentPage] = useState<ViewPage>('home');
  const [isLoadingSplash, setIsLoadingSplash] = useState<boolean>(true);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState<boolean>(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [forgotPassModalOpen, setForgotPassModalOpen] = useState<boolean>(false);
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<string | undefined>(undefined);
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [serviceCustomizationModalOpen, setServiceCustomizationModalOpen] = useState<boolean>(false);
  const [selectedServiceForCustomization, setSelectedServiceForCustomization] = useState<any>(null);

  const handleSelectService = (srv: any) => {
    setSelectedServiceForCustomization(srv);
    setServiceCustomizationModalOpen(true);
  };

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('reset-password') || search.includes('reset-password')) {
      setForgotPassModalOpen(true);
    }
  }, []);

  const navigateAndScroll = (page: ViewPage, elementId?: string) => {
    setCurrentPage(page);
    setSearchModalOpen(false);
    setSelectedBlogPostId(null);
    if (elementId) {
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAuthSuccessNavigate = (role: UserRole) => {
    if (role === 'admin' || role === 'coach') {
      setCurrentPage('admin');
      showToast(`Welcome to BxStrength Admin CRM (${role.toUpperCase()} Session)`);
    } else {
      setCurrentPage('dashboard');
      showToast('Welcome to your BxStrength Client Performance Dashboard!');
    }
  };

  const handleOpenBookingWithTrainer = (trainerName: string) => {
    setSelectedTrainerForBooking(trainerName);
    setSelectedClassForBooking(undefined);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithDetails = (className: string, trainerName: string) => {
    setSelectedClassForBooking(className);
    setSelectedTrainerForBooking(trainerName);
    setBookingModalOpen(true);
  };

  const handleSelectTrainer = (trainer: Trainer) => {
    handleOpenBookingWithTrainer(trainer.name);
  };

  const handleSelectPlan = (planName: string) => {
    showToast(`Successfully registered for ${planName}! Welcome to BxStrength.`);
  };

  const handleAssessmentCompleteAndBook = (assessment: SelfAssessmentData) => {
    showToast(`Assessment submitted for ${assessment.name}! Opening consultation booking...`);
    setBookingModalOpen(true);
  };

  // If viewing Dashboard or Admin CRM full-screen portal views
  if (currentPage === 'dashboard' && user) {
    return (
      <ClientDashboard
        user={user}
        onLogout={() => {
          logout();
          setCurrentPage('home');
          showToast('Signed out of session');
        }}
        onNavigateHome={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'admin' && user) {
    return (
      <AdminCRM
        user={user}
        onLogout={() => {
          logout();
          setCurrentPage('home');
          showToast('Signed out of CRM session');
        }}
        onNavigateHome={() => setCurrentPage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-white selection:text-black">
      {/* Dynamic SEO Meta Head Manager */}
      <SeoHead currentPage={currentPage} />

      {/* 3-5 Sec Animated Preloader Splash Screen */}
      {isLoadingSplash && <Preloader onComplete={() => setIsLoadingSplash(false)} />}

      {/* Network Status Banner */}
      {!network.isOnline ? (
        <div className="bg-red-950/90 border-b border-red-800 text-red-300 text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 z-40">
          <WifiOff className="w-4 h-4 text-red-400" />
          <span>NETWORK CONNECTION OFFLINE: OPERATING IN CACHED LOCAL MODE</span>
        </div>
      ) : network.isSlowConnection ? (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-300 text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 z-40">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>SLOW INTERNET DETECTED: ACTIVATING SKELETON PLACEHOLDERS FOR SMOOTH NAVIGATION</span>
        </div>
      ) : null}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] text-white border-l-4 border-white px-5 py-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 rounded-lg border border-zinc-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-bold uppercase tracking-wide">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Header Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setSelectedBlogPostId(null);
          setCurrentPage(page);
        }}
        onOpenBooking={() => {
          setSelectedClassForBooking(undefined);
          setSelectedTrainerForBooking(undefined);
          setBookingModalOpen(true);
        }}
        onOpenAssessment={() => setAssessmentModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />

      {/* Page Routing Views */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero
              onOpenBooking={() => {
                setSelectedClassForBooking(undefined);
                setSelectedTrainerForBooking(undefined);
                setBookingModalOpen(true);
              }}
              onOpenAssessment={() => setAssessmentModalOpen(true)}
            />

            <TrustBar />

            <BeforeAfterShowcase
              onOpenAssessment={() => setAssessmentModalOpen(true)}
              onOpenConsultation={() => setBookingModalOpen(true)}
            />

            <TransformationJourney
              onOpenAssessment={() => setAssessmentModalOpen(true)}
              onOpenConsultation={() => setBookingModalOpen(true)}
            />

            <ServicesSection
              onOpenBooking={() => {
                setSelectedClassForBooking(undefined);
                setSelectedTrainerForBooking(undefined);
                setBookingModalOpen(true);
              }}
              onSelectService={handleSelectService}
            />

            <TrainersSection
              onSelectTrainer={handleSelectTrainer}
              onNavigate={(page) => setCurrentPage(page)}
              onOpenBookingWithTrainer={handleOpenBookingWithTrainer}
            />

            <TestimonialsSection />

            <FaqSection
              onOpenConsultation={() => setBookingModalOpen(true)}
              onOpenAssessment={() => setAssessmentModalOpen(true)}
            />
          </>
        )}

        {currentPage === 'about' && (
          <AboutView
            onNavigate={(page) => setCurrentPage(page)}
            onOpenBooking={() => setBookingModalOpen(true)}
          />
        )}

        {currentPage === 'schedule' && (
          isAuthenticated ? (
            <ScheduleView
              onOpenBookingWithDetails={handleOpenBookingWithDetails}
              onNavigateToAdmin={() => setCurrentPage('admin')}
            />
          ) : (
            <div className="bg-[#0a0a0a] min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#CCFF00]">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">MEMBERS ONLY TIMETABLE</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Class timetables and live schedule bookings are exclusively available for registered members. Please sign in or create a free account to view.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase px-6 py-3 rounded-xl cursor-pointer shadow-lg"
                >
                  SIGN IN TO VIEW TIMETABLE
                </button>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="w-full sm:w-auto bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs uppercase px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-[#CCFF00]/20"
                >
                  CREATE FREE ACCOUNT
                </button>
              </div>
            </div>
          )
        )}

        {currentPage === 'trainers' && (
          <div className="bg-[#0a0a0a] min-h-screen py-12">
            <TrainersSection
              onSelectTrainer={handleSelectTrainer}
              onNavigate={(page) => setCurrentPage(page)}
              onOpenBookingWithTrainer={handleOpenBookingWithTrainer}
            />
          </div>
        )}

        {currentPage === 'blog' && (
          <BlogView 
            initialSelectedPostId={selectedBlogPostId}
            onClearInitialPost={() => setSelectedBlogPostId(null)}
          />
        )}

        {currentPage === 'contact' && <ContactView />}

        {currentPage === 'terms' && <TermsView />}

        {currentPage === 'privacy' && <PrivacyView />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(page) => setCurrentPage(page)} />

      {/* Interactive 5-Step Lead Diagnostic Self Assessment Modal */}
      <SelfAssessmentModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        onCompleteAndBookConsultation={handleAssessmentCompleteAndBook}
      />

      {/* Discovery Consultation Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedClass={selectedClassForBooking}
        preSelectedTrainer={selectedTrainerForBooking}
      />

      {/* Membership Modal */}
      <MembershipModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={navigateAndScroll}
        onOpenBookingWithClass={(className) => {
          setSelectedClassForBooking(className);
          setBookingModalOpen(true);
          setSearchModalOpen(false);
        }}
        onOpenBookingWithTrainer={(trainerName) => {
          handleOpenBookingWithTrainer(trainerName);
          setSearchModalOpen(false);
        }}
        onSelectPlan={(planName) => {
          handleSelectPlan(planName);
          setSearchModalOpen(false);
        }}
        onSelectBlogPost={(postId) => {
          setSelectedBlogPostId(postId);
          setSearchModalOpen(false);
          setCurrentPage('blog');
        }}
      />

      {/* Auth Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onOpenForgotPassword={() => {
          setLoginModalOpen(false);
          setForgotPassModalOpen(true);
        }}
        onSuccessNavigate={handleAuthSuccessNavigate}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onOpenLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
        onSuccessNavigate={handleAuthSuccessNavigate}
      />

      <ForgotPasswordModal
        isOpen={forgotPassModalOpen}
        onClose={() => setForgotPassModalOpen(false)}
        onOpenLogin={() => {
          setForgotPassModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      <ServiceCustomizationModal
        isOpen={serviceCustomizationModalOpen}
        onClose={() => setServiceCustomizationModalOpen(false)}
        service={selectedServiceForCustomization}
        onNavigateToDashboard={() => setCurrentPage('dashboard')}
      />

      {/* Floating Action Suite: AI Chatbot, WhatsApp, Email, Go-To-Top */}
      <FloatingActionWidget
        isChatbotOpen={isChatbotOpen}
        onToggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
      />
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        hideFloatingButton={true}
        onOpenConsultation={() => setBookingModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

