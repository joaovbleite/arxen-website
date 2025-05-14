import React, { useState } from 'react';
import { TestimonialCarousel, getResidentialTestimonials } from '../components/TestimonialsManager';

const ResidentialServicePage: React.FC = () => {
  // Get testimonials from central manager
  const residentialTestimonials = getResidentialTestimonials();

  return (
    <div className="residential-service-page">
      <div className="testimonials-section">
        <TestimonialCarousel
          testimonialsList={residentialTestimonials}
          title="What Our Residential Clients Say"
          darkMode={true}
        />
      </div>
    </div>
  );
};

export default ResidentialServicePage; 