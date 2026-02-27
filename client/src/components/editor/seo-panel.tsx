import { useState } from 'react';
import { Search, Sparkles, Loader2, X } from 'lucide-react';
import { useEditor } from './editor-context';
import { websiteBuilderApi } from '@/lib/api';

export function SEOPanel() {
  const { state, dispatch, activePage } = useEditor();
  const [generating, setGenerating] = useState(false);

  if (!activePage) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
        <p className="text-sm text-gray-400 text-center mt-8">Select a page to edit SEO</p>
      </div>
    );
  }

  const seo = activePage.seo || {};
  const titleLen = (seo.title || '').length;
  const descLen = (seo.description || '').length;

  const updateSeo = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_PAGE_SEO', slug: activePage.slug, seo: { [field]: value } });
  };

  const handleAiGenerate = async () => {
    if (!state.project) return;
    setGenerating(true);
    try {
      const result = await websiteBuilderApi.aiGenerateSeo(state.project.uuid, {
        pageSlug: activePage.slug,
        pageTitle: activePage.title,
        blocks: activePage.blocks,
        businessName: state.project.name,
        businessType: state.project.businessType,
      });
      if (result.title) updateSeo('title', result.title);
      if (result.description) updateSeo('description', result.description);
    } catch (err) {
      console.error('AI SEO generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#064A6C]" />
          <h3 className="text-sm font-semibold text-gray-900">SEO Settings</h3>
        </div>
        <button onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: null })} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-gray-500">Page: <strong>{activePage.title}</strong></p>

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Page Title</label>
            <span className={`text-xs ${titleLen > 60 ? 'text-red-500' : 'text-gray-400'}`}>{titleLen}/60</span>
          </div>
          <input
            type="text"
            value={seo.title || ''}
            onChange={e => updateSeo('title', e.target.value)}
            placeholder="Enter page title for search engines..."
            className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
          />
          {titleLen > 60 && <p className="text-xs text-red-500 mt-1">Title is too long for optimal SEO</p>}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Meta Description</label>
            <span className={`text-xs ${descLen > 160 ? 'text-red-500' : 'text-gray-400'}`}>{descLen}/160</span>
          </div>
          <textarea
            value={seo.description || ''}
            onChange={e => updateSeo('description', e.target.value)}
            placeholder="Enter a description for search results..."
            rows={3}
            className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical"
          />
          {descLen > 160 && <p className="text-xs text-red-500 mt-1">Description is too long for optimal SEO</p>}
        </div>

        {/* OG Image */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Image URL</label>
          <input
            type="text"
            value={seo.ogImage || ''}
            onChange={e => updateSeo('ogImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
          />
          <p className="text-xs text-gray-400 mt-1">Image shown when shared on social media</p>
        </div>

        {/* AI Generate */}
        <button
          onClick={handleAiGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-medium transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Generating...' : 'AI Generate SEO'}
        </button>

        {/* Preview */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Search Preview</h4>
          <div className="bg-gray-50 rounded-[7px] p-3 space-y-1">
            <p className="text-blue-700 text-sm font-medium truncate">
              {seo.title || activePage.title || 'Page Title'}
            </p>
            <p className="text-green-700 text-xs truncate">
              {state.project?.slug ? `hostsblue.com/sites/${state.project.slug}` : 'hostsblue.com'}
            </p>
            <p className="text-gray-600 text-xs line-clamp-2">
              {seo.description || 'No description set. Add a meta description for better search results.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
