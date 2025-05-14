import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  Check, 
  ChevronRight, 
  Hammer, 
  Heart, 
  Lightbulb, 
  Mail, 
  MessageSquare, 
  Phone, 
  Shield, 
  Star, 
  Target, 
  Users,
  ShieldCheck,
  Briefcase as BriefcaseIcon,
  DraftingCompass,
  Upload, X, FileText, Loader2, CheckCircle, Send, Type, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceAreaMap from '../components/ServiceAreaMap';

// Define types for the values
type ValueKey = 'integrity' | 'quality' | 'innovation' | 'customer';

interface ValueItem {
  title: string;
  icon: React.ReactNode;
  description: string;
  points: string[];
}

type ValueItems = Record<ValueKey, ValueItem>;

// Simple interface for Job Opening data
interface JobOpening {
  id: string;
  title: string;
  type: string; // e.g., Full-Time
  location: string;
  description: string;
  icon: React.ReactNode;
}

// Simple interface for Application Form data
interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  position: string; // ID of the position applying for
  resume: File | null;
  coverLetter: string;
}

const About = () => {
  // State for active tab in values section
  const [activeValue, setActiveValue] = useState<ValueKey>('integrity');
  
  // NEW Careers Form State
  const [careerFormData, setCareerFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null,
    coverLetter: ''
  });
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // --- NEW Collaboration Form State & Handlers ---
  const [collabForm, setCollabForm] = useState({
    name: '',
    contact: '', // Can be phone or email
    expertise: '',
    message: '' // Optional message
  });
  const [isCollabSubmitting, setIsCollabSubmitting] = useState(false);
  const [collabSubmitted, setCollabSubmitted] = useState(false);
  const [collabErrors, setCollabErrors] = useState<{[key: string]: string}>({});
  const [collabTouched, setCollabTouched] = useState<{[key: string]: boolean}>({});

  // Company values with details
  const values: ValueItems = {
    integrity: {
      title: 'Integrity',
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      description: 'We believe in honest communication and transparency in all our dealings. Our work is built on trust, and we stand behind every project we complete.',
      points: [
        'Transparent pricing with no hidden costs',
        'Honest assessments of project requirements',
        'Regular updates throughout your project',
        'Accountability at every step'
      ]
    },
    quality: {
      title: 'Quality Craftsmanship',
      icon: <Hammer className="w-12 h-12 text-blue-600" />,
      description: 'Quality is our hallmark. We use premium materials and time-tested techniques to deliver results that exceed expectations and stand the test of time.',
      points: [
        'Meticulous attention to detail',
        'Premium materials from trusted suppliers',
        'Skilled craftspeople with years of experience',
        'Rigorous quality control standards'
      ]
    },
    innovation: {
      title: 'Innovation',
      icon: <Lightbulb className="w-12 h-12 text-blue-600" />,
      description: 'We embrace new technologies and approaches to construction, bringing modern solutions to traditional craftsmanship for better results.',
      points: [
        'Cutting-edge design software',
        'Energy-efficient building techniques',
        'Smart home integration expertise',
        'Continuous training and education'
      ]
    },
    customer: {
      title: 'Customer Focus',
      icon: <Heart className="w-12 h-12 text-blue-600" />,
      description: 'Every project begins and ends with your satisfaction in mind. We listen carefully to understand your vision and work tirelessly to bring it to life.',
      points: [
        'Personalized project planning',
        'Regular client consultations',
        'Post-project follow-up',
        'Client-first approach to every decision'
      ]
    }
  };

  // Team members information
  const teamMembers = [
    {
      name: 'Robert Johnson',
      title: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'With over 25 years in construction, Robert founded Arxen Construction with a vision to combine traditional craftsmanship with modern innovation.',
      specialties: ['Strategic Planning', 'Project Management', 'Client Relations']
    },
    {
      name: 'Sarah Martinez',
      title: 'Design Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'Sarah brings 15 years of interior design expertise, creating spaces that perfectly balance functionality, aesthetics, and client vision.',
      specialties: ['Interior Design', 'Space Planning', 'Material Selection']
    },
    {
      name: 'Michael Chen',
      title: 'Lead Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'An award-winning architect with expertise in sustainable design, Michael ensures every project is both beautiful and environmentally responsible.',
      specialties: ['Architectural Design', 'Sustainable Building', '3D Modeling']
    },
    {
      name: 'Tanya Williams',
      title: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: "Tanya's exceptional organizational skills and attention to detail ensure that projects are completed on time, within budget, and to specification.",
      specialties: ['Timeline Management', 'Budget Control', 'Contractor Coordination']
    }
  ];

  // Milestone achievements
  const milestones = [
    {
      year: '2005',
      title: 'Founded',
      description: 'Arxen Construction was established with a focus on residential remodeling.'
    },
    {
      year: '2010',
      title: 'Expansion',
      description: 'Added commercial services division to meet growing client demands.'
    },
    {
      year: '2015',
      title: 'Award-Winning',
      description: 'Recognized with Regional Excellence in Construction award.'
    },
    {
      year: '2020',
      title: 'Sustainability Focus',
      description: 'Launched dedicated green building initiative for eco-friendly construction.'
    },
    {
      year: '2023',
      title: 'Future Growth',
      description: 'Opened new headquarters and expanded our service area.'
    }
  ];

  // Example Job Openings (can be fetched from an API later)
  const jobOpenings: JobOpening[] = [
    {
      id: 'proj_manager',
      title: 'Project Manager',
      type: 'Full-Time',
      location: 'Atlanta Area',
      description: 'Oversee residential and commercial projects from planning to completion, ensuring quality, budget, and timeline adherence.',
      icon: <BriefcaseIcon className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'lead_carpenter',
      title: 'Lead Carpenter',
      type: 'Full-Time',
      location: 'Field Position',
      description: 'Experienced carpenter needed for high-end residential remodeling. Must have strong leadership and finishing skills.',
      icon: <Hammer className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'design_consultant',
      title: 'Design Consultant',
      type: 'Full-Time',
      location: 'Office/Hybrid',
      description: 'Work with clients to create functional and beautiful designs for remodeling projects. Experience with design software required.',
      icon: <DraftingCompass className="w-6 h-6 text-blue-600" />
    }
  ];

  // --- Career Form Handlers ---
  const handleCareerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCareerFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'position') {
        setSelectedJob(jobOpenings.find(job => job.id === value) || null);
    }
  };

  const handleCareerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('Resume file size should not exceed 5MB.');
        setCareerFormData(prev => ({ ...prev, resume: null }));
        if(fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setCareerFormData(prev => ({ ...prev, resume: file }));
      }
    } else {
        setCareerFormData(prev => ({ ...prev, resume: null }));
    }
  };

  const removeResume = () => {
    setCareerFormData(prev => ({ ...prev, resume: null }));
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerFormData.resume) {
      setFileError('Please upload your resume.');
      return;
    }
    if (!careerFormData.position) {
        alert('Please select the position you are applying for.');
        return;
    }
    setIsSubmitting(true);
    setFileError('');
    console.log("Submitting Application:", { ...careerFormData, resumeName: careerFormData.resume?.name });
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
       setTimeout(() => {
         setCareerFormData({ name: '', email: '', phone: '', position: '', resume: null, coverLetter: '' });
         setSelectedJob(null);
         setSubmitted(false);
         if(fileInputRef.current) fileInputRef.current.value = '';
       }, 5000); 
    }, 2000);
  };
  // --- End Career Form Handlers ---

  // --- NEW Collaboration Form Handlers ---
  const handleCollabChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCollabForm(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setCollabTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error when user starts typing
    if (collabErrors[name]) {
      setCollabErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle blur event to validate on field exit
  const handleCollabBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setCollabTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateCollabField(name, value);
  };
  
  // Validate a specific field
  const validateCollabField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          setCollabErrors(prev => ({ ...prev, name: "Name is required" }));
        }
        break;
      case 'contact':
        if (!value.trim()) {
          setCollabErrors(prev => ({ ...prev, contact: "Contact information is required" }));
        } else if (value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setCollabErrors(prev => ({ ...prev, contact: "Please enter a valid email address" }));
        } else if (!value.includes('@') && !/^[\d\s()+.-]{7,20}$/.test(value)) {
          setCollabErrors(prev => ({ ...prev, contact: "Please enter a valid phone number" }));
        }
        break;
      case 'expertise':
        if (!value.trim()) {
          setCollabErrors(prev => ({ ...prev, expertise: "Please select your area of expertise" }));
        }
        break;
    }
  };
  
  // Validate all fields
  const validateCollabForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Required fields validation
    if (!collabForm.name.trim()) newErrors.name = "Name is required";
    
    if (!collabForm.contact.trim()) {
      newErrors.contact = "Contact information is required";
    } else if (collabForm.contact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collabForm.contact)) {
      newErrors.contact = "Please enter a valid email address";
    } else if (!collabForm.contact.includes('@') && !/^[\d\s()+.-]{7,20}$/.test(collabForm.contact)) {
      newErrors.contact = "Please enter a valid phone number";
    }
    
    if (!collabForm.expertise.trim()) newErrors.expertise = "Please select your area of expertise";
    
    setCollabErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form and mark all fields as touched
    if (!validateCollabForm()) {
      // Mark all fields as touched to display errors
      setCollabTouched({
        name: true,
        contact: true,
        expertise: true,
        message: true
      });
      return;
    }
    setIsCollabSubmitting(true);
    console.log("Collaboration Inquiry:", collabForm);
    // Simulate submission
    setTimeout(() => {
      setIsCollabSubmitting(false);
      setCollabSubmitted(true);
      // Reset form after showing success message
      setTimeout(() => {
        setCollabForm({ name: '', contact: '', expertise: '', message: '' });
        setCollabTouched({});
        setCollabErrors({});
        setCollabSubmitted(false);
      }, 5000);
    }, 1500);
  };
  // --- END Collaboration Form Handlers ---

  return (
    <>
      {/* Hero Section - ENHANCED */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-700 opacity-20 transform -skew-x-12"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">About Arxen Construction</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl animate-fade-in-up animation-delay-200">
              We've been transforming spaces and exceeding expectations since 2005. Our commitment to quality, innovation, and customer satisfaction has made us a trusted name in construction and remodeling.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
              <Link to="/free-estimate" className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all flex items-center group">
                Get a Free Estimate
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-all">
                View Our Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-50 opacity-50 transform -skew-x-12 hidden lg:block"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block p-2 bg-blue-100 rounded-lg text-blue-600 mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Founded in 2005 by a team of passionate builders with decades of combined experience, Arxen Construction began as a small residential remodeling company with a big vision.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our founder recognized a gap in the market: clients needed a construction partner who would truly listen, communicate clearly, and deliver exceptional quality without cutting corners.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, we've grown into a full-service construction and remodeling company serving both residential and commercial clients across the region, but we maintain the same core principles that guided us from day one.
                </p>
                <div className="pt-4">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To transform spaces with exceptional craftsmanship while providing an outstanding customer experience. We create environments that inspire, function perfectly, and reflect the unique character of each client.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Top row - two smaller images */}
                <div className="rounded-lg overflow-hidden shadow-md h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1541971126-d98294fb5fda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80" 
                    alt="Construction site" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1584466977773-e625c37cdd50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80" 
                    alt="Renovation results" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Middle row - stat cards */}
                <div className="col-span-2 grid grid-cols-2 gap-4 py-4">
                  <div className="bg-blue-600 rounded-lg p-6 text-white shadow-md text-center">
                    <div className="font-bold text-4xl md:text-5xl mb-1">18+</div>
                    <div className="font-medium text-blue-100">Years of Excellence</div>
                  </div>
                  <div className="bg-blue-600 rounded-lg p-6 text-white shadow-md text-center">
                    <div className="font-bold text-4xl md:text-5xl mb-1">500+</div>
                    <div className="font-medium text-blue-100">Projects Completed</div>
                  </div>
                </div>
                
                {/* Bottom row - two more images */}
                <div className="rounded-lg overflow-hidden shadow-md h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80" 
                    alt="Team working" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80" 
                    alt="Home interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Additional stats row */}
                <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-lg p-4 shadow-md border border-blue-100">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-gray-800">100%</div>
                        <div className="text-sm text-gray-600">Satisfaction Guarantee</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 shadow-md border border-blue-100">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-gray-800">30+</div>
                        <div className="text-sm text-gray-600">Team Members</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Client-Centered</h3>
              <p className="text-gray-600">Your vision drives every decision we make and every nail we drive.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Quality-Driven</h3>
              <p className="text-gray-600">We never compromise on materials, techniques, or attention to detail.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">Integrity Always</h3>
              <p className="text-gray-600">Honest communication and transparent business practices are our foundation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section - MOVED UP */}
      <div className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-blue-100 rounded-lg text-blue-600 mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Featured Projects</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Browse through some of our most impressive transformations, showcasing our commitment to quality and excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Modern Kitchen Renovation',
                category: 'Residential',
                image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Complete transformation of an outdated kitchen into a sleek, functional cooking space with custom cabinetry.'
              },
              {
                title: 'Corporate Office Remodel',
                category: 'Commercial',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Modern office renovation focused on creating an open, collaborative workspace with premium finishes.'
              },
              {
                title: 'Luxury Bathroom Upgrade',
                category: 'Residential',
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Spa-inspired bathroom remodel featuring custom tile work, soaking tub, and rainfall shower system.'
              },
              {
                title: 'Retail Space Design',
                category: 'Commercial',
                image: 'https://images.unsplash.com/photo-1604014136302-c3b021acb3f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Customer-focused retail store renovation with custom displays, lighting, and brand-aligned interior design.'
              },
              {
                title: 'Outdoor Living Space',
                category: 'Residential',
                image: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Custom deck and patio construction with integrated kitchen, fire pit, and comfortable seating areas.'
              },
              {
                title: 'Healthcare Facility',
                category: 'Commercial',
                image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=350&q=80',
                description: 'Medical office renovation with focus on patient comfort, workflow efficiency, and modern aesthetics.'
              }
            ].map((project, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{project.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <Link to="/portfolio" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                    View Details
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/portfolio" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow"
            >
              View Full Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Our Approach to Construction */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-blue-100 rounded-lg text-blue-600 mb-6">
              <Hammer className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Approach to Construction</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We follow a systematic approach that ensures efficiency, transparency, and exceptional results for every project we undertake.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-600 py-3 px-6">
                    <h3 className="text-xl font-bold text-white">Design & Planning</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">
                      We start every project with thorough planning and design work, ensuring we understand your vision, requirements, and budget constraints.
                    </p>
                    <ul className="space-y-2">
                      {['Initial consultation to understand needs', 'Detailed design proposals', 'Budget planning', '3D visualization where needed'].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-3 mt-1 text-blue-600">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-600 py-3 px-6">
                    <h3 className="text-xl font-bold text-white">Materials & Preparation</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">
                      We source the highest quality materials while maintaining cost-effectiveness, preparing meticulously for the construction phase.
                    </p>
                    <ul className="space-y-2">
                      {['Premium material sourcing', 'Sustainable options where possible', 'Pre-construction site preparation', 'Permits and compliance handling'].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-3 mt-1 text-blue-600">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-600 py-3 px-6">
                    <h3 className="text-xl font-bold text-white">Construction Excellence</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">
                      Our skilled craftspeople execute the project with precision, following industry best practices and maintaining the highest standards.
                    </p>
                    <ul className="space-y-2">
                      {['Skilled trade professionals', 'Regular quality inspections', 'Adherence to timelines', 'Clean and organized work environment'].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-3 mt-1 text-blue-600">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-600 py-3 px-6">
                    <h3 className="text-xl font-bold text-white">Review & Support</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">
                      We don't consider a project complete until you're fully satisfied, and we provide ongoing support for all our work.
                    </p>
                    <ul className="space-y-2">
                      {['Final walkthrough inspection', 'Thorough cleanup', 'Warranty on workmanship', 'Post-project support and maintenance'].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-3 mt-1 text-blue-600">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Core Values Section */}
      <div className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-blue-100 rounded-lg text-blue-600 mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Core Values</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              These principles guide every decision we make and every project we undertake.
            </p>
          </div>

          {/* Values tabs and content */}
          <div className="max-w-5xl mx-auto">
            {/* Tab navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {(Object.entries(values) as [ValueKey, ValueItem][]).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setActiveValue(key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center
                    ${activeValue === key 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                >
                  {value.title}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-md">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2 flex justify-center">
                  <div className="bg-blue-50 p-8 rounded-full shadow-sm">
                    {values[activeValue].icon}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{values[activeValue].title}</h3>
                  <p className="text-gray-700 mb-6">{values[activeValue].description}</p>
                  <ul className="space-y-3">
                    {values[activeValue].points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Check className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Our Guarantee Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-6 text-blue-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Guarantee</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We stand behind the quality of our work. Our commitment to excellence ensures your peace of mind long after the project is complete.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-xl mb-3 text-gray-800 flex items-center">
                  <Hammer className="w-5 h-5 mr-2 text-blue-600"/>
                  Workmanship Warranty
                </h3>
                <p className="text-gray-600 text-sm">
                  All our installation and construction work is backed by a comprehensive workmanship warranty. We guarantee our labor meets the highest industry standards.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-xl mb-3 text-gray-800 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600"/>
                  Material Quality
                </h3>
                <p className="text-gray-600 text-sm">
                  We use only high-quality, durable materials from trusted suppliers. While material warranties are provided by manufacturers, we ensure proper installation for optimal performance.
                </p>
              </div>
            </div>
             <p className="text-sm text-gray-500 mt-8">
               Specific warranty details are provided with your project contract. Feel free to ask for more information during your consultation.
             </p>
          </div>
        </div>
      </div>

      {/* Certifications and Affiliations */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-blue-100 rounded-lg text-blue-600 mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Certifications & Affiliations</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We maintain the highest standards through ongoing education and membership in respected industry organizations.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[
              { name: 'National Association of Home Builders', logo: 'https://via.placeholder.com/150x80?text=NAHB' },
              { name: 'LEED Certified', logo: 'https://via.placeholder.com/150x80?text=LEED' },
              { name: 'American Institute of Architects', logo: 'https://via.placeholder.com/150x80?text=AIA' },
              { name: 'Better Business Bureau A+ Rating', logo: 'https://via.placeholder.com/150x80?text=BBB' },
              { name: 'Energy Star Partner', logo: 'https://via.placeholder.com/150x80?text=EnergyStar' }
            ].map((cert, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                <img src={cert.logo} alt={cert.name} className="h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Updated Collaboration/Work With Us Section --- */}
      <div id="careers" className="py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-blue-200 rounded-full mb-6 text-blue-700">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Work With Arxen</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We partner with skilled and reliable tradespeople. If you're interested in collaborating on projects, please introduce yourself below.
            </p>
          </div>

          {/* Collaboration Form Card */}
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100">
             {collabSubmitted ? (
               // Success Message
               <div className="text-center py-8 transition-all duration-500 animate-fade-in">
                 <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                 <h3 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h3>
                 <p className="text-gray-600">Your collaboration inquiry has been received. We will review your information and reach out if there's a potential fit for upcoming projects.</p>
               </div>
             ) : (
               // Collaboration Form
               <form onSubmit={handleCollabSubmit} className="space-y-6">
                 <h3 className="text-2xl font-semibold text-gray-800 mb-1 text-center">Collaboration Inquiry</h3>
                 <p className="text-center text-gray-500 text-sm mb-6">Let us know about your skills and how to reach you.</p>
                 
                 <div>
                   <label htmlFor="collab-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name / Company Name*</label>
                   <input type="text" id="collab-name" name="name" required value={collabForm.name} onChange={handleCollabChange} onBlur={handleCollabBlur} className={`w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                     collabTouched.name && collabErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                   }`} aria-invalid={collabTouched.name && collabErrors.name ? "true" : "false"} aria-describedby={collabTouched.name && collabErrors.name ? "collab-name-error" : undefined} />
                   {collabTouched.name && collabErrors.name && (
                     <p id="collab-name-error" className="mt-1 text-sm text-red-600">
                       {collabErrors.name}
                     </p>
                   )}
                 </div>
                 
                 <div>
                   <label htmlFor="collab-contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Info (Phone or Email)*</label>
                   <input type="text" id="collab-contact" name="contact" required value={collabForm.contact} onChange={handleCollabChange} onBlur={handleCollabBlur} className={`w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                     collabTouched.contact && collabErrors.contact ? 'border-red-500 bg-red-50' : 'border-gray-300'
                   }`} aria-invalid={collabTouched.contact && collabErrors.contact ? "true" : "false"} aria-describedby={collabTouched.contact && collabErrors.contact ? "collab-contact-error" : undefined} />
                   {collabTouched.contact && collabErrors.contact && (
                     <p id="collab-contact-error" className="mt-1 text-sm text-red-600">
                       {collabErrors.contact}
                     </p>
                   )}
                 </div>

                 <div>
                    <label htmlFor="collab-expertise" className="block text-sm font-medium text-gray-700 mb-1">Primary Area of Expertise*</label>
                     <select 
                      id="collab-expertise" 
                      name="expertise" 
                      required 
                      value={collabForm.expertise} 
                      onChange={handleCollabChange}
                      onBlur={handleCollabBlur}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white ${
                        collabTouched.expertise && collabErrors.expertise ? 'border-red-500 bg-red-50' : 
                        (collabForm.expertise ? 'border-gray-300 text-gray-900' : 'border-gray-300 text-gray-500')
                      }`}
                      aria-invalid={collabTouched.expertise && collabErrors.expertise ? "true" : "false"}
                      aria-describedby={collabTouched.expertise && collabErrors.expertise ? "collab-expertise-error" : undefined}
                      >
                         <option value="" disabled>Select your trade...</option>
                         <option value="carpentry">Carpentry (Framing, Finish)</option>
                         <option value="painting">Painting (Interior, Exterior)</option>
                         <option value="electrical">Electrical</option>
                         <option value="plumbing">Plumbing</option>
                         <option value="hvac">HVAC</option>
                         <option value="drywall">Drywall & Finishing</option>
                         <option value="flooring">Flooring Installation (Tile, Wood, etc.)</option>
                         <option value="cabinetry">Cabinet Installation</option>
                         <option value="countertops">Countertop Fabrication/Installation</option>
                         <option value="roofing">Roofing</option>
                         <option value="siding">Siding</option>
                         <option value="windows_doors">Window & Door Installation</option>
                         <option value="landscaping">Landscaping/Hardscaping</option>
                         <option value="demolition">Demolition</option>
                         <option value="other">Other (Specify Below)</option>
                     </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700" style={{top: '-2.5rem', right: '0.5rem'}}> 
                       {/* ChevronDown positioned manually if needed, or rely on default select arrow */}
                    </div>
                    {collabTouched.expertise && collabErrors.expertise && (
                      <p id="collab-expertise-error" className="mt-1 text-sm text-red-600">
                        {collabErrors.expertise}
                      </p>
                    )}
                 </div>

                 <div>
                    <label htmlFor="collab-message" className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                    <textarea 
                      id="collab-message" name="message" rows={3} 
                      value={collabForm.message}
                      onChange={handleCollabChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      placeholder="Years of experience, certifications, specific skills, link to portfolio, etc."
                    />
                 </div>
                 
                 <button 
                   type="submit" 
                   disabled={isCollabSubmitting}
                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition-all duration-300 transform hover:scale-[1.02]"
                   aria-live="polite"
                  >
                   {isCollabSubmitting ? 
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Sending...</> : 
                     <><Send className="w-5 h-5 mr-2"/> Send Inquiry</>
                   }
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
      {/* --- END Updated Collaboration Section --- */}

      {/* Service Area Map Section - ADDED */}
      <ServiceAreaMap />

      {/* CTA Section - Accessibility Improved */}
      <div className="py-20 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Whether you're remodeling your home or building a new commercial space, our team is ready to bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/free-estimate" 
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Get a free estimate for your project"
            >
              Get a Free Estimate
            </Link>
            <a 
              href="tel:404-934-9458" 
              className="flex items-center bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Call our office at 404-934-9458"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call Us
            </a>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="mr-3 bg-white/20 p-2 rounded-full">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 bg-white/20 p-2 rounded-full">
                <Star className="w-6 h-6" />
              </div>
              <span>500+ Satisfied Customers</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 bg-white/20 p-2 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <span>Fast Response Time</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About; 