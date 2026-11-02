import React, { useState } from 'react';
import { Sparkles, Film, Image as ImageIcon, Video, BookOpen, Wand2, Copy, Check, Play, Loader2 } from 'lucide-react';

interface Scene {
  sceneNumber: number;
  heading: string;
  narration: string;
  soundEffects: string;
  visualPrompt: string;
}

interface StoryResult {
  titles: string[];
  logline: string;
  scenes: Scene[];
}

export const StoryStudioView: React.FC = () => {
  const [genre, setGenre] = useState('Horror & Mystery');
  const [theme, setTheme] = useState('An isolated deep-sea research station receives an urgent SOS from the abyss.');
  const [targetDuration, setTargetDuration] = useState('8 minutes');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [error, setError] = useState('');

  // Image & Video generation state per scene
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  const [videoOperations, setVideoOperations] = useState<Record<number, string>>({});
  const [videoStatuses, setVideoStatuses] = useState<Record<number, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<number, string>>({});
  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    setLoading(true);
    setError('');
    setStory(null);
    setGeneratedImages({});
    setVideoUrls({});
    setVideoOperations({});

    try {
      const res = await fetch('/api/ai/generate-story-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, theme, targetDuration }),
      });
      if (!res.ok) throw new Error('Failed to generate story script');
      const data = await res.json();
      setStory(data);
    } catch (err: any) {
      setError(err.message || 'Error generating story script');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSceneImage = async (sceneNumber: number, prompt: string) => {
    setImageLoading(prev => ({ ...prev, [sceneNumber]: true }));
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: '16:9' }),
      });
      if (!res.ok) throw new Error('Failed to generate image');
      const data = await res.json();
      setGeneratedImages(prev => ({ ...prev, [sceneNumber]: data.imageUrl }));
    } catch (err: any) {
      alert(err.message || 'Failed to generate image');
    } finally {
      setImageLoading(prev => ({ ...prev, [sceneNumber]: false }));
    }
  };

  const handleGenerateSceneVideo = async (sceneNumber: number, prompt: string) => {
    setVideoLoading(prev => ({ ...prev, [sceneNumber]: true }));
    setVideoStatuses(prev => ({ ...prev, [sceneNumber]: 'Starting Veo video generation...' }));
    try {
      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: '16:9', resolution: '720p' }),
      });
      if (!res.ok) throw new Error('Failed to start video generation');
      const data = await res.json();
      const opName = data.operationName;
      setVideoOperations(prev => ({ ...prev, [sceneNumber]: opName }));

      // Poll status
      pollVideoStatus(sceneNumber, opName);
    } catch (err: any) {
      alert(err.message || 'Failed to start video generation');
      setVideoLoading(prev => ({ ...prev, [sceneNumber]: false }));
    }
  };

  const pollVideoStatus = async (sceneNumber: number, opName: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/ai/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });
        const data = await res.json();

        if (data.done) {
          clearInterval(interval);
          setVideoStatuses(prev => ({ ...prev, [sceneNumber]: 'Downloading video...' }));
          
          // Download video blob
          const dlRes = await fetch('/api/ai/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName }),
          });
          const blob = await dlRes.blob();
          const videoUrl = URL.createObjectURL(blob);
          setVideoUrls(prev => ({ ...prev, [sceneNumber]: videoUrl }));
          setVideoLoading(prev => ({ ...prev, [sceneNumber]: false }));
        } else {
          setVideoStatuses(prev => ({ ...prev, [sceneNumber]: 'Rendering cinematic video (Veo AI)...' }));
        }
      } catch (err) {
        clearInterval(interval);
        setVideoLoading(prev => ({ ...prev, [sceneNumber]: false }));
        alert('Error polling video status');
      }
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-3">
              <Film className="w-3.5 h-3.5" />
              AI Kutty Story Script & Media Studio
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Trending AI Storyteller & Cinematic Media Generator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Generate viral storytelling scripts, scene artwork with Gemini Imagen, and cinematic AI video clips with Veo.
            </p>
          </div>

          <form onSubmit={handleGenerateStory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Story Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Horror & Mystery">Horror & Mystery</option>
                  <option value="True Crime & Mystery">True Crime & Mystery</option>
                  <option value="Sci-Fi & Space Thriller">Sci-Fi & Space Thriller</option>
                  <option value="Epic History & Myth">Epic History & Myth</option>
                  <option value="Motivation & Success">Motivation & Success</option>
                  <option value="Animation & Fairy Tale">Animation & Fairy Tale</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Duration</label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="60 seconds (Shorts)">60 seconds (Shorts)</option>
                  <option value="3 minutes">3 minutes</option>
                  <option value="8 minutes">8 minutes</option>
                  <option value="15+ minutes">15+ minutes</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Story Theme / Plot Prompt</label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                rows={3}
                placeholder="Describe the plot or theme..."
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Story Script & Media Prompts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Story & Script
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900 rounded-xl text-xs text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Story Result */}
      {story && (
        <div className="space-y-8">
          {/* Titles & Logline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">Logline</span>
              <p className="text-sm text-slate-200 mt-1 italic">{story.logline}</p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Suggested Viral Titles</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {story.titles?.map((t, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                    <span className="text-xs font-bold text-white">{t}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(t);
                        alert('Title copied!');
                      }}
                      className="self-start text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3 h-3" /> Copy Title
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scenes Breakdown with Image & Video Generators */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-white">Scene-by-Scene Script & Media Generator</h3>

            <div className="grid grid-cols-1 gap-6">
              {story.scenes?.map((scene) => (
                <div key={scene.sceneNumber} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/40 px-3 py-1 rounded-lg">
                      Scene {scene.sceneNumber}
                    </span>
                    <h4 className="text-base font-bold text-white">{scene.heading}</h4>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Narration / Voiceover Script</span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-sans">
                          {scene.narration}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sound Effects (SFX) & Music</span>
                        <p className="text-xs text-amber-300 bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
                          {scene.soundEffects}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Visual Prompt</span>
                        <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                          {scene.visualPrompt}
                        </p>
                      </div>
                    </div>

                    {/* Media Generation Panel (Image & Video) */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          AI Scene Visual & Video Clip
                        </span>

                        {/* Image Output */}
                        {generatedImages[scene.sceneNumber] ? (
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 relative group">
                            <img src={generatedImages[scene.sceneNumber]} alt={`Scene ${scene.sceneNumber}`} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                            No image generated yet
                          </div>
                        )}

                        {/* Video Output */}
                        {videoUrls[scene.sceneNumber] && (
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 relative mt-2">
                            <video src={videoUrls[scene.sceneNumber]} controls autoPlay loop className="w-full h-full object-cover" />
                          </div>
                        )}

                        {videoLoading[scene.sceneNumber] && (
                          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            {videoStatuses[scene.sceneNumber] || 'Processing Veo video...'}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                        <button
                          onClick={() => handleGenerateSceneImage(scene.sceneNumber, scene.visualPrompt)}
                          disabled={imageLoading[scene.sceneNumber]}
                          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          {imageLoading[scene.sceneNumber] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                          Generate Image
                        </button>
                        <button
                          onClick={() => handleGenerateSceneVideo(scene.sceneNumber, scene.visualPrompt)}
                          disabled={videoLoading[scene.sceneNumber]}
                          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
                        >
                          {videoLoading[scene.sceneNumber] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                          Generate Video (Veo)
                        </button>
                      </div>
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
