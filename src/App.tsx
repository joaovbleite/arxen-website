import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { Hammer, CheckCircle, Phone, Mail, MapPin, Clock, Shield, ArrowRight, Star, ChevronRight, Check, Camera, Box, ClipboardList, ArrowLeft, Home, ChevronDown, DollarSign, Users, Clipboard, Building2, Settings, Search, X, FileText, ShoppingBag, Factory, UtensilsCrossed, Stethoscope, Package, Heart, MessageSquare, Award, Tag, Scan, Calendar } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Loader2, ChevronsRight, Send } from 'lucide-react';
// Use lazy loading for route components
const HardwoodService = lazy(() => import('./pages/HardwoodService'));
const KitchenRemodeling = lazy(() => import('./pages/KitchenRemodeling'));
const BathroomRemodeling = lazy(() => import('./pages/BathroomRemodeling'));
const ServiceTemplate = lazy(() => import('./pages/ServiceTemplate'));
const Contact = lazy(() => import('./pages/Contact'));
const CommercialQuote = lazy(() => import('./pages/CommercialQuote'));
const ResidentialQuote = lazy(() => import('./pages/ResidentialQuote'));
// Remove imports that don't exist and clean up the code
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
import TestimonialSlider from './components/TestimonialSlider';
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Residential = lazy(() => import('./pages/Residential'));
const Offers = lazy(() => import('./pages/Offers'));
// import VisualizeIt from './pages/VisualizeIt'; // Already commented
// import MyProjects from './pages/MyProjects'; // Commenting out MyProjects import
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogCategory = lazy(() => import('./pages/BlogCategory'));
const CategoryServices = lazy(() => import('./pages/CategoryServices'));
const CommercialServicePage = lazy(() => import('./pages/CommercialServicePage'));
const CustomCabinetryPage = lazy(() => import('./pages/CustomCabinetryPage'));
const FlooringServicesPage = lazy(() => import('./pages/FlooringServicesPage'));
const Financing = lazy(() => import('./pages/Financing'));
const FreeEstimate = lazy(() => import('./pages/FreeEstimate/FreeEstimate'));
import Footer from './components/Footer';
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound'));
import CookieConsent from './components/CookieConsent';
import PromoModal from './components/PromoModal';
import ChatBot from './components/ChatBot';
import HomeSEO from './components/HomeSEO';
import { allTestimonials } from './data/testimonials';
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));
const FAQ = lazy(() => import('./pages/FAQ'));
import PropertyTypeProvider from './components/PropertyTypeContext';
import ReviewForm from './components/ReviewForm';
import LoadingIndicator from './components/LoadingIndicator';
import { sendContactEmail } from './utils/emailService';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { validateZipCode } from './utils/validation';
// Define Service type locally based on usage
interface Service {
  type?: 'category' | 'service' | 'page'; // Added 'page' to allowed types
  title: string;
  path: string;
  description: string;
  category?: string; // Optional, used in search results for services
  image?: string; // Optional, based on services_new_structure definition
  features?: string[]; // Optional
  benefits?: string[]; // Optional
  processSteps?: { title: string; description: string }[]; // Optional
  galleryImages?: string[]; // Optional
}

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Set loading to true whenever pathname changes
    setLoading(true);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Always ensure a minimum loading time for better user experience
    const minLoadingTime = 800; // milliseconds
    const startTime = Date.now();
    
    // Simulate page load completion with minimum time
    const timer = setTimeout(() => {
      // Calculate time elapsed
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < minLoadingTime) {
        // If less than minimum time has passed, wait for the remainder
        setTimeout(() => {
          setLoading(false);
        }, minLoadingTime - elapsedTime);
      } else {
        // Minimum time already passed, hide immediately
        setLoading(false);
      }
    }, 200); // Initial check after 200ms
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  // Return the LoadingIndicator component
  return <LoadingIndicator isLoading={loading} />;
}

// Add CountdownTimer component
  const CountdownTimer = () => {
  // Set a dynamic end date for the promotion (7 days and 14 hours from now)
  const calculateEndDate = () => {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7); // Add 7 days
    endDate.setHours(now.getHours() + 14); // Add 14 hours
    return endDate.getTime();
  };
  
  const PROMO_END_DATE = calculateEndDate();
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Calculate and update time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = PROMO_END_DATE - now;
      
      if (difference <= 0) {
        setIsExpired(true);
        return 0;
      }
      
      return Math.floor(difference / 1000); // convert to seconds
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format seconds into days, hours, minutes, seconds
  const days = Math.floor(timeLeft / (60 * 60 * 24));
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;
  
  // Format the time for display
  const formattedTime = isExpired 
    ? "OFFER EXPIRED" 
    : days > 0 
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <span className={`font-mono ${isExpired ? 'text-red-500' : ''}`}>{formattedTime}</span>
  );
};

function App() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHomePage, setIsHomePage] = useState(true);
  const location = window.location.pathname;

  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  
  // State for homepage quote form
  const [homeZip, setHomeZip] = useState('');
  const [homeZipError, setHomeZipError] = useState<string | null>(null);
  const [homeService, setHomeService] = useState('');
  const [homeCustomService, setHomeCustomService] = useState('');
  const [homeTimeline, setHomeTimeline] = useState('');
  const [homeEmail, setHomeEmail] = useState('');
  const [homeKeepUpdated, setHomeKeepUpdated] = useState(false);

  // Define a type for the contact form status
  type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';
  
  // State for homepage contact form
  const [homeContactName, setHomeContactName] = useState('');
  const [homeContactEmail, setHomeContactEmail] = useState('');
  const [homeContactMessage, setHomeContactMessage] = useState('');
  const [homeContactStatus, setHomeContactStatus] = useState<ContactFormStatus>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null); // State to track focused field
  const [homeContactPreferredMethods, setHomeContactPreferredMethods] = useState<string[]>(['email']); // Updated to array for multiple selections
  const [homeContactPhone, setHomeContactPhone] = useState(''); // Added new state
  
  // Form validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // State for services filter type
  const [serviceFilterType, setServiceFilterType] = useState<'all' | 'commercial' | 'residential'>('all');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  
  // State to track if user has swiped the services slider
  const [hasSwipedServices, setHasSwipedServices] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('arxen_has_swiped_services') === 'true';
  });

  const [isPageLoading, setIsPageLoading] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    setIsHomePage(location === '/');
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) return;
      
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrolledPastThreshold = currentScrollPos > 60;
      
      setVisible(!isScrollingDown || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up any other potential listeners
      document.removeEventListener('mousemove', handleScroll);
    };
  }, [prevScrollPos, visible, isHomePage]);

  const testimonials = allTestimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      // Clean up any pending state updates
      setCurrentTestimonial(current => current);
    };
  }, [testimonials.length]);

  const services_new_structure = [
    // 1. Remodeling
    {
      category: "Remodeling",
      services: [
        { title: "Kitchen Remodeling", description: "Complete kitchen transformations", path: "/services/kitchen-remodeling", image: "https://images.unsplash.com/photo-1556913088-485a1b37190a", features: ["Custom design", "Cabinet installation", "Countertop replacement", "Appliance integration"], benefits: ["Increased home value", "Improved functionality", "Modern aesthetics", "Personalized space"], processSteps: [ { title: "Consultation", description: "Discuss goals and budget" }, { title: "Design Phase", description: "Create detailed plans" }, { title: "Construction", description: "Execute the remodel" }, { title: "Final Walkthrough", description: "Ensure satisfaction" } ], galleryImages: [ "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", "https://images.unsplash.com/photo-1556913088-485a1b37190a", "https://images.unsplash.com/photo-1579811520974-4f41f89a1f39" ] },
        { title: "Bathroom Remodeling", description: "Modern bathroom renovations", path: "/services/bathroom-remodeling", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80", features: ["Fixture upgrades", "Tile work", "Vanity installation", "Lighting solutions"], benefits: ["Enhanced relaxation", "Increased property value", "Better space utilization", "Improved hygiene"], processSteps: [], galleryImages: [] },
        { title: "Basement Finishing", description: "Custom basement spaces", path: "/services/basement-finishing", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a", features: ["Layout design", "Insulation", "Drywall & flooring", "Egress windows"], benefits: ["Added living area", "Entertainment space", "Potential rental income", "Increased home value"], processSteps: [], galleryImages: [] },
        { title: "Room Additions", description: "Expand your living space", path: "/services/room-additions", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e", features: ["Foundation work", "Framing", "Roofing integration", "Interior finishing"], benefits: ["More square footage", "Customized space", "Avoids moving costs", "Boosts property value"], processSteps: [], galleryImages: [] },
        { 
          title: "Whole Home Renovation", 
          description: "Complete home transformation", 
          path: "/services/whole-home-renovation", 
          image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80", 
          features: [
            "Full interior redesign",
            "Open-concept conversions",
            "Multiple room renovations",
            "Structural modifications",
            "Complete finish updates"
          ],
          benefits: [
            "Unified design aesthetic",
            "Modernized entire home",
            "Increased property value",
            "Improved layout and flow",
            "Better energy efficiency"
          ],
          processSteps: [
            { title: "Initial Consultation", description: "Discuss your vision and needs for the entire home" },
            { title: "Design Development", description: "Create comprehensive plans for all spaces" },
            { title: "Phased Construction", description: "Implement renovations in logical sequence" },
            { title: "Finishing & Detailing", description: "Add cohesive finishes and details throughout" },
            { title: "Final Inspection", description: "Complete walkthrough of all renovated spaces" }
          ],
          galleryImages: []
        },
        { 
          title: "Home Office Conversion", 
          description: "Professional workspace solutions", 
          path: "/services/home-office-conversion", 
          image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80", 
          features: [
            "Custom desk and workspaces",
            "Built-in storage solutions",
            "Proper lighting design",
            "Technology integration",
            "Sound dampening solutions"
          ],
          benefits: [
            "Increased productivity",
            "Professional work environment",
            "Ergonomic comfort",
            "Space optimization",
            "Potential tax benefits"
          ],
          processSteps: [
            { title: "Workspace Assessment", description: "Evaluate your work requirements and available space" },
            { title: "Custom Design", description: "Create an office layout tailored to your needs" },
            { title: "Electrical & Technology", description: "Install proper outlets, lighting, and connectivity" },
            { title: "Furnishings & Storage", description: "Build custom furniture and storage solutions" },
            { title: "Finishing Touches", description: "Add final details for comfort and productivity" }
          ],
          galleryImages: []
        },
        { 
          title: "Attic Conversion", 
          description: "Transform unused attic space into functional living areas", 
          path: "/services/attic-conversion", 
          image: "https://images.unsplash.com/photo-1595514535515-3be5a5b0d104?auto=format&fit=crop&q=80", 
          features: [
            "Structural evaluation",
            "Insulation and climate control",
            "Custom lighting solutions",
            "Staircase installation",
            "Storage optimization"
          ],
          benefits: [
            "Additional living space",
            "Increased home value",
            "Improved energy efficiency",
            "Unique living environment",
            "Maximized existing square footage"
          ],
          processSteps: [
            { title: "Feasibility Assessment", description: "Evaluate structural capacity and code requirements" },
            { title: "Design Planning", description: "Create custom layout for your specific space" },
            { title: "Insulation & Systems", description: "Install proper climate control and electrical systems" },
            { title: "Finish Work", description: "Complete drywall, flooring, and detailed finishes" },
            { title: "Final Inspection", description: "Ensure all work meets safety and building codes" }
          ],
          galleryImages: []
        },
        { 
          title: "Garage Conversion", 
          description: "Transform your garage into usable living space", 
          path: "/services/garage-conversion", 
          image: "https://images.unsplash.com/photo-1545194445-dddb8f4487c6?auto=format&fit=crop&q=80", 
          features: [
            "Insulation and drywall",
            "Window and door installation",
            "Electrical and HVAC upgrades",
            "Flooring installation",
            "Custom storage solutions"
          ],
          benefits: [
            "Increased living space",
            "Cost-effective expansion",
            "Customized for your needs",
            "No foundation work required",
            "Quick project turnaround"
          ],
          processSteps: [
            { title: "Space Planning", description: "Design the ideal layout for your needs" },
            { title: "Permitting", description: "Secure necessary building permits" },
            { title: "Construction", description: "Convert garage shell to finished space" },
            { title: "Interior Finishing", description: "Add flooring, paint, and fixtures" },
            { title: "Final Details", description: "Complete trim work and final touches" }
          ],
          galleryImages: []
        }
      ]
    },
    // 2. Painting & Finishing
    {
      category: "Painting & Finishing",
      services: [
        { title: "Interior Painting", description: "Professional painting services", path: "/services/interior-painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f", features: ["Premium quality paints", "Expert color consultation", "Precise edge and detail work", "Surface preparation", "Texture and faux finish options", "Eco-friendly paint options", "Clean and efficient process"], benefits: ["Fresh, updated appearance", "Increased property value", "Protection of walls and surfaces", "Improved indoor air quality with low-VOC options", "Enhanced lighting and room aesthetics"], processSteps: [ { title: "Consultation", description: "We discuss color options, finish types, and assess your space." }, { title: "Preparation", description: "We protect furniture, prep surfaces, repair imperfections, and prime when necessary." }, { title: "Professional Application", description: "Our painters apply paint with precision using professional techniques and equipment." }, { title: "Inspection", description: "We conduct a thorough inspection to ensure perfect coverage and quality." }, { title: "Clean Up", description: "We clean up completely, leaving your space ready to enjoy." } ], galleryImages: [ "https://images.unsplash.com/photo-1589939705384-5185137a7f0f", "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14", "https://images.unsplash.com/photo-1595665593673-bf1ad72905fc", "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91" ] },
        { title: "Exterior Painting", description: "Fresh exterior looks", path: "/services/exterior-painting", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7167b45", features: ["Durable exterior paints", "Weather-resistant finishes", "Surface preparation (power washing, scraping)", "Trim and accent painting", "Stucco and siding painting", "Deck and fence staining"], benefits: ["Enhanced curb appeal", "Protection against elements", "Increased property value", "Prevents moisture damage", "Long-lasting finish"], processSteps: [], galleryImages: [] },
        { title: "Cabinet Painting & Refinishing", description: "Revitalize your cabinets", path: "/services/cabinet-painting", image: "https://images.unsplash.com/photo-1600176446012-e56568893a7b", features: ["Professional surface prep", "High-quality cabinet paints", "Spray finish options", "Color matching", "Hardware removal/reinstallation"], benefits: ["Cost-effective kitchen/bath update", "Modernizes outdated cabinets", "Customizable look", "Durable finish"], processSteps: [], galleryImages: [] },
        { title: "Crown Molding & Trim", description: "Elegant finishing touches", path: "/services/crown-molding", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f", features: ["Custom profile selection", "Precise installation", "Corner treatments", "Paint and finish options", "Decorative ceiling treatments", "Archway and doorway molding", "Accent lighting integration"], benefits: ["Adds architectural interest", "Enhances room elegance", "Creates seamless transitions", "Increases property value", "Distinctive, upscale appearance"], processSteps: [ { title: "Design Consultation", description: "We help you select the right profile and style to match your home's architecture." }, { title: "Measurement", description: "Our team takes precise measurements to ensure accurate cuts and perfect fit." }, { title: "Material Preparation", description: "We cut and prepare all materials with attention to detail." }, { title: "Installation", description: "Our craftsmen install molding with specialized techniques for flawless results." }, { title: "Finishing", description: "We apply caulk, putty nail holes, and prepare for painting or staining." } ], galleryImages: [ "https://images.unsplash.com/photo-1513694203232-719a280e022f", "https://images.unsplash.com/photo-1560184611-ff3e53f00e8f", "https://images.unsplash.com/photo-1598204720597-c7e0f4a6e98a", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" ] },
        { title: "Stair Painting & Staining", description: "Beautify your staircases", path: "/services/stair-painting", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", features: [], benefits: [], processSteps: [], galleryImages: [] }
      ]
    },
    // 3. Flooring
    {
      category: "Flooring", 
      services: [
        { title: "Hardwood", description: "Premium wood flooring", path: "/services/hardwood", image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd", features: ["Solid hardwood options", "Wide variety of wood species", "Custom staining available", "Professional installation", "Sanding and refinishing", "Eco-friendly options", "Long-lasting durability"], benefits: ["Increases home value", "Timeless aesthetic appeal", "Durable and long-lasting", "Can be refinished multiple times", "Natural, hypoallergenic material"], processSteps: [ { title: "Consultation", description: "We discuss your preferences, lifestyle needs, and budget to recommend the best hardwood options." }, { title: "Subfloor Preparation", description: "We ensure your subfloor is clean, level, and suitable for hardwood installation." }, { title: "Professional Installation", description: "Our skilled craftsmen install your hardwood flooring with precision and care." }, { title: "Finishing", description: "We apply stains and sealants to protect your floors and achieve your desired look." }, { title: "Final Inspection", description: "We conduct a thorough inspection to ensure perfect installation and finish." } ], galleryImages: [ "https://images.unsplash.com/photo-1584467541268-b040f83be3fd", "https://images.unsplash.com/photo-1595514535515-3be5a5b0d104", "https://images.unsplash.com/photo-1604743352254-3a49866ba56d", "https://images.unsplash.com/photo-1609862776364-896ff3950052" ] },
        { title: "Tile Installation", description: "Custom tile solutions", path: "/services/tile", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea", features: [ "Ceramic, porcelain, and natural stone options", "Custom patterns and layouts", "Waterproof installation", "Heated floor compatibility", "Precision cutting and fitting", "Grout color customization", "Sealing services" ], benefits: [ "Exceptional durability", "Water and stain resistance", "Easy maintenance", "Versatile design options", "Ideal for high-moisture areas" ], processSteps: [ { title: "Design Consultation", description: "We help you select the perfect tile type, size, and pattern for your space." }, { title: "Surface Preparation", description: "We ensure your subfloor is properly prepared and waterproofed as needed." }, { title: "Professional Installation", description: "Our tile experts install your tiles with precision, ensuring proper spacing and alignment." }, { title: "Grouting", description: "We apply and finish grout in your chosen color to complete the installation." }, { title: "Sealing", description: "We seal natural stone tiles and grout lines to protect against stains and moisture." } ], galleryImages: [ "https://images.unsplash.com/photo-1600566752355-35792bedcfea", "https://images.unsplash.com/photo-1619252584184-12db41877baa", "https://images.unsplash.com/photo-1625166013260-30cd0f3eff5b", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92" ] },
        { title: "Luxury Vinyl", description: "Modern vinyl options", path: "/services/luxury-vinyl", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d", features: [ "Luxury vinyl plank (LVP) and tile (LVT)", "Waterproof options", "Wood and stone look designs", "Click-lock or glue-down installation", "Commercial-grade options", "Underfloor heating compatible", "Sound-dampening underlayment" ], benefits: [ "Waterproof and moisture resistant", "Extremely durable and scratch resistant", "Easy maintenance", "Comfortable underfoot", "More affordable than natural materials" ], processSteps: [ { title: "Material Selection", description: "We help you choose the right luxury vinyl product for your needs and style preferences." }, { title: "Subfloor Preparation", description: "We ensure your subfloor is clean, dry, and level for optimal installation." }, { title: "Underlayment Installation", description: "We install appropriate underlayment for sound dampening and comfort." }, { title: "Vinyl Installation", description: "Our team precisely installs your luxury vinyl flooring with attention to detail." }, { title: "Finishing", description: "We install trim pieces and transitions for a polished, professional look." } ], galleryImages: [ "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d", "https://images.unsplash.com/photo-1598214886806-c87b84b7078b", "https://images.unsplash.com/photo-1613545564241-d966676c00c6", "https://images.unsplash.com/photo-1553025934-296397db4010" ] },
        { title: "Carpet Installation", description: "Quality carpet services", path: "/services/carpet", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001", features: [ "Wide variety of carpet styles", "Stain-resistant options", "Pet-friendly selections", "High-traffic durability grades", "Premium padding options", "Stretch-in and direct glue installation", "Pattern matching expertise" ], benefits: [ "Soft and comfortable underfoot", "Sound absorption qualities", "Insulating properties", "Slip-resistant surface", "Available in countless colors and patterns" ], processSteps: [ { title: "Carpet Selection", description: "We help you choose the right carpet type, pile, and color for your lifestyle and preferences." }, { title: "Measurement & Estimation", description: "We take precise measurements to determine exact carpet requirements." }, { title: "Subfloor Preparation", description: "We prepare your subfloor and install quality padding for comfort and longevity." }, { title: "Professional Installation", description: "Our experienced installers carefully place, stretch, and secure your carpet." }, { title: "Finishing Touches", description: "We install trim pieces and transitions for a seamless, professional appearance." } ], galleryImages: [ "https://images.unsplash.com/photo-1558317374-067fb5f30001", "https://images.unsplash.com/photo-1493552832879-9c479e90e376", "https://images.unsplash.com/photo-1556228720-195a672e8a03", "https://images.unsplash.com/photo-1584964743181-6a5c9abd4a88" ] },
        { 
          title: "Engineered Wood Flooring", 
          description: "Stable, versatile wood flooring solution", 
          path: "/services/engineered-wood-flooring", 
          image: "https://images.unsplash.com/photo-1580129519463-aad36a75f9a2?auto=format&fit=crop&q=80", 
          features: [
            "Premium engineered wood planks",
            "Wide variety of wood species and finishes",
            "Multiple installation methods",
            "Compatible with underfloor heating",
            "Suitable for all floor levels including basements"
          ],
          benefits: [
            "Superior dimensional stability",
            "Resistant to humidity changes",
            "Real wood appearance and feel",
            "More environmentally sustainable",
            "Wide range of installation options"
          ],
          processSteps: [
            { title: "Material Consultation", description: "Select the perfect engineered wood for your space" },
            { title: "Acclimation", description: "Allow materials to adjust to your home's environment" },
            { title: "Subfloor Preparation", description: "Ensure your subfloor is properly prepared" },
            { title: "Professional Installation", description: "Expert installation using appropriate methods" },
            { title: "Finishing & Sealing", description: "Complete the installation with proper finishing" }
          ],
          galleryImages: []
        },
        { 
          title: "Reclaimed Wood Flooring", 
          description: "Sustainable flooring with character and history", 
          path: "/services/reclaimed-wood-flooring", 
          image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80", 
          features: [
            "Authentic reclaimed wood materials",
            "Unique character and patina",
            "Custom sizing and finishing options",
            "Expert installation",
            "Eco-friendly and sustainable"
          ],
          benefits: [
            "One-of-a-kind appearance",
            "Historical significance and character",
            "Extremely durable and hard-wearing",
            "Environmentally responsible choice",
            "Conversation piece for your home"
          ],
          processSteps: [
            { title: "Source Selection", description: "Find the perfect reclaimed wood with desired character" },
            { title: "Material Preparation", description: "Clean, de-nail, and prepare salvaged materials" },
            { title: "Custom Milling", description: "Mill boards to consistent dimensions" },
            { title: "Expert Installation", description: "Install with techniques appropriate for reclaimed wood" },
            { title: "Finishing", description: "Apply protective finishes that preserve natural character" }
          ],
          galleryImages: []
        },
        { 
          title: "Laminate Flooring", 
          description: "Durable and affordable flooring solution", 
          path: "/services/laminate-flooring", 
          image: "https://images.unsplash.com/photo-1613082232746-f86797e1b843?auto=format&fit=crop&q=80", 
          features: [
            "High-quality laminate materials",
            "Realistic wood and stone appearances",
            "Water-resistant options available",
            "Floating floor installation",
            "Wide range of styles and colors"
          ],
          benefits: [
            "Budget-friendly option",
            "Excellent durability and scratch resistance",
            "Easy maintenance and cleaning",
            "Fast installation process",
            "Suitable for most areas of the home"
          ],
          processSteps: [
            { title: "Product Selection", description: "Choose from various styles and performance grades" },
            { title: "Subfloor Evaluation", description: "Assess and prepare the underlayment surface" },
            { title: "Moisture Barrier Installation", description: "Apply appropriate moisture protection" },
            { title: "Precision Installation", description: "Install with proper expansion gaps and techniques" },
            { title: "Trim & Finishing", description: "Add moldings and transition pieces for a complete look" }
          ],
          galleryImages: []
        },
        { 
          title: "Concrete Flooring", 
          description: "Modern, customizable concrete surfaces", 
          path: "/services/concrete-flooring", 
          image: "https://images.unsplash.com/photo-1517581177682-a085bb7accac?auto=format&fit=crop&q=80", 
          features: [
            "Polished concrete finishing",
            "Decorative staining and coloring",
            "Stamped patterns and textures",
            "Epoxy coatings and overlays",
            "Radiant heat integration"
          ],
          benefits: [
            "Incredibly durable and long-lasting",
            "Minimal maintenance requirements",
            "Modern industrial aesthetic",
            "Excellent for allergies and air quality",
            "Energy efficient with thermal mass"
          ],
          processSteps: [
            { title: "Design Consultation", description: "Explore finish options, colors, and textures" },
            { title: "Surface Preparation", description: "Grind, repair, and prepare existing concrete" },
            { title: "Application Process", description: "Apply selected treatments, stains, or overlays" },
            { title: "Finishing Process", description: "Polish, seal, or coat for desired appearance" },
            { title: "Final Protection", description: "Apply protective sealants for longevity" }
          ],
          galleryImages: []
        },
        { 
          title: "Cork Flooring", 
          description: "Comfortable, sustainable natural flooring", 
          path: "/services/cork-flooring", 
          image: "https://images.unsplash.com/photo-1559919114-7379a66c87a5?auto=format&fit=crop&q=80", 
          features: [
            "Natural cork materials",
            "Multiple finish options",
            "Various installation methods",
            "Variety of patterns and colors",
            "Thermal and acoustic properties"
          ],
          benefits: [
            "Soft and comfortable underfoot",
            "Natural insulation properties",
            "Excellent sound absorption",
            "Environmentally sustainable choice",
            "Natural resistance to mold and mildew"
          ],
          processSteps: [
            { title: "Material Selection", description: "Choose from various cork styles and formats" },
            { title: "Acclimation Period", description: "Allow cork to adjust to the installation environment" },
            { title: "Subfloor Preparation", description: "Create a smooth, clean surface for installation" },
            { title: "Professional Installation", description: "Apply using floating or glue-down methods" },
            { title: "Sealing & Protection", description: "Apply protective finishes for longevity" }
          ],
          galleryImages: []
        },
        { 
          title: "Stone Flooring", 
          description: "Elegant natural stone tile installation", 
          path: "/services/stone-flooring", 
          image: "https://images.unsplash.com/photo-1600566466159-6f65ce76d337?auto=format&fit=crop&q=80", 
          features: [
            "Marble, granite, travertine, and limestone options",
            "Various finish types (polished, honed, etc.)",
            "Custom layouts and patterns",
            "Expert fabrication and installation",
            "Sealing and maintenance services"
          ],
          benefits: [
            "Timeless elegant appearance",
            "Excellent durability when properly maintained",
            "Unique natural variations in each installation",
            "Increases property value significantly",
            "Natural cooling properties in warm climates"
          ],
          processSteps: [
            { title: "Stone Selection", description: "Choose from various stone types and finishes" },
            { title: "Custom Layout Design", description: "Create patterns that showcase the stone beautifully" },
            { title: "Subfloor Reinforcement", description: "Prepare a strong foundation for heavy stone" },
            { title: "Expert Installation", description: "Install with precision alignment and spacing" },
            { title: "Sealing & Protection", description: "Apply professional-grade sealants for longevity" }
          ],
          galleryImages: []
        }
      ]
    },
    // 4. Interior & Drywall
    {
      category: "Interior & Drywall",
      services: [
        { title: "Drywall Installation & Repair", description: "Expert drywall solutions", path: "/services/drywall", image: "https://images.unsplash.com/photo-1573504816327-07f3bf7accac", features: ["New construction drywall", "Drywall repair and patching", "Ceiling installation", "Texture application", "Soundproofing options", "Moisture-resistant solutions", "Custom design elements"], benefits: ["Improved room aesthetics", "Better sound insulation", "Fire resistance", "Smooth, professional finish", "Preparation for perfect paint application"], processSteps: [ { title: "Measurement & Planning", description: "We assess your space and determine material requirements." }, { title: "Framing Inspection", description: "We ensure the underlying structure is suitable for drywall installation." }, { title: "Professional Installation", description: "Our team hangs drywall sheets with precision." }, { title: "Taping & Mudding", description: "We apply joint compound and tape for a seamless finish." }, { title: "Sanding & Finishing", description: "We sand and perfect the surface for a smooth, paint-ready result." } ], galleryImages: [ "https://images.unsplash.com/photo-1573504816327-07f3bf7accac", "https://images.unsplash.com/photo-1614075270637-7fa8dfa6c3a1", "https://images.unsplash.com/photo-1558767143-547a89e11cbf", "https://images.unsplash.com/photo-1574015974293-817f0ebf0e95" ] },
        { title: "Custom Cabinetry", description: "Built to order cabinets", path: "/services/custom-cabinetry", image: "https://images.unsplash.com/photo-1556185781-a47769abb7ee", features: ["Made-to-measure design", "Premium materials", "Expert craftsmanship", "Perfect fit guarantee", "Extensive finish options", "Hardware customization", "Built-in organization systems"], benefits: ["Maximizes your space efficiency", "Increases home value", "Custom solutions for unique spaces", "Higher quality than mass-produced options", "Perfect match to your design aesthetic"], processSteps: [ { title: "In-Home Consultation", description: "Our designer evaluates your space and discusses your style preferences, functional needs, and budget." }, { title: "Custom Design", description: "We create detailed 3D renderings and plans tailored to your specifications." }, { title: "Material Selection", description: "Choose from premium woods, finishes, hardware, and organizational features." }, { title: "Expert Fabrication", description: "Our skilled craftsmen build your custom cabinets with precision in our local workshop." }, { title: "Professional Installation", description: "Experienced installers ensure perfect fit and function in your space." } ], galleryImages: [ "https://images.unsplash.com/photo-1556185781-a47769abb7ee", "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c", "https://images.unsplash.com/photo-1556228720-195a672e8a03", "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6" ] },
        { title: "Stair Installation", description: "New staircase construction", path: "/services/stair-installation", image: "https://images.unsplash.com/photo-1567684033906-6d94f338212b", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Railing Installation", description: "Wood, metal, glass railings", path: "/services/railing-installation", image: "https://images.unsplash.com/photo-1559541305-07a013f668d2", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Wood Paneling & Wainscoting", description: "Decorative wood wall treatments", path: "/services/wood-paneling", image: "https://images.unsplash.com/photo-1610731374500-eb5f2b9d6058?auto=format&fit=crop&q=80", 
          features: [
            "Custom wood panel designs", 
            "Traditional & modern wainscoting", 
            "Beadboard installation", 
            "Accent walls", 
            "Premium wood species options"
          ], 
          benefits: [
            "Adds architectural interest", 
            "Provides wall protection", 
            "Enhances room aesthetics", 
            "Creates visual texture", 
            "Increases home value"
          ], 
          processSteps: [
            { title: "Design Consultation", description: "Select style, height, and wood type" },
            { title: "Custom Fabrication", description: "Precise cutting and preparation" },
            { title: "Professional Installation", description: "Expert carpentry and fitting" },
            { title: "Finishing", description: "Staining, painting, and sealing" }
          ], 
          galleryImages: []
        }
      ]
    },
    // 5. Exterior & Construction
    {
      category: "Exterior & Construction",
      services: [
        { title: "Siding Installation", description: "Durable siding solutions", path: "/services/siding", image: "https://images.unsplash.com/photo-1604852116498-d442170c1738", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Deck Building & Repair", description: "Custom outdoor spaces", path: "/services/deck", image: "https://images.unsplash.com/photo-1591560300589-7953bb636af8", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Window & Door Installation", description: "Energy efficient upgrades", path: "/services/windows", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Selective Demolition", description: "Precise removal services", path: "/services/selective-demolition", image: "https://images.unsplash.com/photo-1526797009556-a463e95a8275", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { title: "Pergolas & Gazebos", description: "Custom outdoor wood structures", path: "/services/pergolas-gazebos", image: "https://images.unsplash.com/photo-1561498924-e1e5fc37a065?auto=format&fit=crop&q=80", 
          features: [
            "Custom design and sizing", 
            "Premium weather-resistant woods", 
            "Cedar, redwood & pressure-treated options", 
            "Decorative post caps and details", 
            "Optional integrated lighting"
          ], 
          benefits: [
            "Creates outdoor living space", 
            "Adds architectural interest", 
            "Provides partial shade", 
            "Increases property value", 
            "Supports climbing plants"
          ], 
          processSteps: [
            { title: "Design Consultation", description: "Plan the perfect structure for your space" },
            { title: "Material Selection", description: "Choose the right wood and details" },
            { title: "Site Preparation", description: "Ensure solid foundation and proper layout" },
            { title: "Construction", description: "Expert carpentry and assembly" },
            { title: "Finishing", description: "Staining or sealing for longevity" }
          ], 
          galleryImages: []
        },
        { title: "Other Exterior Services", description: "Custom solutions for your specific needs", path: "/services/other-exterior", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", features: [], benefits: [], processSteps: [], galleryImages: [] },
        { 
          title: "Outdoor Kitchens",
          description: "Luxurious outdoor cooking spaces",
          path: "/services/outdoor-kitchens",
          image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80",
          features: [
            "Custom countertops and cabinetry",
            "Built-in grills and smokers",
            "Pizza ovens and specialty appliances",
            "Bar and seating areas",
            "Weather-resistant materials"
          ],
          benefits: [
            "Expanded entertaining space",
            "Improved home value",
            "Enhanced outdoor living",
            "Reduced heat in main kitchen",
            "Customized cooking experience"
          ],
          processSteps: [
            { title: "Site Evaluation", description: "Assess ideal location and utility connections" },
            { title: "Design & Planning", description: "Create custom layout and select appliances" },
            { title: "Foundation & Utilities", description: "Install proper foundation and run utilities" },
            { title: "Construction", description: "Build structures and install appliances" },
            { title: "Finishing", description: "Apply weatherproofing and final touches" }
          ],
          galleryImages: []
        },
        { 
          title: "Sunroom Additions",
          description: "Year-round outdoor enjoyment",
          path: "/services/sunroom-additions",
          image: "https://images.unsplash.com/photo-1591247378418-c77740fb5e0a?auto=format&fit=crop&q=80",
          features: [
            "Energy-efficient windows",
            "Insulated walls and ceiling",
            "HVAC integration",
            "Custom flooring options",
            "Integrated lighting systems"
          ],
          benefits: [
            "Additional living space",
            "Natural light year-round",
            "Connection to outdoors",
            "Increased home value",
            "All-weather enjoyment"
          ],
          processSteps: [
            { title: "Site Analysis", description: "Determine optimal orientation and attachment" },
            { title: "Design Development", description: "Create architectural plans and select materials" },
            { title: "Foundation & Framing", description: "Build structural framework" },
            { title: "Windows & Enclosure", description: "Install windows, doors, and weatherproofing" },
            { title: "Interior Finishing", description: "Complete flooring, electrical, and finishes" }
          ],
          galleryImages: []
        },
        { 
          title: "Roofing & Gutters",
          description: "Protection and drainage systems",
          path: "/services/roofing-gutters",
          image: "https://images.unsplash.com/photo-1632759145099-550e06762625?auto=format&fit=crop&q=80",
          features: [
            "Premium roofing materials",
            "Professional installation",
            "Seamless gutter systems",
            "Gutter guards and protection",
            "Proper drainage solutions"
          ],
          benefits: [
            "Weather protection",
            "Improved energy efficiency",
            "Extended home lifespan",
            "Enhanced curb appeal",
            "Prevented water damage"
          ],
          processSteps: [
            { title: "Inspection & Assessment", description: "Evaluate current condition and needs" },
            { title: "Material Selection", description: "Choose optimal roofing and gutter materials" },
            { title: "Preparation", description: "Set up safety equipment and materials" },
            { title: "Installation", description: "Apply roofing and attach gutter systems" },
            { title: "Clean-up & Inspection", description: "Thorough site cleaning and final inspection" }
          ],
          galleryImages: []
        }
      ]
    },
    // 6. Wood Services
    {
      category: "Wood Services",
      services: [
        { 
          title: "Custom Wood Furniture", 
          description: "Handcrafted custom furniture pieces", 
          path: "/services/custom-wood-furniture",
          image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?auto=format&fit=crop&q=80",
          features: ["Custom design consultation", "Premium hardwood selection", "Expert craftsmanship", "Precision joinery", "Custom finishes"],
          benefits: ["One-of-a-kind pieces", "Perfectly fits your space", "Heirloom quality", "Sustainable materials"],
          processSteps: [
            { title: "Design Consultation", description: "Discuss your vision, needs, and preferences" },
            { title: "Material Selection", description: "Choose from premium hardwoods and finishes" },
            { title: "Crafting Process", description: "Expert craftsmen build your custom piece" },
            { title: "Finishing", description: "Apply stains, sealants, and finishes" },
            { title: "Delivery & Installation", description: "Safe delivery and placement in your space" }
          ],
          galleryImages: [
            "https://images.unsplash.com/photo-1540638349517-3abd5afc5847",
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc",
            "https://images.unsplash.com/photo-1560438718-eb61ede255eb"
          ]
        },
        { 
          title: "Wood Restoration", 
          description: "Revitalize and restore wooden elements", 
          path: "/services/wood-restoration",
          image: "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&q=80",
          features: ["Furniture restoration", "Antique wood refinishing", "Structural repairs", "Color matching", "Custom patina creation"],
          benefits: ["Preserve valuable pieces", "Extend furniture lifespan", "Enhance wood's natural beauty", "Environmentally responsible"],
          processSteps: [
            { title: "Assessment", description: "Evaluate condition and restoration needs" },
            { title: "Cleaning & Repair", description: "Address structural issues and deep clean" },
            { title: "Refinishing", description: "Strip old finishes and prepare surface" },
            { title: "Staining & Finishing", description: "Apply new stains and protective finishes" },
            { title: "Final Detailing", description: "Hardware replacement and final touches" }
          ],
          galleryImages: []
        },
        { 
          title: "Custom Built-Ins", 
          description: "Tailored built-in shelving and storage", 
          path: "/services/custom-built-ins",
          image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80",
          features: ["Space-maximizing designs", "Custom shelving", "Entertainment centers", "Home office solutions", "Integrated storage"],
          benefits: ["Maximizes space efficiency", "Seamlessly fits your home", "Increases property value", "Custom organization solutions"],
          processSteps: [],
          galleryImages: []
        },
        { 
          title: "Wood Flooring Services", 
          description: "Installation, refinishing, and repair", 
          path: "/services/wood-flooring-services",
          image: "https://images.unsplash.com/photo-1622126718468-fe2dbea99d4e?auto=format&fit=crop&q=80",
          features: ["New floor installation", "Refinishing existing floors", "Hardwood repairs", "Custom inlays and borders", "Eco-friendly options"],
          benefits: ["Revitalize worn floors", "Address damaged areas", "Update wood tone/color", "Extend floor lifespan"],
          processSteps: [],
          galleryImages: []
        },
        { 
          title: "Wooden Deck Restoration", 
          description: "Bring your outdoor wood surfaces back to life", 
          path: "/services/wooden-deck-restoration",
          image: "https://images.unsplash.com/photo-1588977974116-d2ffc4a7a4a2?auto=format&fit=crop&q=80",
          features: [
            "Deck cleaning and power washing", 
            "Wood repair and board replacement", 
            "Sanding and surface preparation", 
            "Premium staining and sealing", 
            "Railing restoration"
          ],
          benefits: [
            "Extends deck lifespan", 
            "Improves appearance", 
            "Prevents moisture damage", 
            "Increases safety", 
            "Enhances outdoor living space"
          ],
          processSteps: [
            { title: "Inspection & Assessment", description: "Evaluate deck condition and identify needs" },
            { title: "Preparation & Cleaning", description: "Deep clean and prepare surfaces" },
            { title: "Repair & Replace", description: "Fix damaged boards and structural elements" },
            { title: "Sanding & Smoothing", description: "Create smooth, splinter-free surfaces" },
            { title: "Finishing & Sealing", description: "Apply protective stains and sealants" }
          ],
          galleryImages: []
        },
        { 
          title: "Custom Wooden Stairs", 
          description: "Handcrafted staircases and railings", 
          path: "/services/custom-wooden-stairs",
          image: "https://images.unsplash.com/photo-1548294458-3e1afb9fa86c?auto=format&fit=crop&q=80",
          features: [
            "Custom stair design", 
            "Premium hardwood options", 
            "Precision craftsmanship", 
            "Matching railings and balusters", 
            "Modern or traditional styles"
          ],
          benefits: [
            "Statement architectural feature", 
            "Increases home value", 
            "Maximizes space efficiency", 
            "Superior durability", 
            "Customized to your aesthetic"
          ],
          processSteps: [
            { title: "Design Consultation", description: "Create the perfect stair design for your space" },
            { title: "Material Selection", description: "Choose woods and finishes that match your home" },
            { title: "Precision Fabrication", description: "Craft each component with expert care" },
            { title: "Professional Installation", description: "Install with structural integrity and beauty" },
            { title: "Final Finishing", description: "Apply protective finishes for lasting quality" }
          ],
          galleryImages: []
        }
      ]
    },
    // --- NEW: Commercial Services Category ---
    {
      category: "Commercial Services",
      services: [
        {
          title: "Office Renovation", 
          path: "/services/office-renovation", 
          description: "Transform your workspace with modern, efficient layouts and designs.", 
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
          features: ["Space planning & optimization", "Modern aesthetic upgrades", "Technology integration", "Ergonomic solutions"],
          benefits: ["Improved employee productivity", "Enhanced brand image", "Better client impressions", "Increased property value"],
          processSteps: [ { title: "Needs Assessment", description: "Analyze workflow and space needs" }, { title: "Design & Layout", description: "Develop efficient floor plans" }, { title: "Phased Construction", description: "Minimize business disruption" }, { title: "Fit-out & Finish", description: "Install fixtures and finishes" } ],
          galleryImages: ["https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5", "https://images.unsplash.com/photo-1600880292203-94d56c436f16"]
        },
        {
          title: "Retail Fit-Outs", 
          path: "/services/retail-fit-out", 
          description: "Comprehensive buildouts designed to attract customers and maximize sales.", 
          image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80",
          features: ["Custom storefront design", "Display & shelving solutions", "POS area integration", "Lighting design"],
          benefits: ["Enhanced customer experience", "Improved product visibility", "Stronger brand presence", "Optimized sales flow"],
          processSteps: [ { title: "Brand Analysis", description: "Understand brand identity & target customer" }, { title: "Layout Planning", description: "Optimize customer flow and display areas" }, { title: "Construction & Installation", description: "Build out the space and install fixtures" }, { title: "Visual Merchandising Setup", description: "Prepare space for opening" } ],
          galleryImages: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d", "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107"]
        },
        {
          title: "Restaurant Renovation", 
          path: "/services/restaurant-renovation", 
          description: "Specialized renovation and design for restaurants, cafes, and food service.", 
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
          features: ["Commercial kitchen design", "Dining area layout optimization", "Bar design & build", "Health code compliance"],
          benefits: ["Improved kitchen efficiency", "Enhanced dining atmosphere", "Increased seating capacity", "Compliance assurance"],
          processSteps: [ { title: "Concept & Design", description: "Develop theme, layout, and kitchen plan" }, { title: "Permitting & Compliance", description: "Ensure adherence to health/building codes" }, { title: "Construction & Installation", description: "Build out dining, kitchen, bar areas" }, { title: "Final Inspections", description: "Pass health and safety checks" } ],
          galleryImages: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", "https://images.unsplash.com/photo-1552566626-52f8b828add9"]
        },
        {
          title: "Healthcare Facilities", 
          path: "/services/healthcare-facilities", 
          description: "Custom construction for medical offices, clinics, and healthcare spaces.", 
          image: "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?auto=format&fit=crop&q=80",
          features: ["Specialized medical room design", "Compliance with healthcare codes", "Patient flow optimization", "Durable & hygienic materials"],
          benefits: ["Improved patient care environment", "Regulatory compliance assurance", "Enhanced operational efficiency", "Safe and welcoming space"],
          processSteps: [], galleryImages: []
        },
        {
          title: "Warehouse & Industrial", 
          path: "/services/warehouse-industrial", 
          description: "Custom solutions for warehouses, manufacturing, and industrial facilities.", 
          image: "https://images.unsplash.com/photo-1587019158091-1a123c84796e?auto=format&fit=crop&q=80",
          features: ["High-bay construction", "Loading dock design", "Specialized flooring", "Safety systems integration"],
          benefits: ["Optimized storage & logistics", "Improved operational safety", "Durable and functional space", "Scalable infrastructure"],
          processSteps: [], galleryImages: [] 
        },
        {
          title: "Commercial Flooring", 
          path: "/services/commercial-flooring", 
          description: "High-performance flooring solutions for commercial properties.", 
          image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80",
          features: ["Commercial-grade materials", "High-traffic durability", "Quick installation", "Minimal business disruption"],
          benefits: ["Professional appearance", "Long-term performance", "Easy maintenance", "ADA compliance"],
          processSteps: [
            { title: "Site Assessment", description: "Evaluate existing conditions and requirements" },
            { title: "Material Selection", description: "Choose the right flooring for your business needs" },
            { title: "Installation Planning", description: "Schedule work to minimize business disruption" },
            { title: "Expert Installation", description: "Professional installation with quality control" }
          ],
          galleryImages: []
        },
        {
          title: "Corporate Office Design", 
          path: "/services/corporate-office-design", 
          description: "Complete office design and space planning services.", 
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80",
          features: ["Brand integration", "Collaborative spaces", "Private work areas", "Technology integration"],
          benefits: ["Improved workflow", "Enhanced company culture", "Better employee satisfaction", "Attractive client environment"],
          processSteps: [
            { title: "Needs Analysis", description: "Understand company culture and work requirements" },
            { title: "Space Planning", description: "Optimize layout for workflow and communication" },
            { title: "Design Development", description: "Create detailed design plans and visualizations" },
            { title: "Implementation", description: "Coordinate construction and furnishing installation" }
          ],
          galleryImages: []
        }
        // Add other commercial services from CommercialServicePage.tsx here if needed
      ]
    },
    // --- Basic Smart Home Integration (keeping only simple options) --- 
    {
      category: "Smart Home Basics",
      services: [
        {
          title: "Smart Hub Installation", 
          path: "/services/smart-hub-installation", 
          description: "Basic setup for controlling smart home devices.", 
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
          features: ["Central control system", "Voice assistant compatibility", "Mobile app access", "Device connection"],
          benefits: ["Simplified home control", "Energy monitoring", "Enhanced convenience", "Future expandability"],
          processSteps: [
            { title: "Needs Assessment", description: "Determine which smart features you need" },
            { title: "Hub Selection", description: "Choose the right smart hub for your home" },
            { title: "Installation & Setup", description: "Professional installation and configuration" },
            { title: "User Training", description: "Learn how to use your new smart home system" }
          ],
          galleryImages: []
        },
        {
          title: "AV Systems Installation", 
          path: "/services/av-systems-installation", 
          description: "Professional audio-visual solutions for commercial environments.", 
          image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
          features: ["Conference room systems", "Digital signage", "Sound reinforcement", "Control system integration"],
          benefits: ["Enhanced communication", "Professional presentation capabilities", "Simplified technology management", "Scalable solutions"],
          processSteps: [
            { title: "Needs Assessment", description: "Determine AV requirements for each space" },
            { title: "System Design", description: "Plan optimal equipment and integration" },
            { title: "Professional Installation", description: "Install and calibrate all equipment" },
            { title: "User Training", description: "Ensure staff can operate systems effectively" }
          ],
          galleryImages: []
        },
        {
          title: "Network Infrastructure", 
          path: "/services/network-infrastructure", 
          description: "Commercial-grade network installation and cabling services.", 
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80",
          features: ["Structured cabling", "Server room design", "Wireless network planning", "Telecom infrastructure"],
          benefits: ["Reliable connectivity", "Future-proof infrastructure", "Optimized network performance", "Organized cable management"],
          processSteps: [
            { title: "Site Survey", description: "Assess existing infrastructure and requirements" },
            { title: "Infrastructure Planning", description: "Design optimal network layout" },
            { title: "Professional Installation", description: "Install cabling and network equipment" },
            { title: "Testing & Certification", description: "Validate all connections meet standards" }
          ],
          galleryImages: []
        }
      ]
    },
    // --- NEW: Industrial Solutions Category ---
    {
      category: "Industrial Solutions",
      services: [
        {
          title: "Manufacturing Facility Design", 
          path: "/services/manufacturing-facility-design", 
          description: "Specialized construction and renovation for manufacturing spaces.", 
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80",
          features: ["Production line optimization", "Equipment layout planning", "Utility infrastructure", "Safety system integration"],
          benefits: ["Improved operational efficiency", "Enhanced worker safety", "Optimized workflow", "Future expansion capability"],
          processSteps: [
            { title: "Process Analysis", description: "Study manufacturing requirements and workflows" },
            { title: "Facility Planning", description: "Design optimal layout and support systems" },
            { title: "Construction & Installation", description: "Build to industrial specifications" },
            { title: "Commissioning", description: "Test and verify all systems function correctly" }
          ],
          galleryImages: []
        },
        {
          title: "Warehouse Optimization", 
          path: "/services/warehouse-optimization", 
          description: "Transform storage and distribution facilities for maximum efficiency.", 
          image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80",
          features: ["Racking system design", "Loading dock renovation", "Workflow analysis", "Automation integration"],
          benefits: ["Increased storage capacity", "Improved inventory management", "Enhanced logistics flow", "Reduced operational costs"],
          processSteps: [
            { title: "Space Assessment", description: "Analyze current layout and operations" },
            { title: "Solution Design", description: "Create optimized warehouse plan" },
            { title: "Implementation", description: "Install storage systems and infrastructure" },
            { title: "Process Integration", description: "Align physical changes with operational workflows" }
          ],
          galleryImages: []
        },
        {
          title: "Clean Room Construction", 
          path: "/services/clean-room-construction", 
          description: "Specialized environments for manufacturing, research, and healthcare.", 
          image: "https://images.unsplash.com/photo-1581093458791-9d19c9e0b0b7?auto=format&fit=crop&q=80",
          features: ["ISO classification compliance", "HVAC & filtration systems", "Specialized materials", "Controlled access"],
          benefits: ["Contamination control", "Regulatory compliance", "Process reliability", "Product quality assurance"],
          processSteps: [
            { title: "Requirements Analysis", description: "Determine classification and specifications" },
            { title: "Engineering Design", description: "Plan all critical systems and controls" },
            { title: "Construction", description: "Build to cleanroom standards" },
            { title: "Certification", description: "Verify compliance with required classifications" }
          ],
          galleryImages: []
        }
      ]
    },
    // --- NEW: Office Services Category ---
    {
      category: "Office Services",
      services: [
        {
          title: "Office Space Planning", 
          path: "/services/office-space-planning", 
          description: "Strategic office design and space utilization planning.", 
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80",
          features: ["Workspace analysis", "Layout optimization", "3D visualization", "Ergonomic planning"],
          benefits: ["Maximized space efficiency", "Improved workflow", "Enhanced collaboration", "Better employee experience"],
          processSteps: [
            { title: "Current State Assessment", description: "Evaluate existing space and work patterns" },
            { title: "Needs Analysis", description: "Identify requirements and pain points" },
            { title: "Space Planning", description: "Create optimized layouts and configurations" },
            { title: "Implementation", description: "Coordinate renovations and furniture placement" }
          ],
          galleryImages: []
        },
        {
          title: "Executive Suite Design", 
          path: "/services/executive-suite-design", 
          description: "Premium office solutions for executive and management spaces.", 
          image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80",
          features: ["High-end finishes", "Custom cabinetry", "Integrated technology", "Sound insulation"],
          benefits: ["Professional environment", "Reinforced company image", "Client-ready spaces", "Leadership satisfaction"],
          processSteps: [
            { title: "Executive Consultation", description: "Understand preferences and requirements" },
            { title: "Design Concept", description: "Create premium space designs" },
            { title: "Material Selection", description: "Choose high-quality finishes" },
            { title: "White-glove Installation", description: "Premium construction and finishing" }
          ],
          galleryImages: []
        },
        {
          title: "Office Acoustics Solutions", 
          path: "/services/office-acoustics", 
          description: "Improve workplace sound quality and privacy.", 
          image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80",
          features: ["Sound masking systems", "Acoustic panel installation", "Private space design", "HVAC noise reduction"],
          benefits: ["Enhanced concentration", "Speech privacy", "Reduced distractions", "Improved virtual meeting quality"],
          processSteps: [
            { title: "Acoustic Assessment", description: "Evaluate current sound environment" },
            { title: "Solution Design", description: "Create comprehensive acoustic plan" },
            { title: "Installation", description: "Implement sound management systems" },
            { title: "Tuning & Calibration", description: "Adjust for optimal acoustic performance" }
          ],
          galleryImages: []
        },
        {
          title: "Commercial Furniture Installation", 
          path: "/services/commercial-furniture-installation", 
          description: "Expert installation of office furniture and systems.", 
          image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80",
          features: ["Workstation assembly", "Cubicle system installation", "Furniture reconfiguration", "Ergonomic setup"],
          benefits: ["Professional appearance", "Maximized space efficiency", "Proper equipment function", "Reduced downtime"],
          processSteps: [
            { title: "Space Preparation", description: "Ensure site is ready for installation" },
            { title: "Delivery Coordination", description: "Manage furniture arrival and staging" },
            { title: "Professional Assembly", description: "Install all components to specifications" },
            { title: "Quality Inspection", description: "Verify proper installation and function" }
          ],
          galleryImages: []
        }
      ]
    },
    // --- NEW: Retail Solutions Category ---
    {
      category: "Retail Solutions",
      services: [
        {
          title: "Storefront Design & Construction", 
          path: "/services/storefront-design", 
          description: "Create impactful retail entrances and storefronts that attract customers.", 
          image: "https://images.unsplash.com/photo-1604937455095-ef2fe3d46fcd?auto=format&fit=crop&q=80",
          features: ["Facade renovation", "Display window design", "Signage integration", "Entrance optimization"],
          benefits: ["Improved brand visibility", "Enhanced curb appeal", "Better customer attraction", "Modern appearance"],
          processSteps: [
            { title: "Brand Assessment", description: "Analyze brand identity and target market" },
            { title: "Design Development", description: "Create compelling storefront concepts" },
            { title: "Construction", description: "Build according to approved designs" },
            { title: "Finishing & Installation", description: "Complete with signage and lighting" }
          ],
          galleryImages: []
        },
        {
          title: "Retail Interior Build-out", 
          path: "/services/retail-interior-build-out", 
          description: "Complete interior construction for retail spaces.", 
          image: "https://images.unsplash.com/photo-1551446591-142875a901a1?auto=format&fit=crop&q=80",
          features: ["Custom fixtures", "Merchandising systems", "Lighting design", "Customer flow planning"],
          benefits: ["Optimized sales environment", "Enhanced shopping experience", "Efficient merchandise display", "Brand reinforcement"],
          processSteps: [
            { title: "Space Planning", description: "Design optimal customer journey and product placement" },
            { title: "Material Selection", description: "Choose fixtures, finishes, and materials" },
            { title: "Construction", description: "Build walls, floors, ceilings, and infrastructure" },
            { title: "Fixture Installation", description: "Install custom displays and merchandising systems" }
          ],
          galleryImages: []
        },
        {
          title: "Pop-up Store Construction", 
          path: "/services/pop-up-store-construction", 
          description: "Temporary retail environments for special events and product launches.", 
          image: "https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?auto=format&fit=crop&q=80",
          features: ["Quick assembly design", "Modular components", "Flexible layouts", "Branded environments"],
          benefits: ["Fast implementation", "High visual impact", "Brand activation", "Reusable components"],
          processSteps: [
            { title: "Concept Creation", description: "Design impactful temporary space" },
            { title: "Modular Fabrication", description: "Build transportable components" },
            { title: "On-site Assembly", description: "Rapid installation at location" },
            { title: "Strike & Storage", description: "Disassemble and store for future use" }
          ],
          galleryImages: []
        },
        {
          title: "Mall Kiosk Design", 
          path: "/services/mall-kiosk-design", 
          description: "Custom retail kiosks and cart solutions for mall environments.", 
          image: "https://images.unsplash.com/photo-1605463208491-19726e72798e?auto=format&fit=crop&q=80",
          features: ["Space-efficient design", "Custom display systems", "Security integration", "Brand-focused elements"],
          benefits: ["Maximized small-space sales", "Attractive product presentation", "Strong brand presence", "Efficient operations"],
          processSteps: [
            { title: "Needs Assessment", description: "Determine product and operational requirements" },
            { title: "Design Development", description: "Create effective small-footprint retail solution" },
            { title: "Custom Fabrication", description: "Build kiosk to exact specifications" },
            { title: "On-site Installation", description: "Set up and prepare for operation" }
          ],
          galleryImages: []
        }
      ]
    },
    // --- NEW: Commercial Construction Category ---

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      // Clean up any pending state updates
      setCurrentTestimonial(current => current);
    };
  }, [testimonials.length]);

  const services = services_new_structure;

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Slider navigation functions
  const nextCategorySlide = () => {
    setCurrentCategorySlide((prev) => Math.min(prev + 1, services.length - 2));
  };

  const prevCategorySlide = () => {
    setCurrentCategorySlide((prev) => Math.max(prev - 1, 0));
  };
  
  // Add proper edge case handling for the slider
  useEffect(() => {
    // If we're at the last slide (showing last two categories), adjust position
    if (currentCategorySlide >= services.length - 2) {
      setCurrentCategorySlide(services.length - 3);
    }
  }, [services.length]);

  // Auto-slide effect for categories (optional)
  useEffect(() => {
    const categoryInterval = setInterval(nextCategorySlide, 7000); // Change category every 7 seconds
    return () => clearInterval(categoryInterval);
  }, [services.length]);

  // Add handler for custom scrollbar
  const handleScroll = () => {
    if (sliderRef.current && thumbRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      // Calculate thumb width percentage
      const thumbWidthPercentage = (clientWidth / scrollWidth) * 100;
      thumbRef.current.style.width = `${thumbWidthPercentage}%`;
      
      // Calculate thumb position percentage
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollPercentage = (scrollLeft / maxScrollLeft) * (100 - thumbWidthPercentage);
      thumbRef.current.style.left = `${scrollPercentage}%`;
      
      // Mark as swiped if the user has scrolled more than 20px
      if (!hasSwipedServices && scrollLeft > 20) {
        setHasSwipedServices(true);
        localStorage.setItem('arxen_has_swiped_services', 'true');
      }
    }
  };



  // Generate the link for the homepage quote form button
  const freeEstimateLink = () => {
    const params = new URLSearchParams();
    if (homeZip) params.append('zip', homeZip);
    if (homeService) params.append('initialService', homeService);
    if (homeCustomService && homeService === 'other') params.append('customService', homeCustomService);
    if (homeTimeline) params.append('initialTimeline', homeTimeline);
    if (homeEmail) params.append('email', homeEmail);
    // We won't pass the checkbox state via URL
    return `/free-estimate?${params.toString()}`;
  };

  // Handler for homepage contact form submission
  // Validate the email address
  const validateHomeContactEmail = () => {
    if (!homeContactEmail.trim()) {
      setEmailError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(homeContactEmail.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError(null);
    return true;
  };
  
  // Validate name field
  const validateHomeContactName = () => {
    if (!homeContactName.trim()) {
      setNameError("Name is required");
      return false;
    }
    
    setNameError(null);
    return true;
  };

  const handleHomeContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateHomeContactEmail();
    const isNameValid = validateHomeContactName();
    
    if (!isEmailValid || !isNameValid || !homeContactMessage) {
      return;
    }

    setHomeContactStatus('submitting');
    
    const formData = new FormData();
    formData.append('name', homeContactName);
    formData.append('email', homeContactEmail);
    formData.append('message', homeContactMessage);
    formData.append('preferred_contact', homeContactPreferredMethods.join(', '));
    
    // Add phone if provided
    if (homeContactPhone) {
      formData.append('phone', homeContactPhone);
    }
    
    // Check for promo code in message and add it as a separate field
    if (homeContactMessage.includes('ARX25')) {
      formData.append('promo_code', 'ARX25');
      formData.append('discount_applied', 'YES - 10% OFF LABOR');
    }

    fetch('https://formspree.io/f/xbloejrb', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setHomeContactStatus('success');
        setHomeContactName('');
        setHomeContactEmail('');
        setHomeContactMessage('');
        setHomeContactPhone('');
        setHomeContactPreferredMethods(['email']);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setHomeContactStatus('idle');
        }, 5000);
      })
      .catch(error => {
        console.error('Form submission error:', error);
        setHomeContactStatus('error');
        
        // Reset error state after 5 seconds
        setTimeout(() => {
          setHomeContactStatus('idle');
        }, 5000);
      });
  };

  // Filter services based on selected filter type
  const filteredServices = useMemo(() => {
    if (serviceFilterType === 'all') {
      return services;
    }
    
    // Filter categories based on commercial or residential
    return services.filter(category => {
      // Check if category name matches filter or contains services with matching type
      const isMatchingCategory = 
        (serviceFilterType === 'commercial' && ['Commercial Services', 'Office Services', 'Retail Solutions'].some(term => category.category.includes(term))) ||
        (serviceFilterType === 'residential' && ['Remodeling', 'Flooring', 'Interior', 'Wood Services', 'Painting & Finishing', 'Exterior & Construction'].some(term => category.category.includes(term)));
      
      // If category matches directly, keep it
      if (isMatchingCategory) {
        return true;
      }
      
      // Otherwise check individual services
      return category.services.some(service => {
        const serviceTitle = service.title.toLowerCase();
        const serviceDesc = service.description ? service.description.toLowerCase() : '';
        return (serviceFilterType === 'commercial' && 
                (serviceTitle.includes('commercial') || serviceTitle.includes('office') || 
                 serviceTitle.includes('business') || serviceTitle.includes('retail') || 
                 serviceTitle.includes('restaurant') || serviceTitle.includes('warehouse') ||
                 serviceTitle.includes('corporate') || serviceTitle.includes('store') ||
                 serviceDesc.includes('commercial') || serviceDesc.includes('business'))) ||
               (serviceFilterType === 'residential' && 
                (serviceTitle.includes('residential') || serviceTitle.includes('home') || 
                 serviceTitle.includes('house') || serviceDesc.includes('home')));
      });
    });
  }, [services, serviceFilterType]);

  // Extend Window interface to add our custom properties
  interface Window {
    navigationStartTime?: number;
    navigationTimer?: ReturnType<typeof setTimeout>;
  }
  
  // Add navigation detection with improved handling
  useEffect(() => {
    // Handle initial page load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      console.log('Initial load, showing loading indicator');
      setIsPageLoading(true);
      const initialLoadTimer = setTimeout(() => {
        console.log('Initial load complete');
        setIsPageLoading(false);
      }, 1000); // Ensure loading shows for at least 1 second for better UX
      
      return () => clearTimeout(initialLoadTimer);
    }
    
    // Navigation detection using mutation observer
    const handleNavigationStart = () => {
      console.log('Navigation started, showing loading indicator');
      setIsPageLoading(true);
      
      // Ensure body scrolls back to top
      window.scrollTo(0, 0);
      
      // Store navigation start timestamp to ensure minimum display time
      window.navigationStartTime = Date.now();
    };
    
    const handleNavigationEnd = () => {
      console.log('Navigation completed');
      // Ensure loading indicator stays visible for at least 800ms for better UX
      const elapsedTime = Date.now() - (window.navigationStartTime || 0);
      const minDisplayTime = 800;
      
      if (elapsedTime < minDisplayTime) {
        setTimeout(() => {
          setIsPageLoading(false);
        }, minDisplayTime - elapsedTime);
      } else {
        setIsPageLoading(false);
      }
    };
    
    // Handle errors during navigation
    const handleNavigationError = () => {
      console.error('Navigation error detected');
      setIsPageLoading(false);
    };
    
    // Improved link click handler with better event capturing
    const linkClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && 
          link.getAttribute('href') && 
          link.getAttribute('href')?.startsWith('/') && 
          !link.getAttribute('href')?.startsWith('/#') &&
          !link.hasAttribute('download') &&
          !link.hasAttribute('target')) {
        console.log('Link click detected:', link.getAttribute('href'));
        handleNavigationStart();
      }
    };
    
    // Directly capture React Router navigation
    const routeChangeHandler = () => {
      const currentPath = window.location.pathname;
      if (lastKnownPath !== currentPath) {
        console.log('Route change detected:', currentPath);
        lastKnownPath = currentPath;
        handleNavigationStart();
        // Set a timeout to ensure navigation end is called if something goes wrong
        setTimeout(handleNavigationEnd, 5000);
      }
    };
    
    // Keep track of last known path
    let lastKnownPath = window.location.pathname;
    
    // Apply all event listeners
    document.addEventListener('click', linkClickHandler, { capture: true });
    
    // Create a fallback to reset loading state if it gets stuck
    const loadingResetTimer = setInterval(() => {
      if (isPageLoading) {
        console.warn('Loading indicator was stuck for 10s, forcing reset');
        setIsPageLoading(false);
      }
    }, 10000);
    
    // Listen for various navigation events
    window.addEventListener('popstate', handleNavigationStart);
    window.addEventListener('pushState', routeChangeHandler);
    window.addEventListener('replaceState', routeChangeHandler);
    window.addEventListener('load', handleNavigationEnd);
    document.addEventListener('DOMContentLoaded', handleNavigationEnd);
    window.addEventListener('error', handleNavigationError);
    
    // Monitor for React Router updates using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        routeChangeHandler();
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    return () => {
      // Clean up all event listeners
      document.removeEventListener('click', linkClickHandler, { capture: true });
      window.removeEventListener('popstate', handleNavigationStart);
      window.removeEventListener('pushState', routeChangeHandler);
      window.removeEventListener('replaceState', routeChangeHandler);
      window.removeEventListener('load', handleNavigationEnd);
      document.removeEventListener('DOMContentLoaded', handleNavigationEnd);
      window.removeEventListener('error', handleNavigationError);
      clearInterval(loadingResetTimer);
      observer.disconnect();
    };
  }, [isPageLoading]);

  // Handle zip code input with real-time validation
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipValue = e.target.value;
    
    // Allow only numbers and hyphen, max 10 chars (12345-6789)
    if (/^[0-9\-]{0,10}$/.test(zipValue)) {
      setHomeZip(zipValue);
      
      // Only validate if there's input (don't show error when empty)
      if (zipValue.trim()) {
        const validation = validateZipCode(zipValue);
        setHomeZipError(validation.isValid ? null : validation.message || null);
      } else {
        setHomeZipError(null);
      }
    }
  };

  return (
    <Router>
      <PropertyTypeProvider>
        <ScrollToTop />
        <LoadingIndicator isLoading={isPageLoading} />
        
        {/* Navigation Bar - With scroll behavior */}
        <div className={`border-b border-gray-200/70 bg-white/70 backdrop-blur-md sticky top-0 z-[1500] transition-transform duration-300 ${!visible && !isHomePage ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <a href="/" className="flex items-center space-x-3 mt-2">
                <img 
                  src="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" 
                  alt="Arxen Construction Logo" 
                  className="h-24 sm:h-28 md:h-32 w-auto"
                />
              </a>
              <div className="hidden lg:flex items-center space-x-6">
                <div className="relative group">
                  <button className="text-gray-800 hover:text-blue-600 font-medium text-base flex items-center group-hover:text-blue-600 transition-all duration-300 relative">
                    Services
                    <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </button>
                  
                  {/* Services Dropdown - Horizontal Grid Layout */}
                  <div className="absolute left-0 mt-2 w-[650px] bg-white rounded-lg shadow-2xl z-[1200] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-gray-200">
                    {/* Added invisible element to create a hover bridge between button and content */}
                    <div className="absolute h-2 -top-2 inset-x-0"></div>
                    <div className="p-5">
                      {/* Filter Tabs for All/Commercial/Residential - REPLACED with compact design */}
                      <div className="mb-4 flex justify-end">
                        <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-sm">
                          {[
                            { id: 'all', label: 'All' },
                            { id: 'commercial', label: 'Commercial' },
                            { id: 'residential', label: 'Residential' }
                          ].map((option) => (
                            <button
                              key={option.id}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                                serviceFilterType === option.id 
                                  ? 'bg-white text-blue-700 shadow-sm' 
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                setServiceFilterType(option.id as any);
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {filteredServices.map((category, index) => (
                          <div key={index}>
                            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">{category.category}</h3>
                            <div className="space-y-1">
                              {category.services.slice(0, 3).map((service, serviceIndex) => (
                                <div key={serviceIndex}>
                                  <Link 
                                    to={service.path}
                                    className="flex items-center text-gray-700 hover:text-blue-900 hover:bg-gray-100 rounded py-1 px-2 transition-colors duration-150"
                                  >
                                    <span className="flex-grow text-sm">{service.title}</span>
                                    <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-700" />
                                  </Link>
            </div>
                              ))}
                              {category.services.length > 3 && (
                                <div>
                                  <Link
                                    to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded py-1 px-2 text-sm italic mt-1"
                                  >
                                    View all {category.category}...
                                  </Link>
      </div>
                              )}
        </div>
                    </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <Link
                          to="/free-estimate"
                          className="inline-block bg-blue-900 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                        >
                          Get a Free Estimate
                        </Link>
                        <div>
                          <Link to="/contact" className="text-blue-900 font-semibold hover:text-blue-700 flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-1" />
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
          </div>
        </div>

                {/* Add missing navigation links */}
                
                <Link to="/residential" className="text-gray-800 hover:text-blue-600 font-medium relative">
                  Residential
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 origin-left"></span>
                </Link>
                
                <Link to="/commercial" className="text-gray-800 hover:text-blue-600 font-medium relative">
                  Commercial
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 origin-left"></span>
                </Link>
                
                <Link to="/about" className="text-gray-800 hover:text-blue-600 font-medium relative">
                  About Us
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 origin-left"></span>
                </Link>
                
                <Link to="/contact" className="text-gray-800 hover:text-blue-600 font-medium relative">
                  Contact
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 origin-left"></span>
                </Link>
                
                <Link to="/free-estimate" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative">Free Estimate</span>
                </Link>
              </div>
              
              {/* Mobile buttons */}
              <div className="flex items-center lg:hidden">
                
                {/* Existing mobile menu button */}
                <button 
                  className="lg:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors duration-200" 
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'transform rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              </div>
            </div>
          </div>
        </div>


        
        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-md shadow-lg z-[1400] border-t border-gray-200/70 overflow-y-auto animate-slide-in-right">
            <div className="container mx-auto px-4 py-6 space-y-5">
              {/* Simplified mobile menu links - needs expansion */}
              <Link to="/" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </span>
              </Link>
              
              {/* Mobile Services Dropdown */}
              <div className="relative py-2 border-b border-gray-200">
                <button 
                  className="flex items-center justify-between w-full text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
                  // Removed the toggle functionality to keep services always visible
                >
                  <span className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Services
                  </span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                
                {/* Add Service Type Filter Tabs - Updated to a more compact design */}
                <div className="mt-2 mb-4 flex justify-center">
                  <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-sm">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'commercial', label: 'Commercial' },
                      { id: 'residential', label: 'Residential' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                          serviceFilterType === option.id 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setServiceFilterType(option.id as 'all' | 'commercial' | 'residential')}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div id="mobile-services-dropdown" className="mt-2 space-y-1 pl-7 animate-fade-in">
                  {filteredServices.map((category, index) => (
                    <div key={index} className="py-1">
                      <div className="flex items-center font-medium text-gray-700 mb-1">
                        <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">
                          {category.category}
                        </span>
                      </div>
                      <div className="pl-3 space-y-1">
                        {category.services.slice(0, 3).map((service, serviceIndex) => (
                          <Link 
                            key={serviceIndex}
                            to={service.path}
                            className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm py-1 transform transition-transform duration-200 hover:translate-x-1 flex items-center"
                            onClick={toggleMobileMenu}
                          >
                            <ChevronRight className="w-3 h-3 mr-1 text-gray-500" />
                            {service.title}
                          </Link>
                        ))}
                        <Link 
                          to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm py-1 italic"
                          onClick={toggleMobileMenu}
                        >
                          View all {category.category}...
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to="/residential" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Residential
                      </span>
              </Link>
              <Link to="/commercial" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Commercial
                </span>
              </Link>
              <Link to="/financing" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financing
                </span>
              </Link>
              <Link to="/about" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  About Us
                </span>
              </Link>
              <Link to="/contact" className="block text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2 border-b border-gray-200 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact
                </span>
              </Link>
              <Link 
                to="/free-estimate" 
                className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 mt-6 flex items-center justify-center space-x-2" 
                onClick={toggleMobileMenu}
              >
                <Clipboard className="w-5 h-5" />
                <span>Free Estimate</span>
              </Link>

              {/* Quick Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-3 text-gray-700">
                  <Phone className="w-5 h-5 mr-2 text-gray-700" /> 
                  <a href="tel:404-934-9458" className="hover:text-blue-600 transition-colors duration-200">
                    404-934-9458
                  </a>
        </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-2 text-gray-700" /> 
                  <a href="mailto:teamarxen@gmail.com" className="flex items-center group text-sm" onClick={(e) => {
                      // Allow default behavior on mobile, prevent on desktop
                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      if (!isMobile) {
                        e.preventDefault();
                        // Optionally show a notification that this is a phone number
                        console.log("Redirecting to contact page");
                      }
                    }}>
                    <div className="bg-blue-700/50 p-1.5 rounded-full mr-2 group-hover:bg-blue-600 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors" />
                   </div>
                    <span className="group-hover:text-white transition-colors">teamarxen@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator Component */}
        <div id="page-loading-indicator" className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-white transition-opacity duration-300" style={{opacity: 0, pointerEvents: 'none'}}>
          <div className="flex flex-col items-center justify-center">
            {/* Arxen Logo */}
            <div className="mb-6 animate-pulse transition-all">
              <img 
                src="https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png" 
                alt="Arxen Construction Logo" 
                className="h-40 w-auto"
              />
            </div>
            {/* Loading animation circle */}
            <div className="relative h-2 w-60 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="absolute h-full bg-blue-600 animate-loading-bar"></div>
            </div>
            <p className="text-lg font-medium text-blue-900">
              Loading Your Experience...
            </p>
          </div>
        </div>

        {/* Error Boundary for catching React errors */}
        <div id="page-error-boundary" className="fixed inset-0 z-[2000] items-center justify-center bg-white" style={{display: 'none'}}>
          <div className="max-w-md mx-auto p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>

        {/* Routes for all pages - wrapped in Suspense for better loading handling */}
        <Suspense fallback={<LoadingIndicator isLoading={true} />}>
        <Routes>
          {/* Redirect from /quote to /free-estimate for legacy links */}
          <Route path="/quote" element={<Navigate to="/free-estimate" replace />} />
          
          {/* Home Page Route */}
          <Route path="/" element={
            <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
              {/* Add HomeSEO component for improved search engine optimization */}
              <HomeSEO />
              
              {/* Hero Section - Enhanced with professional gradient overlay */}
              <div 
                className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center text-center bg-cover bg-center z-[5]" 
                style={{ backgroundImage: `url('https://i.postimg.cc/V5PtMvhn/532-DAFC0-2337-4-D95-969-F-773-A6053-B8-F7-4-5005-c.jpg')` }}
              >
                {/* Professional gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-black/70 to-blue-900/80"></div>
                <div className="relative z-[10] text-white px-4">
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4">Build Your Dream</h1>
                  <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto">Expert construction and remodeling services for residential and commercial properties.</p>
                  <Link 
                    to="/free-estimate" 
                    onClick={(e) => {
                      // Use window.location.href for more reliable navigation that bypasses React Router
                      window.location.href = '/free-estimate';
                      e.preventDefault();
                    }}
                    className="bg-blue-900 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Get a Free Estimate
                  </Link>
          </div>
        </div>

              {/* Services Category Slider Section - Subtle wave background */}
              <div className="py-10 sm:py-12 md:py-16 relative z-[2] overflow-hidden">
                {/* Dynamic wave-like background shapes */}
                <div className="absolute inset-0 bg-white opacity-95 z-[-1]"></div>
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                  <div className="absolute top-[10%] right-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-100/30 to-blue-200/20 blur-3xl"></div>
                  <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-tr from-gray-100/30 to-blue-100/20 blur-3xl"></div>
                </div>
                
        <div className="container mx-auto px-3 sm:px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-12">Explore Our Services</h2>
                <div className="relative overflow-hidden group">
                  {/* Scroll hint for mobile - only shown initially until user swipes, hidden on desktop and larger screens */}
                  {!hasSwipedServices && (
                    <div className="relative z-20 mb-2 px-4 transition-opacity duration-300 sm:hidden">
                      <div className="flex items-center justify-start">
                        <div className="flex items-center text-xs text-blue-600">
                          <svg className="w-3.5 h-3.5 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span>Swipe to explore</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Slider Track - Make this scrollable and hide default scrollbar */}
                  <div 
                    ref={sliderRef} // Add ref for scroll tracking
                    className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide services-slider-track relative"
                    style={{ transform: `translateX(0%)` }} // Remove transform, rely on scroll
                    onScroll={handleScroll} // Add scroll handler
                    onTouchStart={(e) => {
                      touchStartXRef.current = e.touches[0].clientX;
                    }}
                    onTouchMove={(e) => {
                      if (touchStartXRef.current !== null) {
                        const touchDiff = touchStartXRef.current - e.touches[0].clientX;
                        if (Math.abs(touchDiff) > 20 && !hasSwipedServices) {
                          setHasSwipedServices(true);
                          localStorage.setItem('arxen_has_swiped_services', 'true');
                        }
                      }
                    }}
                    onTouchEnd={() => {
                      touchStartXRef.current = null;
                    }}
                  >
                    {services.map((category, index) => (
                      <div key={index} className="w-[85%] sm:w-[70%] md:w-[50%] lg:w-[33%] flex-shrink-0 px-1.5 sm:px-2 snap-start first:pl-4 last:pr-8">
                        <div className="relative group block bg-black rounded-2xl overflow-hidden shadow-lg h-[240px] sm:h-[280px] md:h-[400px] hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                          {/* Category index badge */}
                          <div className="absolute top-3 left-3 z-10 bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-white/40">
                            {index + 1}
                          </div>
                          <img
                            alt={category.category}
                            src={
                              category.category === "Wood Services" 
                                ? "https://i.postimg.cc/xdRdCXXp/image.png" 
                                : category.category === "Flooring" 
                                  ? "https://i.postimg.cc/pryMPTjj/image.png" 
                                  : category.category === "Exterior & Construction" 
                                    ? "https://i.postimg.cc/zfSkGFSm/image.png" 
                                    : category.category === "Painting & Finishing" 
                                      ? "https://i.postimg.cc/yYRKrDyg/image.png" 
                                      : category.category === "Smart Home Basics" 
                                        ? "https://i.postimg.cc/yxHNL03P/image.png" 
                                        : category.category === "Retail Services" 
                                          ? "https://i.postimg.cc/gkwgdRxs/image.png"
                                          : category.category === "Commercial Services"
                                            ? "https://i.postimg.cc/zDt7bs0D/image.png"
                                            : category.category === "Interior & Drywall"
                                              ? "https://i.postimg.cc/nc1dk3KM/image.png"
                                              : category.category === "Remodeling"
                                                ? "https://i.postimg.cc/X73WqD7v/image.png"
                                                : category.services[0]?.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
                            } 
                            className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col justify-end h-full">
                            <div className="bg-black bg-opacity-70 p-3 sm:p-4 rounded">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{category.category}</h3>
                              {/* Optional: List first few services */}
                              <ul className="text-gray-300 space-y-1 mb-2 sm:mb-3 text-xs sm:text-sm">
                                {category.services.slice(0, 1).map((service, i) => (
                                  <li key={i} className="flex items-center">
                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2 text-blue-400 flex-shrink-0" />
                                    <span className="line-clamp-1">{service.title}</span>
                                  </li>
                                ))}
                                {category.services.length > 1 && (
                                  <li className="italic text-xs text-blue-200">
                                    +{category.services.length - 1} more services
                                  </li>
                                )}
                              </ul>
                              <Link 
                                to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-[10px] sm:text-xs font-medium"
                              >
                                View Services <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1 sm:ml-1.5" />
                              </Link>
                  </div>
                  </div>
                </div>
                      </div>
                    ))}
              </div>
                  
                  {/* Scroll Indicators */}
                  <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-2">
                    <button 
                      onClick={() => {
                        if (sliderRef.current) {
                          sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth * 0.7, behavior: 'smooth' });
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="Previous slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  
                  {/* Custom Scrollbar */}
                    <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden flex-1 max-w-[120px] sm:max-w-[180px]">
                    <div 
                      ref={thumbRef} // Add ref for the thumb
                      className="absolute top-0 left-0 h-full bg-blue-400 rounded-full cursor-grab" // Changed to blue, added cursor
                        style={{ width: '30%', left: '0%' }} // Initial state controlled by JS
                    ></div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (sliderRef.current) {
                          sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth * 0.7, behavior: 'smooth' });
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="Next slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us - Enhanced Ticker Background */}
            <div className="py-8 relative overflow-hidden">
              {/* Professional gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800"></div>
              {/* Subtle animated shapes in the background */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full border-4 border-white animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] right-[30%] w-24 h-24 rounded-full border-4 border-white animate-pulse-slow animation-delay-1000"></div>
              </div>
              
              <div className="relative w-full flex overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap text-white">
                  {[
                    { icon: <Hammer className="w-5 h-5" />, text: '20+ Years Experience' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'Full-Service Solutions' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Licensed & Insured' },
                    { icon: <Clock className="w-5 h-5" />, text: 'On-Time Completion' },
                    { icon: <Package className="w-5 h-5" />, text: 'Quality Materials' }, // New Item
                    { icon: <DollarSign className="w-5 h-5" />, text: 'Transparent Pricing' }, // New Item
                    { icon: <Heart className="w-5 h-5" />, text: 'Customer Focused' }, // New Item
                    { icon: <MessageSquare className="w-5 h-5" />, text: 'Free Consultations' }, // New Item
                    { icon: <Award className="w-5 h-5" />, text: 'Workmanship Warranty' }, // New Item
                    // Duplicate items for seamless looping
                    { icon: <Hammer className="w-5 h-5" />, text: '20+ Years Experience' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'Full-Service Solutions' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Licensed & Insured' },
                    { icon: <Clock className="w-5 h-5" />, text: 'On-Time Completion' },
                    { icon: <Package className="w-5 h-5" />, text: 'Quality Materials' },
                    { icon: <DollarSign className="w-5 h-5" />, text: 'Transparent Pricing' },
                    { icon: <Heart className="w-5 h-5" />, text: 'Customer Focused' },
                    { icon: <MessageSquare className="w-5 h-5" />, text: 'Free Consultations' },
                    { icon: <Award className="w-5 h-5" />, text: 'Workmanship Warranty' },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center mx-4 sm:mx-6 lg:mx-12">
                      <div className="mr-1.5 sm:mr-2 text-blue-300">
                        {React.cloneElement(feature.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                      </div>
                      <span className="font-medium text-xs sm:text-sm lg:text-lg whitespace-nowrap">{feature.text}</span>
                    </div>
                  ))}
                </div>
                {/* Duplicate the above div for seamless animation */}
                <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap text-white">
                  {[
                    { icon: <Hammer className="w-5 h-5" />, text: '20+ Years Experience' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'Full-Service Solutions' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Licensed & Insured' },
                    { icon: <Clock className="w-5 h-5" />, text: 'On-Time Completion' },
                    { icon: <Package className="w-5 h-5" />, text: 'Quality Materials' },
                    { icon: <DollarSign className="w-5 h-5" />, text: 'Transparent Pricing' },
                    { icon: <Heart className="w-5 h-5" />, text: 'Customer Focused' },
                    { icon: <MessageSquare className="w-5 h-5" />, text: 'Free Consultations' },
                    { icon: <Award className="w-5 h-5" />, text: 'Workmanship Warranty' },
                    // Duplicate items for seamless looping
                    { icon: <Hammer className="w-5 h-5" />, text: '20+ Years Experience' },
                    { icon: <CheckCircle className="w-5 h-5" />, text: 'Full-Service Solutions' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Licensed & Insured' },
                    { icon: <Clock className="w-5 h-5" />, text: 'On-Time Completion' },
                    { icon: <Package className="w-5 h-5" />, text: 'Quality Materials' },
                    { icon: <DollarSign className="w-5 h-5" />, text: 'Transparent Pricing' },
                    { icon: <Heart className="w-5 h-5" />, text: 'Customer Focused' },
                    { icon: <MessageSquare className="w-5 h-5" />, text: 'Free Consultations' },
                    { icon: <Award className="w-5 h-5" />, text: 'Workmanship Warranty' },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center mx-4 sm:mx-6 lg:mx-12">
                      <div className="mr-1.5 sm:mr-2 text-blue-300">
                        {React.cloneElement(feature.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                        </div>
                      <span className="font-medium text-xs sm:text-sm lg:text-lg whitespace-nowrap">{feature.text}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

            {/* Free Quote Section - Leave as is, as requested */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
                  <div className="grid lg:grid-cols-5">
                    {/* Left side - Promotion */}
                    <div className="lg:col-span-2 relative h-full min-h-[320px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900 overflow-hidden">
                        {/* Decorative patterns */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                          <div className="absolute top-[10%] left-[20%] w-32 h-32 rounded-full border-4 border-white"></div>
                          <div className="absolute bottom-[30%] right-[10%] w-24 h-24 rounded-full border-4 border-white"></div>
                          <div className="absolute top-[40%] right-[25%] w-16 h-16 rounded-full border-4 border-white"></div>
        </div>
      </div>

                      <div className="relative p-6 sm:p-8 lg:p-12 h-full flex flex-col justify-center text-white">
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-8 hover:scale-110 transition-transform">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          LIMITED TIME OFFER <span className="ml-1 sm:ml-2 font-bold"><CountdownTimer /></span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">Summer Renovation Special</h2>
                        
                        <div className="flex items-baseline mb-4 sm:mb-6">
                          <div className="text-5xl sm:text-7xl lg:text-8xl font-bold">25%</div>
                          <div className="text-xl sm:text-2xl ml-2 font-light">OFF</div>
            </div>
                        
                        <div className="text-lg sm:text-xl lg:text-2xl font-medium mb-3 sm:mb-4 uppercase tracking-wider">YOUR ENTIRE PROJECT</div>
                        
                        <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl mb-4 sm:mb-6">
                          <p className="mb-2 sm:mb-3 text-sm sm:text-base">Transform your space with our comprehensive renovation services including:</p>
                          <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-300" />
                              <span>Premium materials & craftsmanship</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-300" />
                              <span>Professional design consultation</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0 text-blue-300" />
                              <span>Expert installation team</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center mt-auto text-sm font-light">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Offer ends 5/31/24.</span>
          </div>
        </div>
      </div>

                    {/* Right side - Form */}
                    <div className="lg:col-span-3 p-8 lg:p-12">
                      <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-8">
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
                            Schedule a <span className="text-blue-700">FREE</span> Consultation
                          </h2>
                        </div>
                        
                        {/* Replaced <form> with <div> */} 
                        <div className="space-y-6">
                          {/* Progress Steps */} 
                          <div className="flex justify-between mb-4 sm:mb-6">
                            {['Contact Info', 'Project Details', 'Confirmation'].map((step, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mb-1 ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                  {i + 1}
                                </div>
                                <span className={`text-xs ${i === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'} text-center`}>{i === 0 ? step : step.split(' ')[0]}</span>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="grid gap-5 md:grid-cols-2">
                              {/* Zip Code Input */}
                              <div className="relative md:col-span-2">
                                <label htmlFor="home-zip" className="block text-sm font-medium text-gray-700 mb-1">Your Location</label>
                                <div className="relative">
                                  <input
                                    id="home-zip"
                                    type="text"
                                    placeholder="Enter your zip code"
                                    value={homeZip}
                                    onChange={handleZipChange}
                                    className={`w-full px-4 pl-10 py-3 rounded-lg border ${
                                      homeZipError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    } shadow-sm transition-all`}
                                  />
                                  <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                  {homeZipError && (
                                    <div className="text-red-500 text-sm mt-1 absolute">
                                      {homeZipError}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Service Type Select */}
                              <div className="relative">
                                <label htmlFor="home-service" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                <div className="relative">
                                  <select 
                                    id="home-service"
                                    value={homeService}
                                    onChange={(e) => setHomeService(e.target.value)}
                                    className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all appearance-none"
                                  >
                                    <option value="">Select service</option>
                                    <option value="kitchen">Kitchen Remodeling</option>
                                    <option value="bathroom">Bathroom Renovation</option>
                                    <option value="painting">Painting</option>
                                    <option value="flooring">Flooring</option>
                                    <option value="additions">Room Additions</option>
                                    <option value="wood">Wood Services</option>
                                    <option value="commercial">Commercial Service</option> 
                                    <option value="other">Other / Custom</option>
                                  </select>
                                  <Hammer className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                  <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                </div>
                                
                                {/* Custom Service Input - shown when "Other / Custom" is selected */}
                                {homeService === 'other' && (
                                  <div className="mt-2 animate-fade-in">
                                    <input 
                                      type="text"
                                      id="home-custom-service"
                                      placeholder="Please describe the specific service you need"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      value={homeCustomService || ''}
                                      onChange={(e) => setHomeCustomService(e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Timeline Select */}
                              <div className="relative">
                                <label htmlFor="home-timeline" className="block text-sm font-medium text-gray-700 mb-1">Project Timeline</label>
                                <div className="relative">
                                  <select 
                                    id="home-timeline"
                                    value={homeTimeline}
                                    onChange={(e) => setHomeTimeline(e.target.value)}
                                    className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all appearance-none"
                                  >
                                    <option value="">Select timeline</option>
                                    <option value="asap">As soon as possible</option>
                                    <option value="1month">Within 1 month</option>
                                    <option value="3months">1-3 months</option>
                                    <option value="planning">Just planning</option>
                                  </select>
                                  <Clock className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                  <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                </div>
                              </div>
                              
                              {/* Email Input */}
                              <div className="relative md:col-span-2">
                                <label htmlFor="home-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                  <input
                                    id="home-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={homeEmail}
                                    onChange={(e) => setHomeEmail(e.target.value)}
                                    className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                                  />
                                  <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Keep Updated Checkbox */}
                            <div className="mt-6">
                              <label className="flex items-start gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  id="home-keep-updated"
                                  name="home-keep-updated"
                                  checked={homeKeepUpdated}
                                  onChange={(e) => setHomeKeepUpdated(e.target.checked)}
                                  className="mt-1 accent-blue-600 h-4 w-4 rounded transition-all cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                  Keep me updated about special offers and design tips. We respect your privacy.
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* Conditionally Enabled/Disabled Link */}
                          <Link 
                            to={freeEstimateLink()} // Use function to generate dynamic link
                            // Prevent navigation if zip code is missing
                            onClick={(e) => { 
                              if (!homeZip.trim()) {
                                e.preventDefault();
                                alert("Please enter your zip code to continue.");
                              } else {
                                // Log that we're passing data to the FreeEstimate page
                                console.log("Passing data to FreeEstimate:", {
                                  zip: homeZip,
                                  initialService: homeService,
                                  initialTimeline: homeTimeline,
                                  email: homeEmail
                                });
                              }
                            }}
                            className={`w-full font-bold py-4 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden group flex items-center justify-center ${!homeZip.trim() ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            aria-disabled={!homeZip.trim()}
                          >
                            {!homeZip.trim() && <span className="absolute inset-0 bg-black opacity-10"></span>}
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${!homeZip.trim() ? 'hidden' : ''}"></span>
                            <span className="relative flex items-center font-medium text-base">
                              CONTINUE TO NEXT STEP
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </Link>
                          {/* Optional: Add error message if needed */} 
                          {!homeZip.trim() && (
                              <p className="text-center text-red-600 text-sm mt-2">
Please enter your zip code to continue.
                              </p>
                          )}
                        </div> { /* End space-y-6 */}
                        
                        {/* Contact Info below form */}
                        <div className="mt-6 text-center">
                           <p className="mb-2 text-gray-700">Prefer to talk to someone directly?</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                              href="/contact" 
                              className="flex items-center px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Phone className="w-5 h-5 mr-2 animate-pulse" />
                              <span className="font-medium">Contact Us</span>
                            </a>
                            
                            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                            
                            <a 
                              href="mailto:teamarxen@gmail.com" 
                              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              <span>teamarxen@gmail.com</span>
                            </a>
              </div>
                          
                          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Mon-Fri: 8AM-6PM</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Sat-Sun: 8AM-6PM</span>
                            </div>
                          </div>
                        </div>
                      </div> { /* End max-w-2xl */}
                    </div> { /* End lg:col-span-3 */}
                  </div> { /* End grid */}
                </div> { /* End max-w-6xl */}
              </div> { /* End container */}
            </div> { /* End py-20 */}

      {/* Commercial Services Section - Enhanced dynamic background */}
      <div className="py-24 relative overflow-hidden">
        {/* Strong geometric background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900"></div>
        
        {/* Bold geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff_1px,transparent_1px),linear-gradient(135deg,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        {/* Large decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-gradient-to-tr from-blue-500/30 to-transparent rounded-tl-[100px]"></div>
          <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-blue-400/30 to-transparent rounded-br-[100px]"></div>
        </div>
        
        {/* Floating orbs with stronger colors */}
        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-blue-300/20 blur-xl opacity-80 animate-float"></div>
        <div className="absolute top-[15%] left-[20%] w-40 h-40 rounded-full bg-gradient-to-tr from-blue-300/20 to-white/20 blur-xl opacity-80 animate-float-delayed"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative inline-block">
              Commercial Services
            </h2>
            <p className="text-gray-100 text-base sm:text-lg max-w-2xl mx-auto mt-3 sm:mt-4 px-3 sm:px-0">
              Explore our comprehensive range of commercial services tailored to meet your business needs.
              </p>
            </div>

          {/* Featured Building Types with Interactive Hover */}
          <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
            {[
              {
                title: 'Office Renovations',
                description: 'Modernize your workspace with our expert renovation services.',
                icon: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?q=80&w=800&auto=format",
                path: '/services/office-renovation',
                features: ['Modern Layouts', 'Efficient Spaces', 'Professional Design'],
                bgColor: 'bg-blue-900'
              },
              {
                title: 'Retail Fit-Outs',
                description: 'Create a stunning retail environment that attracts customers.',
                icon: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80",
                path: '/services/retail-fit-out',
                features: ['Customer-focused Design', 'Maximized Sales Space', 'Brand Integration'],
                bgColor: 'bg-blue-900'
              },
              {
                title: 'Industrial Solutions',
                description: 'Efficient and reliable solutions for industrial spaces.',
                icon: "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?q=80&w=800&auto=format",
                path: '/services/warehouse-industrial',
                features: ['Durability', 'Safety Compliance', 'Space Optimization'],
                bgColor: 'bg-blue-900'
              }
            ].map((service, index) => (
              <Link 
                key={index}
                to={service.path}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform duration-200 transform hover:-translate-y-1 will-change-transform"
              >
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-black/80 opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white text-sm transform translate-y-0 group-hover:translate-y-0 transition-transform">
                      {service.description}
                    </p>
                      </div>
                    </div>
                <div className={`p-6 ${service.bgColor} border-t-4 border-blue-400`}>
                  <div className="space-y-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2"></div>
                        <span className="text-sm">{feature}</span>
                        </div>
                ))}
              </div>
                  <div className="mt-4 pt-4 border-t border-blue-800 flex justify-end items-center">
                    <div className="bg-blue-700 rounded-full p-2 shadow-md transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
              </Link>
            ))}
      </div>

          {/* Building Type Selector - Enhanced with bolder colors */}
          <div className="mt-16 max-w-5xl mx-auto bg-blue-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border-2 border-blue-600/50">
            <h3 className="text-xl font-semibold text-center mb-6 text-white">Find Solutions For Your Building Type</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-4">
              {[
                { name: 'Office', icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'office-renovation' },
                { name: 'Retail', icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'retail-fit-out' },
                { name: 'Industrial', icon: <Factory className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'warehouse-industrial' },
                { name: 'Restaurant', icon: <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'restaurant-renovation' },
                { name: 'Healthcare', icon: <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'healthcare-facilities' },
                { name: 'Education', icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'education-facilities' },
                { name: 'Hospitality', icon: <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'hospitality-renovation' },
                { name: 'Office Park', icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'office-park' },
                { name: 'Mall/Plaza', icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'mall-plaza' },
                { name: 'Warehouse', icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'warehouse-construction' },
                { name: 'Data Center', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'data-center-construction' },
                { name: 'Custom', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, buildingType: 'custom-services' }
              ].map((type, index) => (
                <Link
                  key={index}
                  to={`/free-estimate?projectType=commercial&buildingType=${type.buildingType}`}
                  className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-lg hover:bg-blue-700 transition-colors group text-center"
                >
                  <div className="bg-blue-800 p-2 sm:p-3 rounded-full mb-1 sm:mb-2 text-blue-200 group-hover:bg-blue-300 group-hover:text-blue-900 transition-colors">
                    {type.icon}
            </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-100 whitespace-nowrap">{type.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link 
              to="/free-estimate?projectType=commercial" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform"
            >
              Request a Commercial Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <div className="mt-2 text-sm text-blue-200">Free, no-obligation estimate for your project</div>
          </div>
        </div>
      </div>

      {/* Combined Residential & Commercial Expertise Section - White/Grayish with visible elements */}
      <div className="py-24 relative overflow-hidden">
        {/* Light background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100"></div>
        
        {/* More visible geometric patterns */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e3a8a_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>
        </div>
        
        {/* Clearly visible decorative elements */}
        <div className="absolute top-0 inset-x-0 h-2 bg-blue-600"></div>
        <div className="absolute bottom-0 inset-x-0 h-2 bg-blue-600"></div>
        
        {/* Distinct geometric shapes */}
        <div className="absolute right-0 top-0 w-full h-full overflow-visible">
          <svg className="absolute right-0 top-0 h-full w-2/3 text-blue-200 opacity-50" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M125,-160.4C171.6,-143.7,223.6,-122.3,246.8,-83.7C270,-45.1,264.4,10.6,244.1,58.5C223.8,106.4,188.8,146.3,146.5,177.9C104.2,209.4,54.6,232.5,1.6,230.5C-51.4,228.5,-102.7,201.4,-139.8,165.9C-176.9,130.4,-199.7,86.5,-216.7,37.8C-233.7,-10.9,-244.9,-64.5,-226.7,-105.9C-208.4,-147.4,-160.8,-176.8,-113.8,-194.3C-66.9,-211.9,-20.5,-217.4,20.9,-242.5C62.3,-267.6,78.4,-177.1,125,-160.4Z" fill="currentColor"/>
            </g>
          </svg>
          <svg className="absolute left-0 bottom-0 h-full w-1/2 text-blue-300 opacity-40" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300) scale(-1,1)">
              <path d="M125,-160.4C171.6,-143.7,223.6,-122.3,246.8,-83.7C270,-45.1,264.4,10.6,244.1,58.5C223.8,106.4,188.8,146.3,146.5,177.9C104.2,209.4,54.6,232.5,1.6,230.5C-51.4,228.5,-102.7,201.4,-139.8,165.9C-176.9,130.4,-199.7,86.5,-216.7,37.8C-233.7,-10.9,-244.9,-64.5,-226.7,-105.9C-208.4,-147.4,-160.8,-176.8,-113.8,-194.3C-66.9,-211.9,-20.5,-217.4,20.9,-242.5C62.3,-267.6,78.4,-177.1,125,-160.4Z" fill="currentColor"/>
            </g>
          </svg>
        </div>
        
        {/* Visible animated circle elements */}
        <div className="absolute w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 opacity-50 animate-slow-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-300 opacity-40 animate-slow-pulse-delayed"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            {/* Removed the Residential & Commercial blue pill/button */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 relative inline-block">
              Our Expertise
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-blue-600 mx-auto mb-4 sm:mb-6 rounded-full"></div>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-2 sm:px-0">
              Delivering exceptional quality and craftsmanship for both residential homes and commercial properties across the region.
            </p>
          </div>

          {/* Featured Services Grid (2 Residential, 2 Commercial) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[ // Array containing 2 residential and 2 commercial examples
              {
                title: 'Kitchen Remodeling',
                description: 'Transform your home kitchen into a modern, functional space.',
                icon: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format",
                path: '/services/kitchen-remodeling',
                type: 'Residential',
                bgColor: 'bg-blue-600'
              },
              {
                title: 'Bathroom Renovation',
                description: 'Upgrade your personal oasis with stylish fixtures and finishes.',
                icon: "https://images.unsplash.com/photo-1586798271654-0471bb1b0184?q=80&w=800&auto=format",
                path: '/services/bathroom-remodeling',
                type: 'Residential',
                bgColor: 'bg-blue-600'
              },
              {
                title: 'Office Renovations',
                description: 'Modernize your workspace for improved productivity and aesthetics.',
                icon: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format",
                path: '/services/office-renovation',
                type: 'Commercial',
                bgColor: 'bg-blue-700'
              },
              {
                title: 'Retail Fit-Outs',
                description: 'Create inviting and functional retail spaces that attract customers.',
                icon: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800&auto=format",
                path: '/services/retail-fit-out',
                type: 'Commercial',
                bgColor: 'bg-blue-700'
              }
            ].map((service, index) => (
              <Link 
                key={index}
                to={service.path}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform duration-200 transform hover:-translate-y-1 flex flex-col h-full bg-white border border-gray-200 will-change-transform"
              >
                <div className="h-32 sm:h-40 md:h-48 relative overflow-hidden">
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-white ${service.type === 'Residential' ? 'bg-blue-600' : 'bg-blue-800'}`}>
                     {service.type}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <div className={`p-3 sm:p-4 md:p-5 ${service.bgColor} flex flex-col flex-grow text-white`}>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-100 text-xs sm:text-sm mb-2 sm:mb-4 flex-grow">
                    {service.description}
                  </p>
                  <div className="mt-auto pt-2 sm:pt-3 border-t border-blue-600 flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-blue-200">Learn More</span>
                    <div className="bg-blue-500 rounded-full p-1 sm:p-1.5 shadow-lg transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Combined CTA */}
          <div className="mt-10 sm:mt-16 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/residential" 
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform border border-blue-400 text-sm sm:text-base"
            >
              Explore Residential Services
            </Link>
             <Link 
              to="/commercial" 
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform border border-blue-700 text-sm sm:text-base"
            >
              Explore Commercial Services
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Enhanced blue background with lighter blue testimonial box */}
      <div className="py-16 relative overflow-hidden">
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
                    <p className="text-white text-base mb-4">
                      Read what our clients have to say about our dedication to quality, innovation, and customer satisfaction.
                    </p>
                    <button
                      onClick={() => setIsReviewFormOpen(true)}
                      className="px-4 py-2 bg-white text-blue-700 rounded-md shadow-md hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Leave a Review
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <TestimonialSlider testimonials={testimonials} />
                <div className="text-center mt-8">
                  <Link to="/testimonials" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                    Read More Testimonials
                  </Link>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>

      {/* Project Transformations Section */}
      <div className="py-24 relative overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e3a8a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
          <div className="absolute bottom-[15%] left-[5%] w-80 h-80 rounded-full bg-blue-200/30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Project Transformations</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              See the dramatic differences our expert team can make with these before and after showcases of our completed projects.
            </p>
          </div>
          
          {/* Transformation Showcase - Large Featured Project */}
          <div className="mb-20">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="relative">
                <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full z-10">
                  Featured Project
                </div>
                {/* Desktop layout (unchanged) - hidden on mobile/tablet */}
                <div className="hidden md:grid md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80" 
                      alt="Before Kitchen Renovation" 
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white font-bold inline-block bg-black/60 px-3 py-1 rounded-full text-sm">BEFORE</span>
                    </div>
                  </div>
                  
                  {/* After */}
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80" 
                      alt="After Kitchen Renovation" 
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white font-bold inline-block bg-blue-600 px-3 py-1 rounded-full text-sm">AFTER</span>
                    </div>
                  </div>
                </div>
                
                {/* Mobile/Tablet layout (side by side) - hidden on desktop */}
                <div className="md:hidden relative">
                  <div className="flex overflow-x-hidden">
                    {/* Before and After Container with hover effect */}
                    <div className="flex flex-row w-full before-after-container touch-manipulation">
                      {/* Before */}
                      <div className="relative w-1/2 border-r border-white/20 z-10">
                        <img 
                          src="https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80" 
                          alt="Before Kitchen Renovation" 
                          className="w-full h-64 sm:h-80 object-cover before-image"
                        />
                        <div className="absolute top-0 left-0 bg-black/70 m-2 px-2 py-0.5 rounded-full z-20">
                          <span className="text-white font-bold text-xs">BEFORE</span>
                        </div>
                      </div>
                      
                      {/* After */}
                      <div className="relative w-1/2 border-l border-white/20 z-20">
                        <img 
                          src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80" 
                          alt="After Kitchen Renovation" 
                          className="w-full h-64 sm:h-80 object-cover after-image"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 m-2 px-2 py-0.5 rounded-full z-20">
                          <span className="text-white font-bold text-xs">AFTER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Touch hint */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-gray-700 flex items-center shadow-sm">
                    <span className="mr-1">Tap to compare</span>
                    <svg className="w-3 h-3 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0 0v2.5M7 14h2.5m4 0h2.5m-2.5 0v2.5m0-2.5V11.5M7 14h10" />
                    </svg>
                  </div>
                  
                  {/* Mobile-only title */}
                  <div className="text-center py-4 px-3 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">Modern Kitchen Transformation</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Modern Kitchen Transformation</h3>
                  <p className="text-gray-600 mb-4">
                    This complete kitchen remodel transformed an outdated, cramped space into an open-concept, modern kitchen with custom cabinetry, premium countertops, and state-of-the-art appliances. The project was completed in just 6 weeks.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Kitchen Remodeling</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Custom Cabinetry</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Marietta, GA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">Client Rating</span>
                    </div>
                    <Link 
                      to="/portfolio/kitchen-transformation" 
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Project Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More Transformations - 3 Column Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Bathroom Transformation */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-xl transition-transform duration-200 transform hover:scale-[1.02] will-change-transform">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                {/* Slide effect on hover */}
                <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:translate-x-full">
                  <img 
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80" 
                    alt="Before Bathroom Renovation" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center md:hidden">
                    <span className="inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-1.5">BEFORE</span>
                    <span className="text-white text-sm font-medium bg-blue-600/80 rounded-full py-1 px-3 shadow-sm flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 18L18 12L8 6V18Z" fill="white" />
                      </svg>
                      Tap to see after
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 hidden md:block">
                    <span className="text-white font-bold inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs">BEFORE</span>
                  </div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80" 
                  alt="After Bathroom Renovation" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-white font-bold inline-block bg-blue-600 px-2 py-0.5 rounded-full text-xs">AFTER</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Luxury Bathroom Remodel</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  A complete transformation from outdated fixtures to a spa-like retreat with custom tilework, glass shower, and premium fixtures.
                </p>
                <Link 
                  to="/portfolio/bathroom-transformation" 
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium"
                >
                  See Project Details
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            
            {/* Living Room Transformation */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-xl transition-transform duration-200 transform hover:scale-[1.02] will-change-transform">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                {/* Slide effect on hover */}
                <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:translate-x-full">
                  <img 
                    src="https://images.unsplash.com/photo-1589459072535-550f4ea42174?auto=format&fit=crop&q=80" 
                    alt="Before Living Room Renovation" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center md:hidden">
                    <span className="inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-1.5">BEFORE</span>
                    <span className="text-white text-sm font-medium bg-blue-600/80 rounded-full py-1 px-3 shadow-sm flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 18L18 12L8 6V18Z" fill="white" />
                      </svg>
                      Tap to see after
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 hidden md:block">
                    <span className="text-white font-bold inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs">BEFORE</span>
                  </div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80" 
                  alt="After Living Room Renovation" 
                  className="w-full h-full object-cover"
                  loading="lazy" 
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-white font-bold inline-block bg-blue-600 px-2 py-0.5 rounded-full text-xs">AFTER</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Modern Living Space</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  This living room renovation included new hardwood floors, custom built-ins, fireplace redesign, and modern lighting.
                </p>
                <Link 
                  to="/portfolio/living-room-transformation" 
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium"
                >
                  See Project Details
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            
            {/* Commercial Office Transformation */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-xl transition-transform duration-200 transform hover:scale-[1.02] will-change-transform">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                {/* Slide effect on hover */}
                <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:translate-x-full">
                  <img 
                    src="https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80" 
                    alt="Before Office Renovation" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center md:hidden">
                    <span className="inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-1.5">BEFORE</span>
                    <span className="text-white text-sm font-medium bg-blue-600/80 rounded-full py-1 px-3 shadow-sm flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 18L18 12L8 6V18Z" fill="white" />
                      </svg>
                      Tap to see after
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 hidden md:block">
                    <span className="text-white font-bold inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs">BEFORE</span>
                  </div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80" 
                  alt="After Office Renovation" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-white font-bold inline-block bg-blue-600 px-2 py-0.5 rounded-full text-xs">AFTER</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Corporate Office Renovation</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Transformed an outdated office into a modern, collaborative workspace with improved lighting, ergonomic workstations, and tech integration.
                </p>
                <Link 
                  to="/portfolio/office-transformation" 
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium"
                >
                  See Project Details
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* CTA with Statistic */}
          <div className="bg-gray-200/90 backdrop-blur-sm md:bg-blue-900 rounded-none md:rounded-2xl shadow-2xl mx-[-16px] md:mx-auto px-4 py-8 md:p-12 text-gray-800 md:text-white flex flex-col md:flex-row items-center justify-between">
            {/* Mobile stats slider - moved to top */}
            <div className="md:hidden w-full overflow-hidden mb-6">
              <div className="stats-slider flex animate-stats-scroll py-3">
                <div className="stats-slide flex space-x-4 mr-4">
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">2,500+</div>
                    <div className="text-gray-700 text-xs">Completed Projects</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">98%</div>
                    <div className="text-gray-700 text-xs">Satisfied Clients</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">20+</div>
                    <div className="text-gray-700 text-xs">Years Experience</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">15+</div>
                    <div className="text-gray-700 text-xs">Industry Awards</div>
                  </div>
                </div>
                {/* Duplicate set for seamless scrolling */}
                <div className="stats-slide flex space-x-4">
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">2,500+</div>
                    <div className="text-gray-700 text-xs">Completed Projects</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">98%</div>
                    <div className="text-gray-700 text-xs">Satisfied Clients</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">20+</div>
                    <div className="text-gray-700 text-xs">Years Experience</div>
                  </div>
                  <div className="flex-shrink-0 w-[150px] p-3 text-center">
                    <div className="text-2xl font-bold mb-1">15+</div>
                    <div className="text-gray-700 text-xs">Industry Awards</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Transform Your Space?</h3>
              <p className="text-gray-700 md:text-white text-lg mb-6">
                Our award-winning team has completed over 2,500 successful projects across Georgia. Let's bring your vision to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/free-estimate" 
                  className="bg-blue-700 md:bg-white text-white md:text-blue-900 hover:bg-blue-800 md:hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  Get a Free Estimate
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/portfolio" 
                  className="bg-gray-300 md:bg-blue-800 text-blue-800 md:text-white hover:bg-gray-400 md:hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 border border-gray-400 md:border-blue-700"
                >
                  View All Projects
                  <Camera className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Desktop stats grid - stays in the same position */}
            <div className="md:w-1/3 md:grid md:grid-cols-2 md:gap-4 hidden md:block">
              <div className="bg-white/80 md:bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-1">2,500+</div>
                <div className="text-gray-700 md:text-blue-200 text-sm">Completed Projects</div>
              </div>
              <div className="bg-white/80 md:bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-gray-700 md:text-blue-200 text-sm">Satisfied Clients</div>
              </div>
              <div className="bg-white/80 md:bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-1">20+</div>
                <div className="text-gray-700 md:text-blue-200 text-sm">Years Experience</div>
              </div>
              <div className="bg-white/80 md:bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-3xl font-bold mb-1">15+</div>
                <div className="text-gray-700 md:text-blue-200 text-sm">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section - Modern Compact Design */}
      <div className="text-white py-12 relative overflow-hidden">
        {/* Strong geometric background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900"></div>
        
        {/* Bold geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff_1px,transparent_1px),linear-gradient(135deg,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        {/* Large decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-gradient-to-tr from-blue-500/30 to-transparent rounded-tl-[100px]"></div>
          <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-to-br from-blue-400/30 to-transparent rounded-br-[100px]"></div>
        </div>
        
        {/* Floating orbs with stronger colors */}
        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-blue-300/20 blur-xl opacity-80 animate-float"></div>
        <div className="absolute top-[15%] left-[20%] w-40 h-40 rounded-full bg-gradient-to-tr from-blue-300/20 to-white/20 blur-xl opacity-80 animate-float-delayed"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Contact Info Card */}
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-700/50 flex flex-col">
              <h2 className="text-2xl font-bold mb-3">Quick Contact</h2>
              <p className="text-white mb-3 text-sm">
                Have a question? Send us a message or use our 
                <Link to="/contact" className="font-semibold text-white hover:underline ml-1">contact page</Link>.
              </p>
              
              <div className="space-y-2 mb-3">
                <Link to="/contact" className="flex items-center group text-sm">
                  <div className="bg-blue-700/50 p-1.5 rounded-full mr-2 group-hover:bg-blue-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors" />
                 </div>
                  <span className="group-hover:text-white transition-colors">Contact Us</span>
                </Link>
                <a href="mailto:sustenablet@gmail.com" className="flex items-center group text-sm">
                  <div className="bg-blue-700/50 p-1.5 rounded-full mr-2 group-hover:bg-blue-600 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors" />
                 </div>
                  <span className="group-hover:text-white transition-colors">sustenablet@gmail.com</span>
                </a>
            </div>
              
              <div className="border-t border-blue-700/50 pt-3 mt-auto">
                <h4 className="text-sm font-semibold mb-1.5 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
                  Business Hours
                </h4>
                <div className="grid grid-cols-2 gap-x-2 text-xs text-white">
                  <span>Monday - Friday</span>
                  <span className="text-right">8AM - 6PM</span>
                  <span>Saturday - Sunday</span>
                  <span className="text-right">8AM - 6PM</span>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2 bg-blue-800/30 backdrop-blur-sm rounded-lg shadow-md border border-blue-700/50">
              {homeContactStatus === 'idle' || homeContactStatus === 'submitting' || homeContactStatus === 'error' ? (
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-300" />
                    Send a Message
                  </h3>
                  
                  {/* Message Type Selection */}
                  <div className="mb-4">
                    <label className="block text-blue-200 mb-1.5 text-xs">
                      What is your message regarding?
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['General', 'Project Quote', 'Feedback', 'Support'].map((purpose, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setHomeContactMessage(currentMsg => {
                              // Remove any existing regarding prefix
                              const cleanedMsg = currentMsg.replace(/Regarding: .*\n\n/g, '');
                              return `Regarding: ${purpose}\n\n${cleanedMsg}`;
                            });
                          }}
                          className={`text-center py-1.5 px-1 rounded-md transition-all duration-200 text-xs ${
                            homeContactMessage.includes(`Regarding: ${purpose}`) 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-700/50 text-white hover:bg-blue-700'
                          }`}
                        >
                          {purpose}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <form 
                    action="https://formspree.io/f/xbloejrb" 
                    method="POST"
                    className="space-y-3" 
                    onSubmit={(e) => {
                      // Check if form validation issues exist
                      if (!homeContactName || !homeContactEmail || !homeContactMessage) {
                        return; // Let the form's native validation handle this
                      }
                      
                      // Prevent default form submission (which would cause page navigation)
                      e.preventDefault();
                      
                      // Set status to submitting
                      setHomeContactStatus('submitting');
                      
                      // Get form data
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      
                      // Submit the form data via fetch
                      fetch('https://formspree.io/f/xbloejrb', {
                        method: 'POST',
                        body: formData,
                        headers: {
                          'Accept': 'application/json'
                        }
                      })
                      .then(response => {
                        if (response.ok) {
                          // Set status to success
                          setHomeContactStatus('success');
                          
                          // Reset form fields
                          setHomeContactName('');
                          setHomeContactEmail('');
                          setHomeContactPhone('');
                          setHomeContactMessage('');
                          
                          // Reset status after 5 seconds
                          setTimeout(() => {
                            setHomeContactStatus('idle');
                          }, 5000);
                        } else {
                          // Set status to error
                          setHomeContactStatus('error');
                          
                          // Reset status after 5 seconds
                          setTimeout(() => {
                            setHomeContactStatus('idle');
                          }, 5000);
                        }
                      })
                      .catch(error => {
                        console.error('Error submitting form:', error);
                        setHomeContactStatus('error');
                        
                        // Reset status after 5 seconds
                        setTimeout(() => {
                          setHomeContactStatus('idle');
                        }, 5000);
                      });
                    }}
                    noValidate
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          id="homeName"
                          name="name"
                          required
                          value={homeContactName}
                          onChange={(e) => {
                            setHomeContactName(e.target.value);
                            if (nameError) validateHomeContactName();
                          }}
                          onFocus={() => setFocusedField('homeName')}
                          onBlur={() => {
                            setFocusedField(null);
                            validateHomeContactName();
                          }}
                          className={`peer w-full px-3 py-2 text-sm rounded-md bg-blue-700/50 border text-white placeholder-transparent 
                                      transition-all
                                      ${nameError 
                                        ? 'border-red-500 ring-1 ring-red-500' 
                                        : focusedField === 'homeName' || homeContactName 
                                        ? 'border-blue-400 ring-1 ring-blue-400' 
                                        : 'border-blue-700 hover:border-blue-500'} 
                                      focus:outline-none focus:ring-1 focus:ring-blue-400`}
                          placeholder="Your Name *"
                        />
                        <label 
                          htmlFor="homeName" 
                          className={`absolute left-3 transition-all pointer-events-none text-xs
                                     ${focusedField === 'homeName' || homeContactName 
                                       ? '-top-2 text-blue-300 bg-blue-800 px-1 rounded' 
                                       : 'top-2.5 text-blue-300'}
                                     peer-focus:-top-2 peer-focus:text-blue-300 peer-focus:bg-blue-800 peer-focus:px-1 peer-focus:rounded`}
                        >
                          Your Name *
                        </label>
                        {nameError && (
                          <p className="text-red-400 text-xs mt-1">{nameError}</p>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          id="homeEmail"
                          name="email"
                          required
                          value={homeContactEmail}
                          onChange={(e) => {
                            setHomeContactEmail(e.target.value);
                            if (emailError) validateHomeContactEmail();
                          }}
                          onFocus={() => setFocusedField('homeEmail')}
                          onBlur={() => {
                            setFocusedField(null);
                            validateHomeContactEmail();
                          }}
                          className={`peer w-full px-3 py-2 text-sm rounded-md bg-blue-700/50 border text-white placeholder-transparent 
                                      transition-all
                                      ${emailError 
                                        ? 'border-red-500 ring-1 ring-red-500' 
                                        : focusedField === 'homeEmail' || homeContactEmail 
                                        ? 'border-blue-400 ring-1 ring-blue-400' 
                                        : 'border-blue-700 hover:border-blue-500'} 
                                      focus:outline-none focus:ring-1 focus:ring-blue-400`}
                          placeholder="Your Email *"
                        />
                        <label 
                          htmlFor="homeEmail" 
                          className={`absolute left-3 transition-all pointer-events-none text-xs
                                     ${focusedField === 'homeEmail' || homeContactEmail 
                                       ? '-top-2 text-blue-300 bg-blue-800 px-1 rounded' 
                                       : 'top-2.5 text-blue-300'}
                                     peer-focus:-top-2 peer-focus:text-blue-300 peer-focus:bg-blue-800 peer-focus:px-1 peer-focus:rounded`}
                        >
                          Your Email *
                        </label>
                        {emailError && (
                          <p className="text-red-400 text-xs mt-1">{emailError}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {/* Phone field */}
                      <div className="relative flex-grow">
                        <input
                          type="tel"
                          id="homePhone"
                          name="homePhone"
                          value={homeContactPhone}
                          onChange={(e) => setHomeContactPhone(e.target.value)}
                          onFocus={() => setFocusedField('homePhone')}
                          onBlur={() => setFocusedField(null)}
                          className={`peer w-full px-3 py-2 text-sm rounded-md bg-blue-700/50 border text-white placeholder-transparent 
                                      transition-all
                                      ${focusedField === 'homePhone' || homeContactPhone 
                                        ? 'border-blue-400 ring-1 ring-blue-400' 
                                        : 'border-blue-700 hover:border-blue-500'} 
                                      focus:outline-none focus:ring-1 focus:ring-blue-400`}
                          placeholder="Phone (Optional)"
                        />
                        <label 
                          htmlFor="homePhone" 
                          className={`absolute left-3 transition-all pointer-events-none text-xs
                                     ${focusedField === 'homePhone' || homeContactPhone 
                                       ? '-top-2 text-blue-300 bg-blue-800 px-1 rounded' 
                                       : 'top-2.5 text-blue-300'}
                                     peer-focus:-top-2 peer-focus:text-blue-300 peer-focus:bg-blue-800 peer-focus:px-1 peer-focus:rounded`}
                        >
                          Phone (Optional)
                        </label>
                      </div>
                      
                      {/* Preferred contact method */}
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        {[
                          { id: 'contact-email', label: 'Email', value: 'email', icon: <Mail className="w-3 h-3" /> },
                          { id: 'contact-phone', label: 'Phone', value: 'phone', icon: <Phone className="w-3 h-3" /> }
                        ].map((option) => (
                          <label 
                            key={option.id}
                            htmlFor={option.id}
                            className={`flex items-center cursor-pointer px-2 py-1.5 rounded-md transition-colors duration-200 text-xs ${
                              homeContactPreferredMethods.includes(option.value) 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-700/50 text-blue-100 hover:bg-blue-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={option.id}
                              name="contactMethod"
                              value={option.value}
                              checked={homeContactPreferredMethods.includes(option.value)}
                                                              onChange={() => {
                                  // Toggle selection logic
                                  if (homeContactPreferredMethods.includes(option.value)) {
                                    // Remove if already selected
                                    setHomeContactPreferredMethods(homeContactPreferredMethods.filter(m => m !== option.value));
                                  } else {
                                    // Add if not selected
                                    setHomeContactPreferredMethods([...homeContactPreferredMethods, option.value]);
                                  }
                                }}
                              className="mt-1 bg-gray-800 border-gray-700 text-yellow-500 rounded focus:ring-yellow-500"
                            />
                            <div className="flex items-center">
                              {option.icon}
                              <span className="ml-1">{option.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        id="homeContactMessage"
                        name="message"
                        required
                        rows={5}
                        value={homeContactMessage}
                        onChange={(e) => setHomeContactMessage(e.target.value)}
                        onFocus={() => setFocusedField('homeContactMessage')}
                        onBlur={() => setFocusedField(null)}
                        className={`peer w-full px-3 py-2 text-sm rounded-md bg-blue-700/50 border text-white placeholder-transparent resize-none
                                    transition-all
                                    ${focusedField === 'homeContactMessage' ? 'border-blue-400 ring-1 ring-blue-400' : 'border-blue-700 hover:border-blue-500'} 
                                    focus:outline-none focus:ring-1 focus:ring-blue-400`}
                        placeholder="Your Message *"
                      ></textarea>
                      <label 
                        htmlFor="homeContactMessage" 
                        className={`absolute left-3 transition-all pointer-events-none text-xs
                                   ${focusedField === 'homeContactMessage' || homeContactMessage ? '-top-2 text-blue-300 bg-blue-800 px-1 rounded' : 'top-2.5 text-blue-300'}
                                   peer-focus:-top-2 peer-focus:text-blue-300 peer-focus:bg-blue-800 peer-focus:px-1 peer-focus:rounded`}
                      >
                        Your Message *
                      </label>
                    </div>
                    
                    {homeContactStatus === 'error' && (
                      <div className="bg-red-700/30 border border-red-600 rounded-lg p-4 text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 mb-2">
                          <X className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-bold mb-1">Error!</h4>
                        <p className="text-red-100 text-sm">Something went wrong. Please try again or contact us directly at sustenablet@gmail.com</p>
                      </div> 
                    )}

                    {(homeContactStatus as ContactFormStatus) === 'success' && (
                      <div className="bg-green-700/30 border border-green-600 rounded-lg p-4 text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mb-2">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-bold mb-1">Thank You!</h4>
                        <p className="text-green-100 text-sm">Your message has been sent successfully. We'll get back to you soon.</p>
                      </div>
                    )}
                    
                    {(homeContactStatus === 'idle' || homeContactStatus === 'submitting') && (
                    <div className="flex justify-between items-center">
                      <button 
                        type="submit" 
                        disabled={homeContactStatus === 'submitting'}
                        className={`bg-white text-blue-800 px-5 py-2 rounded-md text-sm font-medium
                                  transition-all hover:bg-blue-50 hover:shadow-sm active:scale-95
                                  ${homeContactStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {homeContactStatus === 'submitting' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send className="-ml-1 mr-2 h-5 w-5" />
                            Send Message
                          </span>
                        )}
                      </button>
                      
                      <p className="text-xs text-blue-200">
                        We respond within 24 hours
                      </p>
                    </div>
                  )}
                  </form>
                </div>
              ) : ( 
                <div className="text-center p-6 transition-all duration-500 animate-fade-in flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-blue-100 mb-4 text-sm max-w-md">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setHomeContactStatus('idle')}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-sm text-white transition-colors"
                    >
                      Send Another
                    </button>
                    <Link
                      to="/contact"
                      className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-800 rounded-md text-sm transition-colors"
                    >
                      Contact Page
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* REMOVING DUPLICATE CONTACT SECTION */}
      {/* Removing the entire duplicate contact section here */}
      
          </div>
        } />
        <Route path="/services/kitchen-remodeling" element={<KitchenRemodeling />} />
        <Route path="/services/bathroom-remodeling" element={<BathroomRemodeling />} />
        <Route path="/services/hardwood" element={<HardwoodService />} />
        <Route path="/services/custom-cabinetry" element={<CustomCabinetryPage />} />
        <Route path="/services/flooring" element={<FlooringServicesPage />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/contact" element={<Contact />} />
        {/* Removed duplicate route - redirected in main Routes section */}
        <Route path="/commercial-quote" element={<CommercialQuote />} />
        <Route path="/residential-quote" element={<ResidentialQuote />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/residential" element={<Residential />} />
        <Route path="/offers" element={<Offers />} />
        {/* <Route path="/visualizer" element={<VisualizeIt />} /> */}
        {/* <Route path="/my-projects" element={<MyProjects />} /> */}
        <Route path="/free-estimate" element={<FreeEstimate />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/commercial" element={<CommercialServicePage />} />
        <Route path="/commercial-service" element={<CommercialServicePage />} />
        <Route path="/accessibility" element={<AccessibilityStatement />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Project transformation specific routes */}
        <Route path="/portfolio/kitchen-transformation" element={<Portfolio />} />
        <Route path="/portfolio/bathroom-transformation" element={<Portfolio />} />
        <Route path="/portfolio/living-room-transformation" element={<Portfolio />} />
        <Route path="/portfolio/office-transformation" element={<Portfolio />} />
        
        {services.flatMap(category => 
          category.services.map((service, index) => (
            <Route 
              key={`${category.category}-service-${index}`}
              path={service.path}
              element={
                <ServiceTemplate 
                  title={service.title}
                  description={service.description}
                  features={service.features || []}
                  benefits={service.benefits || []}
                  imageUrl={service.image || ''}
                  category={category.category}
                  relatedServices={category.services.filter(s => s.path !== service.path).map(s => ({ title: s.title, path: s.path }))}
                  processSteps={service.processSteps || []}
                  galleryImages={service.galleryImages || []}
                />
              }
            />
          ))
        )}
        <Route path="/blog/featured-post" element={<BlogPost />} />
        <Route path="/blog/recent-post-1" element={<BlogPost />} />
        <Route path="/blog/recent-post-2" element={<BlogPost />} />
        <Route path="/blog/recent-post-3" element={<BlogPost />} />
        <Route path="/blog/post/:postId" element={<BlogPost />} />
        <Route path="/blog/category/:categoryName" element={<BlogCategory />} />
        <Route path="/services/category/:categoryName" element={<CategoryServices services={services} />} />
        {/* Commenting out conflicting commercial routes - covered by ServiceTemplate now */}
        {/* <Route path="/commercial/office-renovations" element={<CommercialServicePage title="Office Renovations" />} /> */}
        {/* <Route path="/commercial/retail-fit-outs" element={<CommercialServicePage title="Retail Fit-Outs" />} /> */}
        {/* <Route path="/commercial/industrial-solutions" element={<CommercialServicePage title="Industrial Solutions" />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      
      {/* Footer component - moved outside of Routes to appear on all pages */}
      <Footer />
      <CookieConsent />
      <PromoModal />
      <ChatBot />
      <ReviewForm 
        isOpen={isReviewFormOpen} 
        onClose={() => setIsReviewFormOpen(false)} 
      />
      <SpeedInsights />
      <Analytics />
    </PropertyTypeProvider>
  </Router>
);
}

export default App;

/* Add more keyframes for new animations */
const keyframes = {
  fadeIn: `
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  slideInRight: `
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  slideInUp: `
    @keyframes slide-in-up {
      from {
        transform: translateY(10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
  pulseSlow: `
    @keyframes pulse-slow {
      0% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.4;
      }
      100% {
        transform: scale(1);
        opacity: 0.3;
      }
    }
  `,
  statsScroll: `
    @keyframes stats-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `
};

// Add CSS for hiding scrollbar
const customScrollbarCSS = `
  .services-slider-track {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch; /* Better touch scrolling on iOS */
  }
  .services-slider-track::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* Enhanced visual improvements for services sliders */
  .services-slider-track::after {
    content: '';
    flex: 0 0 8px; /* Add space after last item */
  }
  
  /* Left and right fade effect for slider */
  .services-slider-track::before,
  .services-slider-track::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    z-index: 2; 
    pointer-events: none;
  }
  
  .services-slider-track::before {
    left: 0;
    background: linear-gradient(to right, white, transparent);
  }
  
  .services-slider-track::after {
    right: 0;
    background: linear-gradient(to left, white, transparent);
  }
  
  /* Improved card styling */
  @media (max-width: 640px) {
    .services-slider-track > div:not(:first-child) {
      position: relative;
    }
    .services-slider-track > div:not(:first-child)::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      height: 30px;
      width: 1px;
      background: rgba(219, 234, 254, 0.4);
      transform: translateY(-50%);
    }
  }
`;

// Additional custom CSS for new background elements and animations
const customExtendedCSS = `
  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite ease-in-out;
  }
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  /* Swipe hint animation */
  @keyframes fade-out-slide {
    0% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(-10px); }
  }
  
  .fade-out-slide {
    animation: fade-out-slide 0.5s forwards;
  }
  
  /* Before-After comparison hover effect for mobile */
  @media (max-width: 768px) {
    .before-after-container:hover .before-image,
    .before-after-container:active .before-image {
      opacity: 0.6;
    }
    
    .before-after-container:hover .after-image,
    .before-after-container:active .after-image {
      opacity: 1;
    }
    
    .before-image, .after-image {
      transition: opacity 0.3s ease;
    }
    
    .before-image {
      opacity: 1;
    }
    
    .after-image {
      opacity: 0.6;
    }
  }
`;

// Add the keyframes and custom CSS to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = Object.values(keyframes).join('\n') + customScrollbarCSS + customExtendedCSS + `
    .animate-stats-scroll {
      animation: stats-scroll 20s linear infinite;
    }
    .stats-slider:hover {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
}

// Add new keyframes for the enhanced backgrounds
const enhancedBackgroundKeyframes = {
  float: `
    @keyframes float {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-10px) translateX(5px); }
      100% { transform: translateY(0) translateX(0); }
    }
  `,
  floatDelayed: `
    @keyframes float-delayed {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-8px) translateX(-7px); }
      100% { transform: translateY(0) translateX(0); }
    }
  `,
  floatDelayedMore: `
    @keyframes float-delayed-more {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-15px) translateX(10px); }
      100% { transform: translateY(0) translateX(0); }
    }
  `,
  spinSlow: `
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  spinSlowReverse: `
    @keyframes spin-slow-reverse {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(-360deg); }
    }
  `,
  blob: `
    @keyframes blob {
      0% { transform: scale(1) translate(0, 0); }
      33% { transform: scale(1.1) translate(20px, -10px); }
      66% { transform: scale(0.9) translate(-20px, 10px); }
      100% { transform: scale(1) translate(0, 0); }
    }
  `,
  blobDelay: `
    @keyframes blob-delay {
      0% { transform: scale(1) translate(0, 0); }
      33% { transform: scale(1.1) translate(-15px, 10px); }
      66% { transform: scale(0.9) translate(15px, -10px); }
      100% { transform: scale(1) translate(0, 0); }
    }
  `
};

// Additional custom CSS for enhanced backgrounds
const enhancedBackgroundCSS = `
  .animate-float {
    animation: float 10s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float-delayed 12s ease-in-out infinite;
  }
  .animate-float-delayed-more {
    animation: float-delayed-more 14s ease-in-out infinite;
  }
  .animate-spin-slow {
    animation: spin-slow 40s linear infinite;
  }
  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 30s linear infinite;
  }
  .animate-blob {
    animation: blob 25s ease-in-out infinite;
  }
  .animate-blob-delay {
    animation: blob-delay 30s ease-in-out infinite;
  }
  .star-rating-particle {
    position: absolute;
    width: 15px;
    height: 15px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23facc15' stroke='none'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.24l6.91-1.01L12 2z'/%3E%3C/svg%3E");
    background-size: contain;
    opacity: 0.2;
  }
  .star-rating-particle:nth-child(1) {
    top: 20%;
    left: 70%;
    width: 18px;
    height: 18px;
  }
  .star-rating-particle:nth-child(2) {
    top: 65%;
    left: 25%;
    width: 15px;
    height: 15px;
  }
  .star-rating-particle:nth-child(3) {
    top: 40%;
    left: 50%;
    width: 12px;
    height: 12px;
  }
`;

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    navigationStartTime?: number;
    navigationTimer?: ReturnType<typeof setTimeout>;
  }
}

// Add the enhanced animations to the document
if (typeof document !== 'undefined') {
  const enhancedStyle = document.createElement('style');
  enhancedStyle.innerHTML = Object.values(enhancedBackgroundKeyframes).join('\n') + enhancedBackgroundCSS;
  document.head.appendChild(enhancedStyle);
  
  // Add page transition handling script
  document.addEventListener('DOMContentLoaded', () => {
    // Get references to our UI elements
    const loadingIndicator = document.getElementById('page-loading-indicator');
    const errorBoundary = document.getElementById('page-error-boundary');
    
    if (loadingIndicator && errorBoundary) {
      // Handle page navigation
      const handlePageNavigation = () => {
        // Show loading indicator immediately
        loadingIndicator.style.opacity = '1';
        loadingIndicator.style.pointerEvents = 'auto';
        
        // Hide error boundary if visible
        errorBoundary.style.display = 'none';
        
        // Safety timeout in case page load doesn't complete
        window.navigationTimer = setTimeout(() => {
          loadingIndicator.style.opacity = '0';
          loadingIndicator.style.pointerEvents = 'none';
        }, 8000);
      };
      
      // Handle page load complete
      const handlePageLoaded = () => {
        // Clear any existing navigation timer
        if (window.navigationTimer) {
          clearTimeout(window.navigationTimer);
          window.navigationTimer = undefined;
        }
        
        // Add a slight delay before hiding the loader to ensure content is rendered
        setTimeout(() => {
          // Smooth transition to hide loader
          loadingIndicator.style.opacity = '0';
          loadingIndicator.style.pointerEvents = 'none';
        }, 300);
      };
      
      // Handle errors
      const handlePageError = () => {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.pointerEvents = 'none';
        errorBoundary.style.display = 'flex';
      };
      
      // Listen for page navigation events
      window.addEventListener('popstate', handlePageNavigation);
      
      // Listen for React Router navigation events using mutation observer
      const routerObserver = new MutationObserver(() => {
        if (window.location.pathname !== lastPathRef.current) {
          lastPathRef.current = window.location.pathname;
          handlePageNavigation();
        }
      });
      
      // Track the current path
      const lastPathRef = { current: window.location.pathname };
      
      // Observe changes to the document title (often changes with React Router)
      const titleElement = document.querySelector('title');
      if (titleElement) {
        routerObserver.observe(titleElement, { childList: true });
      }
      
      // For click navigation, we need to intercept link clicks
      document.body.addEventListener('click', (e) => {
        // Check if this is a link that should trigger navigation
        const target = e.target as Element;
        if (!target) return;
        
        const link = target.closest('a');
        if (link && link instanceof HTMLAnchorElement) {
          // Check if it's an internal link and not an anchor link or external link
          if (link.href && 
              link.href.includes(window.location.origin) && 
              !link.href.includes('#') && 
              !link.target && 
              !link.download && 
              !link.getAttribute('rel')?.includes('external')) {
            const path = link.href.substring(window.location.origin.length);
            if (path.startsWith('/') && path !== window.location.pathname) {
              // Only trigger for actual navigation to a different path
              handlePageNavigation();
            }
          }
        }
      });
      
      // Handle initial page load
      window.addEventListener('load', handlePageLoaded);
      
      // DOMContentLoaded can be useful for SPA navigation
      document.addEventListener('DOMContentLoaded', handlePageLoaded);
      
      // Listen for React's events through DOM updates - React often updates the body class
      const bodyObserver = new MutationObserver(() => {
        // This will trigger when React finishes rendering, which helps with SPA navigation
        handlePageLoaded();
      });
      
      // Start observing body for class changes which often happens on route changes
      bodyObserver.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'],
        childList: false
      });
      
      // Handle errors
      window.addEventListener('error', handlePageError);
      
      // Clean up observers when page unloads
      window.addEventListener('beforeunload', () => {
        routerObserver.disconnect();
        bodyObserver.disconnect();
      });
    }
  });
}

// Add animations for the new stronger backgrounds
const strongBackgroundAnimations = `
  @keyframes slow-pulse {
    0% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.1); opacity: 0.3; }
    100% { transform: scale(1); opacity: 0.2; }
  }
  
  @keyframes slow-pulse-delayed {
    0% { transform: scale(1); opacity: 0.15; }
    50% { transform: scale(1.15); opacity: 0.25; }
    100% { transform: scale(1); opacity: 0.15; }
  }
  
  .animate-slow-pulse {
    animation: slow-pulse 8s ease-in-out infinite;
  }
  
  .animate-slow-pulse-delayed {
    animation: slow-pulse-delayed 8s ease-in-out infinite;
    animation-delay: 2s;
  }
`;

// Add loading bar animation keyframe
const loadingBarAnimation = `
  @keyframes loading-bar {
    0% { width: 0; left: 0; }
    50% { width: 70%; left: 15%; }
    100% { width: 0; left: 100%; }
  }
  
  .animate-loading-bar {
    animation: loading-bar 2s ease-in-out infinite;
  }
`;

// Apply the strong background animations
if (typeof document !== 'undefined') {
  const strongBgStyle = document.createElement('style');
  strongBgStyle.innerHTML = strongBackgroundAnimations + loadingBarAnimation;
  document.head.appendChild(strongBgStyle);
}