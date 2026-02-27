import type { WebsiteBlock } from '../../../../shared/block-types';
import { HeroBlock } from './blocks/hero-block';
import { TextBlockEditor } from './blocks/text-block';
import { HeaderBlockEditor, FooterBlockEditor } from './blocks/structural-blocks';
import {
  FeaturesBlockEditor, TestimonialsBlockEditor, CTABlockEditor, ContactBlockEditor,
  FAQBlockEditor, PricingBlockEditor, TeamBlockEditor, StatsBlockEditor,
  GalleryBlockEditor, LogoCloudBlockEditor, ImageBlockEditor,
} from './blocks/common-blocks';
import { CustomCodeBlockEditor } from './blocks/custom-code-block';
import { ProductGridBlockEditor, ProductDetailBlockEditor } from './blocks/product-blocks';

interface BlockRendererProps {
  block: WebsiteBlock;
  isActive: boolean;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function BlockRenderer({ block, isActive, onUpdate }: BlockRendererProps) {
  const props = { data: block.data, isActive, onUpdate };

  switch (block.type) {
    case 'header': return <HeaderBlockEditor {...props} />;
    case 'hero': return <HeroBlock {...props} />;
    case 'text': return <TextBlockEditor {...props} />;
    case 'image': return <ImageBlockEditor {...props} />;
    case 'features': return <FeaturesBlockEditor {...props} />;
    case 'cta': return <CTABlockEditor {...props} />;
    case 'testimonials': return <TestimonialsBlockEditor {...props} />;
    case 'pricing': return <PricingBlockEditor {...props} />;
    case 'faq': return <FAQBlockEditor {...props} />;
    case 'gallery': return <GalleryBlockEditor {...props} />;
    case 'contact': return <ContactBlockEditor {...props} />;
    case 'team': return <TeamBlockEditor {...props} />;
    case 'stats': return <StatsBlockEditor {...props} />;
    case 'logo-cloud': return <LogoCloudBlockEditor {...props} />;
    case 'footer': return <FooterBlockEditor {...props} />;
    case 'custom-code': return <CustomCodeBlockEditor {...props} />;
    case 'product-grid': return <ProductGridBlockEditor {...props} />;
    case 'product-detail': return <ProductDetailBlockEditor {...props} />;
    default:
      return <div className="p-4 bg-gray-100 rounded text-gray-500 text-sm">Unknown block type: {block.type}</div>;
  }
}
