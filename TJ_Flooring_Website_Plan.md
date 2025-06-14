# TJ Flooring Website Transformation Plan

## Project Overview
This document outlines the plan to transform the existing ARXEN construction website into a specialized flooring company website for TJ Flooring. The focus will be on bathroom remodeling, tile installation, and general flooring work.

## Current Codebase Analysis

The ARXEN website is built with:
- React with TypeScript (using Vite)
- React Router for navigation
- EmailJS for contact forms
- Tailwind CSS for styling
- Various React components for UI elements
- Responsive design for mobile and desktop

Key existing pages and components:
- Home page with service highlights
- Service pages (including FlooringServicesPage)
- Contact form with validation
- Free estimate request form
- About page with company information
- Portfolio showcase

## Transformation Strategy

### 1. Project Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Update package.json with new project name and version
4. Configure environment variables for API keys

### 2. Key Changes Required

#### Branding Changes
- Update company name from ARXEN to TJ Flooring throughout the site
- Replace logo and favicon
- Update color scheme to match TJ Flooring brand
- Replace team member information on About page
- Update company history and values

#### Content Focus Changes
- Modify homepage to highlight flooring services
- Update service pages to focus on:
  - Bathroom remodeling
  - Tile installation
  - Hardwood flooring
  - Luxury vinyl flooring
  - Laminate flooring
  - Carpet installation
- Remove or repurpose construction-specific services
- Update portfolio with flooring-specific projects
- Modify testimonials to reflect flooring services

#### Page Structure Changes
- Simplify navigation to focus on core flooring services
- Update service categories
- Modify Free Estimate form to be flooring-specific
- Update FAQ content for flooring-related questions

#### Technical Updates
- Update SEO metadata for flooring keywords
- Configure EmailJS with TJ Flooring email
- Update Google Maps API for TJ Flooring location
- Set up analytics for the new site

### 3. Required Credentials

- EmailJS account and API keys
- Google Maps API key
- Analytics account (Vercel Analytics is currently used)
- Hosting credentials

## Implementation Plan

### Phase 1: Setup and Branding
1. Set up development environment
2. Update branding elements (logo, colors, company name)
3. Modify About page with TJ Flooring information
4. Update contact information

### Phase 2: Content Restructuring
1. Update homepage to focus on flooring services
2. Modify/create service pages for:
   - Bathroom remodeling
   - Tile installation
   - Hardwood flooring
   - Luxury vinyl flooring
   - Laminate flooring
   - Carpet installation
3. Update portfolio with flooring projects
4. Modify testimonials
5. Update FAQ content

### Phase 3: Technical Configuration
1. Configure EmailJS with TJ Flooring email
2. Update Google Maps API for TJ Flooring location
3. Update SEO metadata for flooring keywords
4. Set up analytics

### Phase 4: Testing and Deployment
1. Test all forms and functionality
2. Perform cross-browser testing
3. Optimize for mobile devices
4. Deploy to production

## Files Requiring Major Changes

1. `src/App.tsx` - Update routes and main layout
2. `src/pages/About.tsx` - Update company information
3. `src/pages/FlooringServicesPage.tsx` - Update content to focus on TJ Flooring services
4. `src/pages/BathroomRemodeling.tsx` - Update to focus on bathroom flooring
5. `src/pages/FreeEstimate/FreeEstimate.tsx` - Modify form for flooring-specific options
6. `src/components/Footer.tsx` - Update contact information and links
7. `src/data/testimonials.js` - Update with flooring-specific testimonials
8. `src/components/HomeSEO.tsx` - Update SEO metadata for flooring

## Testing and Maintenance

### Testing Checklist
- Form submissions (Contact, Free Estimate)
- Responsive design on all devices
- Cross-browser compatibility
- Page load speed
- SEO meta tags

### Ongoing Maintenance
- Regular content updates
- Portfolio additions
- Testimonial updates
- SEO optimization

## Timeline

- Phase 1 (Setup and Branding): 1 week
- Phase 2 (Content Restructuring): 2 weeks
- Phase 3 (Technical Configuration): 1 week
- Phase 4 (Testing and Deployment): 1 week

Total estimated time: 5 weeks