import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Check, Phone, Mail, ArrowRight, Download } from 'lucide-react';
import ServiceSchema from '../components/ServiceSchema';
import { usePropertyType } from '../components/PropertyTypeContext';

interface ServicePageProps {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  imageUrl: string;
  category: string;
  relatedServices: Array<{
    title: string;
    path: string;
  }>;
  processSteps?: Array<{ title: string; description: string; }>;
  galleryImages?: string[];
  pricingInfo?: {
    startingAt: string;
    averageRange: string;
    highEnd: string;
    description: string;
  };
}

const ServiceTemplate: React.FC<ServicePageProps> = ({
  title,
  description,
  features,
  benefits,
  imageUrl,
  category,
  relatedServices,
  processSteps = [],
  galleryImages = [],
  pricingInfo
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const location = useLocation();
  
  // Use the context instead of reading URL parameters directly
  const { propertyType, buildingType } = usePropertyType();
  
  // Get project type from URL for backward compatibility
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get('projectType') || 'residential';
  
  // Define getters for type names, but use the context values
  const propertyTypeName = propertyType ? propertyType.name : null;
  const buildingTypeName = buildingType ? buildingType.name : null;
  const typeInfoToDisplay = buildingTypeName || propertyTypeName;

  // Create a URL-friendly slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // For header transparency effect
      setScrolled(window.scrollY > 100);
      
      // For scroll animations
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        if (!sectionId) return;
        
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        const isVisible = sectionTop < window.innerHeight - 100 && sectionBottom > 0;
        
        if (isVisible && !visibleSections.includes(sectionId)) {
          setVisibleSections(prev => [...prev, sectionId]);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

  // Update the quote URL generation to use context
  const generateQuoteUrl = () => {
    let quoteUrl = `/quote?service=${encodeURIComponent(title)}&projectType=${projectType}`;
    if (propertyType) {
      quoteUrl += `&propertyType=${propertyType.id}`;
    } else if (buildingType) {
      quoteUrl += `&buildingType=${buildingType.id}`;
    }
    return quoteUrl;
  };

  // Update related services URL generation to use context
  const getRelatedServiceUrl = (servicePath: string) => {
    let serviceUrl = servicePath;
    if (propertyType) {
      serviceUrl = `${servicePath}?propertyType=${propertyType.id}`;
    } else if (buildingType) {
      serviceUrl = `${servicePath}?buildingType=${buildingType.id}`;
    } else if (projectType) {
      serviceUrl = `${servicePath}?projectType=${projectType}`;
    }
    return serviceUrl;
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Add schema markup for search engines */}
      <ServiceSchema 
        title={title} 
        description={description} 
        imageUrl={imageUrl} 
        slug={slug}
        category={category}
        features={features}
      />
      
      {/* Breadcrumb with subtle animation */}
      <div className={`bg-gray-100 py-4 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-900 transition-colors duration-200">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/services/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-900 transition-colors duration-200">{category}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-900 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-900 after:transition-all hover:after:w-full">{title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section with animations */}
      <div className="relative">
        <div className="h-[400px] lg:h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 animate-slow-zoom"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl animate-fade-in-up">
              {typeInfoToDisplay && (
                <div className="inline-block bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium mb-3 animate-fade-in-left">
                  For {typeInfoToDisplay}
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-left">{title}</h1>
              <p className="text-xl text-white max-w-2xl animate-fade-in-left animation-delay-200">{description}</p>
              <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
                <Link 
                  to={generateQuoteUrl()} 
                  className="inline-flex items-center px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group"
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center">Get a Quote <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-blue-900 font-medium rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg border-2 border-transparent hover:border-blue-200"
                >
                  <Phone className="w-4 h-4 mr-2 animate-pulse" /> Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-bounce">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => window.scrollTo({top: window.innerHeight - 50, behavior: 'smooth'})}>
            <span className="text-sm mb-2">Explore More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Features Section */}
            <div className="animate-on-scroll" id="features-section">
              <div className={`transition-all duration-1000 ${visibleSections.includes('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">What We Offer</h2>
                {features.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:translate-y-[-3px] group"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                          <Check className="w-5 h-5 text-blue-900" />
                        </div>
                        <p className="ml-4 text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 mb-12">
                    Contact us to learn more about our {title.toLowerCase()} services and how we can help with your project.
                  </p>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="animate-on-scroll" id="benefits-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 mt-12 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Benefits</h2>
                {benefits.length > 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 shadow-sm border border-gray-100 group hover:shadow-lg transition-all duration-500">
                    <ul className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <li 
                          key={index} 
                          className="flex items-center text-gray-700 transform transition-transform duration-300 hover:translate-x-2"
                          style={{animationDelay: `${index * 100}ms`}}
                        >
                          <div className="mr-2 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 transition-colors duration-300 group-hover:bg-blue-200">
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </div>
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-500">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500">
                    <p className="text-gray-700">
                      Our {title.toLowerCase()} services provide numerous benefits including quality craftsmanship, attention to detail, and customer satisfaction.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Our Process Section */}
            <div className="mt-16 animate-on-scroll" id="process-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('process-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Our Process</h2>
                {processSteps.length > 0 ? (
                  <div className="relative">
                    {/* Process Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 hidden md:block"></div>
                    
                    <div className="space-y-12">
                      {processSteps.map((step, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col md:flex-row"
                          style={{animationDelay: `${index * 200}ms`}}
                        >
                          <div className="md:w-32 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg z-10 transition-transform duration-300 hover:scale-110 shadow-md cursor-pointer">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all duration-300 transform hover:translate-y-[-2px]">
                            <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-900">{step.title}</h3>
                            <p className="text-gray-700">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {[
                      { 
                        title: "Initial Consultation", 
                        description: "We meet to understand your needs and project requirements."
                      },
                      { 
                        title: "Custom Proposal", 
                        description: "We provide a detailed quote tailored to your specific project."
                      },
                      { 
                        title: "Professional Execution", 
                        description: "Our team completes your project with expert craftsmanship."
                      },
                      { 
                        title: "Final Inspection", 
                        description: "We ensure everything meets our high standards and your satisfaction."
                      }
                    ].map((step, index) => (
                      <div 
                        key={index} 
                        className="flex"
                        style={{animationDelay: `${index * 200}ms`}}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg mr-6 transition-transform duration-300 hover:scale-110 shadow-md cursor-pointer">
                          {index + 1}
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex-grow hover:shadow-md hover:border-blue-300 transition-all duration-300 transform hover:translate-y-[-2px]">
                          <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-900">{step.title}</h3>
                          <p className="text-gray-700">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Gallery Section */}
            {galleryImages.length > 0 && (
              <div className="mt-16 animate-on-scroll" id="gallery-section">
                <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('gallery-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Project Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className="overflow-hidden rounded-lg shadow-md group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        style={{animationDelay: `${index * 100}ms`}}
                        onClick={() => window.open(imgUrl, '_blank')}
                      >
                        <div className="relative">
                          <img 
                            src={imgUrl}
                            alt={`${title} project gallery image ${index + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                              View Project
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Information section removed */}

            {/* FAQ Section */}
            <div className="mt-16 animate-on-scroll" id="faq-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {[
                    {
                      question: `How long does the ${title.toLowerCase()} process typically take?`,
                      answer: `The timeline for our ${title.toLowerCase()} services varies based on the scope and complexity of your project. During your consultation, we'll provide a specific timeline tailored to your needs.`
                    },
                    {
                      question: `What is the cost range for ${title.toLowerCase()}?`,
                      answer: `Pricing depends on several factors including materials, size, complexity, and finishes. We provide detailed, transparent quotes based on your specific requirements.`
                    },
                    {
                      question: `Do you offer warranties on your ${title.toLowerCase()} services?`,
                      answer: `Yes, we stand behind our work with comprehensive warranties. Our standard warranty covers workmanship and installation, while material warranties vary by manufacturer.`
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                      style={{animationDelay: `${index * 150}ms`}}
                    >
                      <h3 className="text-xl font-semibold mb-2 flex items-center transition-colors duration-300 group-hover:text-blue-900">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3 transition-colors duration-300 group-hover:bg-blue-700 group-hover:text-white">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        {faq.question}
                      </h3>
                      <div className="pl-11">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-8 space-y-8">
              {/* Quote CTA Box */}
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg p-8 mb-8 shadow-lg transform transition-transform duration-500 hover:scale-[1.02] animate-fade-in animation-delay-200">
                <h3 className="text-xl font-bold mb-4">Get a Free Quote</h3>
                <p className="mb-6">Ready to start your {title.toLowerCase()} project? Contact us for a free consultation and estimate.</p>
                
                {/* Generate quote URL with all relevant parameters */}
                {(() => {
                  let quoteUrl = generateQuoteUrl();
                  return (
                    <Link
                      to={quoteUrl}
                      className="block text-center bg-white text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group mb-4 transform hover:translate-y-[-2px] hover:shadow-md"
                    >
                      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-100 rounded-full group-hover:w-96 group-hover:h-96 opacity-30"></span>
                      <span className="relative flex items-center justify-center">
                        Request Quote
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                  );
                })()}

                <div className="text-center">
                  <p className="text-sm text-blue-100 mb-1">Or contact us directly:</p>
                  <a href="/contact" className="text-xl font-bold hover:text-blue-200 transition-colors duration-300 flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2 animate-pulse" />
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-300">
                <h3 className="text-xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start group transform transition-transform duration-300 hover:translate-x-1">
                    <Phone className="w-5 h-5 text-blue-900 mt-1 mr-3 transform transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href="/contact" className="text-blue-900 font-medium hover:text-blue-700 transition-colors duration-300">
                        Contact Us
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start group transform transition-transform duration-300 hover:translate-x-1">
                    <Mail className="w-5 h-5 text-blue-900 mt-1 mr-3 transform transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href="mailto:teamarxen@gmail.com" className="text-blue-900 font-medium hover:text-blue-700 transition-colors duration-300">
                        teamarxen@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-400">
                  <h3 className="text-xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Related Services</h3>
                  <ul className="space-y-4">
                    {relatedServices.map((service, index) => {
                      // Preserve property type or building type in related service links
                      let serviceUrl = getRelatedServiceUrl(service.path);
                      
                      return (
                        <li key={index} className="transform transition-transform duration-300 hover:translate-x-2">
                          <Link
                            to={serviceUrl}
                            className="flex items-center text-gray-700 hover:text-blue-900 transition-colors duration-300 group/link"
                          >
                            <ChevronRight className="w-5 h-5 mr-2 text-blue-900 transition-transform duration-300 group-hover/link:translate-x-1" />
                            <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0 group-hover/link:after:w-full after:transition-all after:duration-300">{service.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              {/* Brochure Download */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-500">
                <h3 className="text-xl font-bold mb-4 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Download Our Brochure</h3>
                <p className="text-gray-700 mb-6">Get more information about our services and process.</p>
                <a 
                  href="/brochures/arxen-service-brochure.pdf"
                  download
                  className="flex items-center justify-center bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 relative overflow-hidden group transform hover:translate-y-[-2px] hover:shadow-lg"
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center">
                    <Download className="w-4 h-4 mr-2" /> Service Brochure
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animations
const keyframes = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slow-zoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.5s ease forwards;
}

.animate-slow-zoom {
  animation: slow-zoom 30s ease-in-out alternate infinite;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-500 {
  animation-delay: 500ms;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = keyframes;
  document.head.appendChild(style);
}

export default ServiceTemplate; 