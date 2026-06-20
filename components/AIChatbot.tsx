// components/AIChatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface Props {
  latexCode: string;
  onUpdateLatex?: (newLatex: string) => void;
}

export default function AIChatbot({ latexCode, onUpdateLatex }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm your LaTeX AI Assistant. Ask me to rewrite sections, adjust spacing, clean up formatting, or suggest professional phrasing. I can directly update your LaTeX code or guide you step-by-step.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          latexCode: latexCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();

      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: result.message || "I processed the request but couldn't get a description message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (result.updatedLatex && onUpdateLatex) {
        onUpdateLatex(result.updatedLatex);
      }
    } catch (err: any) {
      console.error('Chat API Error:', err);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: `Error: ${err.message || 'Failed to get a response. Please verify that GEMINI_API_KEY or OPENROUTER_API_KEY is configured in your environment.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const quickActions = [
    'Adjust vertical spacing',
    'Improve professional phrasing',
    'Shorten to fit one page',
    'How do I add a new section?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-white border border-zinc-200 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-zinc-950 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <Sparkles size={14} className="text-zinc-100" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">AI Assistant</h3>
                <p className="text-[9px] text-zinc-400 font-semibold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition p-1 cursor-pointer rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                    msg.sender === 'user'
                      ? 'bg-zinc-200 text-zinc-800'
                      : 'bg-zinc-950 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>

                {/* Bubble */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-zinc-950 text-white rounded-tr-none'
                        : 'bg-white text-zinc-800 border border-zinc-150 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-400 block px-1 font-semibold">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-zinc-950 text-white shrink-0 flex items-center justify-center">
                  <Bot size={12} />
                </div>
                <div className="bg-white border border-zinc-150 rounded-2xl rounded-tl-none px-4 py-3 flex items-center justify-center shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-zinc-100 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="whitespace-nowrap px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-350 text-[10px] font-bold text-zinc-650 hover:text-zinc-950 rounded-full transition cursor-pointer"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-zinc-150 flex gap-2 items-end shrink-0">
            <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 flex items-end focus-within:ring-1 focus-within:ring-zinc-700 transition">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask AI to tweak LaTeX or text..."
                className="flex-1 bg-transparent border-0 outline-none text-xs font-semibold placeholder-zinc-400 resize-none max-h-20 focus:ring-0 p-0 text-zinc-800"
              />
              <span className="text-[9px] text-zinc-350 font-bold uppercase tracking-wider flex items-center gap-0.5 select-none pl-1">
                Enter <CornerDownLeft size={8} />
              </span>
            </div>
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="p-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl transition disabled:opacity-40 flex items-center justify-center shrink-0 cursor-pointer shadow-md"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-zinc-950 hover:bg-zinc-850 text-white shadow-xl flex items-center justify-center transition hover:scale-105 active:scale-95 cursor-pointer relative group"
        title="AI Assistant"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {/* Glow / badge indication */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </button>
    </div>
  );
}
