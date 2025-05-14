import React from 'react';
import ServiceTemplate from './ServiceTemplate';
import { useLocation } from 'react-router-dom';
import { usePropertyType } from '../components/PropertyTypeContext';

const KitchenRemodeling: React.FC = () => {
  const location = useLocation();
  
  // Use our new property type context
  const { propertyType } = usePropertyType();
  
  // Define property-specific features and benefits
  const getPropertySpecificContent = (propertyType: { id: string; name: string } | null) => {
    const propertyTypeId = propertyType?.id || '';
    
    switch(propertyTypeId) {
      case 'single-family':
        return {
          features: [
            "Custom cabinet design tailored for family homes",
            "Open concept layouts for single-family living",
            "Premium countertop solutions",
            "Modern appliance integration",
            "Lighting design and installation",
            "Island and breakfast bar options",
            "Pantry and storage solutions"
          ],
          benefits: [
            "Increase your home's resale value by up to 70% of the remodel cost",
            "Create a central gathering space for family meals and activities",
            "Improve functionality with a layout designed for family living",
            "Reduce energy costs with modern, energy-efficient appliances"
          ],
          processSteps: [
            { 
              title: "Initial Design Consultation", 
              description: "We'll discuss your family's needs, style preferences, and budget to create a kitchen that works for everyone."
            },
            { 
              title: "Custom Design Creation", 
              description: "Our designers will create a layout optimized for family homes, focusing on traffic flow and functional zones."
            },
            { 
              title: "Material Selection", 
              description: "Choose from our curated selection of durable, family-friendly materials that balance beauty and practicality."
            },
            { 
              title: "Construction Phase", 
              description: "Our skilled craftsmen transform your kitchen with minimal disruption to your family routine."
            },
            { 
              title: "Final Walkthrough", 
              description: "We'll ensure every detail meets our standards and your family loves the new space."
            }
          ],
          pricingInfo: {
            startingAt: "$35,000",
            averageRange: "$35,000 - $75,000",
            highEnd: "$75,000+",
            description: "Single-family home kitchen remodels typically involve larger spaces and more extensive work, with costs varying based on layout changes, material quality, and appliance selections."
          }
        };
      case 'townhouse':
        return {
          features: [
            "Space-maximizing layouts for townhouse kitchens",
            "Efficient storage solutions",
            "Premium materials in compact designs",
            "Vertical space utilization strategies",
            "Seamless integration with adjacent living spaces",
            "Appliances selected for townhouse dimensions"
          ],
          benefits: [
            "Maximize functionality in your townhouse's limited square footage",
            "Increase property value in the competitive townhouse market",
            "Create an elegant entertaining space despite spatial constraints",
            "Improve daily living with an ergonomic, efficient design"
          ],
          processSteps: [
            { 
              title: "Site Assessment", 
              description: "We'll evaluate your townhouse's specific dimensions and HOA requirements to create a compliant design."
            },
            { 
              title: "Space Planning", 
              description: "Our designers will develop a layout that maximizes every inch while maintaining an open feel."
            },
            { 
              title: "Material Selection", 
              description: "Choose from our selection of space-enhancing materials and finishes ideal for townhouse dimensions."
            },
            { 
              title: "Construction", 
              description: "Our experienced team will work efficiently within your townhouse community's guidelines."
            },
            { 
              title: "Final Inspection", 
              description: "We'll walk through the completed kitchen to ensure it meets all specifications and expectations."
            }
          ],
          pricingInfo: {
            startingAt: "$28,000",
            averageRange: "$28,000 - $60,000",
            highEnd: "$60,000+",
            description: "Townhouse kitchen remodels are typically more compact and may involve working within HOA constraints, but still deliver high-impact transformation through thoughtful design and material selection."
          }
        };
      case 'condo-apt':
        return {
          features: [
            "Compact design strategies for condo/apartment kitchens",
            "Multi-functional elements to maximize limited space",
            "Building-compliant renovation solutions",
            "Sound-dampening considerations for multi-unit living",
            "Maintenance-friendly material options",
            "Space-saving appliance selection"
          ],
          benefits: [
            "Transform your kitchen without violating condo association rules",
            "Maximize limited space with smart storage solutions",
            "Increase your unit's market value in a competitive market",
            "Enjoy a custom kitchen that respects building limitations"
          ],
          processSteps: [
            { 
              title: "Building Review", 
              description: "We'll review your condo/apartment building rules and restrictions to ensure a compliant renovation."
            },
            { 
              title: "Space Optimization Planning", 
              description: "Our designers specialize in maximizing function in compact kitchen spaces."
            },
            { 
              title: "Condo Board Approval", 
              description: "We'll help prepare and submit all necessary documentation to your building management."
            },
            { 
              title: "Building-Friendly Construction", 
              description: "Our team works with building schedules and elevator access to minimize disruption."
            },
            { 
              title: "Final Inspection", 
              description: "We ensure the kitchen meets both building requirements and your expectations."
            }
          ],
          pricingInfo: {
            startingAt: "$25,000",
            averageRange: "$25,000 - $55,000",
            highEnd: "$55,000+",
            description: "Condo/apartment kitchen renovations require specialized expertise to work within building regulations and space constraints, but can deliver impressive results with the right design approach."
          }
        };
      case 'multi-family':
        return {
          features: [
            "Durable designs for multi-family use",
            "Efficient layouts for shared kitchen spaces",
            "Hard-wearing material selections",
            "Simplified maintenance considerations",
            "Multiple workstation configurations",
            "Enhanced storage solutions for multiple users"
          ],
          benefits: [
            "Create a functional space that serves multiple households",
            "Improve rental appeal with a modern, efficient kitchen",
            "Increase property value with durable, quality materials",
            "Reduce maintenance issues with appropriate material choices"
          ],
          processSteps: [
            { 
              title: "Usage Assessment", 
              description: "We'll analyze how the kitchen will be used by multiple residents to create the right design."
            },
            { 
              title: "Durability Planning", 
              description: "Our designers will select materials and layouts optimized for high-traffic, multi-user environments."
            },
            { 
              title: "Maintenance Consideration", 
              description: "We'll prioritize easy-clean, long-lasting solutions throughout the design."
            },
            { 
              title: "Phased Construction", 
              description: "Our team can work in stages to minimize disruption to tenants or family members."
            },
            { 
              title: "Quality Assurance", 
              description: "We'll ensure the finished kitchen stands up to the demands of multi-family use."
            }
          ],
          pricingInfo: {
            startingAt: "$30,000",
            averageRange: "$30,000 - $65,000 per unit",
            highEnd: "$65,000+ per unit",
            description: "Multi-family kitchen remodels focus on durability and efficiency, with pricing reflecting the need for commercial-grade materials and multi-user functionality."
          }
        };
      default:
        return {
          features: [
            "Custom cabinet design",
            "Premium countertop options",
            "Appliance selection and installation",
            "Lighting design and fixtures",
            "Flooring selection and installation",
            "Plumbing fixture updates",
            "Kitchen island options"
          ],
          benefits: [
            "Increase your home's value",
            "Create a more functional cooking and gathering space",
            "Modernize outdated elements",
            "Customize to your specific needs and style"
          ],
          processSteps: [
            { 
              title: "Consultation & Planning", 
              description: "We'll discuss your vision, budget, and timeline to create a comprehensive plan."
            },
            { 
              title: "Design & Selection", 
              description: "Our designers will create detailed plans and help you select materials and fixtures."
            },
            { 
              title: "Pre-Construction Preparation", 
              description: "We'll handle all necessary permits and prepare your home for construction."
            },
            { 
              title: "Construction Phase", 
              description: "Our expert craftsmen will transform your kitchen with attention to every detail."
            },
            { 
              title: "Final Inspection & Reveal", 
              description: "We'll ensure everything meets our high standards before revealing your beautiful new kitchen."
            }
          ],
          pricingInfo: {
            startingAt: "$30,000",
            averageRange: "$30,000 - $65,000",
            highEnd: "$65,000+",
            description: "Kitchen remodeling costs vary based on scope, materials, and layout changes. Contact us for a personalized estimate based on your specific needs and goals."
          }
        };
    }
  };

  // Generate content based on property type
  const { features, benefits, processSteps, pricingInfo } = getPropertySpecificContent(propertyType);

  return (
    <ServiceTemplate
      title="Kitchen Remodeling"
      description="Transform your kitchen into a beautiful, functional space. Our kitchen remodeling services include custom cabinets, countertops, islands, appliance installation, and more."
      features={features}
      benefits={benefits}
      processSteps={processSteps}
      pricingInfo={pricingInfo}
      imageUrl="https://images.unsplash.com/photo-1556911220-e15b29be8c8f"
      category="Interior Remodeling"
      relatedServices={[
        { title: "Bathroom Remodeling", path: "/services/bathroom-remodeling" },
        { title: "Custom Cabinetry", path: "/services/custom-cabinetry" },
        { title: "Interior Painting", path: "/services/interior-painting" }
      ]}
      galleryImages={[
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d",
        "https://images.unsplash.com/photo-1583608564710-908b03608b44"
      ]}
    />
  );
};

export default KitchenRemodeling; 