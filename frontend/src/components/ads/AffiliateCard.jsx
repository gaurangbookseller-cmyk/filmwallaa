import React from 'react';
import { Star, ExternalLink, ShoppingCart, Percent } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const AffiliateCard = ({
  product,
  title,
  description,
  image,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
  ctaText = 'Shop Now',
  affiliateLink,
  platform = 'Amazon', // Amazon, Flipkart, etc.
  className = ''
}) => {
  const handleClick = () => {
    if (affiliateLink) {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getPlatformColor = () => {
    switch (platform.toLowerCase()) {
      case 'amazon':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'flipkart':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'myntra':
        return 'bg-pink-500 hover:bg-pink-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className={`w-full max-w-sm hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={handleClick}
          />
        </div>
        
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            <Percent className="h-3 w-3 mr-1" />
            {discount}% OFF
          </Badge>
        )}
        
        {/* Sponsored Label */}
        <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs">
          Sponsored
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600" onClick={handleClick}>
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}
        
        {/* Rating */}
        {rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviewCount || '100+'})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
          )}
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={handleClick}
          className={`w-full ${getPlatformColor()} text-white`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {ctaText} on {platform}
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
        
        {/* Affiliate Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          As an affiliate, we may earn from qualifying purchases
        </p>
      </CardContent>
    </Card>
  );
};

export default AffiliateCard;