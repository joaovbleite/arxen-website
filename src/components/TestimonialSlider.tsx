import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const sliderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // No auto-rotation or effect dependencies that might trigger on scroll
  
  // Ensure these handlers don't depend on any state that might change during scroll
  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, [isAnimating, testimonials.length]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [isAnimating, testimonials.length]);

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Safely access the current testimonial with a fallback
  const safeIndex = ((currentIndex % testimonials.length) + testimonials.length) % testimonials.length;
  const currentTestimonial = testimonials[safeIndex] || testimonials[0];

  return (
    <div className="relative overflow-hidden max-w-5xl mx-auto" ref={sliderRef}>
      {/* Testimonial Slides */}
      <div 
        className="relative w-full overflow-hidden min-h-[350px] md:min-h-[300px] bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg"
      >
        {/* Animated slide container with improved transitions */}
        <div 
          className="transition-all duration-1000 ease-in-out"
          style={{ 
            transform: isAnimating 
              ? `translateX(${direction === 'next' ? '-100%' : '100%'})` 
              : 'translateX(0)',
            opacity: isAnimating ? 0.5 : 1
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="px-8 py-12 md:px-16 md:py-14">
            {/* Quote icon */}
            <div className="absolute top-8 left-8 md:top-10 md:left-10 opacity-10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11L8 17H5L7 11H5V5H11V11H10ZM18 11L16 17H13L15 11H13V5H19V11H18Z" fill="currentColor" className="text-blue-900" />
              </svg>
            </div>

            {/* Testimonial content - removed image section */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex items-center mb-4">
                {renderStars(currentTestimonial.rating)}
              </div>
              
              <p className="text-gray-700 italic text-lg md:text-xl mb-6 leading-relaxed text-center">
                "{currentTestimonial.text}"
              </p>
              
              <div className="mt-auto text-center">
                <p className="font-bold text-gray-900 text-lg">{currentTestimonial.name}</p>
                <p className="text-gray-500">{currentTestimonial.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at bottom with smoother transition */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
          <div 
            ref={progressRef}
            className="h-full bg-blue-500 transition-all duration-800 ease-out"
            style={{ width: `${((safeIndex + 1) / testimonials.length) * 100}%` }}
          ></div>
        </div>

        {/* Testimonial counter */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-500 font-medium">
          {safeIndex + 1}/{testimonials.length}
        </div>
      </div>

      {/* Navigation buttons with smoother hover effects */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white text-blue-900 p-3 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default TestimonialSlider; 