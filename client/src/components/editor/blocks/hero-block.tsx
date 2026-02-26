interface HeroBlockProps {
  data: Record<string, any>;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

export function HeroBlock({ data, isActive, onUpdate }: HeroBlockProps) {
  const { heading, subheading, ctaText, ctaLink, secondaryCtaText, backgroundImage, layout, alignment } = data;

  const align = alignment || 'center';
  const textAlign = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  const hasBg = layout === 'overlay' && backgroundImage;

  return (
    <div
      className={`py-16 px-8 ${hasBg ? 'bg-cover bg-center' : 'bg-gradient-to-b from-gray-50 to-white'}`}
      style={hasBg ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className={`${hasBg ? 'bg-black/50 rounded-[7px] p-8' : ''}`}>
        {layout === 'split' ? (
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8 items-center">
            <div>
              <h1
                className={`text-3xl font-bold mb-3 outline-none ${hasBg ? 'text-white' : 'text-gray-900'}`}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={e => onUpdate({ heading: e.currentTarget.textContent || '' })}
              >
                {heading || 'Your Headline Here'}
              </h1>
              {subheading && (
                <p
                  className={`text-lg mb-6 outline-none ${hasBg ? 'text-white/80' : 'text-gray-600'}`}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={e => onUpdate({ subheading: e.currentTarget.textContent || '' })}
                >
                  {subheading}
                </p>
              )}
              <div className="flex gap-3">
                {ctaText && (
                  <span className="inline-block px-6 py-2.5 bg-[#064A6C] text-white rounded-[7px] text-sm font-medium">
                    {ctaText}
                  </span>
                )}
                {secondaryCtaText && (
                  <span className="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 rounded-[7px] text-sm font-medium">
                    {secondaryCtaText}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gray-200 rounded-[7px] aspect-video flex items-center justify-center text-gray-400 text-sm">
              {backgroundImage ? (
                <img src={backgroundImage} alt="" className="w-full h-full object-cover rounded-[7px]" />
              ) : (
                'Hero Image'
              )}
            </div>
          </div>
        ) : (
          <div className={`max-w-3xl mx-auto ${textAlign}`}>
            <h1
              className={`text-4xl font-bold mb-4 outline-none ${hasBg ? 'text-white' : 'text-gray-900'}`}
              contentEditable={isActive}
              suppressContentEditableWarning
              onBlur={e => onUpdate({ heading: e.currentTarget.textContent || '' })}
            >
              {heading || 'Your Headline Here'}
            </h1>
            {subheading && (
              <p
                className={`text-lg mb-8 outline-none ${hasBg ? 'text-white/80' : 'text-gray-600'}`}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={e => onUpdate({ subheading: e.currentTarget.textContent || '' })}
              >
                {subheading}
              </p>
            )}
            <div className={`flex gap-3 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
              {ctaText && (
                <span className="inline-block px-6 py-2.5 bg-[#064A6C] text-white rounded-[7px] text-sm font-medium">
                  {ctaText}
                </span>
              )}
              {secondaryCtaText && (
                <span className="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 rounded-[7px] text-sm font-medium">
                  {secondaryCtaText}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
