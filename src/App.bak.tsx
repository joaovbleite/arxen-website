import React, { useState, useEffect } from 'react';
import { Hammer, CheckCircle, Phone, Mail, MapPin, Clock, Shield, ArrowRight, Star, ChevronRight, Check, Camera, Box, ClipboardList, ArrowLeft, Home, ChevronDown, DollarSign, Users, Clipboard, Building2, Settings } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HardwoodService from './pages/HardwoodService';
import KitchenRemodeling from './pages/KitchenRemodeling';
import ServiceTemplate from './pages/ServiceTemplate';
import Contact from './pages/Contact';
import CommercialQuote from './pages/CommercialQuote';
import ResidentialQuote from './pages/ResidentialQuote';
// Remove imports that don't exist and clean up the code
import Testimonials from './pages/Testimonials';
import Portfolio from './pages/Portfolio';
import TestimonialSlider from './components/TestimonialSlider';
import Blog from './pages/Blog';
import About from './pages/About';
import Residential from './pages/Residential';
import Offers from './pages/Offers';
import VisualizeIt from './pages/VisualizeIt';
import MyProjects from './pages/MyProjects';
import BlogPost from './pages/BlogPost';
import BlogCategory from './pages/BlogCategory';
import CategoryServices from './pages/CategoryServices';
import CommercialServicePage from './pages/CommercialServicePage';
import CustomCabinetryPage from './pages/CustomCabinetryPage';
import FlooringServicesPage from './pages/FlooringServicesPage';
import Financing from './pages/Financing';

function App() {
  const [, setCurrentTestimonial] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Atlanta, GA",
      text: "The team at Lima Flooring did an outstanding job with our hardwood installation. Their attention to detail and professionalism exceeded our expectations.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80"
    },
    {
      name: "Michael Chen",
      location: "Boston, MA",
      text: "From selection to installation, the entire process was seamless. The quality of work is exceptional, and our new floors look amazing!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80"
    },
    {
      name: "Emily Rodriguez",
      location: "Miami, FL",
      text: "We couldn't be happier with our new tile flooring. The installers were professional, efficient, and left everything spotless.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80"
    },
    {
      name: "David Lee",
      location: "Chicago, IL",
      text: "The team's expertise in remodeling is unmatched. They transformed our kitchen into a modern masterpiece.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80"
    },
    {
      name: "Lisa Anderson",
      location: "Houston, TX",
      text: "Professional and punctual. The quality of work is top-notch, and the team is very friendly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80"
    },
    {
      name: "James Wilson",
      location: "Seattle, WA",
      text: "Great experience with the team. They were very responsive and completed the project ahead of schedule.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80"
    },
    {
      name: "Maria Garcia",
      location: "Los Angeles, CA",
      text: "The attention to detail and customer service is outstanding. Highly recommend their services.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80"
    },
    {
      name: "Robert Brown",
      location: "New York, NY",
      text: "The team's expertise in flooring and remodeling is evident in every project they undertake.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const services = [
    {
      category: "Remodeling",
      services: [
        { 
          title: "Kitchen Remodeling",
          description: "Complete kitchen transformations",
          path: "/services/kitchen-remodeling",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
          features: ["Custom design", "Cabinet installation", "Countertop replacement", "Appliance integration"],
          benefits: ["Increased home value", "Improved functionality", "Modern aesthetics", "Personalized space"],
          processSteps: [
            { title: "Consultation", description: "Discuss goals and budget" },
            { title: "Design Phase", description: "Create detailed plans" },
            { title: "Construction", description: "Execute the remodel" },
            { title: "Final Walkthrough", description: "Ensure satisfaction" },
          ],
          galleryImages: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", 
            "https://images.unsplash.com/photo-1556913088-485a1b37190a",
            "https://images.unsplash.com/photo-1579811520974-4f41f89a1f39",
          ]
        },
        { 
          title: "Bathroom Remodeling",
          description: "Modern bathroom renovations",
          path: "/services/bathroom-remodeling",
          image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
          features: ["Fixture upgrades", "Tile work", "Vanity installation", "Lighting solutions"],
          benefits: ["Enhanced relaxation", "Increased property value", "Better space utilization", "Improved hygiene"],
          processSteps: [],
          galleryImages: []
        },
        { 
          title: "Basement Finishing",
          description: "Custom basement spaces",
          path: "/services/basement-finishing",
          image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a",
          features: ["Layout design", "Insulation", "Drywall & flooring", "Egress windows"],
          benefits: ["Added living area", "Entertainment space", "Potential rental income", "Increased home value"],
          processSteps: [],
          galleryImages: []
        },
        { 
          title: "Room Additions",
          description: "Expand your living space",
          path: "/services/room-additions",
          image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
          features: ["Foundation work", "Framing", "Roofing integration", "Interior finishing"],
          benefits: ["More square footage", "Customized space", "Avoids moving costs", "Boosts property value"],
          processSteps: [],
          galleryImages: []
        }
      ]
    },
    {
      category: "Interior Services",
      services: [
        { 
          title: "Interior Painting",
          description: "Professional painting services",
          path: "/services/interior-painting",
          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
          features: [
            "Premium quality paints",
            "Expert color consultation",
            "Precise edge and detail work",
            "Surface preparation",
            "Texture and faux finish options",
            "Eco-friendly paint options",
            "Clean and efficient process"
          ], 
          benefits: [
            "Fresh, updated appearance",
            "Increased property value",
            "Protection of walls and surfaces",
            "Improved indoor air quality with low-VOC options",
            "Enhanced lighting and room aesthetics"
          ], 
          processSteps: [
            { title: "Consultation", description: "We discuss color options, finish types, and assess your space." },
            { title: "Preparation", description: "We protect furniture, prep surfaces, repair imperfections, and prime when necessary." },
            { title: "Professional Application", description: "Our painters apply paint with precision using professional techniques and equipment." },
            { title: "Inspection", description: "We conduct a thorough inspection to ensure perfect coverage and quality." },
            { title: "Clean Up", description: "We clean up completely, leaving your space ready to enjoy." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
            "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14",
            "https://images.unsplash.com/photo-1595665593673-bf1ad72905fc",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91"
          ]
        },
        { 
          title: "Drywall Installation",
          description: "Expert drywall solutions",
          path: "/services/drywall",
          image: "https://images.unsplash.com/photo-1573504816327-07f3bf7accac",
          features: [
            "New construction drywall",
            "Drywall repair and patching",
            "Ceiling installation",
            "Texture application",
            "Soundproofing options",
            "Moisture-resistant solutions",
            "Custom design elements"
          ], 
          benefits: [
            "Improved room aesthetics",
            "Better sound insulation",
            "Fire resistance",
            "Smooth, professional finish",
            "Preparation for perfect paint application"
          ], 
          processSteps: [
            { title: "Measurement & Planning", description: "We assess your space and determine material requirements." },
            { title: "Framing Inspection", description: "We ensure the underlying structure is suitable for drywall installation." },
            { title: "Professional Installation", description: "Our team hangs drywall sheets with precision." },
            { title: "Taping & Mudding", description: "We apply joint compound and tape for a seamless finish." },
            { title: "Sanding & Finishing", description: "We sand and perfect the surface for a smooth, paint-ready result." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1573504816327-07f3bf7accac",
            "https://images.unsplash.com/photo-1614075270637-7fa8dfa6c3a1",
            "https://images.unsplash.com/photo-1558767143-547a89e11cbf",
            "https://images.unsplash.com/photo-1574015974293-817f0ebf0e95"
          ]
        },
        { 
          title: "Custom Cabinetry",
          description: "Built to order cabinets",
          path: "/services/custom-cabinetry",
          image: "https://images.unsplash.com/photo-1556185781-a47769abb7ee",
          features: [
            "Made-to-measure design",
            "Premium materials",
            "Expert craftsmanship",
            "Perfect fit guarantee",
            "Extensive finish options",
            "Hardware customization",
            "Built-in organization systems"
          ], 
          benefits: [
            "Maximizes your space efficiency",
            "Increases home value",
            "Custom solutions for unique spaces",
            "Higher quality than mass-produced options",
            "Perfect match to your design aesthetic"
          ], 
          processSteps: [
            { title: "In-Home Consultation", description: "Our designer evaluates your space and discusses your style preferences, functional needs, and budget." },
            { title: "Custom Design", description: "We create detailed 3D renderings and plans tailored to your specifications." },
            { title: "Material Selection", description: "Choose from premium woods, finishes, hardware, and organizational features." },
            { title: "Expert Fabrication", description: "Our skilled craftsmen build your custom cabinets with precision in our local workshop." },
            { title: "Professional Installation", description: "Experienced installers ensure perfect fit and function in your space." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1556185781-a47769abb7ee",
            "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6"
          ]
        },
        { 
          title: "Crown Molding",
          description: "Elegant finishing touches",
          path: "/services/crown-molding",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
          features: [
            "Custom profile selection",
            "Precise installation",
            "Corner treatments",
            "Paint and finish options",
            "Decorative ceiling treatments",
            "Archway and doorway molding",
            "Accent lighting integration"
          ], 
          benefits: [
            "Adds architectural interest",
            "Enhances room elegance",
            "Creates seamless transitions",
            "Increases property value",
            "Distinctive, upscale appearance"
          ], 
          processSteps: [
            { title: "Design Consultation", description: "We help you select the right profile and style to match your home's architecture." },
            { title: "Measurement", description: "Our team takes precise measurements to ensure accurate cuts and perfect fit." },
            { title: "Material Preparation", description: "We cut and prepare all materials with attention to detail." },
            { title: "Installation", description: "Our craftsmen install molding with specialized techniques for flawless results." },
            { title: "Finishing", description: "We apply caulk, putty nail holes, and prepare for painting or staining." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f",
            "https://images.unsplash.com/photo-1560184611-ff3e53f00e8f",
            "https://images.unsplash.com/photo-1598204720597-c7e0f4a6e98a",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
          ]
        }
      ]
    },
    {
      category: "Flooring",
      services: [
        { 
          title: "Hardwood",
          description: "Premium wood flooring",
          path: "/services/hardwood",
          image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd",
          features: [
            "Solid hardwood options",
            "Wide variety of wood species",
            "Custom staining available",
            "Professional installation",
            "Sanding and refinishing",
            "Eco-friendly options",
            "Long-lasting durability"
          ], 
          benefits: [
            "Increases home value",
            "Timeless aesthetic appeal",
            "Durable and long-lasting",
            "Can be refinished multiple times",
            "Natural, hypoallergenic material"
          ], 
          processSteps: [
            { title: "Consultation", description: "We discuss your preferences, lifestyle needs, and budget to recommend the best hardwood options." },
            { title: "Subfloor Preparation", description: "We ensure your subfloor is clean, level, and suitable for hardwood installation." },
            { title: "Professional Installation", description: "Our skilled craftsmen install your hardwood flooring with precision and care." },
            { title: "Finishing", description: "We apply stains and sealants to protect your floors and achieve your desired look." },
            { title: "Final Inspection", description: "We conduct a thorough inspection to ensure perfect installation and finish." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1584467541268-b040f83be3fd",
            "https://images.unsplash.com/photo-1595514535515-3be5a5b0d104",
            "https://images.unsplash.com/photo-1604743352254-3a49866ba56d",
            "https://images.unsplash.com/photo-1609862776364-896ff3950052"
          ]
        },
        { 
          title: "Tile Installation",
          description: "Custom tile solutions",
          path: "/services/tile",
          image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
          features: [
            "Ceramic, porcelain, and natural stone options",
            "Custom patterns and layouts",
            "Waterproof installation",
            "Heated floor compatibility",
            "Precision cutting and fitting",
            "Grout color customization",
            "Sealing services"
          ], 
          benefits: [
            "Exceptional durability",
            "Water and stain resistance",
            "Easy maintenance",
            "Versatile design options",
            "Ideal for high-moisture areas"
          ], 
          processSteps: [
            { title: "Design Consultation", description: "We help you select the perfect tile type, size, and pattern for your space." },
            { title: "Surface Preparation", description: "We ensure your subfloor is properly prepared and waterproofed as needed." },
            { title: "Professional Installation", description: "Our tile experts install your tiles with precision, ensuring proper spacing and alignment." },
            { title: "Grouting", description: "We apply and finish grout in your chosen color to complete the installation." },
            { title: "Sealing", description: "We seal natural stone tiles and grout lines to protect against stains and moisture." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
            "https://images.unsplash.com/photo-1619252584184-12db41877baa",
            "https://images.unsplash.com/photo-1625166013260-30cd0f3eff5b",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92"
          ]
        },
        { 
          title: "Luxury Vinyl",
          description: "Modern vinyl options",
          path: "/services/luxury-vinyl",
          image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d",
          features: [
            "Luxury vinyl plank (LVP) and tile (LVT)",
            "Waterproof options",
            "Wood and stone look designs",
            "Click-lock or glue-down installation",
            "Commercial-grade options",
            "Underfloor heating compatible",
            "Sound-dampening underlayment"
          ], 
          benefits: [
            "Waterproof and moisture resistant",
            "Extremely durable and scratch resistant",
            "Easy maintenance",
            "Comfortable underfoot",
            "More affordable than natural materials"
          ], 
          processSteps: [
            { title: "Material Selection", description: "We help you choose the right luxury vinyl product for your needs and style preferences." },
            { title: "Subfloor Preparation", description: "We ensure your subfloor is clean, dry, and level for optimal installation." },
            { title: "Underlayment Installation", description: "We install appropriate underlayment for sound dampening and comfort." },
            { title: "Vinyl Installation", description: "Our team precisely installs your luxury vinyl flooring with attention to detail." },
            { title: "Finishing", description: "We install trim pieces and transitions for a polished, professional look." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d",
            "https://images.unsplash.com/photo-1598214886806-c87b84b7078b",
            "https://images.unsplash.com/photo-1613545564241-d966676c00c6",
            "https://images.unsplash.com/photo-1553025934-296397db4010"
          ]
        },
        { 
          title: "Carpet Installation",
          description: "Quality carpet services",
          path: "/services/carpet",
          image: "https://images.unsplash.com/photo-1558317374-067fb5f30001",
          features: [
            "Wide variety of carpet styles",
            "Stain-resistant options",
            "Pet-friendly selections",
            "High-traffic durability grades",
            "Premium padding options",
            "Stretch-in and direct glue installation",
            "Pattern matching expertise"
          ], 
          benefits: [
            "Soft and comfortable underfoot",
            "Sound absorption qualities",
            "Insulating properties",
            "Slip-resistant surface",
            "Available in countless colors and patterns"
          ], 
          processSteps: [
            { title: "Carpet Selection", description: "We help you choose the right carpet type, pile, and color for your lifestyle and preferences." },
            { title: "Measurement & Estimation", description: "We take precise measurements to determine exact carpet requirements." },
            { title: "Subfloor Preparation", description: "We prepare your subfloor and install quality padding for comfort and longevity." },
            { title: "Professional Installation", description: "Our experienced installers carefully place, stretch, and secure your carpet." },
            { title: "Finishing Touches", description: "We install trim pieces and transitions for a seamless, professional appearance." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1558317374-067fb5f30001",
            "https://images.unsplash.com/photo-1493552832879-9c479e90e376",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03",
            "https://images.unsplash.com/photo-1584964743181-6a5c9abd4a88"
          ]
        },
        { 
          title: "Laminate Flooring",
          description: "Affordable, durable laminate",
          path: "/services/laminate",
          image: "https://images.unsplash.com/photo-1617577361378-7db7facace53",
          features: [
            "Wide range of wood and stone looks",
            "Various thickness options",
            "Water-resistant varieties",
            "AC rating options for different traffic levels",
            "Click-lock installation",
            "Underlayment options for sound reduction",
            "Transition and trim solutions"
          ], 
          benefits: [
            "Cost-effective alternative to hardwood",
            "Highly resistant to scratches and dents",
            "Easy maintenance and cleaning",
            "Simple installation process",
            "Suitable for most rooms in the home"
          ], 
          processSteps: [
            { title: "Product Selection", description: "We help you select the ideal laminate product for your space and usage needs." },
            { title: "Subfloor Preparation", description: "We ensure your subfloor is clean, dry, and level for optimal installation." },
            { title: "Moisture Barrier & Underlayment", description: "We install appropriate underlayment and moisture barriers for performance." },
            { title: "Laminate Installation", description: "Our team installs your laminate flooring with precision and attention to detail." },
            { title: "Finishing Work", description: "We install trim, transitions, and moldings for a complete, polished look." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1617577361378-7db7facace53",
            "https://images.unsplash.com/photo-1616890373452-de190cdb0d29",
            "https://images.unsplash.com/photo-1626863905121-3b0649a3c7a5",
            "https://images.unsplash.com/photo-1561725646-2b4586623225"
          ]
        },
        { 
          title: "Engineered Hardwood",
          description: "Versatile wood flooring",
          path: "/services/engineered-hardwood",
          image: "https://images.unsplash.com/photo-1581112277189-22fb89218235",
          features: [
            "Multiple wood species options",
            "Various plank widths and lengths",
            "Different wear layer thicknesses",
            "Floating, glue-down, or nail-down installation",
            "Prefinished and unfinished options",
            "Compatible with underfloor heating",
            "Custom finishes available"
          ], 
          benefits: [
            "Greater dimensional stability than solid hardwood",
            "Suitable for below-grade installations",
            "Real wood appearance and feel",
            "More resistant to moisture and humidity",
            "Environmentally friendly option"
          ], 
          processSteps: [
            { title: "Product Consultation", description: "We help you select the right engineered hardwood for your specific needs." },
            { title: "Acclimation", description: "We properly acclimate your flooring materials to your home's environment." },
            { title: "Subfloor Preparation", description: "We prepare your subfloor ensuring it's clean, level, and suitable for installation." },
            { title: "Professional Installation", description: "Our craftsmen install your engineered hardwood using the appropriate method." },
            { title: "Final Touches", description: "We install trim pieces and transitions for a complete, professional installation." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1581112277189-22fb89218235",
            "https://images.unsplash.com/photo-1579465200660-2b57fa98829e",
            "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d",
            "https://images.unsplash.com/photo-1622150834825-9356fb99a149"
          ]
        },
        { 
          title: "Stone Flooring",
          description: "Elegant natural stone",
          path: "/services/stone-flooring",
          image: "https://images.unsplash.com/photo-1600566752826-682ee8fb9014",
          features: [
            "Marble, granite, slate, travertine options",
            "Various finish options (polished, honed, etc.)",
            "Custom patterns and inlays",
            "Precision installation",
            "Sealing and finishing services",
            "Repair and restoration",
            "Heated floor compatibility"
          ], 
          benefits: [
            "Unmatched natural beauty and uniqueness",
            "Exceptional durability",
            "Increases property value",
            "Cool in summer, works well with radiant heat",
            "Natural, non-allergenic material"
          ], 
          processSteps: [
            { title: "Stone Selection", description: "We help you select the perfect stone type, color, and finish for your space." },
            { title: "Structural Assessment", description: "We evaluate your subfloor to ensure it can support the weight of stone flooring." },
            { title: "Subfloor Preparation", description: "We prepare a suitable substrate and waterproofing if necessary." },
            { title: "Stone Installation", description: "Our stone specialists install your flooring with precision and care." },
            { title: "Sealing & Finishing", description: "We apply appropriate sealants to protect your stone floors and enhance their beauty." }
          ], 
          galleryImages: [
            "https://images.unsplash.com/photo-1600566752826-682ee8fb9014",
            "https://images.unsplash.com/photo-1617806501444-cdf110098e36",
            "https://images.unsplash.com/photo-1522705762435-b29471a8a930",
            "https://images.unsplash.com/photo-1562663464-36eeef45411d"
          ]
        }
      ]
    },
    {
      category: "Exterior Services",
      services: [
        { 
          title: "Exterior Painting",
          description: "Fresh exterior looks",
          path: "/services/exterior-painting",
          image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
          features: [], benefits: [], processSteps: [], galleryImages: []
        },
        { 
          title: "Siding Installation",
          description: "Durable siding solutions",
          path: "/services/siding",
          image: "https://images.unsplash.com/photo-1604852116498-d442170c1738",
          features: [], benefits: [], processSteps: [], galleryImages: []
        },
        { 
          title: "Deck Building",
          description: "Custom outdoor spaces",
          path: "/services/deck",
          image: "https://images.unsplash.com/photo-1591560300589-7953bb636af8",
          features: [], benefits: [], processSteps: [], galleryImages: []
        },
        { 
          title: "Window Installation",
          description: "Energy efficient windows",
          path: "/services/windows",
          image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
          features: [], benefits: [], processSteps: [], galleryImages: []
        }
      ]
    },
    {
      category: "Demolition & Prep",
      services: [
        { 
          title: "Selective Demolition",
          description: "Precise removal services",
          path: "/services/selective-demolition",
          image: "https://images.unsplash.com/photo-1526797009556-a463e95a8275",
          features: [], benefits: [], processSteps: [], galleryImages: []
        },
        { 
          title: "Site Preparation",
          description: "Readying sites for builds",
          path: "/services/site-prep",
          image: "https://images.unsplash.com/photo-1595173589214-62be709c531e",
          features: [], benefits: [], processSteps: [], galleryImages: []
        },
        { 
          title: "Debris Removal",
          description: "Efficient cleanup",
          path: "/services/debris-removal",
          image: "https://images.unsplash.com/photo-1558317374-067fb5f30001",
          features: [], benefits: [], processSteps: [], galleryImages: []
        }
      ]
    }
  ];

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to handle category slide changes
  const nextCategorySlide = () => {
    setCurrentCategorySlide((prev) => (prev + 1) % services.length);
  };

  const prevCategorySlide = () => {
    setCurrentCategorySlide((prev) => (prev - 1 + services.length) % services.length);
  };

  // Auto-slide effect for categories (optional)
  useEffect(() => {
    const categoryInterval = setInterval(nextCategorySlide, 7000); // Change category every 7 seconds
    return () => clearInterval(categoryInterval);
  }, [services.length]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Navigation Bar */}
          <div className={`bg-gray-900 border-b border-gray-800 transition-all duration-300 ${scrolled ? 'shadow-lg py-2' : 'py-4'}`}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <a href="/" className="flex items-center space-x-3">
                  <img 
                    src="https://i.postimg.cc/bZwwNSgF/IMG-2138-removebg-preview.png" 
                    alt="Arxen Construction Logo" 
                    className="h-12 w-auto"
                  />
                </a>
                <div className="hidden lg:flex items-center space-x-8">
                  <div className="relative group">
                    <button className="text-gray-300 hover:text-white font-medium text-base flex items-center group-hover:text-yellow-400 transition-all duration-300 relative">
                      Services
                      <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                    </button>
                  <div className="absolute left-0 mt-2 w-[900px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 grid grid-cols-5 gap-6 p-6">
                    {services.map((category, index) => (
                      <div key={index} className="space-y-4 animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                        <h3 className="font-bold text-white mb-2 border-b border-gray-700 pb-1 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent bg-size-200 transition-all duration-500 hover:bg-pos-100">{category.category}</h3>
                        <ul className="space-y-3">
                          {category.services.map((service, serviceIndex) => (
                            <li key={serviceIndex} className="transform transition-transform duration-200 hover:translate-x-1">
                              <Link 
                                to={service.path}
                                className="group/item block text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 group-hover/item:after:w-full after:transition-all after:duration-300">
                                    {service.title}
                                  </span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:translate-x-1" />
                                </div>
                                <p className="text-xs text-gray-400 mt-1 leading-tight">
                                  {service.description}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link 
                          to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-yellow-400 hover:text-yellow-300 mt-3 inline-block relative group/all overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center">
                            View All in {category.category}
                            <ArrowRight className="w-3 h-3 ml-1 transform transition-transform duration-300 group-hover/all:translate-x-1" />
                          </span>
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left scale-x-0 transition-transform duration-300 group-hover/all:scale-x-100"></span>
                        </Link>
                      </div>
                    ))}
                    <div className="col-span-5 mt-4 pt-4 border-t border-gray-700 text-center">
                       <Link to="/contact" className="text-yellow-400 hover:text-yellow-300 font-medium relative inline-block group/contact overflow-hidden">
                         <span className="relative z-10">Need a Custom Service? Contact Us!</span>
                         <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover/contact:scale-x-100"></span>
                       </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white font-medium text-base flex items-center group-hover:text-yellow-400 transition-all duration-300 relative">
                    More
                    <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <ul className="p-4 space-y-2">
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Testimonials</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/portfolio" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Portfolio</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Blog</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white font-medium text-base flex items-center group-hover:text-yellow-400 transition-all duration-300 relative">
                    Commercial
                    <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                    <ul className="p-4 space-y-2">
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/commercial-quote" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Request a Quote</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/commercial/office-renovations" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Office Renovations</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/commercial/retail-fit-outs" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Retail Fit-Outs</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                      <li className="transform transition-transform duration-200 hover:translate-x-1">
                        <Link to="/commercial/industrial-solutions" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center">
                          <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">Industrial Solutions</span>
                          <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <Link to="/residential" className="text-gray-300 hover:text-white font-medium text-base hover:text-yellow-400 transition-colors duration-300 relative group/nav">
                  Residential
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover/nav:scale-x-100 origin-left"></span>
                </Link>
                <Link to="/financing" className="text-gray-300 hover:text-white font-medium text-base hover:text-yellow-400 transition-colors duration-300 relative group/nav">
                  Financing
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover/nav:scale-x-100 origin-left"></span>
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-white font-medium text-base hover:text-yellow-400 transition-colors duration-300 relative group/nav">
                  About Us
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover/nav:scale-x-100 origin-left"></span>
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white font-medium text-base hover:text-yellow-400 transition-colors duration-300 relative group/nav">
                  Contact
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 group-hover/nav:scale-x-100 origin-left"></span>
                </Link>
                <Link to="/quote" className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden group font-semibold">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative">Free Estimate</span>
                </Link>
              </div>
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200" 
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'transform rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Top Banner */}
          <div className="bg-gray-800 border-t border-gray-700">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap py-4">
                {services.map((category, index) => (
                  <div key={index} className="relative group">
                    <button className="text-gray-300 font-semibold px-4 hover:text-yellow-400 transition-colors flex items-center">
                      {category.category.toUpperCase()}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-4">
                        <ul className="space-y-2">
                          {category.services.map((service, serviceIndex) => (
                            <li key={serviceIndex}>
                              <Link 
                                to={service.path}
                                className="flex items-center text-gray-300 hover:text-yellow-400 py-2"
                              >
                                <span className="flex-grow">{service.title}</span>
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <Link
                            to={`/quote?service=${category.category}`}
                            className="flex items-center justify-center bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors mb-2 font-semibold"
                          >
                            Get Quote
                          </Link>
                          <div className="text-center">
                            <p className="text-sm text-gray-400 mb-1">Questions? Call us:</p>
                            <a href="tel:404-934-9458" className="text-yellow-400 font-bold hover:text-yellow-300">
                              404-934-9458
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/offers" className="bg-yellow-500 text-gray-900 font-semibold px-6 py-1 rounded hover:bg-yellow-400 transition-colors">OFFERS</Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-gray-900 shadow-lg z-40 border-t border-gray-800 overflow-y-auto animate-slide-in-right">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Simplified mobile menu links - needs expansion */}
              <Link to="/" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </span>
              </Link>
              
              {/* Mobile Services Dropdown */}
              <div className="relative py-2 border-b border-gray-800">
                <button className="flex items-center justify-between w-full text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2">
                  <span className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Services
                  </span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div className="mt-2 space-y-1 pl-7 animate-fade-in">
                  {services.map((category, index) => (
                    <div key={index} className="py-1">
                      <div className="flex items-center font-medium text-gray-200 mb-1">
                        <span className="relative after:absolute after:w-0 after:h-0.5 after:bg-yellow-400 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">
                          {category.category}
                        </span>
                      </div>
                      <div className="pl-3 space-y-1">
                        {category.services.slice(0, 3).map((service, serviceIndex) => (
                          <Link 
                            key={serviceIndex}
                            to={service.path}
                            className="block text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm py-1 transform transition-transform duration-200 hover:translate-x-1 flex items-center"
                            onClick={toggleMobileMenu}
                          >
                            <ChevronRight className="w-3 h-3 mr-1 text-yellow-500" />
                            {service.title}
                          </Link>
                        ))}
                        <Link 
                          to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-yellow-400 hover:text-yellow-300 transition-colors duration-200 text-sm py-1 italic"
                          onClick={toggleMobileMenu}
                        >
                          View all {category.category}...
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to="/residential" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Residential
                </span>
              </Link>
              <Link to="/commercial-quote" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Commercial
                </span>
              </Link>
              <Link to="/financing" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financing
                </span>
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  About Us
                </span>
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 border-b border-gray-800 flex items-center" onClick={toggleMobileMenu}>
                <span className="transform transition-transform duration-200 hover:translate-x-1 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact
                </span>
              </Link>
              <Link 
                to="/quote" 
                className="block w-full text-center bg-yellow-500 text-gray-900 px-4 py-3 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 mt-6 flex items-center justify-center space-x-2 font-semibold" 
                onClick={toggleMobileMenu}
              >
                <Clipboard className="w-5 h-5" />
                <span>Free Estimate</span>
              </Link>

              {/* Quick Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center mb-3 text-gray-300">
                  <Phone className="w-5 h-5 mr-2 text-yellow-400" /> 
                  <a href="tel:678-702-4132" className="hover:text-yellow-400 transition-colors duration-200">
                    678-702-4132
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-2 text-yellow-400" /> 
                  <a href="mailto:info@arxen-construction.com" className="hover:text-yellow-400 transition-colors duration-200">
                    info@arxen-construction.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content - Add padding top to account for the fixed navbar */}
      <div className="pt-32">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-white">
              {/* Hero Section */}
              <div 
                className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543286386-71314a40aac6?auto=format&fit=crop&q=80')` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 text-white px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4">Build Your Dream</h1>
                  <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Expert construction and remodeling services for residential and commercial properties.</p>
                  <Link to="/contact" className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors">
                    Get a Free Estimate
                  </Link>
                </div>
              </div>
              
              {/* Services Category Slider Section (New Implementation) */}
              <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold text-center mb-12">Explore Our Services</h2>
                  <div className="relative overflow-hidden">
                    {/* Slider Track */}
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentCategorySlide * 100}%)` }}
                    >
                      {services.map((category, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-4">
                          <div className="relative group block bg-black rounded-lg overflow-hidden shadow-lg h-[400px]">
                            <img
                              alt={category.category}
                              src={category.services[0]?.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'} // Use first service image as category image
                              className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                            />
                            <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-end h-full">
                              <div className="bg-black bg-opacity-70 p-6 rounded">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{category.category}</h3>
                                {/* Optional: List first few services */}
                                <ul className="text-gray-300 space-y-1 mb-4 hidden sm:block">
                                  {category.services.slice(0, 3).map((service, i) => (
                                    <li key={i} className="flex items-center">
                                      <Check className="w-4 h-4 mr-2 text-blue-400" />
                                      {service.title}
                                    </li>
                                  ))}
                                  {category.services.length > 3 && <li>...and more</li>}
                                </ul>
                                <Link 
                                  to={`/services/category/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                  View {category.category} Services <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Slider Controls */}
                    <button
                      onClick={prevCategorySlide}
                      className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                      aria-label="Previous service category"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextCategorySlide}
                      className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                      aria-label="Next service category"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>

                    {/* Slider Dots (Optional) */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {services.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setCurrentCategorySlide(index)}
                          className={`w-3 h-3 rounded-full ${currentCategorySlide === index ? 'bg-white' : 'bg-white/50'} hover:bg-white transition-colors`}
                          aria-label={`Go to service category ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="py-20 bg-blue-900 text-white">
                <div className="container mx-auto px-4">
                  <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      { 
                        icon: <Hammer className="w-8 h-8" />, 
                        title: '20+ Years Experience',
                        description: 'Decades of expertise in construction and remodeling'
                      },
                      { 
                        icon: <CheckCircle className="w-8 h-8" />, 
                        title: 'Full-Service Solutions',
                        description: 'One team for all your construction needs'
                      },
                      { 
                        icon: <Shield className="w-8 h-8" />, 
                        title: 'Licensed & Insured',
                        description: 'Fully certified and protected'
                      },
                      { 
                        icon: <Clock className="w-8 h-8" />, 
                        title: 'On-Time Completion',
                        description: 'Projects delivered on schedule'
                      }
                    ].map((feature, index) => (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free Quote Section */}
              <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
                    <div className="grid md:grid-cols-2">
                      {/* Left side - Promotion */}
                      <div 
                        className="p-12 bg-cover bg-center relative flex items-center"
                        style={{
                          backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80")'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/70" />
                        <div className="relative text-white z-10">
                          <div className="inline-block bg-yellow-500 text-gray-900 px-4 py-2 rounded-md mb-6 font-bold animate-pulse">
                            LIMITED TIME OFFER
                          </div>
                          <h2 className="text-4xl font-bold mb-4 text-shadow">Spring Renovation Special</h2>
                          <div className="mb-6">
                            <div className="text-8xl font-bold text-yellow-400 text-shadow-lg">25%</div>
                            <div className="text-2xl font-bold">off</div>
                          </div>
                          <div className="text-2xl font-semibold mb-2">YOUR ENTIRE PROJECT</div>
                          <p className="mb-6">Transform your space with our comprehensive renovation services.</p>
                          <div className="text-sm">Ends 5/31/24. <span className="underline cursor-pointer hover:text-yellow-400 transition-colors">Details</span></div>
                        </div>
                      </div>

                      {/* Right side - Form */}
                      <div className="p-12 bg-gray-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -mr-32 -mt-32 transition-all duration-500 group-hover:scale-150"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-full -ml-32 -mb-32 transition-all duration-500 group-hover:scale-150"></div>
                        <div className="relative z-10">
                          <h2 className="text-3xl font-bold mb-4">Schedule a FREE Consultation</h2>
                          <div className="flex items-center gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 text-gray-300">25,000+ satisfied customers</span>
                          </div>
                          <form className="space-y-4">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Your zip code"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                              />
                            </div>
                            <div className="relative">
                              <select className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 appearance-none">
                                <option value="">Select service type</option>
                                <option value="kitchen">Kitchen Remodeling</option>
                                <option value="bathroom">Bathroom Renovation</option>
                                <option value="painting">Painting</option>
                                <option value="flooring">Flooring</option>
                                <option value="additions">Room Additions</option>
                                <option value="demolition">Demolition</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                            </div>
                            <div className="relative">
                              <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                              />
                            </div>
                            <label className="flex items-start gap-2 hover:text-yellow-400 cursor-pointer transition-colors">
                              <input type="checkbox" className="mt-1 bg-gray-800 border-gray-700 text-yellow-500 rounded focus:ring-yellow-500" />
                              <span className="text-sm text-gray-300">
                                Keep me updated about special offers and design tips.
                              </span>
                            </label>
                            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg relative overflow-hidden">
                              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></span>
                              <span className="relative">SCHEDULE FREE CONSULTATION</span>
                            </button>
                            <div className="text-center">
                              <span className="text-gray-400">or CALL </span>
                              <a href="tel:404-934-9458" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">404-934-9458</a>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Contact Section */}
            <div className="bg-blue-800 text-white py-20">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <Phone className="w-6 h-6 mr-4" />
                        <span>404-934-9458</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-6 h-6 mr-4" />
                        <span>sustenablet@gmail.com</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-6 h-6 mr-4" />
                        <span>123 Main Street, City, State 12345</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-6 h-6 mr-4 mt-1" />
                        <div>
                          <p>Monday - Friday: 8AM - 7PM</p>
                          <p>Saturday: 8AM - 8PM</p>
                          <p>Sunday: 9AM - 5PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300"
                    ></textarea>
                    <button className="bg-white hover:bg-gray-100 text-blue-800 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Commercial Services Section */}
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Commercial Services</h2>
                <p className="text-center text-gray-700 mb-8">Explore our comprehensive range of commercial services tailored to meet your business needs.</p>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Office Renovations',
                      description: 'Modernize your workspace with our expert renovation services.',
                      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80',
                      path: '/commercial/office-renovations'
                    },
                    {
                      title: 'Retail Fit-Outs',
                      description: 'Create a stunning retail environment that attracts customers.',
                      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80',
                      path: '/commercial/retail-fit-outs'
                    },
                    {
                      title: 'Industrial Solutions',
                      description: 'Efficient and reliable solutions for industrial spaces.',
                      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80',
                      path: '/commercial/industrial-solutions'
                    }
                  ].map((service, index) => (
                    <Link 
                      key={index}
                      to={service.path}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                        <p className="text-gray-700">{service.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to="/commercial-quote" className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                    Request a Commercial Quote
                  </Link>
                </div>
              </div>
            </div>

            {/* Design Appointment Prep Section */}
            <div className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4">DESIGN APPOINTMENT PREP</h2>
                <p className="text-center text-gray-600 mb-16">Use tools on our site to prepare for your design appointment.</p>
                
                <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      <Camera className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">TAKE PICTURES OF YOUR SPACE</h3>
                    <p className="text-gray-600">
                      Landscape photos of a clear room with natural or bright lighting work best for our tools and designers.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      <Box className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">VISUALIZER</h3>
                    <p className="text-gray-600 mb-4">
                      See how our products look in your space right from your own device and share your design style.
                    </p>
                    <a href="/visualizer" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                      Visualize It! <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>

                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      <ClipboardList className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">MY PROJECTS</h3>
                    <p className="text-gray-600 mb-4">
                      Save your favorite products in an easy to access list. Access quotes from your Design Appointments.
                    </p>
                    <a href="/my-projects" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                      My Projects <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 bg-gray-100">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
                <TestimonialSlider testimonials={testimonials} />
                <div className="text-center mt-8">
                  <Link to="/testimonials" className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                    Read More Testimonials
                  </Link>
                </div>
              </div>
            </div>

            {/* Portfolio/Gallery Section */}
            <div className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Our Portfolio</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {services.map((category, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg shadow-lg p-6">
                      <h3 className="font-bold text-lg mb-4">{category.category}</h3>
                      <ul className="space-y-2">
                        {category.services.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="text-gray-700">
                            {service.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to="/portfolio" className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                    View Full Portfolio
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog/News Section */}
            <div className="py-16 bg-gray-100">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Latest News & Tips</h2>
                {/* Featured Blog Post */}
                <div className="mb-12">
                  <div className="bg-white rounded-lg shadow-lg p-6 flex">
                    <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" alt="Featured Post" className="w-1/3 rounded-lg mr-6" />
                    <div>
                      <h3 className="font-bold text-2xl mb-2">Featured Blog Post Title</h3>
                      <p className="text-gray-700 mb-4">A brief description of the featured blog post content goes here...</p>
                      <Link to="/blog/featured-post" className="text-blue-900 hover:text-blue-700">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Recent Posts */}
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((post, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="font-bold text-lg mb-2">Recent Post Title {post}</h3>
                      <p className="text-gray-700 mb-4">A brief description of the recent blog post content goes here...</p>
                      <Link to={`/blog/recent-post-${post}`} className="text-blue-900 hover:text-blue-700">
                        Read More
                      </Link>
                    </div>
                  ))}
                </div>
                {/* Categories */}
                <div className="mt-12">
                  <h4 className="font-bold text-xl mb-4">Categories</h4>
                  <ul className="flex space-x-4">
                    {['Remodeling', 'Interior Design', 'DIY Tips', 'Industry News'].map((category, index) => (
                      <li key={index}>
                        <Link to={`/blog/category/${category.toLowerCase()}`} className="text-gray-600 hover:text-blue-900">
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center mt-8">
                  <Link to="/blog" className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                    Visit Our Blog
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
              <div className="container mx-auto px-4 text-center">
                <p>© {new Date().getFullYear()} Arxen Construction. All rights reserved.</p>
              </div>
            </footer>
          </div>
        } />
        <Route path="/services/kitchen-remodeling" element={<KitchenRemodeling />} />
        <Route path="/services/custom-cabinetry" element={<CustomCabinetryPage />} />
        <Route path="/services/flooring" element={<FlooringServicesPage />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Contact />} />
        <Route path="/commercial-quote" element={<CommercialQuote />} />
        <Route path="/residential-quote" element={<ResidentialQuote />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/residential" element={<Residential />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/visualizer" element={<VisualizeIt />} />
        <Route path="/my-projects" element={<MyProjects />} />
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
        <Route path="/commercial/office-renovations" element={<CommercialServicePage title="Office Renovations" />} />
        <Route path="/commercial/retail-fit-outs" element={<CommercialServicePage title="Retail Fit-Outs" />} />
        <Route path="/commercial/industrial-solutions" element={<CommercialServicePage title="Industrial Solutions" />} />
      </Routes>
    </Router>
  );
}

export default App;

/* Add these CSS animations at the end of the file */
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
  `
};

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = keyframes.fadeIn + keyframes.slideInRight;
  document.head.appendChild(style);
}