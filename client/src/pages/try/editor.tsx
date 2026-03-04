import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { EditorProvider, useEditor, type GuestProjectData } from '@/components/editor/editor-context';
import { EditorTopBar } from '@/components/editor/editor-topbar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { BlockToolbar } from '@/components/editor/block-toolbar';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { ThemePanel } from '@/components/editor/theme-panel';
import { SEOPanel } from '@/components/editor/seo-panel';

const GUEST_STORAGE_KEY = 'hostsblue_guest_project';

function GuestEditorLayout() {
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
        {state.rightPanel === 'seo' && <SEOPanel />}
      </div>
    </div>
  );
}

export function GuestEditorPage() {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState<GuestProjectData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!raw) {
        navigate('/', { replace: true });
        return;
      }
      const data = JSON.parse(raw) as GuestProjectData;
      if (!data.name || !data.pages?.length) {
        navigate('/', { replace: true });
        return;
      }
      setGuestData(data);
    } catch {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  if (!guestData) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#064A6C] animate-spin" />
      </div>
    );
  }

  return (
    <EditorProvider guestMode guestData={guestData}>
      <GuestEditorLayout />
    </EditorProvider>
  );
}
