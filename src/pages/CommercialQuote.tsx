import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CommercialQuote: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Extract URL parameters
  const serviceParam = searchParams.get('service');
  const buildingTypeParam = searchParams.get('buildingType');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    serviceType: '',
    description: '',
    timeframe: '',
    contactMethod: '',
    bestTime: '',
    buildingType: ''
  });

  // Use URL parameters to prefill the form when component mounts
  useEffect(() => {
    let initialDescription = '';
    
    if (buildingTypeParam) {
      // Convert building type ID to readable name
      const buildingTypeName = getBuildingTypeName(buildingTypeParam);
      initialDescription = `Project for ${buildingTypeName}.\n\nProject Details:\n`;
    }
    
    if (serviceParam) {
      // Use the service from URL parameters and add to description
      initialDescription += serviceParam ? `Service requested: ${serviceParam}\n` : '';
    }
    
    setFormData(prev => ({
      ...prev,
      serviceType: serviceParam || '',
      buildingType: buildingTypeParam || '',
      description: initialDescription
    }));
  }, [serviceParam, buildingTypeParam]);
  
  // Function to convert building type ID to readable name
  const getBuildingTypeName = (buildingTypeId: string): string => {
    const buildingTypes: Record<string, string> = {
      'office': 'Office Building',
      'medical': 'Medical Office',
      'dental': 'Dental Office',
      'retail': 'Retail Store',
      'restaurant': 'Restaurant',
      'hotel': 'Hotel',
      'warehouse': 'Warehouse',
      'healthcare': 'Healthcare Facility',
      'fitness': 'Fitness Center',
      'school': 'School or University',
      // Add more building types as needed
    };
    
    return buildingTypes[buildingTypeId] || buildingTypeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commercial Quote Form submitted:', formData);
    // Basic feedback
    alert('Thank you for your commercial quote request! We will be in touch soon.');
    // Reset form (optional)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      serviceType: '',
      description: '',
      timeframe: 'flexible',
      contactMethod: '',
      bestTime: '',
      buildingType: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Commercial Quote Request</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Get a tailored quote for your commercial project. Our team is ready to assist you with all your business needs.
          </p>
          
          {/* Display building type if available */}
          {buildingTypeParam && (
            <div className="mt-4 inline-block bg-blue-800 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">Building Type: {getBuildingTypeName(buildingTypeParam)}</span>
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
              <h2 className="text-2xl font-bold mb-6">Request a Commercial Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* Building Type Selection (hidden if already selected from URL) */}
                {!buildingTypeParam && (
                  <select
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Building Type</option>
                    <option value="office">Office Building</option>
                    <option value="medical">Medical Office</option>
                    <option value="dental">Dental Office</option>
                    <option value="retail">Retail Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="healthcare">Healthcare Facility</option>
                    <option value="fitness">Fitness Center</option>
                    <option value="school">School or University</option>
                  </select>
                )}
                
                {/* Service Type Selection (pre-selected if from URL) */}
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Service Type</option>
                  <option value="office-renovations">Office Renovations</option>
                  <option value="retail-fit-outs">Retail Fit-Outs</option>
                  <option value="industrial-solutions">Industrial Solutions</option>
                  <option value="Custom Cabinetry">Custom Cabinetry</option>
                  <option value="Flooring">Flooring Services</option>
                  <option value="Bathroom Remodeling">Bathroom Remodeling</option>
                  <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                </select>
                
                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <input
                  type="text"
                  name="timeframe"
                  placeholder="Project Timeframe"
                  value={formData.timeframe}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Preferred Contact Method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
                <input
                  type="text"
                  name="bestTime"
                  placeholder="Best Time to Contact"
                  value={formData.bestTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 rounded-lg transition-colors"
                >
                  Submit Request
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

export default CommercialQuote; 