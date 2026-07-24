import React, { useState, useMemo } from 'react';
import { ViewMode, Campaign, ShortLink, KeywordRule, KeywordMatchType, CampaignCategory, CampaignStatus, CampaignHealth, LiveActivity } from '../types';
import { initialLiveActivities } from '../data/mockData';
import { 
  BarChart3, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Plus, 
  Globe, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  Eye, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  ChevronRight, 
  RefreshCw, 
  Share2, 
  Bot, 
  DollarSign, 
  MousePointerClick, 
  Users, 
  Layers, 
  FileText,
  Activity,
  Sliders,
  CheckSquare,
  Square,
  Instagram,
  MessageCircle,
  Video,
  X
} from 'lucide-react';

interface CampaignsViewProps {
  setView: (view: ViewMode) => void;
  campaigns: Campaign[];
  shortLinks: ShortLink[];
  onAddShortLink: (link: ShortLink) => void;
  onUpdateCampaigns?: (campaigns: Campaign[]) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ 
  setView, 
  campaigns: propCampaigns, 
  shortLinks,
  onAddShortLink,
  onUpdateCampaigns
}) => {
  const [campaignList, setCampaignList] = useState<Campaign[]>(propCampaigns);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>(initialLiveActivities);

  // Filters & State
  const [activeTab, setActiveTab] = useState<'ALL' | CampaignCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'CTR' | 'REVENUE' | 'STATUS' | 'PLATFORM' | 'OLDEST'>('NEWEST');
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewModeType, setViewModeType] = useState<'GRID' | 'TABLE' | 'LINKS'>('GRID');

  // Bulk Selection State
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [selectedDetailCampaign, setSelectedDetailCampaign] = useState<Campaign | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'OVERVIEW' | 'TRIGGERS' | 'PROMPT' | 'SIMULATION' | 'ANALYTICS' | 'LOGS'>('OVERVIEW');
  const [viewingPostCampaign, setViewingPostCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShortLinkModal, setShowShortLinkModal] = useState(false);

  // Quick menu active dropdown
  const [activeMenuCampaignId, setActiveMenuCampaignId] = useState<string | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Live Purchase Simulation Handler
  const handleSimulateLivePurchase = () => {
    const buyers = ['@dina_fashion', '@reza_style', '@amanda_shop', '@kevin_gadget', '@siti_beauty', '@budi_sneakers'];
    const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
    const price = 350; // In thousand IDR (Rp 350.000)

    // Update first campaign or target campaign stats
    if (campaignList.length > 0) {
      const targetCmp = campaignList[0];
      const updatedList = campaignList.map((c, idx) => {
        if (idx === 0) {
          return {
            ...c,
            dmSent: c.dmSent + 1,
            clicks: c.clicks + 1,
            commentCount: c.commentCount + 1,
            revenue: c.revenue + price,
            followers: c.followers + 1,
            ctr: parseFloat(((c.clicks + 1) / (c.dmSent + 1) * 100).toFixed(1))
          };
        }
        return c;
      });
      updateCampaignsState(updatedList);

      // Add live activities
      const timestamp = 'Baru saja';
      const act1: LiveActivity = {
        id: `act-${Date.now()}-1`,
        timestamp,
        username: randomBuyer,
        action: 'COMMENTED',
        details: 'Menulis komentar: "Berapa harganya kak? Minta info dong!"',
        campaignName: targetCmp.name,
        platform: targetCmp.platform
      };
      const act2: LiveActivity = {
        id: `act-${Date.now()}-2`,
        timestamp,
        username: randomBuyer,
        action: 'AI_REPLIED',
        details: 'AI Gemini membalas otomatis & mengirim voucher promo via DM',
        campaignName: targetCmp.name,
        platform: targetCmp.platform
      };
      const act3: LiveActivity = {
        id: `act-${Date.now()}-3`,
        timestamp,
        username: randomBuyer,
        action: 'PURCHASE',
        details: `Membeli item via shortlink ${targetCmp.shortlink || 'bls.ai/promo'} (Atribusi Rp 350.000)`,
        campaignName: targetCmp.name,
        platform: targetCmp.platform
      };

      setLiveActivities([act3, act2, act1, ...liveActivities]);
      setLiveToast(`🎉 Simulasi Berhasil! ${randomBuyer} baru saja melakukan PEMBELIAN sebesar Rp 350.000 via Campaign "${targetCmp.name}"`);
      setTimeout(() => setLiveToast(null), 5000);
    }
  };

  // Create Shortlink Form State
  const [newSlug, setNewSlug] = useState('bls.ai/promo-spesial');
  const [newDestination, setNewDestination] = useState('https://balesin.ai/checkout');

  // AI Simulation State inside Detail Drawer
  const [simulatedComment, setSimulatedComment] = useState('Minta info harga promo sepatu ini dong!');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    aiReply: string;
    publicReply: string;
    dmMessage: string;
    shortlink: string;
    estimatedCtr: number;
  } | null>(null);

  // New Keyword input inside Detail Drawer
  const [newKeywordWord, setNewKeywordWord] = useState('');
  const [newKeywordMatch, setNewKeywordMatch] = useState<KeywordMatchType>('Contains');

  // Create Campaign Form State
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignPlatform, setNewCampaignPlatform] = useState<'Instagram' | 'WhatsApp' | 'TikTok'>('Instagram');
  const [newCampaignCategory, setNewCampaignCategory] = useState<CampaignCategory>('Post Automation');
  const [newCampaignThumbnail, setNewCampaignThumbnail] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80');
  const [newCampaignPostUrl, setNewCampaignPostUrl] = useState('https://instagram.com/p/C9x81a_PROMO');
  const [newCampaignUsername, setNewCampaignUsername] = useState('@balesin_store');
  const [newCampaignPrompt, setNewCampaignPrompt] = useState('Sapa ramah, berikan diskon 30%, dan kirimkan link checkout.');
  const [newCampaignShortlink, setNewCampaignShortlink] = useState('bls.ai/promo-baru');

  // Sync state upward when campaignList changes
  const updateCampaignsState = (newList: Campaign[]) => {
    setCampaignList(newList);
    if (onUpdateCampaigns) {
      onUpdateCampaigns(newList);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter & Search Logic
  const filteredCampaigns = useMemo(() => {
    return campaignList.filter(c => {
      // Category Tab Filter
      if (activeTab !== 'ALL' && c.category !== activeTab) return false;

      // Platform Filter
      if (selectedPlatform !== 'ALL' && c.platform !== selectedPlatform) return false;

      // Status Filter
      if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(query);
        const userMatch = c.instagramUsername?.toLowerCase().includes(query) || false;
        const urlMatch = c.postUrl?.toLowerCase().includes(query) || false;
        const kwMatch = c.keywords.some(k => k.word.toLowerCase().includes(query));
        if (!nameMatch && !userMatch && !urlMatch && !kwMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'CTR') return b.ctr - a.ctr;
      if (sortBy === 'REVENUE') return b.revenue - a.revenue;
      if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
      if (sortBy === 'PLATFORM') return a.platform.localeCompare(b.platform);
      return 0;
    });
  }, [campaignList, activeTab, selectedPlatform, selectedStatus, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCampaigns.length / pageSize) || 1;
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCampaigns.slice(start, start + pageSize);
  }, [filteredCampaigns, currentPage, pageSize]);

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedCampaignIds.length === paginatedCampaigns.length) {
      setSelectedCampaignIds([]);
    } else {
      setSelectedCampaignIds(paginatedCampaigns.map(c => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedCampaignIds.includes(id)) {
      setSelectedCampaignIds(selectedCampaignIds.filter(i => i !== id));
    } else {
      setSelectedCampaignIds([...selectedCampaignIds, id]);
    }
  };

  const handleBulkPause = () => {
    const updated = campaignList.map(c => selectedCampaignIds.includes(c.id) ? { ...c, status: 'Paused' as CampaignStatus, health: 'Draft' as CampaignHealth } : c);
    updateCampaignsState(updated);
    setSelectedCampaignIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Hapus ${selectedCampaignIds.length} kampanye terpilih?`)) {
      const updated = campaignList.filter(c => !selectedCampaignIds.includes(c.id));
      updateCampaignsState(updated);
      setSelectedCampaignIds([]);
    }
  };

  const handleBulkClone = () => {
    const newItems: Campaign[] = [];
    campaignList.forEach(c => {
      if (selectedCampaignIds.includes(c.id)) {
        newItems.push({
          ...c,
          id: `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${c.name} (Salinan)`,
          status: 'Draft',
          health: 'Draft',
          dmSent: 0,
          clicks: 0,
          followers: 0,
          revenue: 0,
          ctr: 0,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }
    });
    updateCampaignsState([...newItems, ...campaignList]);
    setSelectedCampaignIds([]);
  };

  // Quick Action Single Item
  const handleTogglePauseSingle = (campaign: Campaign) => {
    const nextStatus: CampaignStatus = campaign.status === 'Running' ? 'Paused' : 'Running';
    const nextHealth: CampaignHealth = nextStatus === 'Running' ? 'Running' : 'Draft';
    const updated = campaignList.map(c => c.id === campaign.id ? { ...c, status: nextStatus, health: nextHealth } : c);
    updateCampaignsState(updated);
  };

  const handleDuplicateSingle = (campaign: Campaign) => {
    const newItem: Campaign = {
      ...campaign,
      id: `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${campaign.name} (Quick Clone)`,
      status: 'Draft',
      health: 'Draft',
      dmSent: 0,
      clicks: 0,
      followers: 0,
      revenue: 0,
      ctr: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    updateCampaignsState([newItem, ...campaignList]);
    setActiveMenuCampaignId(null);
  };

  const handleDeleteSingle = (id: string) => {
    if (confirm('Hapus kampanye ini secara permanen?')) {
      updateCampaignsState(campaignList.filter(c => c.id !== id));
      setActiveMenuCampaignId(null);
    }
  };

  const handleArchiveSingle = (id: string) => {
    const updated = campaignList.map(c => c.id === id ? { ...c, status: 'Archived' as CampaignStatus, health: 'Draft' as CampaignHealth } : c);
    updateCampaignsState(updated);
    setActiveMenuCampaignId(null);
  };

  // Keyword Management inside Detail Drawer
  const handleAddKeyword = () => {
    if (!newKeywordWord.trim() || !selectedDetailCampaign) return;
    const newKw: KeywordRule = {
      id: `kw-${Date.now()}`,
      word: newKeywordWord.trim(),
      matchType: newKeywordMatch
    };
    const updatedCampaign = {
      ...selectedDetailCampaign,
      keywords: [...selectedDetailCampaign.keywords, newKw]
    };
    setSelectedDetailCampaign(updatedCampaign);
    updateCampaignsState(campaignList.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setNewKeywordWord('');
  };

  const handleRemoveKeyword = (kwId: string) => {
    if (!selectedDetailCampaign) return;
    const updatedCampaign = {
      ...selectedDetailCampaign,
      keywords: selectedDetailCampaign.keywords.filter(k => k.id !== kwId)
    };
    setSelectedDetailCampaign(updatedCampaign);
    updateCampaignsState(campaignList.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  // AI Simulation Handler
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        aiReply: `Sistem AI Balesin menganalisis pesan "${simulatedComment}" dengan intent minat harga promo.`,
        publicReply: `Hai Kak! Cek DM ya untuk info lengkap promo potongan harga & link spesialnya! 🎉`,
        dmMessage: `Halo Kak! Terima kasih sudah tertarik dengan penawaran kami. Gunakan kode promo khusus ini untuk potongan 30%: ${selectedDetailCampaign?.shortlink || 'bls.ai/promo'}.`,
        shortlink: selectedDetailCampaign?.shortlink || 'bls.ai/promo-spesial',
        estimatedCtr: Math.min(24.5, (selectedDetailCampaign?.ctr || 18.2) + 2.5)
      });
    }, 600);
  };

  // Create Campaign Submit
  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Campaign = {
      id: `cmp-${Date.now()}`,
      name: newCampaignName || 'Campaign Baru',
      code: newCampaignName.toUpperCase().replace(/\s+/g, '_'),
      platform: newCampaignPlatform,
      category: newCampaignCategory,
      status: 'Running',
      health: 'Running',
      thumbnailUrl: newCampaignThumbnail,
      postUrl: newCampaignPostUrl,
      instagramUsername: newCampaignUsername,
      keywords: [
        { id: `kw-c1`, word: 'promo', matchType: 'Contains' },
        { id: `kw-c2`, word: 'harga', matchType: 'Contains' },
        { id: `kw-c3`, word: 'link', matchType: 'Exact Match' }
      ],
      dmSent: 0,
      clicks: 0,
      followers: 0,
      ctr: 18.5,
      revenue: 0,
      commentCount: 0,
      averageResponse: '1.0s',
      aiCost: '$0.001',
      conversionRate: 12.0,
      activeLinksCount: 1,
      uptimeVelocity: 100.0,
      createdAt: new Date().toISOString().split('T')[0],
      aiPrompt: newCampaignPrompt,
      brandVoice: 'Casual, Friendly',
      shortlink: newCampaignShortlink,
      destinationUrl: 'https://balesin.ai'
    };
    updateCampaignsState([created, ...campaignList]);
    setShowCreateModal(false);

    // Add Live Activity
    const newAct: LiveActivity = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      username: newCampaignUsername,
      action: 'COMMENTED',
      details: `Kampanye "${created.name}" berhasil dibuat dan diaktifkan.`,
      campaignName: created.name,
      platform: created.platform
    };
    setLiveActivities([newAct, ...liveActivities]);
  };

  // Create Shortlink Submit
  const handleCreateShortLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ShortLink = {
      id: `link-${Date.now()}`,
      slug: newSlug,
      url: `https://${newSlug}`,
      destination: newDestination,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onAddShortLink(created);
    setShowShortLinkModal(false);
  };

  // Calculated Top Dashboard KPIs
  const totalCampaignCount = campaignList.length;
  const activeCampaignCount = campaignList.filter(c => c.status === 'Running').length;
  const totalDmSent = campaignList.reduce((acc, c) => acc + (c.dmSent || 0), 0);
  const totalClicksSum = campaignList.reduce((acc, c) => acc + (c.clicks || 0), 0);
  const totalCommentsSum = campaignList.reduce((acc, c) => acc + (c.commentCount || 0), 0);
  const totalRevenueSum = campaignList.reduce((acc, c) => acc + (c.revenue || 0) * 1000, 0);
  const avgCtr = campaignList.length > 0 ? (campaignList.reduce((acc, c) => acc + c.ctr, 0) / campaignList.length).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 text-slate-700 font-sans pb-12">
      
      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2.5">
            <span>Automation Campaign Manager</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F2542D] font-bold">
              v2.7 Addendum
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola seluruh pemicu kata kunci otomatis, balasan DM Instagram, dan pemendek link (bls.ai) beresolusi tinggi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateLivePurchase}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer animate-pulse"
            title="Klik untuk mensimulasikan kejadian live komentar, DM otomatis, dan pembelian produk"
          >
            <Activity className="w-4 h-4" />
            <span>⚡ Test Live Pembelian</span>
          </button>

          <button
            onClick={() => setShowShortLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <LinkIcon className="w-4 h-4 text-purple-600" />
            <span>+ Buat Short Link (bls.ai)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Campaign Baru</span>
          </button>
        </div>
      </div>

      {/* LIVE TOAST BANNER */}
      {liveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>{liveToast}</span>
          </div>
          <button onClick={() => setLiveToast(null)} className="p-1 rounded-lg hover:bg-emerald-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP DASHBOARD WIDGETS (KPI CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Campaign</div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">{totalCampaignCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">Semua Platform</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Campaign</div>
          <div className="text-xl font-extrabold text-emerald-600 font-heading">{activeCampaignCount}</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Running
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Komentar Masuk</div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">{totalCommentsSum.toLocaleString()}</div>
          <div className="text-[10px] text-sky-600 font-semibold">+14.2% hari ini</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total DM Sent</div>
          <div className="text-xl font-extrabold text-[#F2542D] font-heading">{totalDmSent.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-medium">Auto-Dispatched</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-Rata CTR</div>
          <div className="text-xl font-extrabold text-purple-600 font-heading">{avgCtr}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">+3.1% benchmark</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Omzet Atribusi</div>
          <div className="text-xl font-extrabold text-emerald-600 font-heading truncate">Rp {(totalRevenueSum / 1000000).toFixed(1)}M</div>
          <div className="text-[10px] text-slate-500 font-medium">Link bls.ai</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konversi Sales</div>
          <div className="text-xl font-extrabold text-slate-900 font-heading">12.8%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Tinggi</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Respon AI</div>
          <div className="text-xl font-extrabold text-[#0EA5E9] font-heading">&lt; 1.2s</div>
          <div className="text-[10px] text-slate-500 font-medium">Gemini Instant</div>
        </div>
      </div>

      {/* CATEGORIES TABS */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-bold scrollbar-none">
        <button
          onClick={() => { setActiveTab('ALL'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Kategori ({campaignList.length})
        </button>

        <button
          onClick={() => { setActiveTab('Post Automation'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'Post Automation'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>Post Automation</span>
        </button>

        <button
          onClick={() => { setActiveTab('Story Automation'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'Story Automation'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Story Automation</span>
        </button>

        <button
          onClick={() => { setActiveTab('Live Automation'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'Live Automation'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-red-500" />
          <span>Live Automation</span>
        </button>

        <button
          onClick={() => { setActiveTab('DM Automation'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'DM Automation'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
          <span>DM Automation</span>
        </button>

        <button
          onClick={() => { setActiveTab('Broadcast Automation'); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'Broadcast Automation'
              ? 'bg-[#F2542D] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-emerald-500" />
          <span>Broadcast Automation</span>
        </button>
      </div>

      {/* SEARCH, FILTERS & CONTROLS TOOLBAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama Campaign, Keyword, Username Instagram, atau URL Post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F2542D] transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Platform Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Platform:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua</option>
                <option value="Running">Running</option>
                <option value="Paused">Paused</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Sorting Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="NEWEST">Terbaru</option>
                <option value="CTR">CTR Tertinggi</option>
                <option value="REVENUE">Revenue Terbesar</option>
                <option value="STATUS">Status</option>
                <option value="PLATFORM">Platform</option>
                <option value="OLDEST">Terlama</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewModeType('GRID')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewModeType === 'GRID' ? 'bg-white shadow-xs text-[#F2542D]' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid Layout"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewModeType('TABLE')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewModeType === 'TABLE' ? 'bg-white shadow-xs text-[#F2542D]' : 'text-slate-400 hover:text-slate-700'}`}
                title="Table Layout"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewModeType('LINKS')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewModeType === 'LINKS' ? 'bg-white shadow-xs text-[#F2542D]' : 'text-slate-400 hover:text-slate-700'}`}
                title="Short Links Repository"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* BULK ACTION BAR WHEN ITEMS SELECTED */}
        {selectedCampaignIds.length > 0 && (
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckSquare className="w-4 h-4 text-[#F2542D]" />
              <span>{selectedCampaignIds.length} Campaign Terpilih</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkPause}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pause Terpilih</span>
              </button>

              <button
                onClick={handleBulkClone}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-purple-600" />
                <span>Quick Duplicate</span>
              </button>

              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih</span>
              </button>

              <button
                onClick={() => setSelectedCampaignIds([])}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer text-[11px]"
              >
                Batal
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MAIN CONTENT LAYOUT ACCORDING TO VIEW MODE */}
      {viewModeType === 'LINKS' ? (
        /* SHORT LINK REPOSITORY VIEW */
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-600" />
              Repository Pemendek Link (bls.ai/*)
            </h2>
            <span className="text-xs font-semibold text-slate-500">{shortLinks.length} Shortlink Aktif</span>
          </div>

          <div className="space-y-3">
            {shortLinks.map((link) => (
              <div key={link.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0EA5E9] font-mono text-sm">{link.slug}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                      {link.clicks.toLocaleString()} Klik
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {link.conversions.toLocaleString()} Sales
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-lg">
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
            ))}
          </div>
        </div>
      ) : viewModeType === 'TABLE' ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedCampaignIds.length === paginatedCampaigns.length && paginatedCampaigns.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#F2542D] focus:ring-[#F2542D] cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Platform & Category</th>
                  <th className="p-4">Status & Health</th>
                  <th className="p-4">Trigger Keywords</th>
                  <th className="p-4 text-right">DM Sent</th>
                  <th className="p-4 text-right">CTR</th>
                  <th className="p-4 text-right">Revenue Atribusi</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCampaigns.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedCampaignIds.includes(cmp.id)}
                        onChange={() => handleToggleSelect(cmp.id)}
                        className="rounded border-slate-300 text-[#F2542D] focus:ring-[#F2542D] cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cmp.thumbnailUrl}
                          alt={cmp.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80');
                          }}
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 font-heading text-xs">{cmp.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{cmp.instagramUsername}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800">{cmp.platform}</span>
                        <div className="text-[10px] text-slate-500">{cmp.category}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          cmp.health === 'Running' ? 'bg-emerald-500' :
                          cmp.health === 'Low CTR' ? 'bg-amber-500' :
                          cmp.health === 'Error' ? 'bg-red-500' : 'bg-slate-300'
                        }`} />
                        <span className="font-bold text-slate-800">{cmp.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cmp.keywords.map(k => (
                          <span key={k.id} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
                            {k.word}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">{cmp.dmSent.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-[#F2542D]">{cmp.ctr}%</td>
                    <td className="p-4 text-right font-bold text-emerald-600">Rp {(cmp.revenue * 1000).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => { setSelectedDetailCampaign(cmp); setDetailModalTab('OVERVIEW'); }}
                        className="px-3 py-1.5 rounded-lg bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-[11px] cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARD LAYOUT ACCORDING TO SPECIFICATION */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCampaigns.map((cmp) => {
            const isSelected = selectedCampaignIds.includes(cmp.id);
            return (
              <div 
                key={cmp.id}
                className={`saas-card rounded-2xl bg-white border transition-all overflow-hidden flex flex-col justify-between shadow-xs ${
                  isSelected ? 'border-[#F2542D] ring-2 ring-[#F2542D]/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* CARD HEADER & THUMBNAIL */}
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden group">
                    <img
                      src={cmp.thumbnailUrl}
                      alt={cmp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Checkbox Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(cmp.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#F2542D] focus:ring-[#F2542D] cursor-pointer"
                      />
                    </div>

                    {/* Status & Health Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-xs border border-white/20 text-white text-[11px] font-bold shadow-xs">
                      <span className={`w-2 h-2 rounded-full ${
                        cmp.health === 'Running' ? 'bg-emerald-400 animate-pulse' :
                        cmp.health === 'Low CTR' ? 'bg-amber-400' :
                        cmp.health === 'Error' ? 'bg-red-400' : 'bg-slate-300'
                      }`} />
                      <span>{cmp.status}</span>
                    </div>

                    {/* Platform & Category Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs font-bold font-heading">
                          {cmp.platform}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F2542D] font-bold font-heading">
                          {cmp.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">{cmp.instagramUsername}</span>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm font-heading line-clamp-1">
                        {cmp.name}
                      </h3>

                      {/* Quick Menu (...) */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setActiveMenuCampaignId(activeMenuCampaignId === cmp.id ? null : cmp.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuCampaignId === cmp.id && (
                          <div className="absolute right-0 top-7 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-semibold animate-in fade-in">
                            <button
                              onClick={() => { handleTogglePauseSingle(cmp); setActiveMenuCampaignId(null); }}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                            >
                              {cmp.status === 'Running' ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                              <span>{cmp.status === 'Running' ? 'Pause Campaign' : 'Resume Campaign'}</span>
                            </button>

                            <button
                              onClick={() => handleDuplicateSingle(cmp)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-purple-600" />
                              <span>Quick Duplicate</span>
                            </button>

                            <button
                              onClick={() => handleArchiveSingle(cmp.id)}
                              className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                            >
                              <Layers className="w-3.5 h-3.5 text-slate-500" />
                              <span>Archive Campaign</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() => handleDeleteSingle(cmp.id)}
                              className="w-full px-3 py-1.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Campaign</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KEYWORD CHIPS */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trigger Keywords:</div>
                      <div className="flex flex-wrap gap-1">
                        {cmp.keywords.map((kw) => (
                          <span 
                            key={kw.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#F2542D]" />
                            <strong className="text-slate-900">{kw.word}</strong>
                            <span className="text-[9px] text-slate-400">({kw.matchType})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* STATISTIK PER CAMPAIGN */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Total DM Sent</div>
                        <div className="text-sm font-extrabold text-slate-900 font-heading">{cmp.dmSent.toLocaleString()}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Link Clicks</div>
                        <div className="text-sm font-extrabold text-[#0EA5E9] font-heading">{cmp.clicks.toLocaleString()}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">CTR (%)</div>
                        <div className="text-sm font-extrabold text-[#F2542D] font-heading">{cmp.ctr}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 px-1">
                      <span className="text-slate-500">New Followers: <strong className="text-slate-900">+{cmp.followers}</strong></span>
                      <span className="text-slate-500">Revenue Atribusi: <strong className="text-emerald-600 font-bold">Rp {(cmp.revenue * 1000).toLocaleString()}</strong></span>
                    </div>

                  </div>
                </div>

                {/* CARD FOOTER BUTTONS */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedDetailCampaign(cmp); setDetailModalTab('OVERVIEW'); }}
                    className="flex-1 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs transition-all cursor-pointer shadow-xs text-center"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() => setViewingPostCampaign(cmp)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    title="View Original Post"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Post</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span>Tampilkan per halaman:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value={12}>12 Card</option>
            <option value={24}>24 Card</option>
            <option value={48}>48 Card</option>
          </select>
          <span className="text-slate-400">| Total {filteredCampaigns.length} Campaign</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold cursor-pointer"
          >
            Sebelumnya
          </button>
          <span className="font-bold text-slate-900">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold cursor-pointer"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* LIVE ACTIVITY FEED WIDGET */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F2542D]" />
            Live Activity Feed (User Commented → AI Replied → DM Sent → Link Clicked → Purchase)
          </h2>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Stream
          </span>
        </div>

        <div className="space-y-3">
          {liveActivities.map((act) => (
            <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                  act.action === 'PURCHASE' ? 'bg-emerald-600' :
                  act.action === 'LINK_CLICKED' ? 'bg-purple-600' :
                  act.action === 'DM_SENT' ? 'bg-[#F2542D]' : 'bg-[#0EA5E9]'
                }`}>
                  {act.action === 'PURCHASE' ? '$' : act.action === 'LINK_CLICKED' ? '🔗' : '🤖'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-heading">{act.username}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 font-semibold">
                      {act.action}
                    </span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{act.details}</p>
                </div>
              </div>

              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-mono shrink-0">
                {act.campaignName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedDetailCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDetailCampaign.thumbnailUrl}
                  alt={selectedDetailCampaign.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base font-heading">{selectedDetailCampaign.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2542D] font-bold">
                      {selectedDetailCampaign.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platform: {selectedDetailCampaign.platform} | Username: {selectedDetailCampaign.instagramUsername}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetailCampaign(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 bg-slate-50 border-b border-slate-200 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setDetailModalTab('OVERVIEW')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'OVERVIEW' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setDetailModalTab('TRIGGERS')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'TRIGGERS' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Keyword Triggers ({selectedDetailCampaign.keywords.length})
              </button>
              <button
                onClick={() => setDetailModalTab('PROMPT')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'PROMPT' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                AI Prompt & Brand Voice
              </button>
              <button
                onClick={() => setDetailModalTab('SIMULATION')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'SIMULATION' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Reply Preview & AI Simulator
              </button>
              <button
                onClick={() => setDetailModalTab('ANALYTICS')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'ANALYTICS' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Shortlink & Analytics
              </button>
              <button
                onClick={() => setDetailModalTab('LOGS')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${detailModalTab === 'LOGS' ? 'border-[#F2542D] text-[#F2542D]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                Logs & History
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {detailModalTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Total DM Sent</div>
                      <div className="text-xl font-extrabold text-slate-900 font-heading">{selectedDetailCampaign.dmSent.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Link Clicks</div>
                      <div className="text-xl font-extrabold text-[#0EA5E9] font-heading">{selectedDetailCampaign.clicks.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">CTR (%)</div>
                      <div className="text-xl font-extrabold text-[#F2542D] font-heading">{selectedDetailCampaign.ctr}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Omzet Atribusi</div>
                      <div className="text-xl font-extrabold text-emerald-600 font-heading">Rp {(selectedDetailCampaign.revenue * 1000).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Campaign Config Summary */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading">Informasi Konfigurasi</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 font-bold">Post URL:</span>
                        <a href={selectedDetailCampaign.postUrl} target="_blank" rel="noopener noreferrer" className="block text-[#0EA5E9] underline font-mono truncate mt-0.5">
                          {selectedDetailCampaign.postUrl}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Shortlink Terhubung:</span>
                        <span className="block text-slate-900 font-bold font-mono mt-0.5">{selectedDetailCampaign.shortlink}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Brand Voice assigned:</span>
                        <span className="block text-slate-900 font-bold mt-0.5">{selectedDetailCampaign.brandVoice}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Rata-rata Kecepatan Respon:</span>
                        <span className="block text-emerald-600 font-bold mt-0.5">{selectedDetailCampaign.averageResponse}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailModalTab === 'TRIGGERS' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading">Keyword Trigger Management (Unlimited)</h4>
                    <p className="text-slate-500">Atur pemicu balasan otomatis berdasarkan kata kunci tertentu dalam komentar postingan.</p>

                    {/* Add Keyword Form */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Masukkan kata kunci pemicu baru (misal: promo, harga, join)..."
                        value={newKeywordWord}
                        onChange={(e) => setNewKeywordWord(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F2542D]"
                      />
                      <select
                        value={newKeywordMatch}
                        onChange={(e) => setNewKeywordMatch(e.target.value as KeywordMatchType)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 cursor-pointer"
                      >
                        <option value="Contains">Contains</option>
                        <option value="Exact Match">Exact Match</option>
                        <option value="Starts With">Starts With</option>
                        <option value="Ends With">Ends With</option>
                        <option value="Regex">Regex (Advanced)</option>
                      </select>
                      <button
                        onClick={handleAddKeyword}
                        className="px-4 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold cursor-pointer shrink-0"
                      >
                        + Tambah Keyword
                      </button>
                    </div>
                  </div>

                  {/* Active Keywords List */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900">Daftar Kata Kunci Aktif:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDetailCampaign.keywords.map((kw) => (
                        <div key={kw.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#F2542D]" />
                            <strong className="font-mono text-slate-900 text-xs">{kw.word}</strong>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                              {kw.matchType}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveKeyword(kw.id)}
                            className="text-slate-400 hover:text-red-600 cursor-pointer p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailModalTab === 'PROMPT' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1 font-heading">AI Prompt Instructions (Instruksi Gemini)</label>
                    <textarea
                      rows={4}
                      value={selectedDetailCampaign.aiPrompt || ''}
                      onChange={(e) => {
                        const updated = { ...selectedDetailCampaign, aiPrompt: e.target.value };
                        setSelectedDetailCampaign(updated);
                        updateCampaignsState(campaignList.map(c => c.id === updated.id ? updated : c));
                      }}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-sans focus:outline-none focus:border-[#F2542D]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-900 font-extrabold mb-1 font-heading">Gaya Bahasa (Brand Voice)</label>
                    <input
                      type="text"
                      value={selectedDetailCampaign.brandVoice || ''}
                      onChange={(e) => {
                        const updated = { ...selectedDetailCampaign, brandVoice: e.target.value };
                        setSelectedDetailCampaign(updated);
                        updateCampaignsState(campaignList.map(c => c.id === updated.id ? updated : c));
                      }}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#F2542D]"
                    />
                  </div>
                </div>
              )}

              {detailModalTab === 'SIMULATION' && (
                <div className="space-y-6">
                  {/* Flow Steps Visualizer */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-extrabold text-slate-900 text-xs font-heading mb-3">Reply Preview Flow</h4>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[11px] font-bold">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex-1">
                        1. Public Reply Komentar
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#0EA5E9] flex-1">
                        2. Instagram Direct Message
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-purple-600 flex-1">
                        3. Shortlink ({selectedDetailCampaign.shortlink})
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 flex-1">
                        4. Landing Page Sales
                      </div>
                    </div>
                  </div>

                  {/* Simulator Sandbox */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-xs font-heading flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F2542D]" />
                      Simulasi AI Gemini Live Tester
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={simulatedComment}
                        onChange={(e) => setSimulatedComment(e.target.value)}
                        placeholder="Ketik contoh komentar penguji..."
                        className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#F2542D]"
                      />
                      <button
                        onClick={handleRunSimulation}
                        disabled={isSimulating}
                        className="px-5 py-3 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                      >
                        {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                        <span>Jalankan Simulasi</span>
                      </button>
                    </div>

                    {simulationResult && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                        <div className="text-slate-500 font-bold">Hasil Respon Otomatis:</div>
                        
                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-[#F2542D] uppercase">Public Reply:</span>
                          <p className="text-slate-800 font-medium">{simulationResult.publicReply}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-[#0EA5E9] uppercase">Instagram DM Payload:</span>
                          <p className="text-slate-800 font-medium">{simulationResult.dmMessage}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-1">
                          <span>Shortlink Target: <strong className="text-purple-600">{simulationResult.shortlink}</strong></span>
                          <span>Estimasi CTR: <strong className="text-emerald-600">{simulationResult.estimatedCtr}%</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailModalTab === 'ANALYTICS' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-xs font-heading">Detail Analytics & Conversion Heatmap</h4>
                    <p className="text-slate-500">Menganalisis rasio klik link dan konversi pembayaran dari kampanye ini.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold text-[10px]">TOTAL KOMENTAR DITANGANI</span>
                      <div className="text-2xl font-extrabold text-slate-900">{selectedDetailCampaign.commentCount.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold text-[10px]">ESTIMASI AI COST</span>
                      <div className="text-2xl font-extrabold text-[#0EA5E9]">{selectedDetailCampaign.aiCost}</div>
                    </div>
                  </div>
                </div>
              )}

              {detailModalTab === 'LOGS' && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400">
                    [SYSTEM OK] Initialized node listener for {selectedDetailCampaign.instagramUsername}...
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-300">
                    [TELEMETRY] 1,420 DM payloads dispatched. Rate limit clean.
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDetailCampaign(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW ORIGINAL POST MODAL */}
      {viewingPostCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-[#F2542D]" />
                <h3 className="font-extrabold text-slate-900 font-heading text-sm">Post Instagram Terhubung</h3>
              </div>
              <button onClick={() => setViewingPostCampaign(null)} className="text-slate-400 hover:text-slate-800 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <img
                src={viewingPostCampaign.thumbnailUrl}
                alt={viewingPostCampaign.name}
                className="w-full h-64 object-cover rounded-2xl border border-slate-200"
              />

              <div>
                <strong className="text-slate-900 font-bold">{viewingPostCampaign.instagramUsername}</strong>
                <p className="text-slate-600 mt-1">
                  🔥 PROMO SPESIAL HARI INI! Tulis kata kunci <strong className="text-[#F2542D]">PROMO</strong> di kolom komentar untuk mendapatkan link harga diskon 30% via DM otomatis!
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-slate-500 font-semibold border-t border-slate-100">
                <span>❤️ 12.4k Likes</span>
                <span>💬 {viewingPostCampaign.commentCount} Comments</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <a
                href={viewingPostCampaign.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Buka Post di Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Buat Automation Campaign Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-800 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">NAMA CAMPAIGN</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Promo Flash Sale Sepatu Sneakers"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">PLATFORM</label>
                  <select
                    value={newCampaignPlatform}
                    onChange={(e) => setNewCampaignPlatform(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">KATEGORI CAMPAIGN</label>
                  <select
                    value={newCampaignCategory}
                    onChange={(e) => setNewCampaignCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Post Automation">Post Automation</option>
                    <option value="Story Automation">Story Automation</option>
                    <option value="Live Automation">Live Automation</option>
                    <option value="DM Automation">DM Automation</option>
                    <option value="Broadcast Automation">Broadcast Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">INSTAGRAM POST URL / MEDIA</label>
                <input
                  type="url"
                  required
                  value={newCampaignPostUrl}
                  onChange={(e) => setNewCampaignPostUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">AI PROMPT INSTRUCTIONS</label>
                <textarea
                  rows={3}
                  value={newCampaignPrompt}
                  onChange={(e) => setNewCampaignPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-bold cursor-pointer shadow-md"
                >
                  Aktifkan Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SHORT LINK MODAL */}
      {showShortLinkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base font-heading">Buat Short Link Baru (bls.ai/*)</h3>
              <button onClick={() => setShowShortLinkModal(false)} className="text-slate-400 hover:text-slate-800 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateShortLinkSubmit} className="space-y-4 text-xs">
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
                  onClick={() => setShowShortLinkModal(false)}
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
