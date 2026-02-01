
import React, { useState, useRef, useEffect } from 'react';
import { askKitchenAssistant } from '../services/geminiService';
import { StockItem, Transaction } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiChatProps {
  stock: StockItem[];
  transactions: Transaction[];
}

const GeminiChat: React.FC<GeminiChatProps> = ({ stock, transactions }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'नमस्ते, अधिकारी। किचन इंटेलिजेंस सक्रिय है। मैं आपके ऑडिट में कैसे सहायता कर सकता हूँ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askKitchenAssistant(userMsg, stock, transactions);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[450px]">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
        <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">जेमिनी कमांड (AI)</h3>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-xl p-4 text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none font-medium' 
                : 'bg-amber-50 text-slate-800 rounded-tl-none border border-amber-100 font-medium'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg rounded-tl-none p-4 flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="सिस्टम प्रश्न पूछें..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
