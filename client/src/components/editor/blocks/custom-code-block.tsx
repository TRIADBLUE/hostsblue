import { Code } from 'lucide-react';

interface CustomCodeBlockEditorProps {
  data: any;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function CustomCodeBlockEditor({ data, isActive }: CustomCodeBlockEditorProps) {
  const hasContent = data.html || data.css || data.js;
  const posLabel = data.position === 'head' ? 'Injected in <head>' : data.position === 'body-end' ? 'Injected before </body>' : 'Inline';

  return (
    <div className={`p-6 rounded-[7px] border-2 border-dashed ${isActive ? 'border-[#064A6C] bg-[#064A6C]/5' : 'border-gray-300 bg-gray-50'} text-center`}>
      <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm font-medium text-gray-700">Custom Code Block</p>
      <p className="text-xs text-gray-400 mt-1">{posLabel}</p>
      {hasContent && (
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
          {data.html && <span>HTML</span>}
          {data.css && <span>CSS</span>}
          {data.js && <span>JS</span>}
        </div>
      )}
      {!hasContent && <p className="text-xs text-gray-400 mt-1">Select to add HTML, CSS, or JavaScript</p>}
    </div>
  );
}
