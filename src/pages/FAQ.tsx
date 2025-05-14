import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, PlusCircle, MinusCircle, HelpCircle, Home, BookOpen, Calendar, DollarSign, ShieldCheck, Star, MessageSquare, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HighlightedText {
  text: string;
  isHighlighted: boolean;
}

interface FeedbackState {
  [key: number]: 'helpful' | 'not-helpful' | null;
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<{[key: number]: boolean}>({});

  const toggleItem = (index: number) => {
    setOpenItems(prevOpenItems => 
      prevOpenItems.includes(index)
        ? prevOpenItems.filter(item => item !== index)
        : [...prevOpenItems, index]
    );
  };

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Clear the previous timeout
    const timeout = setTimeout(() => {
      setDebouncedQuery(e.target.value);
    }, 300);
    
    return () => clearTimeout(timeout);
  };

  // Highlight matching text in questions and answers
  const highlightText = (text: string): HighlightedText[] => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [{ text, isHighlighted: false }];
    
    const parts = text.split(new RegExp(`(${debouncedQuery})`, 'gi'));
    
    return parts.map(part => ({
      text: part,
      isHighlighted: part.toLowerCase() === debouncedQuery.toLowerCase()
    }));
  };

  // Get popular FAQs (first two from each category)
  const getPopularFAQs = () => {
    const popularByCategory: Record<string, FAQItem[]> = {};
    
    // Get first 2 items from each category
    faqItems.forEach(item => {
      if (!popularByCategory[item.category]) {
        popularByCategory[item.category] = [];
      }
      
      if (popularByCategory[item.category].length < 2) {
        popularByCategory[item.category].push(item);
      }
    });
    
    // Flatten the results
    return Object.values(popularByCategory).flat().slice(0, showAllPopular ? 10 : 5);
  };

  // Get related questions based on current question
  const getRelatedQuestions = (currentItem: FAQItem, currentIndex: number): FAQItem[] => {
    // Get same category items excluding current question
    return faqItems
      .filter(item => item.category === currentItem.category && item !== currentItem)
      .slice(0, 3); // Limit to 3 related questions
  };

  const faqItems: FAQItem[] = [
    // General Questions
    {
      question: "How long has Arxen Construction been in business?",
      answer: "Arxen Construction was founded in 2005 and has over 18 years of experience in the construction and remodeling industry, serving both residential and commercial clients.",
      category: "general"
    },
    {
      question: "What areas do you service?",
      answer: "We primarily serve the greater Atlanta metropolitan area, including Marietta, Kennesaw, Smyrna, Alpharetta, Roswell and surrounding communities within a 90-mile radius of our Marietta headquarters.",
      category: "general"
    },
    {
      question: "Are you licensed and insured?",
      answer: "Yes, Arxen Construction is fully licensed and insured. We maintain comprehensive general liability insurance, workers' compensation, and all necessary licenses required by state and local regulations.",
      category: "general"
    },
    {
      question: "Do you offer free estimates?",
      answer: "Yes! We offer free, no-obligation estimates for all potential projects. You can request a free estimate through our website or by calling our office directly.",
      category: "general"
    },
    {
      question: "How do you handle project scheduling?",
      answer: "We utilize a detailed scheduling system that outlines each phase of your project. After contract signing, we'll provide you with a comprehensive timeline showing start date, major milestones, and estimated completion. Our project managers update this schedule weekly and communicate any changes promptly.",
      category: "general"
    },
    {
      question: "What happens if I want to make changes during my project?",
      answer: "We understand that changes sometimes become necessary or desired during construction. All change requests are documented in a formal change order that details the modifications, associated costs, and any timeline impacts. No changes proceed without your written approval.",
      category: "general"
    },
    {
      question: "Which projects typically require permits, and how do you handle the permit process?",
      answer: "Most structural changes, electrical work, plumbing modifications, HVAC installations, and additions require permits. As part of our service, we handle all permitting processes including application preparation, submission, fee payment, and coordination with inspectors to ensure your project is fully compliant with local regulations.",
      category: "general"
    },
    {
      question: "How will you communicate with me during my project?",
      answer: "Communication is essential to our process. You'll be assigned a dedicated project manager who will be your main point of contact. We provide weekly progress updates, respond to questions within 24 hours, and use a client portal where you can view project photos, schedules, and important documents.",
      category: "general"
    },
    {
      question: "What sets Arxen Construction apart from other contractors?",
      answer: "What distinguishes us is our comprehensive approach combining technical excellence with outstanding customer service. We employ only the most skilled craftspeople, use premium materials, maintain transparent communication, and have a proven track record of 18+ years with over 2,500 successful projects. Our 98% client satisfaction rate and extensive warranty coverage further demonstrate our commitment to excellence.",
      category: "general"
    },
    {
      question: "What certifications do your team members have?",
      answer: "Our team members hold a variety of professional certifications, including general contractor licenses, OSHA safety certifications, EPA Lead-Safe certifications, specialty trade licenses (electrical, plumbing, HVAC), certified remodeler designations from NARI, certified green professional credentials, and specific manufacturer certifications for premium products we install. All team members also undergo continuous education to stay current with building codes, new technologies, and best practices.",
      category: "general"
    },
    {
      question: "How do you ensure quality control throughout my project?",
      answer: "We maintain rigorous quality control through multiple inspection checkpoints, including pre-construction assessment, rough-in inspections before closing walls, project manager daily walkthroughs, specialized trade quality checks, third-party inspections where applicable, and pre-final comprehensive quality audits. Our standardized quality checklists exceed industry standards, and we document our inspections with photos that become part of your project record. This multi-layered approach ensures consistent excellence in our work.",
      category: "general"
    },
    {
      question: "What happens if I'm not satisfied with some aspect of the work?",
      answer: "If you're ever not completely satisfied with any aspect of our work, we follow a simple resolution process: First, document your concerns specifically. Our project manager will meet with you within 48 hours to understand the issue, then develop a corrective action plan with a timeline for completion. We'll implement the necessary fixes at no additional cost until you're completely satisfied, as your approval is the final measure of our project success. This commitment is part of our satisfaction guarantee.",
      category: "general"
    },
    {
      question: "How do you handle unexpected issues discovered during construction?",
      answer: "When unexpected issues arise (like hidden water damage or structural problems), we follow a clear protocol: work stops in the affected area, we document the issue with photos, our experts assess the situation, and we present you with a detailed report including recommended solutions, cost implications, and schedule impacts. No additional work proceeds without your approval. We maintain a contingency recommendation of 10-15% in initial budgets specifically to address these possibilities while minimizing disruption.",
      category: "general"
    },
    {
      question: "Can you provide references from previous clients?",
      answer: "Absolutely! We're proud of our work and happy to provide references from past clients with projects similar to yours. We maintain an extensive reference list organized by project type, scope, and location. Just let us know what type of project you're planning, and we'll connect you with homeowners who can share their firsthand experience working with us. Additionally, we encourage you to check our online reviews, visit our portfolio page, and view our case studies for further validation of our quality and service.",
      category: "general"
    },
    {
      question: "What precautions do you take for safety on the job site?",
      answer: "Safety is paramount at every Arxen job site. Our comprehensive safety program includes OSHA-compliant protocols, regular safety training for all personnel, daily safety briefings before work begins, proper personal protective equipment requirements, clearly marked hazard areas, secured job sites with limited access, fire prevention measures, emergency response procedures, regular safety inspections, and careful hazardous material handling. We also maintain detailed documentation of all safety measures and immediately address any concerns.",
      category: "general"
    },
    {
      question: "Do you offer emergency construction services?",
      answer: "Yes, we provide emergency construction services for urgent situations like water damage, fire damage, structural failures, or storm damage. Our emergency response team is available 24/7 and can typically be on-site within 2-4 hours of your call. We work with insurance companies, implement immediate mitigation measures to prevent further damage, secure the property, and then develop a comprehensive restoration plan. For existing clients, we offer priority emergency scheduling.",
      category: "general"
    },
    {
      question: "How do you handle material selections and purchases?",
      answer: "Our material selection process is designed to be both efficient and enjoyable. We start with understanding your style preferences and budget parameters, then provide curated options that meet our quality standards. You'll work with our design team to make selections, with access to our showroom and vendor partners. We handle all ordering, quality checking upon delivery, proper storage, and installation coordination. For client-purchased items, we provide specifications and review selections before installation to ensure compatibility.",
      category: "general"
    },
    {
      question: "What measures do you take to protect my property during construction?",
      answer: "We implement comprehensive property protection measures including: protective floor coverings in work and traffic areas, dust containment systems with negative air pressure where needed, furniture and fixture protection or relocation, HVAC vent sealing to prevent dust circulation, daily cleaning protocols, secure lockup procedures, exterior landscape protection, temporary weather protection when necessary, and specialized protection for valuable items. Our team is trained in proper protection techniques, and we inspect these measures daily.",
      category: "general"
    },
    {
      question: "How do you determine the cost of a project?",
      answer: "Our detailed estimating process considers multiple factors: complete scope of work and specifications, material quantities and quality grades, labor requirements based on complexity, specialty trade contractor costs, permit and inspection fees, project management overhead, site-specific conditions affecting work efficiency, waste removal and cleanup costs, and appropriate contingency reserves. We provide transparent, line-item estimates so you understand exactly what you're paying for, and all costs are finalized before contract signing to avoid surprises.",
      category: "general"
    },
    
    // Residential Services
    {
      question: "What types of residential projects do you handle?",
      answer: "We handle a wide range of residential projects including kitchen remodels, bathroom renovations, basement finishing, whole home renovations, custom cabinetry, flooring installation, and more.",
      category: "residential"
    },
    {
      question: "How long does a typical kitchen remodel take?",
      answer: "A typical kitchen remodel takes between 6-12 weeks depending on the scope of work, materials selected, and any unforeseen issues. We provide a detailed timeline during our consultation process.",
      category: "residential"
    },
    {
      question: "Do I need to move out during a renovation?",
      answer: "It depends on the scope of your project. For whole home renovations, moving out is often recommended. For single room renovations, many clients choose to stay. We'll discuss logistics and create a plan that minimizes disruption to your daily life.",
      category: "residential"
    },
    {
      question: "Can you help with design services for my remodel?",
      answer: "Absolutely! We offer comprehensive design services to help bring your vision to life. Our in-house design team can create 3D renderings, select materials, and ensure your space is both beautiful and functional.",
      category: "residential"
    },
    {
      question: "Will my home remain livable during renovations?",
      answer: "For most projects, yes. We implement several measures to ensure your comfort, including dust containment systems, designated work zones, daily cleanup procedures, and temporary facilities when necessary. For kitchen renovations, we can set up a temporary kitchen area. For bathroom projects, we ensure you'll have at least one functional bathroom at all times or make appropriate arrangements.",
      category: "residential"
    },
    {
      question: "What's the typical return on investment (ROI) for home renovation projects?",
      answer: "ROI varies by project type and your local market. Kitchen remodels typically return 60-80% of their cost, bathroom renovations about 60-70%, and additions around 50-65%. However, many of our projects in the Atlanta area achieve higher returns. Beyond financial returns, renovations provide immediate lifestyle benefits and improved home functionality that many clients find equally valuable.",
      category: "residential"
    },
    {
      question: "Do you offer green or sustainable building options for residential projects?",
      answer: "Yes, we proudly offer numerous sustainable options. These include Energy Star appliances, LED lighting, high-efficiency HVAC systems, sustainable flooring (such as bamboo or cork), low-VOC paints and finishes, smart home technology for energy management, water-conserving fixtures, and proper insulation solutions. During our consultation, we can discuss which eco-friendly options would work best for your specific project.",
      category: "residential"
    },
    {
      question: "Are there certain times of year that are better for specific home projects?",
      answer: "While we work year-round, certain projects benefit from specific timing. Interior renovations can be done any time, but exterior work like roofing, siding, and outdoor living spaces are typically best scheduled during spring through fall. We recommend planning kitchen renovations away from major holidays, and pool installations are best started in fall/winter to be ready for summer. For the best scheduling options, we recommend booking 2-3 months in advance.",
      category: "residential"
    },
    {
      question: "How does the material selection process work?",
      answer: "Our material selection process is guided and streamlined. After initial design approval, you'll work with our design team to select finishes. We provide access to our showroom, curated material options based on your style and budget, sample boards, and 3D renderings to visualize choices. We establish selection deadlines to prevent project delays and offer professional guidance throughout to ensure cohesive, quality results that match your vision.",
      category: "residential"
    },
    {
      question: "Can you work with my architect or designer?",
      answer: "Absolutely! We regularly collaborate with external architects and designers, and have established smooth workflows for these partnerships. We can join the process at any stage—whether you already have complete plans or are just starting with a design professional. Our team coordinates closely with your design partners, providing construction expertise, budget guidance, and practical insights while respecting their creative vision and your relationship with them. This collaborative approach ensures both design excellence and construction quality.",
      category: "residential"
    },
    {
      question: "Do you offer historic home renovation services?",
      answer: "Yes, we specialize in historic home renovations with a dedicated team trained in preservation techniques. We understand the unique challenges of historical properties—from structural issues to matching period-appropriate materials. Our process includes careful documentation of original features, research on historically accurate methods and materials, collaboration with preservation specialists when needed, and balancing modern functionality with historical integrity. We're experienced with historic district requirements and can help navigate any special permitting or approval processes.",
      category: "residential"
    },
    {
      question: "How do you handle pets and children safety during home renovations?",
      answer: "We implement specific safety measures for homes with pets and children: secured work zones with safety barriers, daily tool and material cleanup, hazardous substance containment, dust management systems, clearly marked safe paths through the home, daily safety inspections, and job site lockdown procedures when work isn't in progress. We also suggest establishing dedicated 'construction-free zones' where your family can maintain normal routines, and we schedule particularly disruptive work around your family's needs whenever possible.",
      category: "residential"
    },
    {
      question: "What options do you offer for aging-in-place or accessibility modifications?",
      answer: "We provide comprehensive accessibility solutions including: zero-step entries, widened doorways and hallways, accessible bathroom designs with roll-in showers and grab bars, kitchen modifications with varied counter heights and pull-out storage, elevator or lift installations, smart home technology integration, improved lighting systems, slip-resistant flooring, and exterior ramp designs that complement your home's architecture. Our team includes Certified Aging-in-Place Specialists (CAPS) who understand both the technical requirements and aesthetic considerations for these modifications.",
      category: "residential"
    },
    {
      question: "Can I stay in my home during a major renovation?",
      answer: "Whether you can stay home during major renovations depends on several factors: the project's scope, which areas are being renovated, your tolerance for construction activity, presence of children or pets, air quality concerns, and access to essential facilities. For whole-home renovations or projects involving extensive demolition, moving out is typically recommended. For projects affecting only certain areas, we can often create containment systems and phasing plans that allow you to remain in the home. We'll discuss your specific situation during planning to help you make the best decision.",
      category: "residential"
    },
    {
      question: "What's involved in a home addition project?",
      answer: "Home additions involve several key phases: architectural design and engineering, permitting (which is more extensive than interior renovations), site preparation and foundation work, framing the new structure, connecting to existing systems (electrical, plumbing, HVAC), exterior finishing (roofing, siding, windows), interior finishing, and final integration with the existing home. The process typically takes 3-6 months depending on size and complexity. We handle everything from soil testing and structural engineering to seamless matching of existing architectural elements.",
      category: "residential"
    },
    {
      question: "How disruptive will the renovation be to my daily life?",
      answer: "Renovations do create some unavoidable disruption, but we minimize impact through careful planning: containing work areas with dust barriers, establishing clear work hours (typically 8am-5pm weekdays), communicating the schedule of particularly noisy or disruptive activities, maintaining functional pathways through your home, protecting non-work areas, setting up temporary facilities when necessary (like cooking stations during kitchen renovations), and performing thorough daily cleanup. We'll develop a specific disruption mitigation plan tailored to your family's needs and routines.",
      category: "residential"
    },
    {
      question: "What's the difference between a renovation and a remodel?",
      answer: "While often used interchangeably, these terms have distinct meanings in construction. Renovation refers to restoring or updating a space within its existing footprint and structure—like replacing fixtures, finishes, and systems without changing the fundamental layout. Remodeling involves changing the structure, layout, or function of a space—such as removing walls, adding square footage, or converting a bedroom to a bathroom. Remodels typically require more extensive permitting, often involve structural work, and are usually more complex and costly than renovations.",
      category: "residential"
    },
    {
      question: "How do you handle delays due to material shortages or backorders?",
      answer: "We take a proactive approach to potential material delays: identifying long-lead items early in the planning process, ordering critical materials as soon as the contract is signed, maintaining relationships with multiple suppliers to source alternatives when needed, suggesting readily available alternatives when appropriate, and building reasonable buffer time into the schedule. If delays still occur, we adjust the construction sequence when possible to work on other areas while awaiting materials. Throughout any delay, we maintain transparent communication and provide weekly status updates on orders.",
      category: "residential"
    },
    {
      question: "Can you incorporate smart home technology into my renovation?",
      answer: "Absolutely! We specialize in smart home integration during renovations. Our services include centralized automation systems, integrated lighting controls, smart thermostats and HVAC zoning, whole-home audio/visual systems, automated window treatments, video doorbells and security systems, voice-controlled fixtures and appliances, and proper infrastructure (wiring and network capabilities) for future technology additions. Our technology specialists coordinate directly with our construction team to ensure proper installation and testing, creating a seamless, user-friendly system that enhances your lifestyle.",
      category: "residential"
    },
    
    // Commercial Services
    {
      question: "What types of commercial projects do you handle?",
      answer: "We handle various commercial projects including office renovations, retail fit-outs, restaurant remodels, healthcare facility upgrades, and industrial modifications to meet our clients' specific needs.",
      category: "commercial"
    },
    {
      question: "Do you work with businesses that need to remain operational during construction?",
      answer: "Yes, we have extensive experience working in occupied buildings. We can develop phased construction plans, implement dust/noise containment measures, and schedule work during off-hours to minimize disruption to your operations.",
      category: "commercial"
    },
    {
      question: "Can you help with ADA compliance upgrades?",
      answer: "Yes, we specialize in ADA compliance upgrades for commercial properties. Our team is knowledgeable about accessibility requirements and can help bring your facility into compliance while maintaining aesthetics.",
      category: "commercial"
    },
    {
      question: "How do you minimize business interruption during commercial renovations?",
      answer: "We employ several strategies to minimize disruptions: phased construction scheduling, after-hours and weekend work when necessary, strategic temporary partitions and dust containment, noise management protocols, clear communication about disruptive activities in advance, maintaining access paths and emergency exits, and coordinating critical utility work during off-peak business hours. Our project managers work closely with your team to develop a plan that allows your business to function effectively throughout construction.",
      category: "commercial"
    },
    {
      question: "What's involved in the permitting process for commercial renovations?",
      answer: "Commercial permitting is typically more complex than residential. Our process includes zoning verification, building code compliance review, submittal of architectural/engineering drawings, coordination with specialized consultants (mechanical, electrical, plumbing, structural), fire marshal reviews, health department approvals for food service facilities, planning department reviews, and ADA compliance verification. Our team handles this entire process, including responding to any plan review comments, to ensure smooth approval.",
      category: "commercial"
    },
    {
      question: "Do you offer industry-specific solutions for different business types?",
      answer: "Yes, we have specialized expertise for various commercial sectors including retail (optimized floor plans, display systems, customer flow), restaurants (commercial kitchens, dining spaces, health department requirements), healthcare facilities (HIPAA-compliant spaces, patient comfort features, specialized equipment integration), offices (collaborative workspaces, acoustic management, technology integration), and industrial facilities (workflow optimization, safety features, equipment installation). We understand that each industry has unique requirements and regulations.",
      category: "commercial"
    },
    {
      question: "How do you address safety standards and compliance in commercial projects?",
      answer: "Safety and compliance are paramount in our commercial work. We maintain comprehensive knowledge of applicable building codes, OSHA safety standards, fire code requirements, accessibility standards (ADA), and industry-specific regulations. Our project managers conduct regular safety inspections, coordinate all required official inspections, ensure proper documentation, and provide safety training for our workers specific to each project environment. All our commercial projects include appropriate fire safety, emergency egress, and structural integrity measures.",
      category: "commercial"
    },
    {
      question: "Can you integrate advanced technology systems in our commercial space?",
      answer: "Absolutely. We offer comprehensive technology integration services including structured cabling systems, audio-visual installations, security and access control systems, smart building automation, energy management systems, wireless network infrastructure, video conferencing solutions, and digital signage. Our technology integration team works alongside our construction crews to ensure proper infrastructure and seamless implementation that supports your business operations.",
      category: "commercial"
    },
    {
      question: "How do you handle commercial projects in occupied buildings or active businesses?",
      answer: "Working in occupied commercial spaces requires specialized planning and execution. Our approach includes: detailed phasing plans to maintain business operations, after-hours and weekend work scheduling for disruptive activities, temporary partition systems with dust and sound containment, maintaining clear emergency exits and ADA-compliant pathways, coordinating with building management on utilities and access, daily cleaning protocols, clear communication with staff and customers about construction activities, and dedicated project liaisons who coordinate directly with your operations team to minimize business disruption.",
      category: "commercial"
    },
    {
      question: "What experience do you have with tenant improvement projects?",
      answer: "We have extensive experience with tenant improvements across various commercial sectors. Our expertise includes: white box buildouts, retail store fit-outs, office space reconfigurations, restaurant and food service construction, medical office specializations, and industrial facility modifications. We understand the unique requirements of working within lease agreements, coordinating with building owners and property managers, navigating building rules and restrictions, and executing projects according to landlord specifications while meeting tenant needs and deadlines.",
      category: "commercial"
    },
    {
      question: "Can you help with value engineering to reduce project costs?",
      answer: "Yes, we offer comprehensive value engineering services to optimize your commercial project budget without compromising functionality or essential quality. Our approach includes: analyzing proposed specifications for cost-efficiency, suggesting alternative materials with similar performance but lower costs, identifying areas where standard vs. custom solutions provide better value, evaluating construction methods for efficiency, reconfiguring designs to reduce square footage requirements, phasing projects to align with cash flow, and providing transparent cost-benefit analysis for all recommendations.",
      category: "commercial"
    },
    {
      question: "What types of commercial clients do you typically work with?",
      answer: "We serve a diverse commercial client base including: retail businesses (from boutiques to large stores), professional offices (medical, legal, financial, tech), food service establishments (restaurants, cafes, commercial kitchens), hospitality venues (hotels, event spaces), healthcare facilities (medical offices, clinics, specialty practices), educational institutions, industrial spaces (warehouses, manufacturing, distribution centers), and property management companies. Each sector receives specialized attention to their unique requirements, regulations, and operational needs.",
      category: "commercial"
    },
    {
      question: "How do you ensure business continuity during a commercial renovation?",
      answer: "Business continuity is central to our commercial renovation planning. We implement: detailed phasing plans that allow operations to continue in non-construction areas, temporary facilities when needed, after-hours scheduling for highly disruptive work, carefully coordinated utility shutdowns with minimal duration, clear wayfinding signage for customers and staff, dust/noise containment systems, regular progress meetings with your operations team, and flexible work scheduling to accommodate your business cycle and peak periods. Our goal is to deliver your renovation with minimal impact on revenue or customer experience.",
      category: "commercial"
    },
    {
      question: "What sustainability options do you offer for commercial projects?",
      answer: "We offer extensive sustainable building options for commercial projects, including: energy-efficient HVAC and lighting systems, water conservation fixtures and systems, sustainable and low-VOC materials, optimized building envelope designs, smart building automation for efficiency, renewable energy integration (solar, geothermal), waste management and recycling during construction, reclaimed material options, and systems designed for long-term operational efficiency. We can also support LEED, WELL, or other green building certification processes and provide cost-benefit analysis for sustainability investments.",
      category: "commercial"
    },
    {
      question: "How do you coordinate with other project consultants and professionals?",
      answer: "We excel at collaborative project delivery, working seamlessly with architects, engineers, interior designers, equipment vendors, IT consultants, and other specialists. Our coordination process includes: establishing communication protocols at project initiation, implementing regular team coordination meetings, utilizing collaborative project management software, maintaining centralized document management, establishing clear responsibility matrices, proactively identifying cross-discipline issues, coordinating submittal and RFI processes, and facilitating direct communication between specialists to resolve technical challenges quickly.",
      category: "commercial"
    },
    {
      question: "Can you work with specific completion deadline requirements?",
      answer: "Yes, we specialize in deadline-critical commercial projects. Our approach includes: backward schedule planning from your required date, early identification of long-lead items and critical path elements, strategic crew allocation and occasional multiple shifts when necessary, proactive permitting and inspection scheduling, preordering critical materials, maintaining buffer time for unexpected challenges, weekly schedule reviews with adjustment strategies, and transparency regarding milestone progress. For retail, restaurant, or other schedule-sensitive businesses, we understand that opening dates are often inflexible and plan accordingly.",
      category: "commercial"
    },
    {
      question: "What kinds of building code and regulation expertise do you have for commercial projects?",
      answer: "Our team maintains extensive knowledge of commercial building regulations including: International Building Code (IBC) requirements, local commercial building codes and zoning regulations, ADA compliance standards, health department requirements for food service and medical facilities, fire safety and emergency systems requirements, energy code compliance, occupancy classifications and requirements, MEP system regulations, signage ordinances, and historic preservation guidelines where applicable. We continuously update our knowledge through professional development and maintain relationships with local code officials to ensure smooth permitting and inspection processes.",
      category: "commercial"
    },
    {
      question: "Do you handle the procurement of specialized commercial equipment and fixtures?",
      answer: "Yes, we can manage procurement of specialized commercial equipment as part of our turnkey services. Our procurement capabilities include: coordinating with your equipment vendors and suppliers, reviewing specifications for construction compatibility, managing delivery scheduling and logistics, providing proper utilities and connections according to manufacturer specifications, coordinating installation with specialized technicians when required, ensuring proper testing and commissioning, and training your staff on new systems if needed. This comprehensive approach ensures all systems and equipment integrate seamlessly with the construction process.",
      category: "commercial"
    },
    
    // Process & Timeline
    {
      question: "What is your typical process for a construction project?",
      answer: "Our process typically includes: 1) Initial consultation and site visit, 2) Detailed proposal and estimate, 3) Design and planning phase, 4) Contract signing, 5) Material selection and ordering, 6) Construction phase with regular updates, and 7) Final walkthrough and project completion.",
      category: "process"
    },
    {
      question: "How do you handle project delays or unexpected issues?",
      answer: "We maintain transparent communication throughout the project. If unexpected issues arise, we notify you immediately, explain the situation, propose solutions, and discuss any potential impacts on timeline or budget before proceeding.",
      category: "process"
    },
    {
      question: "Will I have a dedicated project manager?",
      answer: "Yes, every project is assigned a dedicated project manager who serves as your main point of contact throughout the construction process. They oversee all aspects of your project and provide regular updates.",
      category: "process"
    },
    {
      question: "Do you use a design-build approach or traditional construction method?",
      answer: "We primarily use a design-build approach where design and construction services are provided under a single contract. This creates a more streamlined process, better communication, and often results in faster completion times and cost savings compared to traditional methods. However, we're also experienced with traditional construction approaches if your project has existing architectural plans or specific requirements that call for this method.",
      category: "process"
    },
    {
      question: "What is the decision timeline for selecting materials, fixtures, and finishes?",
      answer: "We establish a comprehensive selection schedule at project initiation that outlines when each decision needs to be finalized. Typically, major decisions like cabinetry, flooring, and countertops are required 3-6 weeks before their installation phase. Our design team provides guidance throughout this process, and we use a digital selection tracking system to keep everything organized and transparent. Making selections according to the schedule is crucial to prevent project delays.",
      category: "process"
    },
    {
      question: "What project management tools do you use to keep projects on track?",
      answer: "We utilize an integrated construction management platform that includes schedule tracking, daily logs, photo documentation, document storage, and communication tools. Our clients receive access to a personalized portal where they can view real-time updates, approve selections, review documents, and communicate with the project team. This technology ensures transparency and keeps all project information organized in one place.",
      category: "process"
    },
    {
      question: "How do you handle cleanup and waste disposal during and after construction?",
      answer: "We maintain a clean and safe worksite through daily cleanup procedures, designated waste collection areas, and regular professional cleaning services. For waste disposal, we use appropriate-sized containers for construction debris, implement recycling programs for eligible materials (wood, metal, cardboard), properly dispose of hazardous materials according to regulations, and perform a thorough final cleanup including professional cleaning services before project handover.",
      category: "process"
    },
    {
      question: "What support do you provide after project completion?",
      answer: "After completion, we conduct a detailed walkthrough with you, provide a comprehensive project binder with all warranty information, product manuals, care instructions, and paint/material specifications. We schedule check-ins at 30 and 90 days to address any concerns, offer a dedicated support contact for warranty issues, and provide maintenance recommendations. Many clients also engage us for ongoing maintenance programs after experiencing our quality work.",
      category: "process"
    },
    {
      question: "Do you use 3D modeling or visualization in your design process?",
      answer: "Yes, we employ advanced visualization tools throughout our design process. For most renovation and custom building projects, we create detailed 3D models that allow you to virtually experience your space before construction begins. These visualizations include realistic material representations, lighting effects, and furnishing placements to help you make informed decisions. We can provide walkthroughs, different material options for comparison, and even virtual reality experiences for larger projects. These tools significantly reduce design revisions during construction and help ensure the final result matches your vision.",
      category: "process"
    },
    {
      question: "How often will I receive updates about my project's progress?",
      answer: "We maintain consistent communication throughout your project. You'll receive: formal weekly progress reports detailing completed work, upcoming activities, and any decisions needed; a dedicated client portal with daily photo updates; scheduled weekly site meetings with your project manager; immediate notification of any issues requiring attention; regular budget tracking updates; access to a shared calendar with key milestones and scheduled activities; and direct contact information for your project team. We also accommodate your preferred communication style and frequency—whether you prefer daily check-ins or weekly summaries.",
      category: "process"
    },
    {
      question: "What is your policy on change orders during construction?",
      answer: "While we strive for comprehensive planning to minimize changes, we understand that modifications sometimes become necessary or desired during construction. Our change order policy includes: documenting all changes in writing; providing detailed cost and schedule impacts before proceeding; obtaining your signed approval on all changes regardless of size; maintaining a running change order log accessible to you; never proceeding with changed work without authorization; and processing change documentation promptly to maintain accurate project records. We're flexible in accommodating changes while ensuring you maintain complete budget control.",
      category: "process"
    },
    {
      question: "How do you handle project documentation and record-keeping?",
      answer: "We maintain comprehensive project documentation including: detailed daily logs of all site activities, progress photos organized by area and trade, complete material and product specification records, all change orders and design modifications, inspection reports and permit documentation, subcontractor and vendor communications, quality control checklists, and payment records. All documentation is maintained in our project management system with client access. Upon project completion, you receive a comprehensive project binder with both digital and physical copies of all pertinent information for future reference.",
      category: "process"
    },
    {
      question: "What is your typical construction schedule and how is it developed?",
      answer: "Our scheduling process begins with a master timeline developed during pre-construction, outlining major phases and milestones. This evolves into a detailed trade-by-trade schedule showing precise sequencing and durations. We use critical path methodology to identify schedule-driving activities, build in appropriate contingencies, and coordinate with material lead times. The schedule is updated weekly and shared with you through our client portal. For residential projects, typical durations range from 6-8 weeks for single room renovations to 6-10 months for whole-home renovations, while commercial timelines vary based on square footage and complexity.",
      category: "process"
    },
    {
      question: "How do you select and manage subcontractors?",
      answer: "We maintain a carefully curated network of specialized subcontractors who meet our strict quality standards. Our selection process includes: verification of proper licensing and insurance, background checks and reference verification, evaluation of past project quality, assessment of financial stability, and alignment with our customer service philosophy. Once selected, subcontractors undergo our orientation process, receive detailed scope documents, are supervised by our project managers, must adhere to our quality control processes, and undergo performance evaluations after project completion. Many of our subcontractors have worked exclusively with us for over a decade.",
      category: "process"
    },
    {
      question: "How do you ensure projects stay on budget?",
      answer: "Budget management is integral to our process. We implement: detailed estimating with appropriate contingencies built in, weekly budget tracking and cost projections, early procurement of price-volatile materials to lock in costs, thorough scope development to minimize unforeseen conditions, clear allowance management with regular updates, proactive value engineering when needed, and transparent client communication about budget status. Our project management software tracks all expenses in real-time, allowing us to identify any potential budget concerns early and collaborate with you on solutions before they impact the overall project cost.",
      category: "process"
    },
    {
      question: "What is your inspection process throughout construction?",
      answer: "Our multi-layered inspection process includes: pre-construction existing condition documentation, foundation and framing inspections before any covering work, rough-in inspections of all mechanical/electrical/plumbing systems, insulation and weatherproofing verification, daily site inspections by project managers, formal quality control checkpoints at key milestones, third-party inspections as required by code, trade partner quality reviews, pre-drywall comprehensive inspections, final systems testing and commissioning, punch list development and verification, and a final client walkthrough inspection. All inspection results are documented and any required corrections are promptly addressed.",
      category: "process"
    },
    {
      question: "How do you handle project closeout and final approval?",
      answer: "Our structured closeout process ensures complete satisfaction: we conduct a detailed pre-completion inspection to develop an initial punch list, address all items promptly, perform a final cleaning of the space, conduct comprehensive systems testing, schedule any needed owner training sessions for new systems, perform a formal client walkthrough for final approval, collect and organize all warranty documentation and manuals, provide maintenance recommendations and schedules, complete permit closeouts and final inspections, and deliver a complete project binder with all relevant documentation. Final payment is only requested after you've approved the completed work.",
      category: "process"
    },
    {
      question: "What kind of software or technology do you use to manage projects?",
      answer: "We utilize a comprehensive construction management platform that integrates all aspects of your project: interactive scheduling with real-time updates, budget tracking and financial reporting, document management for plans and specifications, daily logs with photo documentation, change order processing and tracking, communication tools for team coordination, quality control checklists, client selections tracking, and warranty management. Clients receive secure access to a personalized portal where they can view progress, approve selections, communicate with the team, and access all project documentation in one organized location.",
      category: "process"
    },
    
    // Payments & Financing
    {
      question: "What payment methods do you accept?",
      answer: "We accept checks, bank transfers, and major credit cards. Payment schedules are outlined in our contract and typically include an initial deposit, progress payments, and a final payment upon completion.",
      category: "payment"
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we partner with reputable financing companies to offer various payment plans. Please visit our Financing page for more details on the options available.",
      category: "payment"
    },
    {
      question: "Do you require a deposit before starting work?",
      answer: "Yes, we typically require a deposit of 30-50% of the project cost before starting work, with the exact amount depending on project size and material costs. The payment schedule will be clearly outlined in your contract.",
      category: "payment"
    },
    {
      question: "How is my initial deposit used?",
      answer: "Your initial deposit serves several important purposes: it secures your place in our production schedule, covers the costs of initial design and planning work, funds the ordering of custom and long-lead materials specific to your project, and provides working capital for labor and standard materials during the early project phases. This deposit demonstrates mutual commitment and allows us to begin allocating resources to your project immediately.",
      category: "payment"
    },
    {
      question: "What is your payment schedule for larger projects?",
      answer: "For larger projects (typically those exceeding $50,000), we structure payments into milestone-based installments. After the initial deposit, payments are tied to specific project milestones such as completion of demolition, rough-in of mechanical systems, completion of drywall, installation of cabinetry, etc. This schedule is clearly outlined in your contract, and payments are due upon completion of each milestone. This approach aligns our compensation with verified progress on your project.",
      category: "payment"
    },
    {
      question: "Do you accept credit card payments and is there a processing fee?",
      answer: "Yes, we accept all major credit cards for your convenience. For payments up to $10,000, there is no processing fee. For larger credit card payments, we apply a 2.9% processing fee to cover the transaction costs charged by card processors. Many clients choose to use credit cards for the rewards benefits, and we're happy to accommodate this payment method.",
      category: "payment"
    },
    {
      question: "Are there any tax credits or incentives available for my renovation project?",
      answer: "Potentially, yes. Certain energy-efficient upgrades may qualify for federal tax credits. Additionally, some local jurisdictions offer property tax incentives for specific improvements. We can help identify potential tax benefits during the planning phase of your project and provide the necessary documentation for your tax professional. Examples include energy-efficient HVAC systems, windows, insulation, solar installations, and certain accessibility modifications.",
      category: "payment"
    },
    {
      question: "How do you price change orders during a project?",
      answer: "Change orders are priced transparently with detailed line items. When you request changes, we provide a written change order that breaks down additional material costs, labor hours, subcontractor expenses, and any impact on project timeline. We add a standard management fee of 15-20% to cover administration and coordination. All change orders require your written approval before work proceeds, ensuring you maintain complete control over your budget throughout the project.",
      category: "payment"
    },
    {
      question: "Do you offer any discounts for certain types of projects or clients?",
      answer: "We occasionally offer specialized pricing programs including: seasonal discounts during our traditionally slower periods (typically late fall and winter), multi-project discounts for clients undertaking several improvements simultaneously, referral incentives for existing clients, special programs for veterans and first responders, and community initiatives for non-profit organizations. While our base pricing reflects our commitment to quality materials and craftsmanship, we're happy to discuss any current promotions that might apply to your specific project during your consultation.",
      category: "payment"
    },
    {
      question: "What financing options do you offer or recommend?",
      answer: "We offer several financing solutions to make your project affordable: partnerships with specialized home improvement lenders offering competitive rates, assistance with construction loan applications and draw management, connections to HELOC and home equity loan providers, information on renovation-specific mortgage products (like FHA 203k loans), manufacturer financing for specific product lines, and guidance on qualified tax-advantaged financing when applicable. During your initial consultation, we can review options best suited to your specific financial situation and project scope.",
      category: "payment"
    },
    {
      question: "How do allowances work in your contracts?",
      answer: "Allowances represent budgeted amounts for items you'll select during the project, such as fixtures, finishes, and appliances. Each allowance specifies both the budgeted amount and what it covers (materials only or materials and installation). We establish allowance amounts based on your quality expectations and preferences. As you make specific selections, we track the actual costs against these allowances, notifying you of any overages or savings. You maintain complete control over selection decisions and associated costs, with complete transparency throughout the process.",
      category: "payment"
    },
    {
      question: "What's included in your project estimates?",
      answer: "Our comprehensive estimates include: all labor costs, material costs with specific allowances where selections aren't finalized, permit and inspection fees, specialty contractor costs, project management expenses, site preparation and protection, debris removal and cleanup, temporary facilities when needed, appropriate contingency reserves (typically 5-10% depending on project complexity), and all applicable taxes. We clearly indicate what's excluded from the estimate (typically client-furnished items) and provide allowance schedules for selections you'll make during the project to maintain complete pricing transparency.",
      category: "payment"
    },
    {
      question: "Do you charge for design services or initial consultations?",
      answer: "Initial consultations are always complimentary. For design services, our approach varies by project scope: For simpler projects, basic design services are included in the project price. For more complex renovations requiring detailed design work, we offer tiered design packages ranging from concept development to comprehensive design services with 3D renderings and material selections. If you proceed with construction, a portion of design fees is typically credited toward your project. This approach ensures appropriate design detail while remaining flexible for different project needs.",
      category: "payment"
    },
    {
      question: "What happens if the project goes over budget?",
      answer: "We implement multiple safeguards to prevent budget overruns: detailed initial estimating, appropriate contingency planning, allowance management systems, and proactive communication. If unexpected conditions are encountered that could impact budget (like discovering hidden damage), we immediately notify you, present options with associated costs, and never proceed without your approval. Our change order process ensures you maintain complete control over any scope additions or modifications. With our transparent approach, budget surprises are rare, and you always maintain decision-making authority regarding additional expenses.",
      category: "payment"
    },
    {
      question: "Are there any hidden fees or costs that might come up later?",
      answer: "We pride ourselves on transparent pricing with no hidden fees. Our contracts clearly outline all costs, payment schedules, and potential variables. The main source of additional costs is change orders (which always require your approval) or unforeseen conditions discovered during construction (like hidden water damage). To minimize surprises, we recommend appropriate contingency budgets (typically 5-15% depending on project type and age of structure) and conduct thorough pre-construction investigations whenever possible to identify potential issues before work begins.",
      category: "payment"
    },
    {
      question: "Can I supply my own materials or fixtures to save money?",
      answer: "Yes, you can supply certain materials, though we recommend considering several factors: 1) We offer competitive pricing through our supplier relationships, often matching or beating retail prices, 2) Contractor-supplied materials include our full warranty coverage, 3) We coordinate delivery timing, inspect for damage, and handle any defect issues, 4) For client-supplied items, we provide detailed specifications to ensure compatibility, but cannot warranty these items, and 5) Delivery delays of client-supplied materials could impact the schedule. We're flexible in working with your preferences while ensuring quality and project efficiency.",
      category: "payment"
    },
    {
      question: "What happens if I need to cancel or postpone my project after signing the contract?",
      answer: "Our contracts include a cancellation policy that balances client flexibility with our resource commitments. For cancellations before work begins, there's typically a modest fee covering design, planning, and administrative costs. Once work is underway, cancellation charges reflect work completed plus ordered materials and committed subcontractor costs. For postponements, we work to accommodate schedule changes when possible, though significant delays might require price adjustments due to material or labor cost fluctuations. We handle each situation individually, striving for fair resolution that recognizes both parties' circumstances.",
      category: "payment"
    },
    {
      question: "Do I need to worry about mechanic's liens?",
      answer: "We implement several safeguards to protect you from potential lien issues: maintaining detailed records of all payments to suppliers and subcontractors, providing lien waivers with each progress payment, carrying payment bond coverage for larger projects, requiring similar documentation from all subcontractors, and maintaining excellent relationships with our vendors through prompt payment practices. These measures protect your property from encumbrances while ensuring everyone involved in your project is fairly compensated for their work and materials.",
      category: "payment"
    },
    
    // Warranties & After-Service
    {
      question: "Do you offer warranties on your work?",
      answer: "Yes, we provide a 2-year workmanship warranty on all our construction services. Additionally, many of the products and materials we install come with manufacturer warranties, which we pass on to you.",
      category: "warranty"
    },
    {
      question: "What happens if I notice an issue after my project is complete?",
      answer: "We stand behind our work. If you notice any issues related to our workmanship after project completion, simply contact us and we'll schedule a time to assess and address the concern promptly.",
      category: "warranty"
    },
    {
      question: "Do you provide maintenance services after completion?",
      answer: "Yes, we offer maintenance services for projects we've completed. We can help with regular upkeep, repairs, or future modifications to ensure your space continues to function perfectly for years to come.",
      category: "warranty"
    },
    {
      question: "What's the difference between manufacturer warranties and your workmanship warranty?",
      answer: "Manufacturer warranties cover defects in the products themselves, such as appliances, fixtures, materials, and systems. These warranties vary in length and coverage depending on the manufacturer and product. Our 2-year workmanship warranty specifically covers the quality of our installation and construction work. This includes issues like improper installation, structural deficiencies, or finishing failures. We coordinate all warranty claims, whether they fall under manufacturer or workmanship coverage, making the process seamless for you.",
      category: "warranty"
    },
    {
      question: "What's the process for reporting warranty issues?",
      answer: "Reporting a warranty concern is simple: contact our dedicated warranty department by phone or through our client portal. We'll promptly document your concern and schedule an inspection within 48-72 hours for urgent issues or within 7 days for non-urgent matters. After assessment, we'll develop a resolution plan, coordinate any manufacturer claims if relevant, and schedule repairs at your convenience. Throughout this process, you'll receive clear communication about timeframes and solutions.",
      category: "warranty"
    },
    {
      question: "How quickly do you respond to warranty issues?",
      answer: "We prioritize warranty service based on the nature of the issue. Emergency issues affecting safety or causing active damage (like leaks) receive same-day or next-day response. Functional issues that impact daily use but aren't emergencies are addressed within 3-5 business days. Cosmetic issues are typically scheduled within 1-2 weeks. In all cases, we communicate promptly about our response timeline and work to minimize any inconvenience to you.",
      category: "warranty"
    },
    {
      question: "What documentation will I receive regarding warranties?",
      answer: "Upon project completion, we provide a comprehensive warranty package that includes our detailed workmanship warranty certificate, all manufacturer warranty documentation for installed products, owner's manuals for appliances and systems, care and maintenance instructions for various materials, warranty claim contact information, and a schedule of recommended maintenance. This package is provided in both digital and printed formats for your convenience.",
      category: "warranty"
    },
    {
      question: "Do you offer extended warranty options beyond your standard coverage?",
      answer: "Yes, we offer extended workmanship warranty options that can be purchased at project completion. Our standard extended options include a 5-year extended warranty or a comprehensive 10-year extended warranty. These extended warranties cover the same workmanship elements as our standard warranty but for a longer duration. Additionally, we offer annual maintenance service plans that include proactive inspections and maintenance, which can both extend the life of your renovation and help identify any potential issues before they become problems.",
      category: "warranty"
    },
    {
      question: "What specific items are covered under your workmanship warranty?",
      answer: "Our workmanship warranty covers defects in installation and construction including: structural elements and framing, roofing installation, exterior siding and trim, window and door installation, plumbing installation (not fixtures themselves), electrical installation (not fixtures/devices themselves), HVAC installation (not equipment itself), drywall installation and finishing, tile and stonework installation, flooring installation, cabinet installation, countertop installation, painting and finishing work, trim and molding installation, and concrete/masonry work. Essentially, our warranty covers how things were installed rather than the manufactured products themselves, which carry separate manufacturer warranties.",
      category: "warranty"
    },
    {
      question: "What specific items are excluded from your warranty?",
      answer: "While our warranty is comprehensive, certain items are excluded: normal wear and tear, owner-supplied materials or fixtures, damage from improper use or maintenance, alterations performed by others after completion, damage from extreme weather events beyond normal conditions, settling or movement within normal structural tolerances, cosmetic items like paint touch-ups beyond 60 days, light bulbs and other consumables, appliance function (covered by manufacturer warranties), and issues arising from owner negligence or failure to perform recommended maintenance. We clearly document these exclusions in our warranty certificate to ensure complete transparency.",
      category: "warranty"
    },
    {
      question: "Do you offer ongoing maintenance services after the warranty period?",
      answer: "Yes, we offer several post-warranty maintenance options: scheduled maintenance programs with seasonal inspections and preventive care, on-call service for repairs and adjustments, annual home systems check-ups, specialized services for high-end finishes and materials, and priority scheduling for past clients needing modifications or repairs. Many clients find these ongoing maintenance relationships valuable for preserving their investment and preventing small issues from developing into larger problems. We can customize a maintenance plan specific to your project type and personal preferences.",
      category: "warranty"
    },
    {
      question: "How do manufacturer warranties integrate with your workmanship warranty?",
      answer: "Manufacturer warranties and our workmanship warranty function as complementary protection systems. If an issue arises, we help determine whether it falls under our workmanship warranty (installation-related) or manufacturer warranty (product defect). For manufacturer warranty claims, we provide documentation of proper installation, assist with the claim filing process, coordinate with manufacturer representatives for inspections, facilitate replacement product delivery, and reinstall warranty replacement items often at no additional charge for our past clients. This comprehensive approach ensures you receive full benefit from all applicable warranty coverage.",
      category: "warranty"
    },
    {
      question: "Can I transfer the warranty if I sell my home?",
      answer: "Yes, our standard workmanship warranty is transferable to new owners one time during the warranty period. The transfer process is straightforward: you or the new owner provides written notification of the property transfer, including the new owner's contact information, within 30 days of the sale. We then issue updated warranty documentation to the new owner. This transferability can be a valuable selling point when marketing your home. Extended warranties beyond our standard 2-year coverage may have different transfer terms, which are clearly specified in the extended warranty documentation.",
      category: "warranty"
    },
    {
      question: "What preventive maintenance do you recommend to maintain warranty coverage?",
      answer: "To maintain warranty coverage and protect your investment, we provide a customized maintenance checklist for your specific project, typically including: seasonal HVAC service, caulk and grout inspections, exterior paint and sealant checks, gutter and drainage maintenance, appliance servicing per manufacturer recommendations, plumbing fixture checks, door and window operation adjustments, and specific care instructions for specialty materials or finishes. Performing and documenting this recommended maintenance ensures continued warranty coverage and significantly extends the life and performance of your renovation or construction project.",
      category: "warranty"
    },
    {
      question: "What's your emergency service response time for warranty issues?",
      answer: "For warranty-related emergencies (such as plumbing leaks, electrical failures, or HVAC system failures), our response times are prioritized by severity: true emergencies threatening property damage receive same-day response, typically within 2-4 hours; urgent functional issues affecting daily use receive next-day service; non-emergency warranty items are typically scheduled within 3-5 business days. Our dedicated warranty department maintains capacity for emergency response, and past clients receive priority scheduling even after the warranty period has expired. We maintain an after-hours emergency line for critical situations.",
      category: "warranty"
    },
    {
      question: "How do seasonal changes affect my warranty claims?",
      answer: "Some construction elements can only be properly evaluated or repaired during certain seasons. For example, certain exterior issues (like roof or siding concerns) may need to be addressed in moderate weather, while HVAC warranty evaluations may require operation in both heating and cooling modes. In cases where seasonal constraints affect immediate resolution, we implement temporary measures when possible and schedule permanent repairs during appropriate conditions. Your warranty duration isn't affected by these seasonal considerations—we track and honor these commitments regardless of when they can be properly addressed.",
      category: "warranty"
    },
    {
      question: "What documentation do I need to keep for warranty purposes?",
      answer: "For optimal warranty protection, we recommend maintaining: your comprehensive warranty certificate, manufacturer warranty registrations (which we typically handle for you), project completion documentation, care and maintenance instructions provided at project completion, records of any performed maintenance (dates and services), serial numbers of major products and systems, contact information for our warranty department, photos of your completed project (which we provide), and a log of any warranty service performed. We provide both physical and digital copies of essential documentation, and our client portal maintains permanent records of your project details.",
      category: "warranty"
    },
    {
      question: "How do you ensure warranty repairs match the original quality?",
      answer: "Warranty repairs receive the same quality attention as original construction. We implement several quality assurance measures: warranty work is performed by the same skilled craftspeople who work on our primary projects, we maintain detailed records of your original materials and finishes for precise matching, our warranty department coordinates closely with production to ensure consistency, we follow the same quality control procedures used in new construction, and warranty work undergoes the same inspection process as original installations. Additionally, we check with you after completion to verify your satisfaction with the repairs.",
      category: "warranty"
    }
  ];

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                         item.answer.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(faqItems.map(item => item.category))];
  
  // Organize FAQs by category for tabbed view
  const faqsByCategory: Record<string, FAQItem[]> = {
    all: filteredFAQs
  };
  
  categories.forEach(category => {
    if (category !== 'all') {
      faqsByCategory[category] = faqItems.filter(item => 
        item.category === category && 
        (debouncedQuery === '' || 
         item.question.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
         item.answer.toLowerCase().includes(debouncedQuery.toLowerCase()))
      );
    }
  });
  
  // Make sure we're using the correct FAQs based on the activeTab
  const currentFAQs = activeTab === 'all' 
    ? filteredFAQs 
    : faqItems.filter(item => 
        item.category === activeTab &&
        (debouncedQuery === '' || 
         item.question.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
         item.answer.toLowerCase().includes(debouncedQuery.toLowerCase()))
      );
  
  const popularFAQs = getPopularFAQs();

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'general':
        return <HelpCircle className="w-5 h-5" />;
      case 'residential':
        return <Home className="w-5 h-5" />;
      case 'commercial': 
        return <Building className="w-5 h-5" />;
      case 'process':
        return <Calendar className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'warranty':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const Building = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="2" x2="9" y2="22" />
      <line x1="15" y1="2" x2="15" y2="22" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );

  // Get category color scheme
  const getCategoryColorScheme = (category: string) => {
    switch(category) {
      case 'general':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'text-blue-500'
        };
      case 'residential':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'text-green-500'
        };
      case 'commercial':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: 'text-purple-500'
        };
      case 'process':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          icon: 'text-amber-500'
        };
      case 'payment':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          icon: 'text-emerald-500'
        };
      case 'warranty':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: 'text-gray-500'
        };
    }
  };

  // Handle feedback submission
  const handleFeedback = (faqIndex: number, isHelpful: boolean) => {
    // Update feedback state
    setFeedbackState(prev => ({
      ...prev,
      [faqIndex]: isHelpful ? 'helpful' : 'not-helpful'
    }));
    
    // In a real app, you might send this to your backend
    console.log(`Feedback for question ${faqIndex}: ${isHelpful ? 'Helpful' : 'Not Helpful'}`);
    
    // Show feedback submitted confirmation
    setFeedbackSubmitted(prev => ({
      ...prev,
      [faqIndex]: true
    }));
    
    // Reset feedback submitted state after 3 seconds
    setTimeout(() => {
      setFeedbackSubmitted(prev => ({
        ...prev,
        [faqIndex]: false
      }));
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen pb-20">
      {/* Enhanced header with decorative elements */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-white relative overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        {/* Decorative shapes */}
        <div className="absolute top-1/2 right-[5%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 left-[15%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-white/20 rounded-full">
                <HelpCircle className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto text-center">
              Find answers to common questions about our services, process, and policies
            </p>
            <div className="flex items-center justify-center mt-8 text-sm text-blue-200">
              <Link to="/" className="hover:text-white transition-colors flex items-center">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-1" /> FAQ
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Search & Filter Section */}
      <div className="sticky top-0 z-10 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="md:flex-1 overflow-x-auto pb-2 md:pb-0">
                <div className="flex gap-2 whitespace-nowrap">
                  {categories.map((category, index) => {
                    const isActive = activeTab === category;
                    const colors = getCategoryColorScheme(category);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          // Reset any open items when changing category
                          setOpenItems([]);
                          // Update both state variables to ensure consistency
                          setActiveTab(category); 
                          setActiveCategory(category);
                          // Force a re-render to make sure the UI updates
                          setForceUpdate(prev => prev + 1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <span className={`mr-1.5 ${isActive ? 'text-white' : colors.icon}`}>
                          {getCategoryIcon(category)}
                        </span>
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with enhanced visuals */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Category header with icon and description - only show when no search query */}
          {!debouncedQuery && (
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                {getCategoryIcon(activeTab)}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 capitalize">
                {activeTab === 'all' ? 'All Questions' : `${activeTab} Questions`}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {activeTab === 'all' && "Browse through our comprehensive collection of frequently asked questions across all categories."}
                {activeTab === 'general' && "Find answers to general questions about our company, services, and what makes us different."}
                {activeTab === 'residential' && "Learn about our residential construction and remodeling services, processes, and capabilities."}
                {activeTab === 'commercial' && "Discover details about our commercial construction services and how we can help your business."}
                {activeTab === 'process' && "Understand our construction process, timelines, and what to expect when working with us."}
                {activeTab === 'payment' && "Get information about our payment procedures, financing options, and project budgeting."}
                {activeTab === 'warranty' && "Learn about our workmanship warranties and what to expect from our after-service support."}
              </p>
            </div>
          )}
        
          {currentFAQs.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {currentFAQs.map((faq, index) => {
                  const faqIndex = faqItems.findIndex(item => item.question === faq.question);
                  const questionParts = highlightText(faq.question);
                  const answerParts = highlightText(faq.answer);
                  const colors = getCategoryColorScheme(faq.category);
                  const isOpen = openItems.includes(faqIndex);
                  
                  return (
                    <div 
                      key={index}
                      id={`faq-${faqIndex}`}
                      className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-fit transition-all duration-300 ${isOpen ? 'scale-[1.01] shadow-lg' : 'hover:shadow-md'}`}
                    >
                      <button
                        onClick={() => toggleItem(faqIndex)}
                        className={`w-full flex justify-between items-center p-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all ${isOpen ? 'border-b border-gray-100' : ''}`}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start">
                          <div className={`${colors.bg} ${colors.text} p-2 rounded-full mr-3 flex-shrink-0`}>
                            {getCategoryIcon(faq.category)}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 pt-0.5">
                            {questionParts.map((part, i) => (
                              <span 
                                key={i} 
                                className={part.isHighlighted ? 'bg-yellow-200' : ''}
                              >
                                {part.text}
                              </span>
                            ))}
                          </h3>
                        </div>
                        <div className={`${isOpen ? 'text-blue-600' : 'text-gray-400'} ml-4 flex-shrink-0 transition-colors`}>
                          {isOpen ? <MinusCircle className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                        </div>
                      </button>
                      
                      {!isOpen && (
                        <div className="px-5 pb-5 pl-16">
                          <div className="text-gray-600 text-sm line-clamp-2">
                            {faq.answer.substring(0, 120)}...
                          </div>
                        </div>
                      )}
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pl-16">
                          <div className="pt-4">
                            <div className="text-gray-700">
                              {answerParts.map((part, i) => (
                                <span 
                                  key={i} 
                                  className={part.isHighlighted ? 'bg-yellow-200' : ''}
                                >
                                  {part.text}
                                </span>
                              ))}
                            </div>
                            
                            {/* Feedback System */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              {!feedbackSubmitted[faqIndex] ? (
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-600 mr-4">Was this answer helpful?</span>
                                  <div className="flex gap-3">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFeedback(faqIndex, true);
                                      }}
                                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        feedbackState[faqIndex] === 'helpful'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      }`}
                                      aria-label="This answer was helpful"
                                    >
                                      <ThumbsUp className="w-4 h-4 mr-1.5" />
                                      Helpful
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFeedback(faqIndex, false);
                                      }}
                                      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        feedbackState[faqIndex] === 'not-helpful'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      }`}
                                      aria-label="This answer was not helpful"
                                    >
                                      <ThumbsDown className="w-4 h-4 mr-1.5" />
                                      Not Helpful
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-md inline-flex items-center">
                                  <Check className="w-4 h-4 mr-2" />
                                  Thank you for your feedback!
                                </div>
                              )}
                            </div>
                          
                            {/* Related questions */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                                Related Questions
                              </h4>
                              <ul className="space-y-2 ml-2 border-l-2 border-blue-100 pl-4">
                                {getRelatedQuestions(faq, faqIndex).map((relatedFaq, relatedIndex) => {
                                  const relatedColors = getCategoryColorScheme(relatedFaq.category);
                                  return (
                                  <li key={relatedIndex}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const relatedFaqIndex = faqItems.findIndex(item => item.question === relatedFaq.question);
                                        if (!openItems.includes(relatedFaqIndex)) {
                                          toggleItem(relatedFaqIndex);
                                        }
                                        setTimeout(() => {
                                          const element = document.getElementById(`faq-${relatedFaqIndex}`);
                                          if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                          }
                                        }, 100);
                                      }}
                                      className="text-sm text-blue-600 hover:text-blue-800 text-left flex items-center hover:underline hover:bg-blue-50 p-1 rounded-md -ml-1 transition-colors w-full"
                                    >
                                      <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
                                      <span>{relatedFaq.question}</span>
                                    </button>
                                  </li>
                                )})}
                              </ul>
                            </div>
                            
                            <div className="mt-4 text-xs flex justify-between items-center">
                              <span className="text-gray-500 italic">Last updated: March 2023</span>
                              <span className={`inline-flex items-center px-2 py-1 ${colors.bg} ${colors.text} rounded-full capitalize`}>
                                {getCategoryIcon(faq.category)}
                                <span className="ml-1">{faq.category}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search query or selecting a different category to find what you're looking for.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                  setActiveTab('all');
                }}
                className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ChevronDown className="w-4 h-4 mr-2 transform rotate-90" />
                Clear search
              </button>
            </div>
          )}
          
          {/* Enhanced Popular Questions Section */}
          {debouncedQuery === '' && (
            <div className="mt-20">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(300,300)">
                      <path d="M125,-160.4C171.6,-143.7,223.6,-122.3,246.8,-83.7C270,-45.1,264.4,10.6,244.1,58.5C223.8,106.4,188.8,146.3,146.5,177.9C104.2,209.4,54.6,232.5,1.6,230.5C-51.4,228.5,-102.7,201.4,-139.8,165.9C-176.9,130.4,-199.7,86.5,-216.7,37.8C-233.7,-10.9,-244.9,-64.5,-226.7,-105.9C-208.4,-147.4,-160.8,-176.8,-113.8,-194.3C-66.9,-211.9,-20.5,-217.4,20.9,-242.5C62.3,-267.6,78.4,-177.1,125,-160.4Z" fill="white" />
                    </g>
                  </svg>
                </div>
                
                {/* Floating question marks */}
                <div className="absolute top-[5%] right-[10%] text-white opacity-20 animate-float">
                  <HelpCircle className="w-12 h-12" />
                </div>
                <div className="absolute bottom-[15%] left-[7%] text-white opacity-15 animate-float-delayed">
                  <HelpCircle className="w-8 h-8" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
                      <Star className="w-8 h-8 text-yellow-300" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Popular Questions</h2>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                      Quick answers to our most commonly asked questions
                    </p>
                    <div className="w-24 h-1 bg-blue-400/50 mx-auto mt-4 rounded-full"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {popularFAQs.map((faq, index) => {
                      const colors = getCategoryColorScheme(faq.category);
                      return (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all">
                        <button
                          onClick={() => {
                            setActiveTab(faq.category);
                            setTimeout(() => {
                              const faqIndex = faqItems.findIndex(item => item.question === faq.question);
                              toggleItem(faqIndex);
                              const element = document.getElementById(`faq-${faqIndex}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 100);
                          }}
                          className="text-left w-full group"
                        >
                          <h3 className="font-semibold text-lg text-white group-hover:text-yellow-200 transition-colors mb-3 flex items-start">
                            <span className="bg-white/20 p-1.5 rounded-md mr-3 text-white">
                              {getCategoryIcon(faq.category)}
                            </span>
                            <span>{faq.question}</span>
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-200 capitalize">{faq.category}</span>
                            <span className="bg-white/20 text-white rounded-full p-1.5 group-hover:bg-yellow-300/30 transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </button>
                      </div>
                    )})}
                  </div>
                  
                  {popularFAQs.length > 5 && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAllPopular(!showAllPopular)}
                        className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition-colors backdrop-blur-sm border border-white/20"
                      >
                        {showAllPopular ? 'Show fewer questions' : 'View more popular questions'}
                        <ChevronDown className={`ml-2 w-4 h-4 transform transition-transform ${showAllPopular ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Contact CTA */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 transform -skew-y-3 rounded-3xl -z-10"></div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100 relative z-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="bg-blue-600 text-white p-6 rounded-full">
                    <MessageSquare className="w-16 h-16" />
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                  <p className="text-gray-700 mb-6">
                    If you can't find the answer you're looking for, our team is ready to assist. Contact us for personalized help with your specific inquiry.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md"
                    >
                      Contact Us
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                    <a
                      href="tel:404-934-9458"
                      className="inline-flex items-center px-6 py-3 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-all"
                    >
                      Call Now: 404-934-9458
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add styles */}
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
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FAQ; 