import React, { useState } from 'react';
import { User, Mail, Phone, Building, AlertCircle, MessageSquare, Clock, Calendar, Shield, Info } from 'lucide-react';
import { FormData } from '../../pages/FreeEstimate/FreeEstimate';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/validation';

interface ContactInfoProps {
  contactInfo: FormData['contactInfo'];
  updateFormData: (data: Partial<FormData>) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo, updateFormData }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Update contact info field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    updateFormData({
      contactInfo: {
        ...contactInfo,
        [name]: value
      }
    });
  };

  // Handle phone number with real-time validation and formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    
    // Format the phone number as user types
    const formattedPhone = formatPhoneNumber(rawInput);
    
    updateFormData({
      contactInfo: {
        ...contactInfo,
        phone: formattedPhone
      }
    });
    
    // Validate the phone number
    const validation = validatePhoneNumber(formattedPhone);
    if (!validation.isValid && formattedPhone.trim()) {
      setPhoneError(validation.message || null);
    } else {
      setPhoneError(null);
    }
  };

  // Set preferred contact method
  const setPreferredContact = (method: 'email' | 'phone' | 'message') => {
    updateFormData({
      contactInfo: {
        ...contactInfo,
        preferredContact: method
      }
    });
  };

  // Set preferred time for contact
  const setPreferredTime = (time: 'morning' | 'afternoon' | 'evening' | 'anytime') => {
    updateFormData({
      contactInfo: {
        ...contactInfo,
        preferredTime: time
      }
    });
  };

  // Toggle section accordion (for mobile view)
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="py-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Please provide your details so we can contact you about your free construction estimate.
        </p>
      </div>

      {/* Personal Information Section */}
      <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex justify-between items-center" onClick={() => toggleSection('personal')}>
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            </div>
            {/* Only show toggle on mobile */}
            <button className="md:hidden text-gray-500">
              {activeSection === 'personal' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`p-6 sm:p-8 bg-gray-50 ${activeSection === 'personal' ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-1">
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactInfo.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="col-span-1">
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
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
                  value={contactInfo.phone}
                  onChange={handlePhoneChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    phoneError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg`}
                  placeholder="(123) 456-7890"
                />
                {phoneError && (
                  <div className="text-red-500 text-sm mt-1">
                    {phoneError}
                  </div>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="col-span-1">
              <label htmlFor="company" className="block font-medium text-gray-700 mb-1">
                Company/Organization
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={contactInfo.company}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company (if applicable)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Preferences Section */}
      <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex justify-between items-center" onClick={() => toggleSection('communication')}>
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Communication Preferences</h3>
            </div>
            {/* Only show toggle on mobile */}
            <button className="md:hidden text-gray-500">
              {activeSection === 'communication' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`p-6 sm:p-8 bg-gray-50 ${activeSection === 'communication' ? 'block' : 'hidden md:block'}`}>
          {/* Preferred Contact Method */}
          <div className="mb-8">
            <label className="block font-medium text-gray-700 mb-3">
              Preferred Contact Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setPreferredContact('email')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${contactInfo.preferredContact === 'email' 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    contactInfo.preferredContact === 'email' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {contactInfo.preferredContact === 'email' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className={`h-5 w-5 mr-2 ${contactInfo.preferredContact === 'email' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contactInfo.preferredContact === 'email' ? 'text-blue-800' : 'text-gray-800'}`}>
                    Email
                  </span>
                </div>
              </div>

              <div 
                onClick={() => setPreferredContact('phone')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${contactInfo.preferredContact === 'phone' 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    contactInfo.preferredContact === 'phone' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {contactInfo.preferredContact === 'phone' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className={`h-5 w-5 mr-2 ${contactInfo.preferredContact === 'phone' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contactInfo.preferredContact === 'phone' ? 'text-blue-800' : 'text-gray-800'}`}>
                    Phone
                  </span>
                </div>
              </div>

              <div 
                onClick={() => setPreferredContact('message')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${contactInfo.preferredContact === 'message' 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    contactInfo.preferredContact === 'message' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {contactInfo.preferredContact === 'message' && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageSquare className={`h-5 w-5 mr-2 ${contactInfo.preferredContact === 'message' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${contactInfo.preferredContact === 'message' ? 'text-blue-800' : 'text-gray-800'}`}>
                    Message (SMS)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Preferred Time for Contact */}
          <div className="mb-8">
            <label className="block font-medium text-gray-700 mb-3">
              Best Time to Contact You
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'morning', label: 'Morning', icon: <Clock className="h-4 w-4" /> },
                { id: 'afternoon', label: 'Afternoon', icon: <Clock className="h-4 w-4" /> },
                { id: 'evening', label: 'Evening', icon: <Clock className="h-4 w-4" /> },
                { id: 'anytime', label: 'Anytime', icon: <Calendar className="h-4 w-4" /> },
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => setPreferredTime(option.id as any)}
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-all text-center
                    ${contactInfo.preferredTime === option.id 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-200'
                    }
                  `}
                >
                  <div className={`flex justify-center mb-1 ${contactInfo.preferredTime === option.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {option.icon}
                  </div>
                  <span className={`text-sm font-medium ${contactInfo.preferredTime === option.id ? 'text-blue-800' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: Additional Contact Instructions */}
          <div>
            <label htmlFor="additionalContactInfo" className="block font-medium text-gray-700 mb-1">
              Additional Contact Instructions
            </label>
            <textarea
              id="additionalContactInfo"
              name="additionalContactInfo"
              value={contactInfo.additionalContactInfo || ''}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any specific details about contacting you (e.g., best days, extension numbers, availability)"
            />
          </div>
        </div>
      </div>

      {/* Project Interest Section - NEW */}
      <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex justify-between items-center" onClick={() => toggleSection('interest')}>
            <div className="flex items-center">
              <Info className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Project Interest</h3>
            </div>
            {/* Only show toggle on mobile */}
            <button className="md:hidden text-gray-500">
              {activeSection === 'interest' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`p-6 sm:p-8 bg-gray-50 ${activeSection === 'interest' ? 'block' : 'hidden md:block'}`}>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Consultation Process</h4>
                  <p className="text-sm text-gray-700">
                    After receiving your information, our team will review your project details and contact you within 
                    24-48 hours to schedule an on-site or virtual consultation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-gray-700 mr-2" />
                  <h4 className="font-medium text-gray-800">No Obligation Quote</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Your consultation is completely free with no obligation to proceed with the project.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-gray-700 mr-2" />
                  <h4 className="font-medium text-gray-800">Flexible Scheduling</h4>
                </div>
                <p className="text-sm text-gray-600">
                  We'll work with your schedule to find the most convenient time for your consultation.
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 mt-4">
              <p>
                Have specific questions? Feel free to contact us directly at <a href="/contact" className="text-blue-600 font-medium">Contact Us</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Privacy & Data Security</h3>
            <p className="text-gray-700 mb-2">
              By submitting this form, you agree to our privacy policy and consent to being contacted about your construction project.
            </p>
            <p className="text-sm text-gray-500">
              We respect your privacy and will only use your information to contact you about your estimate request.
              Your information will never be shared with third parties without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* Required Fields Notice */}
      <div className="text-sm text-gray-500 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
        Fields marked with <span className="text-red-500 mx-1">*</span> are required
      </div>


    </div>
  );
};

export default ContactInfo; 