import React, { useState } from 'react';
import { Music, Sparkles, Loader2, Play, Download } from 'lucide-react';

export const MusicStudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('Epic cinematic orchestral track with uplifting brass and electronic beats for YouTube video intro');
  const [model, setModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>('');

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAudioUrl(null);
    setLyrics('');

    try {
      const res = await fetch('/api/ai/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      if (!res.ok) throw new Error('Failed to generate music');
      const data = await res.json();

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        setAudioUrl(URL.createObjectURL(blob));
      }
      if (data.lyrics) {
        setLyrics(data.lyrics);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate music');
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
            <Music className="w-3.5 h-3.5" />
            AI Music Studio (Lyria)
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Generate Copyright-Free Music & Soundtracks
          </h1>
          <p className="text-sm text-slate-400">
            Create custom background music and soundtracks for your YouTube videos using Lyria 3.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Music Generator Settings</h3>
          <form onSubmit={handleGenerateMusic} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prompt / Mood</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Model Duration</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="lyria-3-clip-preview">Lyria Clip (Short clips up to 30s)</option>
                <option value="lyria-3-pro-preview">Lyria Pro (Full-length tracks)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Music Track...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Soundtrack
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          {loading ? (
            <div className="space-y-4 py-16">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Composing audio track with Lyria 3...</p>
            </div>
          ) : audioUrl ? (
            <div className="space-y-6 w-full">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <Music className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
                <audio src={audioUrl} controls className="w-full" />
              </div>
              {lyrics && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Generated Metadata / Lyrics</span>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{lyrics}</p>
                </div>
              )}
              <a
                href={audioUrl}
                download="aikutty_soundtrack.wav"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/25"
              >
                <Download className="w-4 h-4" /> Download Soundtrack
              </a>
            </div>
          ) : (
            <div className="space-y-3 py-16">
              <Music className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">Your generated music track will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
