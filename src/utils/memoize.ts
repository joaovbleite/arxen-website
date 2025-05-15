/**
 * Utility function for memoizing expensive calculations or function calls
 * This helps optimize performance by caching results of function calls
 * and returning the cached result when the same inputs occur again.
 */

// Simple key generator for primitive values
function defaultKeyGenerator(...args: any[]): string {
  return JSON.stringify(args);
}

// Type definition for memoize options
interface MemoizeOptions {
  maxSize?: number;
  keyGenerator?: (...args: any[]) => string;
}

// LRU (Least Recently Used) Cache implementation
class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, T>;
  private usage: Map<string, number>;
  private usageCounter: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.usage = new Map();
  }

  get(key: string): T | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Update usage
    this.usageCounter++;
    this.usage.set(key, this.usageCounter);
    
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    // If at capacity, remove least recently used item
    if (this.cache.size >= this.capacity && !this.cache.has(key)) {
      const lruKey = this.getLRUKey();
      if (lruKey) {
        this.cache.delete(lruKey);
        this.usage.delete(lruKey);
      }
    }
    
    // Add new item
    this.usageCounter++;
    this.cache.set(key, value);
    this.usage.set(key, this.usageCounter);
  }

  private getLRUKey(): string | null {
    let lruKey: string | null = null;
    let lruValue = Infinity;
    
    this.usage.forEach((usageValue, key) => {
      if (usageValue < lruValue) {
        lruValue = usageValue;
        lruKey = key;
      }
    });
    
    return lruKey;
  }

  clear(): void {
    this.cache.clear();
    this.usage.clear();
    this.usageCounter = 0;
  }
}

/**
 * Memoizes a function, caching its results for repeated calls with the same arguments
 * 
 * @param fn The function to memoize
 * @param options Configuration options including cache size and key generation
 * @returns Memoized version of the input function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T, 
  options: MemoizeOptions = {}
): T {
  const { 
    maxSize = 100,
    keyGenerator = defaultKeyGenerator 
  } = options;
  
  const cache = new LRUCache<ReturnType<T>>(maxSize);
  
  const memoized = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator(...args);
    const cachedResult = cache.get(key);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
  
  // Add clear method to the memoized function
  (memoized as any).clearCache = () => {
    cache.clear();
  };
  
  return memoized;
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked
 * 
 * @param fn The function to debounce
 * @param wait The number of milliseconds to wait
 * @returns A debounced version of the input function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
      fn.apply(this, args);
    };
    
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait milliseconds
 * 
 * @param fn The function to throttle
 * @param wait The number of milliseconds to wait between invocations
 * @returns A throttled version of the input function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    
    if (now - lastCall >= wait) {
      fn.apply(this, args);
      lastCall = now;
    }
  };
} 