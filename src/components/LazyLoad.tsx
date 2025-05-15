import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '200px 0px',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.unobserve(currentRef);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {hasLoaded ? children : placeholder || (
        <div className="animate-pulse bg-gray-200 rounded-lg" style={{ minHeight: '100px', width: '100%' }}></div>
      )}
    </div>
  );
};

export default LazyLoad; 