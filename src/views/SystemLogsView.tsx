import React, { useState, useMemo } from 'react';
import { ViewMode, SystemLog, UserProfile } from '../types';
import { exportLogsToCSV, exportLogsToPDF } from '../utils/exportUtils';
import { 
  Activity, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trash2, 
  Plus,
  ArrowLeft,
  Zap
} from 'lucide-react';

interface SystemLogsViewProps {
  logs: SystemLog[];
  setLogs?: React.Dispatch<React.SetStateAction<SystemLog[]>>;
  setView: (view: ViewMode) => void;
  user?: UserProfile;
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({ logs, setLogs, setView, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter logs based on search query and level filter
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.node.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [logs, searchQuery, levelFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleAddSimulatedLog = () => {
    if (!setLogs) return;
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: `${now} - Hari Ini`,
      level: 'SUCCESS',
      event: 'Pemicu Komentar IG "#PROMO" membalas pesan & DMs secara otomatis',
      node: 'Instagram @balesin_official'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    if (!setLogs) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh log aktivitas ini?')) {
      setLogs([]);
    }
  };

  const successCount = logs.filter(l => l.level === 'SUCCESS').length;
  const warningCount = logs.filter(l => l.level === 'WARNING' || l.level === 'ERROR').length;
  const infoCount = logs.filter(l => l.level === 'INFO').length;

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#F2542D] mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-[#F2542D]" />
            <span>Log Sistem & Telemetri Otomasi</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau dan ekspor seluruh riwayat balasan AI Gemini, webhook, dan eksekusi pemicu ke CSV atau PDF.
          </p>
        </div>

        {/* Action Buttons: Unduh CSV & Unduh PDF */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors cursor-pointer shadow-xs"
            title="Refresh Data Log"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F2542D]' : ''}`} />
          </button>

          {/* Download CSV Button */}
          <button
            onClick={() => exportLogsToCSV(filteredLogs)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            title="Ekspor Data Log ke Format CSV"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={() => exportLogsToPDF(filteredLogs, user?.name)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            title="Cetak & Ekspor Laporan Log ke Format PDF"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Entri Log</span>
          <div className="text-xl font-extrabold text-slate-900 font-heading">{logs.length}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 bg-emerald-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sukses
          </span>
          <div className="text-xl font-extrabold text-emerald-700 font-heading">{successCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-sky-200/80 bg-sky-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#0EA5E9] uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Info & Telemetri
          </span>
          <div className="text-xl font-extrabold text-[#0EA5E9] font-heading">{infoCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 bg-amber-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Warning / Isu
          </span>
          <div className="text-xl font-extrabold text-amber-700 font-heading">{warningCount}</div>
        </div>
      </div>

      {/* CONTROLS: SEARCH & FILTER LEVEL */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci, pemicu, atau node..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {(['ALL', 'SUCCESS', 'INFO', 'WARNING'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {lvl === 'ALL' ? 'Semua' : lvl}
            </button>
          ))}
        </div>

        {/* Secondary actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {setLogs && (
            <>
              <button
                onClick={handleAddSimulatedLog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#F2542D] font-bold text-xs border border-orange-200 transition-colors cursor-pointer"
                title="Tambah Log Simulasi Baru"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simulasi Log</span>
              </button>

              <button
                onClick={handleClearLogs}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                title="Bersihkan Log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

      </div>

      {/* SYSTEM LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header toolbar */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Menampilkan {filteredLogs.length} dari {logs.length} Log Aktivitas
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Format Ekspor: UTF-8 CSV & Printable PDF
          </span>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-6">Waktu Eksekusi</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-6">Aktivitas / Event Otomasi</th>
                <th className="py-3 px-6">Platform / Node</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Zap className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-xs">Tidak ada log ditemukan</p>
                      <p className="text-[11px]">Coba ubah kata kunci pencarian atau filter status yang Anda pilih.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.level === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.level === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        log.level === 'ERROR' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-sky-50 text-[#0EA5E9] border-sky-200'
                      }`}>
                        {log.level === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                        {log.level === 'WARNING' && <AlertCircle className="w-3 h-3" />}
                        {log.level === 'ERROR' && <AlertCircle className="w-3 h-3" />}
                        {log.level === 'INFO' && <Info className="w-3 h-3" />}
                        <span>{log.level}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-800">
                      {log.event}
                    </td>
                    <td className="py-3.5 px-6 text-[#0EA5E9] font-semibold whitespace-nowrap">
                      {log.node}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Otomasi dijalankan oleh engine AI Gemini 2.5 Flash Balesin.ai</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportLogsToCSV(filteredLogs)}
              className="text-emerald-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Filtered CSV ({filteredLogs.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={() => exportLogsToPDF(filteredLogs, user?.name)}
              className="text-[#F2542D] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ekspor Filtered PDF ({filteredLogs.length})</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
