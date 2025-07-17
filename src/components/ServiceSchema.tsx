import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ServiceSchemaProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  category: string;
  price?: string;
  features?: string[];
  areaServed?: string;
}

interface SchemaData {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
    image: string;
    url: string;
    telephone: string;
    priceRange: string;
    address: {
      "@type": string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  areaServed: string;
  category: string;
  url: string;
  image: string;
  offers: {
    "@type": string;
    priceSpecification: {
      "@type": string;
      price: string;
      priceCurrency: string;
    };
    availability: string;
  };
  hasOfferCatalog?: {
    "@type": string;
    name: string;
    itemListElement: Array<{
      "@type": string;
      name: string;
      position: number;
    }>;
  };
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  title,
  description,
  imageUrl,
  slug,
  category,
  price = "$$$",
  features = [],
  areaServed = "Metro Atlanta and North Georgia"
}) => {
  // Format the URL without spaces for schema
  const serviceUrl = `https://arxenconstruction.com/services/${slug}`;
  
  // Structure the JSON-LD data for this service
  const schemaData: SchemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "serviceType": category,
    "brand": {
      "@type": "Brand",
      "name": "Arxen Construction"
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "Arxen Construction",
      "image": "https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png",
      "url": "https://arxenconstruction.com/",
      "telephone": "+1-404-934-9458",
      "email": "Arxenconstruction@gmail.com",
      "priceRange": price,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Marietta Square",
        "addressLocality": "Marietta",
        "addressRegion": "GA",
        "postalCode": "30060",
        "addressCountry": "US"
      }
    },
    "areaServed": areaServed,
    "category": category,
    "url": serviceUrl,
    "image": imageUrl,
    "isRelatedTo": [
      "Home Improvement",
      "Construction",
      "Remodeling",
      "Renovation"
    ],
    "offers": {
      "@type": "Offer",
      "name": `${title} Services`,
      "description": `Professional ${title.toLowerCase()} services in Atlanta, GA`,
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "0",
        "priceCurrency": "USD"
      },
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-27",
      "seller": {
        "@type": "Organization",
        "name": "Arxen Construction"
      }
    }
  };

  // Add features/benefits if provided
  if (features && features.length > 0) {
    schemaData.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": `${title} Features`,
      "itemListElement": features.map((feature, index) => ({
        "@type": "OfferCatalog",
        "name": feature,
        "position": index + 1
      }))
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      {/* Additional meta tags specific to this service */}
      <title>{title} | Arxen Construction | Marietta, GA</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${title.toLowerCase()}, ${category.toLowerCase()}, Marietta, Atlanta, Georgia, home improvement, construction services`} />
      <link rel="canonical" href={serviceUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={serviceUrl} />
      <meta property="og:title" content={`${title} | Arxen Construction`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={serviceUrl} />
      <meta property="twitter:title" content={`${title} | Arxen Construction`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default ServiceSchema; 