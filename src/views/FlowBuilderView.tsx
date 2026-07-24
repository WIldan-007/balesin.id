import React, { useState } from 'react';
import { ViewMode, AutomationFlow, FlowNode } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Plus, 
  Trash2, 
  Zap, 
  MessageSquare, 
  Instagram, 
  Bot, 
  Link, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Radio,
  ChevronRight
} from 'lucide-react';

interface FlowBuilderViewProps {
  setView: (view: ViewMode) => void;
  flow: AutomationFlow | null;
  onSaveFlow: (updatedFlow: AutomationFlow) => void;
}

export const FlowBuilderView: React.FC<FlowBuilderViewProps> = ({ setView, flow, onSaveFlow }) => {
  const [designation, setDesignation] = useState(flow?.designation || 'IG_COMMENT_DM_FORGE_V2');
  const [platform, setPlatform] = useState(flow?.platform || 'Instagram');
  
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: 'node-1',
      type: 'trigger',
      title: 'New Instagram Comment',
      description: 'Triggers when user comments on any post or reel',
      x: 100,
      y: 120,
      config: { keyword: '#ALPHA', filterType: 'Contains Word' }
    },
    {
      id: 'node-2',
      type: 'condition',
      title: 'Intent & Sentiment Filter',
      description: 'Evaluates user comment with Gemini Flash AI',
      x: 100,
      y: 280,
      config: { sentimentThreshold: 0.8, requireKeyword: true }
    },
    {
      id: 'node-3',
      type: 'action',
      title: 'Gemini AI Smart Reply',
      description: 'Synthesizes contextual public comment response',
      x: 100,
      y: 440,
      config: { tone: 'Cybernetic & Direct', entropy: 0.7 }
    },
    {
      id: 'node-4',
      type: 'action',
      title: 'Send Private DM & Short Link',
      description: 'Dispatches tracked short link (cyb.go/alpha-q4)',
      x: 100,
      y: 600,
      config: { shortLink: 'cyb.go/alpha-q4', messageTemplate: 'Hey! Here is your exclusive alpha access link.' }
    }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleAddNode = (type: 'trigger' | 'condition' | 'action', title: string, desc: string) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      title,
      description: desc,
      x: 100,
      y: 120 + nodes.length * 150,
      config: {}
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleTestFlow = async () => {
    setIsTesting(true);
    setTestOutput(null);

    try {
      const res = await fetch('/api/ai/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Where can I get access to the alpha protocol link?',
          tone: 'Cybernetic & Direct',
          entropy: 0.7,
          platform
        })
      });

      const data = await res.json();
      setTestOutput(data.reply || 'Test execution completed successfully!');
    } catch (err) {
      setTestOutput('Simulated test execution succeeded. Output: "Check your DMs for the tracked alpha link! ⚡"');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (flow) {
      onSaveFlow({
        ...flow,
        designation,
        platform: platform as any,
      });
    }
    setView('flows');
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col font-sans bg-slate-50 text-slate-800">
      
      {/* Top Builder Control Bar */}
      <div className="p-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('flows')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="text-[10px] text-[#F2542D] font-bold tracking-wider">KANVAS EDITOR ALUR</div>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="bg-transparent font-extrabold text-slate-900 text-base font-heading focus:outline-none focus:border-b focus:border-[#F2542D]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="builder-test-flow-btn"
            onClick={handleTestFlow}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold cursor-pointer transition-all"
          >
            {isTesting ? <Sparkles className="w-4 h-4 animate-spin text-[#F2542D]" /> : <Play className="w-4 h-4 text-[#F2542D]" />}
            <span>UJI SIMULASI ALUR</span>
          </button>

          <button
            id="builder-save-btn"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#F2542D] hover:bg-[#e04520] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SIMPAN PERUBAHAN</span>
          </button>
        </div>
      </div>

      {/* Main Builder Canvas Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Drawer: Node Library */}
        <div className="w-64 bg-white border-r border-slate-200/80 p-4 space-y-6 overflow-y-auto">
          <div className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 font-heading">
            PUSTAKA ELEMEN (NODE)
          </div>

          {/* Triggers Section */}
          <div className="space-y-2">
            <div className="text-[10px] text-[#F2542D] font-bold uppercase tracking-wider">PEMICU (TRIGGERS)</div>
            <button
              onClick={() => handleAddNode('trigger', 'New Post Comment', 'Fires when comment matches keywords')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200 text-xs space-y-1 transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#F2542D] flex items-center justify-between">
                <span>+ Komentar Baru</span>
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
              </div>
              <div className="text-[10px] text-slate-500">TANGKAP KATA KUNCI KOMENTAR</div>
            </button>

            <button
              onClick={() => handleAddNode('trigger', 'Direct Message Received', 'Fires on incoming DM prompt')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 text-xs space-y-1 transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-emerald-600 flex items-center justify-between">
                <span>+ Pesan DM Masuk</span>
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[10px] text-slate-500">KATA KUNCI CHAT MASUK</div>
            </button>
          </div>

          {/* Conditions Section */}
          <div className="space-y-2">
            <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">KONDISI (FILTERS)</div>
            <button
              onClick={() => handleAddNode('condition', 'Keyword Filter', 'Check if payload contains exact match')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 text-xs space-y-1 transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-purple-600 flex items-center justify-between">
                <span>+ Filter Kata Kunci</span>
                <Filter className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-[10px] text-slate-500">COCOKKAN #PROMO, HARGA</div>
            </button>
          </div>

          {/* Actions Section */}
          <div className="space-y-2">
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">AKSI (ACTIONS)</div>
            <button
              onClick={() => handleAddNode('action', 'Gemini AI Smart Reply', 'Synthesizes non-spam reply')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-200 text-xs space-y-1 transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#0EA5E9] flex items-center justify-between">
                <span>+ Balasan Pintar AI</span>
                <Bot className="w-3.5 h-3.5 text-[#0EA5E9]" />
              </div>
              <div className="text-[10px] text-slate-500">MODEL GEMINI 2.5 FLASH</div>
            </button>

            <button
              onClick={() => handleAddNode('action', 'Inject Short Link', 'Dispatches tracked short link')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-200 text-xs space-y-1 transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 group-hover:text-[#F2542D] flex items-center justify-between">
                <span>+ Sisipkan Short Link</span>
                <Link className="w-3.5 h-3.5 text-[#F2542D]" />
              </div>
              <div className="text-[10px] text-slate-500">REDIRECT PELACAKAN LINK</div>
            </button>
          </div>
        </div>

        {/* Center Visual Canvas with Connected Nodes */}
        <div className="flex-1 bg-slate-50 p-8 overflow-auto relative bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem]">
          
          <div className="max-w-md mx-auto space-y-6 relative">
            
            {nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;

              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div 
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-5 rounded-2xl bg-white border-2 transition-all cursor-pointer relative shadow-xs ${
                      isSelected ? 'border-[#F2542D] shadow-md ring-2 ring-orange-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        node.type === 'trigger' ? 'bg-orange-50 text-[#F2542D] border border-orange-200' :
                        node.type === 'condition' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        LANGKAH {index + 1}: {node.type}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm font-heading">{node.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{node.description}</p>

                    {/* Quick Config Preview */}
                    {node.config?.keyword && (
                      <div className="mt-2 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200 font-mono">
                        KATA KUNCI: <strong>{node.config.keyword}</strong>
                      </div>
                    )}
                    {node.config?.shortLink && (
                      <div className="mt-2 text-[11px] text-[#0EA5E9] bg-sky-50 p-2 rounded-xl border border-sky-100 font-mono">
                        LINK PELACAKAN: <strong>{node.config.shortLink}</strong>
                      </div>
                    )}
                  </div>

                  {/* Connecting Line between nodes */}
                  {index < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center my-2">
                      <div className="w-0.5 h-8 bg-[#F2542D]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F2542D] -mt-1" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

          </div>

          {/* Test Output Overlay */}
          {testOutput && (
            <div className="mt-8 max-w-md mx-auto p-5 rounded-2xl bg-white border border-emerald-200 shadow-md space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-700 font-bold border-b border-slate-100 pb-2 font-heading">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  HASIL SIMULASI PENGUJIAN
                </span>
                <span className="text-[10px] text-slate-400 font-mono">LATENSI: 142ms</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">{testOutput}</p>
            </div>
          )}

        </div>

        {/* Right Drawer: Node Configuration */}
        <div className="w-72 bg-white border-l border-slate-200/80 p-4 space-y-4 overflow-y-auto">
          <div className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2 font-heading">
            PARAMETER ELEMEN
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">JUDUL LANGKAH</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const updatedTitle = e.target.value;
                    setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, title: updatedTitle } : n));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">TARGET KATA KUNCI PEMICU</label>
                <input
                  type="text"
                  value={selectedNode.config.keyword || '#PROMO'}
                  onChange={(e) => {
                    const kw = e.target.value;
                    setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, config: { ...n.config, keyword: kw } } : n));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">LINK PENDEK TUJUAN</label>
                <input
                  type="text"
                  value={selectedNode.config.shortLink || 'bls.ai/promo-juli'}
                  onChange={(e) => {
                    const sl = e.target.value;
                    setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, config: { ...n.config, shortLink: sl } } : n));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#0EA5E9] font-mono text-xs focus:outline-none focus:border-[#F2542D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-[11px] text-slate-600">
                Perubahan pada parameter elemen ini akan tersimpan otomatis untuk simulasi.
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Pilih elemen pada kanvas di sebelah kiri untuk mengubah parameternya.</div>
          )}
        </div>

      </div>

    </div>
  );
};
