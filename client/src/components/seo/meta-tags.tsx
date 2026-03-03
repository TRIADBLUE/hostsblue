import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export function MetaTags({ title, description, ogImage, canonical }: MetaTagsProps) {
  const fullTitle = title.includes('hostsblue') ? title : `${title} — hostsblue`;
  const image = ogImage || 'https://hostsblue.com/hostsblue_og.png';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
