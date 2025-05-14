import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, ArrowRight, Phone, CreditCard, DollarSign, Percent, FileText, Clock } from 'lucide-react';

const Financing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-900">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-blue-900">Financing Options</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[300px] lg:h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Flexible Financing Options</h1>
              <p className="text-xl text-white max-w-2xl mb-8">
                Transform your home now and pay over time with our convenient financing solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Home Improvement Financing Made Easy</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Arxen Construction, we understand that home improvements are an investment. That's why we've partnered with leading financial institutions to offer you flexible financing options that make your dream projects affordable.
            </p>
            <div className="bg-blue-900 text-white p-8 rounded-lg shadow-md mb-12">
              <h3 className="text-2xl font-bold mb-4 text-center">Current Special Offer</h3>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold">12 MONTHS NO INTEREST</p>
                <p className="text-xl">on purchases over $1,500</p>
              </div>
              <div className="flex justify-center">
                <Link 
                  to="/quote?offer=12MONTHS" 
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Options */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Financing Options</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <CreditCard className="w-12 h-12 text-blue-900" />,
                  title: "No Interest If Paid In Full",
                  description: "0% interest if paid in full within promotional period of 6, 12, or 18 months.",
                  term: "For qualified buyers"
                },
                {
                  icon: <Clock className="w-12 h-12 text-blue-900" />,
                  title: "Low Monthly Payments",
                  description: "Extend payments up to 84 months with competitive fixed interest rates.",
                  term: "Based on credit approval"
                },
                {
                  icon: <DollarSign className="w-12 h-12 text-blue-900" />,
                  title: "Same-As-Cash Options",
                  description: "90-day same-as-cash options for smaller projects and quick payoffs.",
                  term: "No prepayment penalties"
                }
              ].map((option, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
                  <div className="flex justify-center mb-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{option.title}</h3>
                  <p className="text-gray-700 text-center mb-4 flex-grow">{option.description}</p>
                  <p className="text-sm text-gray-500 text-center">{option.term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Financing Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <ol className="space-y-8 relative">
                  <div className="absolute left-7 top-0 h-full w-0.5 bg-blue-100"></div>
                  {[
                    { 
                      title: "Apply Online or By Phone", 
                      description: "Complete our simple application in minutes. You can apply online or call our office for assistance."
                    },
                    { 
                      title: "Receive Quick Decision", 
                      description: "Most applicants receive a decision within minutes of applying."
                    },
                    { 
                      title: "Select Your Project", 
                      description: "Once approved, finalize the details of your home improvement project with our team."
                    },
                    { 
                      title: "Enjoy Your New Space", 
                      description: "We complete your project while you enjoy the flexibility of manageable payments."
                    }
                  ].map((step, index) => (
                    <li key={index} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-14 h-14 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-600 z-10">
                        <span className="text-blue-900 font-bold text-lg">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-900 mr-2" />
                    Application Requirements
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Valid government-issued ID",
                      "Basic personal information",
                      "Banking or credit card information",
                      "Proof of income (for some applications)"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Percent className="w-5 h-5 text-blue-900 mr-2" />
                    Interest Rates & Terms
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Interest rates vary based on credit score, loan amount, and promotional offers. We work with multiple lenders to find you the best rates possible.
                  </p>
                  <p className="text-gray-700">
                    Terms range from 6 months to 7 years, allowing flexibility to fit your budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Will applying for financing affect my credit score?",
                answer: "When you apply, we perform a soft credit check which doesn't affect your credit score. A hard inquiry only occurs once you accept a financing offer."
              },
              {
                question: "Can I pay off my loan early?",
                answer: "Yes, all of our financing options allow for early payoff with no prepayment penalties."
              },
              {
                question: "What happens if I'm not approved for financing?",
                answer: "If you're not approved, our team will work with you to explore alternative payment options or different financing programs that might better suit your situation."
              },
              {
                question: "Can I finance just part of my project?",
                answer: "Yes, you can choose to finance any portion of your project and pay the remainder upfront."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step toward your dream home with our flexible financing options.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/quote?financing=true" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Apply for Financing
            </Link>
            <Link to="/contact" className="mr-4 text-blue-700 hover:text-blue-900 font-medium">Contact Us</Link>
            <span className="mx-2 text-gray-400">|</span>
            <a 
              href="tel:404-934-9458" 
              className="inline-flex items-center px-8 py-4 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" /> Call for Assistance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financing; 