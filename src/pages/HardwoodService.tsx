import React, { useState } from 'react';
import { Star, Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HardwoodService = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      name: 'Basic Installation',
      price: '$6-8/sq ft',
      features: [
        'Professional installation',
        'Basic wood options',
        'Standard warranty',
        'Basic floor preparation'
      ]
    },
    {
      name: 'Premium Installation',
      price: '$8-12/sq ft',
      features: [
        'Professional installation',
        'Premium wood selection',
        'Extended warranty',
        'Advanced floor preparation',
        'Furniture moving service',
        'Old flooring removal'
      ]
    },
    {
      name: 'Luxury Custom',
      price: '$12+/sq ft',
      features: [
        'Professional installation',
        'Exotic wood options',
        'Lifetime warranty',
        'Complete floor preparation',
        'Furniture moving service',
        'Old flooring removal',
        'Custom patterns and designs',
        'Premium finishing options'
      ]
    }
  ];

  const handleSchedule = (packageName: string) => {
    setSelectedPackage(packageName);
    // Here you would typically handle the scheduling logic
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-white mb-8 hover:text-gray-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-6">Hardwood Flooring Services</h1>
          <p className="text-xl max-w-2xl">
            Transform your space with our premium hardwood flooring solutions. 
            We offer expert installation, superior materials, and outstanding craftsmanship.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Hardwood Flooring?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                description: 'We use only the highest quality hardwood materials from trusted suppliers.'
              },
              {
                title: 'Expert Installation',
                description: 'Our certified installers have years of experience in hardwood flooring.'
              },
              {
                title: 'Long-lasting Beauty',
                description: 'Properly installed hardwood floors can last for generations.'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Packages */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <p className="text-3xl font-bold text-blue-900 mb-6">{pkg.price}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSchedule(pkg.name)}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    selectedPackage === pkg.name
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-900 hover:bg-blue-800'
                  } text-white`}
                >
                  {selectedPackage === pkg.name ? 'Selected' : 'Schedule Consultation'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Recent Work</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&q=80'
            ].map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Hardwood flooring example ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Get a Free Quote</h2>
          <div className="max-w-lg mx-auto">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                required
              />
              <input
                type="tel"
                placeholder="Your Phone"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                required
              />
              <textarea
                placeholder="Project Details"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Request Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwoodService; 