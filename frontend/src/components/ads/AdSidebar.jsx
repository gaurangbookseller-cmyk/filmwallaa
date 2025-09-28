import React from 'react';
import AdBanner from './AdBanner';
import AffiliateCard from './AffiliateCard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const AdSidebar = ({ className = '' }) => {
  // Sample affiliate products (you can replace with your actual affiliate products)
  const affiliateProducts = [
    {
      id: 1,
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Perfect for movie marathons and music',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      price: '24,990',
      originalPrice: '29,990',
      discount: 17,
      rating: 4.5,
      reviewCount: '2,847',
      platform: 'Amazon',
      affiliateLink: 'https://amazon.in/dp/example' // Replace with your affiliate link
    },
    {
      id: 2,
      title: 'Samsung 55" 4K Smart TV',
      description: 'Cinema experience at home',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop',
      price: '42,999',
      originalPrice: '55,999',
      discount: 23,
      rating: 4.3,
      reviewCount: '1,234',
      platform: 'Flipkart',
      affiliateLink: 'https://flipkart.com/example' // Replace with your affiliate link
    }
  ];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Ad Banner */}
      <AdBanner
        type="sidebar"
        title="BookMyShow - Movie Tickets"
        description="Book latest movie tickets online"
        image="https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=100&h=100&fit=crop"
        ctaText="Book Now"
        link="https://bookmyshow.com" // Replace with your affiliate link
        affiliate={true}
      />
      
      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recommended for Movie Lovers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {affiliateProducts.map((product) => (
            <AffiliateCard
              key={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              rating={product.rating}
              reviewCount={product.reviewCount}
              platform={product.platform}
              affiliateLink={product.affiliateLink}
              className="mb-4"
            />
          ))}
        </CardContent>
      </Card>
      
      {/* Movie Platform Affiliates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Watch Movies Online
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AdBanner
            type="inline"
            title="Netflix Premium"
            description="Unlimited movies & shows"
            image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop"
            ctaText="Subscribe"
            link="https://netflix.com" // Replace with your affiliate link
            affiliate={true}
            closeable={false}
          />
          
          <AdBanner
            type="inline"
            title="Amazon Prime Video"
            description="Watch latest movies & originals"
            image="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop"
            ctaText="Start Trial"
            link="https://primevideo.com" // Replace with your affiliate link
            affiliate={true}
            closeable={false}
          />
        </CardContent>
      </Card>
      
      {/* Book Store Affiliate */}
      <AdBanner
        type="sidebar"
        title="Cinema Books & Scripts"
        description="Discover books about filmmaking and movie scripts"
        image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop"
        ctaText="Shop Books"
        link="https://amazon.in/books" // Replace with your affiliate link
        affiliate={true}
      />
    </div>
  );
};

export default AdSidebar;