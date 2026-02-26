import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Check, XIcon } from 'lucide-react';
import { useEditor } from './editor-context';
import { websiteBuilderApi } from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  operations?: any[];
  suggestions?: string[];
}

export function AICoachPanel() {
  const { state, dispatch } = useEditor();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !state.project || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await websiteBuilderApi.aiChat(state.project.uuid, {
        message: input.trim(),
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
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
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
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const QUICK_SUGGESTIONS = [
    'Add a testimonials section',
    'Improve my SEO',
    'How can I get more customers?',
    'Add social proof to my site',
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#064A6C]" />
          <h3 className="text-sm font-semibold text-gray-900">AI Coach</h3>
        </div>
        <button onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: null })} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center pt-4">
            <Sparkles className="w-8 h-8 text-[#064A6C]/30 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">I'm your AI website coach</p>
            <p className="text-xs text-gray-400 mb-4">Ask me to add sections, improve SEO, or give business advice</p>
            <div className="space-y-2">
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
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
            <div className={`max-w-[90%] rounded-[7px] px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-[#064A6C] text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Operations (accept/reject) */}
              {msg.operations && msg.operations.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {msg.operations.map((op: any, oi: number) => (
                    <div key={oi} className="bg-white border border-gray-200 rounded-[5px] p-2">
                      <p className="text-xs text-gray-600 mb-1">{op.description}</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAcceptOperation(op)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100"
                        >
                          <Check className="w-3 h-3" /> Accept
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">
                          <XIcon className="w-3 h-3" /> Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.suggestions.map((s: string, si: number) => (
                    <button
                      key={si}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-2 py-0.5 bg-white/80 text-[#064A6C] rounded text-[10px] border border-[#064A6C]/20 hover:bg-[#064A6C]/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-[7px] px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#064A6C]" />
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
            placeholder="Ask your AI coach..."
            className="flex-1 border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-[#064A6C] text-white rounded-[7px] hover:bg-[#053C58] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
