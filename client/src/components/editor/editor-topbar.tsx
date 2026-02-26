import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Tablet, Smartphone, Palette, MessageSquare, Eye, Upload, Save, Loader2, Plus, ChevronDown, Check } from 'lucide-react';
import { useEditor } from './editor-context';
import { websiteBuilderApi } from '@/lib/api';

export function EditorTopBar() {
  const { state, dispatch, save } = useEditor();
  const navigate = useNavigate();
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [publishing, setPublishing] = useState(false);

  const activePage = state.pages.find(p => p.slug === state.activePageSlug);

  const handlePublish = async () => {
    if (!state.project) return;
    setPublishing(true);
    try {
      await save();
      await websiteBuilderApi.publishProject(state.project.uuid);
      dispatch({ type: 'SET_PROJECT', project: { ...state.project, status: 'published' }, pages: state.pages });
    } catch (err) {
      console.error('Publish failed:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleAddPage = async () => {
    if (!newPageTitle.trim() || !state.project) return;
    const slug = newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      const page = await websiteBuilderApi.createPage(state.project.uuid, {
        title: newPageTitle,
        slug,
        blocks: [],
      });
      dispatch({ type: 'ADD_PAGE', page: { ...page, blocks: page.blocks || [], seo: page.seo || {} } });
      dispatch({ type: 'SET_ACTIVE_PAGE', slug: page.slug });
    } catch (err) {
      console.error('Failed to add page:', err);
    }
    setNewPageTitle('');
    setShowAddPage(false);
  };

  const handlePreview = () => {
    if (!state.project) return;
    const pageSlug = state.activePageSlug || 'home';
    window.open(`/api/v1/website-builder/projects/${state.project.uuid}/preview?page=${pageSlug}`, '_blank');
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: Back + Project Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/website-builder')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <span className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">
          {state.project?.name || 'Loading...'}
        </span>
      </div>

      {/* Center: Page Selector + Device Preview */}
      <div className="flex items-center gap-4">
        {/* Page Selector */}
        <div className="relative">
          <button
            onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-[7px] text-sm hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">{activePage?.title || 'Select Page'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {pageDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-[7px] shadow-lg z-50 min-w-[180px]">
              {state.pages.map(page => (
                <button
                  key={page.slug}
                  onClick={() => { dispatch({ type: 'SET_ACTIVE_PAGE', slug: page.slug }); setPageDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${page.slug === state.activePageSlug ? 'text-[#064A6C] font-medium' : 'text-gray-700'}`}
                >
                  {page.slug === state.activePageSlug && <Check className="w-3.5 h-3.5" />}
                  {page.title}
                  {page.isHomePage && <span className="text-xs text-gray-400 ml-auto">Home</span>}
                </button>
              ))}
              <div className="border-t border-gray-100">
                {showAddPage ? (
                  <div className="p-2 flex gap-2">
                    <input
                      type="text"
                      value={newPageTitle}
                      onChange={e => setNewPageTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddPage()}
                      placeholder="Page title..."
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
                      autoFocus
                    />
                    <button onClick={handleAddPage} className="text-[#064A6C] text-sm font-medium">Add</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddPage(true)}
                    className="w-full text-left px-3 py-2 text-sm text-[#064A6C] hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Page
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Device Preview */}
        <div className="flex items-center bg-gray-100 rounded-[7px] p-0.5">
          {[
            { device: 'desktop' as const, icon: Monitor },
            { device: 'tablet' as const, icon: Tablet },
            { device: 'mobile' as const, icon: Smartphone },
          ].map(({ device, icon: Icon }) => (
            <button
              key={device}
              onClick={() => dispatch({ type: 'SET_DEVICE_PREVIEW', device })}
              className={`p-1.5 rounded-[5px] transition-colors ${state.devicePreview === device ? 'bg-white shadow-sm text-[#064A6C]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: state.rightPanel === 'theme' ? null : 'theme' })}
          className={`p-2 rounded-[7px] transition-colors ${state.rightPanel === 'theme' ? 'bg-[#064A6C]/10 text-[#064A6C]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          title="Theme"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: state.rightPanel === 'ai-coach' ? null : 'ai-coach' })}
          className={`p-2 rounded-[7px] transition-colors ${state.rightPanel === 'ai-coach' ? 'bg-[#064A6C]/10 text-[#064A6C]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          title="AI Coach"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {state.isDirty && (
          <button
            onClick={save}
            disabled={state.isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {state.isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {state.isSaving ? 'Saving...' : 'Save'}
          </button>
        )}

        <button
          onClick={handlePreview}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-[7px] text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#064A6C] hover:bg-[#053C58] text-white rounded-[7px] text-sm font-medium transition-colors disabled:opacity-50"
        >
          {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Publish
        </button>
      </div>
    </div>
  );
}
