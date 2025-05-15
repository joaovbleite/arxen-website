// API route for Vercel to prerender key pages
export default async function handler(req, res) {
  // This function doesn't actually need to do anything
  // The mere existence of this file with exports.config below
  // tells Vercel to prerender these routes
  res.status(200).json({ status: 'ok' });
}

// Export config for Vercel to prerender key pages
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Use the same region as your deployment
  isr: {
    // List of key pages to prerender and use ISR (Incremental Static Regeneration)
    // These pages will be pre-rendered at build time
    // and then revalidated and updated in the background after deploy
    paths: [
      '/',                            // Home page
      '/about',                       // About page
      '/contact',                     // Contact page
      '/services/kitchen-remodeling', // Key service pages
      '/services/bathroom-remodeling',
      '/services/hardwood',
      '/commercial',                  // Commercial services
      '/residential',                 // Residential services
      '/free-estimate',               // Important conversion page
    ],
    // How often to revalidate pages (in seconds)
    // 3600 = 1 hour, 86400 = 1 day, 604800 = 1 week
    expiration: 86400, // Revalidate once per day
  },
}; 