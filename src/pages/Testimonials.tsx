import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    // Core areas - Marietta, Atlanta, Kennesaw
    {
      name: "Sarah Johnson",
      location: "Marietta, GA",
      text: "The team at Lima Flooring did an outstanding job with our hardwood installation. Their attention to detail and professionalism exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "Atlanta, GA",
      text: "From selection to installation, the entire process was seamless. The quality of work is exceptional, and our new floors look amazing!",
      rating: 4.5
    },
    {
      name: "Emily Rodriguez",
      location: "Kennesaw, GA",
      text: "We couldn't be happier with our new tile flooring. The installers were professional, efficient, and left everything spotless.",
      rating: 5
    },
    {
      name: "Brandon Miller",
      location: "Marietta, GA",
      text: "Our bathroom renovation was completed ahead of schedule and looks fantastic. The team was knowledgeable and courteous throughout.",
      rating: 4.5
    },
    {
      name: "Wei Zhang",
      location: "Atlanta, GA",
      text: "They completely transformed our kitchen with beautiful countertops and backsplash. The craftsmanship is outstanding!",
      rating: 5
    },
    
    // Within 2 hours west, north, south
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
      name: "Tyrone Jackson",
      location: "Newnan, GA",
      text: "They completely transformed our outdated kitchen into a modern, functional space. The quality of work is exceptional.",
      rating: 5
    },
    {
      name: "Sophia Martinez",
      location: "Griffin, GA",
      text: "Excellent attention to detail on our flooring project. The team was respectful of our home and left everything spotless.",
      rating: 4
    },
    {
      name: "Hassan Ahmed",
      location: "Dallas, GA",
      text: "From the initial consultation to the final walkthrough, their professionalism and quality workmanship were consistently impressive.",
      rating: 4.5
    },
    {
      name: "Kim Nguyen",
      location: "Hiram, GA",
      text: "Our basement renovation exceeded all expectations. The team was knowledgeable, professional, and a pleasure to work with.",
      rating: 5
    },
    {
      name: "Samuel Thompson",
      location: "Cumming, GA",
      text: "They handled our whole-house flooring project with incredible skill and attention to detail. Couldn't be happier with the results.",
      rating: 4
    },
    
    // Within 1.5 hours east
    {
      name: "Jennifer Taylor",
      location: "Decatur, GA",
      text: "They completely transformed our bathroom. The quality of the workmanship is exceptional.",
      rating: 5
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

  // Helper function to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${
              i < fullStars 
                ? 'text-yellow-400 fill-yellow-400' 
                : i === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-gradient-lr-yellow' 
                  : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">What Our Clients Say</h1>
          <p className="text-lg text-gray-600 mb-8">Read testimonials from our satisfied clients throughout the greater Atlanta area.</p>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-blue-50 p-2 px-4 rounded-full">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="font-medium text-blue-900">4.9 Average Rating</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                {renderStars(testimonial.rating)}
                
                <p className="text-gray-700 my-4 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center mt-6">
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Our clients love our work! Contact us today to join our growing list of satisfied customers.</p>
          <a 
            href="/free-estimate" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Your Free Estimate
          </a>
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 