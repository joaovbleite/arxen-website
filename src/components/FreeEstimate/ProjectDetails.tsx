import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Upload, X, Clock, FileText, Lightbulb, Check, Zap, Home, Building, Maximize, Info, Image, MapPin } from 'lucide-react';
import { FormData } from '../../pages/FreeEstimate/FreeEstimate';
import { validateZipCode, checkServiceArea } from '../../utils/validation';

interface ProjectDetailsProps {
  projectDetails: FormData['projectDetails'];
  timeline: FormData['timeline'];
  files: FormData['files'];
  updateFormData: (data: Partial<FormData>) => void;
  services?: string[];
  selectedServiceNames?: string[];
  projectType?: 'residential' | 'commercial';
  commercialDetails?: {
    buildingTypeId?: string;
  };
  otherServiceInput?: string;
  setOtherServiceInput?: React.Dispatch<React.SetStateAction<string>>;
  showCustomServiceInput?: boolean;
}

// AI Suggestion type
interface AISuggestion {
  id: string;
  title: string;
  description: string;
}

// Add Building Type Name Map (Copy from ServiceSelection or use shared utility)
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

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  projectDetails, 
  timeline, 
  files, 
  updateFormData,
  services = [],
  selectedServiceNames = [],
  projectType = 'residential',
  commercialDetails,
  otherServiceInput = '',
  setOtherServiceInput,
  showCustomServiceInput = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  const [serviceAreaWarning, setServiceAreaWarning] = useState<string | null>(null);
  
  // State for guided description fields - Initialize with potentially existing parts if structured
  const [guidedDesc, setGuidedDesc] = useState(() => {
    const desc = projectDetails.description || '';
    const goalMatch = desc.match(/Primary Goal:\n(.*?)\n\n/s);
    const styleMatch = desc.match(/Desired Style\/Feel:\n(.*?)\n\n/s);
    const mustHavesMatch = desc.match(/Must-Haves\/Priorities:\n(.*?)\n\n/s);
    const notesMatch = desc.match(/Additional Notes:\n(.*?)$/s);
    
    // Check if we found any structured fields
    const isStructured = goalMatch || styleMatch || mustHavesMatch || notesMatch;

    return {
      goal: goalMatch?.[1] || '',
      style: styleMatch?.[1] || '',
      mustHaves: mustHavesMatch?.[1] || '',
      // Only populate notes if the specific header was found, otherwise start empty
      additionalNotes: notesMatch?.[1] || '' 
    };
  });

  const handleGuidedChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update local state
    setGuidedDesc(prev => {
      const updatedGuidedDesc = { ...prev, [name]: value };
      
      // Combine all guided fields into a formatted description
      let combinedDescription = '';
      if (updatedGuidedDesc.goal) combinedDescription += `Primary Goal:\n${updatedGuidedDesc.goal}\n\n`;
      if (updatedGuidedDesc.style) combinedDescription += `Desired Style/Feel:\n${updatedGuidedDesc.style}\n\n`;
      if (updatedGuidedDesc.mustHaves) combinedDescription += `Must-Haves/Priorities:\n${updatedGuidedDesc.mustHaves}\n\n`;
      if (updatedGuidedDesc.additionalNotes) combinedDescription += `Additional Notes:\n${updatedGuidedDesc.additionalNotes}`;
      
      // Update the main form data with the combined description
      updateFormData({
        projectDetails: {
          ...projectDetails,
          description: combinedDescription.trim()
        }
      });
      
      return updatedGuidedDesc;
    });
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      projectDetails: {
        ...projectDetails,
        description: e.target.value
      }
    });
  };

  // Handle urgency change
  const handleUrgencyChange = (urgency: 'standard' | 'rush') => {
    updateFormData({
      projectDetails: {
        ...projectDetails,
        urgency
      }
    });
  };

  // Handle scope change
  const handleScopeChange = (scope: 'small' | 'medium' | 'large') => {
    updateFormData({
      projectDetails: {
        ...projectDetails,
        scope
      }
    });
  };

  // Handle timeline value change
  const handleTimelineValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      timeline: {
        ...timeline,
        value: parseInt(e.target.value)
      }
    });
  };

  // Handle timeline unit change
  const handleTimelineUnitChange = (unit: 'days' | 'weeks' | 'months') => {
    updateFormData({
      timeline: {
        ...timeline,
        unit
      }
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process files
  const handleFiles = (fileList: FileList) => {
    setFileError('');
    const newFiles: File[] = [];
    
    // Check for file size limit (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      if (file.size > maxSize) {
        setFileError(`File "${file.name}" exceeds the 10MB size limit.`);
        return;
      }
      
      newFiles.push(file);
    }
    
    // Combine with existing files
    const updatedFiles = [...files, ...newFiles];
    
    // Update form data
    updateFormData({ files: updatedFiles });
  };

  // Remove a file
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    updateFormData({ files: updatedFiles });
  };

  // Format bytes to readable size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // AI suggestion detection based on project description
  useEffect(() => {
    if (projectDetails.description.length > 20) {
      // This would normally be an API call to an AI service
      // Here we're using basic keyword matching as a simulation
      const suggestions: AISuggestion[] = [];
      
      const descriptionLower = projectDetails.description.toLowerCase();
      
      // Kitchen keyword detection
      if (descriptionLower.includes('kitchen') && !descriptionLower.includes('cabinet')) {
        suggestions.push({
          id: 'custom-cabinetry',
          title: 'Custom Cabinetry',
          description: 'Based on your kitchen project, custom cabinets would enhance functionality and aesthetics.'
        });
      }
      
      // Flooring keyword detection
      if (descriptionLower.includes('floor') && !descriptionLower.includes('hardwood')) {
        suggestions.push({
          id: 'hardwood-flooring',
          title: 'Hardwood Flooring',
          description: 'Consider premium hardwood flooring to complement your renovation project.'
        });
      }
      
      // Wall keyword detection
      if ((descriptionLower.includes('wall') || descriptionLower.includes('paint')) && !descriptionLower.includes('interior painting')) {
        suggestions.push({
          id: 'interior-painting',
          title: 'Interior Painting',
          description: 'A fresh coat of paint would complete your project beautifully.'
        });
      }
      
      // Bathroom keyword detection
      if (descriptionLower.includes('bathroom') && !descriptionLower.includes('fixture')) {
        suggestions.push({
          id: 'bathroom-fixtures',
          title: 'Premium Bathroom Fixtures',
          description: 'Upgrade your bathroom with modern fixtures for added luxury and efficiency.'
        });
      }
      
      // Basement keyword detection
      if (descriptionLower.includes('basement') && !descriptionLower.includes('finishing')) {
        suggestions.push({
          id: 'basement-finishing',
          title: 'Basement Finishing',
          description: 'Complete your basement with professional finishing services.'
        });
      }
      
      // Only show suggestions if we have any and if they're not already showing
      if (suggestions.length > 0 && !showSuggestions) {
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
      } else if (suggestions.length === 0) {
        setShowSuggestions(false);
      }
    }
  }, [projectDetails.description, showSuggestions]);

  // Close suggestions popup
  const closeSuggestions = () => {
    setShowSuggestions(false);
  };

  // Get the display name for the building type ID
  const selectedBuildingTypeName = commercialDetails?.buildingTypeId 
    ? buildingTypeNames[commercialDetails.buildingTypeId] || commercialDetails.buildingTypeId 
    : null;

  // Define guided questions based on project type
  const residentialQuestions = [
    { id: 'goal', label: 'What is the main goal of this project?', placeholder: 'E.g., Update outdated kitchen, create more space, fix leaky bathroom...' },
    { id: 'style', label: 'Do you have a desired style or feel?', placeholder: 'E.g., Modern, farmhouse, cozy, minimalist, luxurious...' },
    { id: 'mustHaves', label: 'Any must-have features or priorities?', placeholder: 'E.g., Specific appliance, type of flooring, accessibility features...' }
  ];

  const commercialQuestions = [
    { id: 'goal', label: 'What is the primary business objective for this project?', placeholder: 'E.g., Improve workflow, attract more customers, modernize brand image, expand capacity...' },
    { id: 'style', label: 'Describe the desired atmosphere or brand aesthetic.', placeholder: 'E.g., Professional, welcoming, high-tech, creative, efficient...' },
    { id: 'mustHaves', label: 'Any essential requirements or operational needs?', placeholder: 'E.g., Specific equipment integration, number of workstations, customer flow considerations...' }
  ];

  const guidedQuestions = projectType === 'commercial' ? commercialQuestions : residentialQuestions;

  // Update the zip code validation function to include service area check
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipValue = e.target.value;
    
    // Allow only numbers and hyphen, max 10 chars (12345-6789)
    if (/^[0-9\-]{0,10}$/.test(zipValue)) {
      updateFormData({
        projectDetails: {
          ...projectDetails,
          propertyZip: zipValue
        }
      });
      
      // Only validate if there's input
      if (zipValue.trim()) {
        // Validate format first
        const validation = validateZipCode(zipValue);
        setZipError(validation.isValid ? null : validation.message || null);
        
        // Check service area only if valid format
        if (validation.isValid) {
          const countryCode = projectDetails.propertyCountryCode || 'US';
          const serviceAreaCheck = checkServiceArea(zipValue, countryCode);
          setServiceAreaWarning(!serviceAreaCheck.inServiceArea ? serviceAreaCheck.warningMessage || null : null);
        } else {
          setServiceAreaWarning(null);
        }
      } else {
        setZipError(null);
        setServiceAreaWarning(null);
      }
    }
  };

  return (
    <div className="py-4 relative">
      {/* AI Suggestions Popup */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-blue-600">
                <Lightbulb className="w-6 h-6 mr-2" />
                <h3 className="font-bold text-lg">AI-Suggested Services</h3>
              </div>
              <button 
                onClick={closeSuggestions}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Based on your project description, we recommend considering these additional services:
            </p>
            
            <div className="space-y-3 mb-6">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.id} className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">{suggestion.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{suggestion.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={closeSuggestions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Details</h2>
        <p className="text-gray-600">
          Help us understand your vision by providing some key details about your project.
        </p>
        
        {/* Display Context: Project Type, Building Type, Selected Services/Categories - Refined Styling */}
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg space-y-3 shadow-sm">
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-500 w-36 flex-shrink-0">Project Type:</span>
            <span className="font-semibold text-gray-900">
              {projectType === 'residential' ? 'Residential' : 'Commercial'}
            </span>
          </div>
          
          {projectType === 'commercial' && selectedBuildingTypeName && (
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-500 w-36 flex-shrink-0">Building Type:</span>
              <span className="font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">{selectedBuildingTypeName}</span>
            </div>
          )}
          
          {selectedServiceNames.length > 0 && (
            <div className="flex items-start text-sm">
              <span className="font-medium text-gray-500 w-36 flex-shrink-0 pt-1">
                {projectType === 'commercial' ? 'Service Categories:' : 'Selected Services:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedServiceNames.map((name, index) => (
                  <span key={index} className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Start Revamped Form Sections --- */}
      <div className="space-y-10">

        {/* Section 1: Guided Project Description */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About Your Project <span className="text-red-500">*</span></h3>
          <div className="space-y-6">
            {guidedQuestions.map(q => (
              <div key={q.id}>
                <label htmlFor={`desc-${q.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {q.label}
                </label>
                <textarea
                  id={`desc-${q.id}`}
                  name={q.id} // Use name to update specific field in guidedDesc state
                  value={guidedDesc[q.id as keyof typeof guidedDesc] || ''} // Access state via key
                  onChange={handleGuidedChange}
                  placeholder={q.placeholder}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[60px] resize-y text-sm"
                  rows={2}
                ></textarea>
              </div>
            ))}
             <div>
                <label htmlFor={`desc-additionalNotes`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Notes or Details
                </label>
                <textarea
                  id={`desc-additionalNotes`}
                  name="additionalNotes"
                  value={guidedDesc.additionalNotes || ''}
                  onChange={handleGuidedChange}
                  placeholder="Anything else we should know? Specific dimensions, existing issues, questions you have..."
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y text-sm"
                  rows={3}
                  maxLength={1000} // Increased limit for notes
                ></textarea>
                 <p className="text-xs text-gray-500 mt-1 text-right">{guidedDesc.additionalNotes?.length || 0}/1000 characters</p>
            </div>
          </div>
        </div>

        {/* Section 2: Timeline & Scope */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interactive Urgency/Timeframe */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">Urgency & Timeframe <span className="text-red-500">*</span></label>
              <div className="space-y-4">
                <div 
                  onClick={() => handleUrgencyChange('rush')}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all group ${projectDetails.urgency === 'rush' ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200 hover:border-red-300'}`}
                >
                   <Zap className={`w-6 h-6 mr-3 ${projectDetails.urgency === 'rush' ? 'text-red-600' : 'text-gray-700 group-hover:text-red-500'}`} />
                   <div>
                     <h4 className={`font-medium ${projectDetails.urgency === 'rush' ? 'text-red-700' : 'text-gray-800'}`}>ASAP / Urgent</h4>
                     <p className="text-xs text-gray-600">Need to start within ~2 weeks</p>
                   </div>
                   {projectDetails.urgency === 'rush' && <Check className="w-5 h-5 text-red-600 ml-auto" />}
                </div>
                <div 
                  onClick={() => handleUrgencyChange('standard')}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all group ${projectDetails.urgency === 'standard' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                >
                   <Clock className={`w-6 h-6 mr-3 ${projectDetails.urgency === 'standard' ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-500'}`} />
                   <div>
                     <h4 className={`font-medium ${projectDetails.urgency === 'standard' ? 'text-blue-700' : 'text-gray-800'}`}>Standard</h4>
                     <p className="text-xs text-gray-600">Flexible, typical 4-8 weeks lead time</p>
                   </div>
                   {projectDetails.urgency === 'standard' && <Check className="w-5 h-5 text-blue-600 ml-auto" />}
                </div>
              </div>
              {/* Timeframe slider remains similar */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Project Duration:</label>
                 <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max={timeline.unit === 'days' ? 14 : timeline.unit === 'weeks' ? 12 : 12} // Adjusted max
                      value={timeline.value}
                      onChange={handleTimelineValueChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-blue-600 range-track:bg-gradient-to-r range-track:from-blue-200 range-track:to-blue-400"
                    />
                    <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-md whitespace-nowrap">
                      {timeline.value} {timeline.unit}
                    </span>
                 </div>
                 <div className="flex flex-wrap gap-2 mt-3">
                   {['days', 'weeks', 'months'].map(u => (
                     <button
                       key={u}
                       type="button"
                       onClick={() => handleTimelineUnitChange(u as 'days' | 'weeks' | 'months')}
                       className={`px-2.5 py-0.5 rounded-full text-xs ${timeline.unit === u ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                     >
                       {u.charAt(0).toUpperCase() + u.slice(1)}
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Visual Project Scope */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">Project Scope <span className="text-red-500">*</span></label>
              <div className="space-y-4">
                {[
                  { id: 'small', title: 'Small', desc: 'Single room or minor update', icon: <Home size={24}/> },
                  { id: 'medium', title: 'Medium', desc: 'Full room or multiple small areas', icon: <Building size={24}/> },
                  { id: 'large', title: 'Large', desc: 'Multi-room or whole property', icon: <Maximize size={24}/> },
                ].map(scopeOption => (
                   <div 
                    key={scopeOption.id}
                    onClick={() => handleScopeChange(scopeOption.id as 'small' | 'medium' | 'large')}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all group ${projectDetails.scope === scopeOption.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                   >
                    <div className={`mr-4 p-2 rounded-full ${projectDetails.scope === scopeOption.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                      {scopeOption.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className={`font-medium ${projectDetails.scope === scopeOption.id ? 'text-blue-700' : 'text-gray-800'}`}>{scopeOption.title}</h4>
                      <p className="text-xs text-gray-600">{scopeOption.desc}</p>
                    </div>
                    {projectDetails.scope === scopeOption.id && <Check className="w-5 h-5 text-blue-600 ml-auto flex-shrink-0" />}
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Service Input (conditionally rendered) */}
        {showCustomServiceInput && (
          <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm mt-6 mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Service Details</h3>
            <label htmlFor="otherService" className="block text-sm font-medium text-gray-700 mb-2">
              Please describe the specific service you need
            </label>
            <textarea
              id="otherService"
              value={otherServiceInput || ''}
              onChange={(e) => {
                if (setOtherServiceInput) {
                  setOtherServiceInput(e.target.value);
                  // Also update the project details description
                  updateFormData({
                    projectDetails: {
                      ...projectDetails,
                      description: `Custom Service: ${e.target.value}\n\n${projectDetails.description.replace(/Custom Service:.*\n\n/g, '')}`
                    }
                  });
                }
              }}
              placeholder="Enter the specific service you're looking for (e.g., specialty finish work, unique installation requirements, etc.)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-2">
              <Info className="inline-block w-4 h-4 mr-1" />
              Your detailed description helps us assign the right specialists to your project.
            </p>
          </div>
        )}

        {/* Section 3: File Upload & Optional Info */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
           <h3 className="text-lg font-semibold text-gray-800 mb-4">Supporting Documents</h3>
           
           {/* File Upload Only (Scanner CTA commented out) */}
           <div className="mb-6">
             {/* File Upload Dropzone */}
             <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center flex flex-col items-center justify-center h-full ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} transition-all duration-200`}
                onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-gray-700 mb-3" />
                <p className="text-gray-700 font-medium mb-1 text-sm">
                  Drag & drop files or <button type="button" className="text-blue-600 hover:underline focus:outline-none" onClick={() => fileInputRef.current?.click()}>browse</button>
                </p>
                <p className="text-gray-500 text-xs">Photos, plans, etc. (Max 10MB each)</p>
                <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" id="project-files" name="project-files" />
              </div>
              
             {/* 3D Scanner CTA Card - HIDDEN */}
             {/* 
             <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 flex flex-col items-center justify-center text-center border border-blue-200">
                <Scan className="w-10 h-10 text-blue-600 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-1">Get More Accurate Quotes</h4>
                <p className="text-gray-600 text-xs mb-3">Use our 3D scanner for precise room measurements.</p>
                <button 
                  onClick={handleOpenScanner}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Your Space
                </button>
             </div> 
             */}
           </div>

            {/* File Error */}
            {fileError && <p className="mb-4 text-red-500 text-sm flex items-center"><AlertCircle size={16} className="mr-1"/>{fileError}</p>}
            
            {/* Uploaded Files List (Scanner display removed) */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Attached Files:</h4>
                    {/* Uploaded Files */}
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm border border-gray-200">
                            <div className="flex items-center overflow-hidden mr-2">
                              {file.type.startsWith('image/') ? (
                                  <img src={URL.createObjectURL(file)} alt="preview" className="w-8 h-8 rounded object-cover mr-2 flex-shrink-0" />
                              ) : (
                                  <FileText className="text-gray-500 w-6 h-6 mr-2 flex-shrink-0" />
                              )}
                              <span className="text-gray-800 font-medium truncate mr-2">{file.name}</span>
                              <span className="text-gray-500 text-xs flex-shrink-0">({formatBytes(file.size)})</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeFile(index)} 
                              className="text-gray-700 hover:text-red-500 focus:outline-none flex-shrink-0"
                              aria-label={`Remove file ${file.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

           {/* Promo/Referral */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
             {/* Promo Code */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Code</label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" 
                 placeholder="Optional code" 
                 value={projectDetails.promoCode || ''} 
                 onChange={(e) => updateFormData({ projectDetails: { ...projectDetails, promoCode: e.target.value }})}
                 id="promo-code"
                 name="promoCode"
               />
             </div>
             {/* Referred By */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Referred By (Optional)</label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500" 
                 placeholder="Optional referral name" 
                 value={projectDetails.referredBy || ''} 
                 onChange={(e) => updateFormData({ projectDetails: { ...projectDetails, referredBy: e.target.value }})}
                 id="referred-by"
                 name="referredBy"
               />
             </div>
           </div>
        </div>

      </div>
      {/* --- End Revamped Form Sections --- */}

      {/* Required Fields Notice */}
      <div className="text-sm text-gray-500 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
        Fields marked with <span className="text-red-500 mx-1">*</span> are required
      </div>

      {/* Zip Code Input - Updated to include service area warning and country selection */}
      <div className="col-span-1 mt-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country Selection - This would ideally be a dropdown with country options */}
          <div>
            <label htmlFor="property-country" className="block font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="property-country"
              value={projectDetails.propertyCountryCode || 'US'}
              onChange={(e) => updateFormData({
                projectDetails: {
                  ...projectDetails,
                  propertyCountryCode: e.target.value,
                  // Clear existing warning if country changes
                  ...(projectDetails.propertyZip ? {} : { propertyZip: '' })
                }
              })}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              {/* Add more countries as needed */}
            </select>
          </div>
          
          {/* Zip/Postal Code */}
          <div>
            <label htmlFor="property-zip" className="block font-medium text-gray-700 mb-1">
              {projectDetails.propertyCountryCode === 'US' ? 'Zip Code' : 'Postal Code'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-700" />
              </div>
              <input
                type="text"
                id="property-zip"
                value={projectDetails.propertyZip || ''}
                onChange={handleZipChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  zipError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg`}
                placeholder={`Enter ${projectDetails.propertyCountryCode === 'US' ? 'zip code' : 'postal code'}`}
                required
              />
              {zipError && (
                <div className="text-red-500 text-sm mt-1">
                  {zipError}
                </div>
              )}
              {serviceAreaWarning && !zipError && (
                <div className="text-gray-500 text-sm mt-1 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-gray-400" />
                  {serviceAreaWarning}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {projectDetails.propertyCountryCode === 'US' 
                ? 'Format: 12345 or 12345-6789' 
                : projectDetails.propertyCountryCode === 'CA'
                  ? 'Format: A1A 1A1'
                  : projectDetails.propertyCountryCode === 'GB'
                    ? 'Format: SW1A 1AA'
                    : 'Enter your postal code'}
            </p>
          </div>
        </div>
        
        {/* Extra contextual information about service area */}
        <div className="mt-4 text-sm text-gray-600">
          <p className="flex items-start">
            <Info className="h-4 w-4 mr-1 mt-1 flex-shrink-0 text-blue-500" />
            <span>Our primary service areas include New York and Georgia regions, but we can accommodate projects in many other locations. Enter your postal code to check availability.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 