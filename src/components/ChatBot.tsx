import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Calendar, Home, Wrench, DollarSign, ChevronRight, HelpCircle, Briefcase, User, Clock, Mail, Phone } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePropertyType } from './PropertyTypeContext';
import ChatEndFeedback from './ChatEndFeedback';

// Define interfaces for type checking
interface ChatOption {
  text: string;
  action: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: number;
  type?: 'option' | 'contact' | 'quick-reply' | 'link' | 'text';
  options?: ChatOption[];
}

// Knowledge Base Entry interface
interface KnowledgeBaseEntry {
  patterns: string[];
  response: string;
}

// Add this interface for conversation memory
interface ConversationMemory {
  topics: string[];
  lastQuestionAnswered: string | null;
  sentimentScore: number; // -1 to 1, negative is frustrated, positive is happy
  interactionCount: number;
  visitedPages: string[];
  lastActiveTimestamp: number;
}

const CHAT_HISTORY_KEY = 'arxen_chat_history';
const LOCAL_STORAGE_KEY = 'arxen_chatbot_opened';
const CONVO_MEMORY_KEY = 'arxen_chat_memory';

// Service categories for quick help options
const serviceCategories = [
  { id: 'residential', name: 'Residential Services', icon: <Home size={16} /> },
  { id: 'commercial', name: 'Commercial Services', icon: <Briefcase size={16} /> },
  { id: 'remodeling', name: 'Remodeling', icon: <Wrench size={16} /> },
  { id: 'financing', name: 'Financing Options', icon: <DollarSign size={16} /> }
];

// Common questions for quick replies
const commonQuestions = [
  "What services do you offer?",
  "How much does a kitchen remodel cost?",
  "Do you work on commercial projects?",
  "How long does a bathroom renovation take?",
  "What areas do you serve?",
  "Can I get a free estimate?",
  "What's included in your warranty?"
];

// Add more knowledge base entries to the existing array
const additionalKnowledgeEntries: KnowledgeBaseEntry[] = [
  {
    patterns: ['how do you', 'installation process', 'what is the process', 'steps', 'procedure'],
    response: "Our installation process typically involves 4 key steps: 1) Initial consultation and design, 2) Material selection and ordering, 3) Professional installation by our certified team, and 4) Final inspection and walkthrough. Would you like more details about any specific part of this process?"
  },
  {
    patterns: ['photos', 'gallery', 'pictures', 'portfolio', 'examples', 'previous work'],
    response: "We have an extensive portfolio of completed projects across various property types. You can browse our project gallery by category to see examples of our craftsmanship and design expertise."
  },
  {
    patterns: ['discount', 'promotion', 'deal', 'offer', 'special', 'coupon', 'sale'],
    response: "We regularly offer seasonal promotions and special discounts for new customers. Currently, we're offering a 10% discount on kitchen and bathroom remodels booked this month. Would you like me to send you information about our current promotions?"
  },
  {
    patterns: ['compare', 'difference', 'versus', 'vs', 'better than', 'competitors'],
    response: "What distinguishes Arxen Construction is our combination of certified craftsmanship, transparent pricing, exceptional project management, and our industry-leading 2-year workmanship warranty. We're happy to discuss how our services compare to others you may be considering."
  },
  {
    patterns: ['eco', 'green', 'sustainable', 'environmentally', 'environment', 'friendly', 'energy efficient'],
    response: "We're committed to environmentally responsible construction practices. We offer energy-efficient options including Energy Star appliances, high-efficiency HVAC, sustainable building materials, proper insulation, and smart home technology to reduce your environmental footprint and energy costs."
  },
  {
    patterns: ['insurance', 'insured', 'liability', 'coverage', 'protected'],
    response: "Arxen Construction is fully licensed, insured, and bonded with comprehensive general liability insurance and workers' compensation coverage. This provides protection for both your property and our team throughout the project."
  },
  {
    patterns: ['cancel', 'cancelation', 'reschedule', 'postpone', 'delay', 'change date'],
    response: "We understand that circumstances change. Our cancellation policy allows for free rescheduling with at least 48 hours notice. For major projects, our contracts include specific terms regarding timeline changes and cancellations."
  },
  {
    patterns: ['deposit', 'down payment', 'payment schedule', 'payment plan', 'pay', 'financing'],
    response: "For most projects, we require a 30% deposit to secure your start date, with additional payments tied to project milestones. We accept various payment methods and offer flexible financing options through our financial partners."
  },
  {
    patterns: ['reviews', 'ratings', 'testimonials', 'feedback', 'reputation'],
    response: "We're proud of our 4.8/5 star rating across major review platforms. Our clients consistently praise our attention to detail, communication, and the quality of our craftsmanship. Would you like to read some of our recent client testimonials?"
  },
  {
    patterns: ['complaint', 'problem', 'issue', 'not happy', 'dissatisfied', 'unhappy'],
    response: "We take client satisfaction very seriously. If you experience any issues with our services, please contact our customer support team directly at 404-934-9458. We have a formal resolution process and will work promptly to address your concerns."
  },
  // NEW ENTRIES FOR MORE NATURAL CONVERSATION
  {
    patterns: ['hello there', 'howdy', 'greetings', 'good day'],
    response: "Hello there! It's great to connect with you. How can I assist with your home improvement or construction project today?"
  },
  {
    patterns: ['how are you', 'how are you doing', 'how\'s it going', 'how are things'],
    response: "I'm doing well, thanks for asking! I'm here and ready to help with any construction or remodeling questions you might have. What brings you to Arxen Construction today?"
  },
  {
    patterns: ['what should i do', 'not sure where to start', 'overwhelmed', 'don\'t know where to begin', 'first steps'],
    response: "Starting a construction project can feel overwhelming! Many clients find it helpful to begin with a free consultation where we can discuss your vision, budget, and timeline. Would you like me to help you schedule a consultation with one of our specialists?"
  },
  {
    patterns: ['trend', 'popular', 'in style', 'modern', 'contemporary', 'latest', 'fashion'],
    response: "Some of the current trends we're seeing include open-concept living spaces, large kitchen islands with seating, smart home technology integration, sustainable materials, and mixed metal finishes. Would you like to know more about any specific trend for your project?"
  },
  {
    patterns: ['recommend', 'suggestion', 'advice', 'what do you think', 'your opinion', 'what would you do'],
    response: "Based on what many of our clients have enjoyed, I'd suggest considering factors like functionality, long-term value, and your personal style. Our design team can provide personalized recommendations during a consultation that takes into account your specific space, needs, and budget."
  },
  {
    patterns: ['materials', 'quality', 'durability', 'long-lasting', 'premium'],
    response: "We source high-quality materials from trusted suppliers and always balance aesthetics, durability, and value. For example, our kitchen countertops range from premium granite and quartz to eco-friendly options, all selected for their longevity and performance."
  },
  {
    patterns: ['visit', 'come to my house', 'come to my home', 'see my space', 'in-person', 'in person'],
    response: "We'd be happy to schedule an in-home consultation! This allows our specialists to see your space firsthand, take measurements, and provide the most accurate recommendations and estimates. Would you like to schedule an in-home visit?"
  },
  {
    patterns: ['virtual', 'online consultation', 'video chat', 'remote', 'zoom', 'facetime'],
    response: "We do offer virtual consultations through video calls! Many clients find this convenient for initial discussions. We can view your space virtually, discuss your ideas, and provide preliminary recommendations before an in-person visit."
  },
  {
    patterns: ['urgent', 'emergency', 'asap', 'quick', 'rush', 'fast', 'immediate', 'right away'],
    response: "I understand you're looking for quick service. While quality work takes time, we do have options for expedited projects in certain cases. For urgent needs, I recommend calling our office directly at 404-934-9458 so we can assess your situation immediately."
  },
  {
    patterns: ['deadline', 'timeframe', 'time frame', 'specific date', 'event', 'by when', 'target date'],
    response: "Having a target completion date helps us plan effectively. We work diligently to meet deadlines, especially for important events or occasions. During the estimation process, we'll provide a detailed timeline and work backward from your target date to create a realistic schedule."
  },
  {
    patterns: ['mess', 'clean', 'dust', 'debris', 'tidy', 'cleanliness'],
    response: "Great question about cleanup! We take cleanliness very seriously. Our team uses dust containment systems, protective floor coverings, and daily cleanup procedures. At project completion, we conduct a thorough cleaning to ensure your space is ready to enjoy."
  },
  {
    patterns: ['live in home', 'stay during', 'remain in house', 'live through remodel', 'during construction'],
    response: "Many clients do stay in their homes during remodeling. Depending on the project scope, we can often section off work areas to maintain livable conditions. We'll discuss logistics, bathroom access, temporary kitchen setups if needed, and create a plan that minimizes disruption to your daily life."
  },
  {
    patterns: ['water damage', 'leak', 'flood', 'moisture', 'mold'],
    response: "Water damage requires prompt attention to prevent further issues. Our team is experienced in assessing water damage, identifying the source, proper remediation, and restoration. We coordinate with plumbers when necessary and ensure the area is properly dried before restoration begins."
  },
  {
    patterns: ['pet', 'dog', 'cat', 'animal', 'pet-friendly'],
    response: "We're pet-friendly and understand they're family members! Our team is careful about keeping gates/doors closed, storing materials safely, and being mindful of pet stress. We recommend having a designated safe space for your pets during the most disruptive phases of construction."
  },
  {
    patterns: ['smart home', 'automation', 'technology', 'smart', 'tech'],
    response: "Smart home technology is one of our specialties! We can integrate lighting systems, thermostats, security, entertainment systems, motorized shades, and more. We work with various platforms including Google Home, Amazon Alexa, and Apple HomeKit to create a connected living experience."
  },
  {
    patterns: ['ada', 'accessible', 'disability', 'aging', 'wheelchair', 'mobility', 'senior', 'elderly'],
    response: "We specialize in accessible design that combines functionality with beautiful aesthetics. This includes wider doorways, zero-entry showers, comfort-height toilets, grab bars, accessible countertop heights, and thoughtful space planning that accommodates mobility devices while maintaining a stylish appearance."
  },
  {
    patterns: ['outdoor', 'patio', 'deck', 'backyard', 'landscape', 'exterior'],
    response: "Our outdoor living projects range from decks and patios to complete backyard transformations. We can create outdoor kitchens, fire features, covered living spaces, and custom hardscaping. These projects extend your living space and maximize enjoyment of your property year-round."
  },
  {
    patterns: ['family', 'children', 'kids', 'baby', 'child-friendly', 'childproof'],
    response: "Family-friendly design is important to many of our clients! We can incorporate features like rounded corners on countertops, child-proof cabinet locks, durable and stain-resistant materials, dedicated play spaces, and smart storage solutions that grow with your family's needs."
  },
  {
    patterns: ['small space', 'tiny', 'apartment', 'condo', 'maximize', 'storage solutions'],
    response: "Small spaces present exciting design opportunities! We excel at maximizing functionality through custom storage, multi-purpose furniture, space-efficient layouts, and visual techniques that make spaces feel larger. Every inch is thoughtfully planned to serve your needs while maintaining a spacious feel."
  },
  {
    patterns: ['luxury', 'high-end', 'premium', 'upscale', 'custom', 'bespoke'],
    response: "Our luxury projects feature premium materials, custom craftsmanship, and exceptional attention to detail. From hand-selected stone slabs and custom millwork to specialized finishes and integrated technology, we create distinctive spaces tailored to discerning clients who value uniqueness and quality."
  },
  {
    patterns: ['budget friendly', 'affordable', 'low cost', 'save money', 'economical', 'inexpensive'],
    response: "We respect every budget and offer value-engineered solutions that maximize impact while controlling costs. Strategies might include phasing the project, keeping existing layouts, refinishing rather than replacing certain elements, and focusing investments on the most visible and frequently used features."
  },
  {
    patterns: ['weekend', 'saturday', 'sunday', 'after hours', 'evening', 'night'],
    response: "Our regular work hours are Monday through Friday, 7:30 AM to 4:30 PM. For certain projects, we can arrange limited weekend work with advance notice, particularly for phases that might be especially disruptive or when schedule acceleration is needed. This is evaluated on a case-by-case basis."
  },
  {
    patterns: ['design help', 'designer', 'architect', 'style', 'look and feel', 'aesthetic'],
    response: "Our design services range from simple material selection assistance to comprehensive design development. Our team includes experienced designers who can help translate your ideas into cohesive plans, recommend materials and finishes, and ensure your space reflects your personal style while maintaining functionality."
  },
  {
    patterns: ['how long have you', 'company history', 'years in business', 'experience', 'established', 'founded'],
    response: "Arxen Construction was established in 2003, giving us over 20 years of experience in the Atlanta area. The company was founded by master craftsmen with a vision for combining traditional quality with modern building science. Over the years, we've completed more than 2,500 successful projects while maintaining our commitment to craftsmanship."
  },
  {
    patterns: ['owner', 'who owns', 'founder', 'ceo', 'president', 'management'],
    response: "Arxen Construction was founded by John Harrison, who still serves as our CEO. John has over 35 years of experience in construction and is personally involved in quality control for our projects. Our leadership team includes professionals with backgrounds in construction, design, engineering, and customer service."
  },
  {
    patterns: ['covid', 'pandemic', 'virus', 'safety protocol', 'health measures'],
    response: "We maintain comprehensive safety protocols that include regular sanitization, optional mask-wearing, daily health screenings for our team, and opportunities for virtual meetings when preferred. We're happy to discuss any specific concerns or additional precautions you'd like us to take during your project."
  },
  {
    patterns: ['local', 'source', 'made in usa', 'american made', 'domestic', 'imported'],
    response: "We prioritize locally sourced and American-made materials whenever possible. This supports our local economy, reduces environmental impact from shipping, and often provides better quality control. For specialty items, we source from trusted global partners who meet our quality and ethical standards."
  },
  {
    patterns: ['refer', 'recommendation', 'word of mouth', 'friend told me', 'heard about you'],
    response: "We're delighted you heard about us through a referral! Referrals and word-of-mouth recommendations are the highest compliment for our work. We'd love to know who referred you so we can thank them, and we're excited to provide you with the same exceptional experience they enjoyed."
  },
  {
    patterns: ['instagram', 'facebook', 'social media', 'pinterest', 'houzz', 'follow you'],
    response: "Yes, we're active on social media! You can find us on Instagram @ArxenConstruction, Facebook as Arxen Construction, and we have galleries on Houzz and Pinterest as well. We regularly post project photos, behind-the-scenes content, and design inspiration. We'd love to connect with you there!"
  },
  {
    patterns: ['job', 'hiring', 'employment', 'work for you', 'positions', 'career'],
    response: "We're always interested in connecting with talented professionals! Our hiring needs vary throughout the year, but we look for skilled craftspeople, project managers, designers, and office staff who share our values of quality and customer service. Please send your resume to careers@arxenconstruction.com."
  },
  {
    patterns: ['thanks for the information', 'that was helpful', 'appreciate your help', 'thanks for explaining'],
    response: "You're very welcome! I'm glad I could help. Is there anything else about your project I can assist with today? Remember, I'm here to answer questions anytime during your planning process."
  },
  {
    patterns: ['can you help me', 'I need assistance', 'support', 'guidance'],
    response: "I'd be happy to help! To better assist you, could you share a bit more about your specific needs or questions? Whether it's about design ideas, budgeting, timelines, or specific services, I'm here to provide the information you need."
  },
  {
    patterns: ['confused', 'not clear', "don't understand", 'clarify', 'explain again'],
    response: "I apologize for any confusion! Let me try to explain more clearly. Feel free to ask specific questions about the parts that aren't clear, and I'll do my best to provide a straightforward explanation without industry jargon."
  }
];

// Add more conversational entries to the knowledge base
const additionalConversationalEntries: KnowledgeBaseEntry[] = [
  // Casual greetings and rapport building
  {
    patterns: ['hi there', 'hey there', 'hello there', 'sup', 'yo', 'hiya'],
    response: "Hi there! How can I help with your construction or remodeling project today?"
  },
  {
    patterns: ['good morning', 'morning'],
    response: "Good morning! It's a great day to start planning your home improvement project. What can I help you with today?"
  },
  {
    patterns: ['good afternoon', 'afternoon'],
    response: "Good afternoon! Thanks for reaching out to Arxen Construction. How can I assist you today?"
  },
  {
    patterns: ['good evening', 'evening'],
    response: "Good evening! Thank you for contacting us. How can I help with your construction needs today?"
  },
  
  // Conversation continuers
  {
    patterns: ['interesting', 'sounds good', 'got it', 'i see', 'makes sense'],
    response: "I'm glad that helps! Is there anything specific about that topic you'd like to explore further?"
  },
  {
    patterns: ['tell me more', 'more information', 'elaborate', 'explain further', 'details please'],
    response: "I'd be happy to provide more details. Is there a specific aspect you're most interested in learning more about?"
  },
  
  // Project dreams and inspirations
  {
    patterns: ['dream home', 'dream kitchen', 'dream bathroom', 'my dream', 'always wanted'],
    response: "It's wonderful that you have a vision for your dream space! Our design team specializes in turning dreams into reality. Would you like to share what features or styles you've been envisioning?"
  },
  {
    patterns: ['saw on pinterest', 'saw online', 'magazine', 'instagram', 'houzz', 'picture', 'photo'],
    response: "Design inspiration from platforms like Pinterest and Houzz is incredibly helpful! We encourage clients to share images during consultations. Our designers can help adapt those ideas to your specific space and budget."
  },
  {
    patterns: ['like modern', 'modern style', 'contemporary', 'minimalist', 'sleek'],
    response: "Modern and contemporary designs are very popular right now! We excel at creating clean lines, minimalist aesthetics, and incorporating the latest trends in materials and technology."
  },
  {
    patterns: ['traditional style', 'classic look', 'timeless', 'elegant'],
    response: "Traditional and timeless designs create beautiful, elegant spaces that never go out of style. We can incorporate classic elements while ensuring functionality meets modern standards."
  },
  {
    patterns: ['farmhouse', 'rustic', 'country style', 'barn doors', 'shiplap'],
    response: "The farmhouse style remains incredibly popular! We love working with rustic elements, reclaimed wood, shiplap, and those charming touches that create warm, inviting spaces."
  },
  
  // Budget conversations
  {
    patterns: ['expensive', 'too much', 'high price', 'out of budget', 'can\'t afford'],
    response: "I understand budget concerns are important. We're committed to transparency in pricing and can work with various budget ranges. We offer options to phase projects, suggest alternative materials, or focus on high-impact changes that maximize value within your budget."
  },
  {
    patterns: ['save money', 'cost effective', 'affordable option', 'cheaper alternative', 'budget friendly'],
    response: "We have several strategies to help manage costs without sacrificing quality. These include careful project phasing, strategic material selection, maintaining existing layouts where possible, and focusing investments on the elements that provide the greatest impact."
  },
  {
    patterns: ['what\'s the cheapest', 'lowest price', 'minimum cost', 'basic package'],
    response: "While we focus on quality craftsmanship rather than being the lowest-cost provider, we can certainly discuss options to minimize expense. We'd start by understanding your priorities and suggesting where you might save versus where investment is most important for longevity and satisfaction."
  },
  
  // Timeline and scheduling
  {
    patterns: ['when can you start', 'start date', 'begin the project', 'availability', 'schedule'],
    response: "Our current lead time for projects is about 4-6 weeks from contract signing, though this varies seasonally. Once we've finalized your design and selections, we'll provide a specific start date and detailed timeline for your project."
  },
  {
    patterns: ['how soon', 'rush job', 'urgent timeline', 'finish quickly', 'deadline'],
    response: "While quality work does take time, we understand sometimes there are deadlines. For urgent projects, we recommend scheduling a consultation as soon as possible so we can assess your specific needs and determine if expedited scheduling is possible."
  },
  {
    patterns: ['project length', 'how many days', 'how many weeks', 'construction time'],
    response: "Project durations vary significantly based on scope. As a general guideline: bathroom renovations typically take 2-4 weeks, kitchens 3-6 weeks, and larger projects like additions can take 8-12 weeks or more. We'll provide a specific timeline during the estimation process."
  },
  
  // Common concerns
  {
    patterns: ['noise', 'loud', 'disruption', 'neighbors', 'quiet'],
    response: "Construction does involve some noise, but we take several steps to minimize disruption. We follow all local noise ordinances, communicate clearly with neighbors when appropriate, and schedule the loudest work during standard daytime hours. We're also careful to clean up daily and maintain a respectful presence in your neighborhood."
  },
  {
    patterns: ['mess', 'dust', 'clean', 'debris', 'dirty'],
    response: "Controlling dust and debris is a top priority for us. We use containment barriers, air scrubbers, and protective coverings for your belongings. Our team conducts daily cleanups and a thorough final cleaning upon project completion so you can enjoy your new space immediately."
  },
  {
    patterns: ['move out', 'stay elsewhere', 'hotel', 'vacate', 'live in home'],
    response: "Whether you need to relocate temporarily depends on the project scope. For many bathroom or kitchen remodels, clients can remain at home with some adjustments. For whole-home renovations, temporarily relocating might be more comfortable. We'll discuss this during planning and help you make the best decision for your situation."
  },
  
  // Decision support
  {
    patterns: ['not sure', 'undecided', 'can\'t decide', 'torn between', 'options'],
    response: "It's completely normal to feel undecided when planning a significant renovation! Our design consultations are perfect for exploring options without pressure. We can show examples, discuss pros and cons, and help you identify what will work best for your lifestyle and preferences."
  },
  {
    patterns: ['what would you recommend', 'what do you suggest', 'what\'s best', 'your opinion', 'your advice'],
    response: "Each project is unique, so recommendations depend on your specific needs, budget, and preferences. During our consultation, we'll ask questions about how you use your space, what's most important to you, and what problems you're trying to solve, which helps us make tailored suggestions."
  },
  {
    patterns: ['differences between', 'compare', 'pros and cons', 'advantages', 'disadvantages'],
    response: "Comparing options is an important part of the decision process. Whether you're considering different materials, layouts, or approaches, we're happy to walk through the pros and cons of each, considering factors like durability, maintenance, aesthetics, and cost."
  },
  
  // Specific material questions
  {
    patterns: ['granite', 'quartz', 'marble', 'countertop', 'countertops', 'stone'],
    response: "For countertops, we offer premium options including granite, quartz, marble, and solid surface materials. Granite provides natural beauty with some maintenance, quartz offers durability and low maintenance, while marble delivers classic elegance but requires more care. We can help you select the perfect material based on your aesthetic preferences, lifestyle, and maintenance preferences."
  },
  {
    patterns: ['hardwood', 'engineered wood', 'laminate', 'vinyl', 'tile flooring', 'floor material'],
    response: "Flooring selection is crucial for both aesthetics and functionality. We install hardwood (solid and engineered), luxury vinyl, laminate, tile, and carpet. Each has different benefits regarding durability, water resistance, comfort, and price point. We can recommend options that perfectly balance your design vision with practical considerations for each space."
  },
  {
    patterns: ['cabinet material', 'wood type', 'mdf', 'plywood', 'solid wood'],
    response: "For cabinetry, we offer various construction methods and materials. Solid wood provides classic beauty and durability, plywood offers stability with real wood veneer, and MDF provides a smooth finish perfect for painted cabinets. During design consultations, we'll discuss the pros and cons of each option for your specific needs."
  },
  
  // Closing conversations gracefully
  {
    patterns: ['need to think', 'think about it', 'not ready', 'decide later', 'consider'],
    response: "I completely understand you'd like some time to consider your options. That's a wise approach for important home decisions. When you're ready to move forward or have additional questions, we're here to help. Would you like me to email you some information in the meantime?"
  },
  {
    patterns: ['thank you', 'thanks for your help', 'appreciate it', 'been helpful', 'helped a lot'],
    response: "You're very welcome! It's been my pleasure to assist you today. If you have any other questions as you continue planning your project, please don't hesitate to reach out. We're here to make your renovation experience as smooth and enjoyable as possible."
  },
  {
    patterns: ['goodbye', 'bye', 'talk later', 'until next time', 'talk to you later'],
    response: "Thank you for chatting with Arxen Construction today! We look forward to helping bring your project to life. Have a wonderful day, and don't hesitate to reach back out when you're ready to take the next step."
  },
  
  // NEW ADDITIONS - Construction-specific topics
  {
    patterns: ['building code', 'code requirements', 'regulations', 'compliance', 'permits required'],
    response: "We stay current with all local building codes and regulations. Our team handles the entire permitting process, ensuring your project meets all requirements. This includes structural safety, electrical work, plumbing, energy efficiency standards, and accessibility guidelines where applicable."
  },
  {
    patterns: ['foundation issues', 'foundation problems', 'structural concerns', 'cracks in foundation'],
    response: "Foundation concerns require careful assessment. Our process begins with a thorough evaluation to determine the cause and extent of any issues. We can address various foundation problems from minor crack repairs to more extensive reinforcement work. This is always approached systematically to ensure structural integrity."
  },
  {
    patterns: ['renovation mistakes', 'remodeling mistakes', 'common errors', 'avoid problems'],
    response: "Some common renovation mistakes include underestimating budgets, choosing materials based solely on price, neglecting hidden problems, improper planning of layouts, and hiring based on lowest bids. Our experienced team helps you avoid these pitfalls through thorough planning, transparent communication, and professional project management."
  },
  {
    patterns: ['work from home', 'home office', 'office space', 'remote work', 'zoom room'],
    response: "Home office renovations have become increasingly popular! We create functional, comfortable work spaces with proper lighting, acoustics, and ergonomics. Solutions can include built-in desks and storage, soundproofing, adequate power outlets and data ports, video conferencing optimized lighting, and flexible spaces that serve multiple purposes."
  },
  {
    patterns: ['winter project', 'summer project', 'best season', 'best time of year', 'seasonal'],
    response: "Different projects may benefit from specific timing. Interior work like kitchens and bathrooms can be done year-round. Exterior projects and additions are typically easier in spring through fall, though we work throughout the year. Winter can actually be an ideal time for interior renovations as our schedule is often more flexible during these months."
  },
  
  // Home system upgrades
  {
    patterns: ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'heat pump'],
    response: "Our HVAC services include system upgrades, replacements, and improvements to enhance comfort and efficiency. We install energy-efficient heating and cooling systems, smart thermostats, improved ductwork, zoning systems for targeted comfort, and can recommend solutions that reduce energy consumption while improving indoor air quality."
  },
  {
    patterns: ['electrical', 'wiring', 'panel', 'breaker box', 'outlets', 'switches'],
    response: "Our electrical services address both functional and aesthetic needs. We can upgrade electrical panels, add circuits for new appliances, install additional outlets and USB charging stations, update outdated wiring to meet safety codes, and incorporate lighting design that enhances your space's ambiance and functionality."
  },
  {
    patterns: ['plumbing', 'pipes', 'drains', 'water pressure', 'water heater', 'leaks'],
    response: "Our plumbing services include addressing existing issues and upgrading systems during renovations. We replace aging pipes, improve water pressure, install efficient fixtures and appliances, upgrade water heaters (including tankless options), and can implement water filtration systems for improved water quality throughout your home."
  },
  {
    patterns: ['windows', 'replacement windows', 'energy efficient windows', 'window styles'],
    response: "Window replacements offer both aesthetic improvements and energy savings. We install a variety of styles including double-hung, casement, picture, bay, and specialty shapes. Energy-efficient options include double or triple-pane glass, low-E coatings, and proper insulation around frames to minimize heat transfer."
  },
  
  // Specific room types
  {
    patterns: ['laundry room', 'mudroom', 'utility room', 'washer and dryer'],
    response: "Laundry and utility spaces have evolved from purely functional to thoughtfully designed areas. We create laundry rooms with efficient layouts, ample storage, durable countertops for folding, proper ventilation, utility sinks, and organizational systems. Many clients combine laundry with mudroom features for a practical, multifunctional space."
  },
  {
    patterns: ['kitchen island', 'island ideas', 'island seating', 'island storage'],
    response: "Kitchen islands serve as functional and social focal points. We design islands with features like seating areas, prep sinks, specialized storage, appliance integration (dishwasher drawers, microwave, beverage coolers), charging stations, and appropriate lighting. Size and configuration are customized to your kitchen's dimensions and your specific needs."
  },
  {
    patterns: ['walk in shower', 'curbless shower', 'shower design', 'large shower'],
    response: "Walk-in showers are one of our most requested bathroom features. Options include curbless entries for accessibility, multiple showerheads and body sprays, built-in niches and benches, designer tile work, frameless glass enclosures, linear drains, and smart shower systems with programmable water temperature and flow settings."
  },
  {
    patterns: ['basement finishing', 'basement remodel', 'lower level', 'basement ideas'],
    response: "Basement finishing maximizes your home's usable space. Our comprehensive approach addresses moisture control and proper insulation before creating spaces like family rooms, home theaters, bars, guest suites, home offices, or fitness areas. We carefully plan lighting, address ceiling height considerations, and ensure proper egress for safety."
  },
  
  // Family and lifestyle considerations
  {
    patterns: ['aging in place', 'senior friendly', 'accessible design', 'universal design', 'barrier free'],
    response: "Aging-in-place and universal design create homes that work for everyone throughout all life stages. Features include zero-step entries, wider doorways and hallways, lever handles, curbless showers with seating, strategic grab bar placement (or blocking for future installation), proper lighting, and thoughtful storage placement at accessible heights."
  },
  {
    patterns: ['child friendly', 'kid friendly', 'family home', 'playroom', 'children'],
    response: "Family-friendly design balances aesthetics with practicality. We incorporate features like durable, stain-resistant materials, rounded corners on countertops, soft-close drawers and cabinets, dedicated spaces for children's activities, smart storage solutions for toys and gear, and open layouts that allow for supervision while children play."
  },
  {
    patterns: ['pet friendly', 'dog', 'cat', 'animals', 'pet features', 'pet station'],
    response: "Pet-friendly renovations incorporate thoughtful features for your furry family members. These might include dedicated feeding stations with water connections, built-in pet beds, pet doors, specialized storage for supplies, mud room wash stations, durable flooring resistant to scratches and accidents, and fenced outdoor areas for safety."
  },
  
  // Home automation and technology references
  {
    patterns: ['smart home', 'home automation', 'connected home', 'tech', 'integrated technology'],
    response: "While we don't directly offer smart home installation services, our renovations can be designed to accommodate third-party smart home technologies. We recommend consulting with specialized smart home integrators for those specific needs, and we're happy to coordinate with them during your renovation project."
  },
  {
    patterns: ['media room', 'home theater', 'entertainment space', 'movie room', 'audio visual'],
    response: "Media and entertainment spaces combine technology with comfort. Our designs incorporate proper audio/visual equipment placement, acoustic treatments, specialized lighting with scene control, comfortable seating, and hidden storage for components. We work with AV specialists to ensure seamless integration of technology within the designed space."
  },
  {
    patterns: ['electrical outlets', 'usb outlets', 'charging station', 'power', 'electrical needs'],
    response: "Modern homes require thoughtful electrical planning. We design with abundant outlet placement, integrated USB charging ports, dedicated charging stations, proper circuits for high-demand appliances, and fixture placement that anticipates future needs. This is particularly important in kitchens, home offices, and media spaces."
  },
  
  // Project logistics
  {
    patterns: ['how to prepare', 'prep for renovation', 'get ready for remodel', 'before construction'],
    response: "Preparing for your project helps ensure a smooth process. We'll provide a detailed pre-construction checklist, including items to pack/protect, areas to clear, decisions to finalize, and timing considerations. For kitchen renovations, we help plan temporary cooking arrangements, while bathroom projects might require scheduling around alternative facilities."
  },
  {
    patterns: ['do it yourself', 'diy', 'partial diy', 'self install', 'save money diy'],
    response: "While some homeowners handle certain aspects themselves to reduce costs, we recommend professional installation for structural elements, plumbing, electrical, and complex finishes. If you're considering a partial DIY approach, we can discuss which elements are suitable for homeowner involvement and which require professional expertise for safety and quality."
  },
  {
    patterns: ['move walls', 'remove wall', 'open floor plan', 'load bearing', 'structural changes'],
    response: "Wall removal and structural modifications require careful engineering assessment. We evaluate which walls are load-bearing, design appropriate support solutions when needed, address mechanical systems that may be affected, and manage the permitting process for structural changes. Our goal is creating open, functional spaces while maintaining structural integrity."
  },
  {
    patterns: ['what do I need to decide', 'decisions to make', 'choices', 'options to select'],
    response: "The renovation decision process typically includes layout planning, material selections (cabinetry, countertops, flooring, tile, fixtures, hardware, paint/stain colors), appliance specifications, lighting plans, and various functional details. Our design team provides guidance throughout, breaking these choices into manageable phases to prevent overwhelming you."
  },
  
  // Maintenance and care
  {
    patterns: ['maintain', 'maintenance', 'care for', 'cleaning', 'upkeep', 'preserving'],
    response: "Proper maintenance ensures your renovation's longevity. We provide detailed care guides for all installed materials and systems. For natural stone, this includes appropriate cleaners and periodic sealing. Cabinetry may require specific cleaning methods, while hardwood floors benefit from particular maintenance routines. We're always available to answer care questions after project completion."
  },
  {
    patterns: ['lifetime', 'how long will it last', 'durability', 'lifespan', 'long lasting'],
    response: "Material lifespans vary significantly. Quality cabinetry should last 30+ years, stone countertops 20+ years, solid hardwood flooring can last generations with proper care and refinishing, quality plumbing fixtures 15-20 years, and appliances typically 10-15 years. We select materials balancing initial investment with long-term durability based on your priorities."
  },
  {
    patterns: ['eco friendly', 'sustainable', 'green building', 'environmentally conscious', 'energy efficient'],
    response: "Our sustainable building practices include energy-efficient systems and appliances, proper insulation and air sealing, water-conserving fixtures, sustainably sourced materials, low-VOC finishes for better indoor air quality, and construction waste recycling. We can discuss specific eco-friendly options for your project based on your environmental priorities."
  },
  
  // Additional property types and specific scenarios
  {
    patterns: ['historic home', 'old house', 'historic preservation', 'character', 'period features'],
    response: "Historic home renovations require specialized knowledge. We respect original architectural elements while tastefully incorporating modern functionality. This includes preserving millwork and plaster details, matching period-appropriate materials, addressing unique structural considerations of older homes, and working within historic district guidelines when applicable."
  },
  {
    patterns: ['investment property', 'rental', 'flip', 'resale value', 'return on investment'],
    response: "For investment properties, we focus on strategic improvements that maximize return. This typically means quality materials in high-impact areas like kitchens and bathrooms, neutral design choices with broad appeal, durable finishes that withstand tenant use, and careful budget allocation to improvements that increase rental rates or resale value."
  },
  {
    patterns: ['new construction', 'building new', 'ground up', 'new home', 'custom home'],
    response: "Our new construction services provide a complete solution from architectural design through final finishing. The process includes site planning, architectural design development, engineering, permitting, construction, and interior finishing. Building new offers complete customization while avoiding the constraints sometimes presented by existing structures."
  },
  {
    patterns: ['fire damage', 'water damage', 'restoration', 'insurance', 'rebuild after'],
    response: "Our restoration services help recover from property damage. We work directly with insurance companies, document damage thoroughly, address immediate concerns like water extraction or structural stabilization, and create a comprehensive restoration plan. Our goal is returning your property to pre-damage condition or better, managing the entire process to reduce your stress."
  }
];

// Add NEW specialized topic entries
const specializedTopicEntries: KnowledgeBaseEntry[] = [
  // Detailed information about specific construction techniques
  {
    patterns: ['what is a load bearing wall', 'load bearing', 'structural wall', 'support wall'],
    response: "Load-bearing walls support the weight of elements above them and are critical to your home's structural integrity. They typically run perpendicular to floor joists and can include exterior walls and some interior walls. Removing or modifying these requires proper engineering, support beams, permits, and professional installation to ensure structural safety."
  },
  {
    patterns: ['french drain', 'drainage solution', 'water in basement', 'yard drainage'],
    response: "French drains are a proven solution for water management, consisting of a trench filled with gravel and a perforated pipe that redirects water away from problem areas. We install both exterior French drains to manage landscape water and interior systems to address basement moisture. Each system is custom designed for your specific water issues and property characteristics."
  },
  {
    patterns: ['spray foam insulation', 'blown insulation', 'insulate attic', 'r value'],
    response: "We offer various insulation solutions including spray foam (highest R-value and air sealing properties), fiberglass batts (cost-effective for standard applications), blown cellulose (excellent for retrofitting existing walls and attics), and rigid foam board (ideal for basements). The right choice depends on your climate, project type, and energy efficiency goals."
  },
  
  // Advanced design and style guidance
  {
    patterns: ['transitional style', 'mix traditional modern', 'updated traditional', 'classic contemporary'],
    response: "Transitional design beautifully bridges traditional elegance with modern simplicity. This popular style features clean lines with select ornamental details, neutral color palettes with strategic accent colors, a mix of textures, and thoughtful material combinations like natural stone with sleek fixtures. It creates timeless spaces that feel both fresh and comfortable."
  },
  {
    patterns: ['midcentury modern', 'mid century', 'retro modern', '1950s style', '1960s style'],
    response: "Midcentury modern design embraces clean lines, organic curves, minimal ornamentation, and a connection to nature. For authentic midcentury renovations, we incorporate walnut and teak woods, iconic furniture silhouettes, statement lighting, graphic patterns, and strategic pops of color while adapting the style for modern functionality."
  },
  {
    patterns: ['industrial style', 'loft style', 'warehouse look', 'urban industrial', 'industrial chic'],
    response: "Industrial design celebrates raw materials and architectural elements with exposed brick, concrete surfaces, metal accents, visible ductwork/pipes, weathered wood, open spaces, and factory-inspired lighting. We can incorporate these elements in varying degrees, from subtle industrial touches to comprehensive warehouse-inspired transformations."
  },
  
  // Project-specific deep dives
  {
    patterns: ['lighting plan', 'lighting layers', 'lighting design', 'light fixtures', 'led lighting'],
    response: "Comprehensive lighting design includes ambient (general) lighting, task lighting for specific activities, accent lighting to highlight architectural features, and decorative fixtures as design statements. We create layered lighting plans with proper placement, appropriate color temperatures, dimmable options, and energy-efficient LED solutions to enhance both functionality and atmosphere."
  },
  {
    patterns: ['cabinet organization', 'kitchen storage', 'organizing solutions', 'storage systems'],
    response: "Modern cabinetry offers remarkable organization solutions including pull-out shelving, specialized drawers for utensils and spices, vertical dividers for trays and cutting boards, corner systems that maximize awkward spaces, appliance garages for countertop convenience, and custom configurations for your specific storage needs."
  },
  {
    patterns: ['heated floors', 'radiant heat', 'floor warming', 'heated tile'],
    response: "Radiant floor heating provides luxurious comfort, especially in bathrooms and kitchens. Options include electric systems ideal for smaller spaces or renovations, and hydronic (water-based) systems more efficient for larger areas. Installation occurs beneath tile, stone, engineered wood, or laminate flooring, creating consistent warmth without the drafts or noise of forced-air heating."
  },
  
  // Technical construction details
  {
    patterns: ['roof replacement', 'new roof', 'roofing materials', 'roof options'],
    response: "Roofing options include architectural asphalt shingles (30-year lifespan, cost-effective), metal roofing (50+ year lifespan, energy efficient), slate or tile (lifetime materials but require specialized installation), and various synthetic options. Selection factors include architectural style, climate conditions, budget considerations, and long-term maintenance requirements."
  },
  {
    patterns: ['siding options', 'exterior materials', 'house siding', 'exterior cladding'],
    response: "Exterior siding options include fiber cement (extremely durable with wood appearance), vinyl (low maintenance and cost effective), engineered wood (natural look with better performance than traditional wood), natural wood (classic but requires maintenance), stone veneer (elegant accent material), and stucco (distinctive texture with excellent longevity)."
  },
  {
    patterns: ['crawl space', 'encapsulation', 'vapor barrier', 'under house'],
    response: "Crawl space improvements dramatically impact home health and efficiency. Our crawl space services include moisture barrier installation, proper insulation, mold remediation when needed, structural repairs to floor joists, improved ventilation or full encapsulation depending on climate conditions, and pest prevention measures."
  },
  
  // Regional and environmental considerations
  {
    patterns: ['hurricane', 'storm protection', 'weather resistant', 'wind resistant'],
    response: "In regions vulnerable to severe weather, we incorporate storm-resistant features like impact-resistant windows, reinforced garage doors, hurricane strapping for stronger roof-to-wall connections, water-resistant building materials, elevated mechanical systems, and backup power solutions to enhance both safety and peace of mind."
  },
  {
    patterns: ['humid climate', 'moisture control', 'humidity', 'mold prevention'],
    response: "Humid climates require specialized building approaches. Our solutions include proper vapor barriers, strategic ventilation systems, moisture-resistant building materials, dehumidification systems integrated with HVAC, careful flashing details around all openings, and moisture monitoring systems for early detection of potential issues."
  },
  {
    patterns: ['allergen reduction', 'air quality', 'healthy home', 'clean air', 'allergies'],
    response: "For improved indoor air quality, we implement whole-house air filtration systems, ductwork cleaning and sealing, proper ventilation including energy recovery ventilators, low-VOC materials and finishes, humidity control, and surfaces that minimize dust collection and are easily cleaned."
  },
  
  // Customer experience enhancements
  {
    patterns: ['what to expect', 'renovation process', 'how it works', 'client experience'],
    response: "Our client experience includes initial consultation, detailed design development, comprehensive proposal with transparent pricing, product selection assistance, pre-construction meeting to review logistics, regular progress updates during construction, and thorough final walkthrough. Throughout this process, you'll have a dedicated project manager as your primary point of contact."
  },
  {
    patterns: ['3d design', 'visualization', 'see it before', 'computer model', 'renderings'],
    response: "Our design visualization tools help you see your project before construction begins. We create 3D renderings of proposed spaces, virtual walkthroughs for larger renovations, material and color boards to evaluate combinations, and CAD drawings of layouts and elevations. These tools ensure design decisions are made with confidence and clarity."
  },
  {
    patterns: ['after hours emergency', 'construction emergency', 'urgent problem', 'immediate help'],
    response: "We take emergencies seriously and provide all clients with 24/7 emergency contact information. For urgent situations during your project (water leaks, electrical issues, structural concerns, etc.), our response team is available to address immediate needs and prevent further damage or safety concerns."
  }
];

// Add more knowledge base entries to the existing array
const newTechnicalKnowledgeEntries: KnowledgeBaseEntry[] = [
  // Home systems and technical details
  {
    patterns: ['attic', 'attic conversion', 'attic space', 'bonus room', 'upstairs space'],
    response: "Attic conversions transform underutilized space into valuable living areas. The process involves assessing structural support, adding proper insulation, ensuring adequate ceiling height, installing appropriate flooring, and creating suitable access. We also address ventilation, temperature control, and natural light through strategic window placement or skylights."
  },
  {
    patterns: ['tankless water heater', 'on demand water heater', 'hot water system'],
    response: "Tankless water heaters provide endless hot water while reducing energy consumption. These systems heat water only when needed, eliminating standby energy losses. Installation considerations include proper sizing based on your household's demands, adequate gas line sizing for gas models, appropriate venting, and periodic maintenance to ensure maximum efficiency and longevity."
  },
  {
    patterns: ['energy audit', 'energy assessment', 'efficiency improvements', 'reduce energy bills'],
    response: "An energy audit identifies opportunities to improve your home's efficiency. Our assessment examines insulation levels, air sealing needs, window and door efficiency, HVAC performance, and appliance efficiency. From this evaluation, we develop a prioritized plan for improvements that will provide the greatest energy savings and comfort enhancements for your investment."
  },
  {
    patterns: ['insulation', 'r value', 'energy efficiency', 'thermal barrier'],
    response: "Proper insulation is critical for comfort and energy efficiency. We assess existing insulation levels and recommend improvements based on your climate zone's requirements. Options include fiberglass batts, blown cellulose, spray foam, and rigid foam board, each with different applications and performance characteristics. Strategic insulation upgrades often provide the highest return on investment for energy improvements."
  },
  {
    patterns: ['solar', 'solar panels', 'photovoltaic', 'solar power', 'renewable energy'],
    response: "Solar energy systems reduce environmental impact and long-term energy costs. Our solar integration includes site assessment for optimal placement, system sizing based on your energy consumption, coordination with licensed electrical contractors, assistance with incentive applications, and seamless roof integration or ground-mounted options depending on your property characteristics."
  },
  {
    patterns: ['generator', 'backup power', 'standby power', 'power outage'],
    response: "Backup power systems provide peace of mind during outages. Options range from portable generators to permanent standby systems that automatically activate when utility power fails. For whole-house solutions, we handle the entire process including proper sizing, fuel source connection (natural gas or propane), automatic transfer switch installation, and required permits and inspections."
  },
  {
    patterns: ['led lighting', 'lighting upgrade', 'energy efficient lights', 'modern lighting'],
    response: "LED lighting upgrades provide superior illumination while reducing energy consumption by up to 75% compared to incandescent lighting. Beyond energy savings, benefits include longer bulb life, reduced heat output, dimming capabilities, and various color temperature options to enhance your space's ambiance. We can upgrade existing fixtures or design an entirely new lighting plan."
  },
  
  // Materials and finishes expertise
  {
    patterns: ['porcelain tile', 'ceramic tile', 'tile types', 'floor tile', 'wall tile'],
    response: "Tile selection balances aesthetics, durability, and maintenance requirements. Porcelain offers superior hardness and water resistance for high-traffic or wet areas, while ceramic provides more design options at a lower price point. Large-format tiles create a sleek, modern look with fewer grout lines, while mosaic tiles add texture and visual interest. We help navigate these choices for each specific application."
  },
  {
    patterns: ['natural stone', 'marble maintenance', 'granite care', 'stone sealing', 'travertine'],
    response: "Natural stone maintenance varies by type. Granite requires sealing every 1-3 years and is relatively stain-resistant. Marble needs more frequent sealing (every 6-12 months) and immediate attention to acidic spills. Quartzite combines marble's beauty with granite's durability. We provide specific care instructions for your selected stone and can recommend appropriate cleaning products and sealing schedules."
  },
  {
    patterns: ['solid surface', 'quartz countertop', 'engineered stone', 'corian', 'silestone'],
    response: "Engineered surfaces offer exceptional durability and minimal maintenance. Quartz countertops (brands like Silestone, Caesarstone) resist staining, scratching, and heat while providing consistent patterns. Solid surface materials (like Corian) allow seamless installation with integrated sinks and backsplashes. These non-porous surfaces require no sealing and are available in countless colors and patterns."
  },
  {
    patterns: ['cabinet construction', 'cabinet quality', 'box construction', 'cabinet materials'],
    response: "Cabinet quality is determined by several factors: box construction (plywood vs. particleboard), drawer construction (dovetail joints and full-extension glides), door styles (overlay vs. inset), hardware quality, and finish durability. We offer various cabinet lines at different price points, helping you understand the differences and select options that balance your budget with desired longevity and features."
  },
  {
    patterns: ['backsplash', 'kitchen backsplash', 'tile design', 'splash protection'],
    response: "Backsplashes serve both functional and aesthetic purposes, protecting walls while making a design statement. Options include ceramic and porcelain tile in countless sizes and patterns, natural stone, glass tile for light reflection, metal tiles for industrial flair, full-height natural stone matching your countertops, and solid surface material for a seamless look. Installation height and area coverage depend on your cooking habits and aesthetic preferences."
  },
  {
    patterns: ['hardwood species', 'wood floors', 'oak vs maple', 'exotic hardwood'],
    response: "Different hardwood species offer varying aesthetics, hardness, and price points. Oak provides traditional grain patterns and good dent resistance, maple offers a smoother appearance with minimal graining, walnut delivers rich, dark tones, and hickory features dramatic color variation. Exotic species like Brazilian cherry or teak provide distinctive looks but typically at higher price points. We can discuss which species aligns with your style and durability needs."
  },
  {
    patterns: ['cabinet hardware', 'knobs and pulls', 'drawer pulls', 'cabinet handles'],
    response: "Cabinet hardware serves as 'jewelry' for your kitchen or bathroom while providing practical functionality. Options include various metals (brushed nickel, oil-rubbed bronze, polished chrome, brass, matte black), lengths for drawers of different widths, knobs vs. pulls, traditional vs. contemporary styles, and specialty options like appliance pulls for panel-ready refrigerators. We guide clients through these choices to complement their overall design."
  },
  
  // Specialized living spaces
  {
    patterns: ['inlaw suite', 'mother in law apartment', 'accessory dwelling', 'guest suite'],
    response: "In-law suites and accessory dwelling units (ADUs) provide flexible living space for family members or rental income. These typically include a bedroom, bathroom, living area, and kitchenette. Design considerations include private entrances, sound isolation, accessibility features for aging relatives, separate HVAC zoning, and compliance with local zoning regulations regarding secondary dwelling units."
  },
  {
    patterns: ['multi generational', 'multigenerational', 'family living', 'grandparents'],
    response: "Multigenerational homes accommodate family members of different ages with thoughtful design. Features might include first-floor master suites, multiple kitchen areas or kitchenettes, separate entrances for privacy, sound insulation between living zones, universal design elements for accessibility, and flexible spaces that adapt as family needs evolve."
  },
  {
    patterns: ['outdoor kitchen', 'outdoor living', 'patio kitchen', 'bbq area', 'grill space'],
    response: "Outdoor kitchens extend your living and entertaining space. Key components include weather-resistant cabinetry, appropriate countertop materials (granite, concrete, or specialized outdoor surfaces), built-in grills and cooking equipment, refrigeration, sink with plumbing considerations for winter, proper lighting for evening use, and overhead structures for shade and weather protection."
  },
  {
    patterns: ['wine cellar', 'wine storage', 'wine room', 'wine collection'],
    response: "Wine storage solutions range from climate-controlled closets to dedicated cellar rooms. Critical factors include consistent temperature control (55-57°F), proper humidity levels (50-70%), protection from UV light, vibration minimization, adequate bottle capacity for your collection, and aesthetic considerations like display lighting and racking systems in various woods or metal finishes."
  },
  {
    patterns: ['home gym', 'exercise room', 'fitness space', 'workout room'],
    response: "Home gym design addresses specialized needs including reinforced flooring for equipment weight, moisture-resistant materials for high-humidity environments, proper ventilation, mirrors for form checking, audiovisual systems, adequate electrical outlets for equipment, and sometimes rubberized flooring or acoustic treatments. We ensure the space functions perfectly for your specific fitness activities."
  },
  {
    patterns: ['sunroom', 'four season room', 'all season porch', 'enclosed porch'],
    response: "Sunrooms and four-season rooms maximize natural light while extending your living space. Design considerations include proper insulation for year-round comfort, appropriate window and door selection for energy efficiency, HVAC integration for climate control, flooring suitable for temperature fluctuations, and careful site orientation to balance solar gain with potential overheating."
  },
  
  // Project optimization and customization
  {
    patterns: ['space saving', 'small space', 'maximize space', 'efficient layout', 'compact design'],
    response: "Small space optimization employs several strategies: multi-functional furniture and built-ins, vertical storage solutions extending to ceiling height, pulling appliances and fixtures to appropriate scale, using glass and reflective surfaces to enhance perceived space, and carefully planned lighting. We excel at creating functional, beautiful spaces regardless of square footage constraints."
  },
  {
    patterns: ['hidden storage', 'secret storage', 'maximize storage', 'clever storage'],
    response: "Innovative storage solutions include toe-kick drawers beneath cabinets, pull-out pantries in narrow spaces, drawer dividers and organizers, cabinet doors concealing pull-out work surfaces, built-in window seats with storage beneath, hidden panels accessing storage in typically unused areas, and furniture with integrated storage functions. These solutions maintain clean aesthetics while maximizing functionality."
  },
  {
    patterns: ['wet bar', 'beverage station', 'coffee bar', 'drink station'],
    response: "Dedicated beverage areas enhance entertainment and daily convenience. These can include refrigerator drawers or wine/beverage coolers, appropriate storage for glassware, specialized dispensers (coffee, wine, draft systems), small sinks for convenience, and adequate counter space for preparation. These may be designed as focal points or discreetly integrated into your overall space."
  },
  {
    patterns: ['pantry', 'kitchen storage', 'walk in pantry', 'butler pantry'],
    response: "Modern pantry designs range from efficient cabinet pantries with pull-out shelving to dedicated walk-in rooms with custom organization. Butler's pantries located between kitchens and dining areas provide staging space for entertaining. Key considerations include adjustable shelving, proper lighting, ventilation for food storage, specialized storage for small appliances, and sometimes secondary refrigeration or dishwashing capabilities."
  },
  {
    patterns: ['built ins', 'custom built ins', 'built in cabinets', 'built in bookshelves'],
    response: "Custom built-ins maximize functionality while creating architectural interest. These can include window seats with storage beneath, entertainment centers designed for specific components, office workstations with integrated technology, bookshelves with integrated lighting, and bedroom storage systems. These permanent additions often increase property value while providing perfectly tailored storage solutions."
  }
];

// Add additional specialized conversation topics
const advancedSpecializedTopics: KnowledgeBaseEntry[] = [
  // HOA and community regulations
  {
    patterns: ['hoa', 'homeowner association', 'community regulations', 'architectural review', 'condo board'],
    response: "We have extensive experience working with HOAs and architectural review boards throughout Atlanta. Our process includes carefully reviewing all community guidelines before design begins, preparing comprehensive submission packages that meet requirements, attending review meetings when needed, and ensuring all work complies with association guidelines. We can help navigate even the strictest HOA processes."
  },
  {
    patterns: ['community restrictions', 'deed restrictions', 'covenant', 'neighborhood rules', 'approval process'],
    response: "Community restrictions vary widely across Atlanta neighborhoods. We begin by researching and understanding your specific community's guidelines, helping prepare all required documentation, creating designs that balance your vision with community requirements, and maintaining communication with review boards throughout the process. Our experience with numerous HOAs helps projects move smoothly through approval."
  },
  
  // Permit process details
  {
    patterns: ['permit timeline', 'how long permits take', 'permit process', 'building department', 'inspection schedule'],
    response: "The permit process timeline varies by jurisdiction and project scope. In the Atlanta area, simple permits might be approved in 2-3 weeks, while complex projects can take 6-8 weeks. Our process includes pre-application meetings when beneficial, complete and accurate submission packages, prompt responses to any requests for information, and established relationships with many local building departments to help navigate the process efficiently."
  },
  {
    patterns: ['permit types', 'inspection process', 'building inspector', 'failed inspection', 'pass inspection'],
    response: "Different project elements require specific permits - building, electrical, plumbing, mechanical, and sometimes specialized permits for historic properties or environmental considerations. Our team manages the entire inspection sequence, scheduling each inspection at appropriate construction phases, ensuring work meets or exceeds code requirements, addressing any concerns immediately, and documenting all approvals properly."
  },
  
  // Subcontractor management
  {
    patterns: ['subcontractors', 'trade contractors', 'electrician', 'plumber', 'specialized trades'],
    response: "Quality subcontractor management is essential for exceptional results. We maintain relationships with proven specialists in each trade who meet our rigorous standards for craftsmanship, reliability, and professionalism. All subcontractors are properly licensed, insured, background-checked, and have demonstrated consistent quality through our evaluation process. Their work is closely supervised by our project managers to ensure it meets our exacting standards."
  },
  {
    patterns: ['who does the work', 'your team', 'workers', 'crews', 'who will be in my home'],
    response: "Our construction team includes both our core staff and specialized trade partners. For your project, we assign a dedicated project manager who oversees all work, specialized trade contractors for specific elements (electrical, plumbing, etc.), and our in-house craftspeople for finish work requiring the highest precision. All team members undergo background checks, maintain proper licensing and insurance, and follow our strict professionalism guidelines."
  },
  
  // Supply chain considerations
  {
    patterns: ['material delays', 'supply chain', 'product availability', 'backordered', 'lead times'],
    response: "We actively manage supply chain considerations for every project. Our current approach includes early material selection and ordering for items with known lead times, maintaining relationships with multiple suppliers to find alternatives when needed, transparent communication about any potential delays, and strategic scheduling that can adapt to material availability challenges while maintaining overall project momentum."
  },
  {
    patterns: ['alternative materials', 'substitution', 'out of stock', 'discontinued products', 'shipping delays'],
    response: "When material availability challenges arise, our process includes presenting suitable alternatives that maintain your design intent, providing samples of proposed substitutions for approval, adjusting installation sequences to prevent project delays, and leveraging our supplier relationships to expedite orders whenever possible. We always communicate transparently about any necessary changes for your approval."
  },
  
  // Cultural and lifestyle-specific designs
  {
    patterns: ['kosher kitchen', 'cultural requirements', 'religious needs', 'prayer room', 'cultural design'],
    response: "We're experienced in designing spaces that accommodate specific cultural and religious requirements. For kosher kitchens, this includes separate preparation areas, dual appliances and sinks, specialized storage, and appropriate surfaces. Other cultural adaptations might include prayer spaces with proper orientation, specialized washing facilities, multigenerational living considerations, or specific furniture arrangements for cultural gatherings."
  },
  {
    patterns: ['feng shui', 'vastu shastra', 'cultural customs', 'traditional design', 'cultural elements'],
    response: "Our designers respect and incorporate cultural design principles like Feng Shui or Vastu Shastra when desired. We can address considerations such as proper room orientation, favorable furniture placement, appropriate use of colors and elements, and incorporation of cultural symbols or materials. We take time to understand the specific cultural priorities that matter to you and integrate them respectfully into your design."
  },
  
  // Phased renovation approaches
  {
    patterns: ['renovation phases', 'phased approach', 'renovate in stages', 'step by step remodel', 'project phases'],
    response: "Phased renovations offer several advantages for budget management and minimizing disruption. We develop comprehensive master plans that divide projects into logical, sequential phases, ensure each phase functions well until the next begins, carefully plan for future mechanical and structural needs, and create detailed timelines for each phase. This approach allows you to spread costs over time while working toward a cohesive final result."
  },
  {
    patterns: ['one room at a time', 'prioritize renovations', 'which room first', 'renovation order', 'staged remodeling'],
    response: "When approaching room-by-room renovations, we typically recommend addressing functional spaces like kitchens and primary bathrooms first, followed by living areas and secondary spaces. However, the ideal sequence depends on your specific priorities, budget considerations, and living arrangements during construction. We'll help develop a strategic phasing plan that minimizes disruption while maximizing immediate impact."
  },
  
  // Virtual consultations and remote design
  {
    patterns: ['virtual consultation', 'remote design', 'video call', 'online meeting', 'virtual walkthrough'],
    response: "Our virtual design process provides flexibility and convenience. It begins with video consultations where you can show us your space, followed by digital concept development, 3D rendering presentations via screen sharing, material sample shipments to your home, and regular video progress updates during construction. This process has been refined to be just as effective as in-person meetings while accommodating busy schedules and remote clients."
  },
  {
    patterns: ['design from distance', 'out of state', 'moving to atlanta', 'not local', 'remote client'],
    response: "We regularly work with clients who aren't locally available. Our remote client process includes virtual consultations, detailed photo and video documentation, secure online portals for document sharing and selections, regular scheduled updates via your preferred platform, and designated on-site contacts who can make decisions when you're unavailable. Many of our most successful projects have been completed for clients who visited only occasionally."
  },
  
  // Resale value considerations
  {
    patterns: ['resale value', 'return on investment', 'roi', 'home value', 'selling after renovation'],
    response: "Renovations that typically offer the strongest return on investment include kitchen and bathroom updates (approximately 70-80% ROI), adding usable square footage through finished basements or attic conversions, creating outdoor living spaces, and improving energy efficiency. We can help prioritize improvements that balance your enjoyment of the space with potential return, particularly if you plan to sell within a few years."
  },
  {
    patterns: ['best value improvements', 'cost vs value', 'increase home value', 'smart investment', 'buyers want'],
    response: "For maximum home value impact, we recommend focusing on kitchen and bathroom modernization, creating open-concept living spaces where appropriate, adding energy-efficient features, improving curb appeal, and ensuring all mechanical systems are updated and reliable. We also advise selecting somewhat neutral finishes for major elements if resale is a priority, while expressing personal style through easily changed elements."
  },
  
  // Disaster preparedness and resilient design
  {
    patterns: ['storm resistant', 'hurricane preparation', 'disaster ready', 'emergency power', 'backup systems'],
    response: "Resilient home design includes several key elements: impact-resistant windows and doors, reinforced roof connections, elevated critical systems in flood-prone areas, backup power solutions (generators or battery systems), water management strategies, fire-resistant construction materials where appropriate, and safe rooms in severe weather regions. We can incorporate these features subtly while enhancing your home's functionality and safety."
  },
  {
    patterns: ['flood protection', 'fire resistant', 'tornado safe room', 'storm shelter', 'resilient design'],
    response: "Protecting your home from specific environmental threats might include foundation waterproofing and exterior drainage systems for flood mitigation, fire-resistant exterior materials and landscape design in fire-prone areas, reinforced safe rooms for tornado protection, or specialized construction techniques for seismic activity. We tailor these protective measures to address the specific environmental considerations of your property."
  },
  
  // Seasonal home maintenance
  {
    patterns: ['maintenance schedule', 'seasonal maintenance', 'care calendar', 'annual maintenance', 'home care'],
    response: "After completion, we provide a comprehensive maintenance calendar for your renovated spaces. This includes seasonal tasks like HVAC filter changes and maintenance, gutter cleaning, weather stripping inspection, winterizing procedures for exterior features, deck/patio treatment schedules, and specific care instructions for the materials in your renovation. Proper maintenance significantly extends the life of your investment."
  },
  {
    patterns: ['winter preparation', 'summer maintenance', 'spring checklist', 'fall home care', 'seasonal checklist'],
    response: "Each season requires specific maintenance attention. Winter preparation includes insulation checks, pipe protection, and heating system maintenance. Spring typically focuses on assessing any winter damage, exterior cleaning, and HVAC transitions. Summer maintenance addresses cooling efficiency and outdoor living spaces, while fall preparation includes weatherization and heating system readiness. We provide detailed checklists for each season."
  },
  
  // Atlanta neighborhood specifics
  {
    patterns: ['historic districts', 'midtown atlanta', 'buckhead renovation', 'inman park', 'virginia highland'],
    response: "Atlanta's historic neighborhoods like Inman Park, Virginia-Highland, and Grant Park have specific requirements for renovations. We're familiar with the unique characteristics and review processes for these areas, including historic preservation guidelines, appropriate architectural styles, permitted materials, and the documentation required for approval. Our experience in these neighborhoods ensures smooth navigation of their specific requirements."
  },
  {
    patterns: ['atlanta suburbs', 'marietta', 'decatur', 'alpharetta', 'dunwoody', 'sandy springs'],
    response: "We work throughout Atlanta's suburban communities, each with distinct characteristics. Whether it's the historic charm of Marietta and Decatur, the upscale requirements of Sandy Springs and Alpharetta, or the specific HOA guidelines in planned communities, we understand the local building departments, permit requirements, and design preferences of each area, ensuring your project meets all local regulations."
  },
  
  // Budgeting strategies
  {
    patterns: ['budget planning', 'cost tracking', 'stay on budget', 'budget concerns', 'price creep'],
    response: "Our budget management strategy includes detailed initial estimates broken down by category, clear allowances for selections, transparent pricing for any changes, regular budget updates throughout the project, and proactive options if unexpected issues arise. We've developed systems to prevent the 'scope creep' common in renovation projects and keep you informed about your budget status at all times."
  },
  {
    patterns: ['what costs more', 'save money on project', 'budget choices', 'splurge or save', 'maximize budget'],
    response: "Maximizing your renovation budget typically means investing in high-quality structural elements, plumbing, and electrical work which are difficult to change later, while finding strategic savings in finish materials where appropriate. We can suggest where higher investments deliver lasting value (like cabinetry construction quality) versus where more affordable options perform nearly as well with minimal compromise."
  },
  
  // Contract and payment details
  {
    patterns: ['contract details', 'change orders', 'payment schedule', 'project milestones', 'billing process'],
    response: "Our contract process is designed for clarity and protection. We provide detailed written agreements specifying all work to be performed, materials to be used, project timeline with milestone dates, payment schedule tied to construction progress, change order procedures, warranty information, and dispute resolution processes. We're happy to explain any aspect of our contracts to ensure your complete understanding and comfort."
  },
  {
    patterns: ['payment terms', 'invoice timing', 'progress payments', 'final payment', 'payment methods'],
    response: "Our typical payment schedule includes an initial deposit to secure your project date and cover preliminary expenses, followed by progress payments at clearly defined construction milestones. Payments are correlated with completed work, never getting significantly ahead of progress. Final payment is due only after all work is complete, inspections passed, and you've conducted a thorough walk-through with our project manager."
  },
  
  // ADD NEW SECTION: Detailed Residential Services
  // Kitchen Renovation Details
  {
    patterns: ['kitchen renovation details', 'kitchen remodel specifics', 'kitchen project scope', 'what\'s included in kitchen remodel'],
    response: "Our comprehensive kitchen renovations typically include cabinet replacement or refinishing, countertop installation, backsplash design and installation, updated lighting (ambient, task, and accent), plumbing fixture updates, flooring replacement or refinishing, appliance installation, and expert painting. We handle all aspects from design through completion, including any necessary electrical upgrades, plumbing modifications, and structural changes to create your ideal kitchen layout."
  },
  {
    patterns: ['kitchen styles', 'kitchen design trends', 'popular kitchen looks', 'kitchen aesthetics'],
    response: "Current kitchen design trends include clean-lined transitional styles that blend traditional elements with contemporary touches, integrated smart appliances and charging stations, mixed cabinet finishes with contrasting islands, statement backsplashes, custom range hoods, and innovative storage solutions. We can help you create a design that reflects current trends while remaining timeless enough to enjoy for many years."
  },
  {
    patterns: ['kitchen countertops', 'countertop materials', 'best kitchen counters', 'counter options'],
    response: "We offer a full range of countertop options including granite (natural stone with unique patterns), quartz (engineered stone with consistent patterns and high durability), marble (elegant but requires more maintenance), solid surface (seamless with integrated sinks), butcher block (warm wood requiring periodic maintenance), and specialty materials like concrete, soapstone, or porcelain. Each has different aesthetic qualities, durability factors, and price points to consider."
  },
  {
    patterns: ['kitchen cabinets', 'cabinet styles', 'cabinet construction', 'cabinet materials'],
    response: "Our kitchen cabinet options include custom (built precisely to your specifications), semi-custom (manufactured cabinets with size and finish flexibility), and stock (pre-manufactured in standard sizes). Construction quality varies from basic particleboard to premium plywood box construction with dovetailed, soft-close drawers. Door styles range from shaker to flat-panel modern to detailed traditional profiles, available in wood species, painted finishes, or mixed materials."
  },
  
  // Bathroom Renovation Details
  {
    patterns: ['bathroom renovation details', 'bathroom remodel specifics', 'bathroom project scope', 'what\'s included in bathroom remodel'],
    response: "Our bathroom renovations typically include tub and/or shower updates (replacement or refinishing), vanity and countertop installation, toilet replacement, flooring installation, tile work for walls and shower surrounds, lighting improvements, ventilation updates, plumbing fixture replacement, and painting. For master bathrooms, we often incorporate luxury elements like heated floors, custom shower systems, and specialized storage solutions."
  },
  {
    patterns: ['shower options', 'shower types', 'shower designs', 'custom showers'],
    response: "We create custom showers ranging from simple updated surrounds to luxury spa experiences. Options include walk-in designs with minimal curbs or fully curbless entries, frameless glass enclosures, built-in niches and benches, multiple showerheads and body sprays, rainfall fixtures, steam shower capability, linear drains, and digital temperature controls. Tile options range from budget-friendly ceramic to premium natural stone in various patterns and layouts."
  },
  {
    patterns: ['bathroom vanity', 'sink options', 'bathroom cabinets', 'vanity styles'],
    response: "Bathroom vanities serve as both functional storage and style statements. Options include floating vanities for a contemporary look, furniture-style vanities for traditional spaces, double sink configurations for shared bathrooms, tower storage for smaller spaces, and custom configurations for unique rooms. Sink styles include undermount for easy cleaning, vessel sinks as design features, integrated solid surface, and traditional drop-ins."
  },
  {
    patterns: ['small bathroom ideas', 'maximize bathroom space', 'bathroom storage', 'compact bathroom'],
    response: "For smaller bathrooms, we implement space-maximizing techniques like wall-mounted toilets and vanities to increase floor visibility, glass shower enclosures instead of shower curtains, strategic mirror placement to enhance perceived space, recessed storage niches, vertical storage solutions, pocket doors to eliminate swing space, and properly scaled fixtures that maintain functionality without overwhelming the space."
  },
  
  // Whole Home Renovation
  {
    patterns: ['whole home renovation', 'entire house remodel', 'complete renovation', 'full house update'],
    response: "Whole home renovations transform your entire living experience and typically include kitchen and bathroom updates, flooring replacement throughout, interior door and trim upgrades, lighting improvements, paint or wallcovering, HVAC and electrical updates as needed, and often floor plan modifications to improve flow and functionality. These comprehensive projects require careful phasing and coordination but deliver dramatic results by creating cohesive design throughout your home."
  },
  {
    patterns: ['open concept', 'open floor plan', 'remove walls', 'open up space', 'more open'],
    response: "Creating open-concept living spaces remains popular and typically involves removing walls between kitchens, dining areas, and living rooms to improve flow, light penetration, and social connectivity. This process requires careful structural assessment, potentially installing support beams to carry loads from removed walls, addressing mechanical systems that may be in those walls, and often redesigning flooring, lighting, and finishes to create visual continuity throughout the newly opened space."
  },
  {
    patterns: ['living during renovation', 'renovation with family', 'stay during construction', 'live through remodel'],
    response: "Living in your home during a whole-house renovation requires careful planning. We typically create a phased approach, keeping essential spaces like one bathroom functional throughout, establishing temporary kitchen facilities when necessary, using dust containment systems to protect uninvolved areas, maintaining secure separation between living and construction zones, and establishing clear communication protocols about daily work schedules and any utility interruptions."
  },
  
  // Home Additions
  {
    patterns: ['home addition', 'room addition', 'add space', 'expand home', 'extra room'],
    response: "Home additions expand your living space by building new structural elements. Popular additions include family room expansions, primary bedroom suites, expanded kitchens, sunrooms, and second-story additions. The process includes architectural design, foundation work, framing, roofing, exterior finishing to match existing structures, window and door installation, and complete interior finishing including all mechanical systems, insulation, and finishes."
  },
  {
    patterns: ['second story addition', 'add upstairs', 'second floor addition', 'vertical addition'],
    response: "Second-story additions maximize your home's footprint by building upward. This process requires structural engineering to ensure your existing foundation and first-floor walls can support the additional weight, temporary roof protection during construction, staircase addition or modification, and potentially upgrading mechanical systems. While more complex than ground-level additions, this approach preserves yard space and often costs less per square foot than building outward."
  },
  {
    patterns: ['room over garage', 'garage apartment', 'bonus room', 'above garage space'],
    response: "Converting space above a garage creates valuable living area for home offices, guest rooms, media spaces, or even accessory dwelling units. This typically involves adding or improving insulation, ensuring proper fire separation between garage and living space, potentially reinforcing the ceiling/floor structure, adding appropriate heating and cooling, creating suitable access, and finishing the space to match your home's interior quality level."
  },
  {
    patterns: ['mother in law suite', 'in law addition', 'accessory dwelling', 'secondary living space', 'guest suite'],
    response: "In-law suites or accessory dwelling units create independent or semi-independent living spaces and typically include a bedroom, full bathroom, living area, and kitchenette or full kitchen. Design considerations include accessibility features for aging residents, separate entrances when desired, sound isolation, private outdoor spaces in some cases, and compliance with local zoning regulations. These versatile spaces adapt to changing family needs from housing relatives to rental income potential."
  },
  
  // Basement Finishing
  {
    patterns: ['basement finishing', 'finish basement', 'basement conversion', 'basement remodel'],
    response: "Basement finishing transforms underutilized space into valuable living area. Our comprehensive approach begins with moisture assessment and remediation if needed, then includes framing exterior walls with proper insulation, installing appropriate flooring systems, adding or upgrading lighting, extending HVAC systems, potentially adding bathroom facilities, and creating specialized spaces like home theaters, game rooms, home offices, or additional bedrooms per your needs."
  },
  {
    patterns: ['basement bathroom', 'adding bathroom to basement', 'basement plumbing', 'below grade bathroom'],
    response: "Adding a bathroom to your basement often requires specialized plumbing solutions. Depending on your home's configuration, options include gravity drainage if the waste lines are positioned appropriately, up-flush systems (saniflo) that pump waste upward to existing drain lines, or installation of a sewage ejector pit and pump system. We'll assess your specific situation and recommend the most reliable and cost-effective approach for your basement bathroom."
  },
  {
    patterns: ['basement egress', 'basement windows', 'egress requirements', 'basement emergency exit'],
    response: "Basement bedrooms require code-compliant egress windows or doors for safety. This typically involves installing window wells with properly sized windows, ensuring the correct sill height and opening dimensions, providing appropriate drainage for the window well, and in some cases excavating to create the necessary opening in foundation walls. These requirements ensure safe exit during emergencies and are essential for legal basement bedroom spaces."
  },
  
  // Specialized Residential Services
  {
    patterns: ['home office conversion', 'create office', 'work from home space', 'office design'],
    response: "Our home office creations focus on both functionality and design. We consider proper lighting to reduce eye strain (natural light plus layered electrical lighting), sound attenuation for video calls, built-in storage and organizational systems, appropriate electrical and data connectivity, ergonomic workspace design, background aesthetics for video conferencing, and often include flexible features allowing the space to serve multiple purposes when needed."
  },
  {
    patterns: ['mudroom design', 'mudroom addition', 'entryway organization', 'drop zone'],
    response: "Mudrooms provide essential transition space between outdoors and living areas. Our designs typically include durable flooring resistant to moisture and dirt, wall hooks or custom cubbies for each family member, bench seating for removing shoes, concealed storage for seasonal items, charging stations for devices, message centers, and often pet-specific features like washing stations or feeding areas, all configured to match your family's specific needs."
  },
  {
    patterns: ['flooring replacement', 'new floors', 'hardwood installation', 'tile floors', 'flooring options'],
    response: "Our flooring services include installation of hardwood (solid and engineered), luxury vinyl plank, porcelain and ceramic tile, natural stone, laminate, and carpeting. We handle all aspects including removal and disposal of existing flooring, subfloor preparation or replacement when necessary, expert installation with proper transitions between materials, and finishing details. Each flooring type has specific benefits for different spaces that we can discuss based on your needs."
  },
  {
    patterns: ['aging in place renovation', 'senior friendly remodel', 'accessible home', 'universal design', 'accessibility update'],
    response: "Our aging-in-place and accessibility renovations create safe, comfortable environments while maintaining sophisticated aesthetics. Features typically include zero-step entries, wider doorways and hallways, curbless showers with seating, comfort-height toilets, lever handles on doors and faucets, improved lighting, strategic grab bar placement, accessible storage, and thoughtful space planning that accommodates potential mobility devices while still feeling like a beautiful home rather than an institutional setting."
  },
  
  // Exterior Residential Services
  {
    patterns: ['exterior renovation', 'home exterior', 'curb appeal', 'outside of house', 'facade update'],
    response: "Our exterior renovation services revitalize your home's appearance and protection. These projects typically include siding repair or replacement, window and door updates, roof assessment, trim and soffit renewal, painting or surface treatments, improved drainage systems, lighting enhancements, and often front entry features like porches or porticos. We carefully coordinate these elements to create a cohesive, attractive exterior that protects your home."
  },
  {
    patterns: ['siding options', 'house siding', 'exterior cladding', 'siding materials', 'best siding'],
    response: "We install a variety of siding options including fiber cement (like James Hardie, offering durability and fire resistance), vinyl (low-maintenance and cost-effective), engineered wood (natural appearance with better durability), traditional wood (classic appearance requiring more maintenance), stucco (distinctive texture with excellent longevity), and stone veneer (for accent areas or full facades). Each option provides different aesthetics, performance characteristics, and price points."
  },
  {
    patterns: ['exterior paint', 'house painting', 'paint colors', 'exterior finishes', 'painting siding'],
    response: "Exterior painting transforms your home's appearance and provides crucial protection. Our process includes thorough preparation (cleaning, scraping, priming), quality materials specified for your particular siding type, proper application techniques, and detailed finishing work around trim, doors, and windows. We help with color selection through samples and digital visualization tools, ensuring cohesive schemes that complement your home's architecture and neighborhood context."
  },
  {
    patterns: ['window replacement', 'new windows', 'energy efficient windows', 'window types', 'window styles'],
    response: "Our window replacement services improve both aesthetics and energy efficiency. We install various styles including double-hung (traditional with two operable sashes), casement (side-hinged, excellent ventilation), sliding, picture (fixed for maximum views), bay or bow (projecting outward), and specialty shapes. Energy-efficient options include double or triple glazing, low-E coatings, gas filling, and proper insulation around frames to maximize performance and comfort."
  },
  {
    patterns: ['roof replacement', 'new roof', 'roofing options', 'roof materials', 'roof installation'],
    response: "Roof replacement is a critical investment in your home's protection. We install various materials including architectural asphalt shingles (dimensional appearance, 30+ year lifespan), metal roofing (standing seam or metal shingles, 50+ year lifespan), cedar shakes (natural appearance requiring maintenance), slate (premium natural material with generational lifespan), and various synthetic options. Each system includes proper underlayment, flashing, ventilation, and drainage details for comprehensive protection."
  },
  
  // Outdoor Living Spaces
  {
    patterns: ['deck construction', 'build deck', 'deck design', 'deck materials', 'backyard deck'],
    response: "Our deck designs create personalized outdoor living spaces. Material options include pressure-treated lumber (cost-effective, requires regular maintenance), cedar or redwood (natural beauty, moderate durability), composite decking (low maintenance, consistent appearance), PVC decking (fully synthetic, extremely durable), and tropical hardwoods like ipe (premium appearance and longevity). Designs can incorporate multiple levels, built-in seating, privacy features, custom railings, and integrated lighting for evening enjoyment."
  },
  {
    patterns: ['patio design', 'stone patio', 'backyard patio', 'outdoor patio', 'paver patio'],
    response: "We create patios using various materials including poured concrete (versatile, can be stamped or stained), concrete pavers (available in numerous shapes and colors), natural stone (like flagstone or bluestone for organic appearance), brick pavers (traditional appearance with excellent durability), and porcelain outdoor tile (contemporary look with low maintenance). Designs can incorporate fire features, seat walls, outdoor kitchens, pergolas for shade, and integrated drainage systems for proper water management."
  },
  {
    patterns: ['pergola', 'outdoor shade', 'backyard structure', 'patio cover', 'shade structure'],
    response: "Pergolas add architectural interest and defined space to outdoor areas. Materials include cedar or redwood (traditional appearance, natural durability), pressure-treated lumber (economical option), fiberglass (low maintenance, highly durable), aluminum (minimal maintenance, modern look), or vinyl (consistent appearance, no painting required). Designs can include solid roof sections, retractable canopies, privacy screening, integrated lighting, and fan systems for comfort."
  },
  {
    patterns: ['outdoor kitchen', 'bbq area', 'backyard cooking', 'grill station', 'outside kitchen'],
    response: "Our outdoor kitchens range from simple grill stations to comprehensive cooking and entertaining spaces. Components include built-in grills (natural gas or propane), countertop space for preparation and serving, refrigeration, storage cabinets designed for outdoor conditions, sinks with proper drainage, specialty cooking equipment like pizza ovens or smokers, and overhead protection for comfortable use regardless of weather. Materials are selected specifically for durability in outdoor environments."
  },
  {
    patterns: ['landscaping', 'landscape design', 'yard renovation', 'plantings', 'garden planning'],
    response: "Our landscape design services enhance your property's beauty and functionality. We create comprehensive plans including properly scaled plantings (trees, shrubs, perennials, and groundcovers), hardscape elements like walkways and patios, lighting design for evening enjoyment, irrigation systems for plant health, drainage solutions to protect your property, and distinctive features like water elements or garden structures. All designs consider maintenance requirements to match your lifestyle preferences."
  },
  
  // Infrastructure Planning
  {
    patterns: ['wiring infrastructure', 'electrical planning', 'cable management', 'wiring upgrade', 'modern electrical'],
    response: "We create robust electrical and wiring infrastructure during renovations that support modern living needs. Our approach includes strategic outlet placement, proper capacity planning for current and future needs, dedicated circuits for high-demand applications, structured wiring conduits for flexibility, and network/data cabling to support internet connectivity throughout your home."
  },
  {
    patterns: ['lighting design', 'interior lighting', 'light fixtures', 'lighting layout', 'recessed lighting'],
    response: "Our comprehensive lighting design creates layered illumination for both function and ambiance. We implement ambient lighting for general illumination, task lighting for specific activities, accent lighting to highlight architectural features, and decorative fixtures as design statements. Our electrical planning ensures proper circuits, switch configurations, and fixture placement for optimal lighting throughout your space."
  },
  {
    patterns: ['security system', 'home security', 'surveillance', 'security cameras', 'alarm system'],
    response: "Modern security systems offer comprehensive protection and convenience. Components can include smart locks with keyless entry, doorbell cameras, perimeter monitoring, motion detection, glass-break sensors, indoor and outdoor cameras with night vision, automated lighting tied to security events, water and environmental monitoring, and mobile app control allowing you to monitor your home from anywhere. We design systems scaled to your specific concerns and property characteristics."
  },
  {
    patterns: ['home network', 'wifi system', 'internet setup', 'structured wiring', 'network installation'],
    response: "A robust home network is essential for modern living. Our technology infrastructure services include professional-grade WiFi systems with proper coverage throughout your home, structured wiring with centralized distribution panels, hardwired connections for critical devices, proper equipment selection and placement, network security implementation, and consideration of future needs. This foundation supports reliable operation of all your connected devices and entertainment systems."
  },
  
  // Energy Efficiency Upgrades
  {
    patterns: ['energy efficiency', 'lower energy bills', 'efficient home', 'energy saving', 'reduce energy use'],
    response: "Energy efficiency improvements can significantly reduce utility costs while increasing comfort. Our approach includes comprehensive assessment of current performance, thermal envelope improvements (insulation and air sealing), HVAC system evaluation and possible upgrades, window and door efficiency, water heating efficiency, lighting improvements, and smart technology to optimize energy use. These upgrades often qualify for utility incentives or tax benefits that improve return on investment."
  },
  {
    patterns: ['insulation options', 'add insulation', 'energy audit', 'air sealing', 'thermal improvement'],
    response: "Proper insulation dramatically impacts energy efficiency and comfort. We evaluate existing insulation levels and recommend improvements using various materials including fiberglass batts or blown insulation, cellulose (environmentally friendly, excellent sound dampening), spray foam (highest R-value and air sealing), rigid foam board (ideal for basements and rim joists), and radiant barriers for attics in hot climates. Comprehensive air sealing complements insulation to eliminate energy-wasting drafts."
  },
  {
    patterns: ['solar panels', 'solar power', 'solar energy', 'photovoltaic', 'renewable energy'],
    response: "Solar energy systems provide long-term electrical cost savings and environmental benefits. Our solar integration services include site assessment for optimal panel placement, system sizing based on your energy consumption, equipment selection from industry-leading manufacturers, coordination with licensed electrical contractors, assistance with incentive applications and utility connections, and options for battery storage systems that provide power during outages."
  },
  {
    patterns: ['hvac upgrade', 'heating cooling system', 'furnace replacement', 'air conditioning', 'heat pump'],
    response: "HVAC upgrades improve comfort, air quality, and energy efficiency. Options include high-efficiency furnaces (95%+ AFUE ratings), air conditioning systems (up to 20+ SEER ratings), heat pumps for efficient heating and cooling with one system, ductless mini-split systems for zoned comfort, advanced filtration for allergen reduction, humidity control systems, and smart thermostats for optimization. Proper sizing and installation are critical for achieving rated efficiency levels."
  },
  
  // Interior Design Integration
  {
    patterns: ['interior design services', 'designer help', 'professional design', 'design assistance', 'decorator'],
    response: "Our interior design services create cohesive, personalized spaces that reflect your lifestyle and aesthetic preferences. Services include space planning and furniture layout, material and finish selection, color scheme development, custom built-in design, window treatment specification, lighting design, decorative hardware selection, and accessory curation. We offer various service levels from single-room consultations to comprehensive whole-house design, working collaboratively with our construction team for seamless implementation."
  },
  {
    patterns: ['material selection', 'finish choices', 'design center', 'selecting materials', 'choose finishes'],
    response: "The material selection process is a collaborative experience guided by our design professionals. We begin with understanding your preferences and budget, then present curated options that coordinate beautifully together. Our selection process includes countertops, cabinetry, flooring, tile, plumbing fixtures, lighting fixtures, hardware, paint colors, and specialty items, organized to prevent overwhelming choices while ensuring your space reflects your personal style."
  },
  {
    patterns: ['color consultation', 'paint colors', 'color scheme', 'interior colors', 'paint selection'],
    response: "Color selection fundamentally impacts your space's atmosphere. Our design team guides this process by considering architectural features, natural and artificial lighting conditions, existing elements being retained, transitions between spaces for whole-house coherence, and current trends balanced with timeless appeal. We provide sample evaluation in your actual space under various lighting conditions to ensure confident decisions before implementation."
  },
  {
    patterns: ['furniture layout', 'space planning', 'room arrangement', 'furniture placement', 'traffic flow'],
    response: "Thoughtful space planning optimizes both functionality and aesthetics. Our design process addresses traffic flow patterns, conversation groupings, proper clearances for comfortable movement, relationship to architectural features like windows and fireplaces, television and technology placement, scale and proportion of furnishings to the space, and flexibility for various activities. This planning ensures your rooms function perfectly for your lifestyle while looking beautifully composed."
  },
  
  // Specialized Rooms and Features
  {
    patterns: ['walk in closet', 'closet design', 'closet system', 'wardrobe design', 'master closet'],
    response: "Our custom closet designs maximize both storage capacity and organization. Features include adjustable shelving for flexibility, double hanging sections for efficient space use, specialized storage for accessories and shoes, drawer systems for folded items, hamper integration, proper lighting (both ambient and task), full-length mirror placement, and occasionally seating or islands in larger spaces. Systems can be built-in millwork or high-quality modular systems depending on your preferences and budget."
  },
  {
    patterns: ['laundry room', 'mudroom laundry', 'laundry design', 'washer dryer area', 'utility room'],
    response: "Modern laundry spaces combine efficiency with style. Our designs typically include dedicated spaces for sorting and folding, specialized storage for supplies, counter space for processing, utility sink options, proper ventilation and lighting, space-saving drying solutions, organizational systems for household items, and often pet-friendly features. Depending on your home's layout, we can create combined mudroom/laundry spaces that efficiently manage household entry and clothing care."
  },
  {
    patterns: ['luxury features', 'high end options', 'premium features', 'luxury home', 'upscale finishes'],
    response: "Luxury home features elevate both experience and aesthetics. Popular options include heated flooring systems, towel warmers, steam showers, whole-house audio, motorized window treatments, wine storage solutions, custom range hoods, integrated appliances, specialty cooking stations, hidden storage solutions, architectural ceiling treatments, custom millwork details, advanced electrical infrastructure, and wellness-focused elements like water filtration systems and specialized lighting to support healthy living."
  },
  {
    patterns: ['home bar', 'wet bar', 'bar design', 'entertainment bar', 'drinking station'],
    response: "Custom home bars create sophisticated entertainment spaces. Designs can include cabinetry for glassware and bottle storage, refrigeration (beverage centers or wine coolers), ice makers for entertainment, sinks with proper plumbing, specialized displays for featured bottles, counter space for preparation and serving, appropriate lighting including accent options, and sometimes tap systems for beer or specialized dispensers. Scale and features are customized to your entertainment style and available space."
  },
  {
    patterns: ['fireplace design', 'fireplace renovation', 'fireplace update', 'fireplace surround', 'mantel design'],
    response: "Fireplace transformations create dramatic focal points. Options include updating surrounds with materials like natural stone, porcelain tile, brick, concrete, or wood; mantel redesign from simple floating shelves to elaborate traditional profiles; firebox conversion from wood-burning to gas or electric for convenience; extended architectural features like floor-to-ceiling treatments; and occasionally technology integration with recessed television mounting above."
  },
  
  // Home styles and period-appropriate renovations
  {
    patterns: ['traditional home', 'colonial style', 'classic renovation', 'traditional design', 'classic style'],
    response: "For traditional and colonial homes, our renovations respect architectural heritage while incorporating modern functionality. Design elements typically include detailed millwork and crown molding, raised panel cabinetry, natural stone or quartz countertops with detailed edge profiles, hardwood flooring, traditional fixtures with timeless finishes like polished nickel or antique brass, and classic tile patterns. We balance period-appropriate aesthetics with contemporary performance and convenience features."
  },
  {
    patterns: ['modern home', 'contemporary design', 'modern renovation', 'sleek design', 'minimalist home'],
    response: "Modern and contemporary renovations emphasize clean lines, intentional simplicity, and precise detailing. Features typically include flat-panel cabinetry with minimal hardware, quartz or porcelain countertops with waterfall edges, large-format tile, engineered flooring in light or gray tones, architectural lighting solutions, frameless glass enclosures, floating vanities, linear drains, and integrated technology. The aesthetic achieves sophistication through restraint rather than ornate detailing."
  },
  {
    patterns: ['craftsman style', 'arts and crafts', 'bungalow renovation', 'craftsman design', 'craftsman details'],
    response: "Craftsman and Arts & Crafts renovations celebrate natural materials and artisan quality. Characteristic elements include quarter-sawn oak or other expressive woods, detailed but straightforward millwork, built-in cabinetry with visible joinery, handcrafted tile (often with nature motifs), oil-rubbed bronze or copper fixtures and hardware, stained glass accents, and earth-toned color palettes. We honor this aesthetic while sensitively integrating modern systems and convenience features."
  },
  {
    patterns: ['mid century modern', 'midcentury renovation', '1950s home', '1960s house', 'retro modern'],
    response: "Mid-century modern renovations balance vintage character with contemporary function. Distinctive elements include clean lines with organic curves, walnut and teak wood tones, terrazzo or large-format tile, geometric patterns, statement lighting fixtures, indoor-outdoor connections through expanded glazing, floating vanities, carefully curated color accents, and preservation of original architectural details when possible. The approach respects the era's innovative spirit while enhancing livability for today."
  },
  
  // Practical homeowner concerns
  {
    patterns: ['renovation timeline', 'how long will it take', 'project schedule', 'construction time', 'completion date'],
    response: "Project timelines vary based on scope and complexity. Bathroom renovations typically require 3-5 weeks from demolition to completion, kitchen renovations usually take 6-8 weeks, full home interior renovations might require 2-4 months depending on scope, and additions typically need 3-6 months from breaking ground to completion. The planning phase before construction (design, selections, permitting) often takes 1-3 months for proper preparation. These timeframes assume normal conditions - material backorders, change orders, or discovery issues can extend timelines. We provide project-specific schedules during the proposal phase with major milestones clearly indicated."
  },
  {
    patterns: ['renovation checklist', 'prepare for remodel', 'before construction', 'get ready for renovation', 'pre construction'],
    response: "Preparing for your renovation ensures a smoother process. Our pre-construction checklist includes finalizing all material selections by specified deadlines, clearing work areas of personal items, establishing living arrangements during construction if needed, making provisions for pets, setting up temporary facilities like kitchen stations if applicable, protecting non-work areas, securing valuables, and establishing communication protocols with your project manager for updates throughout the process."
  },
  {
    patterns: ['hidden costs', 'unexpected expenses', 'renovation surprises', 'budget overruns', 'cost surprises'],
    response: "We minimize unexpected costs through thorough pre-construction assessment and transparent estimating. However, certain factors can't be fully known until work begins, particularly in older homes. Common concealed conditions include hidden water damage, outdated wiring behind walls, plumbing that doesn't meet code, insufficient structural support, asbestos or lead in older materials, and foundation issues. Our contracts include appropriate contingency allowances to address these possibilities without derailing your project."
  },
  {
    patterns: ['renovation with pets', 'dogs during construction', 'cats and renovation', 'pet safety construction', 'animals during remodel'],
    response: "Renovating with pets requires special considerations for their safety and comfort. Our approach includes establishing secure barriers between construction zones and pet areas, coordinating schedules for particularly disruptive work, advising on temporary relocation during certain phases if appropriate, ensuring contractors are briefed on pet safety protocols, addressing potential toxin concerns from materials and dust, and maintaining regular cleaning to minimize impact on your pets throughout the construction process."
  },
  {
    patterns: ['renovation stress', 'reduce remodeling stress', 'survive renovation', 'dealing with construction', 'remodel anxiety'],
    response: "Renovation can be stressful, but our process minimizes disruption through thorough planning, clear communication, and proactive problem-solving. Recommendations for clients include establishing a dedicated decision-making process, setting up a temporary sanctuary space away from construction, planning for take-out meals during kitchen projects, scheduling regular breaks from the construction environment, maintaining a renovation journal for questions and observations, and focusing on the exciting end result during challenging phases."
  },
  
  // NEW DIFFERENTIATED RESIDENTIAL RESPONSES
  
  // Kitchen Renovation Cost Variations
  {
    patterns: ['kitchen renovation cost', 'price for kitchen remodel', 'kitchen reno budget', 'how much for kitchen renovation'],
    response: "Kitchen renovation costs in the Atlanta area typically range from $40,000-$75,000 for a full remodel, with several factors affecting this range. Major cost components include cabinetry (30-40% of budget), countertops (10-15%), appliances (10-20%), labor (20-35%), and fixtures/finishes. Luxury projects with high-end materials and custom features can exceed $100,000. We provide detailed cost breakdowns during our estimation process to help you understand where your budget is allocated and identify potential savings opportunities."
  },
  {
    patterns: ['mid range kitchen cost', 'average kitchen remodel price', 'standard kitchen renovation cost', 'typical kitchen budget'],
    response: "Our mid-range kitchen renovations typically cost between $50,000-$65,000 in the Atlanta market. This investment covers quality semi-custom cabinetry, quartz or granite countertops, tile backsplash, new flooring, standard-size appliance package (refrigerator, range, dishwasher, microwave), updated lighting, fresh paint, and labor costs. This price point provides excellent value with durable materials and improved functionality while avoiding the premium associated with fully custom or luxury elements."
  },
  {
    patterns: ['luxury kitchen cost', 'high end kitchen price', 'premium kitchen renovation', 'upscale kitchen remodel'],
    response: "Luxury kitchen renovations typically range from $85,000-$150,000+ depending on size and specifications. This investment includes custom cabinetry with specialized storage features, premium countertop materials (quartzite, marble, high-end quartz), designer backsplash materials, professional-grade appliance packages, statement lighting fixtures, architectural details like coffered ceilings or custom hoods, integrated smart home technology, and specialized features like beverage stations or butler's pantries. These kitchens are truly custom creations with superior craftsmanship."
  },
  {
    patterns: ['budget kitchen remodel', 'affordable kitchen renovation', 'kitchen refresh cost', 'inexpensive kitchen update'],
    response: "For budget-conscious renovations, we offer kitchen refreshes starting around $25,000-$35,000. These projects focus on high-impact changes while keeping some existing elements. Approaches include cabinet refacing rather than replacement, keeping the existing layout to avoid plumbing/electrical changes, laminate or value-tier quartz countertops, standard subway tile backsplash, refreshed flooring, new fixtures, and paint. We can help prioritize updates that deliver the greatest visual and functional improvements while respecting budget constraints."
  },
  
  // Bathroom Renovation Cost Variations
  {
    patterns: ['bathroom remodel price', 'cost of bathroom renovation', 'bathroom project budget', 'bathroom redo cost'],
    response: "Bathroom renovation costs in Atlanta typically range from $20,000-$35,000 for a full remodel of a standard-sized bathroom. Major cost factors include tile work (floors and walls), vanity and countertop, shower/tub replacement, fixtures and faucets, lighting, ventilation, and labor. Master bathroom suites with premium features often range from $40,000-$75,000+. During our estimation process, we provide itemized breakdowns so you can make informed decisions about where to allocate your budget."
  },
  {
    patterns: ['small bathroom renovation cost', 'guest bathroom remodel price', 'powder room renovation', 'half bath update cost'],
    response: "Smaller bathroom renovations such as powder rooms or guest bathrooms typically range from $12,000-$20,000. These projects include new flooring, vanity and countertop, toilet, fixtures, lighting, paint, and accessories. Powder room renovations can be excellent opportunities for distinctive design statements with special wallcoverings, unique lighting fixtures, or distinctive vanities, as the smaller square footage allows budget to be allocated toward higher-end finishes while maintaining reasonable overall costs."
  },
  {
    patterns: ['luxury bathroom cost', 'spa bathroom price', 'high end bathroom renovation', 'master bathroom suite cost'],
    response: "Luxury master bathroom renovations typically range from $50,000-$100,000+ depending on size and features. These spa-like retreats include premium elements such as custom shower systems with multiple heads and body sprays, freestanding soaking tubs, heated flooring, custom vanities with specialized storage, premium natural stone, frameless glass enclosures, towel warmers, smart toilet features, high-end lighting packages, integrated audio systems, and sometimes expanded square footage. These spaces prioritize both exceptional aesthetics and personalized comfort features."
  },
  {
    patterns: ['bathroom refresh cost', 'bathroom update pricing', 'minor bathroom renovation', 'quick bathroom remodel'],
    response: "For more modest bathroom updates, we offer refresh packages starting around $10,000-$15,000. These targeted renovations maintain the existing layout and some fixtures while selectively upgrading elements for maximum impact. Common approaches include new vanity and countertop, toilet replacement, new flooring, fresh paint, updated lighting fixtures, and hardware changes. For shower/tub areas, we might reglaze existing tubs or install new surrounds rather than complete replacement for significant cost savings."
  },
  
  // Specialized Flooring Responses
  {
    patterns: ['hardwood flooring', 'wood floors', 'hardwood installation', 'solid wood flooring', 'engineered hardwood'],
    response: "Our hardwood flooring options include both solid and engineered products. Solid hardwood (3/4\" thick, completely natural wood) offers timeless beauty and can be refinished multiple times over decades. Engineered hardwood (layered construction with real wood veneer) provides greater stability in areas with humidity fluctuations. Species options include oak (versatile grain patterns), maple (smooth, consistent appearance), hickory (dramatic variation and hardness), walnut (rich, darker tones), and various exotic options. Installation methods include nail-down, glue-down, or floating systems depending on your subfloor conditions."
  },
  {
    patterns: ['tile flooring', 'ceramic tile', 'porcelain tile floors', 'tile installation', 'floor tile options'],
    response: "Our tile flooring installations utilize both ceramic and porcelain materials. Porcelain offers superior hardness and moisture resistance, making it ideal for bathrooms, kitchens, and high-traffic areas. Options include large-format tiles (creating minimal grout lines), wood-look planks (combining wood aesthetics with tile durability), decorative patterns, and natural stone looks without the maintenance requirements. Installation considerations include proper subfloor preparation, underlayment selection, appropriate setting materials, and grout options from traditional to epoxy-based for superior stain resistance."
  },
  {
    patterns: ['luxury vinyl', 'lvp flooring', 'waterproof flooring', 'vinyl plank', 'lvt flooring'],
    response: "Luxury vinyl plank (LVP) and tile (LVT) have revolutionized residential flooring with remarkable durability and 100% waterproof performance. These products feature realistic wood or stone visuals through HD printing technology, texturing for authentic feel, rigid core construction for stability, and protective wear layers rated for commercial use. Benefits include simple installation (often floating systems requiring minimal subfloor preparation), comfort underfoot, excellent sound absorption properties, and suitability for below-grade installations like basements. Their performance-to-price ratio makes them excellent choices for active households."
  },
  {
    patterns: ['carpet installation', 'new carpeting', 'carpet options', 'bedroom carpet', 'carpet materials'],
    response: "Our carpet installations include various constructions and materials to suit different needs and preferences. Options include plush and textured styles (formal appearance, shows footprints), frieze and twisted varieties (casual look, hides footprints), loop and berber styles (extremely durable), and pattern carpets (decorative interest). Fiber choices include nylon (exceptional durability and stain resistance), polyester (excellent color clarity and softness), wool (natural luxury), and SmartStrand/triexta (superior stain resistance). We include quality padding appropriate for your selected carpet and traffic conditions."
  },
  {
    patterns: ['natural stone flooring', 'marble floors', 'granite flooring', 'travertine floors', 'slate flooring'],
    response: "Natural stone flooring creates unmatched elegance with each installation being truly unique. Options include marble (luxurious with distinctive veining), granite (extremely durable with natural color variations), travertine (warm earth tones with characteristic voids), limestone (subtle, consistent appearance), and slate (dramatic texture and color shifts). Installation considerations include proper substrate reinforcement to support weight, specialized setting materials, appropriate sealing protocols for stain protection, and potential ongoing maintenance requirements including periodic resealing. These materials constitute a lifetime investment in your home."
  },
  
  // Home Addition Specialized Responses
  {
    patterns: ['primary suite addition', 'master bedroom addition', 'adding master suite', 'bedroom addition', 'ensuite addition'],
    response: "Primary suite additions create private retreats with personalized amenities. These typically range from 400-600 square feet including bedroom space, walk-in closet(s), and a spa-inspired bathroom. Design considerations include creating proper separation from other household areas, optimizing natural light with strategic window placement, ensuring proper HVAC distribution, soundproofing techniques for privacy, and often architectural elements that make the space feel distinct and special. These additions typically range from $150,000-$250,000 depending on size, features, and finishes."
  },
  {
    patterns: ['great room addition', 'family room addition', 'living room expansion', 'main living space addition', 'common area expansion'],
    response: "Great room and family room additions create gathering spaces that enhance daily living and entertaining capabilities. These projects typically involve opening the rear of the home with expansive openings to new space ranging from 300-600+ square feet. Key design elements include vaulted or coffered ceilings for visual impact, abundant natural light through window walls or clerestory windows, seamless flooring transitions from existing spaces, well-planned traffic patterns, and often direct connections to outdoor living areas through multi-panel doors. Budgets typically range from $125,000-$200,000 depending on complexity."
  },
  {
    patterns: ['bump out addition', 'small addition', 'room extension', 'expanding existing room', 'partial addition'],
    response: "Bump-out additions extend existing rooms by a modest amount (typically 2-8 feet) to improve functionality without the scale of full additions. Common applications include expanding kitchens to accommodate islands or breakfast areas, enlarging bathrooms for more comfortable fixtures, creating dining alcoves, or adding built-in features like window seats or home office nooks. These projects are often more cost-effective than full additions while still significantly enhancing livability. Construction typically ranges from $15,000-$40,000 depending on width and complexity."
  },
  {
    patterns: ['home addition foundation', 'foundation for addition', 'addition footing', 'new foundation', 'addition base'],
    response: "Foundation systems for additions must integrate properly with existing structures while meeting current codes. Options include traditional poured concrete foundations with footings below frost line, concrete slab-on-grade where appropriate for site conditions, crawl space foundations matching existing home construction, or specialized systems for challenging sites. Our process includes soil assessment, proper drainage planning, waterproofing measures, insulation considerations, and sometimes underpinning or reinforcement of existing foundation elements where additions connect to the original structure."
  },
  
  // Kitchen Design Styles
  {
    patterns: ['farmhouse kitchen', 'country kitchen style', 'rustic kitchen design', 'farm style kitchen', 'cottage kitchen'],
    response: "Farmhouse kitchen designs create warm, inviting spaces with distinctive elements including apron-front (farmhouse) sinks, shaker or beadboard cabinet styles, open shelving mixed with cabinetry, butcher block or wood countertop accents, vintage-inspired fixtures and hardware, painted cabinetry (often white or soft colors), plank or patterned wood flooring, and architectural details like exposed beams or shiplap. These kitchens balance nostalgic charm with modern functionality, often incorporating professional-grade appliances behind cabinetry panels to maintain the aesthetic while delivering contemporary performance."
  },
  {
    patterns: ['contemporary kitchen', 'modern kitchen design', 'sleek kitchen', 'minimalist kitchen', 'current kitchen style'],
    response: "Contemporary kitchen designs embrace clean lines and uncluttered aesthetics. Signature elements include flat-panel or slab door cabinetry, minimal hardware or touch-latch systems, quartz countertops with waterfall edges, full-height backsplashes in large-format tile or back-painted glass, integrated appliances for seamless appearance, linear lighting systems, floating shelves for display, monochromatic or two-tone color schemes, and often statement architectural features like dramatic range hoods or ceiling treatments. These spaces prioritize both visual sophistication and highly efficient workspace planning."
  },
  {
    patterns: ['transitional kitchen', 'updated traditional kitchen', 'classic modern kitchen', 'timeless kitchen design', 'hybrid kitchen style'],
    response: "Transitional kitchens bridge traditional and contemporary elements for broad appeal. Characteristics include shaker-style cabinetry with clean lines, quartz countertops with simple edge profiles, subway tile with a modern spin (larger format or distinctive finish), a mix of metals in fixtures and hardware, neutral color palettes with strategic accent colors, islands with furniture-like details, professional-grade appliances in stainless steel, and a balance of open and closed storage. This approach creates spaces that feel current yet timeless, avoiding overly trendy elements that might quickly feel dated."
  },
  {
    patterns: ['industrial kitchen', 'urban style kitchen', 'loft kitchen', 'commercial style kitchen', 'industrial chic kitchen'],
    response: "Industrial kitchen designs celebrate raw materials and architectural elements. Distinctive features include exposed brick or concrete surfaces, open shelving in metal framing, factory-inspired lighting fixtures, commercial or professional-grade stainless appliances, metal accents in hood vents and fixtures, wood elements for warmth (often reclaimed), concrete or butcher block countertops, minimal upper cabinetry, and sometimes exposed mechanical elements like ductwork or plumbing. This aesthetic balances utilitarian inspiration with carefully considered design elements for spaces that feel authentic rather than contrived."
  },
  
  // Bathroom Design Styles
  {
    patterns: ['spa bathroom', 'luxury bath retreat', 'resort style bathroom', 'relaxation bathroom', 'wellness bathroom'],
    response: "Spa-inspired bathrooms create personal wellness retreats through thoughtful elements including walk-in showers with multiple water experiences (rainfall, body sprays, handheld), freestanding soaking tubs as sculptural elements, heated flooring systems, towel warmers, natural materials like stone and wood, neutral color palettes inspired by nature, abundant natural light balanced with privacy considerations, dimmable lighting systems for atmosphere control, aromatherapy integration, sound systems for music therapy, and sometimes steam shower capabilities or infrared sauna features for comprehensive wellness benefits."
  },
  {
    patterns: ['modern bathroom', 'contemporary bathroom design', 'minimalist bathroom', 'sleek bathroom', 'clean line bathroom'],
    response: "Modern bathroom designs emphasize clean geometries and visual simplicity. Key elements include wall-mounted vanities creating a sense of space, integrated lighting systems, frameless glass shower enclosures, large-format tile with minimal grout lines, linear drains for clean shower floor appearance, wall-mounted faucets, minimalist hardware, floating shelves or niches for storage rather than bulky cabinetry, monochromatic color schemes often in white, gray, and black, and sometimes statement features like freestanding tubs or dramatic accent walls. These spaces prioritize both aesthetic sophistication and easy maintenance."
  },
  {
    patterns: ['traditional bathroom', 'classic bathroom design', 'timeless bathroom', 'elegant bathroom', 'conventional bathroom'],
    response: "Traditional bathroom designs incorporate classic elements with enduring appeal. Features include furniture-style vanities with detailed door profiles, natural stone countertops with ogee or bullnose edges, framed mirrors or medicine cabinets, molding details, classic tile patterns like hexagon or basketweave floor mosaics, subway tile with decorative borders, fixtures in timeless finishes like polished nickel or chrome, freestanding tubs with traditional styling, shower systems with thermostatic controls, and color palettes in soft neutrals, whites, and occasionally subtle blues or greens for a fresh yet timeless aesthetic."
  },
  {
    patterns: ['small bathroom design', 'compact bathroom ideas', 'tiny bathroom', 'space-saving bathroom', 'efficient bathroom'],
    response: "Small bathroom designs maximize functionality through strategic space planning. Effective approaches include wall-mounted toilets to free up floor space visually, corner showers or shower-tub combinations with sliding glass rather than swing doors, vanities with engineered storage configurations, medicine cabinets for storage without room footprint, vertical storage solutions utilizing wall height, pocket doors or barn doors that eliminate swing space requirements, appropriate scale fixtures designed for smaller spaces, light colors and large mirrors to enhance perceived space, and sometimes wet room concepts that eliminate separate shower enclosures."
  },
  
  // General Renovation Approaches
  {
    patterns: ['full gut renovation', 'complete home remodel', 'down to studs renovation', 'whole house gut', 'comprehensive remodel'],
    response: "Full gut renovations involve taking spaces down to structural elements (studs, subfloor, ceiling joists) for comprehensive rebuilding. This approach is ideal for older homes with multiple outdated systems, poor previous renovations, structural issues, or desired major layout changes. Benefits include addressing all mechanical systems (electrical, plumbing, HVAC), improving insulation and energy efficiency, remediating any hidden issues (water damage, pest damage, mold), and creating entirely customized spaces without compromise. These projects typically take 4-8 months for full homes and represent significant investments, but deliver essentially new homes within existing structures."
  },
  {
    patterns: ['partial renovation', 'minor remodel', 'refresh renovation', 'cosmetic update', 'surface renovation'],
    response: "Partial renovations focus on specific aspects while retaining many existing elements. This approach might include replacing fixtures, updating finishes (paint, flooring, backsplash), refacing or painting cabinetry rather than replacing, upgrading appliances, improving lighting, and adding new hardware and accessories. While maintaining existing layouts and major systems, these projects deliver significant visual and functional improvements with more modest investment and shorter timeframes (typically 2-6 weeks). This approach is ideal for spaces with good fundamental layouts and systems but dated aesthetics or minor functional issues."
  },
  {
    patterns: ['design build process', 'one stop renovation', 'integrated renovation approach', 'single team renovation', 'unified remodeling'],
    response: "Our design-build approach integrates design and construction under one team for seamless project delivery. The process begins with design development addressing both aesthetics and technical requirements, proceeds through detailed specification and pricing with full transparency, and moves into construction with the same team maintaining project vision and accountability throughout. Benefits include single-source responsibility, more accurate initial pricing, faster project delivery, integrated problem-solving between designers and builders, and simplified communication with one project manager coordinating all aspects. This approach prevents the common disconnects that occur in traditional design-bid-build scenarios."
  },
  {
    patterns: ['green renovation', 'eco friendly remodel', 'sustainable home update', 'environmentally conscious renovation', 'energy efficient remodel'],
    response: "Environmentally conscious renovations incorporate sustainable practices throughout the process. Elements include energy-efficient systems (high-performance HVAC, enhanced insulation, LED lighting, Energy Star appliances), water conservation measures (low-flow fixtures, efficient irrigation, possibly rainwater harvesting), healthy material selections (low/zero-VOC finishes, formaldehyde-free products, natural materials), construction waste recycling, locally sourced materials where possible, and sometimes renewable energy integration. Beyond environmental benefits, these approaches typically deliver lower operating costs, improved comfort, better indoor air quality, and potential tax incentives or rebates."
  },
  
  // ATLANTA NEIGHBORHOOD-SPECIFIC RESPONSES
  
  // Buckhead
  {
    patterns: ['buckhead renovation', 'buckhead remodel', 'renovating in buckhead', 'buckhead construction', 'buckhead home project'],
    response: "Renovating in Buckhead often involves working with larger, more established homes and navigating specific architectural review processes in certain communities. Many Buckhead renovations focus on luxury updates to kitchen and bath spaces, creating modern open floor plans within traditional exteriors, and adding custom amenities like wine cellars or home theaters. Our Buckhead projects typically emphasize premium materials and finishes to maintain property values in this prestigious area, and we're well-versed in the neighborhood's permit requirements and inspection protocols."
  },
  {
    patterns: ['historic buckhead', 'tuxedo park renovation', 'older buckhead home', 'buckhead historic district', 'buckhead traditional home'],
    response: "Historic Buckhead properties, particularly in areas like Tuxedo Park, require specialized knowledge of period-appropriate renovations. These stately homes often feature significant architectural details worth preserving while sensitively integrating modern conveniences. Our approach includes careful documentation of existing historic elements, sourcing of matching materials for repairs, coordination with historical preservation requirements when applicable, and techniques that honor original craftsmanship while upgrading systems behind the scenes for contemporary performance and efficiency."
  },
  
  // Midtown
  {
    patterns: ['midtown atlanta renovation', 'midtown condo remodel', 'midtown loft', 'renovating in midtown', 'midtown atlanta project'],
    response: "Midtown Atlanta renovations often involve urban properties like condominiums, lofts, and townhomes with unique considerations. We navigate building management requirements, limited construction hours, freight elevator scheduling, and neighbor concerns specific to multi-unit buildings. Many Midtown projects emphasize maximizing views through strategic space planning, creating entertainer-friendly open layouts, integrating smart home technology, and incorporating sound mitigation in these urban settings. Our team is well-versed in the permit requirements of the City of Atlanta and Midtown-specific building regulations."
  },
  {
    patterns: ['midtown high rise', 'condo renovation atlanta', 'apartment remodel midtown', 'midtown condo', 'atlanta high rise renovation'],
    response: "High-rise renovations in Midtown Atlanta require specialized expertise in condominium association regulations, building access protocols, protected hours policies, and construction material delivery logistics. Our high-rise renovation process includes detailed pre-construction documentation of common areas, elevator protection, careful debris management through designated routes, and coordinated shutdowns for plumbing or electrical connections when needed. We maintain excellent relationships with building management companies throughout Midtown's premier residential towers to ensure smooth project execution."
  },
  
  // Inman Park/Old Fourth Ward
  {
    patterns: ['inman park renovation', 'old fourth ward remodel', 'o4w home renovation', 'renovating in inman park', 'historic inman park'],
    response: "Inman Park and Old Fourth Ward renovations blend historic character with contemporary functionality. Many homes in these neighborhoods feature Victorian or Craftsman architecture requiring thoughtful preservation of original elements like trim work, fireplaces, and facade details. Our approach in these historic intown neighborhoods includes careful structural assessment of older foundations and framing, appropriate insulation strategies for historic homes, sensitive additions that complement original architecture, and navigation of historic district regulations when applicable. We've completed numerous successful projects along the BeltLine corridor in these vibrant communities."
  },
  {
    patterns: ['beltline renovation', 'beltline adjacent property', 'eastside trail home', 'renovating near beltline', 'beltline neighborhood'],
    response: "Properties near the Atlanta BeltLine, particularly along the Eastside Trail through Inman Park and O4W, present unique renovation opportunities. These projects often focus on maximizing BeltLine views, creating indoor-outdoor transitions through multi-panel door systems, developing roof decks or elevated outdoor spaces oriented toward the trail, and incorporating sound mitigation strategies for this increasingly active area. Property values in BeltLine-adjacent areas continue to appreciate significantly, making thoughtful renovations particularly valuable investments in these neighborhoods."
  },
  
  // Virginia Highland/Morningside
  {
    patterns: ['virginia highland renovation', 'morningside remodel', 'va-hi home project', 'renovating virginia highland', 'morningside bungalow'],
    response: "Virginia-Highland and Morningside renovations typically involve charming 1920s-1940s properties with distinctive character. These neighborhoods feature many original bungalows, Craftsman homes, and Tudor cottages that benefit from thoughtful updates respecting architectural heritage. Common projects include creating more functional kitchen spaces while maintaining period details, finishing previously unfinished basements for additional living space, appropriate dormer additions for second-floor expansions, and modernizing mechanical systems without disturbing historic elements. We're familiar with the community aesthetic expectations in these established intown neighborhoods."
  },
  {
    patterns: ['historic va-hi', 'original bungalow renovation', 'historic morningside', 'renovating old home virginia highland', 'vintage atlanta home'],
    response: "Historic Virginia-Highland and Morningside homes often feature irreplaceable details like original heart pine floors, handcrafted trim work, plaster walls, and distinctive fireplace surrounds. Our renovation approach preserves these elements through careful protection during construction, restoration of damaged components when possible, and matching of materials when replacements are needed. We balance preservation with practical updates like expanded closet space, modernized kitchens and baths, energy efficiency improvements, and sometimes sensitive additions that respect the original home's scale and proportion."
  },
  
  // Decatur
  {
    patterns: ['decatur renovation', 'decatur home remodel', 'renovating in decatur', 'decatur bungalow', 'decatur craftsman'],
    response: "Decatur renovations require navigating the city's specific permit processes and inspection requirements, which differ from Atlanta proper. Many Decatur properties are early to mid-century homes with solid construction worth preserving while updating for modern living. Common projects include kitchen expansions, master suite additions, finished basement media rooms, and enhanced outdoor living spaces. The city's walkable orientation often influences renovation decisions, with many clients prioritizing front porch enhancements and street-facing details that contribute to Decatur's community-oriented atmosphere."
  },
  {
    patterns: ['downtown decatur renovation', 'decatur historic district', 'oakhurst renovation', 'winnona park remodel', 'decatur historic home'],
    response: "Historic Decatur neighborhoods like Winnona Park, Oakhurst, and Downtown Decatur's historic district have specific architectural considerations and sometimes formal review requirements. These areas feature many 1900-1940s homes with distinct character that benefit from historically sensitive approaches. Our Decatur renovations often include restoration of original windows rather than replacement, appropriate additions that complement historic architecture, period-appropriate exterior color consultations, and careful integration of modern systems that don't compromise historic integrity. We maintain excellent relationships with Decatur's planning and building departments."
  },
  
  // Sandy Springs/North Atlanta
  {
    patterns: ['sandy springs renovation', 'north atlanta remodel', 'renovating in sandy springs', 'north atlanta suburbs', 'perimeter area renovation'],
    response: "Sandy Springs renovations involve navigating the city's specific permitting process, which was established when it incorporated as a separate municipality from Atlanta. Many Sandy Springs projects involve updating 1960s-1980s homes with more contemporary layouts, enhanced outdoor living areas taking advantage of the typically larger lot sizes, and sometimes substantial expansions or even tear-down/rebuilds on valuable lots. The area's hillier topography often requires specialized foundation and drainage approaches, particularly for additions or outdoor living enhancements."
  },
  
  // PATTERN-SPECIFIC LANGUAGE RESPONSES (ECHOING TERMINOLOGY)
  
  // Kitchen terminology echoing
  {
    patterns: ['upgrade my kitchen', 'kitchen upgrade', 'improving my kitchen', 'kitchen improvements', 'better kitchen'],
    response: "Kitchen upgrades can dramatically improve both functionality and aesthetic appeal. Popular upgrade options include replacing outdated appliances with energy-efficient models, refreshing cabinet faces with new doors and hardware, installing quartz or granite countertops over existing bases, adding a new backsplash for visual impact, improving lighting with under-cabinet and recessed fixtures, and painting for a fresh look. Unlike full renovations, these targeted improvements maintain your existing layout while significantly enhancing your kitchen's performance and appearance."
  },
  {
    patterns: ['redo my kitchen', 'kitchen redo', 'redoing kitchen', 'kitchen makeover', 'kitchen facelift'],
    response: "A kitchen redo offers a fresh start without the investment of a complete renovation. Your kitchen redo might include cabinet refacing or repainting, new countertop surfaces, updated backsplash, fixture replacements, and perhaps new flooring. This approach maintains your current layout while transforming visual elements for a dramatically different look and improved functionality. Kitchen redos typically take 2-3 weeks compared to 6-8 weeks for full renovations, creating less disruption to your household while still delivering substantial impact."
  },
  {
    patterns: ['modernize kitchen', 'update old kitchen', 'contemporary kitchen update', 'outdated kitchen', 'kitchen modernization'],
    response: "Kitchen modernization addresses both aesthetic and functional aspects of outdated spaces. Modernizing typically involves replacing dated cabinet styles with clean-lined designs, installing solid-surface countertops with simple edge profiles, updating to stainless steel or panel-ready appliances, implementing efficient storage solutions like pull-out organizers, improving lighting with layered fixtures, and incorporating contemporary materials like large-format tile or glass backsplashes. These modernization choices create a fresh, current feel while improving workflow and functionality."
  },
  
  // Bathroom terminology echoing
  {
    patterns: ['bathroom makeover', 'refresh my bathroom', 'update bathroom', 'bathroom facelift', 'bath makeover'],
    response: "Bathroom makeovers provide significant impact without the scope of full renovations. A typical makeover includes fixture replacements (toilet, sink, faucets), vanity updates, new lighting, mirror replacement, fresh paint, and hardware upgrades. For shower/tub areas, options include reglazing existing tubs, adding new surrounds, or replacing shower doors with modern frameless glass. These strategic updates transform the bathroom's appearance and functionality while working within the existing layout and plumbing configuration, typically completing within 1-2 weeks."
  },
  {
    patterns: ['bathroom upgrade', 'modernize bathroom', 'upgrading bathroom', 'elevate bathroom', 'bathroom modernization'],
    response: "Bathroom upgrades enhance both function and style with targeted improvements. Effective upgrades include high-efficiency toilets with comfort height and soft-close features, upgraded shower systems with thermostatic controls, vanities with improved storage configurations, enhanced ventilation fans with humidity sensing, multi-function medicine cabinets with integrated lighting, and designer accessories. These modernization choices can transform your daily routine while maintaining your existing layout, offering excellent value with relatively modest investment compared to full renovations."
  },
  {
    patterns: ['gut bathroom', 'total bathroom redo', 'complete bathroom renovation', 'overhaul bathroom', 'bathroom gut job'],
    response: "A complete bathroom gut renovation provides the opportunity to rethink everything from layout to fixtures. This comprehensive approach involves demolition to the studs, allowing for reconfiguration of the floor plan, updates to plumbing lines for optimal fixture placement, electrical improvements for better lighting and additional outlets, modern waterproofing systems, fresh insulation for improved energy efficiency, and completely new finishes throughout. While more intensive than cosmetic updates, this approach addresses any hidden issues while creating exactly the bathroom you want without compromise."
  },
  
  // Flooring terminology echoing
  {
    patterns: ['replace carpet', 'new carpet', 'carpet replacement', 'updating carpet', 'change carpet'],
    response: "Carpet replacement refreshes your space with improved comfort, appearance, and indoor air quality. The replacement process includes removal and disposal of existing carpet and pad, floor preparation to ensure a proper substrate, installation of new padding appropriate for your traffic patterns, and expert installation of your selected carpet using proper stretching techniques for long-term performance. Today's carpets offer improved stain resistance, color retention, and durability compared to products from even a few years ago, making replacement a worthwhile investment in both comfort and appearance."
  },
  {
    patterns: ['install hardwood', 'hardwood installation', 'putting in hardwood', 'hardwood floors install', 'adding hardwood'],
    response: "Hardwood installation transforms your space with timeless, high-value flooring. The installation process involves acclimating materials to your home's environment, preparing the subfloor for optimal results, installing the hardwood using appropriate methods for your specific product (nail-down, glue-down, or floating system), detail work around transitions and obstacles, and applying the final finish for unfinished products. Our installation experts ensure proper expansion gaps, pattern alignment, and secure fastening for a beautiful, long-lasting hardwood floor that will serve your home for decades."
  },
  {
    patterns: ['replace flooring', 'new floors', 'flooring replacement', 'update floors', 'change flooring'],
    response: "Flooring replacement provides one of the highest impact changes for your investment. The replacement process includes removal and disposal of existing materials, subfloor assessment and preparation, addressing any leveling issues, installation of underlayment when needed, and expert installation of your new flooring materials. We manage all transition areas between different flooring types and heights for seamless results. New flooring dramatically transforms your space's appearance while potentially improving durability, maintenance requirements, and even acoustic properties depending on your selected materials."
  },
  
  // Addition terminology echoing
  {
    patterns: ['build addition', 'home expansion', 'adding onto house', 'building addition', 'expand my home'],
    response: "Home expansions create valuable new living space through thoughtfully designed additions. The expansion process includes architectural design that complements your existing structure, foundation work engineered for your specific soil conditions, framing that integrates seamlessly with your current home, roofline transitions that appear intentional rather than added-on, and complete finishing of interior spaces to match or complement your existing home's aesthetic. Thoughtful expansion design considers flow between new and existing spaces, exterior appearance from all angles, and proper sizing to maintain proportion."
  },
  {
    patterns: ['extend kitchen', 'kitchen extension', 'enlarge kitchen', 'kitchen expansion', 'push out kitchen'],
    response: "Kitchen extensions create additional square footage for enhanced functionality and improved layouts. The extension process typically involves removing an exterior wall, creating a new foundation for the expanded footprint, framing and enclosing the new space, blending rooflines appropriately, and finishing the enlarged kitchen with expanded cabinetry, additional counter space, and sometimes new features like islands or breakfast areas that weren't possible in the original footprint. These extensions often transform cramped, outdated kitchens into spacious, functional gathering spaces for modern family life."
  },
  {
    patterns: ['add screened porch', 'build sunroom', 'add porch', 'building sunroom', 'new screened porch'],
    response: "Adding a screened porch or sunroom extends your living space with indoor-outdoor versatility. The addition process includes foundation preparation suitable for your site, framing with appropriate materials for your climate, installation of screening systems or window packages depending on your preference for seasonality, roofing that integrates with your existing structure, electrical services for lighting and convenience outlets, and finishing details like ceiling fans, flooring suitable for semi-outdoor conditions, and sometimes heating or cooling elements for extended seasonal use."
  },
  
  // Renovation approach terminology echoing
  {
    patterns: ['phase renovation', 'remodel in stages', 'phased approach', 'step by step renovation', 'gradual remodel'],
    response: "Phasing your renovation provides budget flexibility and minimizes disruption to your daily life. A phased approach begins with comprehensive planning that establishes the complete vision, then divides implementation into logical, sequential stages with clear start and end points. Each phase must function well independently until the next begins. Common phasing strategies include completing public spaces before private ones, addressing essential infrastructure before cosmetic updates, or renovating one floor at a time. We create detailed phasing plans that manage dependencies between systems while allowing breathing room between investments."
  },
  {
    patterns: ['full home remodel', 'whole house renovation', 'entire house update', 'complete home renovation', 'renovate whole house'],
    response: "Whole house renovations transform your entire living experience through comprehensive updates throughout your home. This approach typically includes kitchen and bathroom renovations, replacement of flooring and refinishing of stairs/railings, updating all interior doors and trim, refreshing or replacing windows, modernizing lighting throughout, painting all surfaces, and often addressing mechanical systems like HVAC, plumbing, and electrical. While involving significant investment, whole house renovations provide economies of scale, design coherence throughout, and the opportunity to address all your home's needed improvements in a single coordinated project."
  },
  {
    patterns: ['weekend project', 'diy friendly', 'simple update', 'easy renovation', 'quick home improvement'],
    response: "For homeowners interested in simple updates with high impact, we recommend weekend-friendly projects like interior painting, replacing dated light fixtures, installing new bathroom fixtures, updating cabinet hardware, or refreshing trim and molding. While our company specializes in larger renovations, we're happy to provide professional advice on which elements are genuinely suitable for DIY approaches versus those requiring professional expertise. We can also recommend quality materials and proper techniques for homeowners tackling smaller projects themselves before embarking on larger professional renovations."
  },
  
  // BEGINNER VS. ADVANCED TECHNICAL RESPONSES
  
  // Beginner questions about construction
  {
    patterns: ['what is a load bearing wall', 'which walls are structural', 'can i remove a wall', 'load bearing vs non load bearing', 'structural wall'],
    response: "Load-bearing walls support the weight of elements above them, while non-load-bearing walls (also called partition walls) simply divide spaces. Typically, walls running perpendicular to floor and ceiling joists are load-bearing, as are exterior walls and walls stacked vertically through multiple floors. Signs a wall might be load-bearing include being thicker, having beams or posts, or sitting above foundation walls. Never remove any wall without professional assessment, as even non-load-bearing walls might contain plumbing, electrical, or HVAC components. Our team can evaluate which walls can be safely modified during your renovation."
  },
  {
    patterns: ['what is backsplash', 'need backsplash?', 'backsplash purpose', 'why install backsplash', 'what does backsplash do'],
    response: "A backsplash is the protective wall covering installed between countertops and upper cabinets, primarily in kitchens and bathrooms. Its practical purpose is protecting walls from water, grease, and food splatter, making cleaning easier. Beyond function, backsplashes provide significant design impact, often serving as the kitchen's focal point. Materials range from ceramic tile and glass to natural stone, metal, or even quartz matching your countertops. While not absolutely required, backsplashes are highly recommended for both wall protection and aesthetic enhancement, typically extending 18-20 inches above countertops except behind ranges where they often reach the hood."
  },
  {
    patterns: ['what is soft close', 'soft closing cabinets', 'soft close drawers', 'quiet close', 'what does soft close mean'],
    response: "Soft-close refers to a mechanism in cabinets and drawers that prevents slamming by catching the door or drawer and gently pulling it closed during the final inches of travel. This feature reduces noise, prevents finger pinching, and minimizes wear and tear on your cabinetry. Most modern quality cabinetry includes soft-close hinges and drawer glides as standard features. For existing cabinetry, retrofit kits can add this functionality to doors, while drawers typically require full glide replacement. The feature requires no special maintenance and significantly enhances the feel of quality in daily kitchen use."
  },
  {
    patterns: ['what is a punch list', 'finishing a renovation', 'final renovation steps', 'renovation completion', 'project wrap up'],
    response: "A punch list is a document created near project completion that identifies remaining items needing attention before final sign-off. This typically includes minor repairs, touch-up painting, hardware adjustments, cleaning, and similar finishing details. During a formal punch list walkthrough, you'll inspect the work with your project manager, noting any concerns. The contractor then completes these items before requesting final payment. This standard construction practice ensures nothing is overlooked during project completion. We encourage clients to be thorough during this process to address all concerns while the construction team is still actively engaged."
  },
  
  // Advanced technical questions
  {
    patterns: ['structural load calculation', 'beam sizing', 'load capacity analysis', 'structural engineering', 'support beam requirements'],
    response: "Structural load calculations involve comprehensive analysis of both dead loads (permanent weight of materials) and live loads (occupants, furniture, snow, etc.) to determine proper structural support requirements. For typical residential renovations involving wall removal, our process includes having a structural engineer perform calculations based on span length, supported floor/roof areas, material properties, and building code requirements. These calculations determine appropriate beam specifications including material (LVL, steel, or dimensional lumber), depth, width, and support requirements. We manage the engineering process, permit documentation, and proper implementation including temporary support during construction and proper beam bearing at termination points."
  },
  {
    patterns: ['hvac load calculation', 'manual j calculation', 'hvac sizing', 'right size air conditioner', 'proper hvac tonnage'],
    response: "HVAC load calculations using Manual J methodology assess your home's specific cooling and heating requirements based on multiple variables including square footage, ceiling height, insulation values, window specifications, air infiltration rates, local climate data, and internal heat gains. Unlike simplified tonnage rules of thumb, proper Manual J calculations prevent both undersizing (causing inadequate temperature control) and oversizing (leading to short-cycling, poor humidity control, and reduced equipment life). Our HVAC partners perform room-by-room load calculations using ACCA-approved software to specify equipment with appropriate capacity and properly sized ductwork for balanced airflow throughout your renovated space."
  },
  {
    patterns: ['r value calculation', 'insulation requirements', 'thermal boundary', 'continuous insulation', 'thermal bridging'],
    response: "Effective insulation strategies address not just nominal R-value but also installation quality, thermal bridging, and appropriate placement of the thermal boundary. Our approach includes evaluating wall assemblies with attention to insulation compression, voids, and thermal bridging through framing members (which typically conduct heat at R-1 per inch versus R-3.5-4 for insulation). We implement advanced framing techniques where appropriate, specify continuous insulation layers in key areas, and ensure proper air sealing as a critical companion to insulation. For existing homes, we consider both classical insulation placement and alternative strategies for challenging areas like floors over unconditioned spaces and cathedral ceilings with limited depth."
  },
  {
    patterns: ['moisture barrier installation', 'vapor barrier location', 'vapor retarder', 'vapor diffusion', 'moisture management'],
    response: "Proper moisture management requires careful consideration of vapor drive direction, which changes seasonally in Atlanta's mixed-humid climate zone. Our approach addresses both bulk water management through appropriate flashing details and vapor diffusion through strategic placement of vapor retarders. In our climate, vapor retarders should generally be placed on the exterior in cooling-dominated seasons and interior during heating seasons, creating a design challenge. We typically implement vapor-permeable weather-resistant barriers on the exterior, appropriate sheathing materials, and sometimes smart vapor retarders on interior surfaces that adjust permeance based on ambient humidity to accommodate seasonal changes in vapor drive direction."
  },
  {
    patterns: ['electrical service capacity', 'panel upgrade', 'load calculation electrical', 'electrical load requirements', 'electrical service sizing'],
    response: "Electrical service capacity assessment involves detailed load calculations according to National Electrical Code Article 220, evaluating both standard and demand loads. For renovations adding significant electrical demand through new appliances, HVAC equipment, or additional circuits, we calculate existing capacity utilization, then determine required service upgrades if needed. Considerations include service entrance cable sizing, main panel bus rating, available breaker spaces, grounding system adequacy, and sometimes utility supply constraints. Where upgrades are required, options include full service replacement (typically 200A in modern homes), panel replacement while maintaining existing service, subpanel addition, or load management systems that monitor and control high-demand circuits to function within existing service limitations."
  },
  
  // Beginner planning questions
  {
    patterns: ['how to plan renovation', 'first steps remodeling', 'renovation planning', 'where to start remodel', 'beginning a renovation'],
    response: "Planning your renovation starts with establishing clear goals and priorities for the project. Begin by creating an ideabook of inspiration images, listing functional needs versus wants, and establishing a realistic budget range including a 15-20% contingency for unexpected issues. Next steps include researching potential contractors, understanding the rough timeline for your project scope, and considering living arrangements during construction. For projects over $25,000, we recommend engaging professionals early rather than developing detailed plans independently, as experienced designers can help navigate feasibility, budget considerations, and permit requirements from the start, potentially saving significant time and preventing costly plan revisions."
  },
  {
    patterns: ['renovation budget tips', 'save money remodeling', 'budget friendly renovation', 'affordable remodel ideas', 'cost saving renovation'],
    response: "To maximize your renovation budget, consider these practical strategies: 1) Focus investment on permanently installed elements while saving on easily replaced items, 2) Maintain existing layouts where possible to avoid costly plumbing and electrical relocation, 3) Consider cabinet refacing instead of replacement when boxes are in good condition, 4) Explore remnant options for stone countertops on smaller projects, 5) Phase work logically to spread costs over time, 6) Schedule during winter months when contractor availability is often better, 7) Select mid-grade appliances with essential features rather than premium models, and 8) Handle simple demolition or painting yourself if you're comfortable doing so."
  },
  {
    patterns: ['how long renovation takes', 'remodel timeline', 'project length', 'renovation duration', 'how many weeks for remodel'],
    response: "Renovation timelines vary significantly based on project scope. As a general guideline: Bathroom renovations typically require 3-5 weeks from demolition to completion, kitchen renovations usually take 6-8 weeks, full home interior renovations might require 2-4 months depending on scope, and additions typically need 3-6 months from breaking ground to completion. The planning phase before construction (design, selections, permitting) often takes 1-3 months for proper preparation. These timeframes assume normal conditions - material backorders, change orders, or discovery issues can extend timelines. We provide project-specific schedules during the proposal phase with major milestones clearly indicated."
  },
  
  // Advanced planning questions
  {
    patterns: ['value engineering options', 'cost reduction strategies', 'value engineered approach', 'reduce construction costs', 'budget optimization construction'],
    response: "Effective value engineering identifies cost reductions while maintaining core functionality and aesthetic goals through systematic analysis across all project components. Our structured approach begins with a detailed cost breakdown to identify highest-contribution elements, then evaluates options including: 1) Material substitutions maintaining visual impact but reducing cost (e.g., engineered stone for natural stone, luxury vinyl for hardwood in secondary spaces), 2) Simplified architectural details in less prominent areas, 3) Standardized sizing to reduce custom requirements, 4) Alternative construction methods achieving similar outcomes, 5) Installation sequence optimization, and 6) Strategic reuse of existing elements when appropriate condition and quality exists. This process requires integrated design and construction expertise to evaluate implications across systems."
  },
  {
    patterns: ['historic preservation requirements', 'certificate of appropriateness', 'historic district renovation', 'historic designation', 'heritage conservation'],
    response: "Historic designation impacts renovations through both incentives and restrictions varying by specific designation type and jurisdiction. Properties may fall under National Register designation, local historic district regulations, or conservation overlay zones, each with different requirements. Local historic districts typically involve the most stringent review through Historic Preservation Commission approval processes requiring Certificates of Appropriateness for exterior modifications. Our approach includes preliminary research of your property's specific designation, pre-application meetings with preservation planners, photographic documentation of existing conditions, preparation of detailed submission packages with period-appropriate specifications, and sometimes representation at commission hearings. We balance authentic preservation with sensitive integration of modern systems and functionality."
  },
  {
    patterns: ['critical path scheduling', 'construction sequencing', 'project timeline management', 'schedule optimization', 'construction schedule'],
    response: "Construction scheduling employs critical path methodology to identify task sequences directly impacting overall project duration. Our scheduling approach uses advanced software to map dependencies between activities, identify resource constraints, establish float for non-critical tasks, and determine optimal sequencing. Key considerations include long-lead material orders, inspection requirements that could create bottlenecks, subcontractor availability windows, logical trade sequencing to prevent rework, and strategic clustering of similar activities for efficiency. We develop baseline schedules during pre-construction, update regularly during execution, and employ look-ahead scheduling techniques focusing on three-week windows for detailed coordination of upcoming activities. Critical milestones are communicated clearly with variance analysis when changes occur."
  },
  
  // Additional beginner bathroom questions
  {
    patterns: ['shower pan installation', 'building shower base', 'shower floor', 'custom shower pan', 'shower base options'],
    response: "Shower pans (the waterproof base of your shower) come in two main types: pre-formed units and custom-built pans. Pre-formed pans are manufactured from acrylic, fiberglass, or composite materials in standard sizes and shapes, offering simple installation and reliable waterproofing. Custom pans are built on-site using traditional mortar bed methods or modern waterproofing systems like Schluter Kerdi, Wedi, or Laticrete Hydroban, allowing any size, shape, or tile design. The installation process includes proper slope creation for drainage (approximately 1/4 inch per foot), waterproofing that extends up walls 6-8 inches, and appropriate drain selection. Custom pans cost more but provide unlimited design flexibility for unique spaces."
  },
  {
    patterns: ['bathroom ventilation', 'bathroom fan', 'exhaust fan', 'steam removal', 'bathroom humidity'],
    response: "Proper bathroom ventilation prevents moisture damage, mold growth, and extended humidity levels. Bathroom exhaust fans should provide adequate air movement (minimum 50 CFM for standard bathrooms, 1 CFM per square foot for larger spaces) and vent directly outdoors, not into attics or crawlspaces. Modern options include humidity-sensing operation, built-in lighting, integrated speakers, and quiet motors (look for sones ratings under 1.5 for quietest operation). Proper installation includes sealing duct connections, insulating ductwork in unconditioned spaces to prevent condensation, and ensuring appropriate termination fixtures that prevent backdrafts. For optimal function, run fans during showers and for 20-30 minutes afterward to fully remove humidity."
  },
  
  // Additional advanced bathroom questions
  {
    patterns: ['zero entry shower', 'curbless shower construction', 'barrier free shower', 'flush shower threshold', 'accessibility shower'],
    response: "Curbless shower construction requires precise floor height management to create proper drainage while maintaining a seamless transition. Implementation methods vary based on floor structure and finish floor height targets. For wood-framed floors, options include recessing the shower area by modifying floor joists, using specialized products like Wedi Fundo that minimize required depth, or creating a slightly elevated surrounding floor. For concrete slabs, we typically remove material to create proper recessing. All methods require careful waterproofing extending at least 24 inches beyond the shower entry and specialized drain systems (linear or multiple-point drains) to manage water effectively. Linear drains typically allow simpler single-slope shower floors versus traditional center drains requiring slopes from multiple directions."
  },
  {
    patterns: ['shower waterproofing methods', 'waterproofing shower walls', 'shower membrane systems', 'liquid waterproofing', 'shower wall prep'],
    response: "Modern shower waterproofing has evolved beyond traditional mortar bed and pan liner methods to include integrated systems with superior performance characteristics. We implement systems like Schluter Kerdi (sheet membrane adhered directly to drywall or cement board), Wedi (pre-waterproofed foam boards with integrated seam treatment), or Laticrete Hydroban (liquid-applied membrane creating a continuous waterproof surface). Each system includes coordinated components for transitions, corners, pipe penetrations, and niches. These modern systems eliminate the potentially problematic moisture sandwich created in traditional construction where moisture can become trapped between multiple waterproofing layers, offering simpler installation with superior moisture management compared to older cement board with vapor barrier approaches."
  },
  
  // Additional beginner kitchen questions
  {
    patterns: ['cabinet grades', 'cabinet quality levels', 'cabinet construction types', 'good vs basic cabinets', 'cabinet differences'],
    response: "Cabinet quality generally falls into three categories: stock (mass-produced in standard sizes), semi-custom (manufactured but with some size flexibility and more finish options), and custom (built specifically for your space). Beyond these categories, key quality indicators include: 1) Box construction - look for plywood versus particleboard, especially for sink base cabinets, 2) Drawer construction - dovetail joints and solid wood indicate higher quality than stapled particleboard, 3) Drawer glides - full-extension, soft-close mechanisms versus basic center-mount slides, 4) Door attachment - six-way adjustable concealed hinges versus non-adjustable options, and 5) Interior finishing - fully finished interiors indicate higher-quality construction. These differences affect both durability and functionality over time."
  },
  {
    patterns: ['countertop comparison', 'choosing countertops', 'countertop materials', 'countertop pros cons', 'best kitchen counters'],
    response: "Popular countertop options include: 1) Granite - natural stone with unique patterns, excellent heat resistance, moderate maintenance with periodic sealing, 2) Quartz - engineered stone offering consistent appearance, excellent durability, and minimal maintenance without sealing, 3) Marble - distinctive veining with classic appeal but requires careful maintenance and easily etches with acidic substances, 4) Solid surface (like Corian) - seamless appearance with integrated sinks, moderate durability with repairable surfaces, 5) Butcher block - warm wood appearance requiring regular oiling and care with water exposure, and 6) Laminate - most budget-friendly with improved modern appearances but limited durability and repair options. The best choice depends on your specific priorities regarding aesthetics, durability, maintenance willingness, and budget."
  },
  
  // Additional advanced kitchen questions
  {
    patterns: ['kitchen ventilation requirements', 'range hood cfm', 'makeup air systems', 'kitchen exhaust', 'hood ventilation'],
    response: "Proper kitchen ventilation balances effective contaminant removal with building pressure considerations. For gas ranges, CFM requirements typically follow the formula: BTU output ÷ 100 = minimum CFM (e.g., 60,000 BTU range requires minimum 600 CFM). For electric ranges, 150-300 CFM suffices for standard residential use. Hood capture area should ideally extend 3 inches beyond cooking surface on all exposed sides, with mounting height per manufacturer specifications (typically 24-30 inches above cooking surface). For hoods exceeding 400 CFM, most jurisdictions now require makeup air systems that introduce replacement air to prevent negative pressure issues affecting HVAC equipment, gas appliance operation, and potentially drawing contaminants from wall cavities. Implementation includes motorized dampers linked to hood operation and appropriately sized ducts for balanced airflow."
  },
  {
    patterns: ['kitchen triangle workflow', 'kitchen design principles', 'work zone kitchen', 'kitchen space planning', 'ergonomic kitchen design'],
    response: "Contemporary kitchen design has evolved from the traditional work triangle to a more nuanced zone-based approach addressing modern use patterns and multiple cooks. Key planning principles include: 1) Establishing primary workflow zones (prep, cooking, cleanup) with appropriate spacing (4-9 feet between primary zones balances efficiency with multiple-cook functionality), 2) Creating secondary zones for specialized functions like baking, beverage service, or technology, 3) Implementing landing areas adjacent to major appliances (15-24 inches beside refrigerator, 12-18 inches on either side of cooking surface, 18-30 inches near oven), 4) Planning appropriate clearances (minimum 42 inches for one-cook zones, 48+ inches for multiple cooks), 5) Considering traffic patterns that don't bisect primary work areas, and 6) Addressing storage with focus on item frequency-of-use and ergonomic access zones."
  }
];

// ADD NEW COMMERCIAL SERVICES ENTRIES
const commercialServiceEntries: KnowledgeBaseEntry[] = [
  // Office Renovation and Build-out
  {
    patterns: ['office renovation', 'office build out', 'office remodel', 'workspace renovation', 'office construction', 'office leasehold improvements', 'corporate space renovation'],
    response: "Our office renovation and build-out services transform commercial spaces to enhance productivity and reflect your brand identity. We handle complete office fit-outs including demolition, framing, electrical upgrades to accommodate modern technology needs, data infrastructure, energy-efficient lighting systems, HVAC modifications, acoustical considerations, flooring, ceiling treatments, custom millwork, and furniture integration. We specialize in minimizing business disruption through strategic scheduling and containment methods."
  },
  {
    patterns: ['open office concept', 'collaborative workspace', 'modern office design', 'office layout', 'workspace planning', 'activity-based workspaces', 'flexible office layouts'],
    response: "Modern office design balances collaborative and focused work needs. We create versatile workspaces with strategic space planning, adaptable partition systems, acoustic management solutions for noise control, integrated technology infrastructure, collaborative zones with appropriate furnishings, privacy areas for focused work, and thoughtful traffic flow patterns. Our designs incorporate appropriate power and data distribution, lighting for different task types, and brand expression through materials and design elements."
  },
  {
    patterns: ['executive office', 'conference room', 'meeting space', 'boardroom design', 'private office', 'board room renovation', 'c-suite design'],
    response: "Executive offices and conference spaces require sophisticated design and functionality. Our approach includes premium finishes that reflect your corporate image, integrated audiovisual systems for seamless presentations, proper acoustical treatments for privacy, specialized lighting with controllable scenes, custom millwork and built-ins, appropriate space planning for meeting configurations, and technology infrastructure discreetly integrated into architectural elements for a refined, uncluttered appearance."
  },
  {
    patterns: ['office kitchen', 'breakroom renovation', 'commercial kitchen', 'employee lounge', 'lunch area', 'staff lounge renovation', 'workplace cafeteria'],
    response: "Employee break areas and commercial kitchen spaces significantly impact workplace satisfaction. We design functional spaces with durable, easy-to-maintain surfaces, appropriate appliances scaled to your staff size, efficient storage solutions, proper ventilation systems, plumbing modifications when needed, adequate electrical capacity, specialized lighting, and seating arrangements that promote interaction while maintaining appropriate capacity. These spaces can be customized to reflect your company culture and operational needs."
  },
  
  // Retail Construction
  {
    patterns: ['retail construction', 'store buildout', 'retail space', 'shop renovation', 'commercial store', 'boutique construction', 'mall store buildout'],
    response: "Our retail construction services create engaging shopping environments that enhance customer experience and operational efficiency. We handle storefront systems and entrances, interior demising walls and display areas, specialty lighting to highlight merchandise, appropriate flooring for retail traffic patterns, security system integration, fitting room construction, cash wrap and point-of-sale areas, back-of-house storage and offices, and HVAC systems balanced for customer and staff comfort regardless of occupancy fluctuations."
  },
  {
    patterns: ['storefront design', 'retail entrance', 'display windows', 'retail facade', 'store exterior', 'retail facade renovation', 'shopping center storefront'],
    response: "Storefront designs critically impact retail success by creating strong first impressions. Our storefront implementations include high-performance glazing systems with appropriate security considerations, weather-resistant entrance systems engineered for heavy usage, lighting designs that enhance visibility and merchandise display, signage integration meeting local code requirements, ADA-compliant access solutions, architectural elements that reinforce brand identity, and sometimes specialized systems like operable fronts for indoor/outdoor retail experiences."
  },
  {
    patterns: ['retail fixtures', 'display systems', 'merchandise displays', 'store shelving', 'retail furniture', 'point of purchase displays', 'retail display solutions'],
    response: "Retail fixture installation requires precision coordination between construction elements and merchandising strategy. We install systems ranging from modular shelving and display cases to fully custom millwork pieces, ensuring proper attachment to structural elements, integrating specialty lighting, providing appropriate power distribution for animated displays, creating flexible systems that accommodate changing merchandise, and installing durable materials specified for retail environments that maintain appearance despite intensive customer interaction."
  },
  {
    patterns: ['pop up shop', 'temporary retail', 'seasonal store', 'short term retail', 'retail kiosk', 'exhibit booth construction', 'temporary showroom'],
    response: "Temporary retail environments require efficient construction approaches and creative solutions. We implement quick-deploy construction methods with reusable components, modular systems that install and dismantle efficiently, temporary utility connections that meet code while avoiding permanent modifications when possible, lightweight but durable materials, adaptable lighting systems, and design strategies that create high impact with minimal construction intervention. Our experience includes seasonal retail, event-based retail, and concept testing environments."
  },
  
  // Restaurant & Hospitality
  {
    patterns: ['restaurant construction', 'restaurant buildout', 'cafe construction', 'bar construction', 'restaurant renovation', 'fast-casual restaurant buildout', 'fine dining construction'],
    response: "Restaurant construction requires specialized knowledge of food service requirements. Our expertise includes commercial kitchen design and installation meeting health department regulations, appropriate ventilation and fire suppression systems, grease interceptor installation, specialized plumbing for food service, washable surface installations, dining area construction with appropriate acoustics, bar area construction with specialized plumbing and equipment integration, and coordination of furniture, fixture and equipment (FF&E) installation for a cohesive final environment."
  },
  {
    patterns: ['kitchen equipment', 'food service kitchen', 'culinary kitchen', 'chef kitchen', 'restaurant equipment', 'food preparation area', 'restaurant equipment installation'],
    response: "Commercial kitchen construction addresses unique regulatory and functional requirements. We implement health department-compliant surfaces and details, appropriate floor systems with proper slope to drains, specialized ventilation systems with makeup air solutions, fire suppression systems for cooking areas, adequate power distribution for commercial equipment, gas line installation and certification, specialized lighting rated for food preparation areas, and coordination of complex equipment installation with various mechanical connections."
  },
  {
    patterns: ['dining room construction', 'restaurant seating', 'dining area', 'patron space', 'restaurant interior', 'cafe seating area', 'restaurant dining room renovation'],
    response: "Dining area construction balances aesthetic goals with practical operational requirements. Our approach includes durable yet attractive flooring appropriate for food service, specialized acoustic treatments to manage noise levels, proper spacing for server circulation and code compliance, lighting systems with appropriate control for different dayparts, HVAC designed for occupancy fluctuations and customer comfort, architectural details that define the dining experience, and sometimes specialized systems like operable walls for private dining flexibility."
  },
  {
    patterns: ['bar construction', 'cocktail bar', 'bar design', 'lounge construction', 'hospitality bar', 'sports bar renovation', 'nightclub construction'],
    response: "Bar construction combines complex mechanical systems with showcase design elements. Our implementations include specialized plumbing for bar equipment and glass washing, proper drainage systems, integrated refrigeration equipment, draft beer systems with appropriate glycol cooling, specialized electrical for equipment and display lighting, bar top installations in various materials, back bar construction with display and storage functions, and often complex millwork featuring both aesthetic and functional elements reflecting the establishment's concept."
  },
  
  // Medical & Healthcare Facilities
  {
    patterns: ['medical office', 'healthcare facility', 'medical construction', 'clinic buildout', 'doctor office', 'urgent care facility', 'medical practice buildout'],
    response: "Medical facility construction adheres to specialized codes and operational requirements. Our healthcare projects include construction compliant with healthcare regulations and accessibility standards, specialized plumbing for medical fixtures, appropriate electrical systems for medical equipment, enhanced HVAC systems with proper air exchange rates, infection control considerations, specialized flooring appropriate for healthcare environments, casework and millwork meeting medical standards, lead shielding when required, and coordination of medical equipment installation."
  },
  {
    patterns: ['dental office', 'dental clinic', 'orthodontist office', 'dental practice', 'dental operatory', 'orthodontist office renovation', 'dental practice design'],
    response: "Dental office construction addresses the unique infrastructure requirements of dental practice. We implement specialized plumbing systems for dental chairs and equipment, proper air and vacuum systems for operatories, enhanced electrical distribution for dental technology, appropriate lighting for examination and procedures, lead shielding for x-ray areas, infection control measures in material selection and detailing, laboratory area construction with appropriate ventilation, and sterilization room construction meeting regulatory requirements."
  },
  {
    patterns: ['patient rooms', 'exam rooms', 'treatment rooms', 'procedure rooms', 'medical exam space', 'healthcare exam rooms', 'medical treatment facilities'],
    response: "Medical examination and treatment rooms require precise implementation of healthcare standards. Our construction includes washable surface systems meeting infection control requirements, appropriate medical gas connections where specified, specialized electrical for examination equipment, nurse call system installation, proper lighting for examination procedures, ADA-compliant configurations and fixtures, positive/negative pressure ventilation systems when required, and careful attention to privacy factors in both acoustical and visual design elements."
  },
  {
    patterns: ['medical reception', 'waiting room', 'patient check in', 'healthcare lobby', 'reception area', 'hospital reception renovation', 'clinic waiting room'],
    response: "Medical reception areas balance welcoming aesthetics with practical healthcare requirements. Our implementations include durable, cleanable surfaces that maintain appearance, check-in areas with appropriate privacy considerations, seating arranged for separation and capacity needs, proper HVAC for patient comfort and air quality, acoustical treatments to maintain privacy while reducing noise transmission, specialized lighting that creates appropriate atmosphere while facilitating necessary tasks, and design elements that reduce stress in healthcare environments."
  },
  
  // Industrial & Warehouse
  {
    patterns: ['warehouse construction', 'industrial building', 'manufacturing facility', 'industrial renovation', 'warehouse building', 'industrial facility renovation', 'warehouse renovation project'],
    response: "Industrial and warehouse construction focuses on operational efficiency and durability. Our projects include engineered concrete slab systems designed for specific loading requirements, pre-engineered metal building systems or tilt-wall construction methods, appropriate building envelope design for energy efficiency in large-volume spaces, specialized ventilation systems for industrial processes, high-bay lighting solutions balancing energy efficiency with appropriate illumination levels, dock equipment installation, and heavy-duty utility systems scaled for industrial operations."
  },
  {
    patterns: ['distribution center', 'logistics facility', 'fulfillment center', 'warehouse space', 'storage facility', 'loading dock construction', 'shipping facility buildout'],
    response: "Distribution facility construction requires specialized knowledge of logistics operations. We implement concrete slabs designed for material handling equipment, appropriate column spacing for racking systems, specialized lighting with motion control for energy efficiency, loading dock construction with appropriate equipment and shelters, HVAC systems designed for large open spaces, office space integration within warehouse environments, proper electrical distribution for equipment, and attention to circulation patterns optimized for operational efficiency."
  },
  {
    patterns: ['industrial office', 'warehouse office', 'production office', 'plant office', 'shop office', 'factory office space', 'manufacturing administration area'],
    response: "Industrial office spaces must bridge corporate and production environments effectively. Our approach includes creating appropriate separation between office and production activities, implementing sound attenuation measures, providing proper climate control independent from production areas, installing appropriate lighting for office functions, integrating data and communication systems, creating visibility to production areas where appropriate, and designing flexible spaces that accommodate both administrative functions and production support activities."
  },
  {
    patterns: ['manufacturing space', 'production facility', 'assembly area', 'industrial production', 'factory floor', 'manufacturing plant renovation', 'production line construction'],
    response: "Manufacturing space construction addresses specialized industrial processes and equipment. We implement concrete floors designed for process-specific requirements and equipment loading, appropriate utility distribution systems (compressed air, water, specialized gases, etc.), enhanced electrical systems for production equipment, proper ventilation and exhaust for manufacturing processes, specialized lighting for task visibility, equipment placement planning and coordination, proper drainage systems where required, and sometimes specialized structural elements for equipment support or overhead lifting systems."
  },
  
  // Specialized Commercial Services
  {
    patterns: ['tenant improvement', 'tenant buildout', 'leasehold improvements', 'commercial rental space', 'lease space renovation', 'office suite renovation', 'commercial space modification'],
    response: "Tenant improvement projects require navigating landlord requirements while achieving client objectives. Our tenant improvement process includes thorough review of lease documents and building standards, coordination with building management and engineering, design approaches that minimize core building system modifications when possible, clear delineation of landlord versus tenant responsibilities, permitting strategies specific to tenant improvement projects, and construction methods that minimize disruption to adjacent tenants and building operations."
  },
  {
    patterns: ['commercial bathroom', 'restroom renovation', 'public bathroom', 'office bathroom', 'commercial restroom', 'public restroom upgrades', 'ADA bathroom compliance'],
    response: "Commercial bathroom renovations must address high usage and accessibility requirements. Our implementations include durable, low-maintenance materials appropriate for commercial traffic, fixtures specified for commercial applications and water efficiency, proper ventilation systems, ADA-compliant layouts and fixtures, commercial-grade partition systems, adequate lighting for safety and functionality, appropriate accessories scaled for commercial usage, and often touchless systems for improved hygiene and reduced maintenance concerns."
  },
  
  // NEW ADDITIONAL COMMERCIAL TOPICS
  
  // Commercial Interior Design
  {
    patterns: ['commercial interior design', 'office space planning', 'commercial space design', 'workplace interior', 'business interior', 'corporate design', 'commercial design concept'],
    response: "Our commercial interior design services create purposeful environments that support business objectives while elevating brand identity. We approach each project with attention to space planning efficiency, workflow optimization, proper lighting design for productivity, brand-aligned color schemes and materials, furniture selection and specification, acoustic management strategies, biophilic elements for wellbeing, and technology integration. Our designers collaborate closely with construction teams to ensure conceptual integrity through implementation while addressing practical considerations like maintenance, durability, and budget alignment."
  },
  
  // Sustainable Commercial Construction
  {
    patterns: ['green commercial building', 'sustainable commercial construction', 'leed certification', 'eco-friendly commercial', 'energy efficient building', 'sustainable office', 'green building practices'],
    response: "Our sustainable commercial construction services focus on environmental responsibility and long-term operational efficiency. We implement green building practices including energy modeling for optimal system design, efficient building envelope systems, water conservation fixtures and systems, sustainable material selection with low environmental impact, construction waste management and recycling, indoor air quality management systems, renewable energy solutions where appropriate, and documentation for LEED, WELL, or other green building certification programs when desired. These approaches typically yield significant operational cost savings while demonstrating environmental commitment to stakeholders."
  },
  
  // Commercial Electrical Systems
  {
    patterns: ['commercial electrical', 'business electrical system', 'office power systems', 'commercial power distribution', 'commercial lighting systems', 'building electrical', 'facility electrical'],
    response: "Our commercial electrical installations address both current operational requirements and future flexibility. Services include load calculation and service sizing to match specific business needs, power distribution system design and installation, comprehensive lighting systems with appropriate controls, backup power solutions for critical systems, structured cabling for network and communication systems, lighting control integration with building automation, EMI/RFI shielding for sensitive environments, and electrical compliance with all applicable codes and standards. We particularly focus on energy efficiency, maintenance accessibility, and scalable systems that accommodate growth."
  },
  
  // Commercial Plumbing Systems
  {
    patterns: ['commercial plumbing', 'business plumbing system', 'commercial water systems', 'building plumbing', 'facility plumbing', 'commercial water efficiency', 'commercial plumbing code'],
    response: "Commercial plumbing installations require specialized knowledge of higher-demand applications. Our services include proper sizing of supply lines for commercial flow requirements, waste system design for commercial applications, water heater system sizing and installation, water treatment systems for specific business needs, backflow prevention systems to meet code requirements, specialized fixtures for commercial applications, water-efficient solutions that reduce operational costs, and grease interceptor/separator systems for food service applications. All installations strictly adhere to commercial plumbing codes with appropriate documentation and inspection coordination."
  },
  
  // Commercial HVAC Systems
  {
    patterns: ['commercial hvac', 'building mechanical systems', 'office heating cooling', 'commercial air conditioning', 'business ventilation', 'facility hvac', 'commercial climate control'],
    response: "Commercial HVAC systems must balance occupant comfort, operational efficiency, and system reliability. Our approach includes proper load calculation and system sizing methodology, energy-efficient equipment selection, ductwork design optimized for airflow and acoustics, zoning systems for distinct environmental needs, building automation integration for optimal performance, indoor air quality enhancement systems, preventative maintenance planning, and commissioning services to ensure performance meets design intent. We emphasize systems that minimize operational costs while maintaining precise temperature and humidity control for various commercial environments."
  },
  
  // Commercial Security Systems
  {
    patterns: ['commercial security', 'business security systems', 'office security', 'building access control', 'surveillance systems', 'business protection', 'facility security'],
    response: "Our commercial security implementations protect assets, people, and operations through integrated approaches. Services include comprehensive security assessment and planning, access control system design and installation, video surveillance deployment with strategic camera placement, intrusion detection systems appropriate to threat levels, secure IT infrastructure considerations, intercom and communication systems, emergency notification systems, and integration with existing building management systems. We balance security requirements with operational flow, creating systems that protect without impeding legitimate business activities."
  },
  
  // Commercial Audio/Visual Systems
  {
    patterns: ['commercial av', 'business audio visual', 'conference room technology', 'presentation systems', 'digital signage', 'video conferencing', 'commercial sound systems'],
    response: "Our commercial audio/visual installations enhance communication and presentation capabilities for modern businesses. Solutions include conference room design with integrated AV systems, presentation technology with appropriate display sizing and placement, distributed audio systems for various environments, video conferencing facilities optimized for virtual collaboration, digital signage systems for communication and branding, control systems that simplify operation of complex technology, and acoustic treatments that enhance audio quality. We prioritize intuitive user interfaces that encourage technology adoption while ensuring reliability for critical business functions."
  },
  
  // Commercial Landscaping
  {
    patterns: ['commercial landscaping', 'business exterior design', 'commercial outdoor space', 'corporate landscape', 'commercial grounds', 'business curb appeal', 'facility landscaping'],
    response: "Commercial landscaping creates important first impressions while addressing practical considerations. Our services include site analysis and master planning for optimal space utilization, sustainable planting designs appropriate to local climate, irrigation systems with water-saving technology, hardscape elements including walkways and gathering spaces, proper drainage solutions to protect structures, lighting design for safety and aesthetics, low-maintenance plant selection for operational efficiency, and seasonal rotation planning where appropriate. We balance aesthetic goals with practical maintenance considerations and sustainability objectives for long-term value."
  },
  
  // Commercial Accessibility Compliance
  {
    patterns: ['ada commercial compliance', 'accessibility construction', 'business accessibility', 'commercial ada requirements', 'disability access', 'universal design commercial', 'barrier free design'],
    response: "Our accessibility compliance services ensure facilities meet both legal requirements and inclusive design principles. Implementation includes accessible entrance and path of travel construction, proper door clearances and hardware specifications, compliant restroom design and fixture installation, appropriate ramp and elevator access where needed, correct signage implementation including braille elements, proper height considerations for counters and interactive elements, assistive listening systems in assembly areas, and thorough documentation for compliance verification. We view accessibility as an integrated design element rather than an afterthought, creating spaces that welcome all users."
  },
  
  // Commercial Fire Safety Systems
  {
    patterns: ['commercial fire protection', 'fire safety systems', 'sprinkler installation', 'fire alarm systems', 'business fire code', 'fire suppression', 'commercial fire compliance'],
    response: "Commercial fire safety systems protect lives, property, and business continuity. Our comprehensive approach includes fire alarm system design and installation appropriate to occupancy type, sprinkler system engineering and implementation, specialized suppression systems for unique hazards, smoke control systems where required by code, fire-rated construction elements including walls and doors, proper exit signage and emergency lighting, kitchen hood suppression systems for food service, and coordination with local fire authorities for inspections and compliance. All systems are designed to meet or exceed applicable codes while integrating appropriately with architectural elements."
  }
];

// ADD NEW RESIDENTIAL SERVICES ENTRIES
const residentialServiceEntries: KnowledgeBaseEntry[] = [
  // Whole Home Renovation
  {
    patterns: ["whole home renovation", "complete house remodel", "full house renovation", "entire home remodel", "renovate my whole house"],
    response: "Our whole home renovation services transform your entire living space with a cohesive design approach. We handle everything from design to completion including structural modifications, mechanical system updates, and complete interior finishes. These comprehensive projects typically take 2-4 months and are coordinated to minimize disruption to your daily life."
  },
  {
    patterns: ["house makeover", "update entire home", "home transformation", "modernize whole house", "refresh my entire home"],
    response: "A complete home makeover refreshes your space with updated design elements throughout. Our approach includes a thorough assessment of your current home, development of a unified design vision, and execution across all rooms to ensure cohesive style and function. This is ideal for homes with outdated finishes or inconsistent styles resulting from previous partial renovations."
  },
  
  // Home Addition
  {
    patterns: ["home addition", "room addition", "house extension", "add onto my house", "build an addition"],
    response: "Our home addition services increase your living space while maintaining architectural harmony. We manage the entire process from foundation to finishing, ensuring proper integration with your existing structure. Popular additions include family room expansions, primary bedroom suites, expanded kitchens, and second-story additions that maximize your property value."
  },
  {
    patterns: ["expand my home", "add square footage", "build extra space", "addition to my house", "extend living space"],
    response: "Expanding your home allows you to gain valuable living space without the disruption of moving. Our addition projects include careful structural planning, matching architectural details with your existing home, extending mechanical systems appropriately, and ensuring proper insulation and energy efficiency. We handle all permits, inspections, and coordination for a seamless expansion."
  },
  
  // Basement Finishing
  {
    patterns: ["basement finishing", "finish basement", "basement remodel", "basement renovation", "convert basement"],
    response: "Our basement finishing transforms underutilized space into valuable living area. We address moisture control, proper insulation, appropriate lighting, HVAC integration, and code-compliant egress. These spaces can become recreation rooms, home theaters, additional bedrooms, home offices, or workout areas customized to your specific needs."
  },
  {
    patterns: ["basement makeover", "basement conversion", "basement living space", "usable basement", "basement family room"],
    response: "Converting your basement into functional living space adds value to your home without expanding your footprint. Our process begins with waterproofing assessment and remediation if needed, then includes framing with proper insulation, electrical upgrades, appropriate flooring for below-grade installations, enhanced lighting to overcome limited natural light, and custom storage solutions to maximize utility."
  },
  
  // Kitchen Remodeling
  {
    patterns: ["kitchen remodel", "kitchen renovation", "update kitchen", "renovate kitchen", "kitchen makeover"],
    response: "Our kitchen remodeling services create functional, beautiful spaces tailored to your cooking and entertaining style. Projects typically include custom cabinetry, premium countertops, quality appliances, specialized lighting, and thoughtful storage solutions. We manage everything from initial design through final installation with attention to both aesthetics and functionality."
  },
  {
    patterns: ["new kitchen", "kitchen redesign", "kitchen transformation", "modern kitchen", "kitchen upgrade"],
    response: "A kitchen transformation dramatically improves both appearance and functionality. Our process includes space planning for optimal workflow, cabinetry designed for your specific storage needs, appropriate surface materials for your lifestyle, lighting design with multiple layers, and coordination of all trades including plumbing, electrical, and finish work for a seamless result."
  },
  
  // Bathroom Remodeling
  {
    patterns: ["bathroom remodel", "bathroom renovation", "update bathroom", "renovate bathroom", "bathroom makeover"],
    response: "Our bathroom renovations create personal retreats with improved functionality. Services include custom shower systems, bathtub options, vanity and storage solutions, specialized lighting, proper ventilation, and coordinated fixtures and finishes. We address both aesthetic preferences and practical needs like storage, accessibility, and water efficiency."
  },
  {
    patterns: ["new bathroom", "bathroom redesign", "bathroom transformation", "modern bathroom", "bathroom upgrade"],
    response: "Bathroom transformations enhance both daily routines and property value. Our approach includes waterproofing systems that prevent future issues, fixture placement for optimal function, appropriate ventilation to prevent moisture problems, lighting for different tasks and moods, and storage solutions that keep necessities organized yet accessible. We ensure all work meets current building codes for safety and longevity."
  },
  
  // Custom Cabinetry
  {
    patterns: ["whole home renovation", "complete house remodel", "full house renovation"],
    response: "Our whole home renovation services transform your entire living space with a cohesive design approach."
  },
  {
    patterns: ["home addition", "room addition", "house extension"],
    response: "Our home addition services increase your living space while maintaining architectural harmony."
  },
  {
    patterns: ["basement finishing", "basement remodel", "basement renovation"],
    response: "Our basement finishing transforms underutilized space into valuable living areas."
  }
];


// Update knowledge base to include the new entries
const knowledgeBase: KnowledgeBaseEntry[] = [
  // Existing entries
  {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    response: "Hello! Welcome to Arxen Construction. How can I help you with your construction or remodeling needs today?"
  },
  {
    patterns: ['who are you', 'what are you', 'what is this', 'what do you do'],
    response: "I'm Arxen's virtual assistant. I can provide information about our services, help you get a free estimate, or connect you with our team."
  },
  {
    patterns: ['thanks', 'thank you', 'appreciate', 'helpful'],
    response: "You're welcome! I'm glad I could help. Is there anything else you'd like to know about our services?"
  },
  
  // ... existing entries ...
  
  // Add new conversational entries
  ...additionalConversationalEntries,
  
  // Add specialized topic entries
  ...specializedTopicEntries,
  
  // Add new technical knowledge entries
  ...newTechnicalKnowledgeEntries,
  
  // Add advanced specialized topics
  ...advancedSpecializedTopics,
  
  // Add commercial service entries
  ...commercialServiceEntries,
  
  // Add residential service entries
  ...residentialServiceEntries,
  
  // Previous additional entries
  ...additionalKnowledgeEntries
];

// Add advanced pattern matching keywords for sentiment analysis
const negativeKeywords = ['disappointed', 'unhappy', 'frustrated', 'annoyed', 'angry', 'upset', 'terrible', 'bad', 'awful', 'horrible', 'dislike', 'hate'];
const positiveKeywords = ['great', 'excellent', 'awesome', 'amazing', 'love', 'perfect', 'fantastic', 'wonderful', 'good', 'like', 'appreciate', 'helpful', 'thanks', 'thank you'];

// Add conversation starter suggestions to encourage natural text input
const conversationStarters = [
  "Tell me about your kitchen remodeling services",
  "What's included in a bathroom renovation?",
  "How much does a typical remodel cost?",
  "Do you work in the Atlanta area?",
  "Can you help with custom cabinetry?"
];

// Add a dedicated list of FAQ categories and questions
const faqCategories = [
  {
    name: "General",
    questions: [
      { question: "What areas do you serve?", action: "question-what-areas-do-you-service-" },
      { question: "How long have you been in business?", action: "question-company-history" },
      { question: "Are you licensed and insured?", action: "question-license" },
      { question: "Do you work on weekends?", action: "question-weekend" },
      { question: "How can I contact your team?", action: "speak" }
    ]
  },
  {
    name: "Services",
    questions: [
      { question: "What's included in your warranty?", action: "question-what-s-included-in-your-warranty-" },
      { question: "How long does a renovation take?", action: "question-how-long-does-a-typical-renovation-take-" },
      { question: "Do you offer design services?", action: "question-design-help" },
      { question: "Can you help with custom projects?", action: "service-cabinetry" },
      { question: "Do you work on commercial properties?", action: "services-commercial" }
    ]
  },
  {
    name: "Pricing",
    questions: [
      { question: "Do you offer financing?", action: "question-do-you-offer-financing-" },
      { question: "How much does a kitchen remodel cost?", action: "question-how-much-does-a-kitchen-remodel-cost-" },
      { question: "How much does a bathroom remodel cost?", action: "question-bathroom-pricing" },
      { question: "What payment methods do you accept?", action: "question-payment" },
      { question: "Do you require a deposit?", action: "question-deposit" }
    ]
  },
  {
    name: "Process",
    questions: [
      { question: "How do I get a free estimate?", action: "question-how-do-i-get-a-free-estimate-" },
      { question: "Do you handle permits?", action: "question-permit" },
      { question: "Can I stay in my home during renovation?", action: "question-live-in-home" },
      { question: "How do you handle cleanup?", action: "question-clean" },
      { question: "What is your cancellation policy?", action: "question-cancel" }
    ]
  }
];

const ChatBot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Add mobile detection
  const [showOptions, setShowOptions] = useState(false); // Track if options are being shown
  const [showEndChatFeedback, setShowEndChatFeedback] = useState(false); // Track if end chat feedback is being shown
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add conversation memory state
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory>({
    topics: [],
    lastQuestionAnswered: null,
    sentimentScore: 0,
    interactionCount: 0,
    visitedPages: [],
    lastActiveTimestamp: Date.now()
  });
  
  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if we're on the FreeEstimate page to avoid duplicate chat widgets
  const isFreeEstimatePage = location.pathname.includes('/free-estimate');
  
  // Don't show the chat bot on the free estimate page, which has its own chat widget
  if (isFreeEstimatePage) {
    return null;
  }
  
  // Add property type context
  const { propertyType, buildingType } = usePropertyType();

  // Determine the current page context
  const getCurrentPageContext = () => {
    if (pathname.includes('/services/kitchen')) return 'kitchen';
    if (pathname.includes('/services/bathroom')) return 'bathroom';
    if (pathname.includes('/services/flooring')) return 'flooring';
    if (pathname.includes('/services/custom-cabinetry')) return 'cabinetry';
    if (pathname.includes('/commercial')) return 'commercial';
    if (pathname.includes('/residential')) return 'residential';
    if (pathname.includes('/contact')) return 'contact';
    if (pathname.includes('/about')) return 'about';
    if (pathname.includes('/portfolio')) return 'portfolio';
    if (pathname === '/') return 'home';
    return null;
  };

  const pageContext = getCurrentPageContext();

  // Load conversation memory from localStorage
  useEffect(() => {
    const savedMemory = localStorage.getItem(CONVO_MEMORY_KEY);
    if (savedMemory) {
      try {
        const parsedMemory = JSON.parse(savedMemory);
        // Update visited pages if this is a new page
        if (pageContext && !parsedMemory.visitedPages.includes(pageContext)) {
          parsedMemory.visitedPages.push(pageContext);
        }
        parsedMemory.lastActiveTimestamp = Date.now();
        setConversationMemory(parsedMemory);
        localStorage.setItem(CONVO_MEMORY_KEY, JSON.stringify(parsedMemory));
      } catch (error) {
        console.error('Error loading conversation memory:', error);
        localStorage.removeItem(CONVO_MEMORY_KEY);
      }
    } else {
      // Initialize new memory with current page
      const newMemory: ConversationMemory = {
        topics: [],
        lastQuestionAnswered: null,
        sentimentScore: 0,
        interactionCount: 0,
        visitedPages: pageContext ? [pageContext] : [],
        lastActiveTimestamp: Date.now()
      };
      setConversationMemory(newMemory);
      localStorage.setItem(CONVO_MEMORY_KEY, JSON.stringify(newMemory));
    }

    // Existing initialization code...
    // ... existing code ...
  }, [pageContext]);

  // Function to suggest chat topics based on current page
  const getSuggestedQuestions = () => {
    if (pageContext === 'kitchen') {
      return [
        "How much does a kitchen remodel cost?",
        "What kitchen styles are popular?",
        "How long does a kitchen renovation take?"
      ];
    }
    if (pageContext === 'bathroom') {
      return [
        "What's the cost of a bathroom renovation?",
        "Do you install walk-in showers?",
        "Can you make my bathroom more accessible?"
      ];
    }
    if (pageContext === 'commercial') {
      return [
        "What commercial services do you offer?",
        "Do you work with retail spaces?",
        "How do you minimize business disruption?"
      ];
    }
    if (pageContext === 'portfolio') {
      return [
        "Can I see more examples of your work?",
        "Do you have before and after photos?",
        "What was your most challenging project?"
      ];
    }
    // Default questions
    return [
      "What services do you offer?",
      "How do I get a free estimate?",
      "What areas do you serve?"
    ];
  };

  // Analyze message sentiment
  const analyzeSentiment = (text: string): number => {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    // Check for negative keywords
    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score -= 0.2;
    });
    
    // Check for positive keywords
    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 0.2;
    });
    
    // Cap at -1 to 1 range
    return Math.max(-1, Math.min(1, score));
  };

  // Update conversation memory
  const updateConversationMemory = (userMsg: string, botResponseText: string) => {
    setConversationMemory(prev => {
      const newMemory = { ...prev };
      
      // Update sentiment based on user message
      const sentimentChange = analyzeSentiment(userMsg);
      newMemory.sentimentScore = Math.max(-1, Math.min(1, newMemory.sentimentScore + sentimentChange));
      
      // Update interaction count
      newMemory.interactionCount += 1;
      
      // Track topics discussed based on keywords
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('kitchen')) newMemory.topics.push('kitchen');
      if (lowerMsg.includes('bathroom')) newMemory.topics.push('bathroom');
      if (lowerMsg.includes('price') || lowerMsg.includes('cost')) newMemory.topics.push('pricing');
      if (lowerMsg.includes('timeline') || lowerMsg.includes('how long')) newMemory.topics.push('timeline');
      if (lowerMsg.includes('warranty')) newMemory.topics.push('warranty');
      
      // Remove duplicates
      newMemory.topics = [...new Set(newMemory.topics)];
      
      // Save last question answered
      newMemory.lastQuestionAnswered = userMsg;
      newMemory.lastActiveTimestamp = Date.now();
      
      // Save to localStorage
      localStorage.setItem(CONVO_MEMORY_KEY, JSON.stringify(newMemory));
      
      return newMemory;
    });
  };

  // Reset conversation memory
  const resetConversationMemory = () => {
    const newMemory: ConversationMemory = {
      topics: [],
      lastQuestionAnswered: null,
      sentimentScore: 0,
      interactionCount: 0,
      visitedPages: pageContext ? [pageContext] : [],
      lastActiveTimestamp: Date.now()
    };
    setConversationMemory(newMemory);
    localStorage.setItem(CONVO_MEMORY_KEY, JSON.stringify(newMemory));
  };

  // Modify the resetChat function to also reset conversation memory
  const resetChat = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    resetConversationMemory();
    setMessages([]);
  };

  useEffect(() => {
    // Initialize chat with a welcome message if no history
    if (messages.length === 0) {
      // Add property-type specific welcome if available
      let welcomeMessage = "Hello! Welcome to Arxen Construction. How can I assist you with your construction or remodeling project today?";
      
      // Customize initial message based on property context if available
      if (propertyType?.name || buildingType?.name) {
        const selectedType = propertyType?.name || buildingType?.name;
        welcomeMessage = `Hello! I see you're interested in services for your ${selectedType}. How can I assist you with your construction or remodeling needs today?`;
      }
      
      setMessages([
        {
          text: welcomeMessage,
          isUser: false,
          timestamp: Date.now()
        }
      ]);
    }
    
    // Load saved chat history
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // If error loading, remove corrupted data
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    }
    
    // Cleanup function
    return () => {
      // Any cleanup needed when component unmounts
      setMessages(current => current); // Cancel any pending state updates
    };
  }, []);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      // Don't save more than 50 messages to prevent localStorage overflow
      const messagesToSave = messages.slice(-50);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messagesToSave));
    }
    
    // Scroll chat to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    return () => {
      // Cleanup function
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // If opening the chat and we have no messages, initialize
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          text: "👋 Welcome to Arxen Construction! How can I help you with your project today?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Get a Free Estimate", action: "estimate" },
            { text: "View Services", action: "services" },
            { text: "Speak to Representative", action: "speak" },
            { text: "Ask a Question", action: "question" }
          ]
        },
        // Add conversation starters message
        {
          text: "You can also type any question directly. Here are some ideas to get started:",
          isUser: false,
          timestamp: Date.now() + 100,
          type: 'quick-reply',
          options: conversationStarters.map(starter => ({ 
            text: starter, 
            action: starter 
          }))
        }
      ]);
    }
    
    // If closing the chat, update local storage
    if (isOpen) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    }
  };

  const closeChat = () => {
    // Always close the chat when this function is called
    setIsOpen(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  };

  const handleOptionSelect = (action: string) => {
    let userMessage: ChatMessage = {
      text: "",
      isUser: true,
      timestamp: Date.now()
    };
    
    let botResponse: ChatMessage | null = null;
    
    // Map action codes to human-readable messages and fix quick help buttons
    if (action.startsWith('question-')) {
      // Handle quick help buttons at the top
      const topic = action.replace('question-', '');
      
      switch (topic.toLowerCase()) {
        case 'schedule':
          userMessage.text = "I'd like to schedule a consultation";
          // Route schedule button to the appointment action
          action = "schedule-online";
          break;
        case 'pricing':
          userMessage.text = "I'd like to know about your pricing";
          // Route pricing button to pricing discussion
          action = "question-how-much-does-a-kitchen-remodel-cost-";
          break;
        case 'services':
          userMessage.text = "What services do you offer?";
          // Route services button to services overview
          action = "services";
          break;
        case 'faq':
          userMessage.text = "What are some frequently asked questions?";
          // Create a special FAQ handler instead of routing elsewhere
          action = "faq-menu";
          break;
        default:
          // For other question prefixed actions, make a nice readable question
          userMessage.text = `I'd like to know about ${topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}`;
      }
    }
    
    switch (action) {
      // Basic navigation and core functions
      case 'estimate':
        userMessage.text = "I'd like to get a free estimate";
        botResponse = {
          text: "Great! We offer free estimates for all our services. I can help you schedule one right now.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Schedule Online", action: "schedule-online" },
            { text: "Call for Estimate", action: "call-estimate" }
          ]
        };
        break;
      
      case 'schedule-online':
        userMessage.text = "I'd like to schedule online";
        botResponse = {
          text: "You can use our convenient online form to request your free estimate. What type of project are you planning?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Residential", action: "residential-estimate" },
            { text: "Commercial", action: "commercial-estimate" }
          ]
        };
        break;
      
      case 'residential-estimate':
        userMessage.text = "I need a residential estimate";
        botResponse = {
          text: "Perfect! I'll direct you to our residential estimate form where you can provide project details and upload photos. Our team will review and contact you within 24-48 hours.",
          isUser: false,
          timestamp: Date.now(),
          type: 'link',
          options: [
            { text: "Go to Estimate Form", action: "/free-estimate?projectType=residential" }
          ]
        };
        break;
      
      case 'commercial-estimate':
        userMessage.text = "I need a commercial estimate";
        botResponse = {
          text: "Perfect! I'll direct you to our commercial estimate form where you can provide project details. Our team will review and contact you within 24-48 hours.",
          isUser: false,
          timestamp: Date.now(),
          type: 'link',
          options: [
            { text: "Go to Commercial Estimate", action: "/free-estimate?projectType=commercial" }
          ]
        };
        break;
      
      case 'call-estimate':
        userMessage.text = "I'd prefer to call for an estimate";
        botResponse = {
          text: "No problem! You can reach our estimate team directly at:",
          isUser: false,
          timestamp: Date.now(),
          type: 'contact',
          options: [
            { text: "404-934-9458", action: "tel:404-934-9458" }
          ]
        };
        break;
      
      case 'speak':
        userMessage.text = "I'd like to speak with a representative";
        botResponse = {
          text: "I'd be happy to connect you with one of our experts. You can reach our team through any of these options:",
          isUser: false,
          timestamp: Date.now(),
          type: 'contact',
          options: [
            { text: "Call Us: 404-934-9458", action: "tel:404-934-9458" },
            { text: "Email: sustenablet@gmail.com", action: "mailto:sustenablet@gmail.com" },
            { text: "Contact Form", action: "/contact" }
          ]
        };
        break;
      
      case 'question':
        userMessage.text = "I have some questions";
        botResponse = {
          text: "I'm here to help! Here are some common questions, or you can type your own:",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: commonQuestions.map(q => ({ text: q, action: `question-${q.toLowerCase().replace(/[^a-z0-9]/g, '-')}` }))
        };
        break;
      
      case 'question-how-do-i-get-a-free-estimate-':
        userMessage.text = "How do I get a free estimate?";
        botResponse = {
          text: "Getting a free estimate is easy! You can either fill out our online form with your project details, or call our office to schedule a consultation. For complex projects, we typically arrange an on-site visit.",
          isUser: false,
          timestamp: Date.now(),
          type: 'link',
          options: [
            { text: "Request Estimate Online", action: "/free-estimate" },
            { text: "Call for Estimate", action: "tel:404-934-9458" }
          ]
        };
        break;
      
      case 'question-what-areas-do-you-service-':
        userMessage.text = "What areas do you service?";
        botResponse = {
          text: "We proudly serve the greater Atlanta metropolitan area, including Fulton, DeKalb, Cobb, Gwinnett, and Clayton counties. For larger commercial projects, we may extend our service area.",
          isUser: false,
          timestamp: Date.now()
        };
        break;
      
      case 'question-how-long-does-a-typical-renovation-take-':
        userMessage.text = "How long does a typical renovation take?";
        botResponse = {
          text: "Project timelines vary based on scope and complexity. Kitchen renovations typically take 3-6 weeks, bathrooms 2-4 weeks, and larger additions 2-3 months. We provide specific timelines during the estimation process.",
          isUser: false,
          timestamp: Date.now()
        };
        break;
      
      case 'question-do-you-offer-financing-':
        userMessage.text = "Do you offer financing?";
        botResponse = {
          text: "Yes, we offer several financing options through our trusted partners. These include home improvement loans, lines of credit, and special promotional terms. We can guide you through the application process.",
          isUser: false,
          timestamp: Date.now(),
          type: 'link',
          options: [
            { text: "Financing Details", action: "/financing" }
          ]
        };
        break;
      
      case 'question-what-s-included-in-your-warranty-':
        userMessage.text = "What's included in your warranty?";
        botResponse = {
          text: "We stand behind our work with a comprehensive warranty. All labor is covered for 2 years, and materials typically carry manufacturer warranties of 1-25+ years depending on the product.",
          isUser: false,
          timestamp: Date.now()
        };
        break;
      
      case 'specific-service':
        userMessage.text = "I'd like to ask about a specific service";
        botResponse = {
          text: "What specific service are you interested in learning more about?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Kitchen Remodeling", action: "service-kitchen" },
            { text: "Bathroom Renovation", action: "service-bathroom" },
            { text: "Flooring", action: "service-flooring" },
            { text: "Custom Cabinetry", action: "service-cabinetry" },
            { text: "Other Services", action: "other-services" }
          ]
        };
        break;
      
      case 'other-services':
        userMessage.text = "What other services do you offer?";
        botResponse = {
          text: "We provide a comprehensive range of home improvement services including room additions, basement finishing, attic conversions, deck building, siding installation, interior/exterior painting, and more. Is there a specific project type you're considering?",
          isUser: false,
          timestamp: Date.now(),
          type: 'link',
          options: [
            { text: "View All Services", action: "/services" },
            { text: "Contact for Custom Project", action: "/contact" }
          ]
        };
        break;
      
      case 'financing-specialist':
        userMessage.text = "I'd like to speak with a financing specialist";
        botResponse = {
          text: "I'll connect you with our financing team who can explain all available options and help find the best solution for your project. You can reach them directly at:",
          isUser: false,
          timestamp: Date.now(),
          type: 'contact',
          options: [
            { text: "Call Financing Team: 404-934-9458", action: "tel:404-934-9458" },
            { text: "Email: financing@arxenconstruction.com", action: "mailto:financing@arxenconstruction.com" }
          ]
        };
        break;
      
      // FAQ-related cases
      case 'faq-menu':
        botResponse = {
          text: "Here are some of our most frequently asked questions by category:",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: faqCategories.map(cat => ({ text: cat.name + " FAQs", action: `faq-category-${cat.name.toLowerCase()}` }))
        };
        break;
        
      // Add handlers for each FAQ category
      case 'faq-category-general':
      case 'faq-category-services':
      case 'faq-category-pricing':
      case 'faq-category-process':
        const categoryName = action.replace('faq-category-', '');
        const category = faqCategories.find(c => c.name.toLowerCase() === categoryName);
        
        if (category) {
          botResponse = {
            text: `${category.name} FAQs:`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: category.questions.map(q => ({ text: q.question, action: q.action }))
          };
        }
        break;
      
      // Missing or incomplete FAQ handlers
      case 'question-license':
        userMessage.text = "Are you licensed and insured?";
        botResponse = {
          text: "Yes, Arxen Construction is fully licensed, insured, and bonded. We maintain comprehensive general liability insurance and workers' compensation coverage for all our team members. We're happy to provide proof of insurance and our license numbers upon request.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Get a Free Estimate", action: "estimate" },
            { text: "More FAQs", action: "faq-menu" }
          ]
        };
        break;
        
      case 'question-weekend':
        userMessage.text = "Do you work on weekends?";
        botResponse = {
          text: "Our regular working hours are Monday through Friday, 7:30 AM to 4:30 PM. However, for certain projects and phases that require minimal disruption to your daily life, we can arrange for weekend work with advance notice. This is evaluated on a case-by-case basis during the planning phase of your project.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Schedule a Consultation", action: "schedule-online" },
            { text: "More FAQs", action: "faq-menu" }
          ]
        };
        break;
        
      case 'question-design-help':
        userMessage.text = "Do you offer design services?";
        botResponse = {
          text: "Yes, we offer comprehensive design services for all types of renovation projects. Our design team can help you with everything from initial concept development to material selection and 3D renderings. We believe that thoughtful design is essential to a successful renovation, and our designers work closely with our construction team to ensure your vision is executed perfectly.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Learn About Our Process", action: "question-process" },
            { text: "Schedule Design Consultation", action: "schedule-online" }
          ]
        };
        break;
        
      case 'question-bathroom-pricing':
        userMessage.text = "How much does a bathroom remodel cost?";
        botResponse = {
          text: "Bathroom remodeling costs typically range from $18,000 to $50,000, depending on the scope of work, materials selected, and your property type. A basic refresh with new fixtures and surfaces starts around $18,000, while a luxury spa bathroom with premium materials and custom features can exceed $50,000. We're happy to provide a detailed estimate for your specific project.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Get Bathroom Estimate", action: "/free-estimate?initialService=bathroom" },
            { text: "View Bathroom Portfolio", action: "/portfolio?category=bathroom" }
          ]
        };
        break;
        
      case 'question-payment':
        userMessage.text = "What payment methods do you accept?";
        botResponse = {
          text: "We accept multiple payment methods for your convenience, including checks, all major credit cards, bank transfers, and payments through secure online platforms. For larger projects, we typically establish a payment schedule tied to project milestones, with a deposit to secure your start date and subsequent payments as the project progresses.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Financing Options", action: "question-do-you-offer-financing-" },
            { text: "More About Process", action: "faq-category-process" }
          ]
        };
        break;
        
      case 'question-deposit':
        userMessage.text = "Do you require a deposit?";
        botResponse = {
          text: "Yes, we require a deposit to secure your project's start date and cover initial material orders. The deposit amount is typically 30% of the total project cost, with the remaining balance paid in installments tied to project milestones. This structure ensures that your project progresses smoothly while protecting both parties throughout the construction process.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Payment Methods", action: "question-payment" },
            { text: "Financing Options", action: "question-do-you-offer-financing-" }
          ]
        };
        break;
        
      case 'question-live-in-home':
        userMessage.text = "Can I stay in my home during renovation?";
        botResponse = {
          text: "Yes, many of our clients do stay in their homes during remodeling projects. Depending on the scope of work, we can often section off work areas to maintain livable conditions. We'll discuss logistics during the planning phase, including bathroom access, temporary kitchen setups if needed, and create a plan that minimizes disruption to your daily life while ensuring efficient project completion.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "How Do You Handle Cleanup?", action: "question-clean" },
            { text: "Schedule a Consultation", action: "schedule-online" }
          ]
        };
        break;
        
      case 'question-clean':
        userMessage.text = "How do you handle cleanup?";
        botResponse = {
          text: "We take cleanliness very seriously throughout the construction process. Our team implements dust containment systems, protective floor coverings, and conducts daily cleanup to minimize disruption to your home. At the end of each workday, we ensure the space is safe and reasonably tidy. Upon project completion, we perform a thorough professional cleaning to ensure your space is ready to enjoy.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Our Process", action: "faq-category-process" },
            { text: "Get a Free Estimate", action: "estimate" }
          ]
        };
        break;
        
      case 'question-cancel':
        userMessage.text = "What is your cancellation policy?";
        botResponse = {
          text: "Our cancellation policy allows for free rescheduling with at least 48 hours notice for consultations and appointments. For major projects already under contract, our agreements include specific terms regarding timeline changes and cancellations. We understand that circumstances change, and we always aim to be reasonable while protecting both our clients and our scheduling commitments.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Contract Process", action: "question-process" },
            { text: "Schedule a Consultation", action: "schedule-online" }
          ]
        };
        break;

      case 'question-company-history':
        userMessage.text = "How long have you been in business?";
        botResponse = {
          text: "Arxen Construction was established in 2003, giving us over 20 years of experience in the Atlanta area. The company was founded by master craftsmen with a vision for combining traditional quality with modern building science. Over the years, we've completed more than 2,500 successful projects while maintaining our commitment to craftsmanship and customer satisfaction.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "View Our Portfolio", action: "/portfolio" },
            { text: "More About Us", action: "/about" }
          ]
        };
        break;
        
      case 'question-permit':
        userMessage.text = "Do you handle permits?";
        botResponse = {
          text: "Yes, we handle all necessary permits and ensure all work complies with local building codes. Our team manages the entire permitting process, including document preparation, submissions, coordination with inspectors, and final approvals. This comprehensive approach saves you time and ensures your project meets all legal requirements and safety standards.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Our Process", action: "faq-category-process" },
            { text: "Get Started", action: "estimate" }
          ]
        };
        break;
        
      case 'question-process':
        userMessage.text = "What is your project process?";
        botResponse = {
          text: "Our project process includes 5 key phases: 1) Initial consultation and needs assessment, 2) Design development and material selection, 3) Detailed proposal and contract, 4) Construction with regular progress updates, and 5) Final walkthrough and project completion. Throughout this process, you'll have a dedicated project manager as your single point of contact, ensuring clear communication and accountability.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Schedule a Consultation", action: "schedule-online" },
            { text: "Testimonials", action: "/testimonials" }
          ]
        };
        break;

      // Services-related cases
      case 'services':
        userMessage.text = "What services do you offer?";
        botResponse = {
          text: "We offer a wide range of construction and renovation services. What type are you interested in?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Kitchen Remodeling", action: "service-kitchen" },
            { text: "Bathroom Renovation", action: "service-bathroom" },
            { text: "Flooring & Tile", action: "service-flooring" },
            { text: "Custom Cabinetry", action: "service-cabinetry" },
            { text: "Home Additions", action: "service-additions" },
            { text: "Residential Services", action: "services-residential" },
            { text: "Commercial Services", action: "services-commercial" }
          ]
        };
        break;
      
      case 'service-kitchen':
        userMessage.text = "Tell me about kitchen remodeling";
        botResponse = {
          text: "Our kitchen remodeling services include complete transformations with custom cabinetry, premium countertops, expert tiling, lighting design, and appliance installation. Our design team works with you to create the perfect layout and style for your needs and budget, ensuring both beauty and functionality in the heart of your home.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Kitchen Gallery", action: "/portfolio?category=kitchen" },
            { text: "Kitchen Pricing", action: "question-how-much-does-a-kitchen-remodel-cost-" },
            { text: "Get a Free Estimate", action: "/free-estimate?initialService=kitchen" }
          ]
        };
        break;
      
      case 'service-bathroom':
        userMessage.text = "Tell me about bathroom renovations";
        botResponse = {
          text: "Our bathroom renovation services include complete remodels, shower/tub replacement, custom tilework, vanity installation, lighting, and plumbing fixtures. We specialize in creating spa-like retreats with modern amenities and timeless design, whether you're looking for a quick refresh or a luxurious transformation.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Bathroom Gallery", action: "/portfolio?category=bathroom" },
            { text: "Bathroom Pricing", action: "question-bathroom-pricing" },
            { text: "Get a Free Estimate", action: "/free-estimate?initialService=bathroom" }
          ]
        };
        break;
      
      case 'service-flooring':
        userMessage.text = "Tell me about flooring services";
        botResponse = {
          text: "We offer professional installation of all flooring types: hardwood, engineered wood, luxury vinyl, tile, carpet, and more. Our experts help you select the perfect material for your space and ensure flawless installation with proper preparation and finishing. We can match existing floors or help you completely transform your space with new materials.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Flooring Gallery", action: "/portfolio?category=flooring" },
            { text: "Flooring Options", action: "/services/category/flooring" },
            { text: "Get a Free Estimate", action: "/free-estimate?initialService=flooring" }
          ]
        };
        break;
      
      case 'service-cabinetry':
        userMessage.text = "Tell me about custom cabinetry";
        botResponse = {
          text: "Our custom cabinetry solutions are built to your exact specifications with premium materials and expert craftsmanship. We design and install cabinetry for kitchens, bathrooms, offices, media rooms, and more with a focus on both beauty and functionality. Each project includes detailed design consultation, precision measurements, and professional installation.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Cabinetry Gallery", action: "/portfolio?category=cabinetry" },
            { text: "Design Process", action: "question-design-help" },
            { text: "Get a Free Estimate", action: "/free-estimate?initialService=cabinetry" }
          ]
        };
        break;
      
      case 'service-additions':
        userMessage.text = "Tell me about home additions";
        botResponse = {
          text: "Our home addition services include room additions, second stories, garage conversions, and expanding existing spaces. We handle everything from design and permits to construction and finishing, ensuring a seamless integration with your existing structure. Our comprehensive approach covers architectural design, engineering, permitting, and complete construction.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Additions Gallery", action: "/portfolio?category=additions" },
            { text: "Design Process", action: "question-design-help" },
            { text: "Get a Free Estimate", action: "/free-estimate?service=addition" }
          ]
        };
        break;
        
      case 'services-residential':
        userMessage.text = "Tell me about your residential services";
        botResponse = {
          text: "Our residential services cover a full spectrum of home improvement projects including kitchen and bathroom remodeling, home additions, basement finishing, custom cabinetry, flooring installation, and interior/exterior renovations. We work with all types of homes from single-family houses to condos and townhomes, with solutions tailored to your specific property.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Kitchen Remodeling", action: "service-kitchen" },
            { text: "Bathroom Renovations", action: "service-bathroom" },
            { text: "Home Additions", action: "service-additions" },
            { text: "Get a Free Estimate", action: "/free-estimate?type=residential" }
          ]
        };
        break;
      
      case 'services-commercial':
        userMessage.text = "Tell me about your commercial services";
        botResponse = {
          text: "Our commercial construction services include office renovations, retail fit-outs, restaurant builds, healthcare facilities, and industrial solutions. We understand the unique requirements of commercial spaces, including code compliance, durability, accessibility, and minimizing business disruption during construction. Our team can work within your business schedule, including after-hours and weekend work.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Commercial Gallery", action: "/portfolio?category=commercial" },
            { text: "Commercial Process", action: "question-commercial-process" },
            { text: "Get a Commercial Estimate", action: "/free-estimate?type=commercial" }
          ]
        };
        break;

      case 'question-commercial-process':
        userMessage.text = "What's your commercial construction process?";
        botResponse = {
          text: "Our commercial construction process focuses on efficiency, quality, and minimizing business disruption. It includes: 1) Initial consultation and needs assessment, 2) Design and space planning, 3) Budget development and value engineering, 4) Permitting and code compliance, 5) Construction with dedicated project management, and 6) Final inspection and handover. We emphasize clear communication throughout each phase.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Commercial Services", action: "services-commercial" },
            { text: "Request a Consultation", action: "/free-estimate?type=commercial" }
          ]
        };
        break;
    
      // Continue with all the other existing cases...
      default:
        // For any unknown action or URL links, we need to create a sensible user message
        if (action.startsWith('/')) {
          // For website navigation
          userMessage.text = "I'd like to view more information on your website";
          window.location.href = action;
          return;
        } 
        else if (action.startsWith('tel:')) {
          // For phone calls
          userMessage.text = "I'd like to call your team";
          window.location.href = action;
          return;
        } 
        else if (action.startsWith('mailto:')) {
          // For emails
          userMessage.text = "I'd like to email your team";
          window.location.href = action;
          return;
        }
        // If we still don't have a user message, use the action as a fallback but make it more presentable
        if (!userMessage.text) {
          userMessage.text = action.replace(/-/g, ' ').replace(/^./, str => str.toUpperCase());
        }
        
        botResponse = {
          text: "I'm sorry, I don't have specific information about that. Would you like to speak with a team member who can help?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Contact Team Member", action: "speak" },
            { text: "Ask Another Question", action: "question" }
          ]
        };
    }
    
    // Add user message
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate typing delay then add bot response
    setIsTyping(true);
    setTimeout(() => {
      if (botResponse) {
        setMessages(prev => [...prev, botResponse!]);
      }
      setIsTyping(false);
    }, 1000);
  };

  // Modify handleSubmit to incorporate conversation memory
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { 
      text: message, 
      isUser: true,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Process message and determine response
    setIsTyping(true);
    
    // Simple keyword matching for better responses
    const lowerMsg = message.toLowerCase();
    // Initialize botResponse with a default value to avoid "used before being assigned" error
    let botResponse: ChatMessage = {
      text: "I'm processing your request...",
      isUser: false,
      timestamp: Date.now()
    };
    
    // Get property or building type context to personalize responses
    const currentPropertyType = propertyType?.name || null;
    const currentBuildingType = buildingType?.name || null;
    const typeContext = currentPropertyType || currentBuildingType;
    
    // Check if the user is referring to a previous topic in conversation memory
    const isReferringToPreviousTopic = conversationMemory.topics.some(topic => 
      lowerMsg.includes(topic) || 
      (lowerMsg.includes('it') && conversationMemory.lastQuestionAnswered?.toLowerCase().includes(topic))
    );

    // Check if user is asking "what about X" style follow-up questions
    const isFollowUpQuestion = lowerMsg.startsWith('what about') || 
                              lowerMsg.startsWith('how about') || 
                              lowerMsg === 'what else' || 
                              lowerMsg === 'tell me more';

    // Check if the message indicates frustration
    const isUserFrustrated = conversationMemory.sentimentScore < -0.5 || 
                            negativeKeywords.some(keyword => lowerMsg.includes(keyword));

    // If user seems frustrated, prioritize connecting them with a team member
    if (isUserFrustrated) {
      botResponse = {
        text: "I notice you may be having some trouble. I'd be happy to connect you with a team member who can assist you directly. Would that be helpful?",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Yes, connect me with someone", action: "speak" },
          { text: "No, I'll continue here", action: "continue-chat" }
        ]
      };
    }
    // Handle follow-up questions by connecting to previous topics
    else if (isFollowUpQuestion && conversationMemory.lastQuestionAnswered) {
      // Check what the previous question was about
      const prevQuestion = conversationMemory.lastQuestionAnswered.toLowerCase();
      
      if (prevQuestion.includes('kitchen')) {
        botResponse = {
          text: "Regarding kitchens, we also offer custom cabinet solutions, premium countertop installations, backsplash design, and energy-efficient appliance installation. Each kitchen is designed to your specific needs and style preferences.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Kitchen Gallery", action: "/portfolio?category=kitchen" },
            { text: "Kitchen Pricing", action: "kitchen-pricing" }
          ]
        };
      } 
      else if (prevQuestion.includes('bathroom')) {
        botResponse = {
          text: "For bathrooms, we also offer modern shower enclosures, luxury fixtures, heated flooring, accessibility modifications, and water-efficient solutions. Our designers can help you create a spa-like retreat.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Bathroom Gallery", action: "/portfolio?category=bathroom" },
            { text: "Bathroom Pricing", action: "bathroom-pricing" }
          ]
        };
      }
      else if (prevQuestion.includes('cost') || prevQuestion.includes('price')) {
        botResponse = {
          text: "Our pricing is customized to each project. In addition to the base costs, factors that affect pricing include material quality, structural changes, custom features, and fixtures. We'd be happy to provide a detailed estimate for your specific project.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Get Custom Quote", action: "/free-estimate" },
            { text: "Financing Options", action: "financing-info" }
          ]
        };
      }
      else {
        // Generic follow-up response if we can't determine the context
        botResponse = {
          text: "I'd be happy to provide more information. To help me give you the most relevant details, could you specify what aspect you'd like to know more about?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: getSuggestedQuestions().map(q => ({ text: q, action: `question-${q.toLowerCase().replace(/[^a-z0-9]/g, '-')}` }))
        };
      }
    }
    // First check for specific keywords we have explicit handling for
    else if (lowerMsg.includes('estimate') || lowerMsg.includes('quote')) {
      // Existing code for estimate responses
      botResponse = {
        text: typeContext 
          ? `We'd be happy to provide you with a free estimate for your ${typeContext} project.` 
          : "We'd be happy to provide you with a free estimate for your project.",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { 
            text: typeContext && (currentBuildingType || lowerMsg.includes('commercial'))
              ? "Commercial Estimate"
              : typeContext && currentPropertyType
                ? `${currentPropertyType} Estimate`
                : "Residential Estimate", 
            action: currentBuildingType || lowerMsg.includes('commercial')
              ? "commercial-estimate" 
              : "residential-estimate" 
          },
          { 
            text: currentBuildingType 
              ? "Different Building Type" 
              : currentPropertyType 
                ? "Different Property Type"
                : "Commercial Estimate", 
            action: currentBuildingType 
              ? "/commercial" 
              : currentPropertyType 
                ? "/residential"
                : "commercial-estimate" 
          }
        ]
      };
    }
    else if (lowerMsg.includes('cost') || lowerMsg.includes('price') || lowerMsg.includes('pricing')) {
      // Existing code for pricing responses
      if (lowerMsg.includes('kitchen') || lowerMsg.includes('bathroom') || lowerMsg.includes('remodel')) {
        const roomType = lowerMsg.includes('kitchen') ? 'kitchen' : 'bathroom';
        
        // Tailor response based on property type if selected
        if (currentPropertyType && roomType === 'kitchen') {
          let priceRange = "$30,000 - $65,000";
          
          if (currentPropertyType.includes('Single-Family')) {
            priceRange = "$35,000 - $75,000";
          } else if (currentPropertyType.includes('Townhouse')) {
            priceRange = "$28,000 - $60,000";
          } else if (currentPropertyType.includes('Condo')) {
            priceRange = "$25,000 - $55,000";
          } else if (currentPropertyType.includes('Multi-Family')) {
            priceRange = "$30,000 - $65,000 per unit";
          }
          
          botResponse = {
            text: `For ${currentPropertyType} properties, kitchen remodeling typically ranges from ${priceRange}, depending on the scope and materials selected. Would you like a personalized estimate?`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Get Free Estimate", action: "/free-estimate?initialService=kitchen" },
              { text: "Learn About Kitchen Remodeling", action: "/services/kitchen-remodeling" }
            ]
          };
        } 
        else if (currentPropertyType && roomType === 'bathroom') {
          let priceRange = "$22,000 - $45,000";
          
          if (currentPropertyType.includes('Single-Family')) {
            priceRange = "$25,000 - $50,000";
          } else if (currentPropertyType.includes('Townhouse')) {
            priceRange = "$20,000 - $45,000";
          } else if (currentPropertyType.includes('Condo')) {
            priceRange = "$18,000 - $40,000";
          } else if (currentPropertyType.includes('Multi-Family')) {
            priceRange = "$20,000 - $45,000 per unit";
          }
          
          botResponse = {
            text: `For ${currentPropertyType} properties, bathroom remodeling typically ranges from ${priceRange}, depending on the scope and materials selected. Would you like a personalized estimate?`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Get Free Estimate", action: "/free-estimate?initialService=bathroom" },
              { text: "Learn About Bathroom Remodeling", action: "/services/bathroom-remodeling" }
            ]
          };
        }
        else {
          botResponse = {
            text: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} remodeling costs vary based on the scope of work, materials selected, and your specific property type. For a personalized estimate, I'd recommend:`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Get Free Estimate", action: `/free-estimate?initialService=${roomType}` },
              { text: "Learn About Pricing", action: `/services/${roomType}-remodeling` }
            ]
          };
        }
      } else {
        botResponse = {
          text: "Our pricing varies based on the specific service, the scope of work, and your property type. Would you like a free estimate for your project?",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Get Free Estimate", action: "/free-estimate" },
            { text: "View Services", action: typeContext && currentBuildingType ? "/commercial" : "/residential" }
          ]
        };
      }
    }
    // Modify property-specific responses
    else if (lowerMsg.includes('property') || lowerMsg.includes('home') || lowerMsg.includes('house') || lowerMsg.includes('building')) {
      if (typeContext) {
        botResponse = {
          text: `I see you're interested in services for a ${typeContext}. We offer specialized solutions for this property type. What specific service are you looking for?`,
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { 
              text: currentBuildingType ? "Commercial Services" : "Residential Services", 
              action: currentBuildingType ? "/commercial" : "/residential" 
            },
            { text: "Get Free Estimate", action: "/free-estimate" }
          ]
        };
      } else {
        botResponse = {
          text: "We offer services for various property types. You can select your property type to get more tailored information about our services.",
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: [
            { text: "Residential Properties", action: "/residential" },
            { text: "Commercial Buildings", action: "/commercial" }
          ]
        };
      }
    }
    // Other existing responses
    else if (lowerMsg.includes('timeline') || lowerMsg.includes('how long') || lowerMsg.includes('time frame')) {
      botResponse = {
        text: "Project timelines vary based on scope and complexity. Kitchen renovations typically take 3-6 weeks, bathrooms 2-4 weeks, and larger projects like additions can take 2-3 months. We provide specific timelines during the estimation process.",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Discuss My Project Timeline", action: "speak" }
        ]
      };
    }
    else if (lowerMsg.includes('warranty') || lowerMsg.includes('guarantee')) {
      botResponse = {
        text: "We stand behind our work with a comprehensive warranty. All labor is covered for 2 years, and materials typically carry manufacturer warranties of 1-25+ years depending on the product.",
        isUser: false,
        timestamp: Date.now()
      };
    }
    else if (lowerMsg.includes('area') || lowerMsg.includes('location') || lowerMsg.includes('serve')) {
      botResponse = {
        text: "We serve the greater Atlanta metropolitan area, including Fulton, DeKalb, Cobb, Gwinnett, and Clayton counties. For larger projects, we may extend our service area.",
        isUser: false,
        timestamp: Date.now()
      };
    }
    else if (lowerMsg.includes('contact') || lowerMsg.includes('speak') || lowerMsg.includes('talk') || lowerMsg.includes('call')) {
      botResponse = {
        text: "You can reach our team through any of these options:",
        isUser: false,
        timestamp: Date.now(),
        type: 'contact',
        options: [
          { text: "Call: 404-934-9458", action: "tel:404-934-9458" },
          { text: "Email: sustenablet@gmail.com", action: "mailto:sustenablet@gmail.com" },
          { text: "Contact Form", action: "/contact" }
        ]
      };
    }
    else if (lowerMsg.includes('thank')) {
      botResponse = {
        text: "You're welcome! Is there anything else I can help you with today?",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Explore Services", action: "services" },
          { text: "Get Estimate", action: "estimate" },
          { text: "No, that's all", action: "end-chat" }
        ]
      };
    }
    else if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg === 'end' || lowerMsg === 'quit' || lowerMsg === 'close' || lowerMsg.includes('end chat')) {
      botResponse = {
        text: "Thank you for chatting with us today! Before you go, we'd love to hear your feedback.",
        isUser: false,
        timestamp: Date.now()
      };
      
      // Show end chat feedback instead of closing immediately
      setTimeout(() => {
        setShowEndChatFeedback(true);
      }, 1000);
    }
    else {
      // ENHANCED KNOWLEDGE BASE MATCHING: Advanced matching algorithm for more natural conversation
      let matchFound = false;
      let bestEntry = null;
      let bestMatchScore = 0;
      
      // Preprocess the message to remove filler words for better matching
      const cleanedMsg = lowerMsg
        .replace(/can you tell me about|i'd like to know|could you explain|what about|how about|tell me about|i want to know about/g, '')
        .replace(/please|thanks|thank you|hi|hello|hey|excuse me|um|uh|er|like/g, '')
        .trim();
      
      // Extract key terms for better intent matching
      const msgWords = cleanedMsg.split(/\s+/).filter(word => word.length > 2);
      
      // Loop through knowledge base entries to find the best match with weighted scoring
      for (const entry of knowledgeBase) {
        // Reset scores for this entry
        let entryScore = 0;
        let hasMatch = false;
        
        // Check patterns against the message with weighted scoring
        for (const pattern of entry.patterns) {
          const patternLower = pattern.toLowerCase();
          
          // Exact pattern match (highest score)
          if (lowerMsg.includes(patternLower)) {
            // Weight by pattern length - longer patterns are more specific
            const patternWeight = Math.min(1, patternLower.length / 20); // Cap at 1 for very long patterns
            entryScore += 2 * patternWeight;
            hasMatch = true;
          }
          // Pattern match in cleaned message
          else if (cleanedMsg.includes(patternLower)) {
            entryScore += 1.5;
            hasMatch = true;
          }
          // Word-level matching (partial match)
          else {
            const patternWords = patternLower.split(/\s+/);
            const matchingWords = patternWords.filter(pWord => 
              msgWords.includes(pWord) || 
              msgWords.some(mWord => mWord.includes(pWord) && pWord.length > 3)
            );
            
            // Score based on percentage of matching words
            if (matchingWords.length > 0) {
              const wordMatchScore = (matchingWords.length / patternWords.length) * 
                                    (matchingWords.length / msgWords.length);
              
              // Add bonus for consecutive word matches (phrases)
              let consecutiveBonus = 0;
              for (let i = 0; i < patternWords.length - 1; i++) {
                const patternPair = patternWords[i] + ' ' + patternWords[i+1];
                if (cleanedMsg.includes(patternPair)) {
                  consecutiveBonus += 0.2;
                }
              }
              
              entryScore += wordMatchScore + consecutiveBonus;
              
              if (wordMatchScore > 0.3) { // Threshold for considering it a match
                hasMatch = true;
              }
            }
          }
        }
        
        // If this entry has matches and a better score than what we've found so far
        if (hasMatch && entryScore > bestMatchScore) {
          bestMatchScore = entryScore;
          bestEntry = entry;
          matchFound = true;
        }
      }
      
      // If we found a matching entry in the knowledge base
      if (matchFound && bestEntry) {
        // Determine appropriate action buttons based on the content of the response
        const responseText = bestEntry.response.toLowerCase();
        
        // Default options
        let options = [
          { text: "Get a Free Estimate", action: "estimate" }
        ];
        
        // Add context-specific option based on the response content
        if (responseText.includes('kitchen')) {
          options.unshift({ text: "Kitchen Services", action: "service-kitchen" });
        } else if (responseText.includes('bathroom')) {
          options.unshift({ text: "Bathroom Services", action: "service-bathroom" });
        } else if (responseText.includes('floor')) {
          options.unshift({ text: "Flooring Services", action: "service-flooring" });
        } else if (responseText.includes('cabinet')) {
          options.unshift({ text: "Cabinetry Services", action: "service-cabinetry" });
        } else if (responseText.includes('commercial')) {
          options.unshift({ text: "Commercial Services", action: "services-commercial" });
        } else if (responseText.includes('loan') || responseText.includes('financ') || responseText.includes('payment')) {
          options.unshift({ text: "Financing Options", action: "financing-info" });
        } else if (responseText.includes('renovation') || responseText.includes('remodel')) {
          options.unshift({ text: "View Services", action: "services" });
        } else if (responseText.includes('schedule') || responseText.includes('consult')) {
          options.unshift({ text: "Contact Us", action: "speak" });
        } else {
          options.unshift({ text: "Learn More", action: "services" });
        }
        
        botResponse = {
          text: bestEntry.response,
          isUser: false,
          timestamp: Date.now(),
          type: 'option',
          options: options
        };
      }
      // If no match in knowledge base, provide specialized response based on context
      else {
        // Get suggestions based on current page
        const suggestions = getSuggestedQuestions();
        
        // Check keywords in the query to determine the most likely topic
        const kitchenKeywords = ['kitchen', 'cabinets', 'countertop', 'appliance', 'cooktop', 'sink', 'range', 'oven'];
        const bathroomKeywords = ['bathroom', 'shower', 'tub', 'toilet', 'vanity', 'bath', 'tile'];
        const flooringKeywords = ['floor', 'hardwood', 'tile', 'carpet', 'vinyl', 'laminate'];
        const exteriorKeywords = ['exterior', 'siding', 'roof', 'outdoor', 'deck', 'patio', 'landscape'];
        const pricingKeywords = ['cost', 'price', 'quote', 'budget', 'expensive', 'affordable', 'financing'];
        const timelineKeywords = ['time', 'schedule', 'when', 'long', 'fast', 'quick', 'duration', 'finish'];
        const basementKeywords = ['basement', 'lower level', 'downstairs', 'cellar', 'foundation'];
        const additionKeywords = ['addition', 'expand', 'extension', 'add on', 'extra room', 'more space'];
        const permitKeywords = ['permit', 'code', 'inspection', 'legal', 'approval', 'regulation', 'requirements'];
        const materialKeywords = ['material', 'brand', 'product', 'manufacturer', 'supplier', 'quality'];
        const warrantyKeywords = ['warranty', 'guarantee', 'coverage', 'repair', 'fix', 'maintain', 'maintenance'];
        const customKeywords = ['custom', 'unique', 'special', 'specific', 'personalized', 'bespoke', 'one of a kind', 'unusual'];
        
        // Additional specialized keyword groups for more specific fallbacks
        const accessibilityKeywords = ['accessibility', 'accessible', 'wheelchair', 'handicap', 'aging in place', 'disability', 'ADA', 'mobility', 'walker', 'grab bars'];
        const sustainabilityKeywords = ['eco-friendly', 'sustainable', 'green', 'energy efficient', 'solar', 'environmentally', 'natural', 'recycled', 'renewable', 'low VOC', 'energy star'];
        const designStyleKeywords = ['modern', 'contemporary', 'traditional', 'farmhouse', 'industrial', 'rustic', 'minimalist', 'transitional', 'colonial', 'mid-century', 'craftsman', 'spanish', 'mediterranean'];
        const livingSpaceKeywords = ['living room', 'family room', 'dining room', 'home office', 'study', 'bedroom', 'master bedroom', 'closet', 'laundry room', 'mud room', 'foyer', 'entryway', 'hallway'];
        const specialtyRoomKeywords = ['home theater', 'media room', 'gym', 'fitness', 'wine cellar', 'sauna', 'steam room', 'library', 'game room', 'hobby room', 'craft room', 'sunroom', 'conservatory'];
        const problemKeywords = ['water damage', 'mold', 'leak', 'cracked', 'foundation issues', 'structural', 'settling', 'termite', 'pest', 'rot', 'damage', 'repair'];
        const concernKeywords = ['dust', 'noise', 'disruption', 'living during', 'move out', 'timeline', 'delay', 'unexpected', 'surprise', 'mess', 'clean', 'stay in home'];
        const insuranceKeywords = ['insurance', 'claim', 'coverage', 'adjuster', 'policy', 'deductible', 'damage claim', 'covered', 'documentation', 'restoration'];
        
        // Commercial-specific keyword groups
        const retailKeywords = ['retail', 'store', 'shop', 'boutique', 'showroom', 'mall', 'display', 'storefront', 'merchandising', 'point of sale', 'customer experience'];
        const officeKeywords = ['office', 'workspace', 'corporate', 'cubicle', 'workstation', 'conference room', 'meeting room', 'reception', 'lobby', 'executive'];
        const hospitalityKeywords = ['restaurant', 'cafe', 'hotel', 'bar', 'dining', 'seating', 'kitchen', 'guest room', 'hospitality', 'food service', 'franchise'];
        const medicalKeywords = ['medical', 'healthcare', 'doctor', 'dental', 'clinic', 'hospital', 'exam room', 'waiting room', 'laboratory', 'patient', 'physician', 'treatment room'];
        
        // Additional specialized categories
        const historicKeywords = ['historic', 'historical', 'preservation', 'restore', 'original', 'antique', 'vintage', 'period', 'heritage', 'classic', 'traditional', 'century', 'old house'];
        const luxuryKeywords = ['luxury', 'high-end', 'premium', 'upscale', 'custom', 'bespoke', 'exclusive', 'elite', 'top-tier', 'finest', 'exquisite', 'sophisticated'];
        const ageOfHomeKeywords = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', 'victorian', 'craftsman', 'mid-century', 'century', 'decade', 'year old'];
        const localKeywords = ['atlanta', 'buckhead', 'midtown', 'decatur', 'sandy springs', 'dunwoody', 'roswell', 'vinings', 'alpharetta', 'marietta', 'smyrna', 'brookhaven'];
        
        // New keyword groups for additional specialized fallbacks
        const renovationScopeKeywords = ['whole house', 'full home', 'complete renovation', 'gut renovation', 'down to studs', 'major renovation', 'extensive remodel', 'total makeover'];
        const smartHomeKeywords = ['smart home', 'automation', 'connected', 'iot', 'alexa', 'google home', 'apple homekit', 'voice control', 'automated', 'remote control', 'smart lighting', 'smart thermostat'];
        const architecturalKeywords = ['architectural style', 'floor plan', 'layout', 'structural', 'load bearing', 'open concept', 'open floor plan', 'blueprint', 'drawings', 'plans', 'architect', 'design plans'];
        const permitProcessKeywords = ['permit process', 'permit application', 'building department', 'inspection process', 'code inspector', 'city approval', 'county permits', 'zoning approval', 'variance'];
        const outdoorLivingKeywords = ['outdoor kitchen', 'outdoor living', 'patio', 'pergola', 'gazebo', 'fire pit', 'outdoor fireplace', 'screened porch', 'pool house', 'lanai', 'outdoor shower', 'outdoor entertainment'];
        const seasonalKeywords = ['seasonal', 'winter project', 'summer renovation', 'spring remodel', 'fall construction', 'holiday completion', 'seasonal pricing', 'off-season', 'peak season'];
        const contractTypeKeywords = ['contract type', 'fixed price', 'cost plus', 'time and materials', 'change order', 'allowance', 'contingency', 'contract terms', 'payment schedule', 'milestone payments'];
        
        // Check if we're on the commercial page or if the query contains commercial keywords
        if (pageContext === 'commercial' || lowerMsg.includes('commercial') || lowerMsg.includes('business') || 
            lowerMsg.includes('office') || lowerMsg.includes('retail') || lowerMsg.includes('restaurant')) {
          botResponse = {
            text: "I don't have specific details about this aspect of our commercial services. Our commercial team specializes in tailored solutions based on your business's unique requirements. Would you like to connect with a commercial specialist?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Contact a Commercial Specialist", action: "contact-commercial-specialist" },
              { text: "Browse Commercial Services", action: "/commercial" },
              { text: "Ask About Something Else", action: "question" }
            ]
          };
        }
        // Kitchen-related fallback
        else if (kitchenKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of kitchen remodeling. Kitchen projects are highly personalized, and our design team would love to discuss your specific vision and requirements in detail. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "See Kitchen Portfolio", action: "/portfolio?category=kitchen" },
              { text: "Schedule Kitchen Consultation", action: "/free-estimate?initialService=kitchen" },
              { text: "Call Kitchen Specialist", action: "tel:404-934-9458" }
            ]
          };
        }
        // Bathroom-related fallback
        else if (bathroomKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific details about that bathroom feature. Our bathroom specialists can provide custom solutions based on your space, style preferences, and functional needs. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Bathroom Gallery", action: "/portfolio?category=bathroom" },
              { text: "Schedule Bathroom Consultation", action: "/free-estimate?initialService=bathroom" },
              { text: "Learn About Our Process", action: "question-process" }
            ]
          };
        }
        // Flooring-related fallback
        else if (flooringKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that flooring option. We offer a wide range of flooring solutions, each with distinct characteristics, durability factors, and price points. Our flooring specialists can provide detailed guidance based on your specific needs. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Browse Flooring Projects", action: "/portfolio?category=flooring" },
              { text: "Schedule Flooring Consultation", action: "/free-estimate?initialService=flooring" },
              { text: "Discuss with Flooring Expert", action: "speak" }
            ]
          };
        }
        // Exterior/outdoor-related fallback
        else if (exteriorKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific details about that exterior feature. Our team creates custom outdoor solutions designed for Atlanta's climate and your specific property. Would you like to discuss your outdoor project needs with a specialist?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "See Exterior Projects", action: "/portfolio?category=exterior" },
              { text: "Schedule Outdoor Consultation", action: "/free-estimate?initialService=exterior" },
              { text: "Speak with Design Team", action: "speak" }
            ]
          };
        }
        // Pricing-related fallback
        else if (pricingKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific pricing information for that. Costs vary based on project scope, material selections, structural requirements, and other factors unique to your home. Our estimating team can provide a detailed quote tailored to your specific project. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Request Custom Quote", action: "/free-estimate" },
              { text: "Discuss Financing Options", action: "financing-info" },
              { text: "Talk with Estimator", action: "speak" }
            ]
          };
        }
        // Timeline-related fallback
        else if (timelineKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific timeline information for that type of project. Schedules vary based on scope, material lead times, permit processing, and other factors. Our project managers develop detailed timelines tailored to each project. Would you like to discuss potential scheduling for your project?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Planning Consultation", action: "/free-estimate" },
              { text: "Learn About Our Process", action: "question-process" },
              { text: "Speak with Project Manager", action: "speak" }
            ]
          };
        }
        // Basement-related fallback
        else if (basementKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of basement finishing. Basement projects involve unique considerations including moisture control, egress requirements, and mechanical system integration. Our basement specialists can provide tailored solutions for your specific space. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Basement Projects", action: "/portfolio?category=basement" },
              { text: "Schedule Basement Consultation", action: "/free-estimate?initialService=basement" },
              { text: "Learn About Basement Options", action: "service-basement" }
            ]
          };
        }
        // Addition-related fallback
        else if (additionKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific details about that aspect of home additions. Adding space to your home involves structural, architectural, and permitting considerations unique to your property. Our additions team can provide custom solutions based on your specific needs. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Addition Projects", action: "/portfolio?category=additions" },
              { text: "Schedule Addition Consultation", action: "/free-estimate?initialService=addition" },
              { text: "Speak with Design Team", action: "speak" }
            ]
          };
        }
        // Permit/code-related fallback
        else if (permitKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about permit requirements for that project type. Building codes and permit processes vary by jurisdiction in the Atlanta area. Our team manages all permitting aspects of your project, including documentation, submissions, and inspections. Would you like to discuss the specific requirements for your area?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Learn About Our Process", action: "question-process" },
              { text: "Schedule Project Consultation", action: "/free-estimate" },
              { text: "Speak with Permit Specialist", action: "speak" }
            ]
          };
        }
        // Materials-related fallback
        else if (materialKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that material or product. We work with a wide range of quality suppliers and manufacturers to provide options at various price points and aesthetic styles. Our design team can help you select the perfect materials for your project based on your preferences and requirements. Would you like to:",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Design Consultation", action: "/free-estimate" },
              { text: "View Our Portfolio", action: "/portfolio" },
              { text: "Speak with Designer", action: "speak" }
            ]
          };
        }
        // Warranty/maintenance-related fallback
        else if (warrantyKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific details about warranty coverage or maintenance for that particular item. Our work is backed by a comprehensive 2-year labor warranty, with manufacturer warranties for products varying from 1-25+ years depending on the specific item. For precise warranty information or maintenance guidance, our customer care team would be happy to assist you.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Contact Customer Care", action: "speak" },
              { text: "Learn About Our Quality Standards", action: "/about" },
              { text: "Request Warranty Information", action: "mailto:warranty@arxenconstruction.com" }
            ]
          };
        }
        // Custom feature-related fallback
        else if (customKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that custom feature. One of the advantages of working with Arxen is our ability to create completely customized solutions tailored to your unique needs and preferences. Our design team would love to discuss your specific ideas and how we can bring them to life.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Design Consultation", action: "/free-estimate" },
              { text: "View Custom Projects", action: "/portfolio" },
              { text: "Speak with Custom Design Specialist", action: "speak" }
            ]
          };
        }
        // Accessibility/aging in place fallback
        else if (accessibilityKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific details about that accessibility feature. Arxen specializes in creating accessible living spaces that combine functionality with beautiful design. Our accessibility specialists integrate features like zero-threshold entries, curbless showers, proper clearances, grab bars, and other elements that enhance safety and independence while maintaining aesthetic appeal. Would you like to discuss your specific accessibility needs?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Accessibility Consultation", action: "/free-estimate?focus=accessibility" },
              { text: "View Accessible Projects", action: "/portfolio?category=accessibility" },
              { text: "Speak with Accessibility Specialist", action: "speak" }
            ]
          };
        }
        // Sustainability/eco-friendly fallback
        else if (sustainabilityKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that sustainable building practice. Arxen is committed to environmentally responsible construction, integrating energy-efficient systems, sustainable materials, water conservation features, and waste reduction strategies into our projects. Our sustainability team can provide detailed guidance on green building options tailored to your project and budget. Would you like to learn more?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Green Building Consultation", action: "/free-estimate?focus=sustainability" },
              { text: "View Sustainable Projects", action: "/portfolio?category=green" },
              { text: "Learn About Our Green Practices", action: "/about#sustainability" }
            ]
          };
        }
        // Design style fallback
        else if (designStyleKeywords.some(keyword => lowerMsg.includes(keyword))) {
          const style = designStyleKeywords.find(keyword => lowerMsg.includes(keyword)) || "specific design style";
          botResponse = {
            text: `I don't have specific information about that aspect of ${style} design. Our design team has extensive experience creating spaces across various design styles, ensuring each project reflects both timeless principles and current trends. We would be happy to discuss how we can implement this style in your space while respecting your personal preferences and functional requirements.`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Design Consultation", action: "/free-estimate" },
              { text: "Browse Design Portfolio", action: "/portfolio" },
              { text: "Speak with Interior Designer", action: "speak" }
            ]
          };
        }
        // Living space fallback
        else if (livingSpaceKeywords.some(keyword => lowerMsg.includes(keyword))) {
          const space = livingSpaceKeywords.find(keyword => lowerMsg.includes(keyword)) || "living space";
          botResponse = {
            text: `I don't have specific information about that aspect of ${space} design or renovation. Each living space has unique requirements for functionality, flow, and aesthetics. Our design team specializes in transforming these essential areas to enhance both daily living and special occasions, with careful attention to your specific needs and preferences.`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Similar Projects", action: "/portfolio" },
              { text: "Schedule Design Consultation", action: "/free-estimate" },
              { text: "Speak with Design Team", action: "speak" }
            ]
          };
        }
        // Specialty room fallback
        else if (specialtyRoomKeywords.some(keyword => lowerMsg.includes(keyword))) {
          const room = specialtyRoomKeywords.find(keyword => lowerMsg.includes(keyword)) || "specialty space";
          botResponse = {
            text: `I don't have specific information about that aspect of ${room} design or construction. These specialty spaces require careful planning for both technical requirements and aesthetic considerations. Our team creates these tailored environments with solutions customized to your specific needs, preferences, and space constraints.`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Specialty Room Projects", action: "/portfolio?category=specialty" },
              { text: "Discuss Your Specialty Space", action: "/free-estimate" },
              { text: "Speak with Specialty Room Expert", action: "speak" }
            ]
          };
        }
        // Problem/repair fallback
        else if (problemKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about addressing that issue. Problems like this require professional assessment to determine the underlying cause and appropriate remediation strategy. Our experienced team can evaluate the situation, identify the source of the issue, and develop a comprehensive plan to not only repair the damage but also prevent future problems. Would you like to schedule an assessment?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Assessment", action: "/free-estimate?focus=repair" },
              { text: "Emergency Services", action: "tel:404-934-9458" },
              { text: "Speak with Restoration Specialist", action: "speak" }
            ]
          };
        }
        // Living concerns fallback
        else if (concernKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about managing that aspect of the renovation process. We understand that construction projects impact your daily life, and our team implements detailed protocols to minimize disruption. This includes containment systems, daily cleanup, specific work hours, phased approaches, and clear communication throughout. Our project managers would be happy to discuss specific strategies for your situation.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Learn About Our Process", action: "question-process" },
              { text: "Discuss Project Planning", action: "/free-estimate" },
              { text: "Speak with Project Manager", action: "speak" }
            ]
          };
        }
        // Insurance-related fallback
        else if (insuranceKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about insurance claims for that situation. Our team has extensive experience working with insurance companies on restoration and repair projects. We can help navigate the claims process, provide detailed documentation, work directly with adjusters, and ensure quality restoration that meets both insurance requirements and your expectations. Would you like to speak with our insurance claims specialist?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Insurance Claim Process", action: "question-insurance-process" },
              { text: "Schedule Insurance Consultation", action: "/free-estimate?focus=insurance" },
              { text: "Speak with Claims Specialist", action: "speak" }
            ]
          };
        }
        // Retail-specific fallback
        else if (retailKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of retail construction. Retail spaces require specialized knowledge regarding customer flow, merchandising visibility, brand expression, durability for high-traffic areas, and code compliance specific to public spaces. Our commercial team specializes in creating retail environments that enhance both customer experience and operational efficiency. Would you like to discuss your retail project with a specialist?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Retail Projects", action: "/portfolio?category=retail" },
              { text: "Schedule Retail Consultation", action: "/free-estimate?type=commercial&focus=retail" },
              { text: "Speak with Retail Specialist", action: "speak" }
            ]
          };
        }
        // Office-specific fallback
        else if (officeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of office construction or renovation. Office environments require careful planning for workplace efficiency, technology integration, acoustics, lighting, and employee comfort. Our commercial team has extensive experience creating productive workspaces across various industries and company cultures. Would you like to discuss your office project with a specialist?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Office Projects", action: "/portfolio?category=office" },
              { text: "Schedule Office Consultation", action: "/free-estimate?type=commercial&focus=office" },
              { text: "Speak with Commercial Team", action: "speak" }
            ]
          };
        }
        // Hospitality-specific fallback
        else if (hospitalityKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of hospitality construction. Restaurant, bar, and hotel projects involve specialized knowledge of health department requirements, commercial kitchen specifications, seating efficiency, guest experience design, and durability for high-traffic environments. Our hospitality construction team would be happy to discuss your specific project requirements.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Hospitality Projects", action: "/portfolio?category=hospitality" },
              { text: "Schedule Hospitality Consultation", action: "/free-estimate?type=commercial&focus=hospitality" },
              { text: "Speak with Hospitality Specialist", action: "speak" }
            ]
          };
        }
        // Medical facility fallback
        else if (medicalKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of medical facility construction. Healthcare environments require specialized knowledge of medical code compliance, infection control protocols, patient flow optimization, specialized equipment integration, and durability for intensive cleaning protocols. Our healthcare construction team would be happy to discuss your specific medical facility requirements.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Healthcare Projects", action: "/portfolio?category=healthcare" },
              { text: "Schedule Healthcare Consultation", action: "/free-estimate?type=commercial&focus=healthcare" },
              { text: "Speak with Healthcare Specialist", action: "speak" }
            ]
          };
        }
        // Historic home fallback
        else if (historicKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of historic renovation. Historic properties require specialized knowledge of period-appropriate materials, preservation techniques, and often approval from historical societies or commissions. Our historic renovation team balances authentic restoration with modern functionality, navigating the unique challenges these special properties present. Would you like to discuss your historic home project?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Historic Renovations", action: "/portfolio?category=historic" },
              { text: "Schedule Historic Home Consultation", action: "/free-estimate?focus=historic" },
              { text: "Speak with Preservation Specialist", action: "speak" }
            ]
          };
        }
        // Luxury home fallback
        else if (luxuryKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that luxury feature. Our high-end residential division specializes in premium materials, custom craftsmanship, and exclusive design elements that create truly distinguished living environments. Our luxury project specialists can provide detailed guidance on premium options tailored to your specific aesthetic and lifestyle requirements.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Luxury Portfolio", action: "/portfolio?category=luxury" },
              { text: "Schedule Luxury Consultation", action: "/free-estimate?focus=luxury" },
              { text: "Speak with Luxury Specialist", action: "speak" }
            ]
          };
        }
        // Age of home fallback
        else if (ageOfHomeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          const era = ageOfHomeKeywords.find(keyword => lowerMsg.includes(keyword)) || "older";
          botResponse = {
            text: `I don't have specific information about renovating homes from that era. ${era} homes have unique characteristics that require specialized knowledge about construction methods, materials used during that period, and common issues that develop over time. Our team has extensive experience with homes of various ages and can provide tailored solutions that respect your home's character while improving its functionality and performance.`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Schedule Home Assessment", action: "/free-estimate" },
              { text: "View Similar Projects", action: "/portfolio" },
              { text: "Speak with Renovation Specialist", action: "speak" }
            ]
          };
        }
        // Local area fallback
        else if (localKeywords.some(keyword => lowerMsg.includes(keyword))) {
          const area = localKeywords.find(keyword => lowerMsg.includes(keyword)) || "Atlanta area";
          botResponse = {
            text: `I don't have specific information about projects in ${area}. Arxen Construction works throughout the greater Atlanta metropolitan area, including this neighborhood. Our team is familiar with local building codes, permit requirements, and architectural styles specific to this community. We'd be happy to discuss how we can help with your project in this area.`,
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Local Projects", action: "/portfolio" },
              { text: "Schedule Local Consultation", action: "/free-estimate" },
              { text: "Speak with Local Specialist", action: "speak" }
            ]
          };
        }
        // Full home renovation fallback
        else if (renovationScopeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of comprehensive home renovations. Full-home projects require detailed planning, phasing considerations, temporary living arrangements, and coordinated scheduling across multiple trades. Our renovation specialists can develop a tailored approach that minimizes disruption while transforming your entire home. Would you like to discuss whole-house renovation strategies?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Whole-House Projects", action: "/portfolio?category=whole-house" },
              { text: "Schedule Renovation Consultation", action: "/free-estimate?focus=whole-house" },
              { text: "Speak with Renovation Specialist", action: "speak" }
            ]
          };
        }
        // Smart home fallback
        else if (smartHomeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that smart home technology. While we don't sell or program smart home systems directly, we design and build with smart home integration in mind. Our team can create the proper infrastructure during construction (dedicated wiring, power considerations, appropriate locations for devices) and coordinate with specialized technology integrators for system implementation. Would you like to discuss smart home preparation in your project?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Smart Home Preparation Guide", action: "/resources/smart-home-guide" },
              { text: "Technology-Ready Renovation", action: "/free-estimate?focus=technology" },
              { text: "Speak with Tech Integration Specialist", action: "speak" }
            ]
          };
        }
        // Architectural design fallback
        else if (architecturalKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that architectural design element. Architectural considerations require balancing aesthetic goals, structural requirements, functional needs, and budget constraints. Our in-house design team works collaboratively with structural engineers when needed to develop comprehensive plans that address all these factors while reflecting your unique vision. Would you like to discuss your architectural design needs?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Architectural Projects", action: "/portfolio?category=architectural" },
              { text: "Schedule Design Consultation", action: "/free-estimate?focus=design" },
              { text: "Speak with Architectural Designer", action: "speak" }
            ]
          };
        }
        // Permit process fallback
        else if (permitProcessKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of the permitting process. Permitting varies significantly by jurisdiction in the Atlanta area, with each having unique documentation requirements, review processes, inspection schedules, and fee structures. Our permitting specialists handle this entire process, managing all paperwork, submissions, fee payments, inspection scheduling, and compliance verification to ensure your project proceeds legally and smoothly. Would you like more information about permits for your specific area?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Permit Process Overview", action: "/resources/permit-process" },
              { text: "Schedule Project Consultation", action: "/free-estimate" },
              { text: "Speak with Permit Specialist", action: "speak" }
            ]
          };
        }
        // Outdoor living fallback
        else if (outdoorLivingKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that outdoor living feature. Outdoor spaces in Atlanta require specialized knowledge of local climate conditions, appropriate materials for our humidity levels, proper drainage solutions, and sometimes zoning considerations for setbacks and coverage. Our outdoor living specialists can design custom solutions that extend your living space while addressing these technical considerations. Would you like to discuss your outdoor project ideas?",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "View Outdoor Living Projects", action: "/portfolio?category=outdoor" },
              { text: "Schedule Outdoor Consultation", action: "/free-estimate?focus=outdoor" },
              { text: "Speak with Outdoor Specialist", action: "speak" }
            ]
          };
        }
        // Seasonal considerations fallback
        else if (seasonalKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about seasonal timing for that project type. In Atlanta, timing considerations include summer heat impact on exterior work, spring rain delays for foundation projects, humidity concerns for interior finishes in summer, and occasional winter weather impacts. We build reasonable buffers into schedules for these factors while maximizing appropriate work during ideal conditions. Our project managers can discuss optimal timing for your specific project type and location.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Project Planning Timeline", action: "/resources/project-planning" },
              { text: "Schedule Timing Consultation", action: "/free-estimate" },
              { text: "Speak with Project Manager", action: "speak" }
            ]
          };
        }
        // Contract type fallback
        else if (contractTypeKeywords.some(keyword => lowerMsg.includes(keyword))) {
          botResponse = {
            text: "I don't have specific information about that aspect of construction contracts. We primarily use detailed fixed-price contracts that clearly specify all included work, materials, and associated costs. This approach provides price certainty while protecting you from unexpected expenses. Our contracts include transparent allowance schedules, clear change order procedures, milestone-based payment structures, and comprehensive warranty terms. Our project coordinators would be happy to explain our contracting approach in detail.",
            isUser: false,
            timestamp: Date.now(),
            type: 'option',
            options: [
              { text: "Contract Process Overview", action: "/resources/contract-guide" },
              { text: "Schedule Consultation", action: "/free-estimate" },
              { text: "Speak with Project Coordinator", action: "speak" }
            ]
          };
        }
        // Default fallback if no specific category is detected
        else {
          // Use page context to provide more relevant default fallback
          if (pageContext === 'kitchen') {
            botResponse = {
              text: "Thank you for your question about kitchen remodeling. While I don't have specific information about that particular aspect, our kitchen design specialists would be happy to provide a detailed answer tailored to your specific needs and preferences.",
              isUser: false,
              timestamp: Date.now(),
              type: 'option',
              options: [
                { text: "Kitchen Design Ideas", action: "/portfolio?category=kitchen" },
                { text: "Schedule Kitchen Consultation", action: "/free-estimate?initialService=kitchen" },
                { text: "Speak with Kitchen Specialist", action: "speak" }
              ]
            };
          } 
          else if (pageContext === 'bathroom') {
            botResponse = {
              text: "Thank you for your question about bathroom renovation. While I don't have specific information about that particular aspect, our bathroom specialists would be happy to provide a detailed answer tailored to your specific space and requirements.",
              isUser: false,
              timestamp: Date.now(),
              type: 'option',
              options: [
                { text: "Bathroom Design Ideas", action: "/portfolio?category=bathroom" },
                { text: "Schedule Bathroom Consultation", action: "/free-estimate?initialService=bathroom" },
                { text: "Speak with Bathroom Specialist", action: "speak" }
              ]
            };
          }
          else if (pageContext === 'portfolio') {
            botResponse = {
              text: "Thank you for your question about our previous work. While I don't have specific information about that particular project, our team would be happy to discuss similar projects and how we could create a custom solution for your needs.",
              isUser: false,
              timestamp: Date.now(),
              type: 'option',
              options: [
                { text: "Browse More Projects", action: "/portfolio" },
                { text: "Schedule a Consultation", action: "/free-estimate" },
                { text: "Speak with Design Team", action: "speak" }
              ]
            };
          }
          else {
            // Enhanced default fallback with conversation context awareness
            const messageCount = messages.filter(msg => msg.isUser).length;
            const recentMessages = messages.slice(-5).filter(msg => msg.isUser).map(msg => msg.text.toLowerCase());
            
            // Check if user seems frustrated (asking similar questions repeatedly)
            const userFrustration = conversationMemory.sentimentScore < -0.2 || 
              (messageCount > 3 && recentMessages.some(m => m.includes('not answering') || m.includes('didn\'t answer') || m.includes('don\'t understand')));
            
            // Check if there's a potential project inquiry pattern
            const projectInquiry = recentMessages.some(m => 
              m.includes('project') || m.includes('remodel') || m.includes('renovate') || m.includes('build') || 
              m.includes('cost') || m.includes('price') || m.includes('how much'));
              
            if (userFrustration) {
              // For frustrated users, provide direct connection options
              botResponse = {
                text: "I understand you're looking for specific information that I don't have. The best way to get detailed answers about your unique situation would be to connect directly with our team. They can provide personalized guidance based on your exact needs. Would you prefer a call, email, or to schedule a consultation?",
                isUser: false,
                timestamp: Date.now(),
                type: 'contact',
                options: [
                  { text: "Call Now: 404-934-9458", action: "tel:404-934-9458" },
                  { text: "Email Team", action: "mailto:sustenablet@gmail.com" },
                  { text: "Schedule Consultation", action: "/free-estimate" }
                ]
              };
            } else if (projectInquiry) {
              // For project inquiries, focus on consultation options
              botResponse = {
                text: "Thank you for your question about your project. While I don't have specific information on this particular detail, our design consultants can provide custom guidance tailored to your unique circumstances and preferences. A brief consultation would allow us to understand your needs better and provide accurate information. Would you like to schedule one?",
                isUser: false,
                timestamp: Date.now(),
                type: 'option',
                options: [
                  { text: "Schedule Free Consultation", action: "/free-estimate" },
                  { text: "View Similar Projects", action: "/portfolio" },
                  { text: "Call Design Team", action: "tel:404-934-9458" }
                ]
              };
            } else {
              // Standard enhanced fallback with more context-aware options
              botResponse = {
                text: "Thank you for your question. While I don't have specific information about that topic, I'd be happy to connect you with our experts who can provide personalized guidance. In the meantime, you might find these resources helpful, or feel free to ask about a different topic.",
                isUser: false,
                timestamp: Date.now(),
                type: 'option',
                options: [
                  ...suggestions.slice(0, 2).map(q => ({ text: q, action: `question-${q.toLowerCase().replace(/[^a-z0-9]/g, '-')}` })),
                  { text: "Browse Design Ideas", action: "/portfolio" },
                  { text: "Speak to Team Member", action: "speak" }
                ]
              };
            }
          }
        }
      }
    }
    
    // Update conversation memory with this interaction
    updateConversationMemory(message, botResponse.text);
    
    // Add bot response after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.type === 'option' && msg.options) {
      return (
        <div>
          <div className="mb-2">{msg.text}</div>
          <div className="space-y-1.5">
            {msg.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option.action)}
                className="block w-full text-left text-sm px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-100"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (msg.type === 'quick-reply' && msg.options) {
      return (
        <div>
          <div className="mb-2">{msg.text}</div>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {msg.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessage(option.text);
                  setTimeout(() => {
                    const event = new Event('submit', { bubbles: true, cancelable: true });
                    document.getElementById('chat-form')?.dispatchEvent(event);
                  }, 100);
                }}
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (msg.type === 'link' && msg.options) {
      return (
        <div>
          <div className="mb-2">{msg.text}</div>
          <div className="space-y-1.5">
            {msg.options.map((option, idx) => (
              <a
                key={idx}
                href={option.action}
                onClick={(e) => {
                  e.preventDefault();
                  handleOptionClick(option.action);
                }}
                className="block w-full text-left text-sm px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {option.text}
              </a>
            ))}
          </div>
        </div>
      );
    } else if (msg.type === 'contact' && msg.options) {
      return (
        <div>
          <div className="mb-2">{msg.text}</div>
          <div className="space-y-1.5">
            {msg.options.map((option, idx) => {
              const isPhone = option.action.startsWith('tel:');
              const isEmail = option.action.startsWith('mailto:');
              
              return (
                <a
                  key={idx}
                  href={option.action}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick(option.action);
                  }}
                  className="block w-full text-left text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors flex items-center"
                >
                  {isPhone && <Phone size={12} className="mr-1.5 text-green-600" />}
                  {isEmail && <Mail size={12} className="mr-1.5 text-blue-600" />}
                  <span>{option.text}</span>
                </a>
              );
            })}
          </div>
        </div>
      );
    } else {
      // Regular text message
      return msg.text;
    }
  };

  const handleOptionClick = (actionOrUrl: string) => {
    let botResponse: ChatMessage;
    
    // Special handling for end-chat actions
    if (actionOrUrl === 'show-feedback') {
      setShowEndChatFeedback(true);
      return;
    }
    
    // Action for the frustrated user who wants to continue chatting
    if (actionOrUrl === 'continue-chat') {
      botResponse = {
        text: "Great! How else can I help you today? Feel free to ask any questions about our services or tell me more about your project needs.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    // Handle kitchen pricing action
    if (actionOrUrl === 'kitchen-pricing') {
      const currentPropertyType = propertyType?.name || null;
      let priceRange = "$30,000 - $65,000";
      
      if (currentPropertyType) {
        if (currentPropertyType.includes('Single-Family')) {
          priceRange = "$35,000 - $75,000";
        } else if (currentPropertyType.includes('Townhouse')) {
          priceRange = "$28,000 - $60,000";
        } else if (currentPropertyType.includes('Condo')) {
          priceRange = "$25,000 - $55,000";
        } else if (currentPropertyType.includes('Multi-Family')) {
          priceRange = "$30,000 - $65,000 per unit";
        }
      }
      
      botResponse = {
        text: `Kitchen remodeling typically ranges from ${priceRange}, depending on the scope and materials selected. This includes cabinetry, countertops, backsplash, fixtures, and appliances. Would you like a custom quote for your specific project?`,
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Get Custom Quote", action: "/free-estimate?initialService=kitchen" },
          { text: "View Kitchen Portfolio", action: "/portfolio?category=kitchen" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    // Handle bathroom pricing action
    if (actionOrUrl === 'bathroom-pricing') {
      const currentPropertyType = propertyType?.name || null;
      let priceRange = "$22,000 - $45,000";
      
      if (currentPropertyType) {
        if (currentPropertyType.includes('Single-Family')) {
          priceRange = "$25,000 - $50,000";
        } else if (currentPropertyType.includes('Townhouse')) {
          priceRange = "$20,000 - $45,000";
        } else if (currentPropertyType.includes('Condo')) {
          priceRange = "$18,000 - $40,000";
        } else if (currentPropertyType.includes('Multi-Family')) {
          priceRange = "$20,000 - $45,000 per unit";
        }
      }
      
      botResponse = {
        text: `Bathroom remodeling typically ranges from ${priceRange}, depending on the scope and materials selected. This includes fixtures, tile work, vanities, and plumbing. Would you like a custom quote for your project?`,
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Get Custom Quote", action: "/free-estimate?initialService=bathroom" },
          { text: "View Bathroom Portfolio", action: "/portfolio?category=bathroom" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    // Handle financing info action
    if (actionOrUrl === 'financing-info') {
      botResponse = {
        text: "We offer several financing options through our trusted partners, including home improvement loans with competitive interest rates, lines of credit, and special promotional terms. Our financing specialists can help find the best option for your budget.",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Speak to Financing Specialist", action: "tel:404-934-9458" },
          { text: "Apply Online", action: "/financing" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    // Handle commercial specialist contact
    if (actionOrUrl === 'contact-commercial-specialist') {
      botResponse = {
        text: "I'll connect you with one of our commercial construction specialists who can provide detailed information about your specific project needs. You can reach them directly at:",
        isUser: false,
        timestamp: Date.now(),
        type: 'contact',
        options: [
          { text: "Call Commercial Team: 404-934-9458", action: "tel:404-934-9458" },
          { text: "Email Commercial Team: commercial@arxenconstruction.com", action: "mailto:commercial@arxenconstruction.com" },
          { text: "Request Commercial Consultation", action: "/free-estimate?type=commercial" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    // Add this to handle new actions from knowledge base responses
    if (actionOrUrl.startsWith('service-')) {
      const serviceType = actionOrUrl.split('-')[1];
      botResponse = {
        text: `Great! Let me show you more information about our ${serviceType} services.`,
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Navigate to the appropriate service page
      setTimeout(() => {
        navigate(`/services/${serviceType}-remodeling`);
        closeChat();
      }, 1000);
      return;
    }
    
    // Handle existing actions
    if (actionOrUrl === 'services-commercial') {
      botResponse = {
        text: "I'll show you our commercial services now.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      setTimeout(() => {
        navigate('/commercial');
        closeChat();
      }, 1000);
      return;
    }
    
    if (actionOrUrl === 'residential-estimate') {
      botResponse = {
        text: "Great! I'll direct you to our residential estimate form.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      setTimeout(() => {
        navigate('/free-estimate?type=residential');
        closeChat();
      }, 1000);
      return;
    }
    
    if (actionOrUrl === 'commercial-estimate') {
      botResponse = {
        text: "Great! I'll direct you to our commercial estimate form.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      setTimeout(() => {
        navigate('/free-estimate?type=commercial');
        closeChat();
      }, 1000);
      return;
    }
    
    if (actionOrUrl === 'services') {
      botResponse = {
        text: "Here are our main service categories. Which one would you like to learn more about?",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Kitchen Remodeling", action: "/services/kitchen-remodeling" },
          { text: "Bathroom Remodeling", action: "/services/bathroom-remodeling" },
          { text: "All Services", action: "/services" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    if (actionOrUrl === 'estimate') {
      botResponse = {
        text: "I'd be happy to help you get a free estimate for your project. What type of property do you have?",
        isUser: false,
        timestamp: Date.now(),
        type: 'option',
        options: [
          { text: "Residential", action: "/free-estimate?type=residential" },
          { text: "Commercial", action: "/free-estimate?type=commercial" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    if (actionOrUrl === 'question') {
      botResponse = {
        text: "What else would you like to know? You can ask about our services, pricing, timeline, warranty, or any other questions about your construction project.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }
    
    if (actionOrUrl === 'end-chat') {
      botResponse = {
        text: "Thank you for chatting with us today! Before you go, we'd love to hear your feedback.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Show the end chat feedback instead of closing immediately
      setShowEndChatFeedback(true);
      return;
    }
    
    // Handle URL navigation for direct links
    if (actionOrUrl.startsWith('/') || actionOrUrl.startsWith('http') || actionOrUrl.startsWith('tel:') || actionOrUrl.startsWith('mailto:')) {
      // For internal links
      if (actionOrUrl.startsWith('/')) {
        navigate(actionOrUrl);
        setTimeout(() => closeChat(), 500);
      } else {
        // For external links, tel:, mailto:
        window.open(actionOrUrl, '_blank');
      }
      return;
    }
  };

  // Bubble Chat Message component
  const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { text, isUser, timestamp, type, options } = message;
    
    const formattedTimestamp = showTimestamp && timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    
    return (
      <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-[85%] p-3 rounded-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
          <p className="text-sm">{text}</p>
          
          {/* Render different types of message content */}
          {type === 'option' && options && (
            <div className="mt-2 space-y-2">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option.action)}
                  className="w-full text-left text-sm p-2 rounded bg-white hover:bg-gray-50 text-blue-600 flex items-center justify-between border border-gray-200"
                >
                  <span>{option.text}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          )}
          
          {type === 'contact' && options && (
            <div className="mt-2 space-y-2">
              {options.map((option, i) => (
                <a
                  key={i}
                  href={option.action}
                  className="block text-sm p-2 rounded bg-white hover:bg-gray-50 text-blue-600 flex items-center gap-2 border border-gray-200"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptionClick(option.action);
                  }}
                >
                  {option.text.includes('Call') && <Phone size={16} />}
                  {option.text.includes('Email') && <Mail size={16} />}
                  {option.text.includes('Contact Form') && <MessageCircle size={16} />}
                  <span>{option.text}</span>
                </a>
              ))}
            </div>
          )}
          
          {formattedTimestamp && (
            <div className="text-xs mt-1 opacity-70 text-right">
              {formattedTimestamp}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Update showOptions state whenever messages change
  useEffect(() => {
    // Check if the last message has options
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && (lastMessage.type === 'option' || lastMessage.type === 'quick-reply')) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, [messages]);

  // Function to focus on the input when "Other" is clicked
  const handleOtherClick = () => {
    // Add a prompt message for the user
    const promptMessage: ChatMessage = {
      text: "Please type your question below, and I'll do my best to help you.",
      isUser: false,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, promptMessage]);
    
    // Focus on the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-8 sm:right-8 right-4 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-blue-700 z-[2000]"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}
      
      {/* Chat Window */}
      <div
        className={`fixed bottom-8 sm:right-8 right-4 w-[90vw] sm:w-[350px] bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } z-[2000] flex flex-col max-h-[600px] sm:max-h-[600px] max-h-[80vh]`}
      >
        {/* Chat Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle size={18} className="mr-2" />
            <div>
              <h3 className="font-medium">Arxen Chat Support</h3>
              <div className="text-xs text-blue-200 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                Online now
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowEndChatFeedback(true)}
              className="text-white hover:text-blue-100 transition-colors mr-2 text-xs bg-blue-700 px-2 py-1 rounded"
              aria-label="End chat"
              title="End chat"
            >
              End Chat
            </button>
            <button
              onClick={() => setShowTimestamp(!showTimestamp)}
              className="text-white hover:text-blue-100 transition-colors mr-2"
              aria-label="Toggle timestamps"
              title="Toggle timestamps"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={resetChat}
              className="text-white hover:text-blue-100 transition-colors mr-2"
              aria-label="Reset chat"
              title="Reset chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z"></path>
                <path d="M9 12h6m0 0l-3-3m3 3l-3 3"></path>
              </svg>
            </button>
            <button
              onClick={closeChat}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Quick Help Options */}
        <div className="px-4 py-2 flex border-b overflow-x-auto no-scrollbar">
          {[
            { icon: <Calendar size={16} />, text: "Schedule" },
            { icon: <DollarSign size={16} />, text: "Pricing" },
            { icon: <Wrench size={16} />, text: "Services" },
            { icon: <HelpCircle size={16} />, text: "FAQ" }
          ].map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(`question-${option.text.toLowerCase()}`)}
              className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg mr-2 transition-colors"
            >
              <div className="text-blue-600 mb-1">{option.icon}</div>
              <span className="text-xs text-gray-700">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex-grow" ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${
                msg.isUser ? 'ml-auto' : 'mr-auto'
              } max-w-[80%]`}
            >
              <div className="flex items-end">
                {!msg.isUser && (
                  <div className="flex-shrink-0 mr-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={14} className="text-blue-700" />
                    </div>
                  </div>
                )}
                <div
                  className={`p-3 shadow-sm ${
                    msg.isUser
                      ? 'bg-blue-500 text-white rounded-bl-lg rounded-tl-lg rounded-tr-lg'
                      : 'bg-white text-gray-800 rounded-br-lg rounded-tr-lg rounded-tl-lg border border-gray-200'
                  }`}
                >
                  {renderMessageContent(msg)}
                  {showTimestamp && (
                    <div className={`text-[10px] mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'} text-right`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
                {msg.isUser && (
                  <div className="flex-shrink-0 ml-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center mb-3 max-w-[80%]">
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={14} className="text-blue-700" />
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          
          {/* End chat feedback UI */}
          {showEndChatFeedback && (
            <div className="p-3 bg-white rounded shadow-md border border-blue-100 mt-4">
              <ChatEndFeedback 
                onClose={() => {
                  // Reset the feedback state and force close the chat
                  setShowEndChatFeedback(false);
                  // Force close chatbot directly
                  setIsOpen(false);
                  localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
                }}
                onFeedbackComplete={(rating: number) => {
                  // Store feedback data
                  console.log(`Chat ended with rating: ${rating}/5`);
                  
                  // Add a final thank you message
                  const thankYouMessage: ChatMessage = {
                    text: "Thank you for your feedback! We appreciate your time and look forward to serving you again soon.",
                    isUser: false,
                    timestamp: Date.now()
                  };
                  setMessages(prev => [...prev, thankYouMessage]);
                  
                  // Reset the feedback state
                  setTimeout(() => {
                    setShowEndChatFeedback(false);
                    // Close the chat after the thank you message
                    setTimeout(() => closeChat(), 1500);
                  }, 500);
                }}
              />
            </div>
          )}
        </div>
        
        {/* "Other" option above input */}
        {showOptions && !showEndChatFeedback && (
          <div className="px-3 py-1 border-t border-gray-100 bg-gray-50 flex justify-center">
            <button
              onClick={handleOtherClick}
              className="text-xs text-blue-600 hover:text-blue-800 py-1 px-3 bg-white rounded-full border border-gray-200 shadow-sm transition-colors"
            >
              Ask a different question
            </button>
          </div>
        )}
        
        {/* Chat Input */}
        {!showEndChatFeedback && (
          <form 
            id="chat-form"
            onSubmit={handleSubmit} 
            className="border-t border-gray-200 p-3 flex"
          >
            <input
              ref={inputRef}
              type="text"
              id="chat-message"
              name="chat-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className={`bg-blue-600 text-white px-4 rounded-r-lg flex items-center justify-center ${
                isTyping || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              disabled={isTyping || !message.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        )}
        
        {/* Chat Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t text-xs text-gray-500 text-center">
          Live chat support hours: Mon-Fri, 8AM-6PM ET
        </div>
      </div>
    </>
  );
};

export default ChatBot; 