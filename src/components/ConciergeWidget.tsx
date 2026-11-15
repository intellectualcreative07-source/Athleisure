import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { buildChatHandoffWhatsAppUrl } from '../utils/whatsapp';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    text: 'Welcome to Stylesse ("Style with ease"). Ask me about unisex sizing (XS–XXL), AeroWeave polyester breathability, colorways, or capsule sets—or jump straight to WhatsApp anytime.',
  },
];

const STARTER_PROMPTS = [
  'What unisex size fits 5\'9" athletic build?',
  'How does AeroWeave polyester handle sweat?',
  'Recommend a Track-to-Street kit',
];

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setErrorMsg('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        setErrorMsg(
          data.error ||
            'Unable to get a response right now. Use "Continue on WhatsApp" below for instant help.'
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply!,
        },
      ]);
    } catch {
      setErrorMsg(
        'Connection interrupted. You can retry or continue directly on WhatsApp.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const whatsAppHandoffUrl = buildChatHandoffWhatsAppUrl(messages);

  return (
    <div className="fixed right-5 bottom-5 z-40">
      {isOpen ? (
        <section
          aria-label="Stylesse Fit Concierge and WhatsApp Assistant"
          className="flex h-[520px] max-h-[calc(100vh-2.5rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-[#111317]/15 bg-[#F5F3EE] text-[#111317] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#101216] px-4 py-3.5 text-white">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#B89668]" aria-hidden="true" />
                <h2 className="truncate font-display text-sm font-semibold">
                  Stylesse Concierge
                </h2>
              </div>
              <p className="truncate text-[11px] text-[#EAE6DF]/70">
                Fit advice &amp; direct WhatsApp ordering
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={whatsAppHandoffUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-md bg-[#1F6E43] px-2.5 text-[11px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#195a36]"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#EAE6DF]/75 hover:bg-white/10 hover:text-white"
                aria-label="Close concierge chat"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed sm:text-[13px] ${
                      isUser
                        ? 'bg-[#101216] text-[#F5F3EE]'
                        : 'border border-[#111317]/10 bg-white text-[#111317]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-[#111317]/10 bg-white px-3.5 py-2.5 text-xs text-[#111317]/65">
                  Checking Stylesse fit &amp; fabric guide...
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-red-800/20 bg-red-50 px-3.5 py-2.5 text-xs text-red-900"
              >
                {errorMsg}
              </div>
            )}

            {messages.length === 1 && !isSending && (
              <div className="pt-1">
                <p className="mb-2 text-[11px] font-medium text-[#111317]/55">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="rounded-lg border border-[#111317]/15 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-[#111317]/85 transition-colors hover:border-[#B89668] hover:text-[#111317]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Composer + WhatsApp Handoff Bar */}
          <div className="border-t border-[#111317]/10 bg-white p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="concierge-chat-input" className="sr-only">
                Ask Stylesse Concierge
              </label>
              <input
                id="concierge-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sizing, polyester, orders..."
                className="min-h-[40px] flex-1 rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-xs text-[#111317] placeholder:text-[#111317]/45 focus:border-[#B89668] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#101216] text-[#F5F3EE] transition-colors hover:bg-[#232730] disabled:opacity-45"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <a
              href={whatsAppHandoffUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-[#1F6E43]/25 bg-[#1F6E43]/8 px-3 py-2 text-xs font-semibold text-[#175432] transition-colors hover:bg-[#1F6E43]/15"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Take this chat to WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-[46px] items-center gap-2.5 rounded-full border border-white/15 bg-[#101216] px-4 py-2.5 text-xs font-semibold text-[#F5F3EE] shadow-xl transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#B89668] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
          aria-label="Open Stylesse Fit Assistant and WhatsApp support"
        >
          <MessageCircle className="h-4 w-4 text-[#B89668]" aria-hidden="true" />
          <span className="whitespace-nowrap">Fit Help &amp; WhatsApp</span>
        </button>
      )}
    </div>
  );
}
