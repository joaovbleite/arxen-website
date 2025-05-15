import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });
  
  const [showMetrics, setShowMetrics] = useState(false);
  
  useEffect(() => {
    // Only run in development or when explicitly enabled
    const isDev = import.meta.env.DEV;
    const isEnabled = localStorage.getItem('enable-performance-metrics') === 'true';
    
    if (!isDev && !isEnabled) return;
    
    // Check if Performance API is available
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Function to collect metrics from various sources
      const collectMetrics = () => {
        let updatedMetrics: Partial<PerformanceMetrics> = {};
        
        // Get basic navigation timing metrics
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          updatedMetrics.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
        }
        
        // Web Vitals metrics from Performance API
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          updatedMetrics.fcp = Math.round(fcpEntry.startTime);
        }
        
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          ...updatedMetrics,
        }));
      };
      
      // Register PerformanceObserver for LCP
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (lastEntry) {
              setMetrics(prevMetrics => ({
                ...prevMetrics,
                lcp: Math.round(lastEntry.startTime),
              }));
            }
          });
          
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          
          // First Input Delay
          const fidObserver = new PerformanceObserver((entryList) => {
            const entry = entryList.getEntries()[0];
            if (entry) {
              setMetrics(prevMetrics => ({
                ...prevMetrics,
                fid: Math.round((entry as any).processingStart - (entry as any).startTime),
              }));
            }
          });
          
          fidObserver.observe({ type: 'first-input', buffered: true });
          
          // Cumulative Layout Shift
          let cumulativeLayoutShift = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cumulativeLayoutShift += (entry as any).value;
                setMetrics(prevMetrics => ({
                  ...prevMetrics,
                  cls: Math.round(cumulativeLayoutShift * 1000) / 1000,
                }));
              }
            }
          });
          
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.error('Performance monitoring error:', e);
        }
      }
      
      // Collect basic metrics after page load
      if (document.readyState === 'complete') {
        collectMetrics();
      } else {
        window.addEventListener('load', collectMetrics, { once: true });
      }
      
      // Set up key shortcut to toggle metrics display (Ctrl+Alt+P)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.key === 'p') {
          setShowMetrics(prev => !prev);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (document.readyState !== 'complete') {
          window.removeEventListener('load', collectMetrics);
        }
      };
    }
  }, []);
  
  if (!showMetrics) return null;
  
  // Determine the color based on performance threshold
  const getMetricColor = (value: number | null, thresholds: [number, number]): string => {
    if (value === null) return 'text-gray-400';
    const [good, poor] = thresholds;
    
    if (value <= good) return 'text-green-500';
    if (value <= poor) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg text-xs z-50 font-mono">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <span>TTFB:</span>
          <span className={getMetricColor(metrics.ttfb, [100, 300])}>
            {metrics.ttfb !== null ? `${metrics.ttfb}ms` : 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>FCP:</span>
          <span className={getMetricColor(metrics.fcp, [1800, 3000])}>
            {metrics.fcp !== null ? `${metrics.fcp}ms` : 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>LCP:</span>
          <span className={getMetricColor(metrics.lcp, [2500, 4000])}>
            {metrics.lcp !== null ? `${metrics.lcp}ms` : 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>FID:</span>
          <span className={getMetricColor(metrics.fid, [100, 300])}>
            {metrics.fid !== null ? `${metrics.fid}ms` : 'n/a'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>CLS:</span>
          <span className={getMetricColor(metrics.cls, [0.1, 0.25])}>
            {metrics.cls !== null ? metrics.cls : 'n/a'}
          </span>
        </div>
      </div>
      <button
        className="w-full mt-2 text-[10px] text-gray-400 hover:text-white"
        onClick={() => setShowMetrics(false)}
      >
        Hide (or press Ctrl+Alt+P)
      </button>
    </div>
  );
};

export default PerformanceMonitor; 