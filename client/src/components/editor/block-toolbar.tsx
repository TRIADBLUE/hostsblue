import { Type, Image, Layout, Star, DollarSign, HelpCircle, Grid, Phone, Users, BarChart3, Award, ArrowDown, Heading, Menu, MessageSquare } from 'lucide-react';
import { useEditor } from './editor-context';
import { BLOCK_CATEGORIES, BLOCK_LABELS, type BlockType } from '../../../../shared/block-types';

const BLOCK_ICONS: Record<string, React.ComponentType<any>> = {
  header: Menu,
  hero: Layout,
  text: Type,
  image: Image,
  features: Star,
  cta: ArrowDown,
  testimonials: MessageSquare,
  pricing: DollarSign,
  faq: HelpCircle,
  gallery: Grid,
  contact: Phone,
  team: Users,
  stats: BarChart3,
  'logo-cloud': Award,
  footer: Heading,
};

export function BlockToolbar() {
  const { dispatch } = useEditor();

  const handleAddBlock = (type: BlockType) => {
    dispatch({ type: 'ADD_BLOCK', blockType: type });
  };

  return (
    <div className="w-[60px] bg-white border-r border-gray-200 flex flex-col py-2 overflow-y-auto flex-shrink-0">
      {BLOCK_CATEGORIES.map(category => (
        <div key={category.label} className="mb-2">
          <div className="px-2 py-1">
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{category.label}</span>
          </div>
          {category.types.map(type => {
            const Icon = BLOCK_ICONS[type] || Type;
            return (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="w-full flex flex-col items-center gap-0.5 py-2 px-1 text-gray-500 hover:text-[#064A6C] hover:bg-[#064A6C]/5 transition-colors rounded-[5px] mx-auto"
                title={`Add ${BLOCK_LABELS[type]}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[8px] leading-tight text-center">{BLOCK_LABELS[type]}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
