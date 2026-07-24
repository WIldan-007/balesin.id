import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BalesinLogo } from '../components/BalesinLogo';
import { loginWithGoogle } from '../services/authService';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface TerminalViewProps {
  setView: (view: ViewMode) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ setView, setUser }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userProfile = await loginWithGoogle();
      setUser(userProfile);

      if (userProfile.isTrialExpired) {
        // Direct to upgrade page if trial has ended
        setView('checkout-plus');
      } else {
        setView('dashboard');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login ditutup sebelum selesai. Silakan coba lagi.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Popup terblokir browser. Izinkan popup untuk melanjutkan login Google.');
      } else {
        setErrorMessage(err.message || 'Gagal masuk dengan Google. Silakan pastikan koneksi internet stabil.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between font-sans relative selection:bg-orange-500/20 selection:text-orange-600">
      
      {/* Top Bar */}
      <div className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#F2542D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Database Firestore & Google Auth Siap</span>
        </div>
      </div>

      {/* Center Card / Split Layout */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Brand Illustration / Info Column */}
          <div className="p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="cursor-pointer" onClick={() => setView('landing')}>
                <BalesinLogo variant="full" size="lg" />
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-2xl font-extrabold font-heading text-white">
                  Otomasi Komentar & Chat AI Terdepan
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Masuk dengan akun Google Anda untuk memulai **Free Trial 7 Hari** akses penuh ke seluruh modul otomatisasi balesin.ai.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>Merespons balasan dalam &lt;140ms 24/7</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span>Integrasi resmi Meta Instagram & WhatsApp Cloud API</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Trial 7 Hari Otomatis Tersimpan di Database</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Otentikasi Google Auth aman terhubung ke database cloud.</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-white">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-slate-900 font-heading">Masuk ke Dashboard</h1>
              <p className="text-xs text-slate-500">Otentikasi aman via Google Account</p>
            </div>

            {/* Trial Banner highlight */}
            <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-xs text-orange-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#F2542D]">
                <span>✨ Akses Free Trial 7 Hari</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Setiap pengguna baru langsung mendapatkan trial 7 hari gratis. Setelah trial berakhir, pengguna diarahkan memilih paket berlangganan.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google Auth Primary Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F2542D]" />
                  <span>Menghubungkan Akun Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.8-1.5-1.2-3.3-1.2-5z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                  </svg>
                  <span>Masuk / Daftar dengan Google</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Data Anda akan tersimpan dengan aman di database Firestore. Dengan melanjutkan, Anda menyetujui <a href="#terms" className="text-[#0EA5E9] font-medium hover:underline">Syarat Ketentuan</a>.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-4 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} balesin.ai Inc. Hak cipta dilindungi undang-undang.
      </div>

    </div>
  );
};

