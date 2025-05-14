import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ResidentialQuote: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Extract URL parameters
  const serviceParam = searchParams.get('service');
  const propertyTypeParam = searchParams.get('propertyType');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    description: '',
    timeframe: 'flexible',
    preferredContact: 'phone',
    preferredTime: 'morning',
    propertyType: ''
  });

  // Use URL parameters to prefill the form when component mounts
  useEffect(() => {
    let initialDescription = '';
    
    if (propertyTypeParam) {
      // Convert property type ID to readable name
      const propertyTypeName = getPropertyTypeName(propertyTypeParam);
      initialDescription = `Property Type: ${propertyTypeName}\n\nProject Details:\n`;
    }
    
    if (serviceParam) {
      // Map service from URL to form dropdown options if needed
      const mappedService = mapServiceToFormOption(serviceParam);
      initialDescription += serviceParam ? `Service requested: ${serviceParam}\n` : '';
      
      setFormData(prev => ({
        ...prev,
        serviceType: mappedService,
        propertyType: propertyTypeParam || '',
        description: initialDescription
      }));
    } else if (propertyTypeParam) {
      // If only property type is provided
      setFormData(prev => ({
        ...prev,
        propertyType: propertyTypeParam,
        description: initialDescription
      }));
    }
  }, [serviceParam, propertyTypeParam]);
  
  // Map service parameter to form dropdown option
  const mapServiceToFormOption = (service: string): string => {
    const serviceMap: Record<string, string> = {
      'Kitchen Remodeling': 'kitchen',
      'Bathroom Remodeling': 'bathroom',
      'Flooring': 'flooring',
      'Flooring Installation': 'flooring',
      'Painting': 'painting',
      'Interior Painting': 'painting',
      'Exterior Painting': 'painting',
      'Room Additions': 'additions',
      'Home Additions': 'additions',
      'Demolition': 'demolition',
      'Demolition Services': 'demolition'
    };
    
    return serviceMap[service] || '';
  };
  
  // Function to convert property type ID to readable name
  const getPropertyTypeName = (propertyTypeId: string): string => {
    const propertyTypes: Record<string, string> = {
      'single-family': 'Single-Family Home',
      'townhouse': 'Townhouse',
      'condo-apt': 'Condo / Apartment',
      'multi-family': 'Multi-Family Home',
      'garage': 'Garage',
      'shed-barn': 'Shed / Barn'
    };
    
    return propertyTypes[propertyTypeId] || propertyTypeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Residential Quote Form submitted:', formData);
    // Basic feedback
    alert('Thank you for your quote request! We will contact you shortly.');
    // Reset form (optional)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      serviceType: '',
      description: '',
      timeframe: 'flexible',
      preferredContact: 'phone',
      preferredTime: 'morning',
      propertyType: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Residential Quote Request</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Get a personalized quote for your home project. Our team is here to help you every step of the way.
          </p>
          
          {/* Display property type if available */}
          {propertyTypeParam && (
            <div className="mt-4 inline-block bg-blue-800 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">Property Type: {getPropertyTypeName(propertyTypeParam)}</span>
            </div>
          )}
          
          {/* Display service if available */}
          {serviceParam && (
            <div className="mt-4 ml-2 inline-block bg-blue-800 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">Service: {serviceParam}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Request a Residential Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Property Type Selection (only if not provided in URL) */}
                  {!propertyTypeParam && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select property type</option>
                        <option value="single-family">Single-Family Home</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="condo-apt">Condo / Apartment</option>
                        <option value="multi-family">Multi-Family Home</option>
                        <option value="garage">Garage</option>
                        <option value="shed-barn">Shed / Barn</option>
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type*
                    </label>
                    <select
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a service</option>
                      <option value="kitchen">Kitchen Remodeling</option>
                      <option value="bathroom">Bathroom Remodeling</option>
                      <option value="flooring">Flooring Installation</option>
                      <option value="painting">Painting Services</option>
                      <option value="additions">Room Additions</option>
                      <option value="demolition">Demolition Services</option>
                      <option value="custom-cabinetry">Custom Cabinetry</option>
                      <option value="basement">Basement Finishing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your project and any specific requirements..."
                  ></textarea>
                </div>

                {/* Preferences */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Timeframe
                    </label>
                    <select
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="flexible">Flexible</option>
                      <option value="urgent">Urgent (ASAP)</option>
                      <option value="1month">Within 1 Month</option>
                      <option value="3months">Within 3 Months</option>
                      <option value="6months">Within 6 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="either">Either</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time to Contact
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 7PM)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Submit Residential Quote Request
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-900 mt-1" />
                  <div className="ml-4">
                    <p className="font-semibold">Phone</p>
                    <a href="/contact" className="text-blue-900 hover:text-blue-700">
                      Contact Us
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-900 mt-1" />
                  <div className="ml-4">
                    <p className="font-semibold">Email</p>
                    <a href="mailto:teamarxen@gmail.com" className="text-blue-900 hover:text-blue-700">
                      teamarxen@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-900 mt-1" />
                  <div className="ml-4">
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8AM - 6PM</p>
                    <p className="text-gray-600">Saturday - Sunday: 8AM - 6PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Promise */}
            <div className="bg-blue-900 text-white rounded-lg shadow-lg p-8 mt-6">
              <Calendar className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Response Promise</h3>
              <p className="text-blue-100">
                We'll get back to you within 24 hours to discuss your project and schedule a free consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentialQuote; 