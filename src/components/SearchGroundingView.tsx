import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Globe } from 'lucide-react';

export const SearchGroundingView: React.FC = () => {
  const [query, setQuery] = useState('YouTube monetization rules 2026');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch {
      setAnswer('Failed to fetch grounded search data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          Google Search Grounding (Gemini 3.8 Flash)
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Real-Time YouTube Algorithm & Trend Grounding
        </h1>
        <p className="text-sm text-slate-400">
          Query live web data and verified YouTube algorithm statistics to keep your channel strategy ahead of the curve.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search Ground
          </button>
        </form>
      </div>

      {answer && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-sm font-bold text-white">Grounded Answer</h3>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};
