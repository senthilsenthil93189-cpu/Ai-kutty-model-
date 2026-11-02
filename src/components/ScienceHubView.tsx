import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Dna, Atom } from 'lucide-react';

export const ScienceHubView: React.FC = () => {
  const [target, setTarget] = useState('TP53');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/science-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      alert('Failed to query science database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <Atom className="w-3.5 h-3.5" />
            Bioscience & Sci-Tech Channel Hub
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Explore Scientific Targets & AlphaFold Structures for Content
          </h1>
          <p className="text-sm text-slate-400">
            Query protein structures, biomedical literature, and genomic targets for deep-dive science YouTube videos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Quick Examples</h3>
          <div className="flex flex-wrap gap-2">
            {['TP53', 'BRCA1', 'EGFR', 'CRISPR-Cas9', 'AlphaFold 3', 'Mitochondria'].map((ex) => (
              <button
                key={ex}
                onClick={() => setTarget(ex)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>

          <form onSubmit={handleQuery} className="space-y-4 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target / Protein / Gene</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Analyze Scientific Target
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <h3 className="text-lg font-bold text-white">Scientific Analysis & Video Insights</h3>
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Querying AlphaFold DB & biomedical knowledge bases...</p>
            </div>
          ) : result ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {result}
            </div>
          ) : (
            <div className="py-24 text-center text-slate-500 text-xs">
              Select a scientific target or enter a gene/protein name to generate YouTube content insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
