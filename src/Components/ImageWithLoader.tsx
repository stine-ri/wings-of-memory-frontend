import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackColor?: string;
  showLoader?: boolean;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className = '',
  fallbackColor = 'from-amber-50 to-orange-50',
  showLoader = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {isLoading && showLoader && (
        <div className={`absolute inset-0 bg-gradient-to-r ${fallbackColor} flex items-center justify-center`}>
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};