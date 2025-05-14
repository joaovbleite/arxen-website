import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sitemap = () => {
  // Define all site sections and pages
  const mainSections = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Residential Services', path: '/residential' },
        { name: 'Commercial Services', path: '/free-estimate?projectType=commercial' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Free Estimate', path: '/free-estimate' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Blog', path: '/blog' },
        { name: 'Offers', path: '/offers' },
        { name: 'Financing', path: '/financing' }
      ]
    },
    {
      title: 'Service Categories',
      links: [
        { name: 'Remodeling', path: '/services/category/remodeling' },
        { name: 'Painting Services', path: '/services/category/painting-services' },
        { name: 'Flooring', path: '/services/category/flooring' },
        { name: 'Stairs & Railings', path: '/services/category/stairs-railings' },
        { name: 'Interior Finishing', path: '/services/category/interior-finishing' },
        { name: 'Exterior Construction', path: '/services/category/exterior-construction' },
        { name: 'Demolition & Prep', path: '/services/category/demolition-prep' }
      ]
    },
    {
      title: 'Popular Services',
      links: [
        { name: 'Kitchen Remodeling', path: '/services/kitchen-remodeling' },
        { name: 'Bathroom Remodeling', path: '/services/bathroom-remodeling' },
        { name: 'Hardwood Flooring', path: '/services/hardwood' },
        { name: 'Tile Installation', path: '/services/tile' },
        { name: 'Interior Painting', path: '/services/interior-painting' },
        { name: 'Custom Cabinetry', path: '/services/custom-cabinetry' },
        { name: 'Deck Building', path: '/services/deck' },
        { name: 'Window Installation', path: '/services/windows' }
      ]
    },
    {
      title: 'Tools & Resources',
      links: [
        { name: 'Visualize It', path: '/visualizer' },
        { name: 'My Projects', path: '/my-projects' }
      ]
    },
    {
      title: 'Legal Information',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Sitemap</h1>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-blue-900 border-b pb-2">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="hover:bg-gray-50 rounded transition-colors">
                    <Link to={link.path} className="flex items-center py-1 px-2 text-gray-700 hover:text-blue-900">
                      <ChevronRight className="w-4 h-4 mr-1 text-blue-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Looking for something specific?</h2>
          <p className="text-gray-700 mb-6">If you can't find what you're looking for, try using our search or contact us directly.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/contact" className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Contact Us
            </Link>
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap; 