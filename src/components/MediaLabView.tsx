import React, { useState } from 'react';
import { ImageIcon, Video, Sparkles, Loader2, Download, Wand2, Play, Upload, Film } from 'lucide-react';

export const MediaLabView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'image' | 'video' | 'animate'>('image');

  // Image state
  const [imagePrompt, setImagePrompt] = useState('Cinematic close-up portrait of a futuristic tech innovator, dramatic studio lighting, 8k');
  const [imageMode, setImageMode] = useState<'realistic' | 'thumbnail'>('realistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Video state (Text-to-Video)
  const [videoPrompt, setVideoPrompt] = useState('A drone shot flying fast over a glowing neon cyberpunk city at night with flying cars');
  const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
  const [videoResolution, setVideoResolution] = useState('720p');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoStatusText, setVideoStatusText] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Animate Image to Video state (Image-to-Video via Veo)
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/png');
  const [animPrompt, setAnimPrompt] = useState('Animate this image cinematically with dramatic camera pan and lighting shifts');
  const [animAspectRatio, setAnimAspectRatio] = useState('16:9');
  const [animLoading, setAnimLoading] = useState(false);
  const [animStatusText, setAnimStatusText] = useState('');
  const [animatedVideoUrl, setAnimatedVideoUrl] = useState<string | null>(null);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setImageLoading(true);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, mode: imageMode, aspectRatio }),
      });
      if (!res.ok) throw new Error('Failed to generate image');
      const data = await res.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      alert(err.message || 'Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;

    setVideoLoading(true);
    setGeneratedVideoUrl(null);
    setVideoStatusText('Initializing Veo video generation...');

    try {
      const res = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio: videoAspectRatio, resolution: videoResolution }),
      });
      if (!res.ok) throw new Error('Failed to start video generation');
      const data = await res.json();
      pollVideo(data.operationName, setGeneratedVideoUrl, setVideoStatusText, setVideoLoading);
    } catch (err: any) {
      alert(err.message || 'Failed to start video generation');
      setVideoLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageMime(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnimateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImageFile) {
      alert('Please upload or select an image first.');
      return;
    }

    setAnimLoading(true);
    setAnimatedVideoUrl(null);
    setAnimStatusText('Uploading photo and initializing Veo fast generation...');

    try {
      const res = await fetch('/api/ai/animate-image-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageFile,
          mimeType: selectedImageMime,
          prompt: animPrompt,
          aspectRatio: animAspectRatio,
        }),
      });
      if (!res.ok) throw new Error('Failed to start animation');
      const data = await res.json();
      pollVideo(data.operationName, setAnimatedVideoUrl, setAnimStatusText, setAnimLoading);
    } catch (err: any) {
      alert(err.message || 'Failed to animate image');
      setAnimLoading(false);
    }
  };

  const pollVideo = (opName: string, setUrl: (url: string) => void, setStatus: (s: string) => void, setLoading: (l: boolean) => void) => {
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
          setStatus('Downloading rendered video clip...');

          const dlRes = await fetch('/api/ai/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: opName }),
          });
          const blob = await dlRes.blob();
          const url = URL.createObjectURL(blob);
          setUrl(url);
          setLoading(false);
        } else {
          setStatus('Rendering cinematic frames with Veo AI...');
        }
      } catch (err) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Kutty Media Lab
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Realistic Photo, High-CTR Thumbnail & Image-to-Video Studio
          </h1>
          <p className="text-sm text-slate-400">
            Generate photorealistic images, high-attractive YouTube thumbnails, or animate photos into cinematic videos using Veo.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSubTab('image')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-2xl transition-all whitespace-nowrap ${
            activeSubTab === 'image'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Realistic Image & Thumbnail Generator
        </button>
        <button
          onClick={() => setActiveSubTab('animate')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-2xl transition-all whitespace-nowrap ${
            activeSubTab === 'animate'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Animate Images into Video (Veo)
        </button>
        <button
          onClick={() => setActiveSubTab('video')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-2xl transition-all whitespace-nowrap ${
            activeSubTab === 'video'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          Text-to-Video (Veo)
        </button>
      </div>

      {/* IMAGE & THUMBNAIL TAB */}
      {activeSubTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Generation Settings</h3>
            <form onSubmit={handleGenerateImage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Output Style</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setImageMode('realistic')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      imageMode === 'realistic' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Realistic Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('thumbnail')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      imageMode === 'thumbnail' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    High-CTR Thumbnail
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prompt / Subject</label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="16:9">16:9 (YouTube Landscape Thumbnail)</option>
                  <option value="9:16">9:16 (YouTube Shorts / Story)</option>
                  <option value="1:1">1:1 (Square Avatar / Post)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={imageLoading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {imageLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating {imageMode === 'thumbnail' ? 'Thumbnail' : 'Realistic Photo'}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate {imageMode === 'thumbnail' ? 'Attractive Thumbnail' : 'Realistic Image'}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            {imageLoading ? (
              <div className="space-y-4 py-16">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Rendering high-resolution visual asset...</p>
              </div>
            ) : generatedImageUrl ? (
              <div className="space-y-4 w-full">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-h-[450px] flex items-center justify-center bg-slate-950">
                  <img src={generatedImageUrl} alt="Generated Asset" className="max-w-full max-h-[450px] object-contain" />
                </div>
                <a
                  href={generatedImageUrl}
                  download="aikutty_asset.png"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/25"
                >
                  <Download className="w-4 h-4" /> Download Image
                </a>
              </div>
            ) : (
              <div className="space-y-3 py-16">
                <ImageIcon className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500">Your generated realistic photo or attractive thumbnail will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANIMATE PHOTO TO VIDEO TAB (Veo Image-to-Video) */}
      {activeSubTab === 'animate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Animate Photo into Video (Veo AI)</h3>
            <form onSubmit={handleAnimateImage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Upload Photo</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950 transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {selectedImageFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={selectedImageFile} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                      <span className="text-xs font-bold text-emerald-400">Photo Uploaded Successfully ✓ (Click to change)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-300 font-semibold">Click to upload photo or drag & drop</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Animation Motion Prompt</label>
                <textarea
                  value={animPrompt}
                  onChange={(e) => setAnimPrompt(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Aspect Ratio</label>
                <select
                  value={animAspectRatio}
                  onChange={(e) => setAnimAspectRatio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait / Shorts)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={animLoading || !selectedImageFile}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {animLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {animStatusText || 'Animating Photo into Video...'}
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    Animate Image into Video (Veo Fast)
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            {animLoading ? (
              <div className="space-y-4 py-16">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                <p className="text-xs text-red-400 font-medium">{animStatusText || 'Rendering animation with Veo...'}</p>
                <p className="text-[11px] text-slate-500">Veo fast generation in progress...</p>
              </div>
            ) : animatedVideoUrl ? (
              <div className="space-y-4 w-full">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                  <video src={animatedVideoUrl} controls autoPlay loop className="w-full max-h-[400px] object-contain mx-auto" />
                </div>
                <a
                  href={animatedVideoUrl}
                  download="aikutty_animated_video.mp4"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/25"
                >
                  <Download className="w-4 h-4" /> Download Animated MP4
                </a>
              </div>
            ) : (
              <div className="space-y-3 py-16">
                <Film className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500">Upload a photo and click Animate to generate your Veo video clip.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEXT-TO-VIDEO TAB */}
      {activeSubTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Text-to-Video Generator (Veo AI)</h3>
            <form onSubmit={handleGenerateVideo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Video Prompt</label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Aspect Ratio</label>
                  <select
                    value={videoAspectRatio}
                    onChange={(e) => setVideoAspectRatio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait / Shorts)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Resolution</label>
                  <select
                    value={videoResolution}
                    onChange={(e) => setVideoResolution(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={videoLoading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {videoLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Video Clip...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Generate Text-to-Video (Veo)
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            {videoLoading ? (
              <div className="space-y-4 py-16">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                <p className="text-xs text-red-400 font-medium">{videoStatusText || 'Rendering video...'}</p>
              </div>
            ) : generatedVideoUrl ? (
              <div className="space-y-4 w-full">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                  <video src={generatedVideoUrl} controls autoPlay loop className="w-full max-h-[400px] object-contain mx-auto" />
                </div>
                <a
                  href={generatedVideoUrl}
                  download="aikutty_video.mp4"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/25"
                >
                  <Download className="w-4 h-4" /> Download MP4 Video
                </a>
              </div>
            ) : (
              <div className="space-y-3 py-16">
                <Video className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500">Your generated text-to-video clip will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
