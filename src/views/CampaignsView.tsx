import React, { useState } from 'react';
import { ViewMode, Campaign, ShortLink } from '../types';
import { 
  BarChart3, 
  Link, 
  Copy, 
  Check, 
  Plus, 
  Globe
} from 'lucide-react';

interface CampaignsViewProps {
  setView: (view: ViewMode) => void;
  campaigns: Campaign[];
  shortLinks: ShortLink[];
  onAddShortLink: (link: ShortLink) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ 
  setView, 
  campaigns, 
  shortLinks,
  onAddShortLink 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newSlug, setNewSlug] = useState('bls.ai/promo-spesial');
  const [newDestination, setNewDestination] = useState('https://balesin.ai/checkout');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ShortLink = {
      id: `link-${Date.now().toString().slice(-4)}`,
      slug: newSlug,
      url: `https://${newSlug}`,
      destination: newDestination,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddShortLink(created);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Pelacakan Kampanye & Short Link (bls.ai)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Pemendek link otomatis dengan atribusi penjualan, analisis CTR, dan statistik klik.</p>
        </div>

        <button
          id="campaigns-create-link-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Short Link Baru</span>
        </button>
      </div>

      {/* METRICS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">RATA-RATA CTR LINK</div>
          <div className="text-2xl font-extrabold text-[#F2542D] font-heading">{shortLinks.length > 0 ? '14,82%' : '0,00%'}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{shortLinks.length > 0 ? '+2.4% vs benchmark' : 'Siap Pelacakan'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">ATRIBUSI OMZET</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-heading">Rp {campaigns.reduce((sum, c) => sum + c.revenue * 15000, 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium">Periode 30 hari terakhir</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">TOTAL LINK TERLACAK</div>
          <div className="text-2xl font-extrabold text-purple-600 font-heading">{shortLinks.length} Link</div>
          <div className="text-[11px] text-[#0EA5E9] font-semibold">SSL HTTPS: Aktif</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">KECEPATAN REDIRECT</div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">&lt; 8ms</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Edge CDN Distributed</div>
        </div>
      </div>

      {/* CAMPAIGN DEPLOYMENTS TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F2542D]" />
            Daftar Kampanye Aktif
          </h2>
          <span className="text-xs font-semibold text-slate-500">{campaigns.length} Kampanye Berjalan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Nama Kampanye</th>
                <th className="p-4">Kode Pemicu</th>
                <th className="p-4 text-right">CTR (%)</th>
                <th className="p-4 text-right">Hasil Omzet</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Dibuat Pada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Belum ada kampanye aktif. Buat kampanye & link pendek pertama Anda di bawah.
                  </td>
                </tr>
              ) : (
                campaigns.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 font-heading">{cmp.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[#0EA5E9] font-mono font-bold">
                        {cmp.code}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-[#F2542D]">{cmp.ctr}%</td>
                    <td className="p-4 text-right font-bold text-emerald-600">Rp {(cmp.revenue * 15000).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cmp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {cmp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500">{cmp.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHORT LINK REPOSITORY & HEATMAP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Short Link List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Link className="w-4 h-4 text-purple-600" />
              Daftar Link Pendek (bls.ai/*)
            </h2>
            <span className="text-xs font-semibold text-slate-500">{shortLinks.length} Link Terdaftar</span>
          </div>

          <div className="space-y-3">
            {shortLinks.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">Belum ada link pendek (bls.ai/*) yang dibuat.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  + Buat Short Link Pertama
                </button>
              </div>
            ) : (
              shortLinks.map((link) => (
                <div key={link.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0EA5E9] font-mono text-sm">{link.slug}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                        {link.clicks.toLocaleString()} Klik
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-sm">
                      Tujuan: {link.destination}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(link.id, link.url)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-xs"
                    >
                      {copiedId === link.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Heatmap Widget */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#F2542D]" />
              Sebaran Trafik Pengunjung
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>INSTAGRAM DM & REELS</span>
              <span className="font-bold text-[#F2542D]">58%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#F2542D] w-[58%]" />
            </div>

            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>WHATSAPP CHAT ASSISTANT</span>
              <span className="font-bold text-emerald-600">28%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[28%]" />
            </div>

            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>TIKTOK FYP COMMENTS</span>
              <span className="font-bold text-[#0EA5E9]">14%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0EA5E9] w-[14%]" />
            </div>
          </div>
        </div>

      </div>

      {/* CREATE SHORT LINK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Buat Short Link Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">ALIAS SLUG SHORT LINK</label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL TUJUAN (TARGET)</label>
                <input
                  type="url"
                  required
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold cursor-pointer shadow-md"
                >
                  Buat Link Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
