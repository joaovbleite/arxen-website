import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define interfaces for different types of testimonials
interface GeneralTestimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

interface CommercialTestimonial {
  clientName: string;
  location: string;
  buildingType: string;
  service: string;
  text: string;
  rating: number;
}

interface ResidentialTestimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

// Centralized testimonials data to ensure consistency across the website
export const testimonials: GeneralTestimonial[] = [
  // Core areas - Marietta, Atlanta, Kennesaw
  {
    name: "Richard Martinez",
    location: "Atlanta, GA",
    text: "Lima Flooring completely transformed our office space with their high-quality flooring. The team was professional, efficient, and completed the project ahead of schedule.",
    rating: 5
  },
  {
    name: "Wei Zhang",
    location: "Atlanta, GA",
    text: "They completely transformed our kitchen with beautiful countertops and backsplash. The craftsmanship is outstanding!",
    rating: 5
  },
  {
    name: "Jamal Washington",
    location: "Atlanta, GA",
    text: "The attention to detail on our flooring project was exceptional. The team was courteous and professional throughout.",
    rating: 4.5
  },
  {
    name: "Jennifer Wong",
    location: "Marietta, GA",
    text: "We needed durable, slip-resistant flooring for our busy restaurant kitchen. Lima Flooring provided expert guidance and installed commercial-grade tile that has held up beautifully.",
    rating: 4.5
  },
  {
    name: "Michael Rodriguez",
    location: "Marietta, GA",
    text: "Lima Flooring made our home renovation stress-free. They helped us select the perfect flooring and installed it flawlessly.",
    rating: 5
  },
  {
    name: "Sophia Kim",
    location: "Marietta, GA",
    text: "From start to finish, our experience with Lima Flooring was exceptional. The quality of their work exceeded our expectations.",
    rating: 4
  },
  {
    name: "Marcus Johnson",
    location: "Kennesaw, GA",
    text: "Our retail store needed flooring that would look great while withstanding high foot traffic. Lima Flooring delivered with a solution that looks amazing and has been extremely durable.",
    rating: 5
  },
  {
    name: "Aisha Patel",
    location: "Kennesaw, GA",
    text: "The team at Lima Flooring was responsive, professional, and delivered exceptional quality work for our home renovation.",
    rating: 4.5
  },
  
  // Within 2 hours west, north, south, and 1.5 hours east
  {
    name: "David Lee",
    location: "Smyrna, GA",
    text: "The team's expertise in remodeling is unmatched. They transformed our kitchen into a modern masterpiece.",
    rating: 5
  },
  {
    name: "Lisa Anderson",
    location: "Alpharetta, GA",
    text: "Professional and punctual. The quality of work is top-notch, and the team is very friendly.",
    rating: 4
  },
  {
    name: "James Wilson",
    location: "Roswell, GA",
    text: "Great experience with the team. They were very responsive and completed the project ahead of schedule.",
    rating: 4.5
  },
  {
    name: "Maria Garcia",
    location: "Woodstock, GA",
    text: "The attention to detail and customer service is outstanding. Highly recommend their services.",
    rating: 5
  },
  {
    name: "Robert Brown",
    location: "Cartersville, GA",
    text: "The team's expertise in flooring and remodeling is evident in every project they undertake.",
    rating: 4
  },
  {
    name: "Patricia Moore",
    location: "Canton, GA",
    text: "Their attention to detail made all the difference in our home renovation project.",
    rating: 5
  },
  {
    name: "Kevin Martin",
    location: "Acworth, GA",
    text: "Extremely satisfied with both the quality of work and customer service. Would recommend to anyone.",
    rating: 4.5
  },
  {
    name: "Amanda Williams",
    location: "Peachtree City, GA",
    text: "Our flooring project was completed on time and within budget. The results are absolutely beautiful.",
    rating: 5
  },
  {
    name: "Olivia Sanchez",
    location: "Dahlonega, GA",
    text: "Even though we're a bit far from their base, they handled our kitchen remodel beautifully. Worth every penny!",
    rating: 4
  },
  {
    name: "Raj Patel",
    location: "Douglasville, GA",
    text: "The team was incredibly professional and efficient. Our new hardwood floors have transformed our home completely.",
    rating: 5
  },
  {
    name: "Elena Kowalski",
    location: "Rome, GA",
    text: "Despite being a bit further out, they made multiple trips to ensure our bathroom renovation was perfect. Highly impressed!",
    rating: 4.5
  },
  {
    name: "Daniel Thompson",
    location: "Duluth, GA",
    text: "The craftsmanship on our custom cabinets is second to none. We couldn't be happier with the result.",
    rating: 4.5
  },
  {
    name: "Aisha Williams",
    location: "Lawrenceville, GA",
    text: "The team completed our flooring project perfectly. They were respectful, tidy, and the end result is stunning.",
    rating: 4
  },
  {
    name: "John Schmidt",
    location: "Tucker, GA",
    text: "Our kitchen renovation was completed on schedule and exactly to our specifications. The attention to detail is remarkable.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    location: "Stone Mountain, GA",
    text: "The workmanship on our flooring project was exceptional. Every detail was perfectly executed.",
    rating: 4.5
  },
  {
    name: "Marcus Johnson",
    location: "Sandy Springs, GA",
    text: "Their design suggestions really helped us make the right choices for our home. The implementation was flawless.",
    rating: 5
  },
  {
    name: "Natalia Petrov",
    location: "Norcross, GA",
    text: "They completed our bathroom renovation with incredible attention to detail. The tilework is absolutely perfect.",
    rating: 4
  },
  {
    name: "Carlos Mendez",
    location: "Buford, GA",
    text: "From start to finish, the professionalism and quality of work was outstanding. Our new floors look amazing!",
    rating: 4.5
  },
  
  // Special inclusion - Augusta
  {
    name: "Thomas Wright",
    location: "Augusta, GA",
    text: "Despite the distance, they were worth the wait! Our kitchen renovation exceeded all expectations.",
    rating: 5
  },
  {
    name: "Oluwaseun Adebayo",
    location: "Augusta, GA",
    text: "We were hesitant due to the distance, but they made the process smooth and delivered exceptional quality on our home renovation.",
    rating: 4.5
  }
];

// Get commercial-specific testimonials
export const getCommercialTestimonials = (): CommercialTestimonial[] => {
  return [
    {
      clientName: "Richard Martinez",
      location: "Atlanta, GA",
      buildingType: "Office",
      service: "Flooring Installation",
      text: "Lima Flooring completely transformed our office space with their high-quality laminate flooring. The team was professional, efficient, and completed the project ahead of schedule. Our employees love the new look!",
      rating: 5
    },
    {
      clientName: "Jennifer Wong",
      location: "Marietta, GA",
      buildingType: "Restaurant",
      service: "Tile Installation",
      text: "We needed durable, slip-resistant flooring for our busy restaurant kitchen. Lima Flooring provided expert guidance and installed commercial-grade tile that has held up beautifully under heavy daily use.",
      rating: 4.5
    },
    {
      clientName: "Marcus Johnson",
      location: "Kennesaw, GA",
      buildingType: "Retail",
      service: "Vinyl Flooring",
      text: "Our retail store needed flooring that would look great while withstanding high foot traffic. Lima Flooring delivered with a luxury vinyl solution that looks amazing and has been extremely durable.",
      rating: 5
    },
    {
      clientName: "David Kim",
      location: "Atlanta, GA",
      buildingType: "Hotel",
      service: "Hardwood Flooring",
      text: "The hardwood flooring installed in our hotel lobby has received countless compliments from guests. Lima Flooring's craftsmanship and attention to detail truly elevated the aesthetic of our property.",
      rating: 5
    },
    {
      clientName: "Carlos Rodriguez",
      location: "Roswell, GA",
      buildingType: "Office",
      service: "Flooring Renovation",
      text: "Lima Flooring worked around our schedule to minimize disruption to our business. The team was professional and the quality of work exceeded our expectations.",
      rating: 4.5
    },
    {
      clientName: "Sarah Thompson",
      location: "Alpharetta, GA",
      buildingType: "Retail",
      service: "Custom Flooring Design",
      text: "We wanted a unique flooring design that reflected our brand identity. Lima Flooring created a custom solution that perfectly captured our vision and has become a talking point for our customers.",
      rating: 5
    },
    {
      clientName: "Michael Chen",
      location: "Decatur, GA",
      buildingType: "Restaurant",
      service: "Epoxy Flooring",
      text: "The epoxy flooring installed in our restaurant has been a game-changer. It's easy to clean, extremely durable, and the custom color perfectly matches our branding.",
      rating: 4.5
    },
    {
      clientName: "Emily Jackson",
      location: "Sandy Springs, GA",
      buildingType: "Gym",
      service: "Rubber Flooring",
      text: "Lima Flooring installed specialized rubber flooring throughout our fitness center. The quality is exceptional, providing both durability and sound dampening properties that our members appreciate.",
      rating: 4
    },
    {
      clientName: "Hassan Abdul",
      location: "Duluth, GA",
      buildingType: "Salon",
      service: "Decorative Concrete",
      text: "The decorative concrete flooring Lima installed has transformed our salon. It's not only beautiful but has proven to be incredibly durable even with the constant foot traffic and chemical exposure.",
      rating: 5
    },
    {
      clientName: "Lisa Washington",
      location: "Woodstock, GA",
      buildingType: "Childcare Center",
      service: "Safe Flooring Solutions",
      text: "Safety was our primary concern when selecting flooring for our childcare center. Lima Flooring recommended and installed the perfect solution that is both safe for children and easy to maintain.",
      rating: 4.5
    },
    {
      clientName: "Sanjay Gupta",
      location: "Tucker, GA",
      buildingType: "Medical Office",
      service: "Antimicrobial Flooring",
      text: "Lima Flooring's antimicrobial flooring solution for our medical office has been perfect. It's easy to sanitize, looks professional, and provides the safety our facility requires.",
      rating: 5
    },
    {
      clientName: "Thomas Johnson",
      location: "Augusta, GA",
      buildingType: "Hotel",
      service: "Corridor Carpeting",
      text: "Despite being outside their usual service area, Lima Flooring took on our hotel corridor carpeting project. The quality of work and sound-dampening properties of the carpet they installed has dramatically improved our guest experience.",
      rating: 4.5
    }
  ];
};

// Get residential-specific testimonials
export const getResidentialTestimonials = (): ResidentialTestimonial[] => {
  return [
    {
      name: "Jennifer Kim",
      location: "Atlanta, GA",
      text: "Lima Flooring transformed our outdated kitchen into a modern culinary space that our family loves. The attention to detail was remarkable!",
      rating: 5,
    },
    {
      name: "Michael Davis",
      location: "Marietta, GA",
      text: "We hired Lima Flooring for our bathroom remodel and couldn't be happier. They were professional, punctual, and the quality of work was exceptional.",
      rating: 5,
    },
    {
      name: "Sarah Thompson",
      location: "Kennesaw, GA",
      text: "Our basement finishing project was completed ahead of schedule and exactly as we envisioned. The Lima Flooring team was a pleasure to work with.",
      rating: 4.5,
    },
    {
      name: "Robert Jackson",
      location: "Smyrna, GA",
      text: "The home addition we received from Lima Flooring has completely changed how we use our space. They were communicative and detail-oriented throughout.",
      rating: 5,
    },
    {
      name: "Emily Liu",
      location: "Roswell, GA",
      text: "Lima Flooring's renovation of our main floor created an open concept that's perfect for entertaining. Their design suggestions were invaluable.",
      rating: 4.5,
    },
    {
      name: "Daniel Williams",
      location: "Alpharetta, GA",
      text: "The custom built-ins and shelving that Lima Flooring designed for our home office transformed the space. Their craftsmanship is top-notch.",
      rating: 5,
    },
    {
      name: "Sophia Rodriguez",
      location: "Sandy Springs, GA",
      text: "We had a wonderful experience with our kitchen remodel. The Lima Flooring team was responsive to our needs and the result is stunning.",
      rating: 4,
    }
  ];
};

// Helper function to render star ratings
export const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => {
    let starClass = "text-gray-300";
    
    if (index < Math.floor(rating)) {
      starClass = "text-yellow-400 fill-yellow-400";
    } else if (index < rating) {
      starClass = "text-yellow-400 fill-yellow-400 half-filled";
    }
    
    return (
      <svg 
        key={index}
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-4 h-4 ${starClass}`} 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  });
};

// Filter methods for different sections
export const getLocationTestimonials = (location: string): GeneralTestimonial[] => {
  return testimonials.filter(t => t.location.includes(location));
};

// Updated to use commercial testimonials which have the service property
export const getServiceTestimonials = (service: string): CommercialTestimonial[] => {
  return getCommercialTestimonials().filter(t => t.service.includes(service));
};

// Reusable Testimonial Carousel component 
interface TestimonialCarouselProps {
  testimonialsList: (GeneralTestimonial | CommercialTestimonial)[];
  title?: string;
  subtitle?: string;
  darkMode?: boolean;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ 
  testimonialsList, 
  title = "What Our Clients Say",
  subtitle,
  darkMode = false
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 mt-2">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`star-${i}`} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#CBD5E0" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <svg key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? testimonialsList.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      (prevIndex + 1) % testimonialsList.length
    );
  };

  return (
    <div className="testimonials-section" ref={carouselRef}>
      <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-center max-w-2xl mx-auto mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className="relative max-w-3xl mx-auto h-64">
        {testimonialsList.map((testimonial, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 z-10 translate-x-0 scale-100' 
                : index < currentIndex 
                  ? 'opacity-0 z-0 -translate-x-full scale-95' 
                  : 'opacity-0 z-0 translate-x-full scale-95'
            }`}
          >
            {/* Testimonial card */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-8 rounded-lg shadow-xl h-full flex flex-col justify-center items-center text-center border`}>
              <p className={`italic text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>"{testimonial.text}"</p>
              <div className="flex flex-col items-center">
                <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  - {'clientName' in testimonial ? testimonial.clientName : testimonial.name}, {testimonial.location}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {'service' in testimonial ? testimonial.service : ''}
                </p>
                {renderStars(testimonial.rating)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Dynamic progress bar and navigation */}
        <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-between">
          {/* Left navigation button */}
          <button 
            onClick={handlePrev}
            className={`mr-2 p-2 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } shadow-md`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Progress indicator with smoother transition */}
          <div className="flex-1 mx-2 bg-gray-300 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-800 ease-in-out"
              style={{ width: `${(currentIndex + 1) / testimonialsList.length * 100}%` }}
            ></div>
          </div>
          
          {/* Current position text */}
          <div className={`mx-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentIndex + 1}/{testimonialsList.length}
          </div>
          
          {/* Right navigation button */}
          <button 
            onClick={handleNext}
            className={`ml-2 p-2 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } shadow-md`}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel; 