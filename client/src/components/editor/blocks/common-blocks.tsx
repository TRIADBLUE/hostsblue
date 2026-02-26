// Consolidated block editors: Features, Testimonials, CTA, Contact, FAQ, Pricing, Team, Stats, Gallery, LogoCloud, Image

interface BlockEditorProps {
  data: Record<string, any>;
  isActive: boolean;
  onUpdate: (data: Record<string, any>) => void;
}

// ---- Features ----
export function FeaturesBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, subheading, columns = 3, items = [] } = data;
  const gridCols = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="py-12 px-8">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2
            className="text-2xl font-bold text-center mb-2 outline-none"
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={e => onUpdate({ heading: e.currentTarget.textContent || '' })}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-gray-500 text-center mb-8">{subheading}</p>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {items.map((item: any, i: number) => (
            <div key={i} className="text-center p-4 border border-gray-100 rounded-[7px]">
              <div className="w-10 h-10 bg-[#064A6C]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-[#064A6C]">&#9733;</span>
              </div>
              <h3
                className="font-semibold mb-1 outline-none"
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={e => {
                  const newItems = [...items];
                  newItems[i] = { ...newItems[i], title: e.currentTarget.textContent || '' };
                  onUpdate({ items: newItems });
                }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Testimonials ----
export function TestimonialsBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, items = [], layout } = data;
  const cols = Math.min(items.length, 3);

  return (
    <div className="py-12 px-8">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-8">{heading}</h2>}
        <div className={`grid grid-cols-${cols} gap-6`}>
          {items.map((item: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-[7px] p-5">
              <p className="italic text-gray-600 mb-3">"{item.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                {item.role && <p className="text-xs text-gray-400">{item.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- CTA ----
export function CTABlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, text, buttonText, backgroundColor } = data;

  return (
    <div className="py-12 px-8" style={{ backgroundColor: backgroundColor || '#064A6C' }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-2xl font-bold text-white mb-2 outline-none"
          contentEditable={isActive}
          suppressContentEditableWarning
          onBlur={e => onUpdate({ heading: e.currentTarget.textContent || '' })}
        >
          {heading}
        </h2>
        {text && <p className="text-white/80 mb-6">{text}</p>}
        <span className="inline-block px-6 py-2.5 bg-white text-[#064A6C] rounded-[7px] font-medium text-sm">
          {buttonText || 'Get Started'}
        </span>
      </div>
    </div>
  );
}

// ---- Contact ----
export function ContactBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, showForm, email, phone, address } = data;

  return (
    <div className="py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-8">{heading}</h2>}
        <div className="grid grid-cols-2 gap-8">
          {showForm && (
            <div className="space-y-4 border border-gray-100 rounded-[7px] p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="w-full h-10 bg-gray-100 rounded-[7px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="w-full h-10 bg-gray-100 rounded-[7px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="w-full h-24 bg-gray-100 rounded-[7px]" />
              </div>
              <span className="inline-block px-6 py-2.5 bg-[#064A6C] text-white rounded-[7px] text-sm font-medium">
                Send Message
              </span>
            </div>
          )}
          <div className="space-y-4">
            {email && (
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-gray-600">{email}</p>
              </div>
            )}
            {phone && (
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-gray-600">{phone}</p>
              </div>
            )}
            {address && (
              <div>
                <p className="font-semibold text-sm">Address</p>
                <p className="text-gray-600">{address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- FAQ ----
export function FAQBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, items = [] } = data;

  return (
    <div className="py-12 px-8">
      <div className="max-w-2xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-8">{heading}</h2>}
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-[7px] p-4">
              <p className="font-semibold text-gray-900">{item.question}</p>
              <p className="text-sm text-gray-500 mt-1">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Pricing ----
export function PricingBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, subheading, columns = [] } = data;
  const cols = Math.min(columns.length, 4);

  return (
    <div className="py-12 px-8">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-2">{heading}</h2>}
        {subheading && <p className="text-gray-500 text-center mb-8">{subheading}</p>}
        <div className={`grid grid-cols-${cols} gap-6`}>
          {columns.map((col: any, i: number) => (
            <div key={i} className={`border rounded-[7px] p-6 text-center ${col.highlighted ? 'border-[#064A6C] border-2 relative' : 'border-gray-200'}`}>
              {col.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#064A6C] text-white text-xs rounded-full font-medium">
                  Popular
                </span>
              )}
              <h3 className="font-semibold text-lg">{col.name}</h3>
              <p className="text-3xl font-bold my-3">{col.price}</p>
              {col.period && <p className="text-sm text-gray-400">{col.period}</p>}
              <ul className="my-4 space-y-2 text-left">
                {(col.features || []).map((f: string, fi: number) => (
                  <li key={fi} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              {col.ctaText && (
                <span className={`inline-block w-full text-center px-4 py-2 rounded-[7px] text-sm font-medium ${
                  col.highlighted ? 'bg-[#064A6C] text-white' : 'border border-gray-300 text-gray-700'
                }`}>
                  {col.ctaText}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Team ----
export function TeamBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, members = [] } = data;
  const cols = Math.min(members.length, 4);

  return (
    <div className="py-12 px-8">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-8">{heading}</h2>}
        <div className={`grid grid-cols-${cols} gap-6`}>
          {members.map((m: any, i: number) => (
            <div key={i} className="text-center">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
              <p className="font-semibold">{m.name}</p>
              {m.role && <p className="text-sm text-gray-500">{m.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Stats ----
export function StatsBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { items = [] } = data;
  const cols = Math.min(items.length, 4);

  return (
    <div className="py-12 px-8">
      <div className={`max-w-4xl mx-auto grid grid-cols-${cols} gap-8 text-center`}>
        {items.map((s: any, i: number) => (
          <div key={i}>
            <p className="text-3xl font-bold text-[#064A6C]">
              {s.prefix || ''}{s.value}{s.suffix || ''}
            </p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Gallery ----
export function GalleryBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, columns = 3, images = [] } = data;
  const gridCols = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="py-12 px-8">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-2xl font-bold text-center mb-6">{heading}</h2>}
        <div className={`grid ${gridCols} gap-4`}>
          {images.map((img: any, i: number) => (
            <img key={i} src={img.src} alt={img.alt || ''} className="w-full aspect-[4/3] object-cover rounded-[7px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Logo Cloud ----
export function LogoCloudBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { heading, logos = [] } = data;

  return (
    <div className="py-8 px-8">
      <div className="max-w-4xl mx-auto">
        {heading && (
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{heading}</p>
        )}
        <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
          {logos.map((logo: any, i: number) => (
            <img key={i} src={logo.src} alt={logo.alt || ''} className="max-h-10 w-auto" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Image ----
export function ImageBlockEditor({ data, isActive, onUpdate }: BlockEditorProps) {
  const { src, alt, caption, maxWidth } = data;
  const mw = maxWidth === 'sm' ? 'max-w-md' : maxWidth === 'md' ? 'max-w-xl' : maxWidth === 'full' ? 'max-w-full' : 'max-w-3xl';

  return (
    <div className="py-8 px-8">
      <figure className={`${mw} mx-auto`}>
        {src ? (
          <img src={src} alt={alt || ''} className="w-full rounded-[7px]" />
        ) : (
          <div className="w-full aspect-video bg-gray-100 rounded-[7px] flex items-center justify-center text-gray-400">
            No image set
          </div>
        )}
        {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
      </figure>
    </div>
  );
}
