import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useLatestReviews } from '../hooks/useReviews';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ReviewCard from './ReviewCard';

const FeaturedReviews = () => {
  const { reviews: latestReviews, loading, error } = useLatestReviews(3);
  
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading latest reviews...</p>
        </div>
      </section>
    );
  }
  
  if (error || !latestReviews.length) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <ErrorMessage message={error || "No reviews available"} />
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Latest Reviews
          </h2>
          <p className="text-xl text-gray-600 mb-2">ताज़ा समीक्षाएं</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            हमारे विशेषज्ञ समीक्षकों द्वारा नवीनतम फिल्मों की गहरी और निष्पक्ष समीक्षा
          </p>
        </div>

        {/* Main Featured Review */}
        <div className="mb-12">
          <ReviewCard review={latestReviews[0]} featured={true} />
        </div>

        {/* Other Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {latestReviews.slice(1).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3"
          >
            सभी समीक्षाएं देखें
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;