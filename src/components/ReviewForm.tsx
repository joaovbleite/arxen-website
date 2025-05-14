import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Send, Check } from 'lucide-react';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [projectType, setProjectType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Add keyboard handler for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate form
    if (!name || !email || !location || !reviewText || rating === 0) {
      setError('Please fill out all required fields and provide a rating');
      setSubmitting(false);
      return;
    }

    // Simulate API submission
    setTimeout(() => {
      // In a real app, this would be an API call to save the review
      console.log('Review submitted:', { name, email, location, reviewText, rating, projectType });
      setSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 3 seconds and close
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setLocation('');
    setReviewText('');
    setRating(0);
    setHoverRating(0);
    setProjectType('');
    setSubmitted(false);
    setError('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close only if the click was directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="review-form-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - Made more prominent with a background */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm z-20 transition-all duration-200"
          aria-label="Close review form"
        >
          <X size={20} />
        </button>

        {/* Header - Reduced padding */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
          <h2 id="review-form-title" className="text-xl font-bold mb-1">Leave a Review</h2>
          <p className="text-blue-100 text-sm">
            Share your experience with our services.
          </p>
        </div>

        {/* Main content - Reduced padding */}
        <div className="p-4 overflow-y-auto flex-grow">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 text-sm">
                Your review has been submitted successfully. We appreciate your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-0.5"
                      aria-label={`Rate ${star} stars`}
                      aria-pressed={rating >= star}
                    >
                      <Star 
                        size={28} 
                        className={`${
                          (hoverRating ? hoverRating >= star : rating >= star)
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        } transition-colors cursor-pointer`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-0.5">
                  Your email will not be published.
                </p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State (e.g. Atlanta, GA)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a project type (optional)</option>
                  <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                  <option value="Bathroom Remodeling">Bathroom Remodeling</option>
                  <option value="Flooring Installation">Flooring Installation</option>
                  <option value="Custom Cabinetry">Custom Cabinetry</option>
                  <option value="Home Addition">Home Addition</option>
                  <option value="Commercial Renovation">Commercial Renovation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your experience with our services..."
                  required
                ></textarea>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>
              )}

              {/* Submit button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-2.5 px-4 rounded-md flex items-center justify-center font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForm; 