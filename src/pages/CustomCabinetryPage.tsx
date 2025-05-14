import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Phone, Mail, Clock, ShieldCheck, ArrowRight, Star, Ruler, Workflow, Hammer, Smartphone } from 'lucide-react';

const CustomCabinetryPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Breadcrumb with subtle animation */}
      <div className={`bg-gray-100 py-4 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-900 transition-colors duration-200">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/services/category/interior-services" className="hover:text-blue-900 transition-colors duration-200">Interior Services</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-900 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-900 after:transition-all hover:after:w-full">Custom Cabinetry</span>
          </div>
        </div>
      </div>

      {/* Hero Section with animations */}
      <div className="relative">
        <div className="h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 animate-slow-zoom"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556185781-a47769abb7ee?auto=format&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-left">Custom Cabinetry</h1>
              <p className="text-xl text-white max-w-2xl mb-8 animate-fade-in-left animation-delay-200">
                Expertly crafted cabinets tailored to your specific needs, style preferences, and space requirements.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
                <Link 
                  to="/quote?service=Custom%20Cabinetry" 
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction with fade-in animations */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll" id="intro-section">
          <div className={`transition-all duration-1000 ${visibleSections.includes('intro-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Transform Your Space with Custom Cabinetry</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Arxen Construction, we specialize in designing and crafting custom cabinetry that perfectly balances 
              functionality, aesthetics, and quality. Whether you're renovating your kitchen, bathroom, office, or any other space,
              our team of skilled craftsmen will create beautiful, durable cabinets that enhance your home and meet your unique needs.
            </p>
            <div className="flex justify-center items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="ml-2 text-gray-700">Trusted by over 500+ homeowners</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* What We Offer Section */}
            <div className="animate-on-scroll" id="services-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('services-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Our Custom Cabinetry Services</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {[
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Kitchen Cabinets",
                      description: "Fully customized kitchen cabinetry with premium materials and hardware."
                    },
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Bathroom Vanities",
                      description: "Custom bathroom vanities designed for style and functionality."
                    },
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Entertainment Centers",
                      description: "Beautiful entertainment units designed to house your media equipment."
                    },
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Home Office Cabinets",
                      description: "Functional and stylish solutions for your home office or workspace."
                    },
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Built-in Bookcases",
                      description: "Custom built-in bookcases and shelving units for any room."
                    },
                    {
                      icon: <Ruler className="w-6 h-6 text-blue-900" />,
                      title: "Closet Systems",
                      description: "Organization solutions with custom drawers, shelves, and hanging spaces."
                    }
                  ].map((service, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:translate-y-[-5px] group"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-blue-900">{service.title}</h3>
                      <p className="text-gray-700">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="animate-on-scroll" id="features-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Premium Features</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {[
                    "Made-to-measure design",
                    "Premium materials",
                    "Expert craftsmanship",
                    "Perfect fit guarantee",
                    "Extensive finish options",
                    "Hardware customization",
                    "Built-in organization systems"
                  ].map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300 transform hover:translate-x-1 border border-transparent hover:border-blue-200"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="mt-1 mr-4">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-gray-800">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="animate-on-scroll" id="gallery-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('gallery-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Our Work</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
                  {[
                    "https://images.unsplash.com/photo-1556185781-a47769abb7ee",
                    "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c",
                    "https://images.unsplash.com/photo-1556228720-195a672e8a03",
                    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
                    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4",
                    "https://images.unsplash.com/photo-1599619351208-3e6c839d6828"
                  ].map((imgUrl, index) => (
                    <div 
                      key={index} 
                      className="overflow-hidden rounded-lg shadow-md group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      style={{animationDelay: `${index * 100}ms`}}
                      onClick={() => window.open(imgUrl, '_blank')}
                    >
                      <div className="relative">
                        <img 
                          src={`${imgUrl}?auto=format&fit=crop&w=500&q=80`}
                          alt={`Custom cabinetry project ${index + 1}`}
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

            {/* Process Section */}
            <div className="animate-on-scroll" id="process-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('process-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Our Custom Cabinetry Process</h2>
                <div className="mb-16">
                  {/* Removed vertical timeline line */}
                  
                  {/* Changed to grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { 
                        icon: <Smartphone className="w-5 h-5 text-white" />,
                        title: "In-Home Consultation", 
                        description: "Our designer evaluates your space and discusses your style preferences, functional needs, and budget."
                      },
                      { 
                        icon: <Ruler className="w-5 h-5 text-white" />,
                        title: "Custom Design", 
                        description: "We create detailed 3D renderings and plans tailored to your specifications."
                      },
                      { 
                        icon: <Check className="w-5 h-5 text-white" />,
                        title: "Material Selection", 
                        description: "Choose from premium woods, finishes, hardware, and organizational features."
                      },
                      { 
                        icon: <Hammer className="w-5 h-5 text-white" />,
                        title: "Expert Fabrication", 
                        description: "Our skilled craftsmen build your custom cabinets with precision in our local workshop."
                      },
                      { 
                        icon: <Workflow className="w-5 h-5 text-white" />,
                        title: "Professional Installation", 
                        description: "Experienced installers ensure perfect fit and function in your space."
                      }
                    ].map((step, index) => (
                      // Removed outer flex div and icon offset div
                      <div 
                        key={index} 
                        // Added height class to ensure consistent card height
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 transform hover:translate-y-[-2px] flex flex-col h-full"
                        style={{animationDelay: `${index * 150}ms`}} // Adjusted delay for grid
                      >
                        {/* Integrated icon with title */}
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-lg z-10 shadow-md mr-4 flex-shrink-0">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-semibold transition-colors duration-300 hover:text-blue-900 flex-grow">{step.title}</h3>
                        </div>
                        {/* Description takes remaining space */}
                        <p className="text-gray-700 text-sm flex-grow">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="animate-on-scroll" id="benefits-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Benefits of Custom Cabinetry</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 shadow-sm border border-gray-200 mb-16 group hover:shadow-lg transition-all duration-500">
                  <ul className="space-y-4">
                    {[
                      "Maximizes your space efficiency",
                      "Increases home value",
                      "Custom solutions for unique spaces",
                      "Higher quality than mass-produced options",
                      "Perfect match to your design aesthetic"
                    ].map((benefit, index) => (
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
              </div>
            </div>

            {/* Testimonials */}
            <div className="animate-on-scroll" id="testimonials-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('testimonials-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">What Our Clients Say</h2>
                <div className="mb-16 space-y-6">
                  {[
                    {
                      name: "Jennifer B.",
                      location: "Atlanta, GA",
                      rating: 5,
                      text: "The custom kitchen cabinets that Arxen Construction created for us exceeded our expectations. The quality is outstanding, and they perfectly utilized our challenging space."
                    },
                    {
                      name: "Michael T.",
                      location: "Marietta, GA",
                      rating: 5,
                      text: "From design to installation, the team was professional and attentive to detail. Our new bathroom vanities look spectacular and have transformed our bathrooms."
                    }
                  ].map((testimonial, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-500 hover:border-blue-300 transform hover:scale-[1.01]"
                      style={{animationDelay: `${index * 150}ms`}}
                    >
                      <div className="flex items-center mb-4">
                        <div className="mr-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic relative pl-3 border-l-2 border-blue-300">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="animate-on-scroll" id="faq-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Frequently Asked Questions</h2>
                <div className="space-y-6 mb-16">
                  {[
                    {
                      question: "How long does the custom cabinetry process take?",
                      answer: "The timeline for custom cabinetry varies based on complexity and scope. Typically, from initial consultation to installation, the process takes 4-8 weeks. During your consultation, we'll provide a specific timeline tailored to your project."
                    },
                    {
                      question: "What materials do you use for custom cabinets?",
                      answer: "We offer a variety of premium materials including solid hardwoods (maple, oak, cherry, walnut), high-quality plywood, and environmentally friendly alternatives. We'll help you select the best materials based on your style preferences, usage needs, and budget."
                    },
                    {
                      question: "Do you provide a warranty on custom cabinetry?",
                      answer: "Yes, all our custom cabinetry comes with a comprehensive warranty. We offer a 5-year warranty on craftsmanship and installation, ensuring your satisfaction and peace of mind."
                    },
                    {
                      question: "Can you match existing cabinetry in my home?",
                      answer: "Absolutely. Our expert craftsmen can match existing styles, finishes, and details to create seamless additions to your current cabinetry. We take detailed measurements and color matches to ensure consistency."
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
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

            {/* Call to Action */}
            <div className="animate-on-scroll" id="cta-section">
              <div className={`transition-all duration-1000 delay-300 ${visibleSections.includes('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg p-8 text-center mb-16 shadow-lg transform transition-transform duration-500 hover:scale-[1.01]">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
                    <p className="text-xl mb-6">Contact us today for a free consultation and estimate on your custom cabinetry project.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link 
                        to="/quote?service=Custom%20Cabinetry" 
                        className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group"
                      >
                        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-100 rounded-full group-hover:w-56 group-hover:h-56 opacity-30"></span>
                        <span className="relative flex items-center">
                          Get a Free Quote
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Link>
                      <a 
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 border border-blue-400 hover:border-blue-300 text-white rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" /> Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Quote CTA Box */}
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg p-8 shadow-lg transform transition-transform duration-500 hover:scale-[1.02] animate-fade-in animation-delay-200">
                <h3 className="text-xl font-bold mb-4">Get a Free Quote</h3>
                <p className="mb-6">Ready to start your custom cabinetry project? Contact us for a free consultation and estimate.</p>
                <Link
                  to="/quote?service=Custom%20Cabinetry"
                  className="block text-center bg-white text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 relative overflow-hidden group mb-4 transform hover:translate-y-[-2px] hover:shadow-md"
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-100 rounded-full group-hover:w-96 group-hover:h-96 opacity-30"></span>
                  <span className="relative flex items-center justify-center">
                    Request Quote
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <div className="text-center">
                  <p className="text-sm text-blue-100 mb-1">Or call us directly:</p>
                  <a href="/contact" className="text-xl font-bold hover:text-blue-200 transition-colors duration-300 flex items-center justify-center">
                    <Phone className="w-5 h-5 mr-2 animate-pulse" />
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-300">
                <h3 className="text-xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Why Choose Us</h3>
                <ul className="space-y-4">
                  {[
                    {
                      icon: <ShieldCheck className="w-5 h-5 text-blue-900" />,
                      title: "Quality Craftsmanship",
                      description: "Expertly built cabinetry with attention to detail."
                    },
                    {
                      icon: <Ruler className="w-5 h-5 text-blue-900" />,
                      title: "Custom Designs",
                      description: "Tailored solutions for your unique space and style."
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-blue-900" />,
                      title: "Timely Completion",
                      description: "Projects delivered on schedule with clear timelines."
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex group/item transform transition-transform duration-300 hover:translate-x-1">
                      <div className="mr-3 mt-1 transform transition-transform duration-300 group-hover/item:scale-110">{item.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 transition-colors duration-300 group-hover/item:text-blue-900">{item.title}</h4>
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-400">
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
                  <div className="flex items-start group transform transition-transform duration-300 hover:translate-x-1">
                    <Clock className="w-5 h-5 text-blue-900 mt-1 mr-3 transform transition-transform duration-300 group-hover:scale-110" />
                    <div>
                      <p className="text-sm text-gray-600">Business Hours</p>
                      <p className="text-gray-900">Mon-Fri: 8am-6pm</p>
                      <p className="text-gray-900">Sat-Sun: 8am-6pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Services */}
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 animate-fade-in animation-delay-500">
                <h3 className="text-xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Related Services</h3>
                <ul className="space-y-4">
                  {[
                    { title: "Kitchen Remodeling", path: "/services/kitchen-remodeling" },
                    { title: "Bathroom Remodeling", path: "/services/bathroom-remodeling" },
                    { title: "Interior Painting", path: "/services/interior-painting" },
                    { title: "Crown Molding", path: "/services/crown-molding" }
                  ].map((service, index) => (
                    <li key={index} className="transform transition-transform duration-300 hover:translate-x-2">
                      <Link
                        to={service.path}
                        className="flex items-center text-gray-700 hover:text-blue-900 transition-colors duration-300 group/link"
                      >
                        <ChevronRight className="w-5 h-5 mr-2 text-blue-900 transition-transform duration-300 group-hover/link:translate-x-1" />
                        <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-blue-500 after:bottom-0 after:left-0 group-hover/link:after:w-full after:transition-all after:duration-300">{service.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
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

export default CustomCabinetryPage; 