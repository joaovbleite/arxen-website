import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Updated icons for header and sidebar
import { Hammer, ArrowRight, CheckCircle, Home, PaintBucket, Grid, Star, Zap, ShieldCheck, Tag, Clock, Phone, Award, List, ListMinus, Building, Building2, Users, CarFront, Warehouse as ShedIcon, User, MessageCircle, Mail, MapPin } from 'lucide-react'; 
import ServiceListModal from '../components/ServiceListModal'; // Import the modal
import TestimonialSlider from '../components/TestimonialSlider';
import { getShuffledTestimonials } from '../data/testimonials';
import { usePropertyType } from '../components/PropertyTypeContext';

// Import FormData type - Removed as it's not used directly here
// import { FormData } from './FreeEstimate/FreeEstimate'; 

// Add LucideIcon type for better typing
import { LucideIcon } from 'lucide-react';

// Add Service interface definition
interface Service {
  title: string;
  path: string;
  description: string;
  icon?: React.ReactNode;
}

// Add interface for category structure used in residentialServices
interface ServiceCategory {
  category: string;
  icon: React.ReactNode;
  services: Service[];
}

// Add interface for Residential Property Type
interface PropertyType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Enhance icon typing
interface IconProps {
  size?: number | string;
  className?: string;
  [key: string]: any;
}

// This page now primarily renders the ServiceSelection component for residential
const Residential: React.FC = () => {
  // Local state to manage service selections on this standalone page - REMOVED
  // const [localFormData, setLocalFormData] = useState<Partial<FormData>>({
  //   services: [],
  //   projectType: 'residential' // Default to residential
  // });

  // Function to update local state when services are selected in the component - REMOVED
  // const updateLocalFormData = (data: Partial<FormData>) => {
  //   setLocalFormData(prev => ({ ...prev, ...data }));
  // };

  // Use ServiceCategory for the data array
  const residentialServices: ServiceCategory[] = [
    {
      category: "Remodeling",
      icon: <Hammer className="w-6 h-6 text-blue-700" />,
      services: [
        { title: "Kitchen Remodeling", path: "/services/kitchen-remodeling", description: "Complete kitchen transformations" },
        { title: "Bathroom Remodeling", path: "/services/bathroom-remodeling", description: "Modern bathroom renovations" },
        { title: "Basement Finishing", path: "/services/basement-finishing", description: "Custom basement spaces" },
        { title: "Room Additions", path: "/services/room-additions", description: "Expand your living space" },
        { title: "Placeholder Service 5", path: "/services/placeholder", description: "Demonstrates the View All button." }
      ]
    },
    {
      category: "Interior Services",
      icon: <PaintBucket className="w-6 h-6 text-blue-700" />,
      services: [
        { title: "Interior Painting", path: "/services/interior-painting", description: "Professional painting services" },
        { title: "Drywall Installation", path: "/services/drywall", description: "Expert drywall solutions" },
        { title: "Custom Cabinetry", path: "/services/custom-cabinetry", description: "Built to order cabinets" },
        { title: "Crown Molding", path: "/services/crown-molding", description: "Elegant finishing touches" }
      ]
    },
    {
      category: "Flooring",
      icon: <Grid className="w-6 h-6 text-blue-700" />,
      services: [
        { title: "Hardwood", path: "/services/hardwood", description: "Premium wood flooring" },
        { title: "Tile Installation", path: "/services/tile", description: "Custom tile solutions" },
        { title: "Luxury Vinyl", path: "/services/luxury-vinyl", description: "Modern vinyl options" },
        { title: "Carpet Installation", path: "/services/carpet", description: "Quality carpet services" }
      ]
    },
    // Add other categories as needed...
  ];

  // Get residential testimonials from the centralized manager and memoize to prevent re-renders
  const residentialTestimonials = useMemo(() => getShuffledTestimonials(), []);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; services: Service[]; icon?: React.ReactNode }>({ title: '', services: [], icon: undefined });
  // Restore state for expanded categories (even if not visually used for expansion now)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({}); 

  // Use the property type context instead of local state
  const { propertyType, setPropertyType } = usePropertyType();

  // Function to open modal - Expect ServiceCategory type
  const openServiceModal = (category: ServiceCategory) => {
    setModalContent({ title: category.category, services: category.services, icon: category.icon });
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeServiceModal = () => {
    setIsModalOpen(false);
  };

  // NEW Residential Property Types Data
  const residentialPropertyTypes: PropertyType[] = [
    { id: 'single-family', name: 'Single-Family Home', icon: <Home size={24} /> },
    { id: 'townhouse', name: 'Townhouse', icon: <Building size={24} /> }, // Using Building as proxy
    { id: 'condo-apt', name: 'Condo / Apartment', icon: <Building2 size={24} /> }, // Using Building2 as proxy
    { id: 'multi-family', name: 'Multi-Family Home', icon: <Users size={24} /> }, // Using Users as proxy
    { id: 'garage', name: 'Garage', icon: <CarFront size={24} /> },
    { id: 'shed-barn', name: 'Shed / Barn', icon: <ShedIcon size={24} /> }, // Using Warehouse icon renamed
  ];

  // Update the property type handler to use the context
  const handlePropertyTypeSelect = (propertyTypeId: string) => {
    // Toggle selection (unselect if already selected)
    if (propertyType && propertyType.id === propertyTypeId) {
      setPropertyType(null);
    } else {
      setPropertyType({
        id: propertyTypeId,
        name: residentialPropertyTypes.find(type => type.id === propertyTypeId)?.name || propertyTypeId
      });
    }
  };

  // Modify getServiceUrl to use context
  const getServiceUrl = (path: string) => {
    if (propertyType) {
      return `${path}?propertyType=${propertyType.id}`;
    }
    return path;
  };

  // Render a single service box
  const renderServiceBox = (service: Service, category: ServiceCategory) => (
    <Link 
      to={getServiceUrl(service.path)}
      key={service.title} 
      className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 h-full bg-white border-gray-200 hover:border-blue-500 hover:shadow-md group`}
    >
      <div className="mr-4 flex-shrink-0 text-blue-600">
        {React.cloneElement(category.icon as React.ReactElement<IconProps>, { className: "w-6 h-6" })}
      </div>
      <div className="flex-grow">
        <h3 className="font-medium mb-1 text-gray-800 group-hover:text-blue-800 transition-colors">{service.title}</h3>
        <p className="text-gray-500 text-xs">{service.description}</p>
      </div>
      <div className="ml-2 text-gray-400 group-hover:text-blue-700 transition-colors transform group-hover:translate-x-1 duration-300">
        <ArrowRight size={16} />
      </div>
    </Link>
  );

  return (
    <div className="bg-white">
      {/* --- REPLACED HEADER --- */}
      {/* Enhanced Residential Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Background pattern overlay - Lighter blues */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400 rounded-full filter blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 rounded-full filter blur-3xl -ml-20 -mb-20"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block py-1 px-3 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-2">
                YOUR TRUSTED HOME PARTNER
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Transform Your Home
              </h1>
              <p className="text-xl text-white max-w-xl leading-relaxed">
                Expert residential remodeling and construction services designed to bring your dream home vision to life with quality and care.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  to="/free-estimate?projectType=residential" 
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-blue-50 text-blue-800 font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
                  >
                  Get Your Free Estimate
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a 
                  href="tel:404-934-9458" 
                  className="inline-flex items-center px-6 py-3 border border-blue-300 hover:border-white hover:bg-white/10 text-white rounded-lg transition-colors"
                  >
                  <Phone className="mr-2 w-5 h-5" />
                  Call Us
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                {/* Decorative shapes with lighter blue tones */}
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-sky-500 bg-opacity-10 rounded-lg transform rotate-12"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-cyan-500 bg-opacity-10 rounded-lg transform -rotate-12"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop" // Residential image
                  alt="Beautiful modern home interior"
                  className="w-full h-80 object-cover rounded-lg shadow-2xl border-4 border-white/20 relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Key benefits row - Residential Focused */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-blue-500/30">
            {[
              {icon: <Home className="w-6 h-6 text-blue-300" />, text: "Personalized Designs"},
              {icon: <Award className="w-6 h-6 text-blue-300" />, text: "Quality Craftsmanship"},
              {icon: <ShieldCheck className="w-6 h-6 text-blue-300" />, text: "Stress-Free Process"},
              {icon: <CheckCircle className="w-6 h-6 text-blue-300" />, text: "Increased Home Value"}
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-3">{benefit.icon}</div>
                <p className="text-sm font-medium text-white">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* --- END REPLACED HEADER --- */}

      {/* Property Type Selection */}
      <div className="container mx-auto px-4 pt-10 pb-8 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">What type of property is this for?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 justify-center">
          {residentialPropertyTypes.map((type) => {
            const isSelected = propertyType && propertyType.id === type.id;
            return (
              <div
                key={type.id}
                onClick={() => handlePropertyTypeSelect(type.id)}
                className={`group flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 min-h-[100px] justify-center ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
              >
                <div className={`mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'} transition-colors`}>
                  {type.icon}
                </div>
                <h3 className={`text-xs font-medium text-center ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                  {type.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
      {/* --- END NEW SECTION --- */}

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* Main Service Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {residentialServices.map((category: ServiceCategory, index: number) => {
              const servicesToShow = category.services.slice(0, 4);

              return (
                <div key={index} className="border-b border-gray-200 pb-8 mb-8">
                  {/* Category Header with View All Button - Re-verified */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Left Side: Icon and Title */}
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3"> 
                         {React.cloneElement(category.icon as React.ReactElement<IconProps>, { className: "w-5 h-5 text-blue-700" })} 
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
                    </div>
                    {/* Right Side: View All Button - Rendered Unconditionally */}
                    <button 
                      onClick={() => openServiceModal(category)} 
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0 ml-4" // Added ml-4 for spacing
                      // Ensure this button is definitely here
                    >
                      View All Services
                      <List size={16} className="ml-1.5"/> 
                    </button>
                  </div>
                  
                  {/* Always show first 4 */}
                  <div key={category.category + '-grid'} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-fast">
                    {servicesToShow.map((service: Service, serviceIndex: number) => (
                      renderServiceBox(service, category)
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Note about custom services - Still relevant */}
            <div className="mt-8 text-center text-gray-600 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
              Don't see exactly what you need? <Link to="/free-estimate?projectType=residential" className="text-blue-600 hover:underline font-medium">Request a free estimate</Link> and describe your project in the details section. We handle many custom requests!
            </div>

          </div>

          {/* Sidebar */} 
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 mt-12 lg:mt-0">
             {/* Why Choose Us Box */}
             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-4 text-gray-800">Why Choose Arxen?</h3>
               <ul className="space-y-3">
                 {[ 
                   { text: "Quality Craftsmanship", icon: <Zap size={18} className="text-blue-600"/> },
                   { text: "Transparent Pricing", icon: <Tag size={18} className="text-blue-600"/> },
                   { text: "On-Time Completion", icon: <Clock size={18} className="text-blue-600"/> },
                   { text: "Licensed & Insured", icon: <ShieldCheck size={18} className="text-blue-600"/> },
                   { text: "Excellent Communication", icon: <Phone size={18} className="text-blue-600"/> }
                 ].map((item, idx) => (
                   <li key={idx} className="flex items-center text-gray-700"><span className="mr-3 flex-shrink-0">{item.icon}</span><span>{item.text}</span></li>
                 ))}
               </ul>
             </div>
             {/* Special Offer Box */}
             <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-3 text-orange-800">Special Offer!</h3>
               <p className="text-sm text-gray-700 mb-4">Mention code <code className="font-mono bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded">ARX25</code> during your consultation to get <strong className="text-orange-700">10% OFF</strong> labor costs on your first project!</p>
               <Link to="/free-estimate?projectType=residential&promo=ARX25" className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors transform hover:scale-105 shadow">Claim Your Discount Now</Link>
             </div>
             {/* Get a Quick Quote Box */}
             <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-3 text-blue-800">Get a Quick Quote</h3>
               <p className="text-sm text-gray-700 mb-4">Have a specific service in mind? Get a free estimate quickly through our online form.</p>
               <Link to="/free-estimate?projectType=residential" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow">Request Free Estimate</Link>
             </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Why Choose Us / Commitment Section --- */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Your Home Transformation Partner</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">We're committed to making your home renovation experience smooth, transparent, and rewarding.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Personalized Approach */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <User className="w-8 h-8 text-blue-600" /> {/* Added User icon */}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Approach</h3>
              <p className="text-sm text-gray-600">We listen to your needs and tailor every project to your specific vision, lifestyle, and budget.</p>
            </div>
            {/* Feature 2: Quality & Durability */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality & Durability</h3>
              <p className="text-sm text-gray-600">Using only high-quality materials and proven techniques to ensure your renovation lasts for years.</p>
            </div>
            {/* Feature 3: Clear Communication */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" /> {/* Added MessageCircle icon */}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Clear Communication</h3>
              <p className="text-sm text-gray-600">Keeping you informed every step of the way with regular updates and responsive support.</p>
            </div>
          </div>
        </div>
      </div>
      {/* --- END NEW SECTION --- */}

      {/* Testimonials Section - Enhanced blue background with lighter blue testimonial box */}
      <div className="py-16 relative overflow-hidden testimonials-no-animation">
        {/* Enhanced background design with more vibrant gradient and patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
        
        {/* Enhanced pattern overlay for more visual interest */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_2px,transparent_2px)] bg-[size:20px_20px]"></div>
        </div>
        
        {/* Decorative wave pattern at top */}
        <div className="absolute top-0 w-full h-24 opacity-30">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-white opacity-20"></path>
          </svg>
        </div>
        
        {/* Decorative moving elements */}
        <div className="absolute h-full w-full overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-400/20 blur-2xl animate-slow-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-300/20 blur-2xl animate-slow-pulse-delayed"></div>
        </div>
        
        {/* Floating quote marks */}
        <div className="absolute top-[15%] right-[10%] opacity-10">
          <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <div className="absolute bottom-[20%] left-[8%] opacity-10 transform rotate-180">
          <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        {/* Floating stars */}
        <div className="absolute top-[30%] left-[15%]">
          <div className="animate-float">
            <svg className="w-10 h-10 text-yellow-200 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-[25%] right-[20%]">
          <div className="animate-float-delayed">
            <svg className="w-8 h-8 text-yellow-200 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
        
        {/* Abstract decorative shapes */}
        <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden opacity-10">
          <svg className="absolute right-0 top-0 h-full w-full" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M125,-160.4C171.6,-143.7,223.6,-122.3,246.8,-83.7C270,-45.1,264.4,10.6,244.1,58.5C223.8,106.4,188.8,146.3,146.5,177.9C104.2,209.4,54.6,232.5,1.6,230.5C-51.4,228.5,-102.7,201.4,-139.8,165.9C-176.9,130.4,-199.7,86.5,-216.7,37.8C-233.7,-10.9,-244.9,-64.5,-226.7,-105.9C-208.4,-147.4,-160.8,-176.8,-113.8,-194.3C-66.9,-211.9,-20.5,-217.4,20.9,-242.5C62.3,-267.6,78.4,-177.1,125,-160.4Z" fill="white" />
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-1 bg-white mb-6"></div>
            <h2 className="text-4xl font-bold text-white mb-2 text-center">What Our Clients Say</h2>
            <div className="w-20 h-1 bg-white mt-4"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-200 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row">
              {/* Changed to lighter blue for the testimonial box */}
              <div className="bg-blue-400 md:w-1/3 p-8 relative">
                <div className="absolute inset-0 opacity-10">
                  <svg className="h-full w-full" viewBox="0 0 80 60" preserveAspectRatio="none">
                    <path d="M 0 0 L 0 60 L 80 60 L 80 0 Q 65 60 40 30 Q 25 15 0 0 Z" fill="white" />
                  </svg>
                </div>
                
                {/* Add subtle pattern to the blue background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff_1px,transparent_1px),linear-gradient(135deg,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>
                
                <h3 className="text-3xl font-extrabold text-white mb-6">Client Testimonials</h3>
                <div className="space-y-4 relative z-10">
                  <div className="text-white">
                    <p className="mb-2 text-lg font-semibold">Our clients love our work!</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mt-1 font-medium">Average Rating: 4.9/5</p>
                  </div>
                  <div className="pt-4 border-t border-blue-300">
                    <p className="text-white text-base">
                      Read what our clients have to say about our dedication to quality, innovation, and customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <TestimonialSlider testimonials={residentialTestimonials} />
                <div className="text-center mt-8">
                  <Link to="/testimonials" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                    Read More Testimonials
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the Modal */} 
      <ServiceListModal 
        isOpen={isModalOpen}
        onClose={closeServiceModal}
        title={modalContent.title} // Correct property name
        services={modalContent.services}
        categoryIcon={modalContent.icon}
        projectType="residential"
      />

      {/* CTA Section can be added back if needed */}

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        @keyframes slow-pulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        
        @keyframes slow-pulse-delayed {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        .animate-slow-pulse {
          animation: slow-pulse 12s ease-in-out infinite;
        }
        
        .animate-slow-pulse-delayed {
          animation: slow-pulse-delayed 15s ease-in-out infinite;
        }
        
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-fast {
          animation: fade-in-fast 0.5s ease-out forwards;
        }
        
        /* Disable scroll-based animations for testimonial section */
        .testimonials-no-animation .animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }
        
        .testimonials-no-animation .animate-float,
        .testimonials-no-animation .animate-float-delayed {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Residential; 