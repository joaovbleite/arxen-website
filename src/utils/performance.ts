/**
 * Utilities for optimizing JavaScript execution and measuring performance
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Schedules a task to run during browser idle periods
 * Falls back to setTimeout if requestIdleCallback is not available
 * 
 * @param callback Function to execute during idle time
 * @param options Configuration options for requestIdleCallback
 * @returns ID that can be used to cancel the scheduled callback
 */
export const scheduleIdleTask = (
  callback: () => void,
  options?: { timeout?: number }
): number => {
  if (isBrowser && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback to setTimeout with a reasonable default
  return window.setTimeout(callback, options?.timeout || 1);
};

/**
 * Cancels a previously scheduled idle task
 * 
 * @param id The ID returned by scheduleIdleTask
 */
export const cancelIdleTask = (id: number): void => {
  if (isBrowser && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
};

/**
 * Splits a heavy computational task into smaller chunks that execute during
 * idle periods to avoid blocking the main thread
 * 
 * @param items Array of items to process
 * @param processItem Function to process a single item
 * @param chunkSize Number of items to process in each chunk
 * @param onComplete Callback when all items have been processed
 */
export const processInChunks = <T, R>(
  items: T[],
  processItem: (item: T, index: number) => R,
  chunkSize: number = 5,
  onComplete?: (results: R[]) => void
): void => {
  const results: R[] = [];
  let currentIndex = 0;
  
  const processNextChunk = () => {
    // If we've processed all items, call the completion callback
    if (currentIndex >= items.length) {
      if (onComplete) onComplete(results);
      return;
    }
    
    // Process the next chunk of items
    const endIndex = Math.min(currentIndex + chunkSize, items.length);
    
    for (let i = currentIndex; i < endIndex; i++) {
      results[i] = processItem(items[i], i);
    }
    
    currentIndex = endIndex;
    
    // Schedule the next chunk
    scheduleIdleTask(processNextChunk);
  };
  
  // Start processing the first chunk
  processNextChunk();
};

/**
 * Creates a performance measurement wrapper around a function
 * Logs execution time to console and optionally reports to a monitoring service
 * 
 * @param fn The function to measure
 * @param label A label for the measurement
 * @param reportToMonitoring Whether to report to a monitoring service
 * @returns The wrapped function with the same signature
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  label: string,
  reportToMonitoring: boolean = false
): T {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!isBrowser || !window.performance) {
      return fn.apply(this, args);
    }
    
    const start = performance.now();
    const result = fn.apply(this, args);
    const duration = performance.now() - start;
    
    // Log to console
    console.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    
    // If the result is a Promise, measure its resolution time as well
    if (result instanceof Promise) {
      return result.then(value => {
        const totalDuration = performance.now() - start;
        console.debug(`⏱️ ${label} (with promise resolution): ${totalDuration.toFixed(2)}ms`);
        
        if (reportToMonitoring) {
          // Send to your monitoring service here
          // Example: sendMetric(`function.${label.replace(/\s+/g, '_')}`, totalDuration);
        }
        
        return value;
      }) as ReturnType<T>;
    }
    
    if (reportToMonitoring) {
      // Send to your monitoring service here
      // Example: sendMetric(`function.${label.replace(/\s+/g, '_')}`, duration);
    }
    
    return result;
  } as T;
}

/**
 * Measures how long it takes for a component to become visible
 * Useful for tracking time-to-interactive and similar metrics
 * 
 * @param elementId ID of the element to observe
 * @param label A label for the measurement
 */
export const measureRenderTime = (elementId: string, label: string): void => {
  if (!isBrowser || !window.performance) return;
  
  const startTime = performance.now();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const duration = performance.now() - startTime;
        console.debug(`🎨 ${label} render time: ${duration.toFixed(2)}ms`);
        observer.disconnect();
      }
    });
  });
  
  // Start observing when DOM is ready
  window.requestAnimationFrame(() => {
    const element = document.getElementById(elementId);
    if (element) {
      observer.observe(element);
    } else {
      console.warn(`Element with id "${elementId}" not found for performance measurement`);
    }
  });
}; 