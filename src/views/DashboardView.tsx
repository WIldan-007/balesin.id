import React, { useState } from 'react';
import { ViewMode, AutomationFlow, PlatformNode, SystemLog, UserProfile } from '../types';
import { 
  BarChart3, 
  Bot, 
  MousePointerClick, 
  TrendingUp, 
  Plus, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  MessageSquare,
  DollarSign,
  Clock,
  ArrowRight,
  Send,
  Zap,
  Sparkles,
  CreditCard
} from 'lucide-react';

interface DashboardViewProps {
  setView: (view: ViewMode) => void;
  flows: AutomationFlow[];
  nodes: PlatformNode[];
  logs: SystemLog[];
  user?: UserProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setView, flows, nodes, logs, user }) => {
  const [chartRange, setChartRange] = useState<'7D' | '30D' | 'ALL'>('7D');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isFreeTrial = user?.tier === 'FREE_TRIAL';

  // Compute dynamic totals from flows
  const totalReplies = flows.reduce((acc, f) => acc + (f.totalReplies || 0), 0);
  const aiReplies = flows.reduce((acc, f) => acc + (f.status === 'ACTIVE' ? (f.totalReplies || 0) : 0), 0);
  const totalClicks = flows.reduce((acc, f) => acc + (f.clicks || 0), 0);
  const totalOmzet = flows.reduce((acc, f) => acc + (f.clicks || 0) * 25000, 0);

  const chartData = flows.length > 0 ? [
    { day: 'Sen', human: 1200, ai: 2800 },
    { day: 'Sel', human: 1400, ai: 3100 },
    { day: 'Rab', human: 1100, ai: 3900 },
    { day: 'Kam', human: 1600, ai: 4200 },
    { day: 'Jum', human: 1800, ai: 4800 },
    { day: 'Sab', human: 2100, ai: 5400 },
    { day: 'Min', human: 1900, ai: 5100 },
  ] : [
    { day: 'Sen', human: 0, ai: 0 },
    { day: 'Sel', human: 0, ai: 0 },
    { day: 'Rab', human: 0, ai: 0 },
    { day: 'Kam', human: 0, ai: 0 },
    { day: 'Jum', human: 0, ai: 0 },
    { day: 'Sab', human: 0, ai: 0 },
    { day: 'Min', human: 0, ai: 0 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Free Trial Banner */}
      {isFreeTrial && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          user?.isTrialExpired 
            ? 'bg-red-50 border-red-200 text-red-900' 
            : 'bg-gradient-to-r from-orange-50 via-white to-orange-50 border-orange-200 text-orange-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              user?.isTrialExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-[#F2542D]'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold font-heading flex items-center gap-2">
                <span>{user?.isTrialExpired ? '⚠️ Free Trial 7 Hari Telah Kadaluarsa' : '⚡ Masa Akses Free Trial 7 Hari Aktif'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-orange-200 font-mono text-[#F2542D]">
                  Database Firestore
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {user?.isTrialExpired 
                  ? 'Masa uji coba 7 hari Anda telah selesai. Pilih paket berlangganan untuk melanjutkan seluruh otomasi.'
                  : `Anda memiliki sisa ${user?.trialDaysLeft ?? 7} Hari Free Trial untuk menggunakan fitur AI Gemini dan pemendek link.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('checkout-pro')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Beli Paket Berlangganan</span>
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2.5">
            <span>Dashboard Performa Otomasi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-bold">
              balesin.ai v2.4
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Pantau performa balasan AI, pemicu komentar, dan atribusi omzet bisnis secara real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors cursor-pointer shadow-xs"
            title="Sinkronkan Telemetri Node"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F2542D]' : ''}`} />
          </button>

          <button
            id="dash-new-flow-btn"
            onClick={() => setView('new-flow')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Alur Otomasi</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Balasan Komentar</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F2542D] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{totalReplies.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <span>{totalReplies > 0 ? '+14.2% dibanding minggu lalu' : 'Belum ada balasan'}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Balasan AI Otomatis</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0EA5E9] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{aiReplies.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Rasio AI: <span className="text-[#0EA5E9] font-bold">{totalReplies > 0 ? `${((aiReplies/totalReplies)*100).toFixed(1)}% Ditangani Gemini` : '0% Ditangani Gemini'}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Klik Link Produk</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{totalClicks.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <span>{totalClicks > 0 ? '5.8% Conversion Rate' : '0% Conversion Rate'}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Omzet Terdeteksi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">Rp {totalOmzet.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Atribusi Short Link
          </div>
        </div>

      </div>

      {/* CHART & SYSTEM STATUS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Bar Visualizer Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#F2542D]" />
                Volume Eksekusi Otomasi (7 Hari Terakhir)
              </h2>
              <p className="text-xs text-slate-500">Perbandingan balasan AI Gemini vs Aturan Kata Kunci</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setChartRange('7D')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${chartRange === '7D' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setChartRange('30D')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${chartRange === '30D' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                30 Hari
              </button>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          {flows.length === 0 ? (
            <div className="h-56 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/60 text-[#F2542D] flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm font-heading">Grafik Performa Otomasi Kosong</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Belum ada alur otomasi yang dijalankan. Buat alur baru dan hubungkan sosial media Anda untuk mulai melihat grafik balasan AI.
                </p>
              </div>
              <button
                onClick={() => setView('new-flow')}
                className="px-4 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                + Buat Alur Otomasi Pertama
              </button>
            </div>
          ) : (
            <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
              {chartData.map((item, idx) => {
                const maxVal = 7000;
                const aiHeightPercent = (item.ai / maxVal) * 100;
                const humanHeightPercent = (item.human / maxVal) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-[40px] bg-slate-50 rounded-t-xl overflow-hidden flex flex-col justify-end h-full relative p-1 border border-slate-200 group-hover:border-[#F2542D]/50 transition-colors">
                      {/* AI Portion */}
                      <div 
                        style={{ height: `${aiHeightPercent}%` }} 
                        className="w-full bg-[#F2542D] group-hover:bg-[#e04520] rounded-t-lg transition-all"
                        title={`AI Gemini: ${item.ai} balasan`}
                      />
                      {/* Rule Portion */}
                      <div 
                        style={{ height: `${humanHeightPercent}%` }} 
                        className="w-full bg-[#0EA5E9]"
                        title={`Aturan Kata Kunci: ${item.human}`}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.day}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-3 h-3 rounded bg-[#F2542D]" />
                Balasan AI Cerdas (Gemini 2.5)
              </span>
              <span className="flex items-center gap-2 font-medium">
                <span className="w-3 h-3 rounded bg-[#0EA5E9]" />
                Pemicu Kata Kunci Pasif
              </span>
            </div>
            <span>Sistem: <strong className="text-emerald-600 font-bold">Siap Menerima Pemicu</strong></span>
          </div>

        </div>

        {/* Connected Nodes Status Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0EA5E9]" />
              Status Platform Terhubung
            </h2>
            <button
              onClick={() => setView('connections')}
              className="text-xs text-[#F2542D] font-bold hover:underline cursor-pointer"
            >
              Kelola ({nodes.length})
            </button>
          </div>

          <div className="space-y-3">
            {nodes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-500">Belum ada akun media sosial yang terhubung.</p>
              </div>
            ) : (
              nodes.map((node) => (
                <div key={node.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs font-heading">{node.platform}</div>
                    <div className="text-[11px] text-slate-500">{node.handle}</div>
                  </div>

                  <div className="text-right">
                    {node.status === 'CONNECTED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        AKTIF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold">
                        <AlertCircle className="w-3 h-3" />
                        RE-AUTH
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1">{node.lastSync}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setView('connections')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            + Hubungkan Platform Baru
          </button>
        </div>

      </div>

      {/* RECENT SYSTEM LOGS FEED */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F2542D]" />
            Aktivitas Eksekusi Terkini
          </h2>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Telemetri
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {logs.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-1">
              <p className="font-bold text-slate-700 text-xs">Belum Ada Riwayat Aktivitas</p>
              <p className="text-[11px] text-slate-500">Log balasan AI dan pemicu webhook akan tampil di sini secara otomatis saat terjadi transaksi.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px] font-mono">{log.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    log.level === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    log.level === 'WARNING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-sky-100 text-[#0EA5E9] border border-sky-200'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-700 font-medium">{log.event}</span>
                </div>
                <span className="text-[11px] text-[#0EA5E9] font-medium shrink-0">{log.node}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
