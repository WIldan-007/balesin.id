import React from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  LayoutDashboard, 
  Workflow, 
  Radio, 
  BarChart3, 
  Gift, 
  Activity,
  Settings as SettingsIcon, 
  LogOut, 
  PlusCircle, 
  CreditCard,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { BalesinLogo } from './BalesinLogo';
import { logoutUser } from '../services/authService';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, setUser }) => {
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    setUser({
      name: 'Guest Operator',
      id: '',
      tier: 'FREE_TRIAL',
      email: '',
      avatar: '',
      isLoggedIn: false,
    });
    setView('landing');
  };

  const navItems = [
    { id: 'dashboard' as ViewMode, label: t('Ringkasan', 'Overview'), icon: LayoutDashboard },
    { id: 'flows' as ViewMode, label: t('Alur Otomasi', 'Flows'), icon: Workflow, badge: '24' },
    { id: 'connections' as ViewMode, label: t('Koneksi Akun', 'Connections'), icon: Radio, badge: '3 Active' },
    { id: 'campaigns' as ViewMode, label: t('Kampanye & Link', 'Campaigns'), icon: BarChart3 },
    { id: 'affiliate' as ViewMode, label: t('Program Afiliasi', 'Affiliate'), icon: Gift, highlight: true },
    { id: 'logs' as ViewMode, label: t('Log Sistem', 'System Logs'), icon: Activity },
    { id: 'settings' as ViewMode, label: t('Pengaturan', 'Settings'), icon: SettingsIcon },
  ];

  const isFreeTrial = user.tier === 'FREE_TRIAL';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 select-none text-slate-700 z-40 shadow-sm">
      <div>
        {/* Logo Section */}
        <div 
          onClick={() => setView('landing')}
          className="p-5 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
        >
          <BalesinLogo variant="full" size="md" />
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-[#F2542D]" />
        </div>

        {/* Quick Action Button & Language Switcher */}
        <div className="p-4 space-y-3">
          <button
            id="sidebar-new-flow-btn"
            onClick={() => setView('new-flow')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ {t('ALUR OTOMASI BARU', 'NEW AUTOMATION FLOW')}</span>
          </button>

          <div className="flex justify-center">
            <LanguageToggle className="w-full justify-between px-2 bg-slate-50 border border-slate-200/80 rounded-xl py-1.5" />
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'flows' && (currentView === 'builder' || currentView === 'new-flow'));

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-[#F2542D] border border-orange-200/80 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2542D]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-orange-100 text-[#F2542D]' : 'bg-slate-100 text-slate-500'}`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Operator Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        {/* Tier badge & Trial Countdown */}
        <div className={`p-3 rounded-xl bg-white border shadow-xs space-y-1.5 ${
          isFreeTrial ? 'border-orange-200 bg-orange-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('Paket Berlangganan', 'Subscription')}</div>
              <div className="text-slate-900 font-bold flex items-center gap-1.5">
                <span>{user.tier === 'FREE_TRIAL' ? 'FREE TRIAL' : `${user.tier} PLAN`}</span>
              </div>
            </div>
            <button
              onClick={() => setView('checkout-pro')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2542D] text-white hover:bg-[#e04520] text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
            >
              <CreditCard className="w-3 h-3" />
              <span>{t('Beli Paket', 'Upgrade')}</span>
            </button>
          </div>

          {isFreeTrial && (
            <div className="flex items-center gap-1.5 text-[11px] text-orange-700 font-semibold pt-1 border-t border-orange-100">
              <Clock className="w-3.5 h-3.5 text-[#F2542D] shrink-0" />
              <span>
                {user.isTrialExpired 
                  ? t('Trial 7 Hari Kadaluarsa', '7-Day Trial Expired') 
                  : t(`Sisa Trial: ${user.trialDaysLeft ?? 7} Hari`, `Trial Left: ${user.trialDaysLeft ?? 7} Days`)}
              </span>
            </div>
          )}
        </div>

        {/* User Profile info */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            {user.avatar && user.avatar.startsWith('http') ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-orange-200 object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#F2542D] text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{user.name}</div>
              <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Google Auth
              </div>
            </div>
          </div>

          <button
            title={t('Keluar', 'Log Out')}
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
