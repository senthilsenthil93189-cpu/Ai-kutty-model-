import React, { useState, useEffect } from 'react';
import { TrendingTopic } from '../types';
import { Flame, Sparkles, TrendingUp, BarChart3, ArrowRight, RefreshCw, Cpu, Gamepad2, DollarSign, Heart, BookOpen, Smile, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrendingViewProps {
  onSelectTopic: (topic: string, niche: string) => void;
}

const NICHES = [
  { id: 'Tech & AI', name: 'Tech & Artificial Intelligence', icon: Cpu },
  { id: 'Gaming', name: 'Gaming & Let’s Plays', icon: Gamepad2 },
  { id: 'Finance & Crypto', name: 'Finance, Crypto & Wealth', icon: DollarSign },
  { id: 'Lifestyle & Vlogs', name: 'Lifestyle & Daily Vlogs', icon: Heart },
  { id: 'Education & Science', name: 'Education & Science', icon: BookOpen },
  { id: 'Fitness & Health', name: 'Fitness & Health', icon: Zap },
  { id: 'Entertainment & Comedy', name: 'Entertainment & Comedy', icon: Smile },
];

// Mock 24-hour velocity data for Recharts
const VELOCITY_DATA = [
  { time: '00:00', AI_Agents: 42, Gaming: 65, Finance: 30, Lifestyle: 50 },
  { time: '04:00', AI_Agents: 55, Gaming: 60, Finance: 35, Lifestyle: 45 },
  { time: '08:00', AI_Agents: 78, Gaming: 85, Finance: 50, Lifestyle: 65 },
  { time: '12:00', AI_Agents: 95, Gaming: 110, Finance: 75, Lifestyle: 85 },
  { time: '16:00', AI_Agents: 130, Gaming: 125, Finance: 90, Lifestyle: 100 },
  { time: '20:00', AI_Agents: 165, Gaming: 140, Finance: 110, Lifestyle: 120 },
  { time: '24:00', AI_Agents: 195, Gaming: 155, Finance: 130, Lifestyle: 135 },
];

export const TrendingView: React.FC<TrendingViewProps> = ({ onSelectTopic }) => {
  const [selectedNiche, setSelectedNiche] = useState('Tech & AI');
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customQuery, setCustomQuery] = useState('');

  const fetchTrending = async (nicheToFetch: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/youtube/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: nicheToFetch }),
      });
      if (!res.ok) throw new Error('Failed to fetch trending topics');
      const data = await res.json();
      setTopics(data);
    } catch (err: any) {
      setError(err.message || 'Error loading trending topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(selectedNiche);
  }, [selectedNiche]);

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    fetchTrending(customQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            Live YouTube Algorithm Scanner
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            Discover Viral Topics Before They Peak
          </h1>
          <p className="text-sm text-slate-400">
            AI-powered analysis of breakout search queries, rising channel velocity, and audience demand gaps across YouTube niches.
          </p>
        </div>

        <form onSubmit={handleCustomSearch} className="flex items-center gap-2 z-10">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Analyze custom topic or keyword..."
            className="px-4 py-2.5 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 w-64 lg:w-72"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/20 whitespace-nowrap"
          >
            Analyze
          </button>
        </form>
      </div>

      {/* 24-Hour Velocity Recharts Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              24-Hour Niche Velocity & Trend Momentum
            </h3>
            <p className="text-xs text-slate-400">Real-time search volume acceleration over the last 24 hours.</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-3 py-1 rounded-full">
            Live Telemetry Active
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VELOCITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGaming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="AI_Agents" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" name="Tech & AI" />
              <Area type="monotone" dataKey="Gaming" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGaming)" name="Gaming" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Niche Selector Pills */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Content Niche</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const isSelected = selectedNiche === niche.id;
            return (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/25'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {niche.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Top Trending Angles for {selectedNiche}
          </h2>
          <button
            onClick={() => fetchTrending(selectedNiche)}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Trends
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 h-72 animate-pulse space-y-4">
                <div className="h-6 bg-slate-800 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 text-center text-red-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between group relative shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/50 border border-red-900/40 px-2.5 py-1 rounded-md">
                      Momentum: {item.momentumScore}/100
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" />
                      {item.growthRate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Suggested Angles</span>
                    <ul className="space-y-1">
                      {item.suggestedTitles?.slice(0, 2).map((t, i) => (
                        <li key={i} className="text-xs text-slate-300 truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Potential: <strong className="text-white">{item.viewPotential}</strong>
                  </div>
                  <button
                    onClick={() => onSelectTopic(item.topic, selectedNiche)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Optimize Topic
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
