import React, { useState } from 'react';
import { ViewMode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BalesinLogo } from '../components/BalesinLogo';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Instagram, 
  Video, 
  BarChart3, 
  Sparkles, 
  Check, 
  Globe, 
  Play, 
  Bot, 
  Send, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Layers, 
  ChevronDown, 
  Star,
  MessageCircle
} from 'lucide-react';

interface LandingViewProps {
  setView: (view: ViewMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ setView }) => {
  const { t } = useLanguage();

  // Pricing state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Interactive Demo state
  const [demoInput, setDemoInput] = useState('#HARGA');
  const [demoMessages, setDemoMessages] = useState([
    { sender: 'user', name: '@budi_rejeki', text: 'Halo admin, mau tanya harga paket reseller fashion brapa ya? #HARGA', time: 'Just now' },
    { sender: 'ai', name: 'balesin.ai Agent', text: 'Halo Kak Budi! 👋 Terima kasih sudah tertarik dengan Paket Reseller Fashion. Harga promo hari ini Rp299.000/bln + Gratis katalog & link toko otomatis. Cek katalog lengkap & order via link khusus ini ya: https://bls.ai/fashion-pro', time: '142ms' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSimulateDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim() || isTyping) return;

    const userText = demoInput;
    const newMsg = { sender: 'user', name: '@calon_buyer', text: userText, time: 'Just now' };
    setDemoMessages((prev) => [...prev, newMsg]);
    setDemoInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = 'Halo Kak! 👋 AI balesin.ai siap membalas otomatis 24/7. Cek detail penawaran menarik di link khusus ini: https://bls.ai/promo-spesial';
      if (userText.toLowerCase().includes('mau') || userText.toLowerCase().includes('order')) {
        aiResponse = 'Pesanan Kakak langsung diproses AI! 🚀 Silakan isi alamat pengiriman dan selesaikan pembayaran cepat via QRIS/VA di link ini: https://bls.ai/checkout-fast';
      } else if (userText.toLowerCase().includes('stok') || userText.toLowerCase().includes('ready')) {
        aiResponse = 'Stok terkonfirmasi READY 100%! Dapatkan potongan ongkir Rp15.000 khusus transaksi hari ini. Link order: https://bls.ai/ready-stok';
      }
      setDemoMessages((prev) => [...prev, { sender: 'ai', name: 'balesin.ai Agent', text: aiResponse, time: '110ms' }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-700 min-h-screen font-sans selection:bg-orange-500/20 selection:text-orange-600">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-semibold text-xs tracking-wide shadow-xs">
          <Sparkles className="w-4 h-4 text-[#F2542D] animate-spin" />
          <span>balesin.ai 2.4 — Generasi Baru AI Social Support & Automation</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-heading">
            {t('Ubah Setiap Komentar Jadi', 'Turn Every Comment Into')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2542D] via-orange-500 to-[#0EA5E9]">
              {t('Pelanggan Setia.', 'Customers.')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t(
              'Otomatisasi balasan komentar, DM Instagram, WhatsApp, TikTok & Telegram dengan Gemini AI. Respons 24/7 dalam hitungan detik untuk melejitkan penjualan.',
              'Automate comment replies, Instagram DMs, WhatsApp, TikTok & Telegram with Gemini AI. 24/7 instant response in milliseconds to skyrocket conversions.'
            )}
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            id="hero-get-started-btn"
            onClick={() => setView('terminal')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{t('Mulai Coba Gratis', 'Get Started Free')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            id="hero-watch-demo-btn"
            onClick={() => {
              const el = document.getElementById('interactive-demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
            <span>{t('Lihat Live Demo', 'Watch Demo')}</span>
          </button>
        </div>

        {/* Social Proof Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-700 font-bold ml-1.5">4.9/5</span>
          </div>
          <span>•</span>
          <span>Dipercaya 10.000+ Pebisnis Online & Brand Indonesia</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Tanpa Kartu Kredit
          </span>
        </div>

      </section>

      {/* LIVE METRICS DASHBOARD BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-4 pb-20">
        <div className="saas-card p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-8">
          
          {/* Top Live Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Komentar Terbalas</span>
                <MessageSquare className="w-4 h-4 text-[#F2542D]" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">1,482,920+</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24% bulan ini
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">38.4%</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12.5% vs Manual
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Avg Response Time</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">&lt; 0.2s</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Respon Otomatis 24/7</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Revenue Generated</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">Rp 4.2 Milar+</div>
              <div className="text-[11px] text-slate-500">Omzet terdeteksi via tracking link</div>
            </div>
          </div>

          {/* INTERACTIVE DEMO PREVIEW */}
          <div id="interactive-demo" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0EA5E9] font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>Simulasi AI Live Interactive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                Coba Ketik Komentar & Lihat Bagaimana AI Membalas
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Platform balesin.ai membaca keyword seperti <span className="font-semibold text-slate-900">#HARGA</span>, <span className="font-semibold text-slate-900">#MAUORDER</span>, atau pertanyaan natural pengguna, lalu merespons dengan pesan ramah & mengirimkan DM berisi link order khusus.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F2542D] flex items-center justify-center font-bold">1</span>
                  <span>Mendeteksi kata kunci & niat beli pelanggan secara instan</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-[#0EA5E9] flex items-center justify-center font-bold">2</span>
                  <span>Menerbitkan balasan publik & DM terpersonalisasi</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</span>
                  <span>Melacak klik & konversi penjualan dalam satu dashboard</span>
                </div>
              </div>
            </div>

            {/* Right Chat Demo Box */}
            <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-2xl border border-slate-800 space-y-4 text-left">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <BalesinLogo variant="icon" size="sm" />
                  <div>
                    <div className="text-xs font-bold text-white">balesin.ai AI Social Agent</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Gemini 2.5 Flash Active
                    </div>
                  </div>
                </div>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
                  Instagram & WA Cloud
                </span>
              </div>

              {/* Messages Container */}
              <div className="space-y-3 min-h-[200px] max-h-[260px] overflow-y-auto p-2 scrollbar-thin">
                {demoMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-1 ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 px-1 font-medium">
                      {msg.name} • {msg.time}
                    </div>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#F2542D] text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9] animate-spin" />
                    <span>balesin.ai Gemini AI sedang menyusun balasan...</span>
                  </div>
                )}
              </div>

              {/* Simulation Input Bar */}
              <form onSubmit={handleSimulateDemo} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Ketik komentar (misal: #HARGA, mau order, ready stok?)..."
                  className="flex-1 bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-[#F2542D] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="px-4 py-3 bg-[#F2542D] hover:bg-[#e04520] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Kirim</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS (3-STEP) SECTION */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="text-[#F2542D] font-bold text-xs uppercase tracking-widest">Alur Kerja Sederhana</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            3 Langkah Mudah Otomasi Penjualan
          </h2>
          <p className="text-slate-600 text-sm">
            Tanpa perlu koding atau pengetahuan teknis rumit. Hubungkan akun media sosial Anda dalam hitungan menit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="saas-card saas-card-hover p-8 text-left space-y-4 relative bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F2542D] flex items-center justify-center font-black text-xl font-heading">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Pelanggan Berkomentar</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Pelanggan meninggalkan komentar di postingan Instagram, Reel, TikTok, atau pesan WhatsApp Anda dengan kata kunci tertentu (misal: "harga", "#catalog").
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#F2542D]" />
              <span>"@user: Kak mau tanya harga kaos ini dong #HARGA"</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="saas-card saas-card-hover p-8 text-left space-y-4 relative bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0EA5E9] flex items-center justify-center font-black text-xl font-heading">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Gemini AI Memproses</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              AI balesin.ai menganalisis niat pembeli, mencocokkan dengan nada merek Anda, dan langsung menyusun jawaban publik serta DM terpersonalisasi.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
              <span>Memproses konteks & link order dalam 120ms</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="saas-card saas-card-hover p-8 text-left space-y-4 relative bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl font-heading">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">DM Terkirim & Terkonversi</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Sistem membalas komentar & mengirimkan DM berisi link produk khusus. Pembeli langsung dapat melakukan checkout dan konversi tercatat otomatis.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Link khusus dikirim via DM + Diskon otomatis</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-white rounded-3xl border border-slate-200/80 my-8 shadow-sm">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="text-[#0EA5E9] font-bold text-xs uppercase tracking-widest">Fitur Unggulan</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Ekosistem Otomasi Lengkap Untuk Bisnis Anda
          </h2>
          <p className="text-slate-600 text-sm">
            Semua kebutuhan interaksi pelanggan dan otomatisasi pemasaran dalam satu platform yang terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-orange-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F2542D] flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Instagram Comment & DM Automation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Balas komentar postingan dan Reel secara otomatis + kirim DM pesan pribadi langsung berisi info katalog dan link pembelian.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0EA5E9] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">WhatsApp Cloud AI Assistant</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Asisten AI WhatsApp yang mampu melayani pertanyaan calon pembeli 24 jam non-stop, mengecek katalog, dan mengarahkan ke form pemesanan.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">TikTok Viral Comment Reply</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tangkap minat ribuan penonton video viral TikTok Anda. Balas komentar FYP dengan rekomendasi produk secara otomatis.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-purple-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Visual Drag & Drop Workflow Builder</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Susun alur komunikasi kompleks dengan node visual sederhana. Tentukan pemicu, kondisi waktu, AI prompt, dan alur fallback.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Custom AI Brand Voice Persona</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Atur gaya bahasa AI (Formal, Ramah, Gaul, Profesional) agar balasan terasa otentik dan selaras dengan karakter bisnis Anda.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-rose-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Smart Link Shortener & Affiliate Analytics</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Buat link pendek otomatis dengan pelacakan klik, sumber media sosial, conversion rate, dan atribusi omzet bisnis secara rinci.
            </p>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="text-[#F2542D] font-bold text-xs uppercase tracking-widest">Pilihan Paket Transparan</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Investasi Terbaik Untuk Pertumbuhan Bisnis
          </h2>
          <p className="text-slate-600 text-sm">
            Pilih paket yang sesuai dengan skala bisnis Anda. Batalkan kapan saja tanpa biaya tersembunyi.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Bulanan
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 rounded-full bg-slate-200 p-1 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#F2542D] transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
              Tahunan
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                Hemat 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free / Starter */}
          <div className="saas-card p-8 rounded-2xl bg-white border border-slate-200 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-500 uppercase font-heading">STARTER FREE</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 font-heading">Rp 0</span>
                <span className="text-xs text-slate-500">/ selamanya</span>
              </div>
              <p className="text-xs text-slate-600">Cocok untuk mencoba fitur otomatisasi awal bisnis Anda.</p>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>500 Balasan Otomatis / bulan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 Koneksi Akun Instagram</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI Reply Standard Prompt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Laporan Statistik Dasar</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('terminal')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Mulai Gratis
            </button>
          </div>

          {/* Pro (Recommended) */}
          <div className="saas-card p-8 rounded-2xl bg-white border-2 border-[#F2542D] space-y-6 flex flex-col justify-between shadow-xl relative scale-105">
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F2542D] text-white font-bold text-[10px] uppercase tracking-wider">
              Paling Populer
            </div>

            <div className="space-y-4 pt-2">
              <div className="text-sm font-bold text-[#F2542D] uppercase font-heading">PRO AUTOMATOR</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 font-heading">
                  {billingCycle === 'yearly' ? 'Rp 249.000' : 'Rp 299.000'}
                </span>
                <span className="text-xs text-slate-500">/ bulan</span>
              </div>
              <p className="text-xs text-slate-600">Solusi lengkap pebisnis online yang ingin melejitkan omzet.</p>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>25.000 Balasan Otomatis / bulan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>3 Akun Instagram + 1 WA Cloud API</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>Gemini AI Smart Persona custom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>Visual Workflow Builder Unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#F2542D] shrink-0" />
                  <span>Short Link Tracking & Affiliate Engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('checkout-pro')}
              className="w-full py-3.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Langganan Paket Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="saas-card p-8 rounded-2xl bg-white border border-slate-200 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="text-sm font-bold text-[#0EA5E9] uppercase font-heading">ENTERPRISE SCALE</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 font-heading">
                  {billingCycle === 'yearly' ? 'Rp 799.000' : 'Rp 999.000'}
                </span>
                <span className="text-xs text-slate-500">/ bulan</span>
              </div>
              <p className="text-xs text-slate-600">Untuk brand besar & agency dengan volume percakapan tinggi.</p>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span>Unlimited Balasan Otomatis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span>Unlimited Multi-Channel (IG, WA, TikTok)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span>Dedicated Account Manager & Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span>SLA Ketersediaan 99.99%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView('checkout-pro')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Hubungi Tim Sales
            </button>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[#0EA5E9] font-bold text-xs uppercase tracking-widest">Pertanyaan Umum</div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Sering Ditanyakan (FAQ)
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Apakah akun Instagram atau WhatsApp saya aman dari pemblokiran?',
              a: 'Sangat aman. balesin.ai terhubung menggunakan API resmi Instagram Graph API dan WhatsApp Cloud API milik Meta. Kami mematuhi semua batasan rate-limit dan aturan resmi Meta.'
            },
            {
              q: 'Apakah saya membutuhkan keahlian koding untuk membuat alur otomasi?',
              a: 'Sama sekali tidak. Interface visual balesin.ai sangat intuitif. Anda dapat langsung menggunakan template alur yang sudah disediakan atau menyusun alur baru dengan drag & drop.'
            },
            {
              q: 'Bagaimana cara AI membalas pesan dengan akurat sesuai bisnis saya?',
              a: 'Anda bisa mengatur "AI Brand Voice" dan memberikan pengetahuan dasar produk (katalog, harga, aturan garansi, FAQ) di menu Pengaturan. AI akan menjawab berdasarkan acuan tersebut.'
            },
            {
              q: 'Apakah saya bisa membatalkan langganan kapan saja?',
              a: 'Ya, Anda bebas membatalkan langganan kapan saja langsung dari menu Billing tanpa syarat tersembunyi.'
            }
          ].map((item, idx) => (
            <div key={idx} className="saas-card rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#F2542D]' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#F2542D] to-orange-600 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto">
            <BalesinLogo variant="icon" size="lg" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Siap Mengubah Interaksi Sosmed Jadi Penjualan Otomatis?
          </h2>
          <p className="text-orange-100 text-sm max-w-xl mx-auto leading-relaxed">
            Bergabunglah sekarang dan rasakan kemudahan mengelola ribuan calon pembeli tanpa kelelahan membalas pesan manual.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('terminal')}
              className="px-8 py-4 rounded-xl bg-white text-[#F2542D] hover:bg-orange-50 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Mulai Uji Coba Gratis 14 Hari
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
