import { useState, useEffect } from 'react';
import { X, Check, Globe, AlertCircle, Loader2, ExternalLink, Copy, Sparkles } from 'lucide-react';
import { useEditor } from './editor-context';
import { websiteBuilderApi } from '@/lib/api';

type PublishStep = 'checking' | 'ready' | 'publishing' | 'success' | 'error';

interface PrePublishCheck {
  label: string;
  passed: boolean;
  warning?: string;
}

export function PublishModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch, save } = useEditor();
  const [step, setStep] = useState<PublishStep>('checking');
  const [checks, setChecks] = useState<PrePublishCheck[]>([]);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Run pre-publish checks
  useEffect(() => {
    const runChecks = async () => {
      const results: PrePublishCheck[] = [];

      // Check: has pages
      const hasPages = state.pages.length > 0;
      results.push({ label: 'Has at least one page', passed: hasPages });

      // Check: home page exists
      const hasHome = state.pages.some(p => p.isHomePage);
      results.push({ label: 'Home page configured', passed: hasHome });

      // Check: pages have content
      const pagesWithContent = state.pages.filter(p => p.blocks.length > 0);
      results.push({
        label: 'All pages have content',
        passed: pagesWithContent.length === state.pages.length,
        warning: pagesWithContent.length < state.pages.length ? `${state.pages.length - pagesWithContent.length} page(s) are empty` : undefined,
      });

      // Check: header block
      const hasHeader = state.pages.some(p => p.blocks.some(b => b.type === 'header'));
      results.push({
        label: 'Header/navigation exists',
        passed: hasHeader,
        warning: !hasHeader ? 'Add a header block for navigation' : undefined,
      });

      // Check: footer block
      const hasFooter = state.pages.some(p => p.blocks.some(b => b.type === 'footer'));
      results.push({
        label: 'Footer exists',
        passed: hasFooter,
        warning: !hasFooter ? 'A footer helps with professionalism' : undefined,
      });

      setChecks(results);
      setStep('ready');
    };

    runChecks();
  }, [state.pages]);

  const handlePublish = async () => {
    if (!state.project) return;
    setStep('publishing');

    try {
      // Save first
      await save();

      // Then publish
      const result = await websiteBuilderApi.publishProject(state.project.uuid);
      const url = result.publishedUrl || `${state.project.slug}.sites.hostsblue.com`;
      setPublishedUrl(url);

      dispatch({
        type: 'SET_PROJECT',
        project: { ...state.project, status: 'published', publishedUrl: url },
        pages: state.pages,
      });

      setStep('success');
    } catch (err: any) {
      setError(err?.message || 'Publishing failed. Please try again.');
      setStep('error');
    }
  };

  const handleCopyUrl = () => {
    const fullUrl = publishedUrl.startsWith('http') ? publishedUrl : `https://${publishedUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allPassed = checks.every(c => c.passed);
  const warnings = checks.filter(c => !c.passed && c.warning);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[7px] max-w-md w-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#064A6C]" />
            <h2 className="text-lg font-semibold text-gray-900">Publish Site</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Checking state */}
          {step === 'checking' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#064A6C] animate-spin" />
              <span className="ml-2 text-gray-500">Running pre-publish checks...</span>
            </div>
          )}

          {/* Ready state */}
          {step === 'ready' && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Your site will be live at: <strong className="text-gray-900">{state.project?.slug}.sites.hostsblue.com</strong>
              </p>

              <div className="space-y-2 mb-4">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {check.passed ? (
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className={`text-sm ${check.passed ? 'text-gray-700' : 'text-amber-700'}`}>
                        {check.label}
                      </span>
                      {check.warning && (
                        <p className="text-xs text-amber-600 mt-0.5">{check.warning}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {warnings.length > 0 && !allPassed && (
                <p className="text-xs text-amber-600 mb-4">
                  You can still publish with warnings, but fixing them will improve your site.
                </p>
              )}

              <button
                onClick={handlePublish}
                className="w-full py-3 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Publish Now
              </button>
            </>
          )}

          {/* Publishing state */}
          {step === 'publishing' && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Publishing your site...</p>
              <p className="text-sm text-gray-400 mt-1">This just takes a moment</p>
            </div>
          )}

          {/* Success state */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your site is live!</h3>
              <p className="text-sm text-gray-500 mb-4">Congratulations! Your website is now published.</p>

              <div className="bg-gray-50 border border-gray-200 rounded-[7px] p-3 flex items-center justify-between mb-4">
                <span className="text-sm text-gray-700 truncate">{publishedUrl}</span>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1 text-xs text-[#064A6C] font-medium hover:underline flex-shrink-0 ml-2"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/sites/${state.project?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Site
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-[7px] text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error state */}
          {step === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Publishing Failed</h3>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={handlePublish}
                  className="flex-1 py-2.5 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-[7px] text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
