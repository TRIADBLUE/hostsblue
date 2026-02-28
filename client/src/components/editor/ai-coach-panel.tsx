import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useEditor } from './editor-context';
import { websiteBuilderApi, aiCreditsApi } from '@/lib/api';
import { OperationPreviewList } from './operation-preview';
import { useQuery } from '@tanstack/react-query';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  operations?: any[];
  suggestions?: string[];
  costCents?: number;
}

export function AICoachPanel() {
  const { state, dispatch } = useEditor();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dismissedOps, setDismissedOps] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: creditBalance } = useQuery({
    queryKey: ['ai-credits-balance'],
    queryFn: aiCreditsApi.getBalance,
    refetchInterval: 30000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || !state.project || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await websiteBuilderApi.aiChat(state.project.uuid, {
        message: msg,
        history: messages.map(m => ({ role: m.role, content: m.content })),
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.message,
        timestamp: new Date().toISOString(),
        operations: result.operations,
        suggestions: result.suggestions,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg = err?.message?.includes('402')
        ? "You're running low on AI credits. Add more credits to keep chatting with Coach Green."
        : 'Sorry, I had a hiccup there. Try again?';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOperation = (op: any) => {
    if (op.type === 'add_block' && op.payload?.block) {
      dispatch({ type: 'ADD_BLOCK_DATA', block: op.payload.block, afterBlockId: op.payload.afterBlockId });
    } else if (op.type === 'update_block' && op.payload?.blockId) {
      dispatch({ type: 'UPDATE_BLOCK', blockId: op.payload.blockId, data: op.payload.updates });
    } else if (op.type === 'remove_block' && op.payload?.blockId) {
      dispatch({ type: 'REMOVE_BLOCK', blockId: op.payload.blockId });
    } else if (op.type === 'update_theme' && op.payload) {
      dispatch({ type: 'UPDATE_THEME', theme: op.payload });
    }
    setDismissedOps(prev => new Set([...prev, op.id]));
  };

  const handleDismissOperation = (op: any) => {
    setDismissedOps(prev => new Set([...prev, op.id]));
  };

  const handleAcceptAll = (operations: any[]) => {
    operations.forEach(op => handleAcceptOperation(op));
  };

  const QUICK_SUGGESTIONS = [
    'Add a testimonials section',
    'How can I improve my SEO?',
    'Help me get more customers',
    'Make my hero section more compelling',
  ];

  const balanceCents = creditBalance?.balanceCents || 0;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#064A6C] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Coach Green</h3>
          </div>
        </div>
        <button onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: null })} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Credit bar */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">AI Credits</span>
        <span className={`text-xs font-semibold ${balanceCents > 100 ? 'text-[#064A6C]' : balanceCents > 0 ? 'text-amber-600' : 'text-red-600'}`}>
          ${(balanceCents / 100).toFixed(2)}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center pt-2">
            <div className="w-12 h-12 rounded-full bg-[#064A6C]/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-[#064A6C]" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Hey! I'm Coach Green</p>
            <p className="text-xs text-gray-500 mb-4">Your website-building partner. Ask me anything!</p>
            <div className="space-y-2">
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-full text-left px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-[7px] text-gray-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[90%] space-y-2">
              <div className={`rounded-[7px] px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#064A6C] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {/* Operations with previews */}
              {msg.operations && msg.operations.length > 0 && (
                <OperationPreviewList
                  operations={msg.operations.filter((op: any) => !dismissedOps.has(op.id))}
                  onAccept={handleAcceptOperation}
                  onDismiss={handleDismissOperation}
                  onAcceptAll={() => handleAcceptAll(msg.operations!.filter((op: any) => !dismissedOps.has(op.id)))}
                />
              )}

              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {msg.suggestions.map((s: string, si: number) => (
                    <button
                      key={si}
                      onClick={() => handleSend(s)}
                      className="px-2 py-0.5 bg-white text-[#064A6C] rounded text-[10px] border border-[#064A6C]/20 hover:bg-[#064A6C]/5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-[7px] px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-gray-400">Coach Green is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask Coach Green..."
            className="flex-1 border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2 bg-[#064A6C] text-white rounded-[7px] hover:bg-[#053C58] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          ~$0.02 per message
        </p>
      </div>
    </div>
  );
}
