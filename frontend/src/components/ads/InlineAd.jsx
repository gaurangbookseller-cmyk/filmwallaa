import React from 'react';
import AdBanner from './AdBanner';
import AffiliateCard from './AffiliateCard';

const InlineAd = ({ 
  type = 'banner', // banner, product, text
  position = 'between-reviews', // between-reviews, after-hero, before-footer
  className = '' 
}) => {
  // Sample content based on type
  const getAdContent = () => {
    switch (type) {
      case 'product':
        return (
          <div className="flex justify-center">
            <AffiliateCard
              title="JBL Cinema SB241 Soundbar"
              description="Enhance your movie experience with premium sound"
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
              price="7,999"
              originalPrice="12,999"
              discount={38}
              rating={4.2}
              reviewCount="856"
              platform="Amazon"
              affiliateLink="https://amazon.in/dp/example" // Replace with your affiliate link
            />
          </div>
        );
      
      case 'text':
        return (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Love Movie Reviews? Get More!
            </h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our premium newsletter for exclusive reviews, behind-the-scenes content, and early access to movie ratings.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Subscribe Now - ₹99/month
            </button>
            <p className="text-xs text-gray-500 mt-2">Cancel anytime</p>
          </div>
        );
      
      default: // banner
        return (
          <AdBanner
            type="banner"
            title="PVR Cinemas - Book Movie Tickets"
            description="Experience movies on the big screen with premium sound and visuals"
            image="https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=100&h=100&fit=crop"
            ctaText="Book Tickets"
            link="https://pvrcinemas.com" // Replace with your affiliate link
            affiliate={true}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className={`my-8 ${className}`}>
      {/* Ad Label */}
      <div className="text-center mb-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Advertisement
        </span>
      </div>
      
      {/* Ad Content */}
      {getAdContent()}
    </div>
  );
};

export default InlineAd;