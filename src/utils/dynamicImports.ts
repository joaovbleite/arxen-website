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

// Function to dynamically load a third-party script
export const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.body.appendChild(script);
  });
};

// Function to dynamically load CSS
export const loadCSS = (href: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    
    document.head.appendChild(link);
  });
};

// Function to create a lightweight script loading queue to prevent overloading the browser
export class ScriptQueue {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  public add(loader: () => Promise<void>): void {
    this.queue.push(loader);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const nextLoader = this.queue.shift();
    
    if (nextLoader) {
      try {
        await nextLoader();
      } catch (error) {
        console.error('Error loading resource:', error);
      }
      
      // Process next item in queue
      this.processQueue();
    }
  }
}

// Create a global script queue instance
export const scriptQueue = new ScriptQueue(); 