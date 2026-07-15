import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  url?: string;
}

export default function SeoHead({ title, description, url = 'https://pcmarketstore.com' }: SeoHeadProps) {
  return (
    <Helmet>
      <title>{title} | PC Market Store</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${title} | PC Market Store`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | PC Market Store`} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
