import React, { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react';

export const NanoBananaView: React.FC = () => {
  const [prompt, setPrompt] = useState('Photorealistic futuristic studio setup for a top creator, volumetric lighting, 4k');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('1K');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl(null);
    try {
      const res = await fetch('/api/ai/nano-banana-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, imageSize }),
      });
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch {
      alert('Failed to generate image');
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
            <Sparkles className="w-3.5 h-3.5" />
            Nano Banana 2.1 Studio (gemini-nano-banana-2.1)
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            High-Resolution Image Generation & Editing
          </h1>
          <p className="text-sm text-slate-400">
            Create ultra-high definition (1K, 2K, 4K) artwork, product photos, and channel assets using Gemini Nano Banana 2.1.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Nano Banana Settings</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:3">4:3 Standard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Resolution Size</label>
                <select
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="1K">1K Resolution</option>
                  <option value="2K">2K High Definition</option>
                  <option value="4K">4K Ultra HD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate High-Res Asset
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          {loading ? (
            <div className="space-y-4 py-16">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Generating with Nano Banana 2.1...</p>
            </div>
          ) : imageUrl ? (
            <div className="space-y-4 w-full">
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-h-[450px] flex items-center justify-center bg-slate-950">
                <img src={imageUrl} alt="Nano Banana Art" className="max-w-full max-h-[450px] object-contain" />
              </div>
              <a
                href={imageUrl}
                download="nanobanana_image.png"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/25"
              >
                <Download className="w-4 h-4" /> Download High-Res Image
              </a>
            </div>
          ) : (
            <div className="space-y-3 py-16">
              <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">Your generated Nano Banana image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
