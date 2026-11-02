import React, { useState } from 'react';
import { OptimizationResult } from '../types';
import { Wand2, Copy, Check, BookmarkCheck, Sparkles, Youtube, Smartphone, Monitor, Film, Tag, Clock, FileText, Image, AlertCircle, Share2 } from 'lucide-react';

interface OptimizerViewProps {
  initialTopic?: string;
  initialNiche?: string;
  onSaveToVault: (result: OptimizationResult) => void;
}

export const OptimizerView: React.FC<OptimizerViewProps> = ({ initialTopic = '', initialNiche = 'Tech & AI', onSaveToVault }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [niche, setNiche] = useState(initialNiche);
  const [targetAudience, setTargetAudience] = useState('Tech Enthusiasts & Creators');
  const [tone, setTone] = useState('Energetic & Engaging');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'titles' | 'description' | 'hook' | 'script' | 'thumbnail' | 'tags'>('titles');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/youtube/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche, targetAudience, tone }),
      });
      if (!res.ok) throw new Error('Failed to generate optimization package');
      const data = await res.json();
      
      const fullResult: OptimizationResult = {
        id: Math.random().toString(36).substring(2, 9),
        topic,
        niche,
        ...data,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Idea',
      };
      setResult(fullResult);
    } catch (err: any) {
      setError(err.message || 'Error generating optimization package');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyAllTags = () => {
    if (!result?.tags) return;
    navigator.clipboard.writeText(result.tags.join(', '));
    setCopiedTag('ALL');
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToVault(result);
    setSaved(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Input Generator Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-3">
              <Wand2 className="w-3.5 h-3.5" />
              AI YouTube Video Optimizer & CTR Maximizer
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Craft High-Performing Titles, Scripts & SEO Metadata
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Enter your core topic or video idea. Gemini will generate high-CTR titles, timestamps description, retention hook, and script blueprint.
            </p>
          </div>

          <form onSubmit={handleOptimize} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Video Topic / Core Concept</label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. How I Built an Autonomous AI Agent in 24 Hours..."
                  required
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-sm shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Content Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Tech & AI">Tech & AI</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Finance & Crypto">Finance & Crypto</option>
                  <option value="Lifestyle & Vlogs">Lifestyle & Vlogs</option>
                  <option value="Education & Science">Education & Science</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Tone & Style</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Energetic & Engaging">Energetic & Engaging</option>
                  <option value="Professional & Analytical">Professional & Analytical</option>
                  <option value="Casual & Conversational">Casual & Conversational</option>
                  <option value="Dramatic & Cinematic">Dramatic & Cinematic</option>
                  <option value="Educational & Direct">Educational & Direct</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Optimization Package...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Optimization Suite
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('titles')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'titles' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                High-CTR Titles ({result.titles?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'description' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                SEO Description
              </button>
              <button
                onClick={() => setActiveTab('hook')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'hook' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                30s Hook Script
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'script' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                Script Outline ({result.scriptOutline?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('thumbnail')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'thumbnail' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                Thumbnail Concept
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'tags' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                Tags & Keywords
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                saved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved to Vault
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Save to Vault
                </>
              )}
            </button>
          </div>

          {/* TAB 1: TITLES */}
          {activeTab === 'titles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Suggested High-CTR Titles</h3>
                  <p className="text-xs text-slate-400">Ranked by algorithmic appeal and psychological curiosity gap.</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      previewMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Desktop Preview
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      previewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile Preview
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.titles?.map((t, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/40 px-2 py-0.5 rounded">
                          CTR Score: {t.score}/100
                        </span>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded">
                          {t.type}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {t.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        <strong>Why it works:</strong> {t.rationale}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(t.title);
                          alert('Title copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Title
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* YouTube Feed Preview Simulator */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Youtube className="w-4 h-4 text-red-500" />
                  YouTube Feed Preview ({previewMode})
                </div>
                <div className={`bg-slate-950 border border-slate-800 rounded-xl p-4 ${previewMode === 'mobile' ? 'max-w-xs mx-auto' : 'max-w-xl'}`}>
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-all"></div>
                    <span className="text-xs font-bold text-slate-300 z-10 text-center px-4">
                      {result.thumbnailConcept?.textOverlay || topic}
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                      14:20
                    </span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <div className="w-9 h-9 rounded-full bg-red-600 shrink-0 flex items-center justify-center font-bold text-white text-xs">
                      CM
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white line-clamp-2">
                        {result.titles?.[0]?.title}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        CreatorMind AI · 125K views · 2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">SEO-Optimized Description & Chapters</h3>
                  <p className="text-xs text-slate-400">Includes keyword-rich intro, automatic timestamps, and community links.</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.description);
                    alert('Description copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Description
                </button>
              </div>

              <textarea
                readOnly
                value={result.description}
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none resize-none leading-relaxed"
              ></textarea>
            </div>
          )}

          {/* TAB 3: HOOK */}
          {activeTab === 'hook' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">First 30s Retention Hook Script</h3>
                  <p className="text-xs text-slate-400">Designed to eliminate the audience drop-off cliff in the first 30 seconds.</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.hookScript);
                    alert('Hook script copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Hook Script
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {result.hookScript}
              </div>
            </div>
          )}

          {/* TAB 4: SCRIPT OUTLINE */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Chapter-by-Chapter Script Outline</h3>
                  <p className="text-xs text-slate-400">Structured pacing with visual and audio production cues.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.scriptOutline?.map((ch, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/40 px-2.5 py-1 rounded">
                        {ch.time}
                      </span>
                      <h4 className="text-base font-bold text-white">{ch.title}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Talking Points</span>
                        <p className="text-xs text-slate-300 mt-1">{ch.talkingPoints}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Visual / B-Roll Cue</span>
                        <p className="text-xs text-red-300 mt-1">{ch.visualCue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: THUMBNAIL CONCEPT */}
          {activeTab === 'thumbnail' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">High-CTR Thumbnail Blueprint</h3>
                <p className="text-xs text-slate-400">Visual composition rules to achieve &gt;8% Click-Through Rate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-gradient-to-br from-red-950/40 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_50%)]"></div>
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Visual Overlay Text</span>
                    <h4 className="text-xl font-extrabold text-white">{result.thumbnailConcept?.textOverlay}</h4>
                  </div>
                  <div className="z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-sm">
                    <span className="text-[10px] text-slate-400 font-semibold block">Emotional Trigger</span>
                    <span className="text-xs text-white font-medium">{result.thumbnailConcept?.emotionalTrigger}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Focal Subject / Foreground</span>
                    <p className="text-xs text-slate-200">{result.thumbnailConcept?.focalPoint}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Color Palette & Contrast</span>
                    <p className="text-xs text-slate-200">{result.thumbnailConcept?.colorPalette}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layout Composition</span>
                    <p className="text-xs text-slate-200">{result.thumbnailConcept?.layoutDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TAGS */}
          {activeTab === 'tags' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Optimized YouTube Tags & Keywords</h3>
                  <p className="text-xs text-slate-400">High-volume tags to boost search ranking and suggested video placement.</p>
                </div>
                <button
                  onClick={handleCopyAllTags}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedTag === 'ALL' ? 'Copied All!' : 'Copy All Tags'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {result.tags?.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopyTag(tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-xl transition-all"
                  >
                    <span>{tag}</span>
                    {copiedTag === tag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
