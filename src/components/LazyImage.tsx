import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onLoad?: () => void;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  width,
  height,
  style = {},
  onLoad,
  threshold = 0.1,
  rootMargin = '200px 0px',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Set up intersection observer
  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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
  }, [rootMargin, threshold]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Placeholder or Loading state */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isVisible ? src : placeholderSrc || ''}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

export default LazyImage; 