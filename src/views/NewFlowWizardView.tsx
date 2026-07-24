import React, { useState } from 'react';
import { ViewMode, AutomationFlow } from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Cpu, 
  Instagram, 
  MessageSquare, 
  Video, 
  Globe, 
  Sparkles, 
  Terminal,
  Play
} from 'lucide-react';

interface NewFlowWizardViewProps {
  setView: (view: ViewMode) => void;
  onAddFlow: (newFlow: AutomationFlow) => void;
}

export const NewFlowWizardView: React.FC<NewFlowWizardViewProps> = ({ setView, onAddFlow }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [designation, setDesignation] = useState('IG_STORY_PROMO_V1');
  const [platform, setPlatform] = useState<'Instagram' | 'WhatsApp' | 'TikTok' | 'Webhook'>('Instagram');
  const [triggerType, setTriggerType] = useState('New Comment containing "#ALPHA"');

  const handleFinish = () => {
    const created: AutomationFlow = {
      id: `flw-${Date.now().toString().slice(-4)}`,
      designation,
      platform,
      triggerType,
      status: 'ACTIVE',
      totalReplies: 0,
      clicks: 0,
      efficiency: 100,
      createdAt: new Date().toISOString().split('T')[0],
      lastExecution: 'Just created',
    };

    onAddFlow(created);
    setView('flows');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans text-slate-700 py-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={() => setView('flows')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BATALKAN PENGATURAN</span>
        </button>

        <div className="text-xs text-[#F2542D] font-bold tracking-wider">WISARD ALUR BARU</div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-3.5 rounded-xl border text-center text-xs transition-all ${
          step === 1 ? 'bg-orange-50 border-[#F2542D] text-[#F2542D] font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="font-extrabold text-sm font-heading">LANGKAH 1</div>
          <div className="text-[11px]">IDENTITAS</div>
        </div>

        <div className={`p-3.5 rounded-xl border text-center text-xs transition-all ${
          step === 2 ? 'bg-orange-50 border-[#F2542D] text-[#F2542D] font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="font-extrabold text-sm font-heading">LANGKAH 2</div>
          <div className="text-[11px]">PLATFORM</div>
        </div>

        <div className={`p-3.5 rounded-xl border text-center text-xs transition-all ${
          step === 3 ? 'bg-orange-50 border-[#F2542D] text-[#F2542D] font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="font-extrabold text-sm font-heading">LANGKAH 3</div>
          <div className="text-[11px]">PEMICU</div>
        </div>
      </div>

      {/* STEP 1: IDENTITY */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading mb-1">1. IDENTITAS ALUR OTOMASI</h2>
            <p className="text-xs text-slate-500">Berikan nama atau kode unik untuk alur respons otomatis ini.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">NAMA ALUR / KODE PELACAKAN</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
              placeholder="Contoh: IG_PROMO_DISKO_JULI"
            />
          </div>

          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100 text-xs text-slate-600 space-y-1">
            <span className="text-[#F2542D] font-bold">INFORMASI:</span> Nama alur digunakan untuk membedakan statistik performa balasan dan pelacakan link.
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>LANJUT: PILIH PLATFORM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PLATFORM NODE */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading mb-1">2. PLATFORM TARGET</h2>
            <p className="text-xs text-slate-500">Pilih media sosial yang ingin Anda hubungkan dengan alur balasan AI ini.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <button
              onClick={() => setPlatform('Instagram')}
              className={`p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all ${
                platform === 'Instagram' ? 'bg-pink-50/70 border-pink-500 text-slate-900 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <Instagram className="w-6 h-6 text-pink-600" />
              <div className="font-extrabold text-sm font-heading">Instagram</div>
              <div className="text-[11px] text-slate-500 font-medium">Komentar & DM Otomatis</div>
            </button>

            <button
              onClick={() => setPlatform('WhatsApp')}
              className={`p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all ${
                platform === 'WhatsApp' ? 'bg-emerald-50/70 border-emerald-500 text-slate-900 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <div className="font-extrabold text-sm font-heading">WhatsApp</div>
              <div className="text-[11px] text-slate-500 font-medium">Auto-Reply Chat Pelanggan</div>
            </button>

            <button
              onClick={() => setPlatform('TikTok')}
              className={`p-5 rounded-2xl border text-left space-y-3 cursor-pointer transition-all ${
                platform === 'TikTok' ? 'bg-sky-50/70 border-sky-500 text-slate-900 font-bold shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
              }`}
            >
              <Video className="w-6 h-6 text-[#0EA5E9]" />
              <div className="font-extrabold text-sm font-heading">TikTok</div>
              <div className="text-[11px] text-slate-500 font-medium">Balasan Komentar VT</div>
            </button>

          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
            >
              KEMBALI
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>LANJUT: ATUR PEMICU</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TRIGGER LOGIC & INITIALIZE */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading mb-1">3. ATUR ATURAN PEMICU</h2>
            <p className="text-xs text-slate-500">Tentukan kata kunci atau kondisi yang akan mengaktifkan balasan otomatis dari AI.</p>
          </div>

          <div className="space-y-3">
            {[
              'Komentar Baru Mengandung "#PROMO"',
              'Pesan Langsung (DM) Mengandung "HARGA"',
              'Tag / Mention di IG Story',
              'Event Webhook "PROMO_FLASH"'
            ].map((trigger, idx) => (
              <label 
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  triggerType === trigger ? 'bg-orange-50/70 border-[#F2542D] text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="trigger"
                    checked={triggerType === trigger}
                    onChange={() => setTriggerType(trigger)}
                    className="accent-[#F2542D]"
                  />
                  <span className="text-xs font-bold">{trigger}</span>
                </div>
                <span className="text-[10px] text-[#F2542D] bg-orange-100/80 px-2.5 py-0.5 rounded-full font-bold">SIAP</span>
              </label>
            ))}
          </div>

          {/* Flow Schematic Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 font-mono">
            <div className="flex items-center justify-between text-[11px] text-[#F2542D] font-bold border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                RINGKASAN SKEMA ALUR
              </span>
              <span>NODE: {platform.toUpperCase()}_01</span>
            </div>
            <p>&gt; NAMA ALUR: <strong className="text-slate-900 font-bold">{designation}</strong></p>
            <p>&gt; PLATFORM: <strong className="text-pink-600 font-bold">{platform}</strong></p>
            <p>&gt; PEMICU: <strong className="text-[#0EA5E9] font-bold">{triggerType}</strong></p>
            <p className="text-emerald-600 font-bold">&gt; Status Agen Voice AI Gemini: SIAP AKTIF</p>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
            >
              KEMBALI
            </button>
            <button
              id="wizard-finish-btn"
              onClick={handleFinish}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>SIMPAN & DEPLOY ALUR</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
