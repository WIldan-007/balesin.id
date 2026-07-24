import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { ViewMode, UserProfile } from '../types';
import { BalesinLogo } from './BalesinLogo';

interface FooterProps {
  setView: (view: ViewMode) => void;
  user?: UserProfile;
}

export const Footer: React.FC<FooterProps> = ({ setView, user }) => {
  const handleProtectedView = (targetView: ViewMode) => {
    if (user?.isLoggedIn) {
      setView(targetView);
    } else {
      setView('terminal');
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-12 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="cursor-pointer" onClick={() => setView('landing')}>
            <BalesinLogo variant="full" size="md" />
          </div>
          <p className="text-slate-500 leading-relaxed text-xs">
            Platform AI Customer Support & Otomasi Media Sosial terdepan untuk Instagram, WhatsApp, TikTok, Telegram, & Discord.
          </p>
          <div className="text-[11px] text-slate-400">
            Ditenagai oleh <span className="text-[#0EA5E9] font-semibold">Gemini AI Engine</span>
          </div>
        </div>

        {/* Product Integrations */}
        <div>
          <h4 className="text-slate-900 font-bold mb-3 tracking-wider text-xs uppercase font-heading">Integrasi Platform</h4>
          <ul className="space-y-2">
            <li><button onClick={() => handleProtectedView('flows')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Instagram DM & Comment Auto-Reply</button></li>
            <li><button onClick={() => handleProtectedView('flows')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">WhatsApp Cloud AI Assistant</button></li>
            <li><button onClick={() => handleProtectedView('flows')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">TikTok Viral Comment Conversion</button></li>
            <li><button onClick={() => handleProtectedView('campaigns')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Smart Affiliate Short-Link Tracking</button></li>
          </ul>
        </div>

        {/* Platform Navigation */}
        <div>
          <h4 className="text-slate-900 font-bold mb-3 tracking-wider text-xs uppercase font-heading">Navigasi</h4>
          <ul className="space-y-2">
            <li><button onClick={() => handleProtectedView('dashboard')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Dashboard Utama</button></li>
            <li><button onClick={() => setView('affiliate')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Program Afiliasi (Komisi 30%)</button></li>
            <li><button onClick={() => setView('checkout-pro')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Paket Pricing & Lisensi</button></li>
            <li><button onClick={() => handleProtectedView('settings')} className="hover:text-[#F2542D] transition-colors text-left cursor-pointer">Pengaturan AI Brand Voice</button></li>
          </ul>
        </div>

        {/* Security & Enterprise Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5 text-[#0EA5E9]">
              <ShieldCheck className="w-4 h-4 text-[#0EA5E9]" />
              Keamanan Enterprise
            </span>
            <span className="text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">ISO Certified</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Semua koneksi API Instagram Graph & WhatsApp Cloud menggunakan enkripsi 256-bit dengan SLA ketersediaan 99.99%.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} balesin.ai Inc. Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-[#F2542D] fill-[#F2542D]" />
          <span>untuk bisnis Indonesia.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-[#F2542D] transition-colors">Kebijakan Privasi</a>
          <a href="#terms" className="hover:text-[#F2542D] transition-colors">Syarat & Ketentuan</a>
          <a href="#security" className="hover:text-[#F2542D] transition-colors">Pusat Keamanan</a>
        </div>
      </div>
    </footer>
  );
};

