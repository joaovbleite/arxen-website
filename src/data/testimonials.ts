import { testimonials as generalTestimonials } from '../components/TestimonialsManager';
import { getCommercialTestimonials, getResidentialTestimonials } from '../components/TestimonialsManager';

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  service?: string;
  buildingType?: string;
}

const combined = [
  ...generalTestimonials,
  ...getCommercialTestimonials(),
  ...getResidentialTestimonials()
] as Testimonial[];

// Deduplicate by unique key (name + text)
const uniqueMap = new Map<string, Testimonial>();
combined.forEach(t => {
  const key = `${t.name}|${t.text}`;
  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, t);
  }
});

export const allTestimonials: Testimonial[] = Array.from(uniqueMap.values());

// Helper function to get a shuffled copy of testimonials
export const getShuffledTestimonials = () => {
  // Create a copy to avoid mutating the original
  const testimonialsCopy = [...allTestimonials];
  
  // Modern Fisher-Yates shuffle algorithm
  for (let i = testimonialsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [testimonialsCopy[i], testimonialsCopy[j]] = [testimonialsCopy[j], testimonialsCopy[i]];
  }
  
  return testimonialsCopy;
};

// Define the testimonial interface for TypeScript
export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
} 