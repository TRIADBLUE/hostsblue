import { useEditor } from './editor-context';
import { X } from 'lucide-react';
import { BLOCK_LABELS } from '../../../../shared/block-types';

export function PropertiesPanel() {
  const { state, dispatch, activeBlock } = useEditor();

  if (!activeBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
        <p className="text-sm text-gray-400 text-center mt-8">Select a block to edit its properties</p>
      </div>
    );
  }

  const update = (data: Record<string, any>) => {
    dispatch({ type: 'UPDATE_BLOCK', blockId: activeBlock.id, data });
  };

  const updateStyle = (style: Record<string, any>) => {
    dispatch({ type: 'UPDATE_BLOCK_STYLE', blockId: activeBlock.id, style });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{BLOCK_LABELS[activeBlock.type] || activeBlock.type}</h3>
        <button onClick={() => dispatch({ type: 'SET_ACTIVE_BLOCK', id: null })} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Block-specific fields */}
        {renderBlockFields(activeBlock, update)}

        {/* Style section */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Style</h4>
          <div className="space-y-3">
            <FieldRow label="Background">
              <input
                type="color"
                value={activeBlock.style?.backgroundColor || '#ffffff'}
                onChange={e => updateStyle({ backgroundColor: e.target.value === '#ffffff' ? undefined : e.target.value })}
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              />
              {activeBlock.style?.backgroundColor && (
                <button onClick={() => updateStyle({ backgroundColor: undefined })} className="text-xs text-gray-400">Reset</button>
              )}
            </FieldRow>
            <FieldRow label="Text Color">
              <input
                type="color"
                value={activeBlock.style?.textColor || '#000000'}
                onChange={e => updateStyle({ textColor: e.target.value === '#000000' ? undefined : e.target.value })}
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              />
            </FieldRow>
            <FieldRow label="Padding Y">
              <select
                value={activeBlock.style?.paddingY || 'lg'}
                onChange={e => updateStyle({ paddingY: e.target.value })}
                className="input-sm"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </FieldRow>
            <FieldRow label="Max Width">
              <select
                value={activeBlock.style?.maxWidth || 'lg'}
                onChange={e => updateStyle({ maxWidth: e.target.value })}
                className="input-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="full">Full Width</option>
              </select>
            </FieldRow>
            <FieldRow label="Hidden">
              <input
                type="checkbox"
                checked={activeBlock.style?.hidden || false}
                onChange={e => updateStyle({ hidden: e.target.checked })}
                className="accent-[#064A6C]"
              />
            </FieldRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-gray-600">{label}</label>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function renderBlockFields(block: any, update: (data: Record<string, any>) => void): React.ReactNode {
  const d = block.data;

  switch (block.type) {
    case 'header':
      return (
        <>
          <TextField label="Logo Text" value={d.logoText} onChange={v => update({ logoText: v })} />
          <TextField label="CTA Text" value={d.ctaText} onChange={v => update({ ctaText: v })} />
          <TextField label="CTA Link" value={d.ctaLink} onChange={v => update({ ctaLink: v })} />
        </>
      );

    case 'hero':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <TextField label="Subheading" value={d.subheading} onChange={v => update({ subheading: v })} multiline />
          <TextField label="CTA Text" value={d.ctaText} onChange={v => update({ ctaText: v })} />
          <TextField label="CTA Link" value={d.ctaLink} onChange={v => update({ ctaLink: v })} />
          <TextField label="Secondary CTA" value={d.secondaryCtaText} onChange={v => update({ secondaryCtaText: v })} />
          <TextField label="Background Image" value={d.backgroundImage} onChange={v => update({ backgroundImage: v })} />
          <SelectField label="Layout" value={d.layout} onChange={v => update({ layout: v })} options={[
            { label: 'Simple', value: 'simple' }, { label: 'Split', value: 'split' }, { label: 'Overlay', value: 'overlay' },
          ]} />
          <SelectField label="Alignment" value={d.alignment} onChange={v => update({ alignment: v })} options={[
            { label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' },
          ]} />
        </>
      );

    case 'text':
      return <TextField label="Content (HTML)" value={d.content} onChange={v => update({ content: v })} multiline />;

    case 'image':
      return (
        <>
          <TextField label="Image URL" value={d.src} onChange={v => update({ src: v })} />
          <TextField label="Alt Text" value={d.alt} onChange={v => update({ alt: v })} />
          <TextField label="Caption" value={d.caption} onChange={v => update({ caption: v })} />
        </>
      );

    case 'features':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <TextField label="Subheading" value={d.subheading} onChange={v => update({ subheading: v })} />
          <SelectField label="Columns" value={String(d.columns)} onChange={v => update({ columns: parseInt(v) })} options={[
            { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' },
          ]} />
          <p className="text-xs text-gray-400">Edit feature items inline on canvas</p>
        </>
      );

    case 'cta':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <TextField label="Text" value={d.text} onChange={v => update({ text: v })} multiline />
          <TextField label="Button Text" value={d.buttonText} onChange={v => update({ buttonText: v })} />
          <TextField label="Button Link" value={d.buttonLink} onChange={v => update({ buttonLink: v })} />
        </>
      );

    case 'testimonials':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <SelectField label="Layout" value={d.layout} onChange={v => update({ layout: v })} options={[
            { label: 'Cards', value: 'cards' }, { label: 'Single', value: 'single' },
          ]} />
          <p className="text-xs text-gray-400">Edit testimonials inline on canvas</p>
        </>
      );

    case 'pricing':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <TextField label="Subheading" value={d.subheading} onChange={v => update({ subheading: v })} />
          <p className="text-xs text-gray-400">Edit pricing columns inline on canvas</p>
        </>
      );

    case 'faq':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <p className="text-xs text-gray-400">Edit Q&A items inline on canvas</p>
        </>
      );

    case 'gallery':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <SelectField label="Columns" value={String(d.columns)} onChange={v => update({ columns: parseInt(v) })} options={[
            { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' },
          ]} />
        </>
      );

    case 'contact':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <TextField label="Email" value={d.email} onChange={v => update({ email: v })} />
          <TextField label="Phone" value={d.phone} onChange={v => update({ phone: v })} />
          <TextField label="Address" value={d.address} onChange={v => update({ address: v })} multiline />
        </>
      );

    case 'team':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <p className="text-xs text-gray-400">Edit team members inline on canvas</p>
        </>
      );

    case 'stats':
      return <p className="text-xs text-gray-400">Edit stats inline on canvas</p>;

    case 'logo-cloud':
      return <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />;

    case 'footer':
      return (
        <>
          <TextField label="Company Name" value={d.companyName} onChange={v => update({ companyName: v })} />
          <TextField label="Copyright" value={d.copyright} onChange={v => update({ copyright: v })} />
        </>
      );

    case 'custom-code':
      return (
        <>
          <SelectField label="Position" value={d.position || 'inline'} onChange={v => update({ position: v })} options={[
            { label: 'Inline (in page)', value: 'inline' },
            { label: 'Head (<head> tag)', value: 'head' },
            { label: 'Body End (before </body>)', value: 'body-end' },
          ]} />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">HTML</label>
            <textarea
              value={d.html || ''}
              onChange={e => update({ html: e.target.value })}
              rows={4}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-xs font-mono bg-gray-900 text-green-400 focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical"
              placeholder="<div>Your HTML here...</div>"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">CSS</label>
            <textarea
              value={d.css || ''}
              onChange={e => update({ css: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-xs font-mono bg-gray-900 text-blue-400 focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical"
              placeholder=".my-class { color: red; }"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">JavaScript</label>
            <textarea
              value={d.js || ''}
              onChange={e => update({ js: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-xs font-mono bg-gray-900 text-yellow-400 focus:outline-none focus:ring-1 focus:ring-[#064A6C] resize-vertical"
              placeholder="console.log('Hello');"
            />
          </div>
        </>
      );

    case 'product-grid':
      return (
        <>
          <TextField label="Heading" value={d.heading} onChange={v => update({ heading: v })} />
          <SelectField label="Columns" value={String(d.columns || 3)} onChange={v => update({ columns: parseInt(v) })} options={[
            { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' },
          ]} />
          <TextField label="Max Products" value={String(d.maxProducts || 12)} onChange={v => update({ maxProducts: parseInt(v) || 12 })} />
          <TextField label="Category Slug (optional)" value={d.categorySlug || ''} onChange={v => update({ categorySlug: v })} />
          <FieldRow label="Show Price">
            <input
              type="checkbox"
              checked={d.showPrice !== false}
              onChange={e => update({ showPrice: e.target.checked })}
              className="accent-[#064A6C]"
            />
          </FieldRow>
        </>
      );

    case 'product-detail':
      return (
        <TextField label="Product Slug" value={d.productSlug || ''} onChange={v => update({ productSlug: v })} />
      );

    default:
      return <p className="text-xs text-gray-400">No properties available</p>;
  }
}
