import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { coachGreenApi } from '@/lib/api';
import {
  Loader2,
  Send,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function TasksPage() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [sessionId, setSessionId] = useState<number | undefined>();

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['coach-green', 'suggestions'],
    queryFn: () => coachGreenApi.suggestions(),
  });

  const chatMutation = useMutation({
    mutationFn: (msg: string) => coachGreenApi.chat({ message: msg, context: 'dashboard', sessionId }),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    chatMutation.mutate(message);
    setMessage('');
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-teal-50 text-[#064A6C] border-teal-200',
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-teal-50 rounded-[7px] flex items-center justify-center">
          <ListTodo className="w-5 h-5 text-[#064A6C]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#09080E]">Tasks</h1>
          <p className="text-[#4B5563] text-sm">Coach Green helps you figure out what to do next.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suggestions Panel */}
        <div>
          <h2 className="text-lg font-semibold text-[#09080E] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#064A6C]" />
            Suggested Tasks
          </h2>

          {suggestionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((s: any, i: number) => (
                <Link
                  key={i}
                  to={s.action}
                  className={`block p-4 border rounded-[7px] hover:shadow-sm transition-shadow ${priorityColors[s.priority] || priorityColors.low}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-sm">{s.title}</h3>
                      <p className="text-xs mt-1 opacity-80">{s.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#4B5563]">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <p className="font-medium">You're all caught up!</p>
              <p className="text-sm mt-1">No suggestions right now.</p>
            </div>
          )}

          {/* consoleblue widget placeholder */}
          <div className="mt-8 p-6 border border-dashed border-[#E5E7EB] rounded-[7px] bg-gray-50 text-center">
            <p className="text-[#4B5563] text-sm font-medium mb-1">consoleblue Task Widget</p>
            <p className="text-[#4B5563] text-xs">
              The consoleblue task management widget will appear here once integrated.
              Generate a widget token in Settings to get started.
            </p>
          </div>
        </div>

        {/* Coach Green Chat */}
        <div>
          <h2 className="text-lg font-semibold text-[#09080E] mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#064A6C]" />
            Ask Coach Green
          </h2>

          <div className="border border-[#E5E7EB] rounded-[7px] bg-white overflow-hidden">
            {/* Chat messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-16 text-[#4B5563]">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#064A6C]" />
                  <p className="font-medium">Hi, I'm Coach Green!</p>
                  <p className="text-sm mt-1">Ask me what you should do next, or how to get the most from hostsblue.</p>
                  <button
                    onClick={() => {
                      const q = 'What should I do next?';
                      setChatMessages([{ role: 'user', content: q }]);
                      chatMutation.mutate(q);
                    }}
                    className="mt-4 text-sm text-[#064A6C] hover:text-[#053C58] font-medium border border-[#064A6C] px-4 py-2 rounded-[7px] hover:bg-teal-50 transition-colors"
                  >
                    What should I do next?
                  </button>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-[7px] text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#064A6C] text-white'
                        : 'bg-gray-100 text-[#09080E]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2.5 rounded-[7px]">
                    <Loader2 className="w-4 h-4 text-[#064A6C] animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[#E5E7EB] p-3 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Coach Green..."
                className="flex-1 px-3 py-2 text-sm border border-[#E5E7EB] rounded-[7px] focus:outline-none focus:ring-2 focus:ring-[#064A6C]/20 focus:border-[#064A6C] text-[#09080E] placeholder-[#4B5563]/60"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || chatMutation.isPending}
                className="px-3 py-2 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
