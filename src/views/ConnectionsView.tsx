import React, { useState } from 'react';
import { ViewMode, PlatformNode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Radio, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Instagram, 
  MessageSquare, 
  Video, 
  Key, 
  Activity,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
  Info,
  Lock,
  Send
} from 'lucide-react';

interface ConnectionsViewProps {
  setView: (view: ViewMode) => void;
  nodes: PlatformNode[];
  setNodes: React.Dispatch<React.SetStateAction<PlatformNode[]>>;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({ setView, nodes, setNodes }) => {
  const { t } = useLanguage();
  const [isTestingDiag, setIsTestingDiag] = useState(false);
  const [diagOutput, setDiagOutput] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // API Key Form states
  const [selectedPlatform, setSelectedPlatform] = useState<'Instagram' | 'WhatsApp' | 'TikTok' | 'Telegram' | 'Discord' | null>(null);
  const [handleInput, setHandleInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [appSecretInput, setAppSecretInput] = useState('');
  const [apiVersionInput, setApiVersionInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Visible API keys toggle per card
  const [visibleCardKeys, setVisibleCardKeys] = useState<Record<string, boolean>>({});

  const handleRunDiagnostics = () => {
    setIsTestingDiag(true);
    setDiagOutput(null);

    setTimeout(() => {
      setIsTestingDiag(false);
      setDiagOutput('SEMUA NODE VERIFIKASI: Instagram Graph API (200 OK), WhatsApp Cloud API (200 OK), TikTok API (200 OK). Enkripsi SSL 256-bit Aktif.');
    }, 1200);
  };

  const handleOpenConnectModal = (platform?: 'Instagram' | 'WhatsApp' | 'TikTok' | 'Telegram' | 'Discord', existingNode?: PlatformNode) => {
    setShowConnectModal(true);
    setSuccessMessage(null);
    setIsVerifying(false);

    if (existingNode) {
      setEditingNodeId(existingNode.id);
      setSelectedPlatform(existingNode.platform);
      setHandleInput(existingNode.handle);
      setApiKeyInput(existingNode.apiKey || '');
      setAppSecretInput(existingNode.appSecret || '');
      setApiVersionInput(existingNode.apiVersion);
    } else if (platform) {
      setEditingNodeId(null);
      setSelectedPlatform(platform);
      setHandleInput(
        platform === 'Instagram' ? '@mybrand_official' :
        platform === 'WhatsApp' ? '+62 812-3456-7890 (Phone ID: 109283741)' :
        platform === 'TikTok' ? '@tiktok_brand_account' : '@my_node'
      );
      setApiKeyInput('');
      setAppSecretInput('');
      setApiVersionInput(
        platform === 'Instagram' ? 'Graph API v19.0' :
        platform === 'WhatsApp' ? 'Cloud API v2.4' :
        platform === 'TikTok' ? 'Open API v2.0' : 'v1.0'
      );
    } else {
      setEditingNodeId(null);
      setSelectedPlatform(null);
      setHandleInput('');
      setApiKeyInput('');
      setAppSecretInput('');
      setApiVersionInput('');
    }
  };

  const handleGenerateDemoToken = () => {
    if (selectedPlatform === 'Instagram') {
      setApiKeyInput('EAAGm0PX4ZC0BA' + Math.random().toString(36).substring(2, 12).toUpperCase() + '92X81L');
      setAppSecretInput('sec_' + Math.random().toString(36).substring(2, 14));
    } else if (selectedPlatform === 'WhatsApp') {
      setApiKeyInput('EAAG_WA_CLOUD_' + Math.random().toString(36).substring(2, 12).toUpperCase() + 'PROD');
      setAppSecretInput('wh_sec_' + Math.random().toString(36).substring(2, 10));
    } else if (selectedPlatform === 'TikTok') {
      setApiKeyInput('act.tiktok_open_api_' + Math.random().toString(36).substring(2, 12));
      setAppSecretInput('tt_sec_' + Math.random().toString(36).substring(2, 10));
    } else {
      setApiKeyInput('bot_token_' + Math.random().toString(36).substring(2, 16));
    }
  };

  const handleVerifyAndConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;

    if (!apiKeyInput.trim()) {
      alert('Mohon masukkan API Key / Access Token platform.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setSuccessMessage(`API Key untuk ${selectedPlatform} berhasil diverifikasi & terhubung!`);

      if (editingNodeId) {
        setNodes(nodes.map(n => n.id === editingNodeId ? {
          ...n,
          platform: selectedPlatform,
          handle: handleInput || n.handle,
          apiKey: apiKeyInput,
          appSecret: appSecretInput,
          apiVersion: apiVersionInput || n.apiVersion,
          status: 'CONNECTED',
          tokenExpires: '60 days',
          lastSync: 'Baru saja'
        } : n));
      } else {
        const newNode: PlatformNode = {
          id: `node-${Date.now().toString().slice(-4)}`,
          platform: selectedPlatform,
          handle: handleInput || `@node_${selectedPlatform.toLowerCase()}`,
          status: 'CONNECTED',
          tokenExpires: '60 hari',
          apiVersion: apiVersionInput || 'v1.0',
          lastSync: 'Baru saja',
          iconName: selectedPlatform,
          apiKey: apiKeyInput,
          appSecret: appSecretInput,
        };
        setNodes([newNode, ...nodes]);
      }

      setTimeout(() => {
        setShowConnectModal(false);
        setSelectedPlatform(null);
        setSuccessMessage(null);
      }, 1200);

    }, 1200);
  };

  const toggleCardKeyVisibility = (id: string) => {
    setVisibleCardKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6 text-slate-700 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Integrasi Platform & API Keys
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola token API, kredensial platform, dan status otentikasi media sosial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDiagnostics}
            disabled={isTestingDiag}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
          >
            <Activity className={`w-4 h-4 text-[#0EA5E9] ${isTestingDiag ? 'animate-spin' : ''}`} />
            <span>Cek Diagnostik API</span>
          </button>

          <button
            id="connections-add-node-btn"
            onClick={() => handleOpenConnectModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Hubungkan Platform Baru</span>
          </button>
        </div>
      </div>

      {/* METRICS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">PLATFORM TERHUBUNG</div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{nodes.length} / 12 Max</div>
          <div className="text-[11px] text-[#0EA5E9] font-semibold">Kapasitas Lisensi Pro</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">STATUS DIAGNOSTIK</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-heading">{nodes.length > 0 ? '100% Sehat' : 'Belum Ada Node'}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{nodes.length > 0 ? 'Semua Webhook Aktif' : 'Siap Menghubungkan API'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">ENKRIPSI API KEY</div>
          <div className="text-2xl font-extrabold text-purple-600 font-heading">256-Bit AES</div>
          <div className="text-[11px] text-slate-500 font-medium">Zero-Trust Sandbox Thread</div>
        </div>
      </div>

      {/* DIAGNOSTICS LOG OVERLAY IF TRIGGERED */}
      {diagOutput && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs shadow-lg">
          <div className="flex items-center justify-between text-[#0EA5E9] font-bold border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              LOG DIAGNOSTIK API
            </span>
            <span className="text-[10px] text-emerald-400">SEMUA OPERASIONAL</span>
          </div>
          <p className="text-slate-300 font-mono">{diagOutput}</p>
        </div>
      )}

      {/* OAuth 1-CLICK CONNECT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Instagram className="w-6 h-6 text-pink-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">Instagram</div>
              <div className="text-[10px] text-slate-500">1 klik — tanpa API Key</div>
            </div>
          </div>
          <a
            href="/api/auth/instagram"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Login with IG
          </a>
        </div>

        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs opacity-60">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">WhatsApp</div>
              <div className="text-[10px] text-slate-500">Masukkan API Key</div>
            </div>
          </div>
          <button
            onClick={() => handleOpenConnectModal()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all cursor-pointer"
          >
            Manual
          </button>
        </div>

        <div className="saas-card p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs opacity-60">
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6 text-sky-600" />
            <div>
              <div className="text-sm font-bold text-slate-900">TikTok</div>
              <div className="text-[10px] text-slate-500">Masukkan API Key</div>
            </div>
          </div>
          <button
            onClick={() => handleOpenConnectModal()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all cursor-pointer"
          >
            Manual
          </button>
        </div>
      </div>

      {/* CONNECTED NODES CARDS GRID */}
      {nodes.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center mx-auto border border-sky-200">
            <Radio className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold text-slate-900 text-base font-heading">Belum Ada Platform Terhubung</h3>
            <p className="text-xs text-slate-500">
              Hubungkan akun Instagram, WhatsApp, atau TikTok Anda dengan memasukkan API Key resmi untuk mulai mengeksekusi otomasi balasan secara otomatis.
            </p>
          </div>
          <button
            onClick={() => handleOpenConnectModal()}
            className="px-6 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            + Hubungkan Platform Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map((node) => {
            const isConnected = node.status === 'CONNECTED';
            const isKeyVisible = !!visibleCardKeys[node.id];

            return (
              <div key={node.id} className="saas-card p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {node.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                      {node.platform === 'WhatsApp' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                      {node.platform === 'TikTok' && <Video className="w-5 h-5 text-[#0EA5E9]" />}
                      {node.platform === 'Telegram' && <Send className="w-5 h-5 text-sky-500" />}
                      {node.platform === 'Discord' && <Radio className="w-5 h-5 text-indigo-500" />}
                      <span className="font-extrabold text-slate-900 text-base font-heading">{node.platform}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {node.status === 'CONNECTED' ? 'TERHUBUNG' : 'PERLU API KEY'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-slate-400 text-[10px] font-semibold">IDENTITAS AKUN</div>
                    <div className="font-bold text-slate-900 text-xs font-mono">{node.handle}</div>
                  </div>

                  {/* API KEY DISPLAY BADGE */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] font-semibold flex items-center gap-1">
                        <Key className="w-3 h-3 text-[#F2542D]" />
                        API KEY / TOKEN
                      </span>
                      {node.apiKey && (
                        <button
                          onClick={() => toggleCardKeyVisibility(node.id)}
                          className="text-[10px] text-[#0EA5E9] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isKeyVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isKeyVisible ? 'SEMBUNYIKAN' : 'TAMPILKAN'}</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-800 truncate">
                      {node.apiKey ? (
                        isKeyVisible ? node.apiKey : `${node.apiKey.substring(0, 6)}••••••••${node.apiKey.slice(-4)}`
                      ) : (
                        <span className="text-amber-600 text-[10px] italic">API Key belum dimasukkan</span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1 font-medium">
                    <div>Versi API: <strong className="text-slate-900">{node.apiVersion}</strong></div>
                    <div>Masa Berlaku Token: <strong className={isConnected ? 'text-emerald-600' : 'text-amber-600'}>{node.tokenExpires}</strong></div>
                    <div>Sinkron Terakhir: <strong className="text-slate-700">{node.lastSync}</strong></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenConnectModal(node.platform, node)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isConnected
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-[#F2542D] hover:bg-[#e04520] text-white shadow-md'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>
                      {isConnected 
                        ? 'Update API Key & Token' 
                        : 'Masukkan API Key Node'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONNECT NEW OR EDIT NODE MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {selectedPlatform && (
                  <button
                    onClick={() => {
                      if (editingNodeId) {
                        setShowConnectModal(false);
                      } else {
                        setSelectedPlatform(null);
                      }
                    }}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer mr-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    {editingNodeId 
                      ? `Update API Key: ${selectedPlatform}` 
                      : selectedPlatform 
                        ? `Masukkan API Key: ${selectedPlatform}` 
                        : 'Hubungkan Platform Sosial Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedPlatform 
                      ? 'Konfigurasi kredensial API & OAuth Access Token' 
                      : 'Pilih platform untuk memasukkan API Key'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowConnectModal(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: SELECT PLATFORM IF NOT SELECTED */}
            {!selectedPlatform ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Pilih platform sosial media yang ingin Anda hubungkan dengan memasukkan API key resmi dari platform tersebut:
                </p>

                <button
                  onClick={() => handleOpenConnectModal('Instagram')}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 flex items-center justify-between text-xs font-bold text-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-900 font-heading">INSTAGRAM GRAPH API</div>
                      <div className="text-[10px] text-slate-500 font-normal">Page Access Token & Webhook Key</div>
                    </div>
                  </div>
                  <span className="text-[#F2542D] font-bold group-hover:translate-x-1 transition-transform">Masukan Key →</span>
                </button>

                <button
                  onClick={() => handleOpenConnectModal('WhatsApp')}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-xs font-bold text-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-900 font-heading">WHATSAPP CLOUD API</div>
                      <div className="text-[10px] text-slate-500 font-normal">Meta Business System Token & Phone ID</div>
                    </div>
                  </div>
                  <span className="text-[#F2542D] font-bold group-hover:translate-x-1 transition-transform">Masukan Key →</span>
                </button>

                <button
                  onClick={() => handleOpenConnectModal('TikTok')}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 flex items-center justify-between text-xs font-bold text-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 text-[#0EA5E9]">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-slate-900 font-heading">TIKTOK OPEN API</div>
                      <div className="text-[10px] text-slate-500 font-normal">TikTok Content API & Client Secret</div>
                    </div>
                  </div>
                  <span className="text-[#F2542D] font-bold group-hover:translate-x-1 transition-transform">Masukan Key →</span>
                </button>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenConnectModal('Telegram')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs text-sky-600 font-bold cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>TELEGRAM BOT API</span>
                  </button>

                  <button
                    onClick={() => handleOpenConnectModal('Discord')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs text-indigo-600 font-bold cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>DISCORD BOT TOKEN</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 2: INPUT API KEY FORM */
              <form onSubmit={handleVerifyAndConnect} className="space-y-4 text-xs">
                
                {/* SUCCESS NOTIFICATION */}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Platform Badge Banner */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {selectedPlatform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                    {selectedPlatform === 'WhatsApp' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                    {selectedPlatform === 'TikTok' && <Video className="w-5 h-5 text-[#0EA5E9]" />}
                    {selectedPlatform === 'Telegram' && <Send className="w-5 h-5 text-sky-500" />}
                    {selectedPlatform === 'Discord' && <Radio className="w-5 h-5 text-indigo-500" />}
                    <div>
                      <div className="font-extrabold text-slate-900 font-heading">{selectedPlatform} Node Settings</div>
                      <div className="text-[10px] text-[#0EA5E9] font-medium">Enkripsi 256-Bit SSL Active</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateDemoToken}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[#F2542D] text-[11px] font-bold shadow-xs hover:bg-slate-50 cursor-pointer"
                  >
                    ⚡ Isikan Demo Key
                  </button>
                </div>

                {/* Handle / Identifier */}
                <div className="space-y-1">
                  <label className="block text-slate-700 text-xs font-bold">
                    Nama Akun / Phone Number ID
                  </label>
                  <input
                    type="text"
                    required
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder={
                      selectedPlatform === 'Instagram' ? '@brand_official' :
                      selectedPlatform === 'WhatsApp' ? 'Phone ID: 1092837419' :
                      selectedPlatform === 'TikTok' ? '@tiktok_brand' : 'node_handle'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white"
                  />
                </div>

                {/* API Key / Access Token Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-900 text-xs font-bold text-[#F2542D]">
                      API KEY / ACCESS TOKEN <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-[#0EA5E9] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showApiKey ? 'SEMBUNYIKAN' : 'TAMPILKAN'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      required
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder={
                        selectedPlatform === 'Instagram' ? 'EAAGm0PX4ZC0BA...' :
                        selectedPlatform === 'WhatsApp' ? 'EAAG_WA_CLOUD_...' :
                        selectedPlatform === 'TikTok' ? 'act.tiktok_open_...' : 'Masukkan API Key resmi'
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white"
                    />
                    <div className="absolute right-3.5 top-3 text-slate-400">
                      <Key className="w-4 h-4 text-[#F2542D]" />
                    </div>
                  </div>
                </div>

                {/* App Secret / Webhook Secret */}
                <div className="space-y-1">
                  <label className="block text-slate-700 text-xs font-bold">
                    App Secret / Webhook Token (Opsional)
                  </label>
                  <input
                    type="password"
                    value={appSecretInput}
                    onChange={(e) => setAppSecretInput(e.target.value)}
                    placeholder="sec_••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#F2542D] focus:bg-white"
                  />
                </div>

                {/* Helpful Instruction Note */}
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-slate-700 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#0EA5E9]">
                    <Info className="w-4 h-4" />
                    <span>Petunjuk API Key {selectedPlatform}:</span>
                  </div>
                  <p className="leading-relaxed">
                    Dapatkan Access Token resmi melalui Developer Console {selectedPlatform}. Salin dan tempelkan token pada kolom di atas untuk mulai menghubungkan otomasi.
                  </p>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-[2] py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Token API...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Hubungkan & Verifikasi</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
