import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Download, Save, Book, MessageCircle, Building2, Award, ShieldCheck, Clock } from 'lucide-react';
import { ServiceSelection, ProjectDetails, ContactInfo, ReviewSubmit } from '../../components/FreeEstimate';
import { jsPDF } from 'jspdf';
import { sendEstimateEmail } from '../../utils/emailService';

// Types for form data
export interface FormData {
  services: string[];
  projectType: 'residential' | 'commercial';
  projectDetails: {
    description: string;
    urgency: 'standard' | 'rush' | '';
    scope: 'small' | 'medium' | 'large' | '';
    promoCode?: string;
    referredBy?: string;
    referenceProject?: string; // Added to support portfolio requests
  };
  commercialDetails?: {
    buildingTypeId?: string;
  };
  propertyType?: string;
  timeline: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  files: File[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    preferredContact: 'email' | 'phone' | 'message' | '';
    preferredTime?: 'morning' | 'afternoon' | 'evening' | 'anytime' | '';
    additionalContactInfo?: string;
  };
  notes: string;
  promoCode?: string;
}

// Initial form data
const initialFormData: FormData = {
  services: [],
  projectType: 'residential',
  projectDetails: {
    description: '',
    urgency: '',
    scope: '',
  },
  propertyType: '',
  timeline: {
    value: 2,
    unit: 'weeks',
  },
  files: [],
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredContact: '',
    preferredTime: '',
    additionalContactInfo: '',
  },
  notes: '',
  promoCode: '',
};

// Map service IDs to readable names
const serviceNames: Record<string, string> = {
  'kitchen-remodeling': 'Kitchen Remodeling',
  'bathroom-renovation': 'Bathroom Renovation',
  'custom-cabinetry': 'Custom Cabinetry',
  'flooring': 'Flooring Installation',
  'interior-painting': 'Interior Painting',
  'home-additions': 'Home Additions',
  'basement-finishing': 'Basement Finishing',
  'demolition': 'Demolition Services',
  'exterior-painting': 'Exterior Painting',
  'cabinet-painting': 'Cabinet Painting',
  'stair-painting': 'Stair Painting & Staining',
  'hardwood': 'Hardwood Flooring',
  'tile': 'Tile Installation',
  'luxury-vinyl': 'Luxury Vinyl Flooring',
  'carpet': 'Carpet Installation',
  'laminate': 'Laminate Flooring',
  'engineered-hardwood': 'Engineered Hardwood',
  'stone-flooring': 'Stone Flooring',
  'stair-installation': 'Stair Installation/Repair',
  'railing-installation': 'Railing Installation',
  'stair-refinishing': 'Stair Refinishing',
  'custom-stairs': 'Custom Stair Design',
  'drywall': 'Drywall Installation & Repair',
  'crown-molding': 'Crown Molding & Trim',
  'outdoor-living': 'Outdoor Living Spaces',
  'siding': 'Siding Installation',
  'deck': 'Deck Building & Repair',
  'windows': 'Window & Door Installation',
  'selective-demolition': 'Selective Demolition',
  'site-prep': 'Site Preparation',
  'debris-removal': 'Debris Removal',
  'office-renovation': 'Office Renovation',
  'retail-fit-out': 'Retail Fit-Outs',
  'commercial-build-out': 'Commercial Build-Outs',
  'restaurant-renovation': 'Restaurant Renovation',
  'healthcare-facilities': 'Healthcare Facilities',
  'warehouse-industrial': 'Warehouse & Industrial',
  'custom-services': 'Custom & Specialty Services',
  'hardwood-flooring': 'Hardwood Flooring',
  'tile-flooring': 'Tile Installation',
  'luxury-vinyl-flooring': 'Luxury Vinyl Flooring',
  'custom-stair-design': 'Custom Stair Design',
  'drywall-installation': 'Drywall Installation & Repair'
};

// Add Building Type Name Map (similar to serviceNames)
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
  // Search only below - add if needed for display
  apartments: 'Apartment Complexes',
  self_storage: 'Self-Storage Facilities',
};

// Map for Broad Commercial Service Categories
const broadCommercialServiceNames: Record<string, string> = {
  renovation: 'Renovation / Remodeling',
  'fit-out': 'Fit-Out / Build-Out',
  'new-construction': 'New Construction',
  'repair-maintenance': 'Repair / Maintenance',
  'consultation-design': 'Consultation / Design',
  'custom-commercial': 'Custom / Other',
};

const FreeEstimate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [savedFormKey, setSavedFormKey] = useState<string | null>(null);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Total number of steps
  const totalSteps = 4;

  // Generate a reference number on component mount
  useEffect(() => {
    const generateReferenceNumber = () => {
      const prefix = 'ARX';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${prefix}-${timestamp}-${random}`;
    };

    setReferenceNumber(generateReferenceNumber());
    
    // Check for saved form data or URL parameters
    const searchParams = new URLSearchParams(location.search);
    const savedKey = searchParams.get('saved');
    const urlProjectType = searchParams.get('projectType');
    const urlBuildingType = searchParams.get('buildingType');
    const initialService = searchParams.get('initialService');
    
    if (savedKey) {
      loadSavedForm(savedKey);
      setSavedFormKey(savedKey);
      return; 
    }
    
    let initialUpdates: Partial<FormData> = {};

    // Handle state data if it exists (passed from Request Similar Project)
    if (location.state && typeof location.state === 'object') {
      const state = location.state as any;
      
      if (state.projectDetails && typeof state.projectDetails === 'object') {
        initialUpdates.projectDetails = {
          ...(initialFormData.projectDetails),
          ...state.projectDetails
        };

        // Log that we received project details
        console.log('Received project details from portfolio page:', state.projectDetails);
      }
      
      // Check for directly specified services in state (new direct method from portfolio)
      if (state.services && Array.isArray(state.services)) {
        initialUpdates.services = state.services;
        console.log('Using services directly from state:', state.services);
      }
      // Fallback to category-based service selection
      else if (state.projectCategory) {
        // If projectCategory is specified in state, use it to set services
        const categoryToServiceMap: Record<string, string[]> = {
          'Kitchen': ['kitchen-remodeling', 'custom-cabinetry'],
          'Bathroom': ['bathroom-renovation'],
          'Living Space': ['flooring', 'interior-painting'],
          'Commercial': ['office-renovation', 'commercial-build-out'],
          'Outdoor': ['deck', 'outdoor-living'],
          'Retail': ['retail-fit-out'],
          'Bedroom': ['interior-painting', 'flooring'],
          'Basement': ['basement-finishing'],
          'Living Room': ['interior-painting', 'flooring']
        };
        
        const serviceTypes = categoryToServiceMap[state.projectCategory] || [];
        if (serviceTypes.length > 0) {
          initialUpdates.services = serviceTypes;
          console.log('Using services from category mapping:', serviceTypes);
        }
      }
    }

    if (urlProjectType === 'residential' || urlProjectType === 'commercial') {
      initialUpdates.projectType = urlProjectType;
    }
    
    if (urlBuildingType && urlProjectType === 'commercial') {
      initialUpdates.commercialDetails = { buildingTypeId: urlBuildingType };
      const buildingName = buildingTypeNames[urlBuildingType] || urlBuildingType;
      
      // Only update description if it hasn't been set by project details from state
      if (!initialUpdates.projectDetails?.description) {
        initialUpdates.projectDetails = {
          ...(initialUpdates.projectDetails || initialFormData.projectDetails),
          description: `Request related to ${buildingName}.\n\nProject Description:\n`
        };
      }
    }
    
    // Handle initialService parameter (from Request Similar Project or other sources)
    if (initialService) {
      // Map project ID to service type(s)
      const projectToServiceMap: Record<string, string[]> = {
        'kitchen-transformation': ['kitchen-remodeling', 'custom-cabinetry'],
        'bathroom-transformation': ['bathroom-renovation'],
        'basement-remodel': ['basement-finishing'],
        'home-addition': ['home-additions'],
        'outdoor-living': ['deck', 'outdoor-living'],
        'retail-renovation': ['retail-fit-out', 'commercial-build-out']
      };
      
      // Add mapped services or fallback to the initialService as a service itself
      const mappedServices = projectToServiceMap[initialService] || 
                            (serviceNames[initialService] ? [initialService] : []);
      
      if (mappedServices.length > 0) {
        initialUpdates.services = [...(initialUpdates.services || []), ...mappedServices];
      }
    }


    
    if (Object.keys(initialUpdates).length > 0) {
      setFormData(prev => ({ ...prev, ...initialUpdates }));
    }

  }, [location.search]);

  // Handle form data changes
  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Save form progress
  const saveProgress = () => {
    // Generate a unique key for this saved form
    const key = `estimate-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Prepare data for saving (files can't be saved directly)
    const savableData = {
      ...formData,
      files: [], // Remove files as they can't be stored in localStorage
      currentStep
    };
    
    // Save to localStorage
    localStorage.setItem(`arxen-estimate-${key}`, JSON.stringify(savableData));
    setSavedFormKey(key);
    
    // Create a shareable URL
    const url = `${window.location.origin}/free-estimate?saved=${key}`;
    
    // Copy URL to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(`Your progress has been saved. A link has been copied to your clipboard that you can use to return to this form later.`);
      })
      .catch(() => {
        alert(`Your progress has been saved. Return to this form later using this key: ${key}`);
      });
  };

  // Load saved form
  const loadSavedForm = (key: string) => {
    const savedData = localStorage.getItem(`arxen-estimate-${key}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({
          ...parsedData,
          files: [] // Files couldn't be saved
        });
        setCurrentStep(parsedData.currentStep || 1);
        alert('Your saved form data has been loaded.');
      } catch (error) {
        console.error('Error loading saved form:', error);
        alert('Could not load your saved data.');
      }
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Add header
    pdf.setFontSize(22);
    pdf.setTextColor(0, 51, 102); // Dark Blue
    pdf.text('Arxen Construction Estimate Request', 20, 20);
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0); // Black
    pdf.text(`Reference Number: ${referenceNumber}`, 20, 30);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 38);
    pdf.text(`Project Type: ${formData.projectType === 'residential' ? 'Residential' : 'Commercial'}`, 20, 46);
    
    // Add services
    pdf.setFontSize(16);
    pdf.setTextColor(0, 51, 102); // Dark Blue
    pdf.text('Requested Services:', 20, 58);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Black
    let yPos = 66;
    formData.services.forEach(serviceId => {
      pdf.text(`• ${serviceNames[serviceId] || serviceId}`, 25, yPos);
      yPos += 7;
    });
    
    // Add project details
    pdf.setFontSize(16);
    pdf.setTextColor(0, 51, 102); // Dark Blue
    pdf.text('Project Details:', 20, yPos + 5);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Black
    yPos += 13;
    
    // Wrap description text to avoid overflow
    const splitDescription = pdf.splitTextToSize(formData.projectDetails.description, 170);
    pdf.text(splitDescription, 20, yPos);
    yPos += splitDescription.length * 7 + 5;
    
    pdf.text(`Timeline: ${formData.timeline.value} ${formData.timeline.unit}`, 20, yPos);
    yPos += 7;
    pdf.text(`Scope: ${formData.projectDetails.scope || 'Not specified'}`, 20, yPos);
    yPos += 7;
    pdf.text(`Urgency: ${formData.projectDetails.urgency || 'Not specified'}`, 20, yPos);
    yPos += 15;
    
    // Add contact information
    pdf.setFontSize(16);
    pdf.setTextColor(0, 51, 102); // Dark Blue
    pdf.text('Contact Information:', 20, yPos);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Black
    yPos += 10;
    pdf.text(`Name: ${formData.contactInfo.name}`, 20, yPos);
    yPos += 7;
    pdf.text(`Email: ${formData.contactInfo.email}`, 20, yPos);
    yPos += 7;
    if (formData.contactInfo.phone) {
      pdf.text(`Phone: ${formData.contactInfo.phone}`, 20, yPos);
      yPos += 7;
    }
    if (formData.contactInfo.company) {
      pdf.text(`Company: ${formData.contactInfo.company}`, 20, yPos);
      yPos += 7;
    }
    
    // Add notes if any
    if (formData.notes) {
      yPos += 8;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 102); // Dark Blue
      pdf.text('Additional Notes:', 20, yPos);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Black
      yPos += 10;
      const splitNotes = pdf.splitTextToSize(formData.notes, 170);
      pdf.text(splitNotes, 20, yPos);
    }
    
    // Add footer
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128); // Gray
    pdf.text('Arxen Construction - Your Trusted Remodeling Partner', 20, 280);
    pdf.text('Phone: 404-934-9458 | Email: sustenablet@gmail.com', 20, 285);
    
    // Save the PDF
    pdf.save(`Arxen-Estimate-${referenceNumber}.pdf`);
  };

  // Handle chat message submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // In a real app, this would send the message to the server
    setChatMessage('');
    
    // Simulate response
    setTimeout(() => {
      alert("Thank you for your message. A team member will respond shortly!");
      setShowChatWidget(false);
    }, 500);
  };

  // Submit the form - Updated to use our email service
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Prepare data to submit
    const dataToSubmit = {
      ...formData,
      referenceNumber,
      submissionDate: new Date().toISOString()
    };
    
    // Prepare email template parameters
    const templateParams = {
      from_name: formData.contactInfo.name,
      from_email: formData.contactInfo.email,
      phone: formData.contactInfo.phone || 'Not provided',
      company: formData.contactInfo.company || 'Not provided',
      reference_number: referenceNumber,
      service_list: formData.services.map(s => serviceNames[s] || s).join(', '),
      project_type: formData.projectType,
      project_description: formData.projectDetails.description,
      urgency: formData.projectDetails.urgency,
      scope: formData.projectDetails.scope,
      timeline: `${formData.timeline.value} ${formData.timeline.unit}`,
      promo_code: formData.projectDetails.promoCode || 'None',
      preferred_contact: formData.contactInfo.preferredContact,
      to_name: 'ARXEN Construction Team',
      form_source: 'Free Estimate Form'
    };
    
    try {
      // Send email using our email service
      const result = await sendEstimateEmail(templateParams);
      
      console.log('Free estimate form submitted successfully:', result.text);
      setSubmissionComplete(true);
      console.log('Form submitted:', dataToSubmit); // Log combined data
      if (savedFormKey) {
        localStorage.removeItem(`arxen-estimate-${savedFormKey}`);
        setSavedFormKey(null);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was a problem sending your estimate request. Please try again or contact us directly at teamarxen@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and start over
  const handleStartOver = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmissionComplete(false);
    
    // Generate a new reference number
    const generateReferenceNumber = () => {
      const prefix = 'ARX';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${prefix}-${timestamp}-${random}`;
    };
    
    setReferenceNumber(generateReferenceNumber());
  };

  // Safely render a component with error boundary
  const renderComponent = (Component: React.FC<any>, props: any) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error("Error rendering component:", error);
      return <div className="p-4 bg-red-100 text-red-800 rounded">Error loading this component. Please try refreshing the page.</div>;
    }
  };

  // Render the current step
  const renderStep = () => {
    try {
      switch (currentStep) {
        case 1:
          return renderComponent(ServiceSelection, {
            selectedServices: formData.services,
            projectType: formData.projectType,
            propertyType: formData.propertyType,
            updateFormData: updateFormData,
            commercialDetails: formData.commercialDetails
          });
        case 2:
          // Compute selected service names (assuming services are IDs of broad categories for commercial)
          const serviceNameMap = formData.projectType === 'commercial' 
            ? broadCommercialServiceNames // Use a new map for broad commercial categories
            : serviceNames; // Use existing map for residential
            
          const selectedServiceNames = formData.services
            .map(id => serviceNameMap[id] || id) // Get name or fallback to id
            .filter(name => !!name); // Remove any potential nulls/undefined
            
          return renderComponent(ProjectDetails, {
            projectDetails: formData.projectDetails,
            timeline: formData.timeline,
            files: formData.files,
            updateFormData: updateFormData,
            services: formData.services,
            selectedServiceNames: selectedServiceNames,
            projectType: formData.projectType,
            commercialDetails: formData.commercialDetails
          });
        case 3:
          return renderComponent(ContactInfo, {
            contactInfo: formData.contactInfo,
            updateFormData: updateFormData
          });
        case 4:
          return renderComponent(ReviewSubmit, {
            formData: formData,
            referenceNumber: referenceNumber,
            updateFormData: updateFormData
          });
        default:
          return null;
      }
    } catch (error) {
      console.error("Error in renderStep:", error);
      return <div className="p-4 bg-red-100 text-red-800 rounded">Something went wrong. Please try refreshing the page.</div>;
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Check if the current step is valid and user can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.services.length > 0;
      case 2:
        return formData.projectDetails.description.trim().length > 0 && 
               formData.projectDetails.urgency !== '' && 
               formData.projectDetails.scope !== '';
      case 3:
        return formData.contactInfo.name.trim().length > 0 && 
               formData.contactInfo.email.trim().length > 0 && 
               formData.contactInfo.preferredContact !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">


      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header - Enhanced Conditional Header */}
        <div className="mb-12">
          {formData.projectType === 'commercial' ? (
            // Enhanced Commercial Header
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg shadow border border-gray-200 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 text-left">
                  <div className="flex items-center mb-3">
                     <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                     <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      Commercial Project Consultation
                     </h1>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    Partner with our experienced team to plan and execute your next commercial renovation or build-out. Request a detailed consultation and estimate today.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <Award size={16} className="mr-2 text-yellow-500" />
                      Experienced Teams
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <ShieldCheck size={16} className="mr-2 text-green-500" />
                      Licensed & Insured
                    </span>
                    <span className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <Clock size={16} className="mr-2 text-blue-500" />
                      Reliable Timelines
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center">
                   {/* Placeholder for image or large icon */}
                   <Building2 className="w-24 h-24 text-gray-300 opacity-80" />
                </div>
              </div>
            </div>
          ) : (
            // Standard Residential Header
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Free Construction Estimate
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get a personalized estimate for your home remodeling or construction project
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!submissionComplete && (
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-1 
                      ${index + 1 < currentStep ? 'bg-blue-600 text-white' : 
                        index + 1 === currentStep ? 'border-2 border-blue-600 text-blue-600' : 
                        'border-2 border-gray-300 text-gray-400'}`}
                  >
                    {index + 1 < currentStep ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <span className="text-sm hidden sm:block">
                    {index === 0 ? 'Services' : 
                     index === 1 ? 'Project Details' : 
                     index === 2 ? 'Contact Info' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 mb-8">
          {submissionComplete ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-lg text-gray-700 mb-6">
                Your estimate request has been submitted successfully. <br />
                Reference Number: <span className="font-bold">{referenceNumber}</span>
              </p>
              <p className="text-md text-gray-600 mb-8">
                Our team will review your project details and contact you within 24-48 hours to schedule an on-site consultation.
              </p>
              
              {/* Download PDF & Prep Guide Links */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h3>
                
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <button
                    onClick={generatePDF}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    <Download size={18} className="mr-2" />
                    Download Estimate Summary
                  </button>
                </div>
                
                <div className="text-left mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Preparing for Your Consultation:</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Collect photos of your space and any inspiration images</li>
                    <li>Note down specific questions or concerns about your project</li>
                    <li>Consider your budget range and timeline expectations</li>
                    <li>Think about material preferences or specific requirements</li>
                  </ul>
                </div>
                
                <a 
                  href="/consultation-prep-guide" 
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Book size={16} className="mr-1" />
                  View Complete Consultation Preparation Guide
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Return to Home
                </button>
                <button
                  onClick={handleStartOver}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Request Another Estimate
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Current Step Content */}
              <div className="mb-8">
                {renderStep()}
              </div>

              {/* Save Progress Button */}
              {currentStep > 1 && (
                <div className="flex justify-center mb-6">
                  <button
                    onClick={saveProgress}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Save size={16} className="mr-2" />
                    Save & Continue Later
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                      !canProceed()
                        ? 'bg-blue-300 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Estimate Request'}
                    {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a> or call us at <a href="tel:404-934-9458" className="text-blue-600 hover:underline">404-934-9458</a>
          </p>
        </div>
      </div>

      {/* Quick Chat Widget */}
      <div className={`fixed bottom-6 right-6 z-30 transition-all duration-300 ${showChatWidget ? 'scale-100' : 'scale-0'}`}>
        <div className="bg-white rounded-lg shadow-xl w-80 overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">Chat with Us</h3>
            <button 
              onClick={() => setShowChatWidget(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
            <div className="bg-blue-100 rounded-lg p-3 mb-4 max-w-[80%]">
              <p className="text-sm">Hi there! How can we help with your estimate request?</p>
            </div>
          </div>
          <form onSubmit={handleChatSubmit} className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChatWidget(!showChatWidget)}
        className="fixed bottom-6 right-6 z-20 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        style={{ display: showChatWidget ? 'none' : 'block' }}
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default FreeEstimate; 