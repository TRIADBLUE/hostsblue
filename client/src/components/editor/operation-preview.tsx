import { Check, X, Eye, ArrowRight, Plus, Pencil, Trash2, Palette, Search } from 'lucide-react';

interface Operation {
  id: string;
  type: 'add_block' | 'update_block' | 'remove_block' | 'update_theme' | 'update_seo';
  description: string;
  payload: Record<string, any>;
  preview?: {
    label: string;
    before?: string;
    after?: string;
    blockType?: string;
  };
}

const OP_ICONS: Record<string, typeof Plus> = {
  add_block: Plus,
  update_block: Pencil,
  remove_block: Trash2,
  update_theme: Palette,
  update_seo: Search,
};

const OP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  add_block: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  update_block: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  remove_block: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  update_theme: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  update_seo: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export function OperationPreview({
  operation,
  onAccept,
  onDismiss,
}: {
  operation: Operation;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const Icon = OP_ICONS[operation.type] || Eye;
  const colors = OP_COLORS[operation.type] || OP_COLORS.update_block;
  const preview = operation.preview;

  return (
    <div className={`border ${colors.border} rounded-[7px] overflow-hidden`}>
      {/* Header */}
      <div className={`${colors.bg} px-3 py-2 flex items-center gap-2`}>
        <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
        <span className={`text-xs font-medium ${colors.text}`}>
          {preview?.label || operation.description}
        </span>
      </div>

      {/* Preview content */}
      {preview && (preview.before || preview.after) && (
        <div className="px-3 py-2 bg-white border-t border-gray-100">
          {preview.before && (
            <div className="mb-2">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Before</span>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{preview.before}</p>
            </div>
          )}
          {preview.before && preview.after && (
            <div className="flex items-center gap-1 my-1">
              <ArrowRight className="w-3 h-3 text-gray-300" />
            </div>
          )}
          {preview.after && (
            <div>
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">After</span>
              <p className="text-xs text-gray-800 mt-0.5 line-clamp-2 font-medium">{preview.after}</p>
            </div>
          )}
        </div>
      )}

      {/* Block type badge */}
      {preview?.blockType && (
        <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100">
          <span className="text-[10px] px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-500">
            {preview.blockType}
          </span>
        </div>
      )}

      {/* Description if no preview */}
      {!preview && (
        <div className="px-3 py-2 bg-white">
          <p className="text-xs text-gray-600">{operation.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#064A6C] text-white rounded-[5px] text-xs font-medium hover:bg-[#053C58] transition-colors"
        >
          <Check className="w-3 h-3" /> Apply
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center justify-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-500 rounded-[5px] text-xs hover:bg-gray-100 transition-colors"
        >
          <X className="w-3 h-3" /> Skip
        </button>
      </div>
    </div>
  );
}

export function OperationPreviewList({
  operations,
  onAccept,
  onDismiss,
  onAcceptAll,
}: {
  operations: Operation[];
  onAccept: (op: Operation) => void;
  onDismiss: (op: Operation) => void;
  onAcceptAll: () => void;
}) {
  if (operations.length === 0) return null;

  return (
    <div className="space-y-2">
      {operations.length > 1 && (
        <button
          onClick={onAcceptAll}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#064A6C] text-white rounded-[7px] text-xs font-medium hover:bg-[#053C58] transition-colors"
        >
          <Check className="w-3 h-3" />
          Apply All ({operations.length} changes)
        </button>
      )}
      {operations.map(op => (
        <OperationPreview
          key={op.id}
          operation={op}
          onAccept={() => onAccept(op)}
          onDismiss={() => onDismiss(op)}
        />
      ))}
    </div>
  );
}
