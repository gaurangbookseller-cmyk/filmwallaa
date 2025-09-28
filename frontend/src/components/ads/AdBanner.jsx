import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const AdBanner = ({ 
  type = 'banner', // banner, sidebar, inline, sticky
  title,
  description,
  image,
  ctaText = 'Learn More',
  link,
  affiliate = false,
  closeable = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const getAdStyles = () => {
    switch (type) {
      case 'banner':
        return 'w-full h-32 md:h-40 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200';
      case 'sidebar':
        return 'w-full h-64 bg-gradient-to-b from-green-100 to-blue-100 border border-green-200';
      case 'inline':
        return 'w-full h-24 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200';
      case 'sticky':
        return 'fixed bottom-4 right-4 w-80 h-24 bg-white shadow-lg border border-gray-200 z-50';
      default:
        return 'w-full h-32 bg-gray-100 border border-gray-200';
    }
  };

  return (
    <Card className={`${getAdStyles()} ${className} relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200`}>
      <div className="absolute inset-0 p-4 flex items-center justify-between" onClick={handleClick}>
        <div className="flex items-center space-x-4 flex-1">
          {image && (
            <img 
              src={image} 
              alt={title}
              className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">{title}</h3>
            {description && (
              <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2">{description}</p>
            )}
            {affiliate && (
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mt-1">
                Sponsored
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            {ctaText}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Close Button */}
      {closeable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      {/* Ad Label */}
      <div className="absolute top-1 left-1 bg-gray-900 text-white text-xs px-2 py-1 rounded">
        {affiliate ? 'Sponsored' : 'Advertisement'}
      </div>
    </Card>
  );
};

export default AdBanner;