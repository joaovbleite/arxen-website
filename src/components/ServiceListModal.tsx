import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

// Define a type for SVG and HTML elements that can accept className
type IconElementProps = {
  className?: string;
  [key: string]: any;
};

// Element type that can be cloned and accept className
type IconElement = React.ReactElement<IconElementProps>;

// Define the Service interface (can be imported if shared)
interface Service {
  title: string;
  path: string;
  description: string;
  icon?: IconElement; // Make icon optional as it might not be in all contexts
}

interface ServiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  services: Service[];
  projectType?: 'residential' | 'commercial'; // To construct correct link
  categoryIcon?: IconElement; // Optional: pass category icon for consistency
}

const ServiceListModal: React.FC<ServiceListModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  services, 
  projectType = 'residential',
  categoryIcon
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast backdrop-blur-sm"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            {categoryIcon && (
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                 {categoryIcon && React.cloneElement(categoryIcon, { className: "w-5 h-5 text-blue-700" })}
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800">{title} Services</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable List */}
        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <Link 
                to={`${service.path}?projectType=${projectType}`} 
                key={service.title + index} // Use index if titles aren't unique
                className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-300 h-full bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm group`}
                onClick={onClose} // Close modal when a service is clicked
              >
                {/* Use service icon if available, else category icon */}
                <div className="mr-4 flex-shrink-0 text-blue-600">
                  {service.icon ? 
                    React.cloneElement(service.icon, { className: "w-6 h-6" }) :
                    categoryIcon && React.cloneElement(categoryIcon, { className: "w-6 h-6" })
                  }
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium mb-1 text-gray-800 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                  <p className="text-gray-500 text-xs">{service.description}</p>
                </div>
                <div className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1 duration-300 self-center">
                   <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Modal Footer (Optional) */}
        {/* Can add a close button here too if needed */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceListModal; 