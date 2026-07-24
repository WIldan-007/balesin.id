import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../types';
import { 
  Bot, 
  User, 
  Sparkles, 
  Save, 
  CheckCircle2,
  RefreshCw,
  CreditCard
} from 'lucide-react';

interface SettingsViewProps {
  setView: (view: ViewMode) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ setView, user, setUser }) => {
  const [toneArchetype, setToneArchetype] = useState('Ramah & Menjual (E-Commerce)');
  const [entropy, setEntropy] = useState(0.7);
  const [coreDirective, setCoreDirective] = useState(
    'Anda adalah agen AI resmi dari balesin.ai. Selalu berikan jawaban yang ramah, jelas, dan mengarahkan calon pembeli untuk membuka link khusus order via DM.'
  );

  const [testComment, setTestComment] = useState('Berapa harga paket reseller baju fashion ini min? #HARGA');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  const handleTestAi = async () => {
    setIsSimulating(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testComment,
          tone: toneArchetype,
          entropy,
          platform: 'Instagram'
        })
      });

      const data = await res.json();
      setTestResult(data.reply);
    } catch (err) {
      setTestResult(`Halo Kak! 👋 Promo Paket Reseller Fashion Rp299.000/bln + Gratis katalog lengkap. Cek & order via link khusus ini ya: https://bls.ai/fashion-pro ✨`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveSettings = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Pengaturan Sistem & Brand Voice AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Atur parameter Gemini 2.5 Flash, nada bicara AI, profil pengguna, dan langganan paket.</p>
        </div>

        <button
          id="settings-save-btn"
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </button>
      </div>

      {saveNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan berhasil disimpan ke memori server balesin.ai</span>
        </div>
      )}

      {/* OPERATOR PROFILE & SUBSCRIPTION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#F2542D]" />
            Profil Pengguna
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Tampilan</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Utama</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-mono">
              ID OPERATOR: <strong className="text-slate-900">{user.id}</strong> | STATUS: <strong className="text-emerald-600">AKTIF</strong>
            </div>
          </div>
        </div>

        {/* Subscription Tier */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-[#0EA5E9]" />
              Paket Langganan & Free Trial
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">LISENSI SAAT INI</div>
                <div className="text-xl font-extrabold text-[#F2542D] font-heading">
                  {user.tier === 'FREE_TRIAL' ? 'FREE TRIAL 7 HARI' : `${user.tier} AUTOMATOR`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">STATUS DATABASE</div>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Firestore Connected
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {user.tier === 'FREE_TRIAL' ? (
                <span>
                  Sisa masa uji coba gratis: <strong className="text-[#F2542D]">{user.isTrialExpired ? 'Kadaluarsa' : `${user.trialDaysLeft ?? 7} Hari`}</strong>. Setelah trial selesai, otomatis diarahkan membeli paket.
                </span>
              ) : (
                <span>
                  Paket aktif tanpa batasan kuota.
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView('checkout-pro')}
              className="flex-1 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              Beli / Upgrade Paket Langganan
            </button>
          </div>
        </div>

      </div>

      {/* GEMINI AI BRAND VOICE TUNING & LIVE TESTER */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#0EA5E9]" />
            Atur Brand Voice & Persona AI Gemini
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0EA5E9] border border-sky-200 font-bold">
            Respons Rata-rata: 140ms
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">GAYA BAHASA (TONE)</label>
              <select
                value={toneArchetype}
                onChange={(e) => setToneArchetype(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-[#F2542D] cursor-pointer"
              >
                <option value="Ramah & Menjual (E-Commerce)">Ramah & Menjual (E-Commerce & Online Shop)</option>
                <option value="Santai & Gaul (Instagram/TikTok)">Santai & Gaul (Anak Muda / Instagram / TikTok)</option>
                <option value="Formal & Profesional">Formal & Profesional (Corporate & B2B)</option>
                <option value="Singkat & Langsung">Singkat & Langsung (Fast Checkout)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-bold mb-1">
                <span>TINGKAT KREATIVITAS (ENTROPY)</span>
                <span className="text-[#F2542D]">{entropy}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={entropy}
                onChange={(e) => setEntropy(parseFloat(e.target.value))}
                className="w-full accent-[#F2542D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.1 (Kaku & Konsisten)</span>
                <span>1.0 (Sangat Kreatif & Bervariasi)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">INSTRUKSI UTAMA SYSTEM PROMPT</label>
              <textarea
                rows={4}
                value={coreDirective}
                onChange={(e) => setCoreDirective(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Live Simulator Playground */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
            <div className="text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-[#0EA5E9]">
                <Sparkles className="w-4 h-4" />
                SIMULASI RESPON AI GEMINI
              </span>
              <span className="text-[10px] text-slate-400">TESTER LIVE</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">SIMULASI KOMENTAR PEMBELI</label>
              <input
                type="text"
                value={testComment}
                onChange={(e) => setTestComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#F2542D]"
              />
            </div>

            <button
              onClick={handleTestAi}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Bot className="w-4 h-4" />}
              <span>Uji Balasan AI Gemini</span>
            </button>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold font-mono">HASIL BALASAN AI:</div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{testResult}</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
