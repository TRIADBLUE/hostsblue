import { useEditor } from './editor-context';
import { X } from 'lucide-react';

const FONT_OPTIONS = [
  'Inter', 'Space Grotesk', 'Playfair Display', 'Merriweather', 'Poppins',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Raleway',
];

export function ThemePanel() {
  const { state, dispatch } = useEditor();
  const theme = state.theme;

  const update = (partial: Record<string, any>) => {
    dispatch({ type: 'UPDATE_THEME', theme: partial });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Theme</h3>
        <button onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: null })} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Colors */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Colors</h4>
          <div className="space-y-3">
            {[
              { label: 'Primary', key: 'primaryColor' },
              { label: 'Secondary', key: 'secondaryColor' },
              { label: 'Accent', key: 'accentColor' },
              { label: 'Background', key: 'bgColor' },
              { label: 'Text', key: 'textColor' },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-xs text-gray-600">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(theme as any)[key] || '#000000'}
                    onChange={e => update({ [key]: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 font-mono w-16">{(theme as any)[key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Typography</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Heading Font</label>
              <select
                value={theme.fontHeading}
                onChange={e => update({ fontHeading: e.target.value })}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
              >
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Body Font</label>
              <select
                value={theme.fontBody}
                onChange={e => update({ fontBody: e.target.value })}
                className="w-full border border-gray-200 rounded-[7px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#064A6C]"
              >
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Shape</h4>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Radius: {theme.borderRadius}px</label>
            <input
              type="range"
              min={0}
              max={20}
              value={theme.borderRadius}
              onChange={e => update({ borderRadius: parseInt(e.target.value) })}
              className="w-full accent-[#064A6C]"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</h4>
          <div className="rounded-[7px] overflow-hidden border border-gray-200">
            <div className="p-3" style={{ backgroundColor: theme.primaryColor }}>
              <span className="text-white text-sm font-semibold" style={{ fontFamily: theme.fontHeading }}>Header</span>
            </div>
            <div className="p-4" style={{ backgroundColor: theme.bgColor, color: theme.textColor }}>
              <h4 className="font-bold mb-1" style={{ fontFamily: theme.fontHeading, color: theme.textColor }}>Heading</h4>
              <p className="text-xs mb-2" style={{ fontFamily: theme.fontBody }}>Body text example</p>
              <button
                className="px-3 py-1 text-xs text-white"
                style={{ backgroundColor: theme.secondaryColor, borderRadius: theme.borderRadius }}
              >
                Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
