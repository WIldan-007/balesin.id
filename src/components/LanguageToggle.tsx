import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs font-mono ${className}`}>
      <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-1" />
      <button
        type="button"
        onClick={() => setLang('id')}
        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
          lang === 'id'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        ID
      </button>
      <span className="text-slate-700 mx-0.5">|</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
          lang === 'en'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};
