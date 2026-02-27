import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { EditorProvider, useEditor } from '@/components/editor/editor-context';
import { EditorTopBar } from '@/components/editor/editor-topbar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { BlockToolbar } from '@/components/editor/block-toolbar';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { ThemePanel } from '@/components/editor/theme-panel';
import { AICoachPanel } from '@/components/editor/ai-coach-panel';
import { SEOPanel } from '@/components/editor/seo-panel';

function EditorLayout() {
  const { state } = useEditor();

  if (!state.project) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <EditorTopBar />
      <div className="flex flex-1 overflow-hidden">
        <BlockToolbar />
        <EditorCanvas />
        {state.rightPanel === 'properties' && <PropertiesPanel />}
        {state.rightPanel === 'theme' && <ThemePanel />}
        {state.rightPanel === 'ai-coach' && <AICoachPanel />}
        {state.rightPanel === 'seo' && <SEOPanel />}
      </div>
    </div>
  );
}

export function WebsiteEditorPage() {
  const { uuid } = useParams<{ uuid: string }>();

  if (!uuid) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">No project UUID provided</p>
      </div>
    );
  }

  return (
    <EditorProvider projectUuid={uuid}>
      <EditorLayout />
    </EditorProvider>
  );
}
