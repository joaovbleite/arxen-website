import React, { useState } from 'react';
import { Calendar, FileText, Edit2, User, Mail, Phone, Building, Clock, AlertCircle, Home, Building2, Tag, MessageSquare, Calendar as CalendarIcon, CheckCircle, AlertTriangle, Shield, Hammer, Info, ShieldCheck, Award, Truck, HardHat } from 'lucide-react';
import { FormData } from '../../pages/FreeEstimate/FreeEstimate';

interface ReviewSubmitProps {
  formData: FormData;
  referenceNumber: string;
  updateFormData: (data: Partial<FormData>) => void;
}

// Map service IDs to readable names (matching the ones from ServiceSelection component)
const serviceNames: Record<string, string> = {
  'kitchen-remodeling': 'Kitchen Remodeling',
  'bathroom-renovation': 'Bathroom Renovation',
  'custom-cabinetry': 'Custom Cabinetry',
  'flooring': 'Flooring Installation',
  'interior-painting': 'Interior Painting',
  'home-additions': 'Home Additions',
  'basement-finishing': 'Basement Finishing',
  'demolition': 'Demolition Services',
  'office-renovation': 'Office Renovation',
  'retail-fit-out': 'Retail Fit-Outs',
  'commercial-build-out': 'Commercial Build-Outs'
};

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, referenceNumber, updateFormData }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ notes: e.target.value });
  };

  // Handle promo code change
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ 
      projectDetails: { 
        ...formData.projectDetails, 
        promoCode: e.target.value.toUpperCase().trim() 
      } 
    });
  };

  // Format the timeline
  const formatTimeline = () => {
    const { value, unit } = formData.timeline;
    return `${value} ${value === 1 ? unit.slice(0, -1) : unit}`;
  };

  // Format bytes to readable size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="py-4">
      {/* Header with success message */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8 shadow-md">
        <div className="flex items-start">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Almost There!</h2>
            <p className="text-blue-50">
              Please review your estimate request details one last time before submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Reference Number */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">REFERENCE NUMBER</p>
              <span className="text-xl text-blue-800 font-semibold tracking-wide">{referenceNumber}</span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Request Date</p>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Project Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Project Summary</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Project Type */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-md mr-2">
                  {formData.projectType === 'residential' ? 
                    <Home className="h-5 w-5 text-blue-600" /> : 
                    <Building2 className="h-5 w-5 text-blue-600" />
                  }
                </div>
                <h4 className="font-medium text-gray-700">Project Type</h4>
              </div>
              <div className="flex items-center">
                {formData.projectType === 'residential' ? (
                  <>
                    <Home className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-800 font-medium">Residential Project</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-800 font-medium">Commercial Project</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-md mr-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-700">Project Timeline</h4>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-gray-800 font-medium">Duration: {formatTimeline()}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-gray-600 text-sm">
                    Urgency: <span className="capitalize">{formData.projectDetails.urgency}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Services */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Selected Services</h4>
            <div className="flex flex-wrap gap-2">
              {formData.services.length > 0 ? (
                formData.services.map((serviceId) => (
                  <span key={serviceId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {serviceNames[serviceId] || serviceId}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No services selected.</span>
              )}
            </div>
          </div>
          
          {/* Project Description */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">
              Project Description
              {formData.projectDetails.referenceProject && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Based on Portfolio Project
                </span>
              )}
            </h4>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 whitespace-pre-wrap">
              {formData.projectDetails.description || "No description provided."}
            </div>
            
            {/* Reference Project Info */}
            {formData.projectDetails.referenceProject && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center text-sm text-blue-700">
                  <Info className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  <span>This request is based on our <span className="font-medium">{formData.projectDetails.referenceProject?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span> project from our portfolio. We'll use this as reference during our consultation.</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Files */}
          {formData.files.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Attached Files</h4>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  {formData.files.map((file, index) => (
                    <li key={index} className="py-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-blue-50 mr-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700">{file.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatBytes(file.size)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contact Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-gray-700">Name</h4>
              </div>
              <p className="text-gray-800">
                {formData.contactInfo.name || "Not provided"}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-gray-700">Email</h4>
              </div>
              <p className="text-gray-800">
                {formData.contactInfo.email ? (
                  <a href={`mailto:${formData.contactInfo.email}`} className="text-blue-600 hover:underline">
                    {formData.contactInfo.email}
                  </a>
                ) : "Not provided"}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Phone className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-gray-700">Phone</h4>
              </div>
              <p className="text-gray-800">
                {formData.contactInfo.phone ? (
                  <a href={`tel:${formData.contactInfo.phone}`} className="text-blue-600 hover:underline">
                    {formData.contactInfo.phone}
                  </a>
                ) : "Not provided"}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Building className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="font-medium text-gray-700">Company</h4>
              </div>
              <p className="text-gray-800">
                {formData.contactInfo.company || "Not provided"}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="font-medium text-gray-700">Preferred Contact Method</h4>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              {formData.contactInfo.preferredContact === 'email' ? (
                <>
                  <Mail className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">Email</span>
                </>
              ) : formData.contactInfo.preferredContact === 'phone' ? (
                <>
                  <Phone className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">Phone</span>
                </>
              ) : formData.contactInfo.preferredContact === 'message' ? (
                <>
                  <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">Message (SMS)</span>
                </>
              ) : (
                <span className="text-gray-500 italic">Not specified</span>
              )}
            </div>
            
            {formData.contactInfo.preferredTime && (
              <div className="mt-3 text-sm text-gray-700">
                <span className="font-medium">Preferred Time: </span>
                <span className="capitalize">{formData.contactInfo.preferredTime}</span>
              </div>
            )}
            
            {formData.contactInfo.additionalContactInfo && (
              <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">{formData.contactInfo.additionalContactInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notes & Promo Code Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Additional Notes */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Additional Notes</h3>
          </div>
          <div className="p-6">
            <textarea
              value={formData.notes}
              onChange={handleNotesChange}
              placeholder="Any additional information you'd like to share with us..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-y"
            ></textarea>
          </div>
        </div>
        
        {/* Promo Code */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Promotional Code</h3>
          </div>
          <div className="p-6">
            <div className="mb-3">
              <label htmlFor="promo-code" className="sr-only">Promotional Code</label>
              <input
                id="promo-code"
                type="text"
                value={formData.projectDetails.promoCode || ''}
                onChange={handlePromoCodeChange}
                placeholder="Enter promo code (e.g., ARX25)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase tracking-wider"
              />
            </div>
            <p className="text-sm text-gray-600">
              If you have a promotional code, enter it here to apply any available discounts to your project quote.
            </p>
            
            {/* Add ARX25 discount callout */}
            <div className="mt-3 bg-orange-100 border border-orange-200 rounded-lg p-3">
              <p className="text-sm font-medium text-orange-800">
                <span className="font-bold">Special Offer!</span> Use code <code className="bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded">ARX25</code> during your consultation to get <strong className="text-orange-700">10% OFF</strong> labor costs on your first project!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MOVED: Project Timeline & Expectations */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Project Timeline & Expectations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col items-center text-center border border-blue-100 shadow-sm">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Planning Phase</h4>
            <p className="text-sm text-gray-600">After submission, we'll schedule a consultation within 24-48 hours to discuss your project in detail.</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col items-center text-center border border-blue-100 shadow-sm">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <Hammer className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Execution Phase</h4>
            <p className="text-sm text-gray-600">Once approved, we'll coordinate materials and schedule the work with minimal disruption to your routine.</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-5 flex flex-col items-center text-center border border-blue-100 shadow-sm">
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Completion Phase</h4>
            <p className="text-sm text-gray-600">After project completion, we'll conduct a final walkthrough to ensure everything meets your satisfaction.</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            Timeline Expectations
          </h4>
          <ul className="text-sm text-gray-600 space-y-2 pl-6 list-disc">
            <li>Initial consultation: 1-2 hours</li>
            <li>Detailed estimate preparation: 2-3 business days</li>
            <li>Project start date: Typically 1-4 weeks after approval (depending on scope and materials)</li>
            <li>Regular progress updates throughout the project</li>
            <li>Final walkthrough and quality check upon completion</li>
          </ul>
        </div>
      </div>
      
      {/* SECTION MOVED: Safety & Quality Standards */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <ShieldCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Safety & Quality Standards</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 rounded-lg p-5 border border-green-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h4 className="font-medium text-gray-800">Licensed & Insured</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              All our work is performed by licensed professionals who are fully insured for your protection. We maintain comprehensive liability insurance and workers' compensation coverage.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Licensed</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Insured</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Bonded</span>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Award className="h-6 w-6 text-indigo-600 mr-2" />
              <h4 className="font-medium text-gray-800">Quality Guarantee</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              We stand behind our workmanship with a comprehensive quality guarantee. All installations and workmanship are backed by our satisfaction guarantee and manufacturer warranties.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Satisfaction Guarantee</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Manufacturer Warranty</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
            <HardHat className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">Safety-First Approach</span>
          </div>
          
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
            <Truck className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">Premium Materials</span>
          </div>
          
          <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
            <Clock className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
            <span className="text-sm text-gray-700">Timely Completion</span>
          </div>
        </div>
      </div>
      
      {/* Terms & Conditions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Terms & Conditions</h3>
        </div>
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <p className="text-gray-800 font-medium mb-1">Please Review Before Submitting</p>
                <p className="text-gray-600 text-sm">
                  By submitting this form, you agree to our terms and conditions and privacy policy. This estimate request is non-binding.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="terms-checkbox" className="ml-2 text-sm text-gray-700">
              I agree to the <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit; 