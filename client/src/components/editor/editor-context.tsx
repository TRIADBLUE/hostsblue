import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { WebsiteBlock, WebsiteTheme, BlockType } from '../../../../shared/block-types';
import { defaultTheme, generateBlockId, createDefaultBlock } from '../../../../shared/block-types';
import { websiteBuilderApi } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface PageData {
  id: number;
  slug: string;
  title: string;
  sortOrder: number;
  isHomePage: boolean;
  showInNav: boolean;
  seo: Record<string, any>;
  blocks: WebsiteBlock[];
}

export interface ProjectData {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  businessType: string;
  businessDescription: string;
  theme: WebsiteTheme;
  status: string;
  publishedUrl: string | null;
}

interface EditorState {
  project: ProjectData | null;
  pages: PageData[];
  activePageSlug: string;
  activeBlockId: string | null;
  theme: WebsiteTheme;
  isDirty: boolean;
  isSaving: boolean;
  rightPanel: 'properties' | 'theme' | 'ai-coach' | null;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  history: WebsiteBlock[][];
  historyIndex: number;
}

type EditorAction =
  | { type: 'SET_PROJECT'; project: ProjectData; pages: PageData[] }
  | { type: 'SET_ACTIVE_PAGE'; slug: string }
  | { type: 'SET_ACTIVE_BLOCK'; id: string | null }
  | { type: 'UPDATE_BLOCK'; blockId: string; data: Partial<WebsiteBlock['data']> }
  | { type: 'UPDATE_BLOCK_STYLE'; blockId: string; style: Partial<WebsiteBlock['style']> }
  | { type: 'ADD_BLOCK'; blockType: BlockType; afterBlockId?: string }
  | { type: 'ADD_BLOCK_DATA'; block: WebsiteBlock; afterBlockId?: string }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'DUPLICATE_BLOCK'; blockId: string }
  | { type: 'UPDATE_THEME'; theme: Partial<WebsiteTheme> }
  | { type: 'UPDATE_PAGE_SEO'; slug: string; seo: Record<string, any> }
  | { type: 'UPDATE_PAGE_TITLE'; slug: string; title: string }
  | { type: 'ADD_PAGE'; page: PageData }
  | { type: 'REMOVE_PAGE'; slug: string }
  | { type: 'SET_PAGES'; pages: PageData[] }
  | { type: 'SET_RIGHT_PANEL'; panel: EditorState['rightPanel'] }
  | { type: 'SET_DEVICE_PREVIEW'; device: EditorState['devicePreview'] }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'MARK_CLEAN' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ============================================================================
// REDUCER
// ============================================================================

function getActivePageBlocks(state: EditorState): WebsiteBlock[] {
  const page = state.pages.find(p => p.slug === state.activePageSlug);
  return page?.blocks || [];
}

function updateActivePageBlocks(state: EditorState, blocks: WebsiteBlock[]): PageData[] {
  return state.pages.map(p =>
    p.slug === state.activePageSlug ? { ...p, blocks } : p
  );
}

function pushHistory(state: EditorState, blocks: WebsiteBlock[]): Pick<EditorState, 'history' | 'historyIndex'> {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(blocks);
  if (newHistory.length > 50) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_PROJECT': {
      const activePage = action.pages.find(p => p.isHomePage) || action.pages[0];
      return {
        ...state,
        project: action.project,
        pages: action.pages,
        activePageSlug: activePage?.slug || 'home',
        theme: action.project.theme || defaultTheme,
        isDirty: false,
        history: [activePage?.blocks || []],
        historyIndex: 0,
      };
    }

    case 'SET_ACTIVE_PAGE': {
      const page = state.pages.find(p => p.slug === action.slug);
      return { ...state, activePageSlug: action.slug, activeBlockId: null, history: [page?.blocks || []], historyIndex: 0 };
    }

    case 'SET_ACTIVE_BLOCK':
      return { ...state, activeBlockId: action.id, rightPanel: action.id ? 'properties' : state.rightPanel };

    case 'UPDATE_BLOCK': {
      const blocks = getActivePageBlocks(state).map(b =>
        b.id === action.blockId ? { ...b, data: { ...b.data, ...action.data } } : b
      );
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, ...pushHistory(state, blocks) };
    }

    case 'UPDATE_BLOCK_STYLE': {
      const blocks = getActivePageBlocks(state).map(b =>
        b.id === action.blockId ? { ...b, style: { ...(b.style || {}), ...action.style } } : b
      );
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, ...pushHistory(state, blocks) };
    }

    case 'ADD_BLOCK': {
      const newBlock = createDefaultBlock(action.blockType);
      const blocks = [...getActivePageBlocks(state)];
      if (action.afterBlockId) {
        const idx = blocks.findIndex(b => b.id === action.afterBlockId);
        blocks.splice(idx + 1, 0, newBlock);
      } else {
        // Add before footer if exists, otherwise at end
        const footerIdx = blocks.findIndex(b => b.type === 'footer');
        if (footerIdx >= 0) blocks.splice(footerIdx, 0, newBlock);
        else blocks.push(newBlock);
      }
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, activeBlockId: newBlock.id, rightPanel: 'properties', ...pushHistory(state, blocks) };
    }

    case 'ADD_BLOCK_DATA': {
      const blocks = [...getActivePageBlocks(state)];
      if (action.afterBlockId) {
        const idx = blocks.findIndex(b => b.id === action.afterBlockId);
        blocks.splice(idx + 1, 0, action.block);
      } else {
        const footerIdx = blocks.findIndex(b => b.type === 'footer');
        if (footerIdx >= 0) blocks.splice(footerIdx, 0, action.block);
        else blocks.push(action.block);
      }
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, activeBlockId: action.block.id, ...pushHistory(state, blocks) };
    }

    case 'REMOVE_BLOCK': {
      const blocks = getActivePageBlocks(state).filter(b => b.id !== action.blockId);
      const nextActive = state.activeBlockId === action.blockId ? null : state.activeBlockId;
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, activeBlockId: nextActive, ...pushHistory(state, blocks) };
    }

    case 'MOVE_BLOCK': {
      const blocks = [...getActivePageBlocks(state)];
      const [moved] = blocks.splice(action.fromIndex, 1);
      blocks.splice(action.toIndex, 0, moved);
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, ...pushHistory(state, blocks) };
    }

    case 'DUPLICATE_BLOCK': {
      const blocks = [...getActivePageBlocks(state)];
      const idx = blocks.findIndex(b => b.id === action.blockId);
      if (idx >= 0) {
        const dup = { ...JSON.parse(JSON.stringify(blocks[idx])), id: generateBlockId() };
        blocks.splice(idx + 1, 0, dup);
      }
      return { ...state, pages: updateActivePageBlocks(state, blocks), isDirty: true, ...pushHistory(state, blocks) };
    }

    case 'UPDATE_THEME':
      return { ...state, theme: { ...state.theme, ...action.theme }, isDirty: true };

    case 'UPDATE_PAGE_SEO':
      return {
        ...state,
        pages: state.pages.map(p => p.slug === action.slug ? { ...p, seo: { ...p.seo, ...action.seo } } : p),
        isDirty: true,
      };

    case 'UPDATE_PAGE_TITLE':
      return {
        ...state,
        pages: state.pages.map(p => p.slug === action.slug ? { ...p, title: action.title } : p),
        isDirty: true,
      };

    case 'ADD_PAGE':
      return { ...state, pages: [...state.pages, action.page], isDirty: true };

    case 'REMOVE_PAGE':
      return {
        ...state,
        pages: state.pages.filter(p => p.slug !== action.slug),
        activePageSlug: state.activePageSlug === action.slug
          ? (state.pages.find(p => p.slug !== action.slug)?.slug || 'home')
          : state.activePageSlug,
        isDirty: true,
      };

    case 'SET_PAGES':
      return { ...state, pages: action.pages };

    case 'SET_RIGHT_PANEL':
      return { ...state, rightPanel: action.panel };

    case 'SET_DEVICE_PREVIEW':
      return { ...state, devicePreview: action.device };

    case 'SET_SAVING':
      return { ...state, isSaving: action.saving };

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const blocks = state.history[newIndex];
      return { ...state, pages: updateActivePageBlocks(state, blocks), historyIndex: newIndex, isDirty: true };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const blocks = state.history[newIndex];
      return { ...state, pages: updateActivePageBlocks(state, blocks), historyIndex: newIndex, isDirty: true };
    }

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  activePage: PageData | undefined;
  activeBlock: WebsiteBlock | undefined;
  save: () => Promise<void>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

const initialState: EditorState = {
  project: null,
  pages: [],
  activePageSlug: 'home',
  activeBlockId: null,
  theme: defaultTheme,
  isDirty: false,
  isSaving: false,
  rightPanel: null,
  devicePreview: 'desktop',
  history: [[]],
  historyIndex: 0,
};

export function EditorProvider({ children, projectUuid }: { children: ReactNode; projectUuid: string }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load project data
  useEffect(() => {
    websiteBuilderApi.getProject(projectUuid).then((data: any) => {
      dispatch({
        type: 'SET_PROJECT',
        project: {
          id: data.id,
          uuid: data.uuid,
          name: data.name,
          slug: data.slug,
          businessType: data.businessType || '',
          businessDescription: data.businessDescription || '',
          theme: data.theme || defaultTheme,
          status: data.status,
          publishedUrl: data.publishedUrl,
        },
        pages: (data.pages || []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          sortOrder: p.sortOrder,
          isHomePage: p.isHomePage,
          showInNav: p.showInNav,
          seo: p.seo || {},
          blocks: p.blocks || [],
        })),
      });
    });
  }, [projectUuid]);

  const activePage = state.pages.find(p => p.slug === state.activePageSlug);
  const activeBlock = activePage?.blocks.find(b => b.id === state.activeBlockId);

  const save = useCallback(async () => {
    if (!state.project || !state.isDirty) return;
    dispatch({ type: 'SET_SAVING', saving: true });

    try {
      // Save theme to project
      await websiteBuilderApi.updateProject(state.project.uuid, { theme: state.theme });

      // Save all dirty pages
      for (const page of state.pages) {
        await websiteBuilderApi.savePage(state.project.uuid, page.slug, {
          title: page.title,
          blocks: page.blocks,
          seo: page.seo,
          showInNav: page.showInNav,
        });
      }

      dispatch({ type: 'MARK_CLEAN' });
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      dispatch({ type: 'SET_SAVING', saving: false });
    }
  }, [state.project, state.pages, state.theme, state.isDirty]);

  // Auto-save on 2s debounce
  useEffect(() => {
    if (!state.isDirty) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { save(); }, 2000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state.isDirty, save]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? 'REDO' : 'UNDO' });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'SET_ACTIVE_BLOCK', id: null });
      }
      if (e.key === 'Delete' && state.activeBlockId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        dispatch({ type: 'REMOVE_BLOCK', blockId: state.activeBlockId });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.activeBlockId, save]);

  return (
    <EditorContext.Provider value={{ state, dispatch, activePage, activeBlock, save }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
