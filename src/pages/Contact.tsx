import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Calendar, Check, Star, ArrowRight, Loader2, Building, User, ChevronDown, Info, Plus, Minus, Hammer, MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialSlider from '../components/TestimonialSlider';
import { getShuffledTestimonials } from '../data/testimonials';
import { sendContactEmail } from '../utils/emailService';

// Define FaqItem component for the accordion
interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Basic markdown link rendering for the answer
  const renderAnswer = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // Matches [Text](link)
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Push text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Push the link component
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a href={linkUrl} key={match.index} className="text-blue-600 hover:underline font-medium">
          {linkText}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    // Push remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        {isOpen ? 
          <Minus className="w-5 h-5 text-blue-600 flex-shrink-0" /> : 
          <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
        }
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 text-gray-600 leading-relaxed">
          {renderAnswer(answer)}
        </div>
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const location = useLocation();
  const [selectedService, setSelectedService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    inquiryType: 'project', // Added: project, general
    serviceType: '',
    projectType: 'residential',
    description: '',
    howDidYouHear: '',
    website: '', // Honeypot field for spam protection
    otherSource: '',
    otherServiceType: '',
  });

  // Memoize testimonials to prevent re-rendering on scroll
  const memoizedTestimonials = useMemo(() => getShuffledTestimonials(), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    if (service) {
      setSelectedService(service);
      setFormData(prev => ({ ...prev, serviceType: service }));
    }
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => observer.observe(element));
    
    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle radio button type specifically
    if (type === 'radio' && name === 'inquiryType') {
        setFormData(prev => ({ 
            ...prev, 
            inquiryType: value,
            // Reset project specific fields if switching away from project inquiry
            serviceType: value !== 'project' ? '' : prev.serviceType,
            projectType: value !== 'project' ? 'residential' : prev.projectType
        }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form 
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.description.trim()) newErrors.description = "Please provide some details about your project or inquiry";
    
    // Phone validation (optional field)
    if (formData.phone && !/^[\d\s()+.-]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle blur event for immediate validation feedback
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field
    if (name === 'name' && !value.trim()) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
    } else if (name === 'email') {
      if (!value.trim()) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      }
    } else if (name === 'phone' && value && !/^[\d\s()+.-]{7,20}$/.test(value)) {
      setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
    } else if (name === 'description' && !value.trim()) {
      setErrors(prev => ({ ...prev, description: "Please provide some details about your project or inquiry" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if honeypot field is filled (bot detection)
    if (formData.website) {
      console.log("Spam submission detected");
      // Pretend to submit but don't actually do anything
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }, 1500);
      return;
    }
    
    // Validate all fields
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allTouched: {[key: string]: boolean} = {};
      Object.keys(formData).forEach(key => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare the email template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      address: formData.address || 'Not provided',
      inquiry_type: formData.inquiryType,
      service_type: formData.serviceType || 'Not specified',
      project_type: formData.projectType,
      message: formData.description,
      how_heard: formData.howDidYouHear || 'Not specified',
      other_source: formData.otherSource || '',
      other_service: formData.otherServiceType || '',
      to_name: 'ARXEN Construction Team',
      to_email: 'sustenablet@gmail.com'
    };
    
    // Send the email using our email service
    sendContactEmail(templateParams)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setIsSubmitting(false);
        setSubmitted(true);
        
        // Reset form after delay
        const resetData = {
          name: '',
          email: '',
          phone: '',
          address: '',
          inquiryType: 'project',
          serviceType: '',
          projectType: 'residential',
          description: '',
          howDidYouHear: '',
          website: '',
          otherSource: '',
          otherServiceType: '',
        };
        setFormData({...resetData, website: ''});
        setTouchedFields({});
        
        // Keep success message for 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setIsSubmitting(false);
        // You can add error handling UI here
        alert('There was an error sending your message. Please try again or contact us directly at sustenablet@gmail.com');
      });
  };

  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-slide-in-up animation-delay-100">Contact Us</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6 opacity-0 animate-slide-in-up animation-delay-300">
              Have questions about our services or want to discuss your project? We're here to help you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center gap-4 items-center opacity-0 animate-slide-in-up animation-delay-500">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all hover:bg-white/20">
                <Phone className="w-4 h-4 text-blue-300 mr-2" />
                <span className="text-white font-medium">404-934-9458</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all hover:bg-white/20">
                <Mail className="w-4 h-4 text-blue-300 mr-2" />
                <span className="text-white font-medium">sustenablet@gmail.com</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all hover:bg-white/20">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-white font-medium">24hr Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="container mx-auto px-6 py-12 relative z-10 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form (2/3 width) */}
          <div className="lg:col-span-2 animate-on-scroll">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Get In Touch</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-700" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          touchedFields.name && errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        aria-invalid={touchedFields.name && errors.name ? "true" : "false"}
                        aria-describedby={touchedFields.name && errors.name ? "name-error" : undefined}
                        placeholder="Your full name"
                      />
                    </div>
                    {touchedFields.name && errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-700" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          touchedFields.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        aria-invalid={touchedFields.email && errors.email ? "true" : "false"}
                        aria-describedby={touchedFields.email && errors.email ? "email-error" : undefined}
                        placeholder="your@email.com"
                      />
                    </div>
                    {touchedFields.email && errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone and Service row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-700" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          touchedFields.phone && errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        aria-invalid={touchedFields.phone && errors.phone ? "true" : "false"}
                        aria-describedby={touchedFields.phone && errors.phone ? "phone-error" : undefined}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    {touchedFields.phone && errors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                      Service of Interest
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hammer className="h-5 w-5 text-gray-700" />
                      </div>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      >
                        <option value="">Select a service</option>
                        {formData.projectType === 'residential' ? (
                          <>
                        <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                        <option value="Bathroom Remodeling">Bathroom Remodeling</option>
                        <option value="Flooring">Flooring Installation</option>
                        <option value="Custom Cabinetry">Custom Cabinetry</option>
                        <option value="Painting">Painting Services</option>
                            <option value="Basement Finishing">Basement Finishing</option>
                            <option value="Home Addition">Home Addition</option>
                            <option value="Deck/Patio">Deck or Patio Construction</option>
                            <option value="Other">Other Residential Services</option>
                          </>
                        ) : (
                          <>
                            <option value="Office Renovation">Office Renovation</option>
                            <option value="Retail Construction">Retail Space Construction</option>
                            <option value="Restaurant Buildout">Restaurant Buildout</option>
                            <option value="Medical Facility">Medical Facility Construction</option>
                            <option value="Industrial">Industrial Construction</option>
                            <option value="Tenant Improvement">Tenant Improvement</option>
                            <option value="Commercial Painting">Commercial Painting</option>
                            <option value="Commercial Flooring">Commercial Flooring</option>
                            <option value="Other">Other Commercial Services</option>
                          </>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional field for "Other" service type */}
                {formData.serviceType === 'Other' && (
                  <div className="mt-4 animate-fade-in">
                    <label htmlFor="otherServiceType" className="block text-sm font-medium text-gray-700 mb-1">
                      Please specify the service you're interested in
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hammer className="h-5 w-5 text-gray-700" />
                      </div>
                      <input
                        type="text"
                        id="otherServiceType"
                        name="otherServiceType"
                        value={formData.otherServiceType || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please describe the service you need"
                      />
                    </div>
                  </div>
                )}

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center bg-white px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="residential"
                        checked={formData.projectType === 'residential'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Residential</span>
                    </label>
                    <label className="inline-flex items-center bg-white px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="commercial"
                        checked={formData.projectType === 'commercial'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Commercial</span>
                    </label>
                  </div>
                </div>

                {/* Project Details - Different based on project type */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {formData.projectType === 'residential' ? 'Residential Project Information' : 'Commercial Project Information'}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {formData.projectType === 'residential' ? (
                      <p>We specialize in high-quality home renovations and remodeling projects. Please provide details about your home project, including any specific requirements or timeline considerations.</p>
                    ) : (
                      <p>Our team has extensive experience with commercial construction and renovation. Please share information about your business needs, any operational constraints, and desired completion timeline.</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-700" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      rows={5}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        touchedFields.description && errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      aria-invalid={touchedFields.description && errors.description ? "true" : "false"}
                      aria-describedby={touchedFields.description && errors.description ? "description-error" : undefined}
                      placeholder="Tell us about your project, questions, or how we can help you..."
                    ></textarea>
                  </div>
                  {touchedFields.description && errors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* How did you hear */}
                <div>
                  <label htmlFor="howDidYouHear" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Info className="h-5 w-5 text-gray-700" />
                    </div>
                    <select
                      id="howDidYouHear"
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">Select an option</option>
                      <option value="Search Engine">Search Engine (Google, Bing, etc.)</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend/Family">Friend or Family Referral</option>
                      <option value="Previous Customer">Previous Customer</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                </div>
                
                {/* Conditional field that only shows when "Other" is selected */}
                {formData.howDidYouHear === 'Other' && (
                  <div className="animate-fade-in">
                    <label htmlFor="otherSource" className="block text-sm font-medium text-gray-700 mb-1">
                      Please specify where you heard about us
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Info className="h-5 w-5 text-gray-700" />
                      </div>
                      <input
                        type="text"
                        id="otherSource"
                        name="otherSource"
                        value={formData.otherSource || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please tell us where you heard about us"
                      />
                    </div>
                  </div>
                )}

                {/* Honeypot field - hidden from users but visible to bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Please leave this field empty (anti-spam)</label>
                  <input 
                    type="text" 
                    id="website" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        Sending...
                      </>
                    ) : submitted ? (
                      <>
                        <Check className="-ml-1 mr-2 h-5 w-5 text-white" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="-ml-1 mr-2 h-5 w-5 text-white" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 animate-on-scroll animation-delay-300">
                <h3 className="text-xl font-bold mb-6 relative inline-block after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-800 after:rounded-full">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start group transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-105 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">Phone</p>
                      <a href="tel:404-934-9458" className="text-blue-700 hover:text-blue-900 transition-colors text-lg">
                        404-934-9458
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start group transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-105 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">Email</p>
                      <a href="mailto:sustenablet@gmail.com" className="text-blue-700 hover:text-blue-900 transition-colors text-lg">
                        sustenablet@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start group transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-105 flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 8 AM - 6 PM</p>
                      <p className="text-gray-600">Saturday - Sunday: 8 AM - 6 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Response Promise Card */}
              <div className="bg-blue-900 text-white rounded-xl shadow-lg p-6 animate-on-scroll animation-delay-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Quick Response Promise</h3>
                </div>
                <p className="text-blue-100 mb-4">
                  We promise to respond to all inquiries within 24 hours. Your project is important to us, and we're committed to providing timely, helpful service.
                </p>
                <div className="flex items-center text-sm bg-white/10 rounded-lg p-3">
                  <Check className="w-5 h-5 text-green-400 mr-2" />
                  <span>Most inquiries receive a response within 4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-10 animate-on-scroll">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Have questions? We've got answers. If you don't find what you're looking for, feel free to contact us directly.</p>
          </div>

          {/* Main FAQs - Grid Layout for Better Compactness */}
          <div className="max-w-5xl mx-auto mb-16 animate-on-scroll animation-delay-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">General Questions</h3>
            <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                  question: "What areas do you serve?",
                  answer: "We primarily serve the greater Atlanta area, including Marietta, Kennesaw, Roswell, Alpharetta, Sandy Springs, and surrounding communities within a 90-mile radius."
              },
              {
                question: "Are you licensed and insured?",
                answer: "Yes, Arxen Construction is fully licensed and insured in the state of Georgia. We prioritize safety and compliance on all our projects."
              },
              {
                  question: "Do you provide warranties on your work?",
                  answer: "Yes, we offer a comprehensive workmanship warranty on all our services. Specific materials may also carry manufacturer warranties, which we pass on to our clients."
                },
                {
                  question: "Do you handle permits and inspections?",
                  answer: "Yes, we take care of obtaining all necessary permits and scheduling required inspections for your project."
                }
              ].map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-10 border-b border-gray-200 pb-2">Project Process & Timelines</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
              {
                question: "How long does a typical remodeling project take?",
                answer: "Project timelines vary greatly depending on the scope and complexity. A small bathroom remodel might take a few weeks, while a major kitchen renovation or addition could take several months. We provide a detailed timeline estimate after the initial consultation and design phase."
                },
                {
                  question: "What is your project process?",
                  answer: "Our process typically includes: 1) Initial consultation and estimate, 2) Design and planning, 3) Contract finalization, 4) Material selection and ordering, 5) Construction, 6) Final walkthrough and inspection."
                },
                {
                  question: "Will my project stay on budget?",
                  answer: "We make every effort to provide accurate estimates and stay within budget. Any potential cost changes will be communicated clearly before proceeding, and we work with you to find solutions that meet both your vision and budget."
                },
                {
                  question: "Can I live in my home during the renovation?",
                  answer: "This depends on the scope of work. For many projects, clients can remain in their homes with minimal disruption. For extensive renovations, we'll discuss whether temporary relocation makes sense."
              }
            ].map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
            </div>
          </div>

          {/* Popular Questions Section - Moved to Bottom */}
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md animate-on-scroll animation-delay-500">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Popular Questions</h3>
              <div className="w-20 h-1 bg-blue-500 mx-auto mt-3"></div>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "How do I get a quote for my project?",
                  answer: "The best way to get a quote is to fill out the contact form on this page with as much detail as possible. We'll review your request and get back to you within 24 hours to discuss the next steps, which usually involve a free consultation."
                },
                {
                  question: "Do you offer financing options?",
                  answer: "Yes, we offer flexible financing options to help make your project more affordable. Please visit our [Financing Page](/financing) or contact us for more details."
                },
                {
                  question: "What types of projects do you handle?",
                  answer: "We handle a wide range of residential and commercial construction projects, including kitchen and bathroom remodels, room additions, whole-home renovations, office buildouts, restaurant construction, and more."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <FaqItem question={faq.question} answer={faq.answer} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/faq" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                <span>View all FAQs</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section - Enhanced blue background with lighter blue testimonial box */}
      <div className="py-16 relative overflow-hidden testimonials-no-animation">
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
                    <p className="text-white text-base">
                      Read what our clients have to say about our dedication to quality, innovation, and customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <TestimonialSlider testimonials={memoizedTestimonials} />
                <div className="text-center mt-8">
                  <Link to="/testimonials" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors shadow-md hover:shadow-lg">
                    Read More Testimonials
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today for a free consultation and transform your vision into reality.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white text-blue-900 text-lg font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
              <Phone className="w-5 h-5 mr-2" />
              <a href="tel:404-934-9458">404-934-9458</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS animations */}
      <style>{`
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in-up { 
          animation: slide-in-up 0.6s ease-out forwards; 
          opacity: 0; 
        }
        
        .animate-on-scroll { 
          opacity: 0; 
          transform: translateY(15px); 
          transition: opacity 0.5s ease-out, transform 0.5s ease-out; 
        }
        
        .animate-visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        
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
        
        @keyframes slow-pulse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        
        @keyframes slow-pulse-delayed {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        .animate-slow-pulse {
          animation: slow-pulse 12s ease-in-out infinite;
        }
        
        .animate-slow-pulse-delayed {
          animation: slow-pulse-delayed 15s ease-in-out infinite;
        }
        
        /* Disable scroll-based animations for testimonial section */
        .testimonials-no-animation .animate-on-scroll {
          opacity: 1;
          transform: none;
          transition: none;
        }
        
        .testimonials-no-animation .animate-float,
        .testimonials-no-animation .animate-float-delayed {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Contact; 