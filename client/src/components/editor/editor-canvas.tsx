import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Sparkles } from 'lucide-react';
import { useEditor } from './editor-context';
import { BlockRenderer } from './block-renderer';
import { BLOCK_LABELS, type WebsiteBlock } from '../../../../shared/block-types';

function SortableBlock({ block, index }: { block: WebsiteBlock; index: number }) {
  const { state, dispatch } = useEditor();
  const isActive = state.activeBlockId === block.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as any,
  };

  const handleUpdate = (data: Partial<Record<string, any>>) => {
    dispatch({ type: 'UPDATE_BLOCK', blockId: block.id, data });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all ${isActive ? 'ring-2 ring-[#064A6C] ring-offset-1' : 'hover:ring-1 hover:ring-[#064A6C]/30'}`}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'SET_ACTIVE_BLOCK', id: block.id });
      }}
    >
      {/* Hover Toolbar */}
      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-gray-200 rounded-[7px] shadow-sm px-1.5 py-1 z-20 transition-opacity ${isActive || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <span className="text-[10px] text-gray-400 font-medium px-1">{BLOCK_LABELS[block.type] || block.type}</span>
        <div className="w-px h-3 bg-gray-200" />
        <button {...attributes} {...listeners} className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" title="Drag to reorder">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_BLOCK', blockId: block.id }); }} className="p-1 text-gray-400 hover:text-[#064A6C]" title="Duplicate">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_BLOCK', blockId: block.id }); }} className="p-1 text-gray-400 hover:text-red-500" title="Delete">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block Content */}
      <BlockRenderer block={block} isActive={isActive} onUpdate={handleUpdate} />
    </div>
  );
}

export function EditorCanvas() {
  const { state, dispatch, activePage } = useEditor();
  const blocks = activePage?.blocks || [];
  const blockIds = blocks.map(b => b.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = blocks.findIndex(b => b.id === active.id);
    const toIndex = blocks.findIndex(b => b.id === over.id);
    if (fromIndex >= 0 && toIndex >= 0) {
      dispatch({ type: 'MOVE_BLOCK', fromIndex, toIndex });
    }
  };

  const canvasWidth = state.devicePreview === 'mobile' ? 'max-w-[375px]' :
    state.devicePreview === 'tablet' ? 'max-w-[768px]' : 'max-w-full';

  return (
    <div
      className="flex-1 overflow-y-auto bg-gray-100 p-6"
      onClick={() => dispatch({ type: 'SET_ACTIVE_BLOCK', id: null })}
    >
      <div className={`${canvasWidth} mx-auto bg-white min-h-[600px] shadow-sm rounded-[7px] overflow-hidden`}>
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Sparkles className="w-10 h-10 mb-3" />
            <p className="text-lg font-medium">No blocks yet</p>
            <p className="text-sm mt-1">Add blocks from the left toolbar or use AI to generate content</p>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              {blocks.map((block, i) => (
                <SortableBlock key={block.id} block={block} index={i} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
