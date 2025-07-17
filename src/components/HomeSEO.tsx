import React from 'react';
import { Helmet } from 'react-helmet-async';

const HomeSEO: React.FC = () => {
  // Define base business information for schema markup
  const businessInfo = {
    name: "Arxen Construction",
    description: "Professional residential and commercial construction and remodeling services in the Atlanta area.",
    logo: "https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png",
    url: "https://arxenconstruction.com", // Replace with actual URL when live
    telephone: "404-934-9458",
    email: "Arxenconstruction@gmail.com",
    address: {
      streetAddress: "123 Construction Way", // Replace with actual address
      addressLocality: "Atlanta",
      addressRegion: "GA",
      postalCode: "30301", // Replace with actual zip
      addressCountry: "US"
    },
    geo: {
      latitude: "33.7490", // Replace with actual coordinates
      longitude: "-84.3880" // Replace with actual coordinates
    },
    openingHours: [
      "Mo-Fr 08:00-18:00",
      "Sa-Su 08:00-18:00"
    ],
    sameAs: [
      "https://www.facebook.com/arxenconstruction/", // Replace with actual social URLs
      "https://www.instagram.com/arxenconstruction/",
      "https://www.linkedin.com/company/arxenconstruction/"
    ],
    areaServed: [
      {
        "@type": "City",
        "name": "Atlanta"
      },
      {
        "@type": "City",
        "name": "Marietta"
      },
      {
        "@type": "City",
        "name": "Decatur"
      }
      // Add other serviced areas
    ],
    priceRange: "$$-$$$"
  };

  // Define services for service markup
  const mainServices = [
    {
      "@type": "Service",
      "name": "Kitchen Remodeling",
      "description": "Complete kitchen transformations with custom cabinets, countertops, and fixtures.",
      "url": "https://arxenconstruction.com/services/kitchen-remodeling"
    },
    {
      "@type": "Service",
      "name": "Bathroom Remodeling",
      "description": "Modern bathroom renovations with premium fixtures and custom designs.",
      "url": "https://arxenconstruction.com/services/bathroom-remodeling"
    },
    {
      "@type": "Service",
      "name": "Office Renovation",
      "description": "Commercial office space renovation and optimization.",
      "url": "https://arxenconstruction.com/services/office-renovation"
    }
  ];

  return (
    <Helmet>
      <title>Arxen Construction | #1 Atlanta Home Remodeling & Commercial Construction Company</title>
      <meta name="description" content="Top-rated Atlanta construction company with 15+ years experience. Expert kitchen & bathroom remodeling, flooring, painting, commercial construction. Licensed & insured. Free estimates!" />
      <meta name="keywords" content="Atlanta construction company, home remodeling Atlanta, kitchen remodeling Atlanta, bathroom renovation Atlanta, flooring installation Georgia, commercial construction Atlanta, Marietta contractor, licensed contractor Georgia, home improvement Atlanta, custom cabinetry Atlanta" />
      
      {/* Open Graph / Social Media Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Arxen Construction | #1 Atlanta Home Remodeling & Commercial Construction Company" />
      <meta property="og:description" content="Top-rated Atlanta construction company with 15+ years experience. Expert kitchen & bathroom remodeling, flooring, painting, commercial construction. Licensed & insured. Free estimates!" />
      <meta property="og:image" content="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" />
      <meta property="og:url" content="https://arxenconstruction.com" />
      <meta property="og:site_name" content="Arxen Construction" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Arxen Construction | #1 Atlanta Home Remodeling & Commercial Construction Company" />
      <meta name="twitter:description" content="Top-rated Atlanta construction company with 15+ years experience. Expert kitchen & bathroom remodeling, flooring, painting, commercial construction. Licensed & insured. Free estimates!" />
      <meta name="twitter:image" content="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://arxenconstruction.com" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Arxen Construction" />
      <meta name="geo.region" content="US-GA" />
      <meta name="geo.placename" content="Atlanta" />
      <meta name="geo.position" content="33.9526;-84.5499" />
      <meta name="ICBM" content="33.9526, -84.5499" />

      {/* Schema.org Markup for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": businessInfo.url,
          "name": businessInfo.name,
          "description": businessInfo.description,
          "url": businessInfo.url,
          "telephone": businessInfo.telephone,
          "email": businessInfo.email,
          "foundingDate": "2008",
          "logo": businessInfo.logo,
          "image": businessInfo.logo,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": businessInfo.address.streetAddress,
            "addressLocality": businessInfo.address.addressLocality,
            "addressRegion": businessInfo.address.addressRegion,
            "postalCode": businessInfo.address.postalCode,
            "addressCountry": businessInfo.address.addressCountry
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": businessInfo.geo.latitude,
            "longitude": businessInfo.geo.longitude
          },
          "openingHoursSpecification": businessInfo.openingHours.map(hours => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": hours.split(" ")[0],
            "opens": hours.split(" ")[1].split("-")[0],
            "closes": hours.split(" ")[1].split("-")[1]
          })),
          "sameAs": businessInfo.sameAs,
          "areaServed": businessInfo.areaServed,
          "priceRange": businessInfo.priceRange,
          "paymentAccepted": ["Cash", "Check", "Credit Card", "Financing Available"],
          "currenciesAccepted": "USD",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Construction Services",
            "itemListElement": mainServices
          },
          "knowsAbout": [
            "Kitchen Remodeling", "Bathroom Renovation", "Flooring Installation", "Interior Painting",
            "Exterior Painting", "Custom Cabinetry", "Home Additions", "Basement Finishing",
            "Commercial Construction", "Office Renovation", "Retail Fit-out"
          ],
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4.9",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "John Smith"
            },
            "reviewBody": "Arxen Construction completely transformed our kitchen. Professional team, quality craftsmanship, and on-time completion."
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
          }
        })}
      </script>
      
      {/* FAQ Schema for common questions */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What areas does Arxen Construction serve?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Arxen Construction serves the greater Atlanta metropolitan area, including Fulton, DeKalb, Cobb, Gwinnett, and Clayton counties."
              }
            },
            {
              "@type": "Question",
              "name": "What services does Arxen Construction offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer a comprehensive range of construction services including kitchen and bathroom remodeling, custom cabinetry, flooring installation, office renovations, commercial fit-outs, and more."
              }
            },
            {
              "@type": "Question",
              "name": "How long does a typical renovation project take?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Project timelines vary based on scope and complexity. Kitchen renovations typically take 3-6 weeks, bathrooms 2-4 weeks, and larger projects like additions can take 2-3 months."
              }
            },
            {
              "@type": "Question",
              "name": "Is Arxen Construction licensed and insured?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Arxen Construction is fully licensed, bonded, and insured to perform all residential and commercial construction services."
              }
            }
          ]
        })}
      </script>
      
      {/* Service schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", ".hero-description"]
          },
          "name": "Expert Construction and Remodeling Services",
          "description": businessInfo.description,
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "main"
          }
        })}
      </script>
    </Helmet>
  );
};

export default HomeSEO; 