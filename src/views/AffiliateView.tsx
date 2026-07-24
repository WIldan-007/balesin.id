import React, { useState } from 'react';
import { ViewMode, AffiliateNode } from '../types';
import { 
  Copy, 
  Check, 
  Download, 
  Award, 
  Users
} from 'lucide-react';

interface AffiliateViewProps {
  setView: (view: ViewMode) => void;
  affiliates: AffiliateNode[];
}

export const AffiliateView: React.FC<AffiliateViewProps> = ({ setView, affiliates }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const refLink = 'https://balesin.ai/ref/opt_042X';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Operator ID,Join Date,Tier,Status,Yield,LTV\n" + 
      affiliates.map(e => `${e.operatorId},${e.joinDate},${e.tier},${e.status},${e.yield},${e.lifetimeValue}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "balesin_affiliate_network.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              MITRA AFILIASI TERVERIFIKASI
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight mt-1">Program Afiliasi balesin.ai</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dapatkan komisi berulang (recurring) 30% seumur hidup untuk setiap pengguna yang Anda referensikan.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-[#0EA5E9]" />
          <span>Export Laporan CSV</span>
        </button>
      </div>

      {/* REFERRAL LINK WIDGET BANNER */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 font-heading">LINK REKOMENDASI UNIK ANDA</span>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">KOMISI 30% RECURRING</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={refLink}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#F2542D] font-mono text-sm focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Link Afiliasi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* COMMISSIONS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">TOTAL KOMISI TERCAIRKAN</div>
          <div className="text-3xl font-extrabold text-emerald-600 font-heading mt-1">
            Rp {affiliates.reduce((sum, a) => sum + (a.lifetimeValue || 0) * 15000, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Cair via Transfer Bank / E-Wallet</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">KOMISI PENDING</div>
          <div className="text-3xl font-extrabold text-[#0EA5E9] font-heading mt-1">
            Rp {affiliates.reduce((sum, a) => sum + (a.yield || 0) * 15000, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Cair setiap tanggal 1 awal bulan</div>
        </div>

        {/* Agency Tier Upgrade Card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-md">
          <div className="flex justify-between items-center text-xs">
            <span className="text-amber-400 font-extrabold font-heading">TINGKAT AGENCY VIP</span>
          </div>
          <p className="text-[11px] text-slate-300">Ajak 10+ pengguna aktif untuk membuka komisi VIP 40% seumur hidup.</p>
          <button 
            onClick={() => setView('checkout-pro')}
            className="px-3.5 py-1.5 rounded-lg bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-[11px] uppercase cursor-pointer"
          >
            Upgrade Mitra Agency
          </button>
        </div>

      </div>

      {/* REFERRAL NETWORK TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F2542D]" />
            Daftar Pengguna Yang Anda Referensikan
          </h2>
          <span className="text-xs font-semibold text-slate-500">{affiliates.length} Pengguna Terhubung</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">ID Pengguna</th>
                <th className="p-4">Tanggal Bergabung</th>
                <th className="p-4">Paket Langganan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Komisi Bulanan</th>
                <th className="p-4 text-right">Total LTV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {affiliates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 text-xs">Belum Ada Pengguna Referensi</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Bagikan link rekomendasi unik Anda di atas. Pengguna yang mendaftar melalui link Anda akan otomatis tercatat di sini.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                affiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 font-mono">{aff.operatorId}</td>
                    <td className="p-4 text-slate-500">{aff.joinDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-bold">
                        {aff.tier}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        aff.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-600">Rp {(aff.yield * 15000).toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-[#0EA5E9]">Rp {(aff.lifetimeValue * 15000).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
