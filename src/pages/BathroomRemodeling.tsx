import React from 'react';
import ServiceTemplate from './ServiceTemplate';
import { usePropertyType } from '../components/PropertyTypeContext';

const BathroomRemodeling: React.FC = () => {
  // Use our property type context
  const { propertyType } = usePropertyType();
  
  // Define property-specific features and benefits
  const getPropertySpecificContent = (propertyType: { id: string; name: string } | null) => {
    const propertyTypeId = propertyType?.id || '';
    
    switch(propertyTypeId) {
      case 'single-family':
        return {
          features: [
            "Luxurious master bath designs",
            "Family-friendly bathroom solutions",
            "Custom vanities and cabinetry",
            "High-end fixture installation",
            "Spa-like shower systems",
            "Dual sink options for shared bathrooms",
            "Innovative storage solutions"
          ],
          benefits: [
            "Increase your home's resale value by up to 65% of the remodel cost",
            "Create a spa-like retreat in your own home",
            "Address the needs of a growing family with functional design",
            "Reduce water consumption with modern fixtures"
          ],
          processSteps: [
            { 
              title: "Bathroom Assessment", 
              description: "We'll discuss your family's needs and evaluate your current bathroom layout."
            },
            { 
              title: "Design Development", 
              description: "Our designers will create a bathroom layout that maximizes space and functionality for family use."
            },
            { 
              title: "Material Selection", 
              description: "Choose from our curated selection of durable, family-friendly materials and fixtures."
            },
            { 
              title: "Construction Phase", 
              description: "Our skilled craftsmen complete the transformation with attention to waterproofing and quality installation."
            },
            { 
              title: "Final Inspection", 
              description: "We'll test all fixtures and ensure the bathroom meets our high standards before the final reveal."
            }
          ],
          pricingInfo: {
            startingAt: "$25,000",
            averageRange: "$25,000 - $50,000",
            highEnd: "$50,000+",
            description: "Single-family bathroom remodels can range widely based on size, fixture quality, and scope. Master bathroom remodels typically fall on the higher end of the scale with more amenities and premium features."
          }
        };
      case 'townhouse':
        return {
          features: [
            "Space-optimized bathroom layouts for townhouses",
            "Water-efficient fixtures",
            "Creative storage solutions for limited space",
            "Strategic lighting to enhance space perception",
            "HOA-compliant renovation solutions",
            "Noise-reduction considerations for shared walls"
          ],
          benefits: [
            "Maximize functionality in your townhouse's compact bathroom",
            "Increase property value with modern, urban-friendly designs",
            "Enjoy spa-like features despite space limitations",
            "Improve daily routines with efficient bathroom layout"
          ],
          processSteps: [
            { 
              title: "Site Evaluation", 
              description: "We'll assess your townhouse bathroom's specific constraints and HOA requirements."
            },
            { 
              title: "Space-Maximizing Design", 
              description: "Our designers will create a layout that makes the most of limited townhouse bathroom dimensions."
            },
            { 
              title: "Material and Fixture Selection", 
              description: "Choose from our selection of space-enhancing materials and fixtures ideal for townhouse bathrooms."
            },
            { 
              title: "Streamlined Construction", 
              description: "Our experienced team will work efficiently while respecting townhouse community guidelines."
            },
            { 
              title: "Quality Assurance", 
              description: "We'll thoroughly inspect the completed bathroom to ensure it meets our high standards."
            }
          ],
          pricingInfo: {
            startingAt: "$20,000",
            averageRange: "$20,000 - $45,000",
            highEnd: "$45,000+",
            description: "Townhouse bathroom remodels often feature space-saving solutions and may need to work within HOA guidelines, with costs reflecting the complexity of working in more compact spaces with potential building restrictions."
          }
        };
      case 'condo-apt':
        return {
          features: [
            "Compact bathroom designs for condos and apartments",
            "Building code-compliant renovation solutions",
            "Multi-functional fixtures to maximize space",
            "Water damage prevention for multi-unit buildings",
            "Sound insulation considerations",
            "Ventilation solutions for building systems"
          ],
          benefits: [
            "Transform your bathroom without violating building regulations",
            "Maximize limited space with smart design solutions",
            "Increase your unit's value with modern bathroom upgrades",
            "Enjoy luxury features even in compact spaces"
          ],
          processSteps: [
            { 
              title: "Building Regulation Review", 
              description: "We'll analyze your condo/apartment building rules to ensure a compliant renovation."
            },
            { 
              title: "Small-Space Design", 
              description: "Our designers specialize in creating luxurious bathrooms in compact condo spaces."
            },
            { 
              title: "Building Approval Process", 
              description: "We'll help navigate the building approval process and prepare required documentation."
            },
            { 
              title: "Controlled Construction", 
              description: "Our team works with careful consideration of building hours and shared spaces."
            },
            { 
              title: "Final Verification", 
              description: "We ensure all work meets building codes and your personal standards."
            }
          ],
          pricingInfo: {
            startingAt: "$18,000",
            averageRange: "$18,000 - $40,000",
            highEnd: "$40,000+",
            description: "Condo/apartment bathroom renovations require specialized knowledge of building systems and regulations, with costs reflecting additional coordination with building management and working within strict guidelines."
          }
        };
      case 'multi-family':
        return {
          features: [
            "Durable bathroom designs for multiple users",
            "High-traffic flooring and fixture solutions",
            "Easy-clean surface selections",
            "Moisture-resistant materials",
            "Water-efficient fixtures",
            "Simplified maintenance features"
          ],
          benefits: [
            "Create bathrooms that serve multiple households efficiently",
            "Improve rental appeal with modern, durable bathrooms",
            "Reduce maintenance calls with appropriate material choices",
            "Increase property value with quality upgrades"
          ],
          processSteps: [
            { 
              title: "Usage Pattern Assessment", 
              description: "We'll analyze how the bathrooms are used by multiple residents to create the optimal design."
            },
            { 
              title: "Durability-Focused Design", 
              description: "Our designers will select layouts and features optimized for multi-user environments."
            },
            { 
              title: "High-Performance Material Selection", 
              description: "We'll prioritize materials that stand up to high-traffic use and frequent cleaning."
            },
            { 
              title: "Minimal-Disruption Construction", 
              description: "Our team can coordinate phased work to minimize impact on tenants or family members."
            },
            { 
              title: "Comprehensive Testing", 
              description: "We'll rigorously test all fixtures and features to ensure long-term performance."
            }
          ],
          pricingInfo: {
            startingAt: "$20,000",
            averageRange: "$20,000 - $45,000 per unit",
            highEnd: "$45,000+ per unit",
            description: "Multi-family bathroom remodels emphasize durability and ease of maintenance, with pricing reflecting commercial-grade materials and fixtures designed to withstand frequent use by multiple residents."
          }
        };
      default:
        return {
          features: [
            "Custom bathroom layout design",
            "Premium fixture selection",
            "Vanity and cabinetry options",
            "Shower and tub installations",
            "Tile and flooring solutions",
            "Lighting and ventilation improvements",
            "Accessibility considerations"
          ],
          benefits: [
            "Increase your property value",
            "Create a more functional personal space",
            "Update outdated fixtures and features",
            "Improve water efficiency and reduce utility costs"
          ],
          processSteps: [
            { 
              title: "Initial Consultation", 
              description: "We'll discuss your vision, budget, and timeline for your bathroom renovation."
            },
            { 
              title: "Design Creation", 
              description: "Our designers will develop detailed plans and 3D renderings of your new bathroom."
            },
            { 
              title: "Material Selection", 
              description: "Choose from our extensive selection of tiles, fixtures, vanities, and accessories."
            },
            { 
              title: "Expert Installation", 
              description: "Our skilled craftsmen will transform your bathroom with precision and attention to detail."
            },
            { 
              title: "Final Walkthrough", 
              description: "We'll ensure everything meets our quality standards and your expectations."
            }
          ],
          pricingInfo: {
            startingAt: "$22,000",
            averageRange: "$22,000 - $45,000",
            highEnd: "$45,000+",
            description: "Bathroom remodeling costs vary based on size, fixture quality, layout changes, and special features. Contact us for a personalized estimate tailored to your specific needs and goals."
          }
        };
    }
  };

  // Generate content based on property type
  const { features, benefits, processSteps, pricingInfo } = getPropertySpecificContent(propertyType);

  return (
    <ServiceTemplate
      title="Bathroom Remodeling"
      description="Transform your bathroom into a beautiful, functional space with our comprehensive remodeling services. From luxury master bathrooms to efficient guest baths, we deliver quality craftsmanship and stunning designs."
      features={features}
      benefits={benefits}
      processSteps={processSteps}
      pricingInfo={pricingInfo}
      imageUrl="https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
      category="Interior Remodeling"
      relatedServices={[
        { title: "Kitchen Remodeling", path: "/services/kitchen-remodeling" },
        { title: "Custom Tile Work", path: "/services/custom-tile-work" },
        { title: "Plumbing Services", path: "/services/plumbing" }
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        "https://images.unsplash.com/photo-1600607687644-c7ddd0d03d62"
      ]}
    />
  );
};

export default BathroomRemodeling; 