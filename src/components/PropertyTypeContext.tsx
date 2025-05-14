import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Clock } from 'lucide-react';

// Define the types
type PropertyType = {
  id: string;
  name: string;
};

type BuildingType = {
  id: string;
  name: string;
  icon?: React.ReactNode;
  category?: string;
};

// Context type definition
type PropertyTypeContextType = {
  propertyType: PropertyType | null;
  buildingType: BuildingType | null;
  recentSelections: (PropertyType | BuildingType)[];
  setPropertyType: (type: PropertyType | null) => void;
  setBuildingType: (type: BuildingType | null) => void;
  clearSelection: () => void;
};

// Create the context
const PropertyTypeContext = createContext<PropertyTypeContextType | undefined>(undefined);

// Property type mapping
const propertyTypeMap: Record<string, string> = {
  'single-family': 'Single-Family Home',
  'townhouse': 'Townhouse',
  'condo-apt': 'Condo / Apartment',
  'multi-family': 'Multi-Family Home',
  'garage': 'Garage',
  'shed-barn': 'Shed / Barn'
};

// Building type mapping
const buildingTypeMap: Record<string, string> = {
  'office': 'Office Building',
  'medical': 'Medical Office',
  'dental': 'Dental Office',
  'retail': 'Retail Store',
  'restaurant': 'Restaurant',
  'hotel': 'Hotel',
  'warehouse': 'Warehouse',
  'healthcare': 'Healthcare Facility',
  'fitness': 'Fitness Center',
  'school': 'School or University',
  'bank': 'Banks & Financial',
  'law': 'Law Firms',
  'funeral': 'Funeral Homes',
  'real_estate': 'Real Estate Agencies',
  'insurance': 'Insurance Agencies',
  'accounting': 'Accounting Firms',
  'mixed_use': 'Mixed-Use Buildings',
  'parking_garage': 'Parking Garages'
  // Add more as needed
};

// Provider component
export const PropertyTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [propertyType, setPropertyTypeState] = useState<PropertyType | null>(null);
  const [buildingType, setBuildingTypeState] = useState<BuildingType | null>(null);
  const [recentSelections, setRecentSelections] = useState<(PropertyType | BuildingType)[]>([]);
  const [showIndicator, setShowIndicator] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define available property and building types
  const propertyTypes: PropertyType[] = [
    { id: 'single-family', name: 'Single-Family Home' },
    { id: 'townhouse', name: 'Townhouse' },
    { id: 'condo', name: 'Condo/Apartment' },
    { id: 'multi-family', name: 'Multi-Family' }
  ];
  
  const buildingTypes: BuildingType[] = [
    { id: 'office', name: 'Office Building', category: 'Commercial' },
    { id: 'retail', name: 'Retail Space', category: 'Commercial' },
    { id: 'restaurant', name: 'Restaurant', category: 'Commercial' },
    { id: 'healthcare', name: 'Healthcare Facility', category: 'Commercial' },
    { id: 'industrial', name: 'Industrial Building', category: 'Commercial' }
  ];

  // Initialize from URL and localStorage on component mount
  useEffect(() => {
    // First try to get from URL params
    const searchParams = new URLSearchParams(location.search);
    const urlPropertyType = searchParams.get('property');
    const urlBuildingType = searchParams.get('building');
    
    let shouldUpdateURL = false;
    let updatedPropertyType: PropertyType | null = null;
    let updatedBuildingType: BuildingType | null = null;
    
    if (urlPropertyType) {
      // Find property type by ID
      const found = propertyTypes.find(type => type.id === urlPropertyType);
      if (found) {
        updatedPropertyType = found;
        setPropertyType(found);
      }
    } else if (urlBuildingType) {
      // Find building type by ID
      const found = buildingTypes.find(type => type.id === urlBuildingType);
      if (found) {
        updatedBuildingType = found;
        setBuildingType(found);
      }
    } else {
      // If no URL parameters, check localStorage
      try {
        const savedPropertyType = localStorage.getItem('arxen_selected_property_type');
        const savedBuildingType = localStorage.getItem('arxen_selected_building_type');
        
        if (savedPropertyType) {
          const parsed = JSON.parse(savedPropertyType);
          const found = propertyTypes.find(type => type.id === parsed.id);
          if (found) {
            updatedPropertyType = found;
            setPropertyType(found);
            shouldUpdateURL = true;
          } else {
            // Clean up invalid data
            localStorage.removeItem('arxen_selected_property_type');
          }
        } else if (savedBuildingType) {
          const parsed = JSON.parse(savedBuildingType);
          const found = buildingTypes.find(type => type.id === parsed.id);
          if (found) {
            updatedBuildingType = found;
            setBuildingType(found);
            shouldUpdateURL = true;
          } else {
            // Clean up invalid data
            localStorage.removeItem('arxen_selected_building_type');
          }
        }
      } catch (error) {
        // Handle corrupted localStorage data
        console.error('Error loading saved property/building type:', error);
        localStorage.removeItem('arxen_selected_property_type');
        localStorage.removeItem('arxen_selected_building_type');
      }
    }
    
    // Load recent selections from localStorage
    try {
      const savedRecent = localStorage.getItem('arxen_recent_selections');
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        if (Array.isArray(parsed)) {
          setRecentSelections(parsed);
        } else {
          // Clean up invalid data
          localStorage.removeItem('arxen_recent_selections');
        }
      }
    } catch (error) {
      console.error('Error loading recent selections:', error);
      localStorage.removeItem('arxen_recent_selections');
    }
    
    // Update URL if we loaded from localStorage and not already in URL
    if (shouldUpdateURL) {
      const params = new URLSearchParams(location.search);
      
      // Clear existing property/building params
      params.delete('property');
      params.delete('building');
      
      // Add the appropriate parameter
      if (updatedPropertyType) {
        params.set('property', updatedPropertyType.id);
      } else if (updatedBuildingType) {
        params.set('building', updatedBuildingType.id);
      }
      
      const newSearch = params.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      
      // Use navigate to update URL without causing a page reload
      navigate(newPath, { replace: true });
    }
    
    // Cleanup function
    return () => {
      // Cancel any async operations if needed
    };
  }, [location.search]);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (propertyType) {
      localStorage.setItem('arxen_selected_property_type', JSON.stringify(propertyType));
      localStorage.removeItem('arxen_selected_building_type');
      
      // Add to recent selections if it's not there already
      updateRecentSelections(propertyType);
      
    } else if (buildingType) {
      localStorage.setItem('arxen_selected_building_type', JSON.stringify(buildingType));
      localStorage.removeItem('arxen_selected_property_type');
      
      // Add to recent selections if it's not there already
      updateRecentSelections(buildingType);
      
    } else {
      localStorage.removeItem('arxen_selected_property_type');
      localStorage.removeItem('arxen_selected_building_type');
    }
  }, [propertyType, buildingType]);
  
  // Update recent selections
  const updateRecentSelections = (item: PropertyType | BuildingType) => {
    setRecentSelections(prev => {
      // Filter out this item if it already exists
      const filtered = prev.filter(i => 
        'category' in i && 'category' in item 
          ? i.id !== item.id 
          : 'category' in i || 'category' in item 
            ? true 
            : i.id !== item.id
      );
      
      // Add to the beginning
      const updated = [item, ...filtered].slice(0, 5); // Keep only last 5
      
      // Save to localStorage
      localStorage.setItem('arxen_recent_selections', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Setter functions
  const setPropertyType = (type: PropertyType | null) => {
    setPropertyTypeState(type);
    if (type) {
      setBuildingTypeState(null);
    }
  };

  const setBuildingType = (type: BuildingType | null) => {
    setBuildingTypeState(type);
    if (type) {
      setPropertyTypeState(null);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setPropertyTypeState(null);
    setBuildingTypeState(null);
    
    // Remove URL parameters from current path
    const url = new URL(window.location.href);
    url.searchParams.delete('propertyType');
    url.searchParams.delete('buildingType');
    
    // Navigate to the new URL without the parameters
    navigate(url.pathname + url.search, { replace: true });
  };

  // Context value
  const contextValue: PropertyTypeContextType = {
    propertyType,
    buildingType,
    recentSelections,
    setPropertyType,
    setBuildingType,
    clearSelection
  };

  return (
    <PropertyTypeContext.Provider value={contextValue}>
      {children}
      
      {/* Selection Indicator with Recent Selections */}
      {(propertyType || buildingType) && (
        <div className="fixed bottom-4 right-4 z-20 bg-blue-900 text-white py-2 px-4 rounded-lg shadow-lg flex items-center">
          <span className="mr-3">
            {propertyType 
              ? `Selected: ${propertyType.name}` 
              : buildingType 
                ? `Selected: ${buildingType.name}` 
                : ''}
          </span>
          <button 
            onClick={clearSelection}
            className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"
            aria-label="Clear selection"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Recent Selections Dropdown - shown when no current selection */}
      {!propertyType && !buildingType && recentSelections.length > 0 && (
        <div className="fixed bottom-4 right-4 z-20">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-800 text-white px-3 py-2 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Recent Selections
              </div>
              <button 
                onClick={() => setRecentSelections([])}
                className="text-blue-200 hover:text-white p-0.5 rounded transition-colors"
                aria-label="Clear history"
              >
                <X size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {recentSelections.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center text-sm"
                  onClick={() => {
                    if ('category' in item) {
                      setBuildingType(item as BuildingType);
                    } else {
                      setPropertyType(item as PropertyType);
                    }
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PropertyTypeContext.Provider>
  );
};

// Hook for using the context
export const usePropertyType = () => {
  const context = useContext(PropertyTypeContext);
  if (context === undefined) {
    throw new Error('usePropertyType must be used within a PropertyTypeProvider');
  }
  return context;
};

export default PropertyTypeProvider; 