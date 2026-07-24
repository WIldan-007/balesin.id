import React, { useState } from 'react';
import { ViewMode, AutomationFlow } from '../types';
import { 
  Workflow, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  Instagram, 
  MessageSquare, 
  Video, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface FlowsViewProps {
  setView: (view: ViewMode) => void;
  flows: AutomationFlow[];
  setFlows: React.Dispatch<React.SetStateAction<AutomationFlow[]>>;
  setSelectedFlowForEdit: (flow: AutomationFlow | null) => void;
}

export const FlowsView: React.FC<FlowsViewProps> = ({ 
  setView, 
  flows, 
  setFlows,
  setSelectedFlowForEdit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleToggleStatus = (id: string) => {
    setFlows(flows.map(f => {
      if (f.id === id) {
        return { ...f, status: f.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' };
      }
      return f;
    }));
  };

  const handleDeleteFlow = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus alur otomasi ini?')) {
      setFlows(flows.filter(f => f.id !== id));
    }
  };

  const filteredFlows = flows.filter(f => {
    const matchesSearch = f.designation.toLowerCase().includes(searchTerm.toLowerCase()) || f.triggerType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || f.platform === platformFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2.5">
            <span>Daftar Alur Otomasi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-bold">
              {flows.length} Alur Terpasang
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Atur kata kunci pemicu, alur balasan AI Gemini, dan pemicu DM otomatis.</p>
        </div>

        <button
          id="flows-new-flow-btn"
          onClick={() => setView('new-flow')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Alur Otomasi Baru</span>
        </button>
      </div>

      {/* METRIC HEADER SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">ALUR AKTIF</div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{flows.filter(f => f.status === 'ACTIVE').length} Alur</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{flows.length > 0 ? 'Capacity 100% Normal' : 'Siap Dikonfigurasi'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">TOTAL BALASAN DISPENSASI</div>
          <div className="text-2xl font-extrabold text-[#F2542D] font-heading">{flows.reduce((a, b) => a + (b.totalReplies || 0), 0).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{flows.length > 0 ? '+18% bulan ini' : '0 balasan'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">KLIK LINK AFILIASI</div>
          <div className="text-2xl font-extrabold text-purple-600 font-heading">{flows.reduce((a, b) => a + (b.clicks || 0), 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium">CTR Rata-rata: {flows.length > 0 ? '14.8%' : '0%'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">TINGKAT KEBERHASILAN</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-heading">{flows.length > 0 ? '99,8%' : '100% Ready'}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Zero Failure SLA</div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari nama alur atau pemicu kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-[#F2542D] cursor-pointer"
            >
              <option value="ALL">Semua Platform</option>
              <option value="Instagram">Instagram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-[#F2542D] cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="PAUSED">Dihentikan</option>
            </select>
          </div>
        </div>

      </div>

      {/* FLOWS TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Nama Alur Otomasi</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Pemicu Aturan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total Balasan</th>
                <th className="p-4 text-right">Klik Link</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFlows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F2542D] flex items-center justify-center border border-orange-200/60">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-sm font-heading">Belum Ada Alur Otomasi</h3>
                        <p className="text-xs text-slate-500 max-w-md">
                          Buat alur pertama Anda untuk mengotomatiskan komentar Instagram, pesan WhatsApp, atau pemicu kata kunci TikTok dengan AI Gemini.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFlowForEdit(null);
                          setView('new-flow');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        + Buat Alur Otomasi Baru
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFlows.map((flow) => (
                <tr key={flow.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Flow Name */}
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F2542D]" />
                      <span className="hover:text-[#F2542D] cursor-pointer font-heading" onClick={() => {
                        setSelectedFlowForEdit(flow);
                        setView('builder');
                      }}>
                        {flow.designation}
                      </span>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      flow.platform === 'Instagram' ? 'bg-pink-50 text-pink-700 border border-pink-200' :
                      flow.platform === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-sky-50 text-[#0EA5E9] border border-sky-200'
                    }`}>
                      {flow.platform === 'Instagram' && <Instagram className="w-3 h-3" />}
                      {flow.platform === 'WhatsApp' && <MessageSquare className="w-3 h-3" />}
                      {flow.platform === 'TikTok' && <Video className="w-3 h-3" />}
                      {flow.platform}
                    </span>
                  </td>

                  {/* Trigger */}
                  <td className="p-4 text-slate-700">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium">
                      {flow.triggerType}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(flow.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                        flow.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {flow.status === 'ACTIVE' ? (
                        <>
                          <Play className="w-3 h-3 fill-emerald-600" />
                          <span>AKTIF</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>DIHENTIKAN</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Replies */}
                  <td className="p-4 text-right font-bold text-slate-900">
                    {flow.totalReplies.toLocaleString()}
                  </td>

                  {/* Clicks */}
                  <td className="p-4 text-right font-bold text-[#0EA5E9]">
                    {flow.clicks.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Edit Canvas Alur"
                        onClick={() => {
                          setSelectedFlowForEdit(flow);
                          setView('builder');
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Hapus Alur"
                        onClick={() => handleDeleteFlow(flow.id)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredFlows.length} dari {flows.length} alur</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer">PREV</button>
            <span className="px-2 font-bold text-[#F2542D]">HALAMAN 1 / 1</span>
            <button className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer">NEXT</button>
          </div>
        </div>

      </div>

    </div>
  );
};
