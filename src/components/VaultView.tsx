import React, { useState } from 'react';
import { OptimizationResult } from '../types';
import { BookmarkCheck, Film, Trash2, ArrowUpRight, Search, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface VaultViewProps {
  savedItems: OptimizationResult[];
  onSelectProject: (item: OptimizationResult) => void;
  onDeleteProject: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Idea' | 'Scripting' | 'Filming' | 'Published') => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ savedItems, onSelectProject, onDeleteProject, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = savedItems.filter((item) => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch = item.topic.toLowerCase().includes(searchQuery.toLowerCase()) || item.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <BookmarkCheck className="w-3.5 h-3.5" />
            Creator Vault & Content Pipeline
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            Saved Video Projects & Strategy Vault
          </h1>
          <p className="text-sm text-slate-400">
            Manage your saved optimization packages, track production progress from idea to published video.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved projects..."
              className="pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'Idea', 'Scripting', 'Filming', 'Published'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filterStatus === status
                ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {status} ({status === 'All' ? savedItems.length : savedItems.filter(i => i.status === status).length})
          </button>
        ))}
      </div>

      {/* Grid of Saved Projects */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No saved projects found</h3>
            <p className="text-xs text-slate-400">
              {savedItems.length === 0 ? 'Generate an optimization package in the Video Optimizer and click "Save to Vault".' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
                    {item.niche}
                  </span>
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id!, e.target.value as any)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                      item.status === 'Published'
                        ? 'bg-emerald-950/60 border-emerald-900 text-emerald-400'
                        : item.status === 'Filming'
                        ? 'bg-amber-950/60 border-amber-900 text-amber-400'
                        : item.status === 'Scripting'
                        ? 'bg-blue-950/60 border-blue-900 text-blue-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <option value="Idea">Idea</option>
                    <option value="Scripting">Scripting</option>
                    <option value="Filming">Filming</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.createdAt}</span>
                  <h3 className="text-base font-bold text-white mt-1 line-clamp-2">
                    {item.topic}
                  </h3>
                  <p className="text-xs text-red-400 font-medium mt-2 line-clamp-1">
                    Top Title: {item.titles?.[0]?.title}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onDeleteProject(item.id!)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelectProject(item)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  <span>Open Suite</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
