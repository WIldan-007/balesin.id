import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { BalesinLogo } from './BalesinLogo';

interface HeaderProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, user }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 text-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setView('landing')}
          className="cursor-pointer group py-1"
        >
          <BalesinLogo variant="full" size="md" />
        </div>

        {/* Navigation links for Public Landing */}
        {currentView === 'landing' && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-[#F2542D] transition-colors">{t('Fitur', 'Features')}</a>
            <a href="#workflow" className="hover:text-[#F2542D] transition-colors">{t('Alur Kerja', 'How It Works')}</a>
            <a href="#pricing" className="hover:text-[#F2542D] transition-colors">{t('Harga', 'Pricing')}</a>
            <a 
              href="#affiliate" 
              onClick={(e) => { e.preventDefault(); setView('affiliate'); }} 
              className="hover:text-[#F2542D] transition-colors"
            >
              {t('Afiliasi', 'Affiliate')}
            </a>
            <a href="#faq" className="hover:text-[#F2542D] transition-colors">{t('FAQ', 'Resources')}</a>
          </nav>
        )}

        {/* Right CTA Actions & Language Toggle */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {user.isLoggedIn ? (
            <button
              id="header-dashboard-btn"
              onClick={() => setView('terminal')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('Coba Sekarang', 'Try Now')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => setView('terminal')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#F2542D] hover:bg-slate-100 transition-all cursor-pointer"
              >
                {t('Masuk', 'Log In')}
              </button>
              <button
                id="header-initialize-btn"
                onClick={() => setView('terminal')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-semibold text-xs tracking-wide transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>{t('Coba Sekarang', 'Try Now')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};


