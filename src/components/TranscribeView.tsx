import React, { useState } from 'react';
import { Mic, Sparkles, Loader2, Copy, Check } from 'lucide-react';

export const TranscribeView: React.FC = () => {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSimulateMic = async () => {
    setLoading(true);
    setTranscript(null);
    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: 'fake_audio', mimeType: 'audio/webm' }),
      });
      const data = await res.json();
      setTranscript(data.transcript);
    } catch {
      setTranscript('Error transcribing audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Mic className="w-3.5 h-3.5" />
          AI Audio Transcription (Gemini 3.5 Transcribe)
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Record & Transcribe YouTube Voiceovers
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Capture voice or upload audio files to instantly transcribe speech into accurate closed captions and video scripts.
        </p>

        <button
          onClick={handleSimulateMic}
          disabled={loading}
          className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-red-600/30 inline-flex items-center gap-3"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
          {loading ? 'Transcribing Audio...' : 'Record / Upload Voice Memo'}
        </button>
      </div>

      {transcript && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Transcription Result</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(transcript);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
};
