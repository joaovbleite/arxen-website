import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ArrowRight, Check, Phone, Mail, Star, ShieldCheck, Clock, Ruler, Smartphone, ArrowDown } from 'lucide-react';

const FlooringServicesPage: React.FC = () => {
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("Wood Flooring");
  const [scrolled, setScrolled] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<string[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertyType = searchParams.get('propertyType');
  const buildingType = searchParams.get('buildingType');
  const projectType = searchParams.get('projectType') || 'residential';

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // For navbar transparency effect
      setScrolled(window.scrollY > 100);
      
      // For scroll animations
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementId = element.getAttribute('id');
        if (!elementId) return;
        
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = elementTop < window.innerHeight - 100 && elementBottom > 0;
        
        if (isVisible && !animatedElements.includes(elementId)) {
          setAnimatedElements(prev => [...prev, elementId]);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatedElements]);

  // Function to generate quote URL with context parameters
  const getQuoteUrl = (baseUrl: string) => {
    let url = baseUrl;
    if (propertyType) {
      url += `&propertyType=${propertyType}`;
    } else if (buildingType) {
      url += `&buildingType=${buildingType}`;
    }
    if (projectType && !url.includes('projectType=')) {
      url += `&projectType=${projectType}`;
    }
    return url;
  };

  const flooringTypes = [
    {
      title: "Hardwood",
      description: "Premium solid wood flooring that adds warmth and value to any home.",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd",
      path: "/services/hardwood",
      features: ["Timeless beauty", "Increases home value", "Can be refinished multiple times"]
    },
    {
      title: "Engineered Hardwood",
      description: "The beauty of real wood with enhanced stability and moisture resistance.",
      image: "https://images.unsplash.com/photo-1581112277189-22fb89218235",
      path: "/services/engineered-hardwood",
      features: ["Suitable for below-grade installations", "More stable than solid hardwood", "Real wood appearance"]
    },
    {
      title: "Luxury Vinyl",
      description: "Waterproof, durable flooring with authentic wood and stone looks.",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d",
      path: "/services/luxury-vinyl",
      features: ["100% waterproof options", "Scratch and dent resistant", "Comfortable underfoot"]
    },
    {
      title: "Laminate Flooring",
      description: "Affordable, durable flooring that resists scratches, dents, and stains.",
      image: "https://images.unsplash.com/photo-1617577361378-7db7facace53",
      path: "/services/laminate",
      features: ["Cost-effective", "Highly durable", "Easy maintenance"]
    },
    {
      title: "Tile Installation",
      description: "Versatile, durable tile flooring for kitchens, bathrooms, and beyond.",
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      path: "/services/tile",
      features: ["Water resistant", "Variety of designs", "Long-lasting durability"]
    },
    {
      title: "Stone Flooring",
      description: "Elegant natural stone flooring with unmatched beauty and durability.",
      image: "https://images.unsplash.com/photo-1600566752826-682ee8fb9014",
      path: "/services/stone-flooring",
      features: ["Natural beauty", "One-of-a-kind patterns", "Increases property value"]
    },
    {
      title: "Carpet Installation",
      description: "Soft, comfortable carpet in countless styles, colors, and textures.",
      image: "https://images.unsplash.com/photo-1558317374-067fb5f30001",
      path: "/services/carpet",
      features: ["Comfortable underfoot", "Sound absorption", "Insulating properties"]
    }
  ];

  const specialtyFlooringServices = [
    {
      title: "Radiant Floor Heating",
      description: "Integrate comfortable heating systems beneath your new floors."
    },
    {
      title: "Concrete Floor Finishing",
      description: "Polished, stained, or epoxy-coated concrete flooring solutions."
    },
    {
      title: "Commercial Flooring",
      description: "Durable, low-maintenance flooring solutions for business environments."
    },
    {
      title: "Floor Restoration",
      description: "Refinishing and restoration services for existing wood and stone floors."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Atlanta, GA",
      text: "The hardwood flooring Arxen installed transformed our living room. The quality of work and attention to detail exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Marietta, GA",
      text: "We had luxury vinyl installed throughout our main floor and couldn't be happier. It's beautiful, waterproof, and has stood up to our kids and pets.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Breadcrumb with subtle animation */}
      <div className={`bg-gray-100 py-4 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-900 transition-colors duration-200">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-900 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-900 after:transition-all hover:after:w-full">Flooring Services</span>
          </div>
        </div>
      </div>

      {/* Hero Section with enhanced animations */}
      <div className="relative">
        <div className="h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 animate-slow-zoom"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-left">Professional Flooring Services</h1>
              <p className="text-xl text-white max-w-2xl mb-8 animate-fade-in-left animation-delay-200">
                From hardwood to luxury vinyl, carpet to natural stone, we offer premium flooring solutions for every room in your home.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
                <Link 
                  to={getQuoteUrl("/quote?service=Flooring")} 
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
            <ArrowDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Introduction with fade-in animations */}
      <div className="bg-white py-16" id="intro-section">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll" id="intro-text">
            <div className={`transition-all duration-1000 ${animatedElements.includes('intro-text') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Expert Flooring Installation & Services</h2>
              <p className="text-lg text-gray-700 mb-8">
                At Arxen Construction, we specialize in premium flooring solutions for residential and commercial properties. With decades of experience, our professional installers deliver exceptional results that enhance the beauty, value, and functionality of your space.
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

          {/* Enhanced Tools & Resources Menu with hover animations */}
          <div className="mb-12 animate-on-scroll" id="tools-section">
            <div className={`transition-all duration-1000 delay-300 ${animatedElements.includes('tools-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Tools & Resources</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-blue-700">
                      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                    </svg>,
                    title: "Compare Flooring",
                    description: "Side-by-side comparison of flooring options",
                    link: "/flooring/compare",
                    linkText: "Compare Now"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-blue-700">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>,
                    title: "Floor Finder",
                    description: "Find your perfect flooring match",
                    link: "/flooring/finder",
                    linkText: "Take Quiz"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-blue-700">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>,
                    title: "Design Gallery",
                    description: "Get inspired with real projects",
                    link: "/flooring/gallery",
                    linkText: "View Designs"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-blue-700">
                      <path d="M21 10H3M21 6H3M21 14H3M21 18H3"></path>
                    </svg>,
                    title: "Maintenance Guides",
                    description: "How to care for your floors",
                    link: "/flooring/care",
                    linkText: "Read Guides"
                  }
                ].map((tool, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:border-blue-300 hover:shadow-md transition-all duration-300 group hover:translate-y-[-5px]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-blue-50 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                      {tool.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-900">{tool.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    <Link 
                      to={tool.link} 
                      className="text-blue-700 text-sm font-medium hover:text-blue-900 inline-flex items-center relative overflow-hidden group-hover:font-bold"
                    >
                      <span className="relative z-10 flex items-center">
                        {tool.linkText} <ArrowRight className="w-3 h-3 ml-1 transition-all duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flooring Applications Menu with enhanced visuals */}
          <div className="mb-12 animate-on-scroll" id="room-section">
            <div className={`transition-all duration-1000 delay-300 ${animatedElements.includes('room-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Explore By Room</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f" },
                  { name: "Bathroom", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14" },
                  { name: "Living Room", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d" },
                  { name: "Bedroom", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af" },
                  { name: "Basement", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a" }
                ].map((room, index) => (
                  <Link 
                    key={index}
                    to={`/flooring/room/${room.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="relative group overflow-hidden rounded-lg h-32 transform transition-all duration-500 hover:shadow-xl hover:scale-105 shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img 
                      src={`${room.image}?auto=format&fit=crop&w=300&h=150&q=80`}
                      alt={`${room.name} Flooring`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg relative z-10 transition-all duration-300 group-hover:scale-110 transform group-hover:translate-y-[-3px]">
                        {room.name}
                        <span className="block h-0.5 w-0 bg-white mx-auto transition-all duration-300 group-hover:w-full mt-1"></span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Filter Bar with pill button animations */}
          <div className="mb-12 animate-on-scroll" id="filter-section">
            <div className={`transition-all duration-1000 delay-300 ${animatedElements.includes('filter-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-4 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Popular Features</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Waterproof", "Pet-Friendly", "Eco-Friendly", "Radiant Heat Compatible", 
                  "Low Maintenance", "Slip-Resistant", "Budget-Friendly", "High-Traffic Areas"
                ].map((tag, index) => (
                  <Link 
                    key={index} 
                    to={`/flooring/feature/${tag.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="px-4 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* New Service Selection System with tab animations */}
          <div className="mb-16 animate-on-scroll" id="options-section">
            <div className={`transition-all duration-1000 delay-300 ${animatedElements.includes('options-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl font-bold text-center mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">Explore Our Flooring Options</h2>
              
              {/* Enhanced Category Quick Navigation */}
              <div className="flex justify-center flex-wrap gap-4 mb-12">
                {["Wood Flooring", "Tile & Stone", "Resilient Flooring", "Carpet & Soft Surfaces"].map((category, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveTab(category)} 
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 relative ${
                      activeTab === category 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-900 shadow-sm'
                    }`}
                  >
                    {category}
                    {activeTab === category && (
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45 mt-[-4px]"></span>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Wood Flooring Section with conditional rendering and animations */}
              {activeTab === "Wood Flooring" && (
                <div id="wood-flooring" className="transition-all duration-500 animate-fade-in">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Wood Flooring</h3>
                    <div className="ml-4 flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-gray-200 rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {flooringTypes.filter(f => ['Hardwood', 'Engineered Hardwood'].includes(f.title)).map((flooringType, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-blue-300 group"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={flooringType.image}
                              alt={flooringType.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="md:w-3/5 p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{flooringType.title}</h3>
                            <p className="text-gray-700 mb-4 text-sm">{flooringType.description}</p>
                            <div className="mt-auto">
                              <Link 
                                to={flooringType.path}
                                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group/link"
                              >
                                <span className="relative">
                                  Learn More 
                                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"></span>
                                </span>
                                <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tile & Stone Section with conditional rendering */}
              {activeTab === "Tile & Stone" && (
                <div id="tile-&-stone" className="transition-all duration-500 animate-fade-in">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Tile & Stone</h3>
                    <div className="ml-4 flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-gray-200 rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {flooringTypes.filter(f => ['Tile Installation', 'Stone Flooring'].includes(f.title)).map((flooringType, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-blue-300 group"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={flooringType.image}
                              alt={flooringType.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="md:w-3/5 p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{flooringType.title}</h3>
                            <p className="text-gray-700 mb-4 text-sm">{flooringType.description}</p>
                            <div className="mt-auto">
                              <Link 
                                to={flooringType.path}
                                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group/link"
                              >
                                <span className="relative">
                                  Learn More 
                                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"></span>
                                </span>
                                <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Resilient Flooring Section with conditional rendering */}
              {activeTab === "Resilient Flooring" && (
                <div id="resilient-flooring" className="transition-all duration-500 animate-fade-in">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Resilient Flooring</h3>
                    <div className="ml-4 flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-gray-200 rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {flooringTypes.filter(f => ['Luxury Vinyl', 'Laminate Flooring'].includes(f.title)).map((flooringType, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-blue-300 group"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={flooringType.image}
                              alt={flooringType.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="md:w-3/5 p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{flooringType.title}</h3>
                            <p className="text-gray-700 mb-4 text-sm">{flooringType.description}</p>
                            <div className="mt-auto">
                              <Link 
                                to={flooringType.path}
                                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group/link"
                              >
                                <span className="relative">
                                  Learn More 
                                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"></span>
                                </span>
                                <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Carpet & Soft Surfaces Section with conditional rendering */}
              {activeTab === "Carpet & Soft Surfaces" && (
                <div id="carpet-&-soft-surfaces" className="transition-all duration-500 animate-fade-in">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Carpet & Soft Surfaces</h3>
                    <div className="ml-4 flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-gray-200 rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {flooringTypes.filter(f => ['Carpet Installation'].includes(f.title)).map((flooringType, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-blue-300 group"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                            <img 
                              src={flooringType.image}
                              alt={flooringType.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="md:w-3/5 p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{flooringType.title}</h3>
                            <p className="text-gray-700 mb-4 text-sm">{flooringType.description}</p>
                            <div className="mt-auto">
                              <Link 
                                to={flooringType.path}
                                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group/link"
                              >
                                <span className="relative">
                                  Learn More 
                                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"></span>
                                </span>
                                <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* View All Services Button with enhanced styling */}
              <div className="text-center mt-12">
                <button 
                  onClick={() => setShowAllOptions(!showAllOptions)}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center">
                    {showAllOptions ? 'Hide All Options' : 'View All Flooring Options'} 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Complete Grid of All Options (for View All button) */}
          {showAllOptions && (
            <div id="all-flooring-options" className="mt-16 animate-fade-in">
              <h2 className="text-3xl font-bold text-center mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">All Flooring Options</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {flooringTypes.map((flooringType, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:border-blue-300 hover:translate-y-[-5px]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={flooringType.image}
                        alt={flooringType.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">{flooringType.title}</h3>
                      <p className="text-gray-700 mb-4">{flooringType.description}</p>
                      <ul className="mb-6 space-y-2">
                        {flooringType.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link 
                        to={flooringType.path}
                        className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium group/link"
                      >
                        <span className="relative">
                          Learn More 
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"></span>
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Flooring Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-12 h-12 text-blue-900" />,
                title: "Quality Materials",
                description: "We source premium materials from trusted manufacturers, ensuring lasting beauty and durability."
              },
              {
                icon: <Ruler className="w-12 h-12 text-blue-900" />,
                title: "Expert Installation",
                description: "Our experienced craftsmen deliver precise installation with meticulous attention to detail."
              },
              {
                icon: <Clock className="w-12 h-12 text-blue-900" />,
                title: "On-Time Completion",
                description: "We respect your time and deliver projects within the agreed-upon schedule."
              },
              {
                icon: <Smartphone className="w-12 h-12 text-blue-900" />,
                title: "Free Consultation",
                description: "Professional guidance to help you select the perfect flooring for your specific needs."
              },
              {
                icon: <Check className="w-12 h-12 text-blue-900" />,
                title: "Comprehensive Warranty",
                description: "All our flooring installations are backed by solid manufacturer and labor warranties."
              },
              {
                icon: <Star className="w-12 h-12 text-blue-900" />,
                title: "5-Star Service",
                description: "We're committed to delivering an exceptional customer experience from start to finish."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-700 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialty Flooring Services */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Specialty Flooring Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtyFlooringServices.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link 
              to={getQuoteUrl("/quote?service=Specialty%20Flooring")} 
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Request a Consultation <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Our Process */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Flooring Installation Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Process Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-600 hidden md:block"></div>
              
              <div className="space-y-12">
                {[
                  { 
                    title: "Initial Consultation", 
                    description: "We discuss your flooring needs, preferences, budget, and timeline. Our experts will help you select the perfect flooring solution for your space."
                  },
                  { 
                    title: "Professional Measurement", 
                    description: "We take precise measurements of your space to calculate exact material requirements and provide an accurate quote."
                  },
                  { 
                    title: "Customized Proposal", 
                    description: "You'll receive a detailed proposal with material costs, labor, timeline, and all aspects of your flooring project."
                  },
                  { 
                    title: "Material Delivery & Acclimation", 
                    description: "Your flooring materials are delivered and acclimated to your home's environment before installation begins."
                  },
                  { 
                    title: "Expert Installation", 
                    description: "Our skilled craftsmen install your new flooring with precision and attention to detail, ensuring a perfect finish."
                  },
                  { 
                    title: "Final Inspection", 
                    description: "We conduct a thorough inspection to ensure every aspect of your new flooring meets our high standards and your expectations."
                  }
                ].map((step, index) => (
                  <div key={index} className="flex flex-col md:flex-row">
                    <div className="md:w-32 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600 bg-white text-blue-900 flex items-center justify-center font-bold text-lg z-10">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold">
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
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Floors?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and estimate on your flooring project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={getQuoteUrl("/quote?service=Flooring")} 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
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

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How do I choose the right flooring for my home?",
                answer: "Consider factors like your lifestyle, room function, maintenance preferences, budget, and aesthetic goals. Our design consultants can help you evaluate options based on durability, water resistance, comfort, and style to find the perfect match for your needs."
              },
              {
                question: "How long will my flooring installation take?",
                answer: "Installation timelines vary based on the flooring type and project scope. A standard room typically takes 1-2 days, while whole-home installations may take 3-5 days. We'll provide a specific timeline during your consultation."
              },
              {
                question: "Do I need to move my furniture before installation?",
                answer: "Yes, the installation area should be clear of furniture and appliances. We can help coordinate furniture moving services if needed, which we'll discuss during your consultation."
              },
              {
                question: "Can flooring be installed over existing floors?",
                answer: "In many cases, yes. However, this depends on the condition of your existing floor and the type of new flooring you've selected. Our team will assess your specific situation during the in-home consultation."
              },
              {
                question: "Do you offer warranties on your flooring products and installation?",
                answer: "Absolutely. All our flooring products come with manufacturer warranties, and we provide a labor warranty on our installation. Warranty details vary by product type and will be clearly outlined in your proposal."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Areas Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Areas We Serve</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">Atlanta Metro</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-700">Atlanta</li>
                    <li className="text-gray-700">Decatur</li>
                    <li className="text-gray-700">Sandy Springs</li>
                    <li className="text-gray-700">Dunwoody</li>
                    <li className="text-gray-700">Brookhaven</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">North Metro</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-700">Marietta</li>
                    <li className="text-gray-700">Roswell</li>
                    <li className="text-gray-700">Alpharetta</li>
                    <li className="text-gray-700">Johns Creek</li>
                    <li className="text-gray-700">Kennesaw</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">South & East Metro</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-700">McDonough</li>
                    <li className="text-gray-700">Stockbridge</li>
                    <li className="text-gray-700">Conyers</li>
                    <li className="text-gray-700">Covington</li>
                    <li className="text-gray-700">Snellville</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-700 mb-4">Not sure if we service your area? Give us a call to find out!</p>
                <a 
                  href="/contact"
                  className="inline-flex items-center px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" /> Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Options Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Flexible Financing Options</h2>
          <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">We Make Flooring Affordable</h3>
                <p className="text-gray-700 mb-4">
                  Transform your home with beautiful new flooring without straining your budget. Our flexible financing options make it easy to get the floors you want now and pay over time.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">No interest options available</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Low monthly payments</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Quick application process</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Decisions within minutes</span>
                  </li>
                </ul>
                <Link 
                  to="/financing" 
                  className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium"
                >
                  Learn More About Financing <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Current Special Offer</h3>
                <div className="bg-blue-900 text-white p-4 rounded-lg mb-4 text-center">
                  <p className="text-lg font-bold">12 MONTHS</p>
                  <p className="text-2xl font-bold mb-2">NO INTEREST</p>
                  <p className="text-sm">On purchases over $1,500</p>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  *Subject to credit approval. Limited time offer.
                </p>
                <Link 
                  to={getQuoteUrl("/quote?service=Flooring&offer=12MONTHS")} 
                  className="block text-center bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Trusted & Certified Professional</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-900">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium">Licensed & Insured</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-900">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium">5-Star Rated</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-900">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium">Customer Satisfaction Guarantee</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-900">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <p className="text-sm font-medium">20+ Years in Business</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-blue-900">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-sm font-medium">NWFA Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-blue-900 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href="/contact" className="text-blue-900 font-medium hover:text-blue-700">
                        Contact Us
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-900 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href="mailto:teamarxen@gmail.com" className="text-blue-900 font-medium hover:text-blue-700">
                        teamarxen@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-900 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Business Hours</p>
                      <p className="text-gray-900">Mon-Fri: 8am-6pm</p>
                      <p className="text-gray-900">Sat-Sun: 8am-6pm</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Request Information</h3>
                <p className="text-gray-700 mb-6">
                  Fill out our form online or call us to schedule a free in-home consultation and estimate.
                </p>
                <Link 
                  to={getQuoteUrl("/quote?service=Flooring")} 
                  className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Complete Our Form <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlooringServicesPage; 