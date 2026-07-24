import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfile, AutomationFlow, PlatformNode, Campaign, ShortLink, AffiliateNode, SystemLog } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { LanguageProvider } from './context/LanguageContext';
import { auth, onAuthStateChanged } from './lib/firebase';
import { syncUserProfileWithFirestore } from './services/authService';

import { LandingView } from './views/LandingView';
import { TerminalView } from './views/TerminalView';
import { DashboardView } from './views/DashboardView';
import { FlowsView } from './views/FlowsView';
import { FlowBuilderView } from './views/FlowBuilderView';
import { NewFlowWizardView } from './views/NewFlowWizardView';
import { CampaignsView } from './views/CampaignsView';
import { ConnectionsView } from './views/ConnectionsView';
import { AffiliateView } from './views/AffiliateView';
import { SettingsView } from './views/SettingsView';
import { CheckoutView } from './views/CheckoutView';
import { AlertTriangle, CreditCard, Sparkles } from 'lucide-react';

import { 
  initialFlows, 
  initialPlatformNodes, 
  initialCampaigns, 
  initialShortLinks, 
  initialAffiliates, 
  initialLogs 
} from './data/mockData';

function AppContent() {
  const [currentView, setView] = useState<ViewMode>('landing');
  
  const [user, setUser] = useState<UserProfile>({
    name: 'Operator Guest',
    id: '',
    tier: 'FREE_TRIAL',
    email: '',
    avatar: '',
    isLoggedIn: false,
    trialDaysLeft: 7,
    isTrialExpired: false,
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await syncUserProfileWithFirestore(firebaseUser);
          setUser(profile);
        } catch (err) {
          console.error('Error loading Firestore profile:', err);
        }
      } else {
        setUser(prev => ({
          ...prev,
          isLoggedIn: false,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [selectedFlowForEdit, setSelectedFlowForEdit] = useState<AutomationFlow | null>(null);

  const [nodes, setNodes] = useState<PlatformNode[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateNode[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const isPublicPage = currentView === 'landing' || currentView === 'terminal' || currentView === 'checkout-plus' || currentView === 'checkout-pro';

  // Guard operator views: Redirect unauthenticated users to login terminal view
  useEffect(() => {
    if (!user.isLoggedIn && !isPublicPage) {
      setView('terminal');
    }
  }, [user.isLoggedIn, currentView, isPublicPage]);

  const handleSaveFlow = (updatedFlow: AutomationFlow) => {
    setFlows(flows.map(f => f.id === updatedFlow.id ? updatedFlow : f));
  };

  const handleAddFlow = (newFlow: AutomationFlow) => {
    setFlows([newFlow, ...flows]);
  };

  const handleAddShortLink = (newLink: ShortLink) => {
    setShortLinks([newLink, ...shortLinks]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-100 selection:text-[#F2542D]">
      
      {/* Public pages get standard Header */}
      {isPublicPage && (
        <Header 
          currentView={currentView} 
          setView={setView} 
          user={user} 
        />
      )}

      {/* Main Layout rendering */}
      {isPublicPage ? (
        <main className="flex-1">
          {currentView === 'landing' && <LandingView setView={setView} />}
          {currentView === 'terminal' && <TerminalView setView={setView} setUser={setUser} />}
          {currentView === 'checkout-plus' && <CheckoutView mode="plus" setView={setView} user={user} setUser={setUser} />}
          {currentView === 'checkout-pro' && <CheckoutView mode="pro" setView={setView} user={user} setUser={setUser} />}
        </main>
      ) : (
        /* Logged-in Operator Dashboard Layout with Sidebar */
        <div className="flex min-h-screen bg-slate-50 relative">
          
          {/* Expired Trial Overlay Blocking Access */}
          {user.tier === 'FREE_TRIAL' && user.isTrialExpired && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 shadow-2xl p-8 space-y-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                    Masa Free Trial 7 Hari Berakhir
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Halo <strong className="text-slate-900">{user.name}</strong>, masa uji coba gratis 7 hari Anda telah habis. Untuk terus menjalankan otomasi AI Gemini dan koneksi akun, silakan aktifkan paket langganan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs text-slate-700 space-y-2 text-left">
                  <div className="font-bold text-[#F2542D] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Keuntungan Berlangganan:</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                    <li>Otomasi respons AI Gemini tanpa batasan kuota</li>
                    <li>Atribusi omzet & shortlink unlimited</li>
                    <li>Integrasi Instagram, WhatsApp & TikTok</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setView('checkout-pro')}
                    className="w-full py-3.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>PILIH PAKET BERLANGGANAN SEKARANG</span>
                  </button>

                  <button
                    onClick={() => setView('landing')}
                    className="text-xs text-slate-500 font-bold hover:text-slate-900 cursor-pointer"
                  >
                    Kembali ke Halaman Depan
                  </button>
                </div>
              </div>
            </div>
          )}

          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            user={user} 
            setUser={setUser} 
          />

          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {currentView === 'dashboard' && (
              <DashboardView 
                setView={setView} 
                flows={flows} 
                nodes={nodes} 
                logs={logs} 
                user={user}
              />
            )}

            {currentView === 'flows' && (
              <FlowsView 
                setView={setView} 
                flows={flows} 
                setFlows={setFlows}
                setSelectedFlowForEdit={setSelectedFlowForEdit}
              />
            )}

            {currentView === 'builder' && (
              <FlowBuilderView 
                setView={setView} 
                flow={selectedFlowForEdit}
                onSaveFlow={handleSaveFlow}
              />
            )}

            {currentView === 'new-flow' && (
              <NewFlowWizardView 
                setView={setView} 
                onAddFlow={handleAddFlow}
              />
            )}

            {currentView === 'campaigns' && (
              <CampaignsView 
                setView={setView} 
                campaigns={campaigns} 
                shortLinks={shortLinks}
                onAddShortLink={handleAddShortLink}
              />
            )}

            {currentView === 'connections' && (
              <ConnectionsView 
                setView={setView} 
                nodes={nodes} 
                setNodes={setNodes}
              />
            )}

            {currentView === 'affiliate' && (
              <AffiliateView 
                setView={setView} 
                affiliates={affiliates}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView 
                setView={setView} 
                user={user} 
                setUser={setUser}
              />
            )}
          </main>
        </div>
      )}

      {/* Footer for Public Views */}
      {isPublicPage && <Footer setView={setView} user={user} />}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
