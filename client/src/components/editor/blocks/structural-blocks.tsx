// Header and Footer editor blocks

interface BlockEditorProps {
  data: Record<string, any>;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function HeaderBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { logoText, navLinks = [], ctaText } = data;

  return (
    <div className="bg-[#064A6C] text-white px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span
          className="text-lg font-bold outline-none"
          contentEditable={isActive}
          suppressContentEditableWarning
          onBlur={e => onUpdate({ logoText: e.currentTarget.textContent || '' })}
        >
          {logoText || 'Logo'}
        </span>
        <div className="flex items-center gap-4">
          {navLinks.map((link: any, i: number) => (
            <span key={i} className="text-white/70 text-sm hover:text-white transition-colors cursor-default">
              {link.label}
            </span>
          ))}
          {ctaText && (
            <span className="px-4 py-1.5 bg-white/20 rounded-[7px] text-sm font-medium">
              {ctaText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function FooterBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { companyName, links = [], copyright, socialLinks = [] } = data;

  return (
    <div className="bg-[#064A6C] text-white/80 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <span
            className="text-lg font-bold text-white outline-none"
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={e => onUpdate({ companyName: e.currentTarget.textContent || '' })}
          >
            {companyName || 'Company'}
          </span>
          <div className="flex gap-8">
            {links.map((group: any[], gi: number) => (
              <div key={gi} className="flex flex-col gap-2">
                {group.map((link: any, li: number) => (
                  <span key={li} className="text-sm text-white/60 hover:text-white/80 cursor-default">
                    {link.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        {copyright && (
          <p
            className="mt-6 pt-4 border-t border-white/10 text-xs text-white/40 text-center outline-none"
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={e => onUpdate({ copyright: e.currentTarget.textContent || '' })}
          >
            {copyright}
          </p>
        )}
      </div>
    </div>
  );
}
