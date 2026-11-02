import React, { useState } from 'react';
import { MessageSquareCode, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const CoachView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am AI Kutty Model, your expert YouTube channel manager and growth coach. Ask me anything about improving your click-through rate (CTR), audience retention, thumbnail design, algorithm updates, or monetization strategies!',
    },
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/youtube/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model }),
      });
      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error connecting to AI Kutty Model. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <MessageSquareCode className="w-3.5 h-3.5" />
            AI Kutty Model Coach
          </div>
          <h1 className="text-2xl font-extrabold text-white">Multi-Turn Chatbot & Algorithm Advisor</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Chat with Gemini models configured with specialized YouTube creator roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Model:</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
          >
            <option value="gemini-4-argon">Gemini 4 Argon (Advanced Reasoning)</option>
            <option value="gemini-3.8-flash">Gemini 3.8 Flash (General Growth)</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast & Lightweight)</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[550px] shadow-2xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400 border border-slate-700'}`}>
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${isUser ? 'bg-red-600 text-white rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-red-400 border border-slate-700 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl p-4 text-sm flex items-center gap-2 rounded-tl-none">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                AI Kutty Model ({model}) is formulating advice...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Kutty Model anything about YouTube growth, CTR, or scripting..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
