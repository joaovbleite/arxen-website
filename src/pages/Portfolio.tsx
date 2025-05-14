import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Star, ArrowRight, Camera, Filter, Check, ChevronDown, Tag, Clock, MapPin, ArrowLeft } from 'lucide-react';

const Portfolio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId?: string }>();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  // Scroll to top when a project is selected
  useEffect(() => {
    if (selectedProject) {
      window.scrollTo(0, 0);
    }
  }, [selectedProject]);

  // Project type interface
  interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    completionDate: string;
    duration: string;
    tags: string[];
    beforeImage: string;
    afterImage: string;
    additionalImages: string[];
    testimonial?: {
      name: string;
      quote: string;
      rating: number;
    };
    features: string[];
    challenges?: string[];
    solutions?: string[];
  }

  // Project transformation showcase data
  const transformationProjects: Project[] = [
    {
      id: 'kitchen-transformation',
      title: 'Modern Kitchen Transformation',
      description: 'This complete kitchen remodel transformed an outdated, cramped space into an open-concept, modern kitchen with custom cabinetry, premium countertops, and state-of-the-art appliances.',
      category: 'Kitchen',
      location: 'Marietta, GA',
      completionDate: 'March 2023',
      duration: '6 weeks',
      tags: ['Kitchen Remodeling', 'Custom Cabinetry', 'Premium Countertops'],
      beforeImage: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556913088-485a1b37190a?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579811520974-4f41f89a1f39?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Sarah Johnson',
        quote: 'Our kitchen renovation exceeded all expectations. The team was professional, detail-oriented, and completed the project on time. We especially love our new island and custom cabinets!',
        rating: 5
      },
      features: [
        'Custom-designed cabinets with soft-close drawers',
        'Premium quartz countertops with waterfall edge',
        'Energy-efficient stainless steel appliances',
        'Under-cabinet LED lighting',
        'Porcelain tile flooring',
        'Custom backsplash with designer tiles',
        'New plumbing fixtures and hardware'
      ],
      challenges: [
        'Limited space requiring creative solutions',
        'Needed to keep some existing structural elements',
        'Customer requested to maintain functionality during parts of the renovation'
      ],
      solutions: [
        'Created custom storage solutions to maximize available space',
        'Designed around existing structural elements to minimize construction costs',
        'Implemented a phased approach to keep parts of the kitchen usable'
      ]
    },
    {
      id: 'bathroom-transformation',
      title: 'Luxury Bathroom Remodel',
      description: 'A complete transformation from outdated fixtures to a spa-like retreat with custom tilework, glass shower, and premium fixtures.',
      category: 'Bathroom',
      location: 'Atlanta, GA',
      completionDate: 'January 2023',
      duration: '4 weeks',
      tags: ['Bathroom Remodeling', 'Custom Tile Work', 'Glass Shower'],
      beforeImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Michael Chen',
        quote: 'The bathroom renovation transformed our outdated space into a luxurious retreat. The attention to detail was phenomenal, from the perfectly aligned tiles to the elegant fixtures.',
        rating: 5
      },
      features: [
        'Frameless glass shower enclosure',
        'Custom porcelain tile throughout',
        'Heated flooring system',
        'Double vanity with quartz countertop',
        'LED backlit mirror',
        'Premium plumbing fixtures',
        'Custom storage solutions'
      ],
      challenges: [
        'Small bathroom requiring creative space utilization',
        'Existing plumbing required relocation',
        'Waterproofing needed special attention due to complex shower design'
      ],
      solutions: [
        'Custom-designed storage solutions to maximize space efficiency',
        'Completely reorganized layout to improve functionality',
        'Implemented advanced waterproofing systems for long-term protection'
      ]
    },
    {
      id: 'living-room-transformation',
      title: 'Modern Living Space',
      description: 'This living room renovation included new hardwood floors, custom built-ins, fireplace redesign, and modern lighting.',
      category: 'Living Room',
      location: 'Kennesaw, GA',
      completionDate: 'February 2023',
      duration: '3 weeks',
      tags: ['Living Room', 'Hardwood Flooring', 'Custom Built-Ins'],
      beforeImage: 'https://images.unsplash.com/photo-1589459072535-550f4fae08d2?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Emily Rodriguez',
        quote: 'The living room transformation is stunning! The custom built-ins completely changed the feel of the space, and we love how they designed around our existing fireplace.',
        rating: 4.5
      },
      features: [
        'Premium engineered hardwood flooring',
        'Custom built-in shelving and entertainment center',
        'Redesigned fireplace with stone veneer',
        'Recessed and accent lighting',
        'Custom window treatments',
        'New crown molding and baseboards',
        'Designer paint and finishes'
      ],
      challenges: [
        'Existing fireplace had structural limitations',
        'Uneven flooring from previous installation',
        'Limited natural light requiring creative lighting solutions'
      ],
      solutions: [
        'Custom design to integrate with existing fireplace structure',
        'Comprehensive floor leveling before new hardwood installation',
        'Developed layered lighting plan to enhance the space'
      ]
    },
    {
      id: 'office-transformation',
      title: 'Corporate Office Renovation',
      description: 'Transformed an outdated office into a modern, collaborative workspace with improved lighting, ergonomic workstations, and tech integration.',
      category: 'Commercial',
      location: 'Atlanta, GA',
      completionDate: 'April 2023',
      duration: '8 weeks',
      tags: ['Commercial', 'Office Renovation', 'Workspace Design'],
      beforeImage: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1575886886052-be55e1aebe1b?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'David Thompson',
        quote: 'The office renovation has completely transformed our workspace. Productivity has increased, and our clients are always impressed when they visit. Worth every penny!',
        rating: 5
      },
      features: [
        'Open concept collaborative workspace',
        'Ergonomic workstations with sit-stand desks',
        'Custom conference room with integrated technology',
        'Energy-efficient LED lighting throughout',
        'Soundproofed meeting areas and phone booths',
        'Modern break room with custom cabinetry',
        'Commercial-grade flooring and finishes'
      ],
      challenges: [
        'Business needed to remain partially operational during renovation',
        'Complex technology integration requirements',
        'Limited budget with high-end design expectations'
      ],
      solutions: [
        'Implemented phased construction plan to minimize disruption',
        'Collaborated with IT specialists for seamless technology integration',
        'Strategic material selections to achieve high-end look within budget'
      ]
    }
  ];

  // Additional portfolio projects  
  const additionalProjects: Project[] = [
    {
      id: 'rooftop-terrace',
      title: 'Luxury Rooftop Terrace',
      description: 'Transformation of an unused rooftop into a sophisticated entertainment space with panoramic city views.',
      category: 'Outdoor',
      location: 'Midtown Atlanta, GA',
      completionDate: 'July 2024',
      duration: '7 weeks',
      tags: ['Outdoor', 'Rooftop', 'Entertainment Space'],
      beforeImage: 'https://images.unsplash.com/photo-1535576434247-efa977a97af0?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1583855282680-6dbdc7a339ed?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1589813515886-65894c2bc467?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1603884845320-c62e1b5cecae?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Alex & Maria Richardson',
        quote: 'Our rooftop was completely unused space before ARXEN transformed it into our favorite spot in the condo. The design perfectly maximizes the city views while providing comfortable spaces for entertaining.',
        rating: 5
      },
      features: [
        'Custom composite decking system',
        'Glass railing for unobstructed views',
        'Outdoor kitchen and bar area',
        'Weather-resistant lounge furniture',
        'Integrated lighting design',
        'Potted landscaping and green spaces',
        'Retractable shade system'
      ],
      challenges: [
        'Weight limitations for rooftop installation',
        'Rooftop access for materials and crew',
        'Weather exposure and waterproofing concerns',
        'Building code compliance for rooftop spaces'
      ],
      solutions: [
        'Lightweight materials selection with engineered support',
        'Coordinated crane lifts for major materials',
        'Advanced weatherproofing systems integration',
        'Comprehensive code review with building officials'
      ]
    },
    {
      id: 'eco-friendly-home-remodel',
      title: 'Net-Zero Energy Home Remodel',
      description: 'Complete home renovation focused on sustainability with solar integration, energy-efficient systems, and eco-friendly materials.',
      category: 'Whole Home',
      location: 'Peachtree City, GA',
      completionDate: 'August 2024',
      duration: '15 weeks',
      tags: ['Eco-Friendly', 'Solar', 'Energy Efficient'],
      beforeImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1611845726298-de528e9bba94?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522624329010-e6125441f1e8?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'The Martinez Family',
        quote: 'We wanted a home that aligned with our environmental values while still being beautiful and functional. ARXEN delivered beyond our expectations - our energy bills are virtually zero, and the house looks amazing!',
        rating: 4.9
      },
      features: [
        'Rooftop solar panel system',
        'High-efficiency HVAC with heat pump',
        'Comprehensive insulation upgrade',
        'Energy-efficient windows and doors',
        'Rainwater collection system',
        'Sustainable material selection',
        'Smart home energy management'
      ],
      challenges: [
        'Integration of multiple sustainable systems',
        'Balancing aesthetics with eco-friendly requirements',
        'Retrofitting older home structure',
        'Complex permitting for renewable energy'
      ],
      solutions: [
        'Holistic systems design approach',
        'Custom design elements using sustainable materials',
        'Structural upgrades to support new systems',
        'Expert permitting team for expedited approvals'
      ]
    },
    {
      id: 'fitness-studio-conversion',
      title: 'Commercial Fitness Studio Conversion',
      description: 'Conversion of a former retail space into a premium boutique fitness studio with specialized equipment areas and luxury amenities.',
      category: 'Commercial',
      location: 'Vinings, GA',
      completionDate: 'September 2024',
      duration: '11 weeks',
      tags: ['Commercial', 'Fitness', 'Studio'],
      beforeImage: 'https://images.unsplash.com/photo-1565546801461-9d3a42a118ec?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Ryan Chen, Studio Owner',
        quote: 'ARXEN understood exactly what we needed for a fitness studio - specific flooring requirements, proper ventilation, sound isolation, and striking design elements that align with our brand. Our members frequently comment on how beautiful the space is.',
        rating: 5
      },
      features: [
        'Specialized rubber and hardwood exercise flooring',
        'Custom mirrored walls with integrated lighting',
        'Advanced sound system with acoustic treatments',
        'Luxury locker rooms and shower facilities',
        'Custom reception and retail area',
        'Industrial-grade HVAC with enhanced ventilation',
        'Equipment mounting reinforcements'
      ],
      challenges: [
        'Floor load requirements for fitness equipment',
        'Soundproofing for high-intensity classes',
        'Enhanced ventilation needs',
        'Plumbing for additional shower facilities'
      ],
      solutions: [
        'Engineered subfloor for weight distribution',
        'Multi-layer acoustic insulation system',
        'Custom HVAC design with recovery ventilator',
        'Complete plumbing system redesign'
      ]
    },
    {
      id: 'mid-century-restoration',
      title: 'Mid-Century Modern Restoration',
      description: 'Authentic restoration of a 1960s mid-century modern home, preserving original architectural elements while updating systems and finishes.',
      category: 'Historic',
      location: 'Druid Hills, GA',
      completionDate: 'October 2024',
      duration: '16 weeks',
      tags: ['Historic', 'Mid-Century', 'Restoration'],
      beforeImage: 'https://images.unsplash.com/photo-1615877976691-42fc21340328?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506730447-7683abca8434?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'David & Clara Wilson',
        quote: 'We purchased this home specifically for its mid-century character, but it needed significant updates. ARXEN\'s restoration approach perfectly balanced preservation with modern functionality - they kept all the important architectural elements while making the house comfortable and efficient.',
        rating: 5
      },
      features: [
        'Restored original wood paneling',
        'Period-appropriate terrazzo flooring',
        'Preserved clerestory windows',
        'Modern kitchen with vintage aesthetic',
        'Updated plumbing and electrical',
        'Energy-efficient upgrades',
        'Expanded primary bathroom'
      ],
      challenges: [
        'Finding historically accurate materials',
        'Updating systems while preserving aesthetics',
        'Structural issues hidden in original construction',
        'Energy efficiency with original windows'
      ],
      solutions: [
        'Partnered with architectural salvage specialists',
        'Creative concealment of modern systems',
        'Targeted structural reinforcement',
        'Custom window solutions for efficiency'
      ]
    },
    {
      id: 'master-bedroom-suite',
      title: 'Master Bedroom Suite',
      description: 'Complete renovation of a master bedroom with custom walk-in closet and en-suite bathroom.',
      category: 'Bedroom',
      location: 'Roswell, GA',
      completionDate: 'May 2023',
      duration: '5 weeks',
      tags: ['Bedroom', 'Walk-in Closet', 'En-suite Bathroom'],
      beforeImage: 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1616137548649-a1e2a22af4ae?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Rebecca Torres',
        quote: 'The master suite renovation completely transformed our space. The custom closet solutions are amazing and the attention to detail was impressive.',
        rating: 4.8
      },
      features: [
        'Custom built-in storage solutions',
        'Designer lighting fixtures',
        'Luxury carpet and hardwood flooring',
        'Custom paint and trim work',
        'Integrated smart home features',
        'Energy-efficient windows'
      ]
    },
    {
      id: 'basement-finishing',
      title: 'Basement Entertainment Area',
      description: 'Transformed an unfinished basement into a multi-functional entertainment space with home theater and wet bar.',
      category: 'Basement',
      location: 'Alpharetta, GA',
      completionDate: 'June 2023',
      duration: '7 weeks',
      tags: ['Basement', 'Home Theater', 'Wet Bar'],
      beforeImage: 'https://images.unsplash.com/photo-1558652725-6e93f8c59896?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1505743355971-f869c777c47e?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1593053272490-e0ed6d6a42c5?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585090066771-31e71a1b4717?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594566338293-cb0827a2c4b3?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Jason Parker',
        quote: 'Our basement is now the favorite spot in our home. The theater and wet bar are perfect for entertaining, and the team was professional throughout the entire process.',
        rating: 5
      },
      features: [
        'Soundproofed home theater area',
        'Custom wet bar with refrigeration',
        'Gaming area with custom storage',
        'Luxury vinyl flooring',
        'Recessed and accent lighting',
        'Full bathroom addition',
        'Energy-efficient HVAC system'
      ]
    },
    {
      id: 'outdoor-living',
      title: 'Outdoor Living Space',
      description: 'Custom deck and patio design with outdoor kitchen, fire pit, and covered seating area.',
      category: 'Outdoor',
      location: 'Sandy Springs, GA',
      completionDate: 'July 2023',
      duration: '6 weeks',
      tags: ['Outdoor', 'Deck', 'Patio', 'Outdoor Kitchen'],
      beforeImage: 'https://images.unsplash.com/photo-1599610618438-1951e54df9fd?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1604014056084-da75de0f05b4?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Marcus & Kelly Williams',
        quote: 'We absolutely love our new outdoor space! The kitchen and fire pit area have made summer entertaining so much better, and the quality of the work is outstanding.',
        rating: 5
      },
      features: [
        'Composite decking with hidden fasteners',
        'Outdoor kitchen with built-in grill',
        'Custom stone fire pit',
        'Covered seating area with fans',
        'Landscape lighting',
        'Custom pergola',
        'Integrated speaker system'
      ]
    },
    {
      id: 'retail-renovation',
      title: 'Retail Store Renovation',
      description: 'Complete storefront and interior renovation for a boutique retail space.',
      category: 'Commercial',
      location: 'Buckhead, GA',
      completionDate: 'August 2023',
      duration: '5 weeks',
      tags: ['Commercial', 'Retail', 'Storefront'],
      beforeImage: 'https://images.unsplash.com/photo-1567498573429-892dbc2663e9?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1612690441211-f7fe779d9851?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1604141178798-3d10bc695c4c?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687929-0df73b67d1a5?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Olivia Bennett',
        quote: 'The renovation completely transformed my boutique. Customer traffic has increased by 30% since reopening, and everyone comments on how beautiful the space is.',
        rating: 4.9
      },
      features: [
        'Custom storefront design',
        'Premium flooring',
        'Specialty lighting design',
        'Custom display fixtures',
        'Point-of-sale counter',
        'Energy-efficient HVAC',
        'ADA compliant restroom'
      ]
    },
    {
      id: 'historic-home-restoration',
      title: 'Historic Home Restoration',
      description: 'Careful restoration of a 1920s craftsman home, preserving original details while modernizing key systems.',
      category: 'Historic',
      location: 'Inman Park, GA',
      completionDate: 'September 2023',
      duration: '12 weeks',
      tags: ['Historic', 'Restoration', 'Craftsman'],
      beforeImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607688181-9c5a1582b1d9?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Thomas & Eleanor Wright',
        quote: 'We wanted to preserve the character of our historic home while making it comfortable for modern living. Arxen did an incredible job balancing preservation with modernization.',
        rating: 5
      },
      features: [
        'Restored original hardwood flooring',
        'Period-appropriate molding and trim',
        'Updated plumbing and electrical systems',
        'Modern kitchen with vintage aesthetic',
        'Energy-efficient windows that match original style',
        'Refinished original built-ins',
        'Historically accurate paint colors'
      ],
      challenges: [
        'Extensive water damage in certain areas',
        'Outdated electrical system needing complete replacement',
        'Balancing historical accuracy with modern comforts',
        'Structural issues in foundation'
      ],
      solutions: [
        'Specialist craftsmen to repair and match original woodwork',
        'Complete rewiring with period-appropriate fixtures',
        'Careful integration of modern amenities to preserve aesthetic',
        'Foundation repairs that preserved original structure'
      ]
    },
    {
      id: 'medical-office-design',
      title: 'Medical Office Build-Out',
      description: 'Complete build-out of a modern medical practice with specialized requirements for patient care and comfort.',
      category: 'Commercial',
      location: 'Dunwoody, GA',
      completionDate: 'October 2023',
      duration: '8 weeks',
      tags: ['Commercial', 'Medical', 'Healthcare'],
      beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1629136571575-e7e5c6ccd3a7?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1666214280117-458683dc2e1f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Dr. Samantha Reed',
        quote: 'Our new medical office exceeds all expectations. The workspace is efficient for our staff, and our patients constantly comment on the comfortable, calming environment.',
        rating: 5
      },
      features: [
        'Custom reception and waiting area',
        'Specialized exam room layouts',
        'HIPAA-compliant office design',
        'Medical-grade flooring and surfaces',
        'Advanced technology integration',
        'ADA-compliant facilities',
        'Specialized lighting for medical procedures'
      ],
      challenges: [
        'Complex medical equipment integration requirements',
        'Strict compliance with healthcare regulations',
        'Need for optimal patient flow while maintaining privacy',
        'Limited construction timeframe to minimize practice downtime'
      ],
      solutions: [
        'Collaborated with medical equipment specialists',
        'Designed with healthcare compliance experts',
        'Created intuitive layout for patient/staff efficiency',
        'Implemented phased construction plan to keep practice operational'
      ]
    },
    {
      id: 'luxury-bathroom-spa',
      title: 'Luxury Bathroom Spa Retreat',
      description: 'Transformation of a standard master bathroom into a luxurious spa-like sanctuary with premium amenities.',
      category: 'Bathroom',
      location: 'Brookhaven, GA',
      completionDate: 'November 2023',
      duration: '5 weeks',
      tags: ['Bathroom', 'Luxury', 'Spa'],
      beforeImage: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1645327473528-444764e19927?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Jennifer & Robert Thompson',
        quote: 'Our bathroom is now our favorite room in the house! The steam shower, freestanding tub, and heated floors make every day feel like a spa visit.',
        rating: 5
      },
      features: [
        'Walk-in steam shower with rainfall head',
        'Freestanding soaking tub',
        'Heated marble flooring',
        'Custom floating double vanity',
        'Smart mirror with integrated lighting',
        'Towel warming drawers',
        'Water-resistant entertainment system'
      ],
      challenges: [
        'Limited space requiring creative solutions',
        'Complex plumbing relocations needed',
        'Integration of multiple water features',
        'Need for proper ventilation with steam system'
      ],
      solutions: [
        'Custom-designed layout to maximize space efficiency',
        'Complete replumbing with upgraded systems',
        'Integrated water management system',
        'Advanced ventilation system with humidity controls'
      ]
    },
    {
      id: 'restaurant-renovation-bistro',
      title: 'French Bistro Restaurant Renovation',
      description: 'Complete renovation of a restaurant space into an authentic French bistro with open kitchen and custom bar.',
      category: 'Commercial',
      location: 'Midtown Atlanta, GA',
      completionDate: 'December 2023',
      duration: '10 weeks',
      tags: ['Commercial', 'Restaurant', 'Hospitality'],
      beforeImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555992457-b8fefdd46da2?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Chef André Laurent',
        quote: 'The renovation perfectly captures the authentic Parisian bistro atmosphere we wanted. The functional design of the kitchen and dining areas has dramatically improved our service efficiency and guest experience.',
        rating: 4.9
      },
      features: [
        'Custom open-concept kitchen design',
        'Authentic reclaimed wood bar',
        'Imported French tile flooring',
        'Commercial-grade kitchen equipment',
        'Custom banquette seating',
        'Specialized lighting for ambiance',
        'Sound-engineered acoustics for conversation'
      ],
      challenges: [
        'Strict health department codes for restaurant construction',
        'Need for kitchen efficiency while maintaining aesthetic',
        'Creating an authentic atmosphere with modern functionality',
        'Limited construction time to minimize revenue loss'
      ],
      solutions: [
        'Collaborated with health department throughout design',
        'Consulted with professional chefs on kitchen layout',
        'Sourced authentic materials that met commercial standards',
        'Implemented accelerated construction schedule with multiple crews'
      ]
    },
    {
      id: 'home-office-conversion',
      title: 'Executive Home Office Conversion',
      description: 'Conversion of an unused formal dining room into a high-end executive home office with custom built-ins.',
      category: 'Home Office',
      location: 'Decatur, GA',
      completionDate: 'January 2024',
      duration: '4 weeks',
      tags: ['Home Office', 'Built-ins', 'Remote Work'],
      beforeImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1593476550610-87baa860004a?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Daniel Washington',
        quote: 'My home office has completely transformed my remote work experience. The custom built-ins provide perfect organization, and the design makes me feel professional even when working from home.',
        rating: 5
      },
      features: [
        'Custom built-in desk and cabinetry',
        'Integrated cable management system',
        'Sound dampening construction',
        'Videoconference-optimized lighting',
        'Custom bookshelf wall with ladder',
        'Ergonomic work area design',
        'Hidden technology integration'
      ],
      challenges: [
        'Converting formal dining room while maintaining home value',
        'Extensive technology integration requirements',
        'Need for professional appearance for video meetings',
        'Balance of aesthetics and functionality'
      ],
      solutions: [
        'Designed with potential for reconversion if needed',
        'Created hidden infrastructure for all technology needs',
        'Installed professional-grade lighting and backgrounds',
        'Custom furniture design for specific work needs'
      ]
    },
    {
      id: 'whole-home-modernization',
      title: 'Whole Home Modernization',
      description: 'Complete modernization of a 1970s home with open concept living spaces, updated kitchen, and renovated bathrooms.',
      category: 'Whole Home',
      location: 'Johns Creek, GA',
      completionDate: 'February 2024',
      duration: '14 weeks',
      tags: ['Whole Home', 'Modernization', 'Open Concept'],
      beforeImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'The Henderson Family',
        quote: 'We love our transformed home! The open concept living has completely changed how we interact as a family, and the updated spaces feel both modern and timeless.',
        rating: 4.8
      },
      features: [
        'Open concept main living area',
        'Chef\'s kitchen with large island',
        'Luxury primary bathroom suite',
        'Modern interior finishes throughout',
        'Updated electrical and plumbing systems',
        'Energy-efficient windows and insulation',
        'Smart home technology integration'
      ],
      challenges: [
        'Working within existing footprint constraints',
        'Load-bearing wall removal for open concept',
        'Outdated systems requiring complete replacement',
        'Family living in home during portions of renovation'
      ],
      solutions: [
        'Creative space planning to maximize existing footprint',
        'Engineered beam solutions for structural support',
        'Complete systems upgrade with minimal disruption',
        'Phased construction approach to allow partial occupancy'
      ]
    },
    {
      id: 'backyard-pool-oasis',
      title: 'Backyard Pool & Landscaping Oasis',
      description: 'Creation of a resort-style backyard retreat with custom pool, outdoor living areas, and professional landscaping.',
      category: 'Outdoor',
      location: 'Milton, GA',
      completionDate: 'March 2024',
      duration: '12 weeks',
      tags: ['Outdoor', 'Pool', 'Landscaping'],
      beforeImage: 'https://images.unsplash.com/photo-1620820186187-fc38433df820?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1588012886079-62c77fa4ffcf?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1543489822-c49534f3271f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'James & Sarah Peterson',
        quote: 'Our backyard is now our personal resort! The pool and outdoor kitchen are perfect for entertaining, and the landscaping makes it feel like a tropical getaway.',
        rating: 5
      },
      features: [
        'Custom saltwater pool with spa',
        'Natural stone patio and walkways',
        'Outdoor kitchen and dining area',
        'Fire pit conversation area',
        'Professional landscape design',
        'LED landscape lighting',
        'Automated pool/landscape systems'
      ],
      challenges: [
        'Significant grading issues on property',
        'Complex pool engineering requirements',
        'Integration of multiple outdoor living zones',
        'Drainage concerns requiring solutions'
      ],
      solutions: [
        'Comprehensive grading and retaining wall plan',
        'Custom pool design with engineering consultation',
        'Thoughtful space planning for flow between areas',
        'Advanced drainage system throughout property'
      ]
    },
    {
      id: 'commercial-office-build',
      title: 'Modern Commercial Office Build-Out',
      description: 'Complete build-out of a contemporary open-concept office space designed for collaboration and productivity.',
      category: 'Commercial',
      location: 'Perimeter Center, GA',
      completionDate: 'April 2024',
      duration: '9 weeks',
      tags: ['Commercial', 'Office', 'Corporate'],
      beforeImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Victoria Chase, CEO',
        quote: 'The office renovation has completely transformed our workplace culture. The collaborative spaces have improved team communication, and the modern design impresses clients and helps with recruitment.',
        rating: 5
      },
      features: [
        'Open concept workspace design',
        'Multiple conference and meeting rooms',
        'Collaborative breakout areas',
        'Modern kitchen and break room',
        'Private phone booths and focus areas',
        'Integrated technology throughout',
        'Energy-efficient lighting and HVAC'
      ],
      challenges: [
        'Balancing open space and privacy needs',
        'Complex technology integration requirements',
        'Strict building code compliance in commercial space',
        'Tight timeline to minimize business disruption'
      ],
      solutions: [
        'Strategic space planning for optimal workflow',
        'Comprehensive technology infrastructure planning',
        'Proactive coordination with building management',
        'Accelerated construction schedule with multiple crews'
      ]
    },
    {
      id: 'smart-home-integration',
      title: 'Whole-Home Smart Technology Integration',
      description: 'Comprehensive smart home technology integration in an existing home, with centralized controls and automated systems.',
      category: 'Smart Home',
      location: 'Smyrna, GA',
      completionDate: 'May 2024',
      duration: '6 weeks',
      tags: ['Smart Home', 'Technology', 'Automation'],
      beforeImage: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1558002038-1055e2dfae49?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1557495235-340eb888a9fb?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593476550610-87baa860004a?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Michael & Lisa Conway',
        quote: 'The smart home technology has changed our daily lives in ways we never expected. From automated lighting to climate control and security, everything works seamlessly together.',
        rating: 4.9
      },
      features: [
        'Centralized home automation system',
        'Smart lighting throughout home',
        'Automated climate control zones',
        'Integrated security and camera system',
        'Whole-home audio and entertainment',
        'Smart appliance integration',
        'Voice and app control capabilities'
      ],
      challenges: [
        'Retrofitting technology in existing home',
        'Integration of multiple systems and platforms',
        'Maintaining aesthetics while adding technology',
        'Training homeowners on system usage'
      ],
      solutions: [
        'Minimally invasive installation techniques',
        'Uniform control system for all technology',
        'Discreet installation of all components',
        'Comprehensive training and documentation'
      ]
    },
    {
      id: 'wine-cellar-construction',
      title: 'Custom Wine Cellar Construction',
      description: 'Design and construction of a temperature-controlled wine cellar with custom storage solutions and tasting area in a residential basement.',
      category: 'Specialty',
      location: 'Buckhead, GA',
      completionDate: 'November 2024',
      duration: '6 weeks',
      tags: ['Specialty', 'Wine Cellar', 'Custom Storage'],
      beforeImage: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1560204887-1e980a743b9f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565793519616-e344cc472349?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Robert & Elaine Blackwell',
        quote: 'As wine enthusiasts, we always dreamed of having a proper cellar. ARXEN designed a space that is not only functional for our collection but also a stunning showcase area for entertaining guests. The temperature control is perfect and the craftsmanship is exceptional.',
        rating: 5
      },
      features: [
        'Climate-controlled environment system',
        'Custom redwood and metal racking',
        'Specialized LED lighting design',
        'Glass entrance door with security features',
        'Tasting table and seating area',
        'Stone accent wall and flooring',
        'Inventory management system integration'
      ],
      challenges: [
        'Precise temperature and humidity control requirements',
        'Limited space utilization needs',
        'Proper insulation for climate stability',
        'Integration with home automation system'
      ],
      solutions: [
        'Dedicated climate control system with redundancy',
        'Custom storage design maximizing bottle capacity',
        'Multi-layer insulation with vapor barriers',
        'Seamless smart home system integration'
      ]
    },
    {
      id: 'custom-closet-system',
      title: 'Luxury Walk-In Closet System',
      description: 'Design and installation of a custom luxury walk-in closet system with integrated lighting, specialized storage, and high-end finishes.',
      category: 'Specialty',
      location: 'Alpharetta, GA',
      completionDate: 'December 2024',
      duration: '4 weeks',
      tags: ['Specialty', 'Closet', 'Custom Storage'],
      beforeImage: 'https://images.unsplash.com/photo-1582037928769-181cf6ea7bbe?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1595520407873-4f7790e5db1d?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1617575402772-1a2827952a71?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615529361170-f26e5760dca6?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580484230039-dfe99206b02a?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Sophia Williams',
        quote: 'My custom closet is like a dream come true. Every detail was thoughtfully designed for my specific wardrobe needs, and the lighting makes everything so much easier to find. The craftsmanship is impeccable.',
        rating: 5
      },
      features: [
        'Custom cabinetry with soft-close drawers',
        'LED lighting system with motion sensors',
        'Specialized storage for shoes, jewelry, and accessories',
        'Center island with marble top',
        'Full-length mirrors with integrated lighting',
        'Custom bench seating area',
        'Smart organization system'
      ],
      challenges: [
        'Limited space requiring maximum storage efficiency',
        'Complex lighting integration requirements',
        'Need for humidity control for leather and delicate fabrics',
        'Structural support for heavy cabinetry'
      ],
      solutions: [
        'Custom measurements and 3D design for space optimization',
        'Layered lighting plan with specialized controls',
        'Integrated climate control solutions',
        'Reinforced mounting systems for stability'
      ]
    },
    {
      id: 'ada-accessible-renovation',
      title: 'ADA-Compliant Home Renovation',
      description: 'Comprehensive home renovation for accessibility, including widened doorways, zero-entry shower, kitchen modifications, and smart home features.',
      category: 'Accessibility',
      location: 'Decatur, GA',
      completionDate: 'January 2025',
      duration: '9 weeks',
      tags: ['Accessibility', 'ADA Compliant', 'Universal Design'],
      beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1564013434775-f71db0001f52?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Gerald & Diane Thompson',
        quote: 'After my accident, we needed to make our home accessible but wanted it to still feel like our home. ARXEN created solutions that are both functional and beautiful. I can now navigate my entire house independently.',
        rating: 5
      },
      features: [
        'Zero-threshold entryways and transitions',
        'Widened doorways and hallways',
        'Roll-under sinks and cooktop',
        'Curbless shower with built-in seating',
        'Smart home automation for lighting and doors',
        'Adjustable-height countertops',
        'Grab bars integrated into design elements'
      ],
      challenges: [
        'Retrofitting existing home for accessibility',
        'Creating accessible solutions that blend with home aesthetic',
        'Waterproofing for zero-entry shower',
        'Limited space for turning radiuses in certain areas'
      ],
      solutions: [
        'Structural modifications for wider openings',
        'Custom design elements that incorporate accessibility features',
        'Advanced waterproofing system with linear drain',
        'Strategic space planning to maximize maneuverability'
      ]
    },
    {
      id: 'home-theater-installation',
      title: 'Premium Home Theater Installation',
      description: 'Creation of a dedicated home theater room with professional-grade audio/visual equipment, custom seating, acoustic treatments, and theatrical lighting.',
      category: 'Entertainment',
      location: 'Sandy Springs, GA',
      completionDate: 'February 2025',
      duration: '6 weeks',
      tags: ['Entertainment', 'Home Theater', 'Media Room'],
      beforeImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1593078165899-c7d2ac0d6aea?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1626624338609-99776d01c19e?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593784989151-28e4c60c2ed8?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Marcus Johnson',
        quote: 'Our home theater exceeds what we expected. The sound quality is incredible, the picture is crystal clear, and the room design makes you feel like you are in a luxury cinema. Movie nights have become a major event in our home.',
        rating: 5
      },
      features: [
        '4K laser projector with 120-inch screen',
        'Dolby Atmos surround sound system',
        'Custom tiered seating with power recliners',
        'Acoustic wall treatments and soundproofing',
        'Programmable theatrical lighting',
        'Integrated control system',
        'Custom snack bar and beverage fridge'
      ],
      challenges: [
        'Sound isolation from rest of home',
        'Perfect acoustic environment creation',
        'Complex audio-visual equipment integration',
        'Proper screen placement and viewing angles'
      ],
      solutions: [
        'Double-wall construction with acoustic isolation',
        'Custom acoustic panel placement and bass traps',
        'Professional calibration of all AV components',
        'Precise room measurements for optimal viewing experience'
      ]
    },
    {
      id: 'garage-workshop-conversion',
      title: 'Garage Workshop Conversion',
      description: 'Transformation of a standard two-car garage into a professional-grade woodworking and metalworking workshop with specialized equipment, storage, and safety features.',
      category: 'Specialty',
      location: 'Marietta, GA',
      completionDate: 'March 2025',
      duration: '5 weeks',
      tags: ['Specialty', 'Workshop', 'Garage Conversion'],
      beforeImage: 'https://images.unsplash.com/photo-1558424087-896a994a0291?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1621189989909-ebd1f732a407?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1520642413789-218e193018e7?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581166395728-afceff1bc3bd?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Chris Anderson',
        quote: 'As an avid woodworker, having a dedicated workshop has been life-changing. The team at ARXEN understood exactly what I needed - from the tool organization to the dust collection system. Everything was thoughtfully planned for workflow efficiency and safety.',
        rating: 4.9
      },
      features: [
        'Epoxy-coated concrete flooring',
        'Custom workbenches and tool storage',
        'Centralized dust collection system',
        'Enhanced electrical system with 220V circuits',
        'Specialized lighting for detailed work',
        'Insulation and climate control',
        'Soundproofing for noise reduction'
      ],
      challenges: [
        'Ventilation requirements for dust and fumes',
        'Heavy equipment power requirements',
        'Durable surfaces needed for workshop activities',
        'Sound containment for residential neighborhood'
      ],
      solutions: [
        'Professional-grade air filtration system',
        'Dedicated subpanel with multiple specialized circuits',
        'Impact and chemical-resistant surface treatments',
        'Multi-layer sound dampening construction'
      ]
    },
    {
      id: 'children-themed-bedroom',
      title: 'Enchanted Forest Children\'s Bedroom',
      description: 'Creation of a magical children\'s bedroom with custom theme elements, built-in play areas, specialized storage, and interactive features.',
      category: 'Specialty',
      location: 'Johns Creek, GA',
      completionDate: 'April 2025',
      duration: '4 weeks',
      tags: ['Specialty', 'Children\'s Room', 'Custom Theme'],
      beforeImage: 'https://images.unsplash.com/photo-1536349788264-1b816db3cc13?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1533133379453-194992ba975c?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1542889601-399c4f3a8402?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517557837708-9fc78686e908?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Emma & Paul Richards',
        quote: 'Our daughter absolutely loves her enchanted forest bedroom. The team incorporated creative elements we never would have thought of, while keeping everything safe and practical. The hidden reading nook is her favorite spot!',
        rating: 5
      },
      features: [
        'Hand-painted forest mural wall',
        'Custom treehouse bed with integrated storage',
        'Secret reading nook with LED star ceiling',
        'Built-in desk and craft area',
        'Specialized toy organization system',
        'Soft flooring with interactive elements',
        'Child-safe materials throughout'
      ],
      challenges: [
        'Creating whimsical elements while maintaining functionality',
        'Ensuring all features are child-safe',
        'Designing for both current age and future growth',
        'Incorporating storage without compromising theme'
      ],
      solutions: [
        'Balance of fantasy elements with practical features',
        'Rigorous safety testing of all custom elements',
        'Modular design for adaptability as child grows',
        'Creative storage solutions integrated into theme'
      ]
    },
    {
      id: 'hotel-lobby-renovation',
      title: 'Boutique Hotel Lobby Renovation',
      description: 'Complete renovation of a boutique hotel lobby and common areas with custom furnishings and luxury finishes.',
      category: 'Commercial',
      location: 'Downtown Atlanta, GA',
      completionDate: 'June 2024',
      duration: '8 weeks',
      tags: ['Commercial', 'Hospitality', 'Hotel'],
      beforeImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      afterImage: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1622866306950-81d17097d458?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1445991842772-097fea258e7b?auto=format&fit=crop&q=80'
      ],
      testimonial: {
        name: 'Jonathan Price, Hotel Manager',
        quote: 'The renovation has completely transformed our guest experience from the moment they walk in. Our satisfaction ratings have increased dramatically, and the space is now a true reflection of our brand.',
        rating: 5
      },
      features: [
        'Custom reception desk and check-in area',
        'Luxury lounge and waiting areas',
        'Designer lighting installation',
        'Premium flooring and wall finishes',
        'Integrated technology for guests',
        'Custom millwork and architectural details',
        'Bespoke furniture throughout lobby'
      ],
      challenges: [
        'Renovating while hotel remained operational',
        'Creating luxury atmosphere within budget',
        'Balancing aesthetics with durability for high traffic',
        'Tight construction schedule requirements'
      ],
      solutions: [
        'Phased construction with minimal guest impact',
        'Strategic material selection for value engineering',
        'Specified commercial-grade finishes with luxury appearance',
        'Multiple crews working extended hours'
      ]
    }
  ];

  // Combine all projects
  const allProjects = [...transformationProjects, ...additionalProjects];

  // Filter projects by category
  const filteredProjects = currentCategory === 'all'
    ? allProjects
    : allProjects.filter(project => project.category.toLowerCase() === currentCategory.toLowerCase());

  // Unique categories for filter
  const categories = ['all', ...new Set(allProjects.map(project => project.category.toLowerCase()))];
  
  // Check if the URL includes a specific project path (moved here after arrays are defined)
  useEffect(() => {
    if (projectId) {
      // Find the project from all projects based on the ID in URL
      const selectedProjectFound = allProjects.find(p => p.id === projectId);
      
      if (selectedProjectFound) {
        setSelectedProject(selectedProjectFound);
      }
    }
  }, [location.pathname, projectId, allProjects]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {selectedProject ? (
        // Detailed project view
        <div className="pb-16">
          {/* Project Header with Before/After */}
          <div className="relative bg-blue-900 text-white">
            <div className="relative h-[60vh] overflow-hidden">
              {/* Before/After Toggle */}
              <div className="absolute inset-0 transition-opacity duration-700 opacity-0 hover:opacity-100 z-10 cursor-pointer">
                <img
                  src={selectedProject.beforeImage}
                  alt={`Before: ${selectedProject.title}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <span className="text-white font-bold inline-block bg-black/60 px-3 py-1 rounded-full text-sm">BEFORE</span>
                </div>
              </div>
              
              <img
                src={selectedProject.afterImage}
                alt={`After: ${selectedProject.title}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="text-white font-bold inline-block bg-blue-600 px-3 py-1 rounded-full text-sm">AFTER</span>
                <span className="text-white text-sm ml-3">(Hover to see before)</span>
              </div>
            </div>
            
            <div className="container mx-auto px-4 py-6 relative z-20">
              <button 
                onClick={() => {
                  setSelectedProject(null);
                  navigate('/portfolio');
                }}
                className="flex items-center text-blue-200 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to All Projects
              </button>
              <h1 className="text-4xl font-bold">{selectedProject.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-2">
                {selectedProject.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-800/50 text-blue-100 text-xs font-semibold px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-300 mr-2" />
                  <span>{selectedProject.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-300 mr-2" />
                  <span>Completed: {selectedProject.completionDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-300 mr-2" />
                  <span>Duration: {selectedProject.duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Project Overview</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </section>
                
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Features</h2>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                
                {selectedProject.challenges && (
                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Challenges & Solutions</h2>
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-2">Challenges:</h3>
                      <ul className="space-y-2 mb-6">
                        {selectedProject.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-700">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="font-bold text-gray-800 mb-2">Our Solutions:</h3>
                      <ul className="space-y-2">
                        {selectedProject.solutions?.map((solution, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}
                
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.additionalImages.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden group h-60">
                        <img
                          src={image}
                          alt={`${selectedProject.title} - Gallery Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                            <Camera className="w-6 h-6 text-blue-900" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  {selectedProject.testimonial && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Client Testimonial</h3>
                      <div className="bg-blue-50 p-5 rounded-lg relative">
                        <div className="text-blue-900 opacity-20 absolute top-3 left-3">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 italic mb-4 pl-8">"{selectedProject.testimonial.quote}"</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{selectedProject.testimonial.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(selectedProject.testimonial?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : i < (selectedProject.testimonial?.rating || 0) ? 'fill-yellow-400 text-yellow-400 fill-half' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Request Similar Project</h3>
                    <p className="text-gray-600 mb-4">Interested in a transformation like this for your space?</p>
                    <Link 
                      to={`/free-estimate?projectType=${selectedProject.category.toLowerCase() === 'commercial' ? 'commercial' : 'residential'}&initialService=${selectedProject.id}`}
                      state={{ 
                        projectDetails: {
                          description: `I'm interested in a project similar to the "${selectedProject.title}" project I viewed in your portfolio.\n\nProject Features I'd Like:\n${selectedProject.features.map(feature => `• ${feature}`).join('\n')}\n\nLocation: ${selectedProject.location}\nEstimated Timeline: Similar to original (${selectedProject.duration})\n\nI would like to discuss creating something similar for my own space.`,
                          scope: selectedProject.category.toLowerCase() === 'commercial' ? 'large' : 'medium',
                          urgency: 'standard',
                          referenceProject: selectedProject.id
                        },
                        projectCategory: selectedProject.category,
                        services: selectedProject.category.toLowerCase() === 'commercial' 
                          ? ['commercial-build-out', 'office-renovation'].filter(s => selectedProject.tags.some(tag => tag.toLowerCase().includes(s.replace('-', ' '))))
                          : selectedProject.tags.slice(0, 2).map(tag => tag.toLowerCase().replace(/\s+/g, '-'))
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full transition-colors flex justify-center items-center"
                    >
                      Get a Free Estimate
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Project Type:</span>
                        <span className="font-medium text-gray-800">{selectedProject.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-800">{selectedProject.duration}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-800">{selectedProject.location}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Completion Date:</span>
                        <span className="font-medium text-gray-800">{selectedProject.completionDate}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">More Projects You Might Like</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {allProjects
                  .filter(p => p.id !== selectedProject.id)
                  .slice(0, 3)
                  .map((project, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
                        navigate(`/portfolio/${project.id}`);
                      }}
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img 
                          src={project.afterImage} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <span className="text-white font-bold text-sm">{project.category}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">{project.location}</span>
                          <button className="text-blue-600 group-hover:text-blue-800 transition-colors flex items-center text-sm font-medium">
                            View Details
                            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Portfolio grid view
        <div>
          {/* Portfolio Header */}
          <div className="bg-blue-900 text-white py-16 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
              <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-white"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full border-4 border-white"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <h1 className="text-5xl font-bold mb-4">Our Portfolio</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Browse our collection of successful transformations and projects. 
                See how we've helped our clients turn their vision into reality with quality craftsmanship and attention to detail.
              </p>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-12">
            {/* Filter Controls */}
            <div className="mb-10 flex flex-wrap justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                Explore Our Projects
              </h2>
              
              <div className="relative">
                <button 
                  className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                >
                  <Filter className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700 font-medium">
                    Filter: {currentCategory === 'all' ? 'All Categories' : currentCategory}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 ml-2 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 border border-gray-200 py-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${currentCategory === category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                        onClick={() => {
                          setCurrentCategory(category);
                          setIsFilterMenuOpen(false);
                        }}
                      >
                        {category === 'all' ? 'All Categories' : category}
                        {currentCategory === category && (
                          <Check className="w-4 h-4 inline ml-2 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Project Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => {
                    setSelectedProject(project);
                    navigate(`/portfolio/${project.id}`);
                  }}
                >
                  <div className="relative h-72 overflow-hidden">
                    {/* Before/After Slide Effect */}
                    <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:translate-x-full">
                      <img 
                        src={project.beforeImage} 
                        alt={`Before: ${project.title}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <span className="text-white font-bold inline-block bg-black/60 px-2 py-0.5 rounded-full text-xs">BEFORE</span>
                      </div>
                    </div>
                    
                    <img 
                      src={project.afterImage} 
                      alt={`After: ${project.title}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white font-bold inline-block bg-blue-600 px-2 py-0.5 rounded-full text-xs">AFTER</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-gray-500 text-xs">+{project.tags.length - 2} more</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-gray-500 text-sm flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {project.location}
                      </span>
                      
                      <span className="text-blue-600 group-hover:text-blue-800 transition-colors flex items-center text-sm font-medium">
                        View Details
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Section */}
            <div className="mt-16 bg-blue-900 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-2/3 mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Transform Your Space?</h2>
                  <p className="text-blue-100 mb-4">
                    Our award-winning team has completed over 2,500 successful projects across Georgia. Let's bring your vision to life.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/free-estimate"
                      className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                    >
                      Get a Free Estimate
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/contact"
                      className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 border border-blue-700"
                    >
                      Contact Us
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/3 grid grid-cols-2 gap-4">
                  <div className="bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold mb-1">2,500+</div>
                    <div className="text-blue-200 text-sm">Completed Projects</div>
                  </div>
                  <div className="bg-blue-800/50 backdrop-blur-sm p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold mb-1">98%</div>
                    <div className="text-blue-200 text-sm">Satisfied Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio; 