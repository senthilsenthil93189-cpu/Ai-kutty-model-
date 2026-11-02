import React, { useState } from 'react';
import { Sparkles, Film, Image as ImageIcon, Video, BookOpen, Loader2, Copy, Check, PawPrint } from 'lucide-react';

interface Episode {
  episodeNumber: number;
  title: string;
  synopsis: string;
  moralOrHook: string;
  visualPrompt: string;
}

interface AnimalSeriesResult {
  seriesTitle: string;
  characterName: string;
  characterBio: string;
  episodes: Episode[];
}

export const AnimalSeriesView: React.FC = () => {
  const [animalArchetype, setAnimalArchetype] = useState('Brave Lion Cub');
  const [seriesTheme, setSeriesTheme] = useState('Exploring the Whispering Jungle and solving animal mysteries');
  const [targetAudience, setTargetAudience] = useState('Kids & Families (Ages 6-12)');
  const [loading, setLoading] = useState(false);
  const [seriesData, setSeriesData] = useState<AnimalSeriesResult | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  const handleGenerateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesTheme.trim()) return;

    setLoading(true);
    setSeriesData(null);
    setGeneratedImages({});

    try {
      const res = await fetch('/api/ai/generate-story-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: 'Animation & Animal Series',
          theme: `Cute animal character series starring a ${animalArchetype} named Koko. Theme: ${seriesTheme}. Target audience: ${targetAudience}.`,
          targetDuration: '5 Episodes Mini-Series'
        }),
      });
      const data = await res.json();
      
      const formatted: AnimalSeriesResult = {
        seriesTitle: `${animalArchetype}'s Big Adventures`,
        characterName: 'Koko',
        characterBio: `A courageous and clever ${animalArchetype} who loves exploring nature and helping forest friends.`,
        episodes: (data.scenes || []).map((s: any, idx: number) => ({
          episodeNumber: idx + 1,
          title: s.heading || `Episode ${idx + 1}: The Great Discovery`,
          synopsis: s.narration || 'An exciting adventure unfolds in the heart of the wilderness.',
          moralOrHook: 'Teamwork and curiosity always win.',
          visualPrompt: s.visualPrompt || `Cute 3D animated ${animalArchetype} character in a vibrant magical forest, Pixar style, high detail`
        }))
      };
      setSeriesData(formatted);
    } catch {
      setSeriesData({
        seriesTitle: `${animalArchetype}'s Jungle Quest`,
        characterName: 'Koko',
        characterBio: `A fearless ${animalArchetype}.`,
        episodes: [
          { episodeNumber: 1, title: 'Episode 1: The Secret Waterfall', synopsis: 'Koko discovers a hidden path behind the waterfall.', moralOrHook: 'Never stop exploring.', visualPrompt: `Adorable 3D ${animalArchetype} near a glowing waterfall, Pixar style` },
          { episodeNumber: 2, title: 'Episode 2: The Lost Baby Bird', synopsis: 'Koko helps a little bird find its nest.', moralOrHook: 'Kindness is strength.', visualPrompt: `Adorable 3D ${animalArchetype} helping a tiny bird, warm sunny forest` }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCharacterArt = async (epNum: number, prompt: string) => {
    setImageLoading(prev => ({ ...prev, [epNum]: true }));
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'thumbnail', aspectRatio: '16:9' }),
      });
      const data = await res.json();
      setGeneratedImages(prev => ({ ...prev, [epNum]: data.imageUrl }));
    } catch {
      alert('Failed to generate character artwork');
    } finally {
      setImageLoading(prev => ({ ...prev, [epNum]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <PawPrint className="w-3.5 h-3.5" />
            AI Animal Character Series Studio
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Create Viral Animated Animal Series & Episodes
          </h1>
          <p className="text-sm text-slate-400">
            Design adorable animal characters, generate episodic mini-series plots, scripts, and high-CTR thumbnail artwork for YouTube.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleGenerateSeries} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Animal Character Archetype</label>
              <select
                value={animalArchetype}
                onChange={(e) => setAnimalArchetype(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="Brave Lion Cub">Brave Lion Cub</option>
                <option value="Cunning Fox Detective">Cunning Fox Detective</option>
                <option value="Wise Old Owl">Wise Old Owl</option>
                <option value="Curious Panda Explorer">Curious Panda Explorer</option>
                <option value="Energetic Squirrel Adventurer">Energetic Squirrel Adventurer</option>
                <option value="Gentle Baby Elephant">Gentle Baby Elephant</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="Kids & Families (Ages 6-12)">Kids & Families (Ages 6-12)</option>
                <option value="Toddlers & Bedtime Stories">Toddlers & Bedtime Stories</option>
                <option value="Teens & General Animation">Teens & General Animation</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Series Theme & Universe</label>
            <textarea
              value={seriesTheme}
              onChange={(e) => setSeriesTheme(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Animal Series Bible & Episodes
          </button>
        </form>
      </div>

      {seriesData && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
            <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Series Bible</span>
            <h2 className="text-2xl font-extrabold text-white">{seriesData.seriesTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>Hero Character:</strong> {seriesData.characterName} the {animalArchetype} — {seriesData.characterBio}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-white">Episode Mini-Series Arc</h3>
            <div className="grid grid-cols-1 gap-6">
              {seriesData.episodes.map((ep) => (
                <div key={ep.episodeNumber} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/40 px-3 py-1 rounded-lg">
                      Episode {ep.episodeNumber}
                    </span>
                    <h4 className="text-base font-bold text-white">{ep.title}</h4>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Synopsis</span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                          {ep.synopsis}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Moral / Core Lesson</span>
                        <p className="text-xs text-emerald-400 bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/40">
                          {ep.moralOrHook}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          Character & Thumbnail Art
                        </span>

                        {generatedImages[ep.episodeNumber] ? (
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-800">
                            <img src={generatedImages[ep.episodeNumber]} alt={ep.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                            No artwork generated yet
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleGenerateCharacterArt(ep.episodeNumber, ep.visualPrompt)}
                        disabled={imageLoading[ep.episodeNumber]}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
                      >
                        {imageLoading[ep.episodeNumber] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Episode Thumbnail Art
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
