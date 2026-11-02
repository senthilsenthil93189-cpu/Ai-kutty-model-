import React from 'react';
import { TabType } from '../types';
import { Flame, Wand2, Film, PawPrint, Sparkles, Box, Music, Atom, Mic, Globe, Image as ImageIcon, BookmarkCheck, MessageSquareCode, Plus, Youtube } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewProject: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onNewProject, savedCount }) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('trending')}>
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
            <Youtube className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              AI Kutty<span className="text-red-500 font-extrabold">.Model</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">Mobile Creator Studio</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'trending', label: 'Trending', icon: Flame },
            { id: 'optimizer', label: 'Optimizer', icon: Wand2 },
            { id: 'story', label: 'Story & Veo', icon: Film },
            { id: 'animals', label: 'Animal Series', icon: PawPrint },
            { id: 'media', label: 'Media Lab', icon: Sparkles },
            { id: 'three', label: '3D Studio', icon: Box },
            { id: 'music', label: 'Music', icon: Music },
            { id: 'science', label: 'Science', icon: Atom },
            { id: 'transcribe', label: 'Transcribe', icon: Mic },
            { id: 'grounding', label: 'Search', icon: Globe },
            { id: 'nanobanana', label: 'Nano Banana', icon: ImageIcon },
            { id: 'vault', label: 'Vault', icon: BookmarkCheck, count: savedCount },
            { id: 'coach', label: 'Chatbot', icon: MessageSquareCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-red-950 text-red-300 text-[10px] rounded-full font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-600/20 whitespace-nowrap min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Optimizer</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (Optimized Mobile Touch Bar) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around overflow-x-auto scrollbar-none">
        {[
          { id: 'trending', label: 'Trending', icon: Flame },
          { id: 'optimizer', label: 'Optimizer', icon: Wand2 },
          { id: 'animals', label: 'Animals', icon: PawPrint },
          { id: 'story', label: 'Story', icon: Film },
          { id: 'media', label: 'Media', icon: Sparkles },
          { id: 'three', label: '3D', icon: Box },
          { id: 'music', label: 'Music', icon: Music },
          { id: 'vault', label: 'Vault', icon: BookmarkCheck, count: savedCount },
          { id: 'coach', label: 'Chat', icon: MessageSquareCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
                isActive ? 'text-red-500 font-bold bg-red-950/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
