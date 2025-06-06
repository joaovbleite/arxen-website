import React, { useState, useEffect, useRef } from 'react';
import { Check, Home, Wrench, Paintbrush, Grid, Ruler, /*ParkingSquare,*/ Warehouse, Truck, Hammer, Building2, User, UtensilsCrossed, Stethoscope, Leaf, ChevronDown, Search, X, PlusSquare, Scan, Eye, ArrowRight, ClipboardList, Sparkles, AlertCircle, Store, Coffee, Hotel, Library, Factory, School, ShieldCheck, Calculator, Dumbbell, Film, Beer, Server, Book, BrickWall, DollarSign, Lightbulb, Rocket, CreditCard, Tv, WashingMachine, HardHat, Antenna } from 'lucide-react';
import { FormData } from '../../pages/FreeEstimate/FreeEstimate';
import { useLocation, Link } from 'react-router-dom';

// Extend FormData to include propertyType
interface ExtendedFormData extends FormData {
  propertyType?: string;
}

// Define types for the component props
interface ServiceSelectionProps {
  selectedServices: string[];
  updateFormData: (data: Partial<ExtendedFormData>) => void;
  projectType?: 'residential' | 'commercial';
  commercialDetails?: { // Receive commercial details
    buildingTypeId?: string;
  };
  propertyType?: string;
}

// Define the residential services data structure
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Define broad commercial service categories
interface CommercialServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Define specific commercial services data structure
interface SpecificCommercialService extends Service {
  categoryId: string; // Reference to the broad category
}

// Updated Building Type Name Map (needs to be accessible or duplicated here)
// Ideally, this map would live in a shared utility file
const buildingTypeNames: Record<string, string> = {
  office: 'Office Buildings',
  bank: 'Banks & Financial',
  law: 'Law Firms',
  funeral: 'Funeral Homes',
  real_estate: 'Real Estate Agencies',
  insurance: 'Insurance Agencies',
  accounting: 'Accounting Firms',
  mixed_use: 'Mixed-Use Buildings',
  parking_garage: 'Parking Garages',
  healthcare: 'Healthcare Facilities',
  dental: 'Dental Offices',
  vet: 'Veterinary Clinics',
  pharmacy: 'Pharmacies',
  restaurant: 'Restaurants & Cafes',
  hotel: 'Hotels & Resorts',
  event_venue: 'Event Venues',
  bar_club: 'Bars & Nightclubs',
  convention: 'Convention Centers',
  retail: 'Retail Stores',
  grocery: 'Grocery & Supermarkets',
  dealership: 'Auto Dealerships',
  car_wash: 'Car Washes',
  shopping_mall: 'Shopping Malls',
  school: 'Schools & Universities',
  childcare: 'Childcare Centers',
  library: 'Libraries',
  museum: 'Museums & Galleries',
  warehouse: 'Warehouses',
  manufacturing: 'Manufacturing Plants',
  workshop: 'Workshops & Repair',
  public: 'Government Buildings',
  church: 'Churches & Religious',
  community_center: 'Community Centers',
  post_office: 'Post Offices',
  courthouse: 'Courthouses',
  emergency_services: 'Police/Fire Stations',
  fitness: 'Fitness Centers',
  spa_salon: 'Spas & Salons',
  movie_theater: 'Movie Theaters',
  sports_complex: 'Sports Complexes',
  brewery: 'Breweries & Wineries',
  bowling: 'Bowling Alleys',
  amusement: 'Amusement Parks',
  data_center: 'Data Centers',
  lab: 'Laboratories',
  telecom: 'Telecom Facilities',
  rnd: 'R&D Centers',
  logistics: 'Logistics Hubs',
  airport: 'Airports',
  gas_station: 'Gas Stations',
  train_station: 'Train Stations',
  bus_depot: 'Bus Depots',
  apartments: 'Apartment Complexes',
  self_storage: 'Self-Storage Facilities',
}; // IMPORTANT: Keep this map updated and complete

// Update renderIcon utility function to handle different icon types safely
const renderIcon = (icon: any, size = 24, className = "") => {
  if (!icon) {
    return null;
  }
  
  // If icon is already a React element (e.g., <Home />)
  if (React.isValidElement(icon)) {
    // Use a safer approach - create a new element with the same component
    const IconComponent = icon.type;
    return <IconComponent className={className} />;
  }
  
  // If it's a component reference (e.g., Home)
  if (typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent size={size} className={className} />;
  }
  
  // Return null for any other case to avoid rendering objects
  return null;
};

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  selectedServices, 
  updateFormData,
  projectType = 'residential',
  commercialDetails,
  propertyType
}) => {
  // No need for selectedType state here anymore, rely solely on projectType prop
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSpecificCommercial, setShowSpecificCommercial] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(propertyType || null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<string | null>(
    commercialDetails?.buildingTypeId || null
  );

  // Define residential property types for selection
  const residentialPropertyTypes = [
    { id: 'single-family', name: 'Single-Family Home' },
    { id: 'townhouse', name: 'Townhouse' },
    { id: 'condo-apt', name: 'Condo / Apartment' },
    { id: 'multi-family', name: 'Multi-Family Home' },
    { id: 'garage', name: 'Garage' },
    { id: 'shed-barn', name: 'Shed / Barn' }
  ];

  // Convert building type names object to array for rendering
  const commercialBuildingTypes = Object.entries(buildingTypeNames).map(([id, name]) => ({
    id,
    name
  }));

  // Group commercial building types by category for easier selection
  const buildingTypeCategories = {
    'Business': ['office', 'bank', 'law', 'funeral', 'real_estate', 'insurance', 'accounting', 'mixed_use'],
    'Retail': ['retail', 'grocery', 'dealership', 'shopping_mall', 'car_wash'],
    'Hospitality': ['restaurant', 'hotel', 'bar_club', 'event_venue', 'convention'],
    'Healthcare': ['healthcare', 'dental', 'vet', 'pharmacy'],
    'Education': ['school', 'childcare', 'library', 'museum'],
    'Industrial': ['warehouse', 'manufacturing', 'workshop', 'data_center', 'lab'],
    'Public': ['public', 'church', 'community_center', 'post_office', 'courthouse', 'emergency_services'],
    'Recreation': ['fitness', 'spa_salon', 'movie_theater', 'sports_complex', 'brewery', 'bowling', 'amusement'],
    'Transportation': ['airport', 'gas_station', 'train_station', 'bus_depot', 'parking_garage'],
    'Other': ['apartments', 'self_storage', 'telecom', 'rnd', 'logistics']
  };

  // Handle property type selection
  const handlePropertyTypeSelect = (typeId: string) => {
    setSelectedPropertyType(typeId);
    // Update the form data
    updateFormData({ 
      propertyType: typeId
    });
  };

  // Handle building type selection
  const handleBuildingTypeSelect = (typeId: string) => {
    setSelectedBuildingType(typeId);
    // Update the form data with commercial details
    updateFormData({ 
      commercialDetails: { 
        buildingTypeId: typeId 
      } 
    });
  };

  // Effect to initialize selected property type from form data if available
  useEffect(() => {
    if (projectType === 'commercial' && commercialDetails?.buildingTypeId) {
      setSelectedBuildingType(commercialDetails.buildingTypeId);
    } else if (projectType === 'residential' && propertyType) {
      setSelectedPropertyType(propertyType);
    }
  }, [projectType, commercialDetails, propertyType]);

  // List of RESIDENTIAL services
  const residentialServices: Service[] = [
    // ... (keep only residential-specific services + potentially 'both')
    { id: 'kitchen-remodeling', title: 'Kitchen Remodeling', description: 'Transform your kitchen...', icon: <Home /> },
    { id: 'bathroom-renovation', title: 'Bathroom Renovation', description: 'Upgrade your bathroom...', icon: <Wrench /> },
    { id: 'custom-cabinetry', title: 'Custom Cabinetry', description: 'Beautiful custom-built cabinets...', icon: <Grid /> },
    { id: 'flooring', title: 'Flooring Installation', description: 'Hardwood, tile, laminate...', icon: <Ruler /> },
    { id: 'interior-painting', title: 'Interior Painting', description: 'Expert interior painting...', icon: <Paintbrush /> },
    { id: 'home-additions', title: 'Home Additions', description: 'Expand your living space...', icon: <PlusSquare /> },
    { id: 'basement-finishing', title: 'Basement Finishing', description: 'Transform your basement...', icon: <Warehouse /> },
    { id: 'outdoor-living', title: 'Outdoor Living Spaces', description: 'Patios, decks, entertainment areas...', icon: <Leaf /> },
    { id: 'demolition', title: 'Demolition Services', description: 'Safe interior/exterior demolition...', icon: <Hammer /> },
    { id: 'exterior-painting', title: 'Exterior Painting', description: 'Protect and beautify...', icon: <Paintbrush /> },
    { id: 'stair-services', title: 'Stair Installation & Repair', description: 'New stairs, railings, refinishing...', icon: <Hammer /> }, // Grouped stairs
    { id: 'drywall-trim', title: 'Drywall & Trim', description: 'Installation, repair, crown molding...', icon: <Home /> }, // Grouped interior
    { id: 'custom-services', title: 'Custom & Specialty', description: 'Unique construction needs...', icon: <Wrench /> },
    // New Exterior & Construction Services
    { id: 'siding', title: 'Siding Installation', description: 'Durable siding solutions...', icon: <Home /> },
    { id: 'deck-building', title: 'Deck Building & Repair', description: 'Custom outdoor spaces...', icon: <Hammer /> },
    { id: 'window-door', title: 'Window & Door Installation', description: 'Energy-efficient upgrades...', icon: <Home /> },
    { id: 'selective-demolition', title: 'Selective Demolition', description: 'Precise removal services...', icon: <Hammer /> },
    { id: 'pergolas', title: 'Pergolas & Gazebos', description: 'Custom outdoor wood structures...', icon: <Leaf /> },
    { id: 'outdoor-kitchens', title: 'Outdoor Kitchens', description: 'Luxurious cooking spaces...', icon: <UtensilsCrossed /> },
    { id: 'sunroom', title: 'Sunroom Additions', description: 'Year-round outdoor enjoyment...', icon: <PlusSquare /> },
    { id: 'roofing', title: 'Roofing & Gutters', description: 'Protection and drainage systems...', icon: <Home /> },
    // Added Residential Services
    { id: 'electrical-upgrades', title: 'Electrical Upgrades', description: 'Modern wiring, panel upgrades, and improved electrical infrastructure...', icon: <Lightbulb /> },
    { id: 'home-office', title: 'Home Office Conversion', description: 'Functional and ergonomic workspace solutions...', icon: <Building2 /> },
    { id: 'aging-in-place', title: 'Aging-in-Place Modifications', description: 'Accessibility improvements for seniors...', icon: <User /> },
    { id: 'garage-conversion', title: 'Garage Conversion', description: 'Transform your garage into usable living space...', icon: <Warehouse /> },
    { id: 'foundation-repair', title: 'Foundation Repair', description: 'Structural improvements and waterproofing...', icon: <HardHat /> },
    { id: 'energy-efficiency', title: 'Energy Efficiency Upgrades', description: 'Insulation, windows, and HVAC improvements...', icon: <Lightbulb /> },
  ];

  // List of BROAD COMMERCIAL service categories
  const broadCommercialServices: CommercialServiceCategory[] = [
    { id: 'renovation', title: 'Renovation / Remodeling', description: 'Updating existing commercial spaces.', icon: <Wrench /> },
    { id: 'fit-out', title: 'Fit-Out / Build-Out', description: 'Interior construction for new or empty spaces.', icon: <Hammer /> },
    { id: 'new-construction', title: 'New Construction', description: 'Building a new commercial structure from ground up.', icon: <Building2 /> },
    { id: 'repair-maintenance', title: 'Repair / Maintenance', description: 'Ongoing or specific repairs for commercial properties.', icon: <Wrench /> },
    { id: 'consultation-design', title: 'Consultation / Design', description: 'Planning, design, and pre-construction services.', icon: <ClipboardList /> },
    { id: 'custom-commercial', title: 'Custom / Other', description: 'Specialized commercial projects not listed above.', icon: <Sparkles /> }
  ];

  // List of SPECIFIC COMMERCIAL services with category relation
  const specificCommercialServices: SpecificCommercialService[] = [
    // Business Spaces
    { id: 'office-renovation', categoryId: 'renovation', title: 'Office Renovation', description: 'Transform your workspace with modern, efficient layouts and designs.', icon: <Building2 /> },
    { id: 'office-fit-out', categoryId: 'fit-out', title: 'Office Fit-Out', description: 'Tailored fit-out solutions for new or existing office spaces.', icon: <Building2 /> },
    { id: 'office-expansion', categoryId: 'renovation', title: 'Office Expansion', description: 'Expand your current office space seamlessly.', icon: <Building2 /> },
    { id: 'office-design', categoryId: 'consultation-design', title: 'Office Design Consult', description: 'Consulting services for optimal office layout and design.', icon: <Building2 /> },
    
    // Retail
    { id: 'retail-fit-out', categoryId: 'fit-out', title: 'Retail Fit-Outs', description: 'Comprehensive buildouts designed to attract customers and maximize sales.', icon: <Store /> },
    { id: 'storefront-renovation', categoryId: 'renovation', title: 'Storefront Renovation', description: 'Updating store facades for better curb appeal and brand presence.', icon: <Store /> },
    { id: 'retail-display', categoryId: 'fit-out', title: 'Custom Display Solutions', description: 'Specialized fixtures and displays for retail merchandise.', icon: <Store /> },
    
    // Hospitality
    { id: 'restaurant-renovation', categoryId: 'renovation', title: 'Restaurant Renovation', description: 'Specialized renovation and design for restaurants, cafes, and food service.', icon: <Coffee /> },
    { id: 'hotel-remodeling', categoryId: 'renovation', title: 'Hotel Remodeling', description: 'Refresh hotel rooms, lobbies, and common areas.', icon: <Hotel /> },
    { id: 'commercial-kitchen', categoryId: 'fit-out', title: 'Commercial Kitchen Installation', description: 'Code-compliant food preparation areas for restaurants and cafeterias.', icon: <UtensilsCrossed /> },
    
    // Healthcare
    { id: 'healthcare-facilities', categoryId: 'fit-out', title: 'Healthcare Facilities', description: 'Custom construction for medical offices, clinics, and healthcare spaces.', icon: <Stethoscope /> },
    { id: 'medical-office-design', categoryId: 'consultation-design', title: 'Medical Office Design', description: 'Specialized design for healthcare environments.', icon: <Stethoscope /> },
    { id: 'medical-equipment', categoryId: 'fit-out', title: 'Medical Equipment Integration', description: 'Installation and infrastructure for specialized medical equipment.', icon: <Stethoscope /> },
    
    // Industrial
    { id: 'warehouse-industrial', categoryId: 'renovation', title: 'Warehouse & Industrial', description: 'Custom solutions for warehouses, manufacturing, and industrial facilities.', icon: <Warehouse /> },
    { id: 'data-center-construction', categoryId: 'new-construction', title: 'Data Center Construction', description: 'Specialized facilities for IT infrastructure and servers.', icon: <Server /> },
    { id: 'clean-room', categoryId: 'fit-out', title: 'Clean Room Construction', description: 'Controlled environments for manufacturing and research.', icon: <Warehouse /> },
    { id: 'loading-dock', categoryId: 'new-construction', title: 'Loading Dock Installation', description: 'Efficient material handling solutions for warehouses.', icon: <Truck /> },
    
    // Education
    { id: 'educational-facilities', categoryId: 'renovation', title: 'Educational Facilities', description: 'Renovations for schools, universities, and educational institutions.', icon: <School /> },
    { id: 'library-renovation', categoryId: 'renovation', title: 'Library Renovation', description: 'Modern updates for library spaces.', icon: <Book /> },
    { id: 'laboratory-construction', categoryId: 'fit-out', title: 'Laboratory Construction', description: 'Specialized environments for research and education.', icon: <School /> },
    { id: 'auditorium-renovation', categoryId: 'renovation', title: 'Auditorium & Theater Renovation', description: 'Acoustically-designed spaces for performances and lectures.', icon: <Film /> },
    
    // Financial
    { id: 'bank-renovation', categoryId: 'renovation', title: 'Bank & Financial', description: 'Security-focused renovations for financial institutions.', icon: <Calculator /> },
    { id: 'vault-construction', categoryId: 'fit-out', title: 'Vault Construction', description: 'Secure storage facilities for banks and financial institutions.', icon: <DollarSign /> },
    { id: 'atm-installation', categoryId: 'fit-out', title: 'ATM Installation', description: 'Secure kiosk construction and integration.', icon: <CreditCard /> },
    
    // Recreation
    { id: 'fitness-center', categoryId: 'fit-out', title: 'Fitness Centers', description: 'Custom build-outs for gyms and fitness facilities.', icon: <Dumbbell /> },
    { id: 'entertainment-venues', categoryId: 'renovation', title: 'Entertainment Venues', description: 'Theaters, bowling alleys, and recreational facilities.', icon: <Film /> },
    { id: 'brewery-winery', categoryId: 'fit-out', title: 'Breweries & Wineries', description: 'Specialized construction for brewing facilities.', icon: <Beer /> },
    { id: 'sports-facilities', categoryId: 'new-construction', title: 'Sports Facilities', description: 'Indoor courts, fields, and specialized sports venues.', icon: <Dumbbell /> },
    
    // Insurance & Professional
    { id: 'insurance-agency', categoryId: 'fit-out', title: 'Insurance Agency Offices', description: 'Professional office spaces for insurance providers.', icon: <ShieldCheck /> },
    
    // Basic Technology
    { id: 'av-integration', categoryId: 'fit-out', title: 'AV Integration', description: 'Audio-visual systems for conference rooms and presentation spaces.', icon: <Tv /> },
    
    // Sustainable Building
    { id: 'green-building', categoryId: 'new-construction', title: 'Green Building & LEED', description: 'Sustainable construction practices and certification support.', icon: <Leaf /> },
    { id: 'energy-audit', categoryId: 'consultation-design', title: 'Commercial Energy Auditing', description: 'Efficiency assessment and improvement recommendations.', icon: <Lightbulb /> },
    
    // Custom
    { id: 'specialty-commercial', categoryId: 'custom-commercial', title: 'Specialty Commercial Projects', description: 'Unique commercial construction needs not listed above.', icon: <Sparkles /> },
  ];

  // Simplified validation: just check if at least one service is selected
  const validateSelections = () => {
    const newErrors: {[key: string]: string} = {};
    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Toggle service selection for either residential or commercial
  const toggleService = (serviceId: string) => {
    const updatedServices = selectedServices.includes(serviceId)
        ? selectedServices.filter(id => id !== serviceId)
        : [...selectedServices, serviceId];
    
    updateFormData({ services: updatedServices });
    
    if (updatedServices.length > 0) {
      setErrors({});
    }
  };

  // Effect to toggle specific commercial services display
  useEffect(() => {
    // Show specific services if a broad category is selected
    if (projectType === 'commercial' && selectedServices.length > 0) {
      setShowSpecificCommercial(true);
    } else {
      setShowSpecificCommercial(false);
    }
  }, [selectedServices, projectType]);

  // Filter specific commercial services based on selected broad categories
  const filteredSpecificServices = specificCommercialServices.filter(service => 
    selectedServices.includes(service.categoryId)
  );

  // Get the display name for the building type ID
  const selectedBuildingTypeName = commercialDetails?.buildingTypeId 
    ? buildingTypeNames[commercialDetails.buildingTypeId] || commercialDetails.buildingTypeId 
    : null;

  // Determine which list of services to display
  const servicesToDisplay = projectType === 'residential' ? residentialServices : broadCommercialServices;
  const sectionTitle = projectType === 'commercial' ? 'Select Service Categories' : 'Select Services';

  return (
    <div className="py-4">
      {/* Display Context Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm space-y-2">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-500 w-32 flex-shrink-0">Project Type:</span>
          <span className={`font-semibold px-2 py-0.5 rounded-md text-xs ${projectType === 'residential' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            {projectType === 'residential' ? 'Residential' : 'Commercial'}
          </span>
        </div>
              
        {projectType === 'commercial' && selectedBuildingTypeName && (
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-500 w-32 flex-shrink-0">Building Type:</span>
            <span className="font-semibold text-gray-900">{selectedBuildingTypeName}</span>
          </div>
        )}
      </div>

      {/* Property/Building Type Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {projectType === 'residential' ? 'Property Type' : 'Building Type'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {projectType === 'residential' 
            ? 'Select the type of property for your project' 
            : 'Select the type of commercial building for your project'}
        </p>

        {projectType === 'residential' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {residentialPropertyTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handlePropertyTypeSelect(type.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  selectedPropertyType === type.id
                    ? 'border-blue-600 bg-blue-50 shadow'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className={`mb-2 flex justify-center ${selectedPropertyType === type.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {type.id === 'single-family' ? renderIcon(Home) : 
                   type.id === 'townhouse' ? renderIcon(Home) : 
                   type.id === 'condo-apt' ? renderIcon(Building2) :
                   type.id === 'multi-family' ? renderIcon(Building2) :
                   type.id === 'garage' ? renderIcon(Warehouse) :
                   renderIcon(Warehouse)}
                </div>
                <div className="text-sm font-medium">
                  {type.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            {/* Building type categories for easier selection */}
            <div className="space-y-6">
              {Object.entries(buildingTypeCategories).map(([category, typeIds]) => (
                <div key={category}>
                  <h3 className="text-md font-medium text-gray-700 mb-2">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {typeIds.map((typeId) => {
                      const buildingType = commercialBuildingTypes.find(bt => bt.id === typeId);
                      if (!buildingType) return null;
                      
                      return (
                        <div
                          key={typeId}
                          onClick={() => handleBuildingTypeSelect(typeId)}
                          className={`p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                            selectedBuildingType === typeId
                              ? 'border-blue-600 bg-blue-50 shadow'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                        >
                          <div className="font-medium">
                            {buildingType.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Selection Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          {sectionTitle}
          <span className="text-red-500 ml-1">*</span>
        </h2>
        <p className="text-sm text-gray-500">
          Choose the primary types of work required for your project. Select all that apply.
        </p>
        {errors.services && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {errors.services}
          </p>
        )}
      </div>

      {/* Service Cards Grid - Consistent Styling */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${errors.services ? 'ring-2 ring-red-300 ring-offset-2 p-1 rounded-lg' : ''}`}>
        {servicesToDisplay.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`group relative flex flex-col justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 h-full ${isSelected ? 'border-blue-600 bg-blue-50/80 shadow-md' : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02]'}`}
            >
              <div> {/* Content Wrapper */}
                <div className={`mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500 transition-colors'}`}>
                  {service.icon ? renderIcon(service.icon, 28, "w-7 h-7") : null}
                </div>
                <h3 className={`font-semibold mb-1 ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {service.description}
                </p>
              </div>
              {/* Selection Checkmark */}
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-blue-600 border-blue-700' : 'bg-white border-gray-300 group-hover:border-blue-400 scale-0 group-hover:scale-100'}`}>
                {renderIcon(Check, 14, isSelected ? 'text-white opacity-100' : 'text-blue-600 opacity-0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Specific Commercial Services Section - Only show if broad categories are selected */}
      {projectType === 'commercial' && showSpecificCommercial && filteredSpecificServices.length > 0 && (
        <div className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Specific Services
            </h2>
            <p className="text-sm text-gray-500">
              Select specific services related to your selected categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecificServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`group relative flex flex-col justify-between p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 h-full ${isSelected ? 'border-blue-600 bg-blue-50/80 shadow-md' : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02]'}`}
                >
                  <div> {/* Content Wrapper */}
                    <div className={`mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500 transition-colors'}`}>
                      {service.icon ? renderIcon(service.icon, 28, "w-7 h-7") : null}
                    </div>
                    <h3 className={`font-semibold mb-1 ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  {/* Selection Checkmark */}
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-blue-600 border-blue-700' : 'bg-white border-gray-300 group-hover:border-blue-400 scale-0 group-hover:scale-100'}`}>
                    {renderIcon(Check, 14, isSelected ? 'text-white opacity-100' : 'text-blue-600 opacity-0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Required Fields Indicator - Moved to bottom for clarity */}
      <div className="mt-6 text-xs text-gray-500">
         <span className="text-red-500">*</span> Indicates required selection
      </div>
    </div>
  );
};

export default ServiceSelection; 