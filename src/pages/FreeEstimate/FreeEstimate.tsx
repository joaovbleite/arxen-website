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
    propertyZip?: string; // Add property zip code field
    propertyCountryCode?: string; // Add property country code for international postal codes
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
    preferredContact: string;
    preferredTime?: 'morning' | 'afternoon' | 'evening' | 'anytime' | '';
    additionalContactInfo?: string;
    countryCode?: string; // Add country code field for international phone numbers
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
  const [otherServiceInput, setOtherServiceInput] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Add formspree form ref
  const formspreeFormRef = React.useRef<HTMLFormElement>(null);

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
    
    // Get additional parameters from the homepage form
    const zipCode = searchParams.get('zip');
    const timelineParam = searchParams.get('initialTimeline');
    const emailParam = searchParams.get('email');
    const customServiceParam = searchParams.get('customService');
    const promoCodeParam = searchParams.get('promo'); // Add promo code from URL parameters
    
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
      
      // Enhanced building type integration - Automatically select related services based on building type
      const buildingTypeToServicesMap: Record<string, string[]> = {
        'office': ['office-renovation', 'commercial-flooring'],
        'retail': ['retail-fit-out', 'storefront-design'],
        'restaurant': ['restaurant-renovation', 'commercial-flooring'],
        'healthcare': ['healthcare-facilities'],
        'warehouse': ['warehouse-industrial', 'warehouse-optimization'],
        'data_center': ['data-center-construction', 'network-infrastructure'],
        'hotel': ['commercial-build-out', 'commercial-flooring'],
        'manufacturing': ['manufacturing-facility-design', 'warehouse-industrial'],
        'school': ['commercial-renovations']
      };
      
      // Add recommended services based on building type if services aren't already selected
      if (buildingTypeToServicesMap[urlBuildingType] && 
          (!initialUpdates.services || initialUpdates.services.length === 0)) {
        initialUpdates.services = buildingTypeToServicesMap[urlBuildingType];
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
      
      // If it's "other" service and we have a custom service description, handle it
      if (initialService === 'other' && customServiceParam) {
        // Make sure "other" or "custom-services" is in the services array
        if (!initialUpdates.services?.includes('other') && !initialUpdates.services?.includes('custom-services')) {
          initialUpdates.services = [...(initialUpdates.services || []), 'other'];
        }
        
        // Set the custom service input (will be picked up by the useEffect)
        setOtherServiceInput(customServiceParam);
        
        // Update the project details description
        initialUpdates.projectDetails = {
          ...(initialUpdates.projectDetails || initialFormData.projectDetails),
          description: `Custom Service: ${customServiceParam}\n\n${initialUpdates.projectDetails?.description || ''}`
        };
      }
    }

    // Add the handling for additional parameters from homepage form
    if (zipCode) {
      // Add zip code to contact info
      initialUpdates.contactInfo = {
        ...(initialUpdates.contactInfo || initialFormData.contactInfo),
        additionalContactInfo: `Zip Code: ${zipCode}\n${initialUpdates.contactInfo?.additionalContactInfo || ''}`
      };
    }

    if (emailParam) {
      // Pre-fill email field
      initialUpdates.contactInfo = {
        ...(initialUpdates.contactInfo || initialFormData.contactInfo),
        email: emailParam
      };
    }

    if (timelineParam) {
      // Map the timeline value from the homepage to the FreeEstimate format
      let timelineValue = 2; // Default
      let timelineUnit: 'days' | 'weeks' | 'months' = 'weeks'; // Default
      
      switch (timelineParam) {
        case 'asap':
          timelineValue = 1;
          timelineUnit = 'weeks';
          break;
        case '1month':
          timelineValue = 1;
          timelineUnit = 'months';
          break;
        case '3months':
          timelineValue = 3;
          timelineUnit = 'months';
          break;
        case 'planning':
          timelineValue = 6;
          timelineUnit = 'months';
          break;
      }
      
      initialUpdates.timeline = {
        value: timelineValue,
        unit: timelineUnit
      };
      
      // Also note the urgency in project details
      initialUpdates.projectDetails = {
        ...(initialUpdates.projectDetails || initialFormData.projectDetails),
        urgency: timelineParam === 'asap' ? 'rush' : 'standard'
      };
    }
    
    if (promoCodeParam) {
      initialUpdates.projectDetails = { 
        ...(initialUpdates.projectDetails || { 
          description: '', 
          urgency: '', 
          scope: '' 
        }),
        promoCode: promoCodeParam.toUpperCase()
      };
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
    
    // Reset other service input if the services array doesn't include "custom-services" or "other"
    if (stepData.services && 
       !stepData.services.includes('custom-services') && 
       !stepData.services.includes('other')) {
      setOtherServiceInput('');
    }
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
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Colors
    const primaryBlue: [number, number, number] = [59, 130, 246]; // Blue-600
    const darkGray: [number, number, number] = [31, 41, 55]; // Gray-800
    const mediumGray: [number, number, number] = [107, 114, 128]; // Gray-500
    const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100
    const green: [number, number, number] = [16, 185, 129]; // Green-500
    
    // Add background header
    pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Add company name in header
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ARXEN', margin, 25);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CONSTRUCTION', margin, 35);
    
    // Add document title on the right
    pdf.setFontSize(16);
    pdf.text('ESTIMATE REQUEST', pageWidth - margin - 60, 25);
    pdf.setFontSize(10);
    pdf.text('CONFIRMATION', pageWidth - margin - 60, 35);
    
    // Reset text color
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    // Add reference box
    let yPos = 65;
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REFERENCE NUMBER', margin + 5, yPos + 10);
    pdf.setFontSize(14);
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.text(referenceNumber, margin + 5, yPos + 18);
    
    // Add date and project type
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - margin - 50, yPos + 10);
    pdf.text(`Type: ${formData.projectType === 'residential' ? 'Residential' : 'Commercial'} Project`, pageWidth - margin - 50, yPos + 18);
    
    // Customer Information Section
    yPos += 40;
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CUSTOMER INFORMATION', margin, yPos);
    
    // Add line under section header
    pdf.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos + 2, margin + 80, yPos + 2);
    
    yPos += 12;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Two column layout for customer info
    const col1X = margin;
    const col2X = margin + contentWidth / 2;
    
    pdf.text(`Name: ${formData.contactInfo.name}`, col1X, yPos);
    pdf.text(`Email: ${formData.contactInfo.email}`, col2X, yPos);
    
    yPos += 8;
    if (formData.contactInfo.phone) {
      pdf.text(`Phone: ${formData.contactInfo.phone}`, col1X, yPos);
    }
    if (formData.contactInfo.company) {
      pdf.text(`Company: ${formData.contactInfo.company}`, col2X, yPos);
    }
    
    // Services Section
    yPos += 20;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REQUESTED SERVICES', margin, yPos);
    pdf.line(margin, yPos + 2, margin + 75, yPos + 2);
    
    yPos += 12;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Services in a box
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    const servicesBoxHeight = formData.services.length * 8 + 10;
    pdf.roundedRect(margin, yPos - 5, contentWidth, servicesBoxHeight, 3, 3, 'F');
    
    formData.services.forEach((serviceId, index) => {
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(`•`, margin + 5, yPos + (index * 8));
      pdf.text(serviceNames[serviceId] || serviceId, margin + 10, yPos + (index * 8));
    });
    
    yPos += servicesBoxHeight + 10;
    
    // Project Details Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROJECT DETAILS', margin, yPos);
    pdf.line(margin, yPos + 2, margin + 60, yPos + 2);
    
    yPos += 12;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    // Primary Goal/Description
    pdf.setFont('helvetica', 'bold');
    pdf.text('Primary Goal:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 8;
    
    const splitDescription = pdf.splitTextToSize(formData.projectDetails.description, contentWidth - 10);
    pdf.text(splitDescription, margin, yPos);
    yPos += splitDescription.length * 5 + 10;
    
    // Project specifications in a grid
    const specBoxHeight = 30;
    const specBoxWidth = (contentWidth - 10) / 3;
    
    // Timeline box
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.roundedRect(margin, yPos, specBoxWidth, specBoxHeight, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('TIMELINE', margin + 5, yPos + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`${formData.timeline.value} ${formData.timeline.unit}`, margin + 5, yPos + 18);
    
    // Scope box
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.roundedRect(margin + specBoxWidth + 5, yPos, specBoxWidth, specBoxHeight, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('SCOPE', margin + specBoxWidth + 10, yPos + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(formData.projectDetails.scope || 'Not specified', margin + specBoxWidth + 10, yPos + 18);
    
    // Urgency box
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.roundedRect(margin + (specBoxWidth * 2) + 10, yPos, specBoxWidth, specBoxHeight, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('URGENCY', margin + (specBoxWidth * 2) + 15, yPos + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(formData.projectDetails.urgency || 'Not specified', margin + (specBoxWidth * 2) + 15, yPos + 18);
    
    yPos += specBoxHeight + 15;
    
    // Additional Notes (if any)
    if (formData.notes) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADDITIONAL NOTES', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 65, yPos + 2);
      
      yPos += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const splitNotes = pdf.splitTextToSize(formData.notes, contentWidth - 10);
      pdf.text(splitNotes, margin, yPos);
      yPos += splitNotes.length * 5 + 10;
    }
    
    // Promo code (if applicable)
    if (formData.projectDetails.promoCode) {
      pdf.setFillColor(green[0], green[1], green[2]);
      pdf.setTextColor(255, 255, 255);
      pdf.roundedRect(margin, yPos, 100, 20, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROMO CODE APPLIED', margin + 5, yPos + 8);
      pdf.setFontSize(12);
      pdf.text(formData.projectDetails.promoCode, margin + 5, yPos + 16);
      
      if (formData.projectDetails.promoCode.toUpperCase() === 'ARX25') {
        pdf.setTextColor(green[0], green[1], green[2]);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text('10% OFF LABOR', margin + 105, yPos + 12);
      }
      
      yPos += 30;
    }
    
    // Footer section
    const footerY = pageHeight - 40;
    
    // Add separator line
    pdf.setDrawColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.setLineWidth(0.1);
    pdf.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
    
    // Contact information in footer
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ARXEN Construction - Your Trusted Remodeling Partner', margin, footerY);
    pdf.text('404-934-9458', margin, footerY + 5);
    pdf.text('teamarxen@gmail.com', margin + 35, footerY + 5);
    pdf.text('www.arxenconstruction.com', margin + 85, footerY + 5);
    
    // Status message
    pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for your estimate request!', pageWidth - margin - 70, footerY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('We will contact you within 24-48 hours', pageWidth - margin - 70, footerY + 5);
    
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
      discount_applied: formData.projectDetails.promoCode?.toUpperCase() === 'ARX25' ? 'YES - 10% OFF LABOR' : 'No',
      preferred_contact: formData.contactInfo.preferredContact,
      additional_notes: formData.notes || 'None',
      to_name: 'ARXEN Construction Team',
      form_source: 'Free Estimate Form'
    };
    
    try {
      // Send email using our email service
      const result = await sendEstimateEmail(templateParams);
      
      console.log('Free estimate form submitted successfully:', result.text);
      
      // Also submit the Formspree form as backup
      if (formspreeFormRef.current) {
        formspreeFormRef.current.submit();
      }
      
      // Show success and complete the submission
      setTimeout(() => {
        setShowSuccessNotification(true);
        
        // Hide success notification and show completion after 2 seconds
        setTimeout(() => {
          setShowSuccessNotification(false);
          setSubmissionComplete(true);
          setIsSubmitting(false);
          
          // Clear saved form if exists
          if (savedFormKey) {
            localStorage.removeItem(`arxen-estimate-${savedFormKey}`);
            setSavedFormKey(null);
          }
        }, 2000);
      }, 1000); // Small delay to ensure form submission
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      
      // Show error notification
      const errorMsg = `There was a problem sending your estimate request. Please try again or contact us directly at teamarxen@gmail.com (Reference: ${referenceNumber})`;
      setErrorMessage(errorMsg);
      setShowErrorNotification(true);
      
      // Hide error notification after 5 seconds
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
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
          return (
            <>
              {renderComponent(ServiceSelection, {
                selectedServices: formData.services,
                projectType: formData.projectType,
                propertyType: formData.propertyType,
                updateFormData: updateFormData,
                commercialDetails: formData.commercialDetails
              })}
            </>
          );
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
            commercialDetails: formData.commercialDetails,
            otherServiceInput: otherServiceInput,
            setOtherServiceInput: setOtherServiceInput,
            showCustomServiceInput: formData.services.some(service => 
              service === 'custom-services' || service === 'other' || service === 'Other' || service === 'custom-commercial'
            )
          });
        case 3:
          return renderComponent(ContactInfo, {
            contactInfo: formData.contactInfo,
            updateFormData: updateFormData,
            projectType: formData.projectType
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
               formData.contactInfo.preferredContact.length > 0;
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
              {/* Progress Indicator */}
              <div className="mb-8">
                {/* Step Counter */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-700">
                    Step {currentStep} of {totalSteps}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentStep === 1 && 'Service Selection'}
                    {currentStep === 2 && 'Project Details'}
                    {currentStep === 3 && 'Contact Information'}
                    {currentStep === 4 && 'Review & Submit'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {/* Step Indicators */}
                <div className="flex justify-between mt-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className="flex flex-col items-center flex-1"
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${currentStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-300 text-gray-500'
                        }
                      `}>
                        {step}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 text-center hidden sm:block">
                        {step === 1 && 'Services'}
                        {step === 2 && 'Details'}
                        {step === 3 && 'Contact'}
                        {step === 4 && 'Review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <div className="mb-8">
                {renderStep()}
              </div>

              {/* Hidden Formspree form for submission in step 4 */}
              {currentStep === 4 && (
                <form 
                  ref={formspreeFormRef}
                  action="https://formspree.io/f/xbloejrb" 
                  method="POST" 
                  style={{ display: 'none' }}
                  target="hidden_iframe"
                  onSubmit={() => {
                    // Set timeout to show success message even if iframe loading takes time
                    setTimeout(() => {
                      setSubmissionComplete(true);
                      setIsSubmitting(false);
                    }, 2000);
                    return true;
                  }}
                >
                  <input type="text" name="name" value={formData.contactInfo.name} readOnly />
                  <input type="email" name="email" value={formData.contactInfo.email} readOnly />
                  <input type="text" name="phone" value={formData.contactInfo.phone} readOnly />
                  <input type="text" name="company" value={formData.contactInfo.company} readOnly />
                  <input type="text" name="reference_number" value={referenceNumber} readOnly />
                  <input type="text" name="project_type" value={formData.projectType} readOnly />
                  <input type="text" name="services" value={formData.services.map(s => serviceNames[s] || s).join(', ')} readOnly />
                  <input type="text" name="description" value={formData.projectDetails.description} readOnly />
                  <input type="text" name="timeline" value={`${formData.timeline.value} ${formData.timeline.unit}`} readOnly />
                  <input type="text" name="preferred_contact" value={formData.contactInfo.preferredContact} readOnly />
                  
                  {/* Add prominent promo code fields */}
                  <input type="text" name="promo_code" value={formData.projectDetails.promoCode || 'None'} readOnly />
                  <input type="text" name="discount_applied" value={formData.projectDetails.promoCode?.toUpperCase() === 'ARX25' ? 'YES - 10% OFF LABOR' : 'No'} readOnly />
                  
                  {/* Add additional notes field */}
                  <input type="text" name="additional_notes" value={formData.notes || 'None'} readOnly />
                  
                  {/* Add urgency and scope fields */}
                  <input type="text" name="urgency" value={formData.projectDetails.urgency || 'Not specified'} readOnly />
                  <input type="text" name="scope" value={formData.projectDetails.scope || 'Not specified'} readOnly />
                  
                  <input type="text" name="form_source" value="Free Estimate Form" readOnly />
                  <input type="text" name="_subject" value={`New Estimate Request - ${formData.projectType} Project - ${referenceNumber}`} readOnly />
                  <input type="text" name="_gotcha" style={{ display: 'none' }} />
                </form>
              )}
              
              {/* Hidden iframe to handle the form submission response */}
              <iframe 
                name="hidden_iframe" 
                id="hidden_iframe" 
                style={{ display: 'none' }} 
                onLoad={() => {
                  if (isSubmitting) {
                    setSubmissionComplete(true);
                    setIsSubmitting(false);
                  }
                }}
              />

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
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Estimate Request
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
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
              aria-label="Close chat"
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
                aria-label="Send message"
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

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-start max-w-sm">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="mt-1 text-sm text-green-700">
                Your estimate request has been submitted successfully. We'll contact you soon!
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="ml-4 flex-shrink-0 text-green-400 hover:text-green-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start max-w-md">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
              <p className="mt-1 text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setShowErrorNotification(false)}
              className="ml-4 flex-shrink-0 text-red-400 hover:text-red-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeEstimate; 