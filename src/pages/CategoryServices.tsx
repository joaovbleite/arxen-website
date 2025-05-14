import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Building, Paintbrush, Hammer as HammerIcon, Box, Phone, Star, CheckCircle } from 'lucide-react';

// Define the structure of a single service
interface Service {
  title: string;
  description: string;
  path: string;
  image?: string; 
  icon?: React.ElementType; // Optional: Add icon field
  features?: string[];
}

// Define the structure of a service category
interface ServiceCategory {
  category: string;
  services: Service[];
  categoryDescription?: string; // Optional: Add category description
  icon?: React.ElementType; // Optional: Add category icon
}

// Define the props for the CategoryServices component
interface CategoryServicesProps {
  services: ServiceCategory[];
}

// Example mapping of category names to icons (adjust as needed)
const categoryIcons: { [key: string]: React.ElementType } = {
  "Remodeling": HammerIcon,
  "Interior Services": Paintbrush,
  "Flooring": Box,
  "Exterior Services": Building,
  "Demolition & Prep": HammerIcon,
};

// Sample FAQs for each category
const categoryFaqs: { [key: string]: Array<{question: string, answer: string}> } = {
  "Remodeling": [
    {
      question: "How long does a typical remodeling project take?",
      answer: "Project timelines vary by scope and complexity. A kitchen remodel typically takes 4-8 weeks, while a bathroom remodel can take 2-4 weeks. During your consultation, we'll provide a detailed timeline specific to your project."
    },
    {
      question: "Do I need to move out during a remodeling project?",
      answer: "Most projects don't require you to vacate your home. We create containment areas and manage dust to minimize disruption. For major renovations, we'll discuss logistics and whether temporary relocation might be beneficial."
    },
    {
      question: "How do you handle unexpected issues during remodeling?",
      answer: "Our experienced team anticipates potential challenges, but surprises can occur, especially in older homes. We maintain transparent communication and will promptly discuss any issues, providing solutions and cost implications before proceeding."
    }
  ],
  "Interior Services": [
    {
      question: "How long does interior painting take?",
      answer: "A typical interior painting project for an average-sized room takes 1-2 days. Multiple rooms or entire homes are scheduled accordingly, and we'll provide a specific timeframe during your consultation."
    },
    {
      question: "Do you provide color consultation?",
      answer: "Yes, our professional design consultants can help you select colors that complement your space and reflect your style preferences."
    }
  ],
  "Flooring": [
    {
      question: "Which flooring is best for high-traffic areas?",
      answer: "For high-traffic areas, we recommend luxury vinyl plank, porcelain tile, or engineered hardwood. These options offer durability and ease of maintenance while providing aesthetic appeal."
    },
    {
      question: "Can you install flooring over existing floors?",
      answer: "In many cases, yes. The feasibility depends on the condition of your existing floor and the type of new flooring you've selected. Our experts will assess your specific situation during the consultation."
    }
  ],
  "Exterior Services": [
    {
      question: "How often should exterior paint be renewed?",
      answer: "Most exterior paint jobs last 5-10 years depending on your climate, sun exposure, and paint quality. We recommend a professional assessment if you notice fading, cracking, or peeling."
    },
    {
      question: "Do you help with permits for exterior projects?",
      answer: "Yes, we handle the permitting process for all projects that require permits, including deck construction, window installations, and structural modifications."
    }
  ],
  "Demolition & Prep": [
    {
      question: "How do you handle dust and debris during demolition?",
      answer: "We use containment systems, air scrubbers, and daily cleanup protocols to minimize dust and debris. Our team takes extensive precautions to protect unaffected areas of your property."
    },
    {
      question: "Do you offer debris removal as part of demolition services?",
      answer: "Yes, complete debris removal and responsible disposal are included in our demolition services. We handle all logistics, leaving your property clean and ready for the next phase."
    }
  ]
};

const CategoryServices: React.FC<CategoryServicesProps> = ({ services }) => {
  const { categoryName } = useParams<{ categoryName: string }>();

  // Helper function to format category name from URL param
  const formatCategoryName = (param: string | undefined): string => {
    if (!param) return "Unknown Category";
    return param.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formattedCategoryName = formatCategoryName(categoryName);

  // Find the matching category object
  const categoryData = services.find(cat => 
    cat.category.toLowerCase().replace(/\s+/g, '-') === categoryName
  );

  const CategoryIcon = categoryIcons[formattedCategoryName] || Building; // Fallback icon

  // Use description from data if available, otherwise generate placeholder
  const description = categoryData?.categoryDescription || `Explore our range of professional ${formattedCategoryName} services. We offer tailored solutions to meet your specific needs, ensuring quality and satisfaction.`;

  // Get FAQs for this category or use generic ones
  const faqs = categoryFaqs[formattedCategoryName] || [
    {
      question: "What areas do you service?",
      answer: "We service the greater metropolitan area and surrounding suburbs, typically within a 50-mile radius of our main office."
    },
    {
      question: "Are you licensed and insured?",
      answer: "Yes, our company is fully licensed, bonded, and insured. We maintain comprehensive coverage to protect both our clients and our team."
    }
  ];

  // Process steps - could be customized per category in the future
  const processSteps = [
    { title: "Consultation", description: "We meet to discuss your needs, goals, and budget for your project." },
    { title: "Estimate & Proposal", description: "We provide a detailed quote and project timeline for your approval." },
    { title: "Design & Planning", description: "Our team creates detailed plans and selects materials for your project." },
    { title: "Professional Execution", description: "Our skilled craftsmen complete your project with attention to detail." },
    { title: "Final Walkthrough", description: "We ensure everything meets our standards and your expectations." }
  ];

  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-900">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-blue-900 font-medium">{formattedCategoryName}</span>
        </div>

        {/* Enhanced Category Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-8 rounded-lg shadow-lg mb-12 flex items-center">
          <CategoryIcon className="w-12 h-12 mr-6 flex-shrink-0 opacity-80" />
          <div>
            <h1 className="text-4xl font-bold mb-2">{formattedCategoryName} Services</h1>
            <p className="text-blue-100 text-lg">{description}</p>
          </div>
        </div>
        
        {/* Main grid with services and sidebar */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content (Left) - Compact Grid */}
          <main className="lg:col-span-3">
            {categoryData && categoryData.services.length > 0 ? (
              <>
                {/* Featured Service - First service highlighted */}
                {categoryData.services[0] && (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-12">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img 
                          src={categoryData.services[0].image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'} 
                          alt={categoryData.services[0].title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-8 md:w-1/2">
                        <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Featured Service</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{categoryData.services[0].title}</h2>
                        <p className="text-gray-600 mb-6">{categoryData.services[0].description}</p>
                        {categoryData.services[0].features && (
                          <ul className="mb-6 space-y-2">
                            {categoryData.services[0].features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link 
                          to={categoryData.services[0].path}
                          className="inline-flex items-center px-5 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          View Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid of remaining services */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All {formattedCategoryName} Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {categoryData.services.map((service, index) => (
                    <div key={index} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200">
                      {/* Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={service.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors">{service.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-grow">
                          {service.description}
                        </p>
                        <Link 
                          to={service.path}
                          className="inline-flex items-center self-start text-sm font-medium text-blue-700 hover:text-blue-900 group-hover:underline"
                        >
                          Learn More <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Our Process Section */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Our {formattedCategoryName} Process</h2>
                  <div className="relative">
                    {/* Process Timeline Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-600 hidden md:block"></div>
                    
                    <div className="space-y-12">
                      {processSteps.map((step, index) => (
                        <div key={index} className="flex flex-col md:flex-row">
                          <div className="md:w-32 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                            <div className="w-10 h-10 rounded-full border-4 border-blue-600 bg-white text-blue-600 flex items-center justify-center font-bold text-lg z-10">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="divide-y divide-gray-200">
                    {faqs.map((faq, index) => (
                      <div key={index} className="py-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
                <p className="text-center text-lg text-gray-600">
                  No services currently listed for "{formattedCategoryName}". Please check back later or contact us for more information.
                </p>
              </div>
            )}
          </main>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-24 space-y-6">
              {/* Quote CTA Box */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Request a Quote</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get a personalized quote for your {formattedCategoryName.toLowerCase()} project.
                </p>
                 <Link 
                  to={`/quote?service=${encodeURIComponent(formattedCategoryName)}`} 
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
                >
                  Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              {/* Contact Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="textlg font-semibold text-gray-800 mb-4">Questions?</h3>
                <div className="flex items-center mb-4">
                  <Phone className="w-5 h-5 text-blue-700 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Call us directly:</p>
                    <a href="/contact" className="text-base font-medium text-blue-700 hover:text-blue-900">
                      Contact Us
                    </a>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Service hours:</p>
                  <p className="text-sm text-gray-800">Mon-Fri: 8am-6pm</p>
                  <p className="text-sm text-gray-800">Sat-Sun: 8am-6pm</p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Feedback</h3>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic mb-4">
                  "The team was professional and timely. Our {formattedCategoryName.toLowerCase()} project was completed beautifully and on budget. Highly recommend!"
                </p>
                <p className="text-sm font-medium">- Sarah J., Atlanta</p>
              </div>
              
              {/* Other Categories Links */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Explore Other Services</h3>
                 <ul className="space-y-1">
                   {services.filter(cat => cat.category !== formattedCategoryName).map(otherCategory => (
                     <li key={otherCategory.category}>
                       <Link 
                         to={`/services/category/${otherCategory.category.toLowerCase().replace(/\s+/g, '-')}`}
                         className="flex justify-between items-center text-sm py-1 text-blue-700 hover:text-blue-900 hover:underline"
                       >
                         {otherCategory.category}
                         <ChevronRight className="w-4 h-4" />
                       </Link>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryServices; 