import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { websiteBuilderApi } from '@/lib/api';
import {
  Check,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  User,
  Rocket,
  Heart,
  PenTool,
  MoreHorizontal,
  Monitor,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BusinessCategory =
  | 'Restaurant'
  | 'Retail'
  | 'Agency'
  | 'Freelancer'
  | 'Startup'
  | 'Nonprofit'
  | 'Blog'
  | 'Other';

type StyleChoice = 'Professional' | 'Creative' | 'Bold' | 'Minimal';

type PageOption =
  | 'Home'
  | 'About'
  | 'Services'
  | 'Contact'
  | 'Blog'
  | 'Shop'
  | 'Portfolio'
  | 'Pricing'
  | 'FAQ'
  | 'Testimonials';

interface BuilderState {
  step: number;
  businessCategory: BusinessCategory | null;
  customBusinessType: string;
  styleChoice: StyleChoice | null;
  selectedPages: PageOption[];
  businessName: string;
  collapsed: boolean;
}

const STORAGE_KEY = 'hostsblue_builder_state';

const defaultState: BuilderState = {
  step: 1,
  businessCategory: null,
  customBusinessType: '',
  styleChoice: null,
  selectedPages: ['Home'],
  businessName: '',
  collapsed: false,
};

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const categories: { label: BusinessCategory; icon: typeof UtensilsCrossed }[] = [
  { label: 'Restaurant', icon: UtensilsCrossed },
  { label: 'Retail', icon: ShoppingBag },
  { label: 'Agency', icon: Briefcase },
  { label: 'Freelancer', icon: User },
  { label: 'Startup', icon: Rocket },
  { label: 'Nonprofit', icon: Heart },
  { label: 'Blog', icon: PenTool },
  { label: 'Other', icon: MoreHorizontal },
];

const styles: {
  label: StyleChoice;
  colors: string[];
  desc: string;
}[] = [
  { label: 'Professional', colors: ['#1E3A5F', '#3B82F6', '#94A3B8', '#E2E8F0'], desc: 'Clean blues and grays' },
  { label: 'Creative', colors: ['#7C3AED', '#EC4899', '#F0ABFC', '#FDF2F8'], desc: 'Vibrant purples and pinks' },
  { label: 'Bold', colors: ['#DC2626', '#F97316', '#FCD34D', '#FFF7ED'], desc: 'Strong reds and oranges' },
  { label: 'Minimal', colors: ['#000000', '#374151', '#9CA3AF', '#FFFFFF'], desc: 'Sleek black and white' },
];

const allPages: PageOption[] = [
  'Home',
  'About',
  'Services',
  'Contact',
  'Blog',
  'Shop',
  'Portfolio',
  'Pricing',
  'FAQ',
  'Testimonials',
];

const styleColorMap: Record<StyleChoice, { primary: string; secondary: string; accent: string; bg: string }> = {
  Professional: { primary: '#1E3A5F', secondary: '#3B82F6', accent: '#94A3B8', bg: '#F1F5F9' },
  Creative: { primary: '#7C3AED', secondary: '#EC4899', accent: '#F0ABFC', bg: '#FDF2F8' },
  Bold: { primary: '#DC2626', secondary: '#F97316', accent: '#FCD34D', bg: '#FFF7ED' },
  Minimal: { primary: '#000000', secondary: '#374151', accent: '#9CA3AF', bg: '#FAFAFA' },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadState(): BuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BuilderState;
      return { ...defaultState, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...defaultState };
}

function saveState(state: BuilderState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function hasBuilderProgress(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as BuilderState;
    return (
      parsed.businessCategory !== null ||
      parsed.customBusinessType.length > 0 ||
      parsed.styleChoice !== null ||
      parsed.selectedPages.length > 1 ||
      parsed.businessName.length > 0
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AIBuilder() {
  const [state, setState] = useState<BuilderState>(loadState);
  const [nameTimer, setNameTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Auto-save on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((patch: Partial<BuilderState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...defaultState });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const collapse = useCallback(() => {
    update({ collapsed: true });
  }, [update]);

  const expand = useCallback(() => {
    update({ collapsed: false });
  }, [update]);

  const handleNameChange = useCallback(
    (value: string) => {
      // Update display immediately, debounce the save
      setState((prev) => ({ ...prev, businessName: value }));
      if (nameTimer) clearTimeout(nameTimer);
      setNameTimer(setTimeout(() => {}, 400));
    },
    [nameTimer],
  );

  const togglePage = useCallback((page: PageOption) => {
    if (page === 'Home') return;
    setState((prev) => {
      const pages = prev.selectedPages.includes(page)
        ? prev.selectedPages.filter((p) => p !== page)
        : [...prev.selectedPages, page];
      return { ...prev, selectedPages: pages };
    });
  }, []);

  const businessLabel = state.businessCategory === 'Other' && state.customBusinessType
    ? state.customBusinessType
    : state.businessCategory ?? 'Not set';

  /* ----- collapsed bar ----- */
  if (state.collapsed) {
    return (
      <button
        onClick={expand}
        className="w-full flex items-center justify-between bg-white border border-[#E5E7EB] rounded-[7px] px-5 h-12 hover:shadow-sm transition-shadow cursor-pointer"
      >
        <span className="text-sm text-gray-700">
          <span className="font-semibold text-[#064A6C]">Your site:</span>{' '}
          {businessLabel} / {state.styleChoice ?? '—'} / {state.selectedPages.length} pages
          <span className="text-gray-400 ml-2">— Continue Building</span>
        </span>
        <ChevronUp className="w-4 h-4 text-gray-400" />
      </button>
    );
  }

  /* ----- can-proceed guard ----- */
  const canProceed = (): boolean => {
    switch (state.step) {
      case 1:
        return state.businessCategory !== null;
      case 2:
        return state.styleChoice !== null;
      case 3:
        return state.selectedPages.length >= 1;
      case 4:
        return state.businessName.trim().length > 0;
      default:
        return true;
    }
  };

  /* ----- step labels ----- */
  const stepLabels = ['Business', 'Style', 'Pages', 'Name', 'Preview'];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[7px] overflow-hidden transition-all duration-300">
      {/* ---- header ---- */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#064A6C]" />
            <span className="text-base font-semibold text-[#09080E]">AI Website Builder</span>
          </div>
          <button onClick={collapse} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* ---- step indicators ---- */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = state.step > stepNum;
            const isActive = state.step === stepNum;
            return (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="flex items-center">
                  {i > 0 && (
                    <div
                      className={`w-8 h-px mr-1 ${
                        state.step > i ? 'bg-[#10B981]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-[#10B981] text-white'
                        : isActive
                        ? 'bg-[#064A6C] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`w-8 h-px ml-1 ${
                        state.step > stepNum ? 'bg-[#10B981]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-[11px] ${
                    isActive ? 'text-[#064A6C] font-medium' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- body ---- */}
      <div className="px-6 py-6 min-h-[320px]">
        {/* ---------- STEP 1 ---------- */}
        {state.step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-[#09080E] mb-1">
              What kind of business are you building?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Pick a category or type your own below.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {categories.map(({ label, icon: Icon }) => {
                const selected = state.businessCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => update({ businessCategory: label, customBusinessType: '' })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-[7px] border text-sm font-medium transition-all cursor-pointer ${
                      selected
                        ? 'border-[#064A6C] bg-[#064A6C]/5 text-[#064A6C]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                );
              })}
            </div>
            {state.businessCategory === 'Other' && (
              <input
                type="text"
                value={state.customBusinessType}
                onChange={(e) => update({ customBusinessType: e.target.value })}
                placeholder="Describe your business..."
                className="w-full border border-gray-300 rounded-[7px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#064A6C]/30 focus:border-[#064A6C] transition-colors"
              />
            )}
          </div>
        )}

        {/* ---------- STEP 2 ---------- */}
        {state.step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-[#09080E] mb-1">Pick your style</h3>
            <p className="text-sm text-gray-500 mb-5">
              Choose a mood that matches your brand.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {styles.map(({ label, colors, desc }) => {
                const selected = state.styleChoice === label;
                return (
                  <button
                    key={label}
                    onClick={() => update({ styleChoice: label })}
                    className={`flex flex-col items-start p-4 rounded-[7px] border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[#064A6C] bg-[#064A6C]/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex gap-1 mb-3">
                      {colors.map((c, ci) => (
                        <div
                          key={ci}
                          className="w-7 h-7 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#09080E]">{label}</span>
                    <span className="text-xs text-gray-500">{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- STEP 3 ---------- */}
        {state.step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-[#09080E] mb-1">Choose your pages</h3>
            <p className="text-sm text-gray-500 mb-5">
              Select which pages your website needs. Home is always included.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {allPages.map((page) => {
                const checked = state.selectedPages.includes(page);
                const isHome = page === 'Home';
                return (
                  <label
                    key={page}
                    className={`flex items-center gap-2 p-3 rounded-[7px] border text-sm transition-all cursor-pointer select-none ${
                      isHome
                        ? 'border-[#10B981] bg-[#10B981]/5 text-[#09080E]'
                        : checked
                        ? 'border-[#064A6C] bg-[#064A6C]/5 text-[#09080E]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isHome}
                      onChange={() => togglePage(page)}
                      className="accent-[#064A6C] w-4 h-4"
                    />
                    <span className="font-medium">{page}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- STEP 4 ---------- */}
        {state.step === 4 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-[#09080E] mb-1">
              What's your business name?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              This will appear across your website.
            </p>
            <input
              type="text"
              value={state.businessName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Blue Mountain Coffee"
              className="w-full border border-gray-300 rounded-[7px] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#064A6C]/30 focus:border-[#064A6C] transition-colors"
              autoFocus
            />
            {state.businessName && (
              <p className="text-xs text-gray-400 mt-2">
                Your site will be branded as <strong className="text-gray-600">{state.businessName}</strong>
              </p>
            )}
          </div>
        )}

        {/* ---------- STEP 5 — PREVIEW ---------- */}
        {state.step === 5 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-[#09080E] mb-1">
              Your site is taking shape
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Here's a preview based on your choices. Open the full editor to customize every detail.
            </p>

            <SitePreview
              businessName={state.businessName}
              businessType={businessLabel}
              style={state.styleChoice ?? 'Professional'}
              pages={state.selectedPages}
            />
          </div>
        )}
      </div>

      {/* ---- footer controls ---- */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-[7px] hover:bg-gray-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </button>
          <button
            onClick={collapse}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-[7px] hover:bg-gray-50"
          >
            Save &amp; Continue Later
          </button>
        </div>

        <div className="flex items-center gap-2">
          {state.step > 1 && (
            <button
              onClick={goBack}
              className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-[7px] hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {state.step < 5 ? (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#064A6C] hover:bg-[#053A55] text-white rounded-[7px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={async () => {
                if (isGenerating) return;
                setIsGenerating(true);
                try {
                  // 1. Create project
                  const project = await websiteBuilderApi.createProject({
                    name: state.businessName,
                    businessType: businessLabel,
                    businessDescription: `A ${businessLabel.toLowerCase()} business called ${state.businessName}`,
                  });
                  // 2. Generate with AI
                  await websiteBuilderApi.aiGenerate(project.uuid, {
                    businessName: state.businessName,
                    businessType: businessLabel,
                    businessDescription: `A ${businessLabel.toLowerCase()} business called ${state.businessName}`,
                    style: state.styleChoice || 'Professional',
                    selectedPages: state.selectedPages,
                  });
                  // 3. Clean up builder state and redirect
                  localStorage.removeItem(STORAGE_KEY);
                  navigate(`/dashboard/website-builder/${project.uuid}/edit`);
                } catch (err) {
                  console.error('Generation failed:', err);
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium bg-[#064A6C] hover:bg-[#053A55] text-white rounded-[7px] transition-colors disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate & Open Editor
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Site Preview sub-component                                         */
/* ------------------------------------------------------------------ */

function SitePreview({
  businessName,
  businessType,
  style,
  pages,
}: {
  businessName: string;
  businessType: string;
  style: StyleChoice;
  pages: PageOption[];
}) {
  const colors = styleColorMap[style];
  const slug = businessName.toLowerCase().replace(/\s+/g, '') || 'mysite';

  return (
    <div className="rounded-[7px] border border-gray-200 overflow-hidden shadow-sm">
      {/* browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-400 font-mono truncate border border-gray-200">
          https://{slug}.hostsblue.com
        </div>
      </div>

      {/* page content */}
      <div style={{ backgroundColor: colors.bg }} className="p-0 text-left overflow-hidden">
        {/* nav */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-white text-sm font-bold truncate">{businessName}</span>
          <div className="flex gap-3">
            {pages.slice(0, 5).map((p) => (
              <span key={p} className="text-white/70 text-[11px]">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* hero */}
        <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.primary + '0D' }}>
          <p
            className="text-lg font-bold mb-1"
            style={{ color: colors.primary }}
          >
            Welcome to {businessName}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Your trusted {businessType.toLowerCase()} — built for the modern web.
          </p>
          <div
            className="inline-block px-4 py-1.5 text-xs text-white rounded-[5px]"
            style={{ backgroundColor: colors.secondary }}
          >
            Get Started
          </div>
        </div>

        {/* conditional sections based on pages */}
        {pages.includes('About') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-1" style={{ color: colors.primary }}>
              About Us
            </p>
            <div className="flex gap-2">
              <div className="h-2 rounded-full flex-1" style={{ backgroundColor: colors.accent + '40' }} />
              <div className="h-2 rounded-full flex-[2]" style={{ backgroundColor: colors.accent + '30' }} />
            </div>
          </div>
        )}

        {pages.includes('Services') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-2" style={{ color: colors.primary }}>
              Our Services
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-10 rounded-[5px]"
                  style={{ backgroundColor: colors.secondary + '15' }}
                />
              ))}
            </div>
          </div>
        )}

        {pages.includes('Portfolio') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-2" style={{ color: colors.primary }}>
              Portfolio
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-8 rounded-[4px]"
                  style={{ backgroundColor: colors.accent + '25' }}
                />
              ))}
            </div>
          </div>
        )}

        {pages.includes('Testimonials') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-2" style={{ color: colors.primary }}>
              Testimonials
            </p>
            <div className="flex gap-2">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="flex-1 h-12 rounded-[5px] border"
                  style={{ borderColor: colors.accent + '30', backgroundColor: 'white' }}
                />
              ))}
            </div>
          </div>
        )}

        {pages.includes('Pricing') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-2" style={{ color: colors.primary }}>
              Pricing
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-14 rounded-[5px] border"
                  style={{
                    borderColor: n === 2 ? colors.secondary : colors.accent + '30',
                    backgroundColor: n === 2 ? colors.secondary + '08' : 'white',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {pages.includes('Contact') && (
          <div className="px-5 py-4 border-t border-gray-200/60">
            <p className="text-xs font-semibold mb-2" style={{ color: colors.primary }}>
              Contact
            </p>
            <div className="flex gap-2">
              <div className="h-2 rounded-full w-24" style={{ backgroundColor: colors.accent + '35' }} />
              <div className="h-2 rounded-full w-32" style={{ backgroundColor: colors.accent + '25' }} />
            </div>
          </div>
        )}

        {/* footer */}
        <div
          className="px-5 py-3 mt-2 flex items-center justify-between"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-white/60 text-[10px]">
            &copy; 2026 {businessName}. All rights reserved.
          </span>
          <Monitor className="w-3 h-3 text-white/40" />
        </div>
      </div>
    </div>
  );
}
