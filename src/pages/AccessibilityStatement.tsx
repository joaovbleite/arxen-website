import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessibilityStatement: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Accessibility Statement</h1>
          <div className="flex items-center text-sm text-blue-200">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Accessibility</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Accessibility</h2>
            <p className="text-gray-700 mb-4">
              Arxen Construction is committed to ensuring digital accessibility for people with disabilities. We are continually 
              improving the user experience for everyone, and applying the relevant accessibility standards.
            </p>
            <p className="text-gray-700 mb-4">
              We strive to ensure that our website follows the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
              These guidelines explain how to make web content more accessible to people with a wide array of disabilities.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Measures We Take</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Provide text alternatives for non-text content</li>
              <li>Ensure content can be presented in different ways without losing meaning</li>
              <li>Make it easier for users to see and hear content by providing sufficient contrast</li>
              <li>Provide users enough time to read and use content</li>
              <li>Help users navigate and find content with clear page structures</li>
              <li>Make text content readable and understandable</li>
              <li>Ensure content appears and operates in predictable ways</li>
              <li>Help users avoid and correct mistakes</li>
              <li>Maximize compatibility with current and future tools</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Using Our Website</h2>
            <p className="text-gray-700 mb-4">
              We've designed our website with accessibility in mind. Here are some features:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Alt text for images and meaningful content</li>
              <li>Descriptive links and proper heading structures</li>
              <li>Keyboard navigation support</li>
              <li>Color contrast considerations</li>
              <li>Responsive design that works on various devices and screen sizes</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compatibility with Assistive Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website aims to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Screen readers (including NVDA, JAWS, and VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Contact Information</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback on the accessibility of our website. If you encounter accessibility barriers 
              or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <ChevronRight className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-700">accessibility@arxenconstruction.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <ChevronRight className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-700">(770) 123-4567</div>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mt-4">
              We aim to respond to feedback within 2 business days.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Continuous Improvement</h2>
            <p className="text-gray-700 mb-4">
              We are committed to ongoing accessibility improvements. This statement was last updated on {new Date().toLocaleDateString()}.
            </p>
            <div className="mt-8">
              <Link 
                to="/contact" 
                className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Contact Us With Questions
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement; 