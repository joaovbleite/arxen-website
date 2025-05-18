import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, Phone, ArrowRight, Send, ChevronUp } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would call an API to handle the subscription
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      {/* Footer Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Company Info */}
          <div className="space-y-2">
            {/* Logo Section - No container, minimal spacing */}
            <img src="https://i.postimg.cc/15fShyLv/IMG-2138-removebg-preview.png" alt="Arxen Logo" className="h-32 w-auto -ml-3 -mt-3 mb-1" /> 
            <p className="text-blue-100 text-sm leading-relaxed mt-0">
              Arxen is your trusted partner for all residential and commercial construction and remodeling services, 
              delivering exceptional quality and craftsmanship for over 15 years.
            </p>
            {/* Social Links - reduced top margin */}
            <div className="flex space-x-4 mt-1">
              <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/1234567890" className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <div className="lg:hidden">
              <button 
                onClick={() => toggleAccordion('links')} 
                className="flex justify-between items-center w-full"
              >
                <h3 className="text-xl font-semibold">Quick Links</h3>
                <ChevronUp className={`transition-transform ${activeAccordion === 'links' ? '' : 'rotate-180'}`} size={20} />
              </button>
            </div>
            <h3 className="text-xl font-semibold hidden lg:block">Quick Links</h3>
            <div className={`space-y-2 transition-all duration-300 ${activeAccordion === 'links' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
              <div className="w-20 h-1 bg-blue-700 rounded mb-4"></div>
              <Link to="/" className="block text-blue-100 hover:text-white transition-colors py-1 transform hover:translate-x-1 duration-300 flex items-center">
                <ArrowRight size={14} className="mr-2" /> Home
              </Link>
              <Link to="/about" className="block text-blue-100 hover:text-white transition-colors py-1 transform hover:translate-x-1 duration-300 flex items-center">
                <ArrowRight size={14} className="mr-2" /> About Us
              </Link>
              <Link to="/residential" className="block text-blue-100 hover:text-white transition-colors py-1 transform hover:translate-x-1 duration-300 flex items-center">
                <ArrowRight size={14} className="mr-2" /> Residential
              </Link>
              <Link to="/commercial" className="block text-blue-100 hover:text-white transition-colors py-1 transform hover:translate-x-1 duration-300 flex items-center">
                <ArrowRight size={14} className="mr-2" /> Commercial
              </Link>
              <Link to="/free-estimate" className="block text-blue-100 hover:text-white transition-colors py-1 transform hover:translate-x-1 duration-300 flex items-center">
                <ArrowRight size={14} className="mr-2" /> Free Estimate
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-6">
            <div className="lg:hidden">
              <button 
                onClick={() => toggleAccordion('contact')} 
                className="flex justify-between items-center w-full"
              >
                <h3 className="text-xl font-semibold">Contact Us</h3>
                <ChevronUp className={`transition-transform ${activeAccordion === 'contact' ? '' : 'rotate-180'}`} size={20} />
              </button>
            </div>
            <h3 className="text-xl font-semibold hidden lg:block">Contact Us</h3>
            <div className={`space-y-4 transition-all duration-300 ${activeAccordion === 'contact' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
              <div className="w-20 h-1 bg-blue-700 rounded mb-4"></div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-200">Phone</p>
                  <a href="tel:404-934-9458" className="text-white hover:text-blue-300 transition-colors">
                    404-934-9458
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-200">Email</p>
                  <a href="mailto:sustenablet@gmail.com" className="text-white hover:text-blue-300 transition-colors">
                    sustenablet@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="space-y-6">
            <div className="lg:hidden">
              <button 
                onClick={() => toggleAccordion('newsletter')} 
                className="flex justify-between items-center w-full"
              >
                <h3 className="text-xl font-semibold">Newsletter</h3>
                <ChevronUp className={`transition-transform ${activeAccordion === 'newsletter' ? '' : 'rotate-180'}`} size={20} />
              </button>
            </div>
            <h3 className="text-xl font-semibold hidden lg:block">Newsletter</h3>
            <div className={`space-y-4 transition-all duration-300 ${activeAccordion === 'newsletter' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
              <div className="w-20 h-1 bg-blue-700 rounded mb-4"></div>
              <p className="text-blue-100 text-sm">
                Subscribe to our newsletter for the latest updates, tips, and special offers.
              </p>
              {subscribed ? (
                <div className="bg-green-700 p-3 rounded-lg text-sm">
                  Thanks for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-4 relative">
                  <input
                    type="email"
                    id="newsletter-email"
                    name="newsletter-email"
                    placeholder="Your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-800 text-white placeholder-blue-200 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-500 transition-colors duration-300 rounded-lg p-2"
                    aria-label="Subscribe"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
              <div className="text-xs text-blue-300 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-blue-800 mt-8 pt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Arxen Construction. All rights reserved.
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/privacy-policy" className="text-blue-200 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-blue-200 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-blue-200 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
            <Link to="/accessibility" className="text-blue-200 hover:text-white text-sm transition-colors">
              Accessibility
            </Link>
            <Link to="/faq" className="text-blue-200 hover:text-white text-sm transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 