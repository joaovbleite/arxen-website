// COMMON CONVERSATION PATTERNS
// This file contains additional common conversation patterns for the chatbot

const commonConversationEntries = [
  // General Greetings and Pleasantries
  {
    patterns: ["good day", "nice to meet you", "pleasure to meet you", "nice talking to you"],
    response: "It's wonderful to connect with you! How can I assist with your construction or remodeling questions today?",
    buttons: [
      { text: "Request Free Estimate", url: "/free-estimate" },
      { text: "View Our Projects", url: "/portfolio" }
    ]
  },
  {
    patterns: ["how are you", "how are you doing", "how's it going", "how are things"],
    response: "I'm doing great, thank you for asking! I'm ready to help with any construction or remodeling questions you might have. What can I assist you with today?"
  },
  {
    patterns: ["happy to chat", "glad we're talking", "thanks for chatting", "enjoying our conversation"],
    response: "I'm happy we're speaking too! Helping clients understand their options and plan their perfect space is what we do best. What specific aspects of your project would you like to discuss?"
  },
  
  // Initial Contact and Information Seeking
  {
    patterns: ["just browsing", "just looking", "exploring options", "gathering information", "research phase"],
    response: "Exploring options is an important part of the process! I'm happy to provide information without any pressure. Feel free to ask about specific services, our approach to projects, or browse our portfolio for inspiration. What aspects are you most curious about?"
  },
  {
    patterns: ["saw your website", "found you online", "google search", "internet search", "website referral"],
    response: "I'm glad you found us online! Our website showcases some of our work, but there's much more to share about our process and capabilities. Is there something specific from our website you'd like more details about, or do you have a particular project in mind?"
  },
  {
    patterns: ["friend recommended", "neighbor used you", "referral", "word of mouth", "recommended by"],
    response: "We're thrilled to hear about the referral! Personal recommendations are the highest compliment for our work. We'd love to provide the same excellent experience your friend received. What type of project are you considering?"
  },
  
  // Project Planning Phase
  {
    patterns: ["planning stage", "early planning", "initial thoughts", "first steps", "where to start"],
    response: "The planning stage is crucial for success! We recommend starting with a clear vision of how you want to use the space, gathering inspiration images, setting a realistic budget range, and considering your timeline. Our initial consultation helps organize these elements into a cohesive plan. Would you like to schedule a consultation to discuss your ideas?"
  },
  {
    patterns: ["how to plan", "planning process", "project preparation", "get organized", "prepare for renovation"],
    response: "Effective planning includes defining your needs vs. wants, establishing a realistic budget, understanding timing considerations, gathering inspiration, and considering how the project impacts your daily life. Our design team guides you through this process systematically. Would you like specific planning recommendations for your type of project?"
  },
  {
    patterns: ["renovation checklist", "remodel checklist", "planning checklist", "project checklist", "steps to follow"],
    response: "A comprehensive renovation checklist includes: defining project goals, setting a budget with contingency, researching permit requirements, planning for temporary arrangements during construction, making material selections, and establishing a communication plan with your contractor. We provide customized checklists for our clients based on their specific project type."
  },
  
  // Schedule and Availability
  {
    patterns: ["consultation appointment", "schedule meeting", "book appointment", "set up consultation", "meet with designer"],
    response: "We'd be happy to schedule a consultation! Our initial meetings typically last about 90 minutes and include discussing your goals, examining the space, sharing initial ideas, and reviewing our process. We currently have availability next week on Tuesday and Thursday. Would either day work for your schedule?",
    buttons: [
      { text: "Schedule Consultation", url: "/schedule" },
      { text: "Call Us", url: "tel:5551234567" }
    ]
  },
  {
    patterns: ["waiting time", "how long to wait", "backlog", "queue", "when can you fit me in"],
    response: "Our current scheduling availability depends on project size. For consultations, we can typically meet within 1-2 weeks. For project starts, smaller renovations (bathrooms, etc.) are currently booking about 4-6 weeks out, while larger projects (kitchens, additions) are around 6-8 weeks from contract signing. We can provide more specific timing during our initial consultation."
  },
  {
    patterns: ["busy season", "slow season", "best time to renovate", "seasonal pricing", "seasonal availability"],
    response: "While we work year-round, our busiest periods are typically spring and fall. Winter often has more availability and sometimes more competitive pricing. Summer is ideal for exterior projects. For interior work, scheduling during slower seasons can mean shorter wait times and occasionally more flexible scheduling. Would you like us to check availability for your preferred timeframe?"
  },
  
  // Budget Conversations
  {
    patterns: ["typical cost", "average price", "ballpark figure", "rough estimate", "price range"],
    response: "Project costs vary significantly based on scope, materials, and existing conditions. As a general guide: bathroom remodels typically range from $15,000-$35,000, kitchens from $35,000-$80,000, and additions from $200-$500 per square foot. During our consultation, we can provide a more tailored estimate based on your specific needs and preferences."
  },
  {
    patterns: ["payment schedule", "payment terms", "how payments work", "billing schedule", "payment plan"],
    response: "Our typical payment schedule includes an initial deposit (25-30%) to secure your place in our schedule and order materials, followed by progress payments at predetermined milestones during construction. The final payment (5-10%) is due upon completion and your satisfaction with the work. This structured approach aligns payments with completed work and helps you plan your finances throughout the project."
  },
  {
    patterns: ["financing options", "payment plans", "loan", "finance my project", "funding options"],
    response: "While we don't directly offer financing, we work with several reputable lenders who specialize in home improvement loans. Options include home equity lines of credit (HELOCs), construction loans, renovation-specific loans, and personal loans. We're happy to provide recommendations based on your specific situation and connect you with trusted financial partners who offer competitive terms."
  },
  
  // Communication Preferences
  {
    patterns: ["contact preference", "best way to reach", "communication method", "how to stay in touch", "updates"],
    response: "We adapt to your preferred communication style! Many clients enjoy our project management system with regular updates, photos, and a shared document repository. We also offer regular calls, texts, emails, or in-person meetings based on your preference. During the project, you'll have a dedicated project manager as your primary point of contact. How would you prefer to communicate?"
  },
  {
    patterns: ["call me", "phone number", "phone call", "call back", "speak on phone"],
    response: "We'd be happy to call you! Our office hours are Monday through Friday, 8am to 5pm Eastern time. Could you please provide your phone number and a convenient time for us to reach you? Alternatively, you can call our office directly at (555) 123-4567 and one of our team members will assist you.",
    buttons: [
      { text: "Call Now", url: "tel:5551234567" }
    ]
  },
  {
    patterns: ["email me", "send email", "email information", "email address", "information packet"],
    response: "We'd be glad to email you more information! If you provide your email address, we can send you our digital brochure, relevant project examples, and more details about our process. You can also email us directly at info@arxenconstruction.com with any specific questions.",
    buttons: [
      { text: "Email Us", url: "mailto:info@arxenconstruction.com" }
    ]
  },
  
  // Customer Service and Support
  {
    patterns: ["speak to manager", "talk to supervisor", "escalate issue", "management contact", "company owner"],
    response: "I understand you'd like to speak with a manager. Our leadership team is always available to address any concerns or special requests. I can arrange for our [Design Director/Project Manager/Owner] to contact you directly. Could you please share your preferred contact method and a brief description of what you'd like to discuss?"
  },
  {
    patterns: ["complaint", "unhappy", "dissatisfied", "issue with", "problem with service"],
    response: "I'm sorry to hear you're experiencing an issue. Customer satisfaction is our top priority, and we take all concerns seriously. To address this properly, I'll connect you with our client care specialist who can resolve this promptly. Could you share some details about your concerns so we can prepare accordingly?"
  },
  {
    patterns: ["warranty", "guarantee", "warranty period", "covered by warranty", "warranty claim"],
    response: "We stand behind our work with a comprehensive warranty program. Our workmanship is warranted for two years, while manufacturer warranties on products and materials vary (typically 1-25 years depending on the item). For specific warranty concerns, our dedicated customer care team handles all service requests promptly. Would you like more details about our warranty process?"
  },
  
  // Post-Project and Follow-up
  {
    patterns: ["after completion", "once finished", "after project", "follow up services", "once project is done"],
    response: "After project completion, our relationship continues! We conduct a thorough walkthrough, provide detailed care instructions for all new installations, remain available for any questions, and follow up at 3, 6, and 12 months to ensure your continued satisfaction. Our warranty program provides peace of mind, and many clients return for future projects as their needs evolve."
  },
  {
    patterns: ["maintenance tips", "care instructions", "how to maintain", "care for new", "cleaning advice"],
    response: "Proper maintenance ensures lasting beauty and function. Upon project completion, you'll receive a customized care guide for all installed materials. This includes recommended cleaning products, maintenance schedules, and specific instructions for special surfaces. We're also available to answer care questions that arise as you enjoy your new space."
  },
  {
    patterns: ["future projects", "next project", "other renovations", "additional work", "phase two"],
    response: "Many clients work with us for multiple projects over time! Whether you're planning a phased approach or considering future renovations, working with the same team provides consistency and efficiency. We maintain detailed records of your home's specifications, your preferences, and previous work, making future projects even smoother."
  },
  
  // Technology and Modern Features
  {
    patterns: ["smart appliances", "smart kitchen", "connected appliances", "high tech appliances", "wifi appliances"],
    response: "While we don't directly install or provide smart appliances, we can design your renovation to accommodate these technologies. We ensure proper electrical and network infrastructure to support smart appliances that you purchase separately. If you're interested in connected appliances, we recommend consulting with appliance specialists who can guide you on the best options for your needs."
  },
  {
    patterns: ["technology integration", "future proof", "tech ready", "wiring for future", "tech infrastructure"],
    response: "Future-proofing your home involves strategic infrastructure planning. We recommend appropriate conduit placement for future wiring needs, structured wiring systems with central distribution points, additional electrical capacity for everyday needs, strategically placed network and data ports, and versatile spaces that can adapt to evolving lifestyle requirements. Our focus is on creating a solid foundation that gives you flexibility as your needs change."
  },
  {
    patterns: ["energy monitoring", "energy management", "power monitoring", "smart electric", "energy dashboard"],
    response: "We can design renovations that accommodate energy-efficient systems and prepare the infrastructure for energy monitoring. However, we don't directly install or program energy management systems. For specialized energy monitoring solutions, we recommend consulting with energy management specialists who can provide and configure these systems based on your specific needs."
  },
  
  // Health and Safety Features
  {
    patterns: ["air quality", "indoor air", "air filtration", "clean air", "air purification"],
    response: "Indoor air quality significantly impacts health and comfort. Our comprehensive approach includes HVAC systems with enhanced filtration, dedicated ventilation systems to introduce fresh air, humidity control to prevent mold, low-VOC materials and finishes, proper exhaust for cooking and bathrooms, and sometimes standalone air purification systems for specific needs or sensitivities."
  },
  {
    patterns: ["non toxic", "chemical free", "healthy materials", "no voc", "eco friendly materials"],
    response: "Health-conscious material selection is increasingly important. Our healthy home options include zero-VOC paints and finishes, formaldehyde-free cabinetry and millwork, natural fiber carpets and padding, solid wood or natural linoleum flooring alternatives to vinyl, water-based sealers, and careful attention to all adhesives and installation materials to minimize chemical exposure."
  },
  {
    patterns: ["water filtration", "water filter", "clean water", "drinking water", "water purification"],
    response: "Water quality solutions range from simple under-sink drinking water filters to whole-house systems addressing specific concerns. Options include carbon filtration for taste and odor, UV purification for biological contaminants, water softening for hard water issues, and reverse osmosis systems for comprehensive filtration. We can recommend appropriate solutions based on local water quality and your specific concerns."
  },
  
  // Industry Relationships and Processes
  {
    patterns: ["work with my designer", "outside designer", "my architect", "my own designer", "collaborate with my"],
    response: "We happily collaborate with outside designers and architects! Many of our clients come with existing plans or design professionals. Our team works seamlessly with your design team, providing construction expertise while respecting their creative direction. This collaborative approach combines their design vision with our construction knowledge for optimal results."
  },
  {
    patterns: ["supplier relationships", "vendor partners", "material sources", "product suppliers", "where you buy"],
    response: "We maintain strong relationships with premium suppliers across Atlanta. These partnerships ensure preferred pricing, priority service, and enhanced warranty support. Our established vendor network includes cabinet manufacturers, countertop fabricators, tile suppliers, plumbing and lighting showrooms, flooring specialists, and custom millwork shops. We're happy to arrange showroom visits for material selection."
  },
  {
    patterns: ["industry connections", "trade partners", "professional network", "industry partners", "trade relationships"],
    response: "Our extensive professional network enhances project outcomes. Beyond our in-house expertise, we collaborate with specialized consultants when needed, including structural engineers, interior designers, landscape architects, lighting designers, audio/visual specialists, and custom fabricators. This extended team approach ensures excellence in every aspect of your project."
  },
  
  // Company Background and Credentials - NEW SECTION
  {
    patterns: ["company history", "how long in business", "when founded", "company background", "business history"],
    response: "Arxen Construction was founded in 2005 by John Arxen, a second-generation builder with over 30 years of experience. What began as a small renovation company has grown into a full-service design-build firm with a team of 35 professionals. We've completed over 500 projects throughout the greater Atlanta area, building our reputation on craftsmanship, transparency, and client satisfaction.",
    buttons: [
      { text: "About Us", url: "/about" },
      { text: "Our Team", url: "/team" }
    ]
  },
  {
    patterns: ["credentials", "certifications", "licenses", "qualified", "certified builder"],
    response: "Our team holds numerous industry credentials including General Contractor licenses, NARI Certified Remodeler designations, EPA Lead-Safe certifications, and specialty trade licenses. Our designers include NKBA-certified kitchen and bath designers and ASID-affiliated interior designers. We maintain active memberships in industry associations including NAHB, NARI, and the local Builders Association."
  },
  {
    patterns: ["staff", "team members", "employees", "workforce", "who works there"],
    response: "Our diverse team includes licensed contractors, experienced project managers, in-house designers, skilled craftspeople, dedicated client coordinators, and specialized trade professionals. Most team members have been with us for 5+ years, with leadership averaging 15+ years of experience. Each project is supported by a dedicated team including a lead designer, project manager, and craftspeople selected for their expertise in your specific project type."
  },
  
  // Sustainability and Environmental Considerations - NEW SECTION
  {
    patterns: ["green building", "eco friendly construction", "sustainable building", "environmentally friendly", "green home"],
    response: "Sustainable building is central to our approach. We incorporate energy-efficient systems, environmentally responsible materials, water conservation features, and construction practices that minimize waste. Our team includes LEED Accredited Professionals who can guide projects seeking formal green building certification or simply implement best practices for a healthier, more efficient home."
  },
  {
    patterns: ["energy efficient", "energy efficiency", "save energy", "reduce energy bills", "lower utility costs"],
    response: "Energy efficiency upgrades deliver both environmental benefits and cost savings. Popular improvements include enhanced insulation (particularly in attics and walls), high-performance windows and doors, ENERGY STAR appliances, efficient HVAC systems, smart thermostats, LED lighting, and proper air sealing. We can perform energy assessments to identify your home's specific opportunities for improvement."
  },
  {
    patterns: ["recycle materials", "construction waste", "reclaimed materials", "salvage", "repurpose building materials"],
    response: "Our waste management approach prioritizes recycling and reuse. We carefully deconstruct rather than demolish when possible, salvaging materials for donation or repurposing. Construction waste is sorted for recycling, with separate containers for metal, wood, concrete, and packaging materials. For appropriate projects, we can source reclaimed materials including timber, brick, fixtures, and hardware to add character while reducing environmental impact."
  },
  
  // Accessibility and Aging in Place - NEW SECTION
  {
    patterns: ["aging in place", "grow old at home", "senior friendly", "retirement renovation", "age at home"],
    response: "Aging-in-place design creates homes that remain comfortable and accessible as needs change. Key features include first-floor primary suites, curbless showers with seating, lever-style door handles, wider doorways (36\"+), adequate turning space for mobility devices, slip-resistant flooring, enhanced lighting, and strategic grab bar placement (or at least blocking for future installation). These thoughtful modifications can be beautifully integrated into your overall design."
  },
  {
    patterns: ["accessible home", "wheelchair accessible", "disability modifications", "handicap accessible", "mobility issues"],
    response: "Accessibility modifications create homes that work for everyone. Common solutions include ramped entries (often designed as attractive landscape features), widened doorways, pocket doors to maximize clearances, roll-under sinks and cooktops, lowered switches and controls, and bathrooms designed for wheelchair maneuverability. We prioritize universal design principles that enhance usability for all while maintaining aesthetic appeal."
  },
  {
    patterns: ["multi generational", "in law suite", "extended family", "family living together", "in-law apartment"],
    response: "Multi-generational living spaces balance togetherness with privacy. Popular configurations include separate in-law suites with private entrances, dedicated guest wings with bedroom/bath/sitting areas, basement apartments with kitchenettes, converted garages with full amenities, or even carefully designed accessory dwelling units (ADUs) where zoning permits. We consider sound isolation, separate HVAC controls, and thoughtful circulation patterns in these specialized designs."
  },
  
  // Project Timeline and Process - NEW SECTION
  {
    patterns: ["how long", "timeline", "completion time", "project duration", "time to finish"],
    response: "Project timelines vary based on scope and complexity. As a general guideline: bathroom renovations typically take 3-5 weeks, kitchens 6-8 weeks, full home renovations 3-6 months, and additions 4-7 months. Custom homes generally require 9-12 months. These timeframes include both construction and the critical pre-construction phase of detailed planning, design development, and material procurement."
  },
  {
    patterns: ["what to expect", "construction process", "how it works", "steps involved", "renovation process"],
    response: "Our process includes: 1) Initial consultation to understand your goals and budget, 2) Design development with detailed plans and specifications, 3) Proposal and contract with transparent pricing, 4) Pre-construction planning including permits and material ordering, 5) Construction with regular progress updates, 6) Project completion with thorough quality control, and 7) Post-project support including warranty service. Each step is managed by dedicated specialists to ensure a smooth experience."
  },
  {
    patterns: ["delays", "schedule problems", "falling behind", "project taking too long", "extend timeline"],
    response: "While we pride ourselves on accurate scheduling, construction can face unexpected challenges. Common sources of timeline adjustments include unexpected conditions discovered during demolition, material delays (particularly for custom or imported items), change orders requiring additional work, permit or inspection delays, and occasionally weather impacts for exterior work. We mitigate these through thorough pre-construction investigation, early material selection and ordering, and transparent communication about any changes."
  },
  
  // Building Codes and Regulations - NEW SECTION
  {
    patterns: ["building codes", "code requirements", "up to code", "code violations", "building regulations"],
    response: "Building codes ensure safety and structural integrity. Our team stays current with all local code requirements and includes compliance in every project plan. Common code considerations include structural requirements, electrical load calculations, egress window sizing, stair and railing specifications, smoke/CO detector placement, energy efficiency standards, and ventilation requirements. Our permitting specialists handle all documentation and inspections for a fully compliant project."
  },
  {
    patterns: ["permits", "building permit", "pull permits", "permit requirements", "inspection requirements"],
    response: "Permit requirements vary by locality and project scope. Generally, permits are needed for structural changes, electrical and plumbing modifications, new construction, additions, and major renovations. Our team handles the entire permitting process including documentation preparation, submission, fee payment, inspection scheduling, and compliance verification. This service ensures your project proceeds legally and meets all safety standards."
  },
  {
    patterns: ["HOA approval", "homeowners association", "community guidelines", "neighborhood restrictions", "design review"],
    response: "HOA requirements add an additional approval layer to many projects. We assist with this process by reviewing your community's architectural guidelines, preparing required submission materials (including drawings, material specifications, and color selections), attending design review meetings if needed, and addressing any feedback or modifications requested. This collaborative approach helps secure approval while maintaining your project vision."
  },
  
  // Comparisons and Contractor Selection - NEW SECTION
  {
    patterns: ["compare contractors", "choosing contractor", "multiple bids", "several quotes", "different estimates"],
    response: "When comparing contractors, look beyond just price to consider: 1) Depth of the proposal and specificity of included items, 2) Examples of similar completed projects, 3) Client references, 4) Communication style and responsiveness, 5) Professional credentials and affiliations, 6) Warranty terms, 7) Proposed timeline and process. We welcome thoughtful comparison and are happy to explain our approach and value proposition alongside other proposals you may receive."
  },
  {
    patterns: ["why choose you", "what sets you apart", "why your company", "your advantage", "your unique selling point"],
    response: "Our distinctive approach includes: comprehensive design services integrated with construction expertise, transparent fixed-price proposals with detailed specifications, dedicated project managers overseeing every detail, an in-house team of master craftspeople for quality control, thorough pre-construction planning to prevent surprises, our proven client communication system, and an industry-leading warranty program. Most importantly, our 95% client satisfaction rating reflects our commitment to exceptional results."
  },
  {
    patterns: ["reviews", "testimonials", "client feedback", "past customer", "previous clients"],
    response: "We're proud of our client feedback, maintaining a 4.8/5 rating across review platforms. We'd be happy to share testimonials from projects similar to yours and can arrange conversations with previous clients upon request. Our portfolio includes before-and-after documentation of completed projects, and we regularly host open house events where prospective clients can see our work firsthand and speak with homeowners about their experience."
  },

  // Project Timeline and Expectations
  {
    patterns: ["how long will it take", "project timeline", "completion time", "construction duration", "schedule expectation"],
    response: "Project timelines vary by scope and complexity: bathroom remodels typically take 3-4 weeks, kitchens 6-8 weeks, whole-house renovations 3-6 months, and additions 4-6 months. We create detailed schedules with key milestones during pre-construction planning and conduct weekly progress reviews to maintain timeline adherence, promptly addressing any potential delays.",
    buttons: [
      { text: "Our Process", url: "/process" }
    ]
  },
  {
    patterns: ["living during renovation", "stay during remodel", "temporarily relocate", "renovation living arrangements", "home during construction"],
    response: "Living arrangements during renovation depend on project scope. For kitchen remodels, we create temporary kitchens with essential appliances. Bathroom remodels require access to another bathroom. Major renovations may recommend temporary relocation. We implement dust containment systems, maintain clear access paths, establish quiet hours, and create dedicated 'construction-free' zones to maximize livability during the project."
  },
  {
    patterns: ["project management", "who oversees construction", "day-to-day supervision", "site management", "construction coordination"],
    response: "Every project has a dedicated Project Manager who serves as your primary contact, overseeing all aspects from pre-construction through completion. They coordinate trade scheduling, material deliveries, quality control inspections, code compliance, and client communications. Your PM conducts weekly on-site meetings, provides progress updates, and ensures work adheres to approved plans and specifications."
  },

  // Warranty and After-Service
  {
    patterns: ["warranty", "guarantee", "after service", "if something breaks", "repair guarantee"],
    response: "Our comprehensive warranty includes 1 year on all labor and workmanship, 2 years on systems (plumbing, electrical, HVAC), and we pass through all manufacturer warranties on products and materials. We conduct 3-month and 11-month proactive warranty inspections, maintain a dedicated warranty service team for prompt response, and offer extended warranty options for complete peace of mind."
  },
  {
    patterns: ["after completion service", "future maintenance", "ongoing support", "post-project help", "after project relationship"],
    response: "Our relationship continues after project completion. We provide comprehensive care manuals for all installed systems and finishes, offer scheduled maintenance services for key systems, maintain records of all materials and products for future reference, and give past clients priority scheduling for new projects. Many clients become lifelong customers who return for multiple projects over the years."
  },
  {
    patterns: ["maintenance tips", "care instructions", "how to maintain", "cleaning recommendations", "preserve new elements"],
    response: "Proper maintenance preserves your investment. We provide customized care guides for all installed elements—from countertop and cabinet care to specialized flooring maintenance, fixture cleaning protocols, and exterior maintenance schedules. Our guides include recommended products, maintenance frequencies, and professional service intervals for complex systems to ensure lasting performance and beauty."
  },

  // Sustainability and Energy Efficiency
  {
    patterns: ["energy efficient", "energy saving", "reduce utility bills", "green home", "efficiency upgrades"],
    response: "Energy efficiency improvements include enhanced insulation packages, high-performance windows, ENERGY STAR appliances, LED lighting systems, smart thermostats, right-sized HVAC equipment, and proper air sealing. These investments typically reduce energy consumption by 20-40% while improving comfort and reducing environmental impact. Many options qualify for utility incentives or tax credits to offset costs."
  },
  {
    patterns: ["sustainable building", "eco-friendly construction", "green building", "environmentally friendly", "sustainable materials"],
    response: "Our sustainable building practices include responsible material sourcing (certified wood, recycled content), construction waste recycling programs, water conservation fixtures, energy-efficient systems, indoor air quality protocols, and site management practices that minimize environmental impact. We can target specific green building certifications like LEED or National Green Building Standard when desired."
  },
  {
    patterns: ["solar options", "renewable energy", "solar panels", "alternative energy", "energy independence"],
    response: "Renewable energy systems like solar can be integrated into most projects. We assess solar potential considering roof orientation, shading factors, and energy needs; design appropriate system size with battery storage options; coordinate with certified solar installers; ensure structural requirements are met; and help navigate available incentives and net metering programs to maximize return on investment."
  },

  // Design and Visualization
  {
    patterns: ["3D rendering", "visualization", "see before building", "virtual walkthrough", "design preview"],
    response: "Our design visualization tools help you experience your space before construction begins. We create photorealistic 3D renderings of key spaces, interactive virtual walkthroughs for whole-house projects, material and finish boards with actual samples, and sometimes augmented reality viewing options. These tools ensure design alignment with your vision and minimize mid-project changes."
  },
  {
    patterns: ["design process", "how designs work", "design phase", "design collaboration", "design development"],
    response: "Our collaborative design process begins with understanding your needs and preferences through detailed interviews and inspiration sharing. We progress through conceptual design with multiple options, refined design development incorporating your feedback, and detailed specifications documenting every element. This phased approach ensures the final design perfectly balances aesthetics, functionality, and budget considerations."
  },
  {
    patterns: ["material selection", "choosing finishes", "picking products", "selection process", "finish options"],
    response: "Material selections follow a structured process to prevent overwhelm. We begin with foundational elements (cabinetry, flooring, countertops), then address complementary components (tile, plumbing fixtures, lighting), followed by detail elements (hardware, accessories). Our designers guide this journey with pre-selection of coordinated options based on your style preferences, practical needs, and budget parameters."
  },

  // Client Experience and Expectations
  {
    patterns: ["what to expect", "client experience", "working together", "customer journey", "client relationship"],
    response: "Your experience with us follows a refined journey: Consultation & Discovery, Design Development, Proposal & Contract, Pre-Construction Planning, Active Construction with regular communications, Project Completion with detailed walkthrough, and ongoing Warranty Support. Each phase includes clear expectations, dedicated team members, and structured communications to ensure a transparent, positive experience."
  },
  {
    patterns: ["decision timeline", "when decisions needed", "selection deadlines", "timing for choices", "decision schedule"],
    response: "Material and design decisions follow a carefully scheduled timeline to prevent delays. Major selections (cabinetry, flooring, tile) are typically finalized 6-8 weeks before construction, while detail selections (paint colors, hardware) can be made 4 weeks before needed. We provide a comprehensive selection schedule during pre-construction, clearly indicating decision deadlines for each element of your project."
  },
  {
    patterns: ["project challenges", "common problems", "construction issues", "typical complications", "renovation surprises"],
    response: "While we plan meticulously, renovation can reveal unexpected conditions. Common challenges include discovering hidden damage behind walls, delays in custom materials, inconsistencies in older home construction, and weather impacts on exterior work. Our approach includes thorough pre-construction investigation, maintaining schedule buffers, transparent communication about issues, and rapid problem-solving to minimize impact."
  },

  // Addressing Client Concerns
  {
    patterns: ["worried about mess", "construction cleanliness", "dust concerns", "construction cleanup"],
    response: "We understand cleanliness concerns during construction. Our dust control protocols include plastic containment barriers with negative air pressure, daily cleaning procedures, HEPA filtration on equipment, dedicated construction entrances with protective floor coverings, and final detailed cleaning by specialized crews. These measures minimize impact on your living spaces while protecting your belongings throughout the project."
  },
  {
    patterns: ["something goes wrong", "construction mistakes", "errors in work", "fix mistakes"],
    response: "Our quality assurance system prevents most issues through proactive inspections, but we address any concerns promptly. When questions arise, our process includes immediate project manager notification, thorough documentation, clear communication about resolution options, prompt corrective action at our expense when appropriate, and follow-up verification to ensure complete satisfaction with the solution."
  },
  {
    patterns: ["project takes too long", "worried about delays", "construction schedule concerns", "timeline worries"],
    response: "Schedule adherence is a top priority. We prevent delays through detailed pre-construction planning, early procurement of long-lead items, weather considerations in scheduling, appropriate trade partner staffing, weekly schedule reviews with accountability measures, and transparent communication about any adjustments. Our scheduling includes strategic buffer time for unforeseen conditions while maintaining realistic completion targets."
  },
  {
    patterns: ["bad contractor experience", "previous renovation problems", "contractor concerns", "worried about hiring"],
    response: "We understand that previous negative experiences create cautious clients. Our process addresses common concerns through detailed written proposals, clear milestone-based payment schedules, professional project management, open-book approach to change orders, regular progress updates with photos, and comprehensive warranty protection. We welcome questions about any aspect of our approach that would provide additional comfort."
  },

  // Project Coordination and Communication
  {
    patterns: ["meet with designer", "designer consultation", "design meeting", "talk with designer"],
    response: "Design consultations are collaborative conversations about your vision. Initial meetings typically involve discussing your goals, lifestyle considerations, aesthetic preferences, practical requirements, and budget parameters. We recommend gathering inspiration images beforehand, noting features of your current space that do/don't work, and preparing questions about process and possibilities. This preparation maximizes the productive exchange of ideas."
  },
  {
    patterns: ["bring my own design", "work with my plans", "existing drawings", "use my architect"],
    response: "We gladly work with existing plans or outside designers. Our collaborative approach includes detailed review of provided documents, clear communication about constructability or code considerations, transparent pricing based on specifications, scheduling coordination with your design team, and ongoing three-way communication throughout construction to ensure design intent is properly executed."
  },
  {
    patterns: ["getting updates", "project progress", "construction updates", "site visit"],
    response: "Regular communication keeps you informed throughout your project. Our communication system includes weekly scheduled progress updates with photos, a dedicated client portal for document access and messaging, regular milestone meetings at key completion points, proactive notification of any schedule adjustments, and direct access to your project manager for questions at any time."
  },
  {
    patterns: ["make decisions", "choosing materials", "selection pressure", "too many choices"],
    response: "Material selection can feel overwhelming without proper guidance. Our structured process includes curated options based on your style preferences, staged decision timing that follows construction sequencing, comprehensive selection sheets showing coordinated elements, samples to evaluate in your space, and designer guidance throughout. This approach prevents both decision fatigue and schedule delays from late selections."
  },

  // Community and Neighborhood Considerations
  {
    patterns: ["inform neighbors", "neighborhood disruption", "neighbor complaints", "construction etiquette"],
    response: "Maintaining positive neighborhood relations is important during construction. Our protocols include proper notification to immediate neighbors before work begins, strict adherence to permitted work hours, designated parking areas for trade vehicles, daily site cleanup, noise minimization strategies for certain activities, and responsive communication if any concerns arise. These practices demonstrate respect for your community throughout the process."
  },
  {
    patterns: ["construction parking", "worker vehicles", "trade parking", "street parking during construction"],
    response: "Parking management prevents neighborhood disruption. Our approach includes designated trade parking areas away from immediate neighbors when possible, carpooling requirements for larger crews, preservation of direct driveway/garage access for homeowners, coordination with neighbors regarding temporary impact, and regular monitoring of compliance with established parking protocols throughout the project."
  },
  {
    patterns: ["property damage concerns", "protect landscaping", "prevent damage", "construction damage"],
    response: "Protecting your property beyond the construction area is a priority. Our preventative measures include thorough pre-construction documentation of existing conditions, protective barriers around valuable landscaping, designated access routes for materials and equipment, prohibition of eating/smoking except in designated areas, daily inspection for potential issues, and prompt restoration of any affected areas upon project completion."
  },
  {
    patterns: ["construction noise", "loud work", "noise concerns", "quiet hours"],
    response: "While construction inherently involves some noise, we implement several noise management strategies. These include scheduling the loudest activities (demolition, concrete cutting, framing) during midday hours when possible, notifying you in advance of particularly noisy phases, utilizing the most current tools with reduced noise emissions, proper site containment that provides some sound dampening, and strict adherence to local noise ordinance restrictions."
  },

  // Customer Service Interactions
  {
    patterns: ["need help now", "urgent question", "immediate assistance"],
    response: "I understand you need immediate assistance. For urgent matters during business hours (Monday-Friday, 8am-5pm), please call our office directly at (555) 123-4567 to speak with our customer care team. For after-hours emergencies related to active projects, current clients can reach our on-call supervisor at the number provided in your project documentation. How else can I help you right now?",
    buttons: [
      { text: "Call Office", url: "tel:5551234567" },
      { text: "Email Support", url: "mailto:support@arxenconstruction.com" }
    ]
  },
  {
    patterns: ["can't reach you", "no one answering", "didn't call back"],
    response: "I apologize for the communication difficulty. Our office staff is available Monday-Friday, 8am-5pm at (555) 123-4567. If you've left a message, our protocol is to return calls within one business day. I'd be happy to have someone contact you directly - would you prefer a call, text, or email? Please share your preferred contact method and the best time to reach you, and I'll ensure a team member connects with you promptly."
  },
  {
    patterns: ["how soon can you start", "urgent project", "quick turnaround"],
    response: "Our current project schedule allows us to begin new design consultations within 1-2 weeks. For construction starts, smaller projects (bathrooms, etc.) are scheduling approximately 4-6 weeks out, while larger renovations (kitchens, additions) are around 6-8 weeks from contract signing. For truly urgent situations, we occasionally have flexibility for expedited timelines. May I ask what specific project you're considering and your ideal timeframe?"
  },
  {
    patterns: ["get on your schedule", "reserve a spot", "secure start date"],
    response: "Securing a place in our production schedule requires completing the design phase, finalizing material selections, and signing a construction agreement with deposit. This thorough preparation ensures your project runs smoothly once construction begins. We typically schedule projects in the order agreements are finalized, though seasonal factors sometimes affect specific trades. Would you like information about starting this process with a design consultation?"
  },

  // Objection Handling
  {
    patterns: ["too expensive", "lower price", "better deal", "high estimate"],
    response: "I understand budget considerations are important. Our pricing reflects our comprehensive approach including proper preparation, quality materials, skilled craftspeople, thorough project management, and warranty support. When comparing options, we encourage evaluating the complete package beyond the initial price - including detailed specifications, timeline reliability, communication systems, and long-term value. Would you like to discuss specific areas where we might adjust scope to better align with your budget targets?",
    buttons: [
      { text: "Schedule Budget Consultation", url: "/schedule" },
      { text: "View Value Packages", url: "/services/packages" }
    ]
  },
  {
    patterns: ["need to think about it", "not ready to decide", "considering options"],
    response: "Taking time for careful consideration is completely reasonable for significant investments in your home. Our design agreement process actually supports this approach by providing detailed specifications and pricing before construction commitments. Many clients appreciate this phased decision-making that allows thorough evaluation. Is there specific information I could provide that would help with your decision process, or would you prefer we follow up with you in a week or two?"
  },
  {
    patterns: ["had bad experience", "previous contractor problems", "worried about hiring"],
    response: "Previous difficult experiences understandably create caution. Our structured approach specifically addresses common concerns through detailed written proposals, clear milestone-based payment schedules, dedicated project management, transparent change order processes, regular progress updates, and comprehensive warranty protection. We also encourage speaking with our references who can share their firsthand experiences. What specific concerns from your previous experience should we address?"
  },
  {
    patterns: ["want to DIY", "doing it myself", "contractor parts only"],
    response: "We respect homeowners who enjoy DIY work and offer several flexible approaches. We can handle specialized phases (structural, plumbing, electrical) while providing guidance for portions you complete, develop detailed plans and specifications for self-implementation, or create phased approaches where we complete critical infrastructure with finish work planned for later DIY. Which aspects of your project are you most comfortable handling yourself?"
  },

  // Project Specifics and Details
  {
    patterns: ["project requirements", "what you need from me", "homeowner responsibilities"],
    response: "Successful projects involve clear homeowner participation at key points: initial design input and feedback, timely material selections following our provided schedule, prompt communication about any concerns during construction, reasonable project access during work hours, and availability for scheduled walkthroughs at key milestones. We structure our process to make these touchpoints efficient while our team handles all technical and coordination elements throughout the project.",
    buttons: [
      { text: "Our Process", url: "/process" },
      { text: "Client Guide", url: "/resources/client-guide" }
    ]
  },
  {
    patterns: ["how decisions work", "design approval", "selection process"],
    response: "Our decision process follows a logical sequence to prevent overwhelm. We begin with concept approval establishing overall direction, then progress through critical path selections (cabinetry, flooring, major fixtures) before detail elements (hardware, paint colors, accessories). Each decision is presented with curated options based on your style preferences, documented in selection sheets for approval, and integrated into comprehensive specifications before construction begins."
  },
  {
    patterns: ["who does the work", "your workers", "trade contractors"],
    response: "Your project will be executed by a dedicated team including a lead designer (for design-build projects), experienced project manager who serves as your primary contact, skilled lead carpenter who oversees daily site operations, and specialized trade partners for systems like plumbing and electrical. You'll meet key team members before construction begins, and all personnel undergo background checks and proper identification when on your property."
  },
  {
    patterns: ["who will be in my home", "background checks", "worker screening"],
    response: "We understand the importance of security in your home. All team members undergo background screening before employment, arrive in company-identified vehicles and attire, and are introduced at project start. Your project manager provides supervision throughout construction, and we maintain strict protocols regarding home access, alarm codes, and security systems. We're happy to accommodate any specific security considerations you may have during your project."
  },

  // Initial Greeting - Updated with more comprehensive buttons
  {
    patterns: ["hi", "hello", "hey", "start", "begin"],
    response: "Hello! Welcome to Arxen Construction's chat support. How can I assist you today with your construction or remodeling needs?",
    buttons: [
      { text: "Services", url: "/services" },
      { text: "Free Estimate", url: "/free-estimate" },
      { text: "Portfolio", url: "/portfolio" }
    ]
  },

  // Emergency Assistance
  {
    patterns: ["emergency", "urgent repair", "immediate help needed", "disaster response"],
    response: "For construction emergencies requiring immediate attention, please call our 24/7 emergency line at (555) 987-6543. Our emergency response team can address urgent issues like water damage, structural concerns, or unsafe conditions. For active clients, please have your project number ready if available.",
    buttons: [
      { text: "Call Emergency Line", url: "tel:5559876543" },
      { text: "Report Emergency Online", url: "/emergency-service" }
    ]
  },

  // FAQ Section
  {
    patterns: ["frequently asked questions", "FAQ", "common questions", "questions and answers"],
    response: "Our FAQ section addresses common questions about our process, pricing structure, timeline expectations, warranty details, and more. You can browse by category or search for specific topics to find quick answers to your questions. Would you like me to address a specific question for you?",
    buttons: [
      { text: "View FAQ", url: "/resources/faq" },
      { text: "Client Resources", url: "/resources" }
    ]
  },

  // Download Resources
  {
    patterns: ["brochure", "download guide", "planning resources", "design tips"],
    response: "We offer several downloadable resources to help with your project planning. These include our design inspiration guide, project planning checklist, material selection guide, budget planning worksheet, and renovation survival guide. Which resource would be most helpful for your current needs?",
    buttons: [
      { text: "Download Resources", url: "/resources/downloads" },
      { text: "Project Planning Guide", url: "/resources/downloads/planning.pdf" }
    ]
  },

  // Service Area
  {
    patterns: ["service area", "where you work", "service locations", "do you work in"],
    response: "Arxen Construction serves the greater Atlanta metropolitan area, including Fulton, DeKalb, Cobb, Gwinnett, and Clayton counties. For projects outside our primary service area, we consider opportunities on a case-by-case basis. You can check if your location is within our service area using our interactive map tool.",
    buttons: [
      { text: "Check Service Area", url: "/service-area" },
      { text: "View Service Map", url: "/service-area#map" }
    ]
  },

  // Customer Testimonials
  {
    patterns: ["testimonials", "reviews", "what clients say", "customer feedback"],
    response: "Our clients' experiences speak volumes about our commitment to quality and service. We maintain a 4.8/5 star rating across review platforms, with over 200 verified client reviews. Our testimonials page features detailed accounts of completed projects with before and after images. Would you like to read reviews for a specific type of project?",
    buttons: [
      { text: "Read Testimonials", url: "/testimonials" },
      { text: "View Review Sites", url: "/reviews" }
    ]
  },

  // Human Support Transfer
  {
    patterns: ["speak to human", "real person", "live agent", "transfer to representative"],
    response: "I'd be happy to connect you with a member of our team for more personalized assistance. Our customer service representatives are available Monday-Friday from 8am-5pm Eastern time. Outside these hours, you can schedule a callback or leave a detailed message. Would you prefer a call, email, or to schedule a specific time to speak with someone?",
    buttons: [
      { text: "Call Now", url: "tel:5551234567" },
      { text: "Schedule Callback", url: "/contact/schedule-call" },
      { text: "Chat with Agent", action: "transferToAgent" }
    ]
  },

  // Photo Upload Option
  {
    patterns: ["share photos", "upload pictures", "send images", "show my project"],
    response: "Visual references help us better understand your project needs. You can upload photos of your current space, inspiration images, or specific areas of concern. Our system accepts JPG, PNG, and PDF files up to 10MB each. Would you like to share some images with us now?",
    buttons: [
      { text: "Upload Photos", action: "uploadPhoto" },
      { text: "Email Photos Later", url: "mailto:photos@arxenconstruction.com" }
    ]
  },

  // Special Promotions
  {
    patterns: ["current promotions", "special offers", "discounts", "seasonal specials"],
    response: "We occasionally offer specialized promotions throughout the year, such as our spring kitchen remodeling package, fall exterior renovation specials, or holiday season finish-before-guests programs. Our current promotions page has details on all active offers, including qualification criteria and special financing options through our partners.",
    buttons: [
      { text: "Current Promotions", url: "/promotions" },
      { text: "Seasonal Offers", url: "/promotions/seasonal" }
    ]
  },

  // Common Service Questions
  {
    patterns: ["how do you handle permits", "permit process explained", "who gets the permits"],
    response: "Our team handles the entire permit process for you. This includes preparing all required documentation, submitting applications to the appropriate jurisdictions, paying associated fees (which are included in your project cost), scheduling inspections, and addressing any questions from building officials. This comprehensive approach prevents delays and ensures all work is properly permitted and inspected.",
    buttons: [
      { text: "Permit Process", url: "/resources/permit-process" },
      { text: "Ask About Your Project", url: "/contact" }
    ]
  },
  {
    patterns: ["how long have you been in business", "company experience", "years of operation"],
    response: "Arxen Construction has been serving the Atlanta area since 2005. In our 19 years of operation, we've completed over 1,200 projects ranging from targeted renovations to complete home rebuilds and commercial buildouts. Our leadership team brings over 75 years of combined construction experience, and many of our skilled craftspeople have been with us for 10+ years.",
    buttons: [
      { text: "About Us", url: "/about" },
      { text: "Our Team", url: "/team" }
    ]
  },
  {
    patterns: ["do you provide references", "can I speak to past clients", "previous customer references"],
    response: "We're happy to provide references from past clients with projects similar to what you're considering. Once we understand your specific project needs, we can connect you with homeowners who have completed comparable renovations. We also encourage browsing our verified reviews on platforms like Houzz, Google, and GuildQuality, where we maintain a 4.8/5 star rating.",
    buttons: [
      { text: "Read Reviews", url: "/reviews" },
      { text: "Project Gallery", url: "/portfolio" }
    ]
  },
  {
    patterns: ["are you licensed and insured", "contractor license", "liability insurance"],
    response: "Yes, Arxen Construction is fully licensed, bonded, and insured. We maintain a General Contractor License (#ABC12345) in good standing, carry comprehensive liability insurance ($2M coverage), and maintain workers' compensation insurance for all employees. We're happy to provide certificates of insurance naming you or your property as additionally insured for your project.",
    buttons: [
      { text: "Credentials", url: "/about/credentials" },
      { text: "Insurance Details", url: "/about/insurance" }
    ]
  },
  
  // Process Questions
  {
    patterns: ["how do you protect my home", "construction dust control", "home protection during work"],
    response: "Protecting your home during construction is a top priority. Our protection protocols include HEPA filtration air scrubbers, zip-wall containment systems with negative air pressure, floor protection coverings, furniture protection, HVAC register sealing to prevent dust circulation, designated worker access paths, and daily cleaning procedures. For occupied renovations, we establish clear work zone boundaries with secure separation from living areas.",
    buttons: [
      { text: "Our Protection Process", url: "/resources/home-protection" },
      { text: "Client Testimonials", url: "/testimonials" }
    ]
  },
  {
    patterns: ["how do you handle changes", "what if I change my mind", "mid-project modifications"],
    response: "While our thorough planning process aims to finalize decisions before construction, we understand changes sometimes occur. Our change order process includes documenting the requested modification, providing clear pricing and timeline impacts, securing your approval before implementation, and integrating the changes into the master project schedule. This transparent approach prevents misunderstandings while accommodating evolving project needs.",
    buttons: [
      { text: "Our Process", url: "/process" },
      { text: "Planning Guide", url: "/resources/planning-guide.pdf" }
    ]
  },
  {
    patterns: ["who will be working on my project", "meet the team", "who does the work"],
    response: "Your project will be executed by a dedicated team including a lead designer (for design-build projects), experienced project manager who serves as your primary contact, skilled lead carpenter who oversees daily site operations, and specialized trade partners for systems like plumbing and electrical. You'll meet key team members before construction begins, and all personnel undergo background checks and proper identification when on your property.",
    buttons: [
      { text: "Meet Our Team", url: "/team" },
      { text: "Project Management Approach", url: "/process/management" }
    ]
  },
  {
    patterns: ["how do selections work", "choosing materials process", "selection appointments"],
    response: "Our selection process is designed to be enjoyable rather than overwhelming. Beginning with understanding your style preferences, we create curated options that align with both your aesthetic and budget. Selections follow a logical sequence—starting with foundational elements like cabinetry and flooring, followed by complementary components like countertops and tile, and finishing with detail elements like hardware and paint colors. Each selection is documented in detail to ensure accurate implementation.",
    buttons: [
      { text: "Selection Process", url: "/process/selections" },
      { text: "Design Center Tour", url: "/design-center" }
    ]
  },
  
  // Comparison Questions
  {
    patterns: ["what makes you different", "why choose you", "what sets you apart"],
    response: "What distinguishes us is our integrated approach combining design expertise with construction excellence. Key differentiators include our dedicated in-house carpentry team (not just project managers), comprehensive fixed-price contracts with detailed specifications, specialized selections guidance to prevent overwhelm, proprietary project management systems with daily updates, and our exceptional post-project support including industry-leading warranties and maintenance programs.",
    buttons: [
      { text: "Our Difference", url: "/about/difference" },
      { text: "Client Stories", url: "/testimonials" }
    ]
  },
  {
    patterns: ["design build vs general contractor", "architect or design build", "comparing construction approaches"],
    response: "The design-build model integrates design and construction under one team, while traditional approaches separate architects/designers from general contractors. Benefits of design-build include single-source accountability, streamlined communication, more accurate pricing (as designers understand construction costs), coordinated scheduling, and typically faster completion. This integration helps prevent the common disconnects that occur when design and construction teams operate independently.",
    buttons: [
      { text: "Design-Build Explained", url: "/services/design-build" },
      { text: "Process Comparison", url: "/resources/approach-comparison" }
    ]
  },
  {
    patterns: ["is cheapest bid best", "lowest price contractor", "comparing contractor bids"],
    response: "While price is certainly important, the lowest bid rarely delivers the best value. Critical factors beyond price include contract thoroughness (what's actually included), specification quality, team experience, project management systems, warranty terms, and communication processes. Unusually low bids often exclude important elements, use lower quality materials, or rely on change orders to reach profitability, resulting in higher final costs and frustration.",
    buttons: [
      { text: "Choosing a Contractor", url: "/resources/contractor-selection" },
      { text: "Understanding Estimates", url: "/resources/estimate-guide" }
    ]
  },
  {
    patterns: ["fixed price vs time and materials", "T&M vs fixed bid", "cost plus vs fixed contract"],
    response: "We primarily use fixed-price contracts as they provide clients with cost certainty. Fixed price means we've thoroughly specified all elements and guaranteed the price regardless of how long work takes. Time and materials contracts (also called cost-plus) charge for actual time spent plus materials with a markup, which shifts risk to homeowners. Our detailed planning process allows us to provide accurate fixed pricing while protecting you from unexpected costs.",
    buttons: [
      { text: "Contract Types", url: "/resources/contract-types" },
      { text: "Our Pricing Approach", url: "/process/pricing" }
    ]
  },
  
  // Specialty Questions
  {
    patterns: ["work in occupied home", "live during renovation", "stay during remodeling"],
    response: "Many of our projects are completed while homes remain occupied. Our approach for occupied renovations includes creating temporary facilities when needed (like kitchen stations), establishing contained work zones with separate access points, maintaining essential systems throughout construction, implementing enhanced dust control measures, establishing quiet hours for business calls or children's schedules, and daily site cleaning to maintain livability.",
    buttons: [
      { text: "Living Through Renovation", url: "/resources/occupied-renovation" },
      { text: "Client Experiences", url: "/blog/living-through-remodeling" }
    ]
  },
  {
    patterns: ["how to prepare for construction", "getting ready for remodeling", "prepare my home for renovation"],
    response: "Preparing for construction helps ensure a smooth project. Recommended steps include clearing work areas of personal items, designating storage space for delivered materials, establishing temporary living arrangements if needed, protecting valuables from dust, discussing security procedures (alarm codes, pet containment), identifying parking arrangements for crews, and informing neighbors about the upcoming project. We provide a detailed pre-construction checklist tailored to your specific project.",
    buttons: [
      { text: "Pre-Construction Checklist", url: "/resources/preparation-guide.pdf" },
      { text: "Project Planning", url: "/process/planning" }
    ]
  },
  {
    patterns: ["problem materials supply", "construction material shortages", "material availability issues"],
    response: "Supply chain challenges have affected construction in recent years. Our proactive approach includes early material selection and ordering for critical items (typically 6-8 weeks before needed), maintaining relationships with multiple suppliers for sourcing flexibility, storing certain materials in our warehouse when necessary, providing realistic lead time updates during selection, and sometimes suggesting alternatives when original choices face extreme delays.",
    buttons: [
      { text: "Material Planning", url: "/process/materials" },
      { text: "Current Lead Times", url: "/resources/lead-times" }
    ]
  },
  {
    patterns: ["handle construction waste", "debris removal", "construction recycling"],
    response: "Responsible waste management is part of our environmental commitment. Our approach includes separated recycling for metal, wood, cardboard, and concrete materials, donation of reusable fixtures and materials when possible, proper disposal of any hazardous materials according to regulations, regular site cleanup to prevent accumulation, and complete final cleaning including HEPA vacuuming of all surfaces. This systematic approach keeps your property clean while minimizing environmental impact.",
    buttons: [
      { text: "Environmental Practices", url: "/about/sustainability" },
      { text: "Recycling Program", url: "/about/recycling" }
    ]
  },

  // Specific Service Questions
  {
    patterns: ["do you offer design only", "just need design", "design without construction"],
    response: "Yes, we do offer standalone design services for clients who aren't yet ready for construction or who may have their own contractor relationships. Our design-only packages include conceptual design development, detailed construction drawings, 3D visualizations, material specifications, and itemized cost estimates. These comprehensive packages provide everything needed for accurate bidding and proper construction execution, even if we're not handling the build phase.",
    buttons: [
      { text: "Design Services", url: "/services/design-only" },
      { text: "Design Portfolio", url: "/portfolio/design" }
    ]
  },
  {
    patterns: ["work with challenging lots", "steep slope construction", "difficult site building"],
    response: "We specialize in challenging site conditions that require creative solutions. Our experience includes steep slope construction with engineered foundation systems, restricted urban lots requiring careful logistics planning, properties with water management issues, historic districts with strict preservation requirements, and sites with limited access requiring specialized equipment. These projects benefit from our thorough pre-construction planning approach that anticipates and resolves site challenges.",
    buttons: [
      { text: "Challenging Site Projects", url: "/portfolio/challenging-sites" },
      { text: "Site Assessment", url: "/services/site-assessment" }
    ]
  },
  {
    patterns: ["priority scheduling", "expedited project", "faster timeline", "rush job possible"],
    response: "While we pride ourselves on thorough planning, we understand some projects require accelerated timelines. For urgent needs, we offer priority scheduling options including expedited design phases, pre-ordering of critical materials, extended work hours including weekends when appropriate, and additional crew allocation. This approach can reduce timelines by 15-30% depending on project type, though some premium costs apply due to the additional resources required.",
    buttons: [
      { text: "Priority Services", url: "/services/expedited" },
      { text: "Schedule Consultation", url: "/contact#priority" }
    ]
  },
  {
    patterns: ["future expandability", "plan for later addition", "phase future expansion"],
    response: "Designing for future expansion requires thoughtful planning today. Our approach includes creating master plans that anticipate future phases, engineering foundations and structures to support additional loads, installing appropriately sized mechanical/electrical systems with expansion capacity, installing necessary utility rough-ins for future connections, and documenting 'hidden' elements with detailed as-built drawings for reference during future phases.",
    buttons: [
      { text: "Expansion Planning", url: "/services/future-planning" },
      { text: "Phased Project Examples", url: "/portfolio/phased-projects" }
    ]
  },
  
  // Technical Construction Questions
  {
    patterns: ["engineering requirements", "structural engineering", "need an engineer"],
    response: "Many projects require engineering input to ensure structural integrity and code compliance. We have established relationships with licensed structural, mechanical, and civil engineers who collaborate on our projects as needed. Engineering services are integrated into our process when required for beam sizing, load calculations, foundation design, specialized HVAC design, site drainage solutions, or when required by building departments for permit approval.",
    buttons: [
      { text: "Our Process", url: "/process/engineering" },
      { text: "Engineering Partners", url: "/about/partners#engineering" }
    ]
  },
  {
    patterns: ["construction methods", "building techniques", "how you build", "construction quality"],
    response: "Our construction methodology emphasizes quality through proper technique. Key approaches include utilizing moisture management systems that exceed code minimums, implementing enhanced insulation and air-sealing packages, using premium fastening and connection methods, following manufacturer specifications precisely for all materials, conducting regular quality control inspections at critical stages, and employing specialized subcontractors for highly technical systems like waterproofing.",
    buttons: [
      { text: "Construction Standards", url: "/about/standards" },
      { text: "Quality Control Process", url: "/process/quality" }
    ]
  },
  {
    patterns: ["what brand products", "product manufacturers", "preferred product lines", "material brands"],
    response: "We select materials based on performance, reliability, and value rather than exclusively using specific brands. That said, we've developed preferences based on experience: Kohler and Moen for plumbing fixtures, GE and Bosch for appliances, Sherwin Williams for paints, Schlage for door hardware, Andersen and Marvin for windows, and Armstrong and Mannington for flooring. We're happy to work with your preferred brands as well, provided they meet our quality standards.",
    buttons: [
      { text: "Product Showcase", url: "/resources/preferred-products" },
      { text: "Material Selection Process", url: "/process/materials" }
    ]
  },
  {
    patterns: ["moisture prevention", "prevent mold", "water intrusion", "humidity control"],
    response: "Effective moisture management is critical for long-term home health. Our comprehensive approach includes proper site drainage systems, foundation waterproofing that exceeds code requirements, weather-resistant barrier systems with integrated flashing details, appropriate ventilation in wet areas, strategic vapor barrier placement based on climate, humidity control systems when needed, and moisture-resistant material selection in prone areas. This systematic approach prevents the conditions that lead to mold growth and water damage.",
    buttons: [
      { text: "Moisture Control Systems", url: "/resources/moisture-management" },
      { text: "Prevention Technology", url: "/services/building-science" }
    ]
  },
  
  // Timing and Scheduling Questions
  {
    patterns: ["how far out scheduled", "current wait time", "scheduling availability", "when could you start"],
    response: "Our current scheduling availability varies by project type. Design consultations can typically be scheduled within 1-2 weeks. For construction starts, our schedule is currently booking about 6-8 weeks out for smaller projects (bathrooms, etc.) and 8-12 weeks for larger projects (kitchens, additions, whole home). This lead time allows for thorough planning, material pre-ordering, and proper resource allocation to ensure smooth project execution once construction begins.",
    buttons: [
      { text: "Check Availability", url: "/schedule/availability" },
      { text: "Reserve Consultation", url: "/schedule" }
    ]
  },
  {
    patterns: ["ideal season", "best time of year", "seasonal considerations", "when to schedule"],
    response: "Project timing considerations vary by type. Exterior projects (roofing, siding, outdoor living) benefit from spring through fall scheduling in our climate. Interior projects can be performed year-round, though winter often offers better scheduling availability. Kitchen renovations are sometimes planned around holiday entertaining needs, while whole-house renovations might align with vacation periods. We work with you to identify timing that balances logistical factors with your personal schedule requirements.",
    buttons: [
      { text: "Scheduling Guide", url: "/resources/project-timing" },
      { text: "Check Seasonal Availability", url: "/schedule/seasons" }
    ]
  },
  {
    patterns: ["project sequence", "construction order", "renovation sequence", "building order"],
    response: "Effective construction follows a logical sequence: site preparation and demolition first, followed by structural modifications, rough plumbing/electrical/mechanical systems, insulation, drywall, trim carpentry, cabinetry installation, countertop templating and installation, tile and flooring, fixture installation, final mechanical connections, and finish details like hardware and paint. This sequence ensures work progresses efficiently with each stage properly prepared for subsequent phases.",
    buttons: [
      { text: "Construction Phases", url: "/process/construction-phases" },
      { text: "Project Timeline Examples", url: "/resources/timelines" }
    ]
  },
  {
    patterns: ["typical delays", "causes of delays", "schedule problems", "timeline issues"],
    response: "While we plan thoroughly to prevent delays, certain factors can affect timelines. Common causes include discovering concealed conditions during demolition (like hidden water damage or substandard previous work), material delays from manufacturers, inspection scheduling constraints, client-initiated changes, weather impacts on exterior work, and occasionally trade partner scheduling conflicts. We mitigate these through contingency planning, early material ordering, and maintaining buffer periods in the schedule.",
    buttons: [
      { text: "Our Planning Process", url: "/process/planning" },
      { text: "Timeline Management", url: "/about/scheduling" }
    ]
  },
  
  // Post-Project Questions
  {
    patterns: ["after project completion", "once job is done", "after construction", "project closeout"],
    response: "Our relationship continues after construction completion. The project closeout process includes a detailed final walkthrough with documentation of any minor items needing attention, completion of any identified punch list items, collection of all warranty information and product manuals in a project binder, guidance on routine maintenance for new features, follow-up inspections at 60 days and 11 months, and ongoing availability for questions or future projects.",
    buttons: [
      { text: "Project Closeout Process", url: "/process/closeout" },
      { text: "Warranty Services", url: "/services/warranty" }
    ]
  },
  {
    patterns: ["care for new", "maintenance requirements", "how to care", "upkeep needed"],
    response: "Different materials and systems require specific maintenance for optimal performance and longevity. Upon project completion, we provide comprehensive care information including recommended cleaning products and methods for various surfaces, scheduled maintenance requirements for mechanical systems, seasonal preventative maintenance recommendations, manufacturer-specific guidelines for appliances and fixtures, and professional service resources when specialized maintenance is required.",
    buttons: [
      { text: "Maintenance Guides", url: "/resources/maintenance" },
      { text: "Care Tips", url: "/blog/maintenance-tips" }
    ]
  },
  {
    patterns: ["future additions", "more projects later", "add on later", "phased approach"],
    response: "Many clients complete projects in phases over time, and we design with future additions in mind. Our master planning approach accounts for future projects through strategic structural provisions, intentional mechanical/electrical capacity, detailed documentation of behind-wall elements, consideration of future connection points, and design elements that will integrate seamlessly with planned additions. This forward-thinking approach streamlines future phases and prevents rework.",
    buttons: [
      { text: "Master Planning Services", url: "/services/master-planning" },
      { text: "Phased Project Gallery", url: "/portfolio/phased-projects" }
    ]
  },
  {
    patterns: ["refer friends", "recommend to others", "referral program", "share with friends"],
    response: "Client referrals are the highest compliment we can receive. We offer a referral appreciation program where clients who refer friends or family receive a thank-you gift when their referral completes a project with us. Many clients also participate in our occasional home tours or serve as references for prospective clients with projects similar to theirs. We're deeply grateful for the trust shown when clients recommend our services to their personal connections.",
    buttons: [
      { text: "Referral Program", url: "/about/referrals" },
      { text: "Share Your Experience", url: "/about/reviews" }
    ]
  },

  // END CHAT COMMANDS AND FEEDBACK - NEW SECTION
  {
    patterns: ['end chat', 'close chat', 'goodbye', 'bye', 'exit', 'quit', 'end conversation', 'stop chatting', 'that\'s all'],
    response: "Before you go, would you mind rating your chat experience with us today? Your feedback helps us improve.",
    type: 'end-chat',
    buttons: [
      { text: "Rate Your Experience", action: "show-feedback" },
      { text: "Skip", action: "end-chat" }
    ]
  },
  
  // Clearer close chat option
  {
    patterns: ['close', 'end session'],
    response: "Would you like to end this chat session?",
    buttons: [
      { text: "Yes, End Chat", action: "show-feedback" },
      { text: "No, Continue", action: "continue-chat" }
    ]
  }
]; // Keep this final closing bracket for the array

// Define button action functions
const buttonActions = {
  uploadPhoto: function() {
    // Trigger photo upload functionality
    console.log("Photo upload triggered");
    // Implementation would connect to file upload system
  },
  transferToAgent: function() {
    // Transfer chat to live agent
    console.log("Transferring to live agent");
    // Implementation would connect to live agent system
  },
  chatHistory: function() {
    // Display chat history (for clock icon)
    console.log("Showing chat history");
    // Implementation would retrieve and display chat history
  },
  shareConversation: function() {
    // Share conversation (for arrow icon)
    console.log("Preparing to share conversation");
    // Implementation would enable sharing options
  }
};

// Define header button functions (for clock and arrow icons)
const headerButtons = {
  clock: {
    tooltip: "Chat History",
    action: "chatHistory",
    description: "View your conversation history and previous interactions"
  },
  arrow: {
    tooltip: "Share Conversation",
    action: "shareConversation",
    description: "Share this conversation via email or download a transcript"
  }
};

// Global chat configuration
const chatConfig = {
  initialGreeting: "Hello! Welcome to Arxen Construction's chat support. How can I assist you today?",
  offlineMessage: "Our chat support is currently offline. Please leave a message and we'll respond when we're back online.",
  businessHours: "Monday-Friday: 8am-5pm EST",
  maxAttachmentSize: "10MB",
  supportEmail: "support@arxenconstruction.com",
  supportPhone: "(555) 123-4567",
  emergencyPhone: "(555) 987-6543"
};

export { 
  commonConversationEntries, 
  buttonActions, 
  headerButtons,
  chatConfig
}; 