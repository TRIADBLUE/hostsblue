import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Loader2, Sparkles, ArrowRight, Check } from 'lucide-react';
import { websiteBuilderApi } from '@/lib/api';

type Step = 'greeting' | 'business_name' | 'business_type' | 'style' | 'pages' | 'generate';

interface WizardContext {
  businessName?: string;
  businessType?: string;
  style?: string;
  selectedPages?: string[];
  businessDescription?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const STYLE_OPTIONS = [
  { id: 'Professional', label: 'Professional', desc: 'Clean, corporate, trustworthy', color: '#1E3A5F' },
  { id: 'Creative', label: 'Creative', desc: 'Vibrant, artistic, unique', color: '#7C3AED' },
  { id: 'Bold', label: 'Bold', desc: 'Strong colors, high-energy', color: '#DC2626' },
  { id: 'Minimal', label: 'Minimal', desc: 'Simple, elegant, spacious', color: '#0F172A' },
];

const DEFAULT_PAGES = ['Home', 'About', 'Services', 'Contact'];
const ALL_PAGES = ['Home', 'About', 'Services', 'Contact', 'FAQ', 'Testimonials', 'Pricing', 'Gallery', 'Team'];

export function CoachGreenWizard({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('greeting');
  const [context, setContext] = useState<WizardContext>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>(DEFAULT_PAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-greet on mount
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: "Hey there! I'm Coach Green, your website-building sidekick. I'm going to help you create a beautiful website in just a few minutes.\n\nLet's start with the basics — what's your business name?",
      suggestions: [],
    }]);
    setStep('business_name');
  }, []);

  const addAssistantMessage = useCallback((content: string, suggestions?: string[]) => {
    setMessages(prev => [...prev, { role: 'assistant', content, suggestions }]);
  }, []);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    try {
      const result = await websiteBuilderApi.onboardingChat({
        message: msg,
        step,
        context,
      });

      // Merge extracted data into context
      const newContext = { ...context };
      if (result.extractedData) {
        if (result.extractedData.businessName) newContext.businessName = result.extractedData.businessName;
        if (result.extractedData.businessType) newContext.businessType = result.extractedData.businessType;
        if (result.extractedData.style) newContext.style = result.extractedData.style;
        if (result.extractedData.selectedPages) {
          newContext.selectedPages = result.extractedData.selectedPages;
          setSelectedPages(result.extractedData.selectedPages);
        }
      }
      setContext(newContext);

      addAssistantMessage(result.message, result.suggestions);

      // Advance step based on what data we have
      if (result.readyToGenerate) {
        setStep('generate');
      } else if (!newContext.businessName) {
        setStep('business_name');
      } else if (!newContext.businessType) {
        setStep('business_type');
      } else if (!newContext.style) {
        setStep('style');
      } else if (!newContext.selectedPages) {
        setStep('pages');
      } else {
        setStep('generate');
      }
    } catch {
      // Fallback to local logic
      handleLocalStep(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalStep = (msg: string) => {
    const newContext = { ...context };

    switch (step) {
      case 'business_name':
        newContext.businessName = msg;
        setContext(newContext);
        addAssistantMessage(
          `Love it — "${msg}" is a great name! What type of business is ${msg}? For example: Restaurant, Law Firm, Fitness Studio, Photography...`,
          ['Restaurant', 'Law Firm', 'Fitness Studio', 'Photography'],
        );
        setStep('business_type');
        break;

      case 'business_type':
        newContext.businessType = msg;
        setContext(newContext);
        addAssistantMessage(
          `A ${msg} — exciting! Now let's talk style. How do you want your site to feel?`,
          ['Professional', 'Creative', 'Bold', 'Minimal'],
        );
        setStep('style');
        break;

      case 'style': {
        const matched = STYLE_OPTIONS.find(s => msg.toLowerCase().includes(s.id.toLowerCase()))?.id || 'Professional';
        newContext.style = matched;
        setContext(newContext);
        addAssistantMessage(
          `${matched} style — that's going to look amazing! Last step: pick the pages you want. I've pre-selected the essentials, but you can customize below.`,
        );
        setStep('pages');
        break;
      }

      case 'pages': {
        const pages = msg.includes(',')
          ? msg.split(',').map(p => p.trim()).filter(Boolean)
          : selectedPages;
        newContext.selectedPages = pages;
        setSelectedPages(pages);
        setContext(newContext);
        setStep('generate');
        addAssistantMessage(
          `Perfect! Here's what I'm building:\n\n- **Business:** ${newContext.businessName}\n- **Type:** ${newContext.businessType}\n- **Style:** ${newContext.style}\n- **Pages:** ${pages.join(', ')}\n\nHit "Build My Website" when you're ready!`,
        );
        break;
      }

      default:
        addAssistantMessage("Let's keep going! What's your business name?");
        setStep('business_name');
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    addAssistantMessage("Building your website now... this usually takes about 15-30 seconds. Sit tight!");

    try {
      // Create project first
      const project = await websiteBuilderApi.createProject({
        name: context.businessName || 'My Website',
        businessType: context.businessType || 'Business',
        businessDescription: context.businessDescription || '',
      });

      // Then generate with AI
      await websiteBuilderApi.aiGenerate(project.uuid, {
        businessName: context.businessName,
        businessType: context.businessType,
        businessDescription: context.businessDescription,
        style: context.style || 'Professional',
        selectedPages: context.selectedPages || DEFAULT_PAGES,
      });

      addAssistantMessage("Your website is ready! Taking you to the editor now...");

      setTimeout(() => {
        navigate(`/dashboard/website-builder/${project.uuid}/edit`);
      }, 1200);
    } catch (err: any) {
      addAssistantMessage(
        err?.message?.includes('402')
          ? "You're low on AI credits. Add more credits to generate your website."
          : "Something went wrong generating your website. Let's try again — click 'Build My Website' once more.",
      );
      setGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const togglePage = (page: string) => {
    setSelectedPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page],
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#064A6C] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Coach Green</h2>
            <p className="text-xs text-gray-500">Your website-building sidekick</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          {(['Name', 'Type', 'Style', 'Pages', 'Build'] as const).map((label, i) => {
            const stepOrder = ['business_name', 'business_type', 'style', 'pages', 'generate'];
            const currentIdx = stepOrder.indexOf(step);
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done ? 'bg-[#064A6C] text-white' : active ? 'bg-[#064A6C]/20 text-[#064A6C] ring-2 ring-[#064A6C]' : 'bg-gray-200 text-gray-400'
                }`}>
                  {done ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${active ? 'text-[#064A6C] font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                {i < 4 && <div className={`flex-1 h-0.5 ${done ? 'bg-[#064A6C]' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[7px] px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#064A6C] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestions.map((s, si) => (
                      <button
                        key={si}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-3 py-1.5 bg-white text-[#064A6C] rounded-[7px] text-xs font-medium border border-[#064A6C]/20 hover:bg-[#064A6C]/5 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Style picker (inline) */}
          {step === 'style' && !loading && (
            <div className="grid grid-cols-2 gap-3">
              {STYLE_OPTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.id)}
                  className="border border-gray-200 rounded-[7px] p-4 text-left hover:border-[#064A6C] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-semibold text-sm text-gray-900">{s.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Page picker (inline) */}
          {step === 'pages' && !loading && (
            <div className="bg-white border border-gray-200 rounded-[7px] p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Select your pages:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALL_PAGES.map(page => (
                  <button
                    key={page}
                    onClick={() => togglePage(page)}
                    className={`px-3 py-1.5 rounded-[7px] text-sm font-medium transition-colors ${
                      selectedPages.includes(page)
                        ? 'bg-[#064A6C] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPages.includes(page) && <Check className="w-3 h-3 inline mr-1" />}
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setContext(prev => ({ ...prev, selectedPages }));
                  handleSend(selectedPages.join(', '));
                }}
                className="w-full py-2 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                Continue with {selectedPages.length} pages
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Generate button */}
          {step === 'generate' && !generating && (
            <div className="text-center pt-4">
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-base font-bold transition-colors inline-flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Build My Website
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Generating spinner */}
          {generating && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-[#064A6C] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Coach Green is building your website...</p>
              <p className="text-sm text-gray-400 mt-1">This usually takes 15-30 seconds</p>
            </div>
          )}

          {loading && !generating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-[7px] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#064A6C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      {step !== 'generate' && !generating && (
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={
                step === 'business_name' ? "Enter your business name..."
                  : step === 'business_type' ? "What type of business?"
                  : step === 'style' ? "Pick a style above or type one..."
                  : step === 'pages' ? "Select pages above or type them..."
                  : "Type a message..."
              }
              className="flex-1 border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#064A6C]/30 focus:border-[#064A6C]"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-[#064A6C] text-white rounded-[7px] hover:bg-[#053C58] transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
