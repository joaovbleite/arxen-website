/**
 * This file contains utility functions for dynamically importing 
 * external libraries only when they're needed.
 * This helps reduce the initial bundle size and improve performance.
 */

// Function to dynamically load the Stripe library
export const loadStripe = async () => {
  if (typeof window !== 'undefined' && !(window as any).Stripe) {
    return new Promise<any>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        resolve((window as any).Stripe);
      };
      document.body.appendChild(script);
    });
  }
  return (window as any).Stripe;
};

// Keep track of loaded resources
const loadedResources: Record<string, boolean> = {};
const resourcesLoading: Record<string, Promise<boolean>> = {};

/**
 * Dynamically load a script and return a promise
 * @param src Script URL to load
 * @param id Optional ID for the script tag
 * @param timeoutMs Maximum time to wait for loading (default: 10000ms)
 */
export const loadScript = (src: string, id?: string, timeoutMs: number = 5000): Promise<boolean> => {
  const resourceId = id || src;
  
  // If already loaded, return resolved promise
  if (loadedResources[resourceId]) {
    return Promise.resolve(true);
  }
  
  // If already loading, return the existing promise
  const existingScriptPromise = resourcesLoading[resourceId];
  if (existingScriptPromise !== undefined) {
    return existingScriptPromise;
  }
  
  // Create a new promise for loading the script
  const loadPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (id) script.id = id;
    
    // Create a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error(`Script loading timeout: ${src}`);
      resolve(false); // Resolve with false instead of rejecting to prevent errors
    }, timeoutMs);
    
    script.onload = () => {
      console.log(`Script loaded: ${src}`);
      clearTimeout(timeoutId);
      loadedResources[resourceId] = true;
      delete resourcesLoading[resourceId];
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error(`Error loading script: ${src}`, error);
      clearTimeout(timeoutId);
      delete resourcesLoading[resourceId];
      resolve(false); // Resolve with false instead of rejecting to prevent errors
    };
    
    document.head.appendChild(script);
  });
  
  // Store the loading promise
  resourcesLoading[resourceId] = loadPromise;
  
  return loadPromise;
};

/**
 * Dynamically load a CSS stylesheet and return a promise
 * @param href CSS URL to load
 * @param id Optional ID for the link tag
 * @param timeoutMs Maximum time to wait for loading (default: 5000ms)
 */
export const loadStyle = (href: string, id?: string, timeoutMs: number = 5000): Promise<boolean> => {
  const resourceId = id || href;
  
  // If already loaded, return resolved promise
  if (loadedResources[resourceId]) {
    return Promise.resolve(true);
  }
  
  // If already loading, return the existing promise
  const existingStylePromise = resourcesLoading[resourceId];
  if (existingStylePromise !== undefined) {
    return existingStylePromise;
  }
  
  // Create a new promise for loading the stylesheet
  const loadPromise = new Promise<boolean>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (id) link.id = id;
    
    // Create a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error(`Stylesheet loading timeout: ${href}`);
      resolve(false); // Resolve with false instead of rejecting to prevent errors
    }, timeoutMs);
    
    link.onload = () => {
      console.log(`Stylesheet loaded: ${href}`);
      clearTimeout(timeoutId);
      loadedResources[resourceId] = true;
      delete resourcesLoading[resourceId];
      resolve(true);
    };
    
    link.onerror = (error) => {
      console.error(`Error loading stylesheet: ${href}`, error);
      clearTimeout(timeoutId);
      delete resourcesLoading[resourceId];
      resolve(false); // Resolve with false instead of rejecting to prevent errors
    };
    
    document.head.appendChild(link);
  });
  
  // Store the loading promise
  resourcesLoading[resourceId] = loadPromise;
  
  return loadPromise;
};

/**
 * Function to create a lightweight script loading queue to prevent overloading the browser
 * @param resources Array of resource URLs to load
 * @param type Type of resource ('script' or 'style')
 * @param concurrency Number of resources to load concurrently
 * @param timeoutMs Maximum time to wait for loading each resource
 */
export const loadResources = async (
  resources: string[], 
  type: 'script' | 'style' = 'script',
  concurrency: number = 3,
  timeoutMs: number = 5000
): Promise<boolean> => {
  let results: boolean[] = [];
  
  // Load resources in batches
  for (let i = 0; i < resources.length; i += concurrency) {
    const batch = resources.slice(i, i + concurrency);
    const batchPromises = batch.map(resource => {
      try {
        return type === 'script' 
          ? loadScript(resource, undefined, timeoutMs) 
          : loadStyle(resource, undefined, timeoutMs);
      } catch (error) {
        console.error('Error loading resource:', error);
        return Promise.resolve(false);
      }
    });
    
    // Use Promise.allSettled to ensure we continue even if some resources fail
    const batchResults = await Promise.allSettled(batchPromises);
    results = results.concat(
      batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : false
      )
    );
  }
  
  // Return true if all resources loaded successfully
  return results.every(result => result === true);
};

export default {
  loadScript,
  loadStyle,
  loadResources
}; 