import React, { useState } from 'react';
import { User, Mail, Phone, Building, AlertCircle, MessageSquare, Clock, Calendar, Shield, Info, Globe } from 'lucide-react';
import { FormData } from '../../pages/FreeEstimate/FreeEstimate';
import { validatePhoneNumber, formatPhoneNumber, getCountryOptions, CountryCode } from '../../utils/validation';

interface ContactInfoProps {
  contactInfo: FormData['contactInfo'];
  updateFormData: (data: Partial<FormData>) => void;
  projectType?: 'residential' | 'commercial'; // Add project type prop
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo, updateFormData, projectType = 'residential' }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{code: CountryCode, name: string}>({ 
    code: contactInfo.countryCode || 'US', 
    name: 'United States' 
  });
  
  // Get country options from the utility
  const countryOptions = getCountryOptions();

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
    
    // Format the phone number as user types based on country
    const formattedPhone = formatPhoneNumber(rawInput, selectedCountry.code);
    
    updateFormData({
      contactInfo: {
        ...contactInfo,
        phone: formattedPhone
      }
    });
    
    // Validate the phone number with country code
    const validation = validatePhoneNumber(formattedPhone, selectedCountry.code);
    if (!validation.isValid && formattedPhone.trim()) {
      setPhoneError(validation.message || null);
    } else {
      setPhoneError(null);
    }
  };

  // Toggle preferred contact method - Updated to handle multiple selections
  const togglePreferredContact = (method: string) => {
    // Parse the existing preferredContact field as a comma-separated string
    const currentMethods = contactInfo.preferredContact ? contactInfo.preferredContact.split(',') : [];
    
    // Check if the method is already selected
    const isSelected = currentMethods.includes(method);
    
    let updatedMethods;
    if (isSelected) {
      // Remove the method if it's already selected
      updatedMethods = currentMethods.filter(m => m !== method);
    } else {
      // Add the method if it's not already selected
      updatedMethods = [...currentMethods, method];
    }
    
    // Update the form data with the new comma-separated string
    updateFormData({
      contactInfo: {
        ...contactInfo,
        preferredContact: updatedMethods.join(',')
      }
    });
  };

  // Helper function to check if a contact method is selected
  const isMethodSelected = (method: string): boolean => {
    const currentMethods = contactInfo.preferredContact ? contactInfo.preferredContact.split(',') : [];
    return currentMethods.includes(method);
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
  
  // Handle country selection
  const handleCountrySelect = (country: {code: CountryCode, name: string}) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    
    // Update the form data with the new country code
    updateFormData({
      contactInfo: {
        ...contactInfo,
        countryCode: country.code
      }
    });
    
    // Re-validate phone number with new country code if there's a phone number
    if (contactInfo.phone) {
      const validation = validatePhoneNumber(contactInfo.phone, country.code);
      if (!validation.isValid && contactInfo.phone.trim()) {
        setPhoneError(validation.message || null);
      } else {
        setPhoneError(null);
      }
    }
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

            {/* Phone with Country Selector */}
            <div className="col-span-1">
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                {/* Country Selector Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowCountryList(!showCountryList)}
                    className={`flex items-center h-full px-3 py-3 border ${phoneError ? 'border-red-500' : 'border-gray-300'} bg-gray-50 hover:bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  >
                    <Globe className="h-5 w-5 text-gray-600 mr-1" />
                    <span className="hidden sm:inline text-gray-700 font-medium">{selectedCountry.code}</span>
                    <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Country List Dropdown */}
                  {showCountryList && (
                    <div className="absolute z-10 mt-1 w-60 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white border border-gray-300">
                      <div className="py-1">
                        {countryOptions.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${country.code === selectedCountry.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            onClick={() => handleCountrySelect(country)}
                          >
                            {country.name} ({country.code})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div className="relative flex-1">
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
                    } rounded-r-lg rounded-l-none border-l-0`}
                    placeholder={selectedCountry.code === 'US' ? "(123) 456-7890" : "Enter phone number"}
                  />
                </div>
              </div>
              {phoneError && (
                <div className="text-red-500 text-sm mt-1">
                  {phoneError}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {selectedCountry.code === 'US' 
                  ? 'Format: (123) 456-7890' 
                  : `International format: Include + and country code or enter local format for ${selectedCountry.name}`}
              </p>
            </div>

            {/* Company - Only show for Commercial projects */}
            {projectType === 'commercial' && (
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
            )}
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
          {/* Preferred Contact Method - Updated for multiple selection */}
          <div className="mb-8">
            <label className="block font-medium text-gray-700 mb-3">
              Preferred Contact Method <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-500">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => togglePreferredContact('email')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${isMethodSelected('email') 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    isMethodSelected('email') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isMethodSelected('email') && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className={`h-5 w-5 mr-2 ${isMethodSelected('email') ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isMethodSelected('email') ? 'text-blue-800' : 'text-gray-800'}`}>
                    Email
                  </span>
                </div>
              </div>

              <div 
                onClick={() => togglePreferredContact('phone')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${isMethodSelected('phone') 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    isMethodSelected('phone') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isMethodSelected('phone') && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className={`h-5 w-5 mr-2 ${isMethodSelected('phone') ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isMethodSelected('phone') ? 'text-blue-800' : 'text-gray-800'}`}>
                    Phone
                  </span>
                </div>
              </div>

              <div 
                onClick={() => togglePreferredContact('message')}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all flex items-center
                  ${isMethodSelected('message') 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="mr-4">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    isMethodSelected('message') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isMethodSelected('message') && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageSquare className={`h-5 w-5 mr-2 ${isMethodSelected('message') ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isMethodSelected('message') ? 'text-blue-800' : 'text-gray-800'}`}>
                    Message (SMS)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Time for Contact */}
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

          {/* Additional Contact Instructions */}
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

      {/* Project Interest Section */}
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

      {/* Required Fields Notice */}
      <div className="text-sm text-gray-500 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
        Fields marked with <span className="text-red-500 mx-1">*</span> are required
      </div>

    </div>
  );
};

export default ContactInfo; 