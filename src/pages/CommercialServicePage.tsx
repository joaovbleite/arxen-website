import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Building2, UtensilsCrossed, Stethoscope, Warehouse, Phone, Mail, MapPin, Clock, Award, ShieldCheck, Star, Zap, Store, List, Scan, Eye, Search, ChevronDown, X, Filter, ArrowUpRight, Building, Hotel, Coffee, School, ShoppingCart, Library, Factory, Home, Users, Briefcase, FlaskConical, Car, Server, CalendarDays, Smile, Dog, BookOpen, Landmark, Scissors, Pill, Truck, Dumbbell, Film, Beer, Package, ShowerHead, Church, Drama, LandPlot, Scale, HandHeart, Fuel, ParkingSquare, Plane, Goal, Mailbox, Gavel, Target, FerrisWheel, Handshake, Shield, Calculator, Siren, Presentation, Microscope, TowerControl, TrainTrack, Bus, Wrench, SlidersHorizontal } from 'lucide-react';
import ServiceListModal from '../components/ServiceListModal';
import TestimonialSlider from '../components/TestimonialSlider';
import { getShuffledTestimonials } from '../data/testimonials';
import { usePropertyType } from '../components/PropertyTypeContext';

interface CommercialServicePageProps {
  title?: string;
}

// Define a type for SVG and HTML elements that can accept className
type IconElementProps = {
  className?: string;
  size?: number | string;
  [key: string]: any;
};

// Element type that can be cloned and accept className
type IconElement = React.ReactElement<IconElementProps>;

interface Service {
  title: string;
  path: string;
  description: string;
  image: string;
  icon: IconElement;
}

interface GroupedServiceData {
  icon: IconElement;
  services: Service[];
}

// Add this new interface for building types
interface BuildingType {
  id: string;
  name: string;
  icon: IconElement;
  description: string;
  category: string; // Added category field
  searchOnly?: boolean;
  tags?: string[]; // Added tags for filtering
}

// Add IconProps interface for better typing
interface IconProps {
  size?: number | string;
  className?: string;
  [key: string]: any;
}

const CommercialServicePage: React.FC<CommercialServicePageProps> = ({ title }) => {
  const location = useLocation();
  // Determine if this is the main commercial page or a specific service page
  const isMainCommercialPage = location.pathname === '/commercial' || location.pathname === '/commercial-service';
  
  // State for modal - update type to match ServiceListModal props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; services: Service[]; icon?: IconElement }>({ title: '', services: [], icon: undefined });

  // Building type selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('Professional'); // Keep Professional as default for now
  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null); // Ref for filter dropdown

  // NEW Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ renovation: boolean; newConstruction: boolean }>({ 
    renovation: false, 
    newConstruction: false 
  });

  // Get shuffled testimonials and memoize to prevent re-renders
  const shuffledTestimonials = useMemo(() => getShuffledTestimonials(), []);

  // Use the building type context
  const { buildingType, setBuildingType } = usePropertyType();
  
  // Function to open modal
  const openServiceModal = (categoryName: string, categoryData: GroupedServiceData) => {
    setModalContent({ title: categoryName, services: categoryData.services, icon: categoryData.icon });
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeServiceModal = () => {
    setIsModalOpen(false);
  };

  // Define commercial services data structure
  const commercialServices: Service[] = [
    {
      title: "Office Renovation",
      path: "/services/office-renovation",
      description: "Transform your workspace with modern, efficient layouts and designs.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
      icon: <Building2 className="w-6 h-6" /> as IconElement
    },
    {
      title: "Office Fit-Out",
      path: "/services/office-fit-out",
      description: "Tailored fit-out solutions for new or existing office spaces.",
      image: "https://images.unsplash.com/photo-1600880292203-94d56c436f16?auto=format&fit=crop&q=80",
      icon: <Building2 className="w-6 h-6" /> as IconElement
    },
    {
      title: "Office Expansion",
      path: "/services/office-expansion",
      description: "Expand your current office space seamlessly.",
      image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80",
      icon: <Building2 className="w-6 h-6" /> as IconElement
    },
    {
      title: "Office Design Consult",
      path: "/services/office-design",
      description: "Consulting services for optimal office layout and design.",
      image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&q=80",
      icon: <Building2 className="w-6 h-6" /> as IconElement
    },
    {
      title: "Retail Fit-Outs",
      path: "/services/retail-fit-out",
      description: "Comprehensive buildouts designed to attract customers and maximize sales.",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80",
      icon: <Store className="w-6 h-6" /> as IconElement
    },
    {
      title: "Restaurant Renovation",
      path: "/services/restaurant-renovation",
      description: "Specialized renovation and design for restaurants, cafes, and food service.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
      icon: <UtensilsCrossed className="w-6 h-6" /> as IconElement
    },
    {
      title: "Healthcare Facilities",
      path: "/services/healthcare-facilities",
      description: "Custom construction for medical offices, clinics, and healthcare spaces.",
      image: "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?auto=format&fit=crop&q=80",
      icon: <Stethoscope className="w-6 h-6" /> as IconElement
    },
    {
      title: "Warehouse & Industrial",
      path: "/services/warehouse-industrial",
      description: "Custom solutions for warehouses, manufacturing, and industrial facilities.",
      image: "https://images.unsplash.com/photo-1587019158091-1a123c84796e?auto=format&fit=crop&q=80",
      icon: <Warehouse className="w-6 h-6" /> as IconElement
    }
  ];

  // Now group services using the defined array
  const groupedServices = commercialServices.reduce((acc: Record<string, GroupedServiceData>, service: Service) => {
    const categoryName = service.title.includes('Office') || service.title.includes('Retail') ? "Business Spaces" : 
                       service.title.includes('Restaurant') ? "Hospitality" : 
                       service.title.includes('Healthcare') ? "Healthcare" : "Industrial & Other";
    if (!acc[categoryName]) {
      acc[categoryName] = { icon: service.icon, services: [] };
    }
    acc[categoryName].services.push(service);
    return acc;
  }, {} as Record<string, GroupedServiceData>); 

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchResultsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Building types data with *tags* added to some examples
  const buildingTypes: BuildingType[] = [
    // Professional Services
    { id: 'office', name: 'Office Buildings', icon: <Building2 /> as IconElement, description: 'Corporate offices, coworking spaces', category: 'Professional', tags: ['renovation', 'fit-out'] },
    { id: 'bank', name: 'Banks & Financial', icon: <Library /> as IconElement, description: 'Banks, credit unions, financial institutions', category: 'Professional', tags: ['renovation', 'new_construction'] },
    { id: 'law', name: 'Law Firms', icon: <Scale /> as IconElement, description: 'Legal offices and related services', category: 'Professional', tags: ['fit-out'] },
    { id: 'funeral', name: 'Funeral Homes', icon: <HandHeart /> as IconElement, description: 'Funeral parlors and related services', category: 'Professional', tags: ['renovation'] },
    { id: 'real_estate', name: 'Real Estate Agencies', icon: <Handshake /> as IconElement, description: 'Real estate brokerages and offices', category: 'Professional', tags: ['renovation'] },
    { id: 'insurance', name: 'Insurance Agencies', icon: <Shield /> as IconElement, description: 'Insurance brokers and agencies', category: 'Professional', tags: ['renovation'] },
    { id: 'accounting', name: 'Accounting Firms', icon: <Calculator /> as IconElement, description: 'CPA offices and accounting services', category: 'Professional', tags: ['renovation'] },
    
    // Healthcare
    { id: 'healthcare', name: 'Healthcare Facilities', icon: <Stethoscope /> as IconElement, description: 'Medical offices, clinics, hospitals', category: 'Healthcare', tags: ['new_construction', 'renovation'] },
    { id: 'dental', name: 'Dental Offices', icon: <Smile /> as IconElement, description: 'Dental clinics and practices', category: 'Healthcare', tags: ['renovation'] }, 
    { id: 'vet', name: 'Veterinary Clinics', icon: <Dog /> as IconElement, description: 'Animal hospitals and clinics', category: 'Healthcare', tags: ['renovation'] }, 
    { id: 'pharmacy', name: 'Pharmacies', icon: <Pill /> as IconElement, description: 'Drug stores and pharmacies', category: 'Healthcare', tags: ['renovation'] },
    
    // Hospitality
    { id: 'restaurant', name: 'Restaurants & Cafes', icon: <Coffee /> as IconElement, description: 'Dining establishments, cafeterias, food service', category: 'Hospitality', tags: ['renovation', 'fit-out'] },
    { id: 'hotel', name: 'Hotels & Resorts', icon: <Hotel /> as IconElement, description: 'Hotels, motels, resorts, lodging', category: 'Hospitality', tags: ['renovation'] },
    { id: 'event_venue', name: 'Event Venues', icon: <CalendarDays /> as IconElement, description: 'Conference centers, banquet halls, arenas', category: 'Hospitality', tags: ['renovation'] },
    { id: 'bar_club', name: 'Bars & Nightclubs', icon: <Beer /> as IconElement, description: 'Bars, pubs, nightclubs', category: 'Hospitality', tags: ['renovation'] },
    { id: 'convention', name: 'Convention Centers', icon: <Presentation /> as IconElement, description: 'Large meeting and exhibition halls', category: 'Hospitality', tags: ['renovation'] },

    // Retail
    { id: 'retail', name: 'Retail Stores', icon: <Store /> as IconElement, description: 'Shops, boutiques, general retail', category: 'Retail', tags: ['fit-out', 'renovation'] },
    { id: 'grocery', name: 'Grocery & Supermarkets', icon: <ShoppingCart /> as IconElement, description: 'Food markets, supermarkets', category: 'Retail', tags: ['renovation'] },
    { id: 'dealership', name: 'Auto Dealerships', icon: <Car /> as IconElement, description: 'Car showrooms, service centers', category: 'Retail', tags: ['renovation'] },
    { id: 'car_wash', name: 'Car Washes', icon: <ShowerHead /> as IconElement, description: 'Automated and manual car wash facilities', category: 'Retail', tags: ['renovation'] },
    { id: 'shopping_mall', name: 'Shopping Malls', icon: <ShoppingCart /> as IconElement, description: 'Large enclosed shopping centers', category: 'Retail', tags: ['renovation'] },

    // Education
    { id: 'school', name: 'Schools & Universities', icon: <School /> as IconElement, description: 'K-12 schools, colleges, universities', category: 'Education', tags: ['new_construction', 'renovation'] },
    { id: 'childcare', name: 'Childcare Centers', icon: <Home /> as IconElement, description: 'Daycares, preschools, learning centers', category: 'Education', tags: ['renovation'] },
    { id: 'library', name: 'Libraries', icon: <BookOpen /> as IconElement, description: 'Public and institutional libraries', category: 'Education', tags: ['renovation'] }, 
    { id: 'museum', name: 'Museums & Galleries', icon: <Landmark /> as IconElement, description: 'Art galleries, science museums, cultural centers', category: 'Education', tags: ['renovation'] }, 

    // Industrial
    { id: 'warehouse', name: 'Warehouses', icon: <Warehouse /> as IconElement, description: 'Storage facilities, distribution centers', category: 'Industrial', tags: ['new_construction'] },
    { id: 'manufacturing', name: 'Manufacturing Plants', icon: <Factory /> as IconElement, description: 'Manufacturing, processing facilities', category: 'Industrial', tags: ['renovation'] },
    { id: 'mixed-use', name: 'Mixed-Use Industrial', icon: <Building /> as IconElement, description: 'Combined office/warehouse/light industrial', category: 'Industrial', tags: ['renovation'] },
    { id: 'workshop', name: 'Workshops & Repair', icon: <Wrench /> as IconElement, description: 'Repair shops, fabrication workshops', category: 'Industrial', tags: ['renovation'] },

    // Civic
    { id: 'public', name: 'Government Buildings', icon: <Building /> as IconElement, description: 'City halls, federal buildings', category: 'Civic', tags: ['renovation'] },
    { id: 'church', name: 'Churches & Religious', icon: <Church /> as IconElement, description: 'Places of worship, religious centers', category: 'Civic', tags: ['new_construction', 'renovation'] },
    { id: 'community_center', name: 'Community Centers', icon: <Drama /> as IconElement, description: 'Community halls, recreational centers', category: 'Civic', tags: ['renovation'] },
    { id: 'post_office', name: 'Post Offices', icon: <Mailbox /> as IconElement, description: 'Postal service facilities', category: 'Civic', tags: ['renovation'] },
    { id: 'courthouse', name: 'Courthouses', icon: <Gavel /> as IconElement, description: 'Judicial buildings and court facilities', category: 'Civic', tags: ['renovation'] },
    { id: 'emergency_services', name: 'Police/Fire Stations', icon: <Siren /> as IconElement, description: 'Emergency service buildings', category: 'Civic', tags: ['renovation'] },

    // Recreation
    { id: 'fitness', name: 'Fitness Centers', icon: <Dumbbell /> as IconElement, description: 'Gyms, studios, wellness centers', category: 'Recreation', tags: ['fit-out', 'renovation'] },
    { id: 'spa_salon', name: 'Spas & Salons', icon: <Scissors /> as IconElement, description: 'Beauty salons, day spas, wellness centers', category: 'Recreation', tags: ['renovation'] }, 
    { id: 'movie_theater', name: 'Movie Theaters', icon: <Film /> as IconElement, description: 'Cinemas, multiplexes', category: 'Recreation', tags: ['renovation'] },
    { id: 'sports_complex', name: 'Sports Complexes', icon: <Goal /> as IconElement, description: 'Stadiums, arenas, sports fields', category: 'Recreation', tags: ['renovation'] },
    { id: 'brewery', name: 'Breweries & Wineries', icon: <Beer /> as IconElement, description: 'Craft breweries, wineries, tasting rooms', category: 'Recreation', tags: ['renovation'] },
    { id: 'bowling', name: 'Bowling Alleys', icon: <Target /> as IconElement, description: 'Bowling centers and entertainment venues', category: 'Recreation', tags: ['renovation'] },
    { id: 'amusement', name: 'Amusement Parks', icon: <FerrisWheel /> as IconElement, description: 'Theme parks and amusement centers', category: 'Recreation', tags: ['renovation'] },

    // Basic Technology (removed advanced technology facilities)
    { id: 'lab', name: 'Laboratories', icon: <FlaskConical /> as IconElement, description: 'Research labs, testing facilities', category: 'Specialized', tags: ['renovation'] },

    // Transportation
    { id: 'logistics', name: 'Logistics Hubs', icon: <Truck /> as IconElement, description: 'Transportation and logistics facilities', category: 'Transportation', tags: ['renovation'] },
    { id: 'airport', name: 'Airports', icon: <Plane /> as IconElement, description: 'Airport terminals and facilities', category: 'Transportation', tags: ['renovation', 'new_construction'] },
    { id: 'gas_station', name: 'Gas Stations', icon: <Fuel /> as IconElement, description: 'Fueling stations and convenience stores', category: 'Transportation', tags: ['renovation'] },
    { id: 'parking_garage', name: 'Parking Garages', icon: <ParkingSquare /> as IconElement, description: 'Multi-level parking structures', category: 'Transportation', tags: ['renovation'] },
    { id: 'train_station', name: 'Train Stations', icon: <TrainTrack /> as IconElement, description: 'Railway stations and terminals', category: 'Transportation', tags: ['renovation'] },
    { id: 'bus_depot', name: 'Bus Depots', icon: <Bus /> as IconElement, description: 'Bus terminals and maintenance depots', category: 'Transportation', tags: ['renovation'] },

    // --- Search-Only Types --- 
    { id: 'apartments', name: 'Apartment Complexes', icon: <LandPlot /> as IconElement, description: 'Multi-family residential buildings (managed)', category: 'Professional', searchOnly: true, tags: ['renovation'] }, 
    { id: 'self_storage', name: 'Self-Storage Facilities', icon: <Package /> as IconElement, description: 'Personal and business storage units', category: 'Industrial', searchOnly: true, tags: ['renovation'] },
  ];

  // Filter building types based on search query (Uses ALL types)
  const filteredBuildingTypesForSearch = buildingTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter building types for the grid based on the selected category tab (Excludes searchOnly types)
  const displayedBuildingTypes = buildingTypes.filter(type => {
    // Filter by Category Tab
    if (type.category !== selectedCategoryTab) return false;
    // Exclude searchOnly types
    if (type.searchOnly) return false;
    
    // Apply Active Filters (Renovation / New Construction)
    const renovationFilter = activeFilters.renovation;
    const newConstructionFilter = activeFilters.newConstruction;

    // If no filters active, show all in category
    if (!renovationFilter && !newConstructionFilter) return true;
    
    // If filters ARE active, check tags
    const tags = type.tags || [];
    let match = true;
    if (renovationFilter && !tags.includes('renovation')) {
        match = false; // Doesn't match if renovation filter is on but tag is missing
    }
    if (newConstructionFilter && !tags.includes('new_construction')) {
        match = false; // Doesn't match if new construction filter is on but tag is missing
    }
    
    return match;
  });

  // Update the building type handler to use the context
  const handleBuildingTypeSelect = (type: BuildingType) => {
    setBuildingType(type);
    setSelectedCategoryTab(type.category); // Also update category tab when selected via grid/search
    setSearchQuery('');
    setIsSearchResultsOpen(false);
  };

  // Modify getServiceUrl to use context
  const getServiceUrl = (path: string) => {
    if (buildingType) {
      return `${path}?buildingType=${buildingType.id}`;
    }
    return path;
  };

  // NEW: Handle filter checkbox change
  const handleFilterChange = (filterName: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  // Check if any filters are active for button styling
  const filtersAreActive = activeFilters.renovation || activeFilters.newConstruction;

  return (
    <div className="bg-white">
      {/* Enhanced Professional Header Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500 rounded-full filter blur-3xl -ml-20 -mb-20"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block py-1 px-3 bg-blue-600 bg-opacity-30 rounded-full text-blue-200 text-sm font-medium mb-2">
                EXPERTISE YOU CAN TRUST
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {title || 'Commercial Services'}
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                {title 
                  ? `Expert services in ${title} tailored to your business needs.` 
                  : 'Comprehensive commercial construction and renovation services for businesses of all sizes.'}
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/free-estimate?projectType=commercial" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]">
                  Request Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a href="tel:404-934-9458" className="inline-flex items-center px-6 py-3 border border-blue-400 hover:border-blue-300 text-white rounded-lg transition-colors">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Us
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-500 bg-opacity-20 rounded-lg transform rotate-12"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-indigo-500 bg-opacity-20 rounded-lg transform -rotate-12"></div>
                <img 
                  src="https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?q=80&w=2069&auto=format&fit=crop"
                  alt="Commercial Services" 
                  className="w-full h-80 object-cover rounded-lg shadow-2xl border border-gray-700 relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Key benefits row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-700">
            {[
              {icon: <Building2 className="w-6 h-6 text-blue-400" />, text: "Serving All Industries"},
              {icon: <Clock className="w-6 h-6 text-blue-400" />, text: "On-Time Completion"},
              {icon: <ShieldCheck className="w-6 h-6 text-blue-400" />, text: "Licensed & Insured"},
              {icon: <Award className="w-6 h-6 text-blue-400" />, text: "Quality Guaranteed"}
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-3">{benefit.icon}</div>
                <p className="text-sm font-medium text-gray-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* 3D Visualization Section - HIDDEN */}
        {/* 
        <div className="mb-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md text-white animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center mb-2">
                <Scan size={20} className="mr-2 opacity-80" />
                <h3 className="text-xl font-semibold">Visualize Your Project in 3D</h3>
              </div>
              <p className="text-blue-100 text-sm max-w-xl">
                Use our advanced tools to scan your actual space for precise measurements or visualize different materials before making a decision.
              </p>
            </div>
            <Link 
              to="/visualize-it" 
              className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-white text-blue-700 font-medium rounded-lg shadow hover:bg-blue-50 transition-colors transform hover:scale-105 w-full md:w-auto"
            >
              Launch 3D Tools
              <Eye size={18} className="ml-2" />
            </Link>
          </div>
        </div> 
        */}

        {/* New Compact Professional Building Type Explorer */}
        <div className="mb-10 mt-8 border-t border-gray-100 pt-8">
          <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            {/* Compact Header */}
            <div className="bg-gray-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-300" />
                  <h3 className="font-semibold text-sm text-white tracking-wide">INDUSTRY-SPECIFIC SOLUTIONS</h3>
                </div>
                
                {/* Compact Filter and Browse buttons */}
                <div className="flex space-x-2 relative" ref={filterRef}>
                  {/* UPDATED Filter Button */}
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-1.5 border rounded text-xs flex items-center transition-colors duration-200 ${filtersAreActive ? 'border-blue-400 bg-blue-600 text-white hover:bg-blue-700' : 'bg-transparent border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white'}`}
                  >
                    <SlidersHorizontal size={12} className="mr-1" />
                    Filter {filtersAreActive ? '(Active)' : ''}
                  </button>
                  {/* Filter Dropdown Panel */}
                  {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-lg border border-gray-200 z-20 p-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Filter by Project Focus:</p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={activeFilters.renovation}
                            onChange={() => handleFilterChange('renovation')}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-600">Renovation / Fit-Out</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={activeFilters.newConstruction}
                            onChange={() => handleFilterChange('newConstruction')}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-600">New Construction</span>
                        </label>
                      </div>
                    </div>
                  )}
                  {/* Browse All Button (Unchanged) */}
                  <Link to="/commercial/all-industries" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center transition-colors">
                    Browse All
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Compact Search */}
              <div className="mt-3 relative z-20" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-9 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-gray-400"
                  placeholder="Search your industry or building type..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchResultsOpen(true);
                  }}
                  onFocus={() => setIsSearchResultsOpen(true)}
                />
                {searchQuery && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchResultsOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                )}
                
                {/* Search Results Dropdown */}
                {isSearchResultsOpen && filteredBuildingTypesForSearch.length > 0 && (
                  <div className="absolute mt-1 w-full bg-white shadow-lg rounded border border-gray-200 max-h-80 overflow-y-auto z-30">
                    <div className="sticky top-0 bg-gray-50 px-3 py-1.5 border-b border-gray-200 text-xs text-gray-500 font-medium">
                      Industry Results
                    </div>
                    {filteredBuildingTypesForSearch.map((type) => (
                      <div 
                        key={type.id}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center transition-colors duration-150"
                        onClick={() => handleBuildingTypeSelect(type)}
                      >
                        <div className="mr-2 p-1.5 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
                          <div className="w-5 h-5">{type.icon}</div>
                        </div>
                        <div className="flex-1 truncate">
                          <div className="font-medium text-sm text-gray-800">{type.name}</div>
                          <div className="text-xs text-gray-500 truncate">{type.description}</div>
                        </div>
                        <ArrowRight size={14} className="text-blue-500 ml-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact Selected Building Type Card */}
            {buildingType && (
              <div className="px-4 py-3 bg-white border-b border-gray-200 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded">
                    <div className="w-5 h-5">{buildingType.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 mb-0.5 truncate">{buildingType.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link 
                        to={`/free-estimate?projectType=commercial&buildingType=${buildingType.id}`}
                        className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Get Proposal
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                      <button 
                        onClick={() => setBuildingType(null)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-medium rounded transition-colors"
                      >
                        Clear
                        <X className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block border-l border-gray-200 pl-3 text-xs text-gray-500">
                    <span className="text-xs font-medium text-gray-700">Top services:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {buildingTypes
                        .find(type => type.id === buildingType.id)?.id === 'office' 
                          ? ['Office Renovation', 'Office Fit-Out', 'Office Expansion'].map((service, i) => (
                              <span key={i} className="inline-flex items-center text-xs bg-gray-100 px-2 py-0.5 rounded">
                                <Check size={10} className="mr-1 text-green-500" />
                                {service}
                              </span>
                            ))
                          : buildingTypes
                              .find(type => type.id === buildingType.id)?.id === 'retail'
                                ? ['Retail Fit-Outs', 'Storefront Design', 'Display Installations'].map((service, i) => (
                                    <span key={i} className="inline-flex items-center text-xs bg-gray-100 px-2 py-0.5 rounded">
                                      <Check size={10} className="mr-1 text-green-500" />
                                      {service}
                                    </span>
                                  ))
                                : ['Custom Design', 'Space Planning', 'Specialized Construction'].map((service, i) => (
                                    <span key={i} className="inline-flex items-center text-xs bg-gray-100 px-2 py-0.5 rounded">
                                      <Check size={10} className="mr-1 text-green-500" />
                                      {service}
                                    </span>
                                  ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Category Tabs - Updated with new categories */}
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex overflow-x-auto hide-scrollbar">
              {['Professional', 'Healthcare', 'Hospitality', 'Retail', 'Education', 'Industrial', 'Civic', 'Recreation', 'Technology', 'Transportation'].map((category) => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategoryTab(category)}
                  className={`px-2.5 py-1 mx-0.5 whitespace-nowrap rounded text-xs font-medium transition-colors ${
                    selectedCategoryTab === category 
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Compact Building Types Grid - Filters based on selected tab */}
            <div className="p-3 bg-white grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {displayedBuildingTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => handleBuildingTypeSelect(type)}
                  className={`group flex flex-col items-center p-2 rounded cursor-pointer transition-all duration-200 ${
                    buildingType?.id === type.id 
                      ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-1 ${
                    buildingType?.id === type.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-500'
                  } transition-colors duration-200`}>
                    <div className="w-5 h-5">{type.icon}</div>
                  </div>
                  <h3 className={`text-xs font-medium text-center ${
                    buildingType?.id === type.id 
                      ? 'text-blue-800' 
                      : 'text-gray-700'
                  }`}>
                    {type.name.split(' ')[0]}
                  </h3>
                </div>
              ))}
              {/* Optional: Add message if no types in category */}
              {displayedBuildingTypes.length === 0 && (
                <div className="col-span-full text-center text-sm text-gray-500 py-4">
                  No building types found in this category.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {Object.entries(groupedServices).map(([categoryName, categoryData]: [string, GroupedServiceData], index) => {
              const servicesToShow = categoryData.services.slice(0, 4);

              return (
                <div key={index} className="border-b border-gray-200 pb-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3"> 
                         <div className="w-5 h-5 text-blue-700">{categoryData.icon}</div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{categoryName}</h2>
                    </div>
                    <button 
                      onClick={() => openServiceModal(categoryName, categoryData)}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0 ml-4"
                    >
                      View All Services
                      <List size={16} className="ml-1.5"/>
                    </button>
                  </div>
                  
                  <div key={categoryName + '-grid'} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-fast">
                    {servicesToShow.map((service: Service, serviceIndex: number) => (
                       <Link 
                         to={getServiceUrl(service.path)} 
                         key={service.title}
                         className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 h-full bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm group`}
                       >
                         <div className="mr-4 flex-shrink-0 text-blue-600">
                           <div className="w-6 h-6">{service.icon}</div>
                         </div>
                         <div className="flex-grow">
                           <h3 className="font-medium mb-1 text-gray-800 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                           <p className="text-gray-500 text-xs">{service.description}</p>
                         </div>
                         <div className="ml-2 text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1 duration-300">
                            <ArrowRight size={16} />
                         </div>
                       </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="mt-8 text-center text-gray-600 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
              Need specialized commercial services not listed? <Link to="/free-estimate?projectType=commercial" className="text-blue-600 hover:underline font-medium">Request a consultation</Link> and provide details. We handle diverse commercial projects.
            </div>
          </div>
          
          {/* Adding sidebar similar to residential page */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 mt-12 lg:mt-0">
             {/* Why Choose Us Box */}
             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-4 text-gray-800">Why Choose Arxen?</h3>
               <ul className="space-y-3">
                 {[ 
                   { text: "Expert Commercial Solutions", icon: <Award size={18} className="text-blue-600"/> },
                   { text: "Transparent Process", icon: <Check size={18} className="text-blue-600"/> },
                   { text: "Minimal Business Disruption", icon: <Clock size={18} className="text-blue-600"/> },
                   { text: "Licensed & Insured", icon: <ShieldCheck size={18} className="text-blue-600"/> },
                   { text: "Dedicated Project Manager", icon: <Phone size={18} className="text-blue-600"/> }
                 ].map((item, idx) => (
                   <li key={idx} className="flex items-center text-gray-700"><span className="mr-3 flex-shrink-0">{item.icon}</span><span>{item.text}</span></li>
                 ))}
               </ul>
             </div>
             {/* Call to Action Box */}
             <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-bold mb-3 text-blue-800">Ready to Get Started?</h3>
               <p className="text-sm text-gray-700 mb-4">Schedule a free consultation with our commercial projects team and get a customized solution for your business needs.</p>
               <Link to="/free-estimate?projectType=commercial" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow">Schedule Consultation</Link>
             </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Why Choose Us / Commitment Section (Commercial) --- */}
      <div className="py-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Your Commercial Construction Partner</h2>
            <p className="mt-3 text-gray-300 max-w-2xl mx-auto">We deliver tailored solutions with a focus on efficiency, quality, and minimal disruption to your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Business Focused */}
            <div className="text-center p-6 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600/50">
              <div className="inline-block p-3 bg-blue-600/30 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Business-Focused Solutions</h3>
              <p className="text-sm text-gray-300">Understanding your operational needs to deliver spaces that enhance workflow and productivity.</p>
            </div>
            {/* Feature 2: On Time, On Budget */}
            <div className="text-center p-6 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600/50">
              <div className="inline-block p-3 bg-green-600/30 rounded-full mb-4">
                <Clock className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">On Time, On Budget</h3>
              <p className="text-sm text-gray-300">Reliable project management ensuring timely completion within your specified budget.</p>
            </div>
            {/* Feature 3: Lasting Quality */}
            <div className="text-center p-6 bg-gray-700/50 rounded-lg shadow-sm border border-gray-600/50">
              <div className="inline-block p-3 bg-purple-600/30 rounded-full mb-4">
                <Award className="w-8 h-8 text-purple-300" /> 
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lasting Quality & Safety</h3>
              <p className="text-sm text-gray-300">Using commercial-grade materials and adhering to strict safety standards for durable results.</p>
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
                <TestimonialSlider testimonials={shuffledTestimonials} />
                <div className="text-center mt-8">
                  <Link to="/testimonials" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors shadow-md hover:shadow-lg">
                    Read More Testimonials
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ServiceListModal 
        isOpen={isModalOpen}
        onClose={closeServiceModal}
        title={modalContent.title}
        services={modalContent.services}
        categoryIcon={modalContent.icon}
        projectType="commercial"
      />
      
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

export default CommercialServicePage; 