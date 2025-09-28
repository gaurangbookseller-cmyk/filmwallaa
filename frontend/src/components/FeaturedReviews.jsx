import React from 'react';
import { Star, Clock, ArrowRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLatestReviews } from '../hooks/useReviews';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const FeaturedReviews = () => {
  const { reviews: latestReviews, loading, error } = useLatestReviews(3);
  
  if (loading) {
    return (\n      <section className=\"py-16 bg-gradient-to-b from-gray-50 to-white\">\n        <div className=\"max-w-7xl mx-auto px-4 text-center\">\n          <LoadingSpinner size=\"lg\" />\n          <p className=\"mt-4 text-gray-600\">Loading latest reviews...</p>\n        </div>\n      </section>\n    );\n  }\n  \n  if (error || !latestReviews.length) {\n    return (\n      <section className=\"py-16 bg-gradient-to-b from-gray-50 to-white\">\n        <div className=\"max-w-7xl mx-auto px-4\">\n          <ErrorMessage message={error || \"No reviews available\"} />\n        </div>\n      </section>\n    );\n  }\n  \n  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            ताज़ा समीक्षाएं
          </h2>
          <p className="text-xl text-gray-600 mb-2">Latest Reviews</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            हमारे विशेषज्ञ समीक्षकों द्वारा नवीनतम फिल्मों की गहरी और निष्पक्ष समीक्षा
          </p>
        </div>

        {/* Main Featured Review */}
        <div className="mb-12">
          <Card className="overflow-hidden shadow-xl border-0 bg-white">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={latestReviews[0].image}
                  alt={latestReviews[0].titleEng}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    मुख्य समीक्षा • Featured
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(latestReviews[0].rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold ml-2">{latestReviews[0].rating}/5</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {latestReviews[0].title}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  {latestReviews[0].titleEng}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>द्वारा {latestReviews[0].author}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{latestReviews[0].readTime}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(latestReviews[0].date).toLocaleDateString('hi-IN')}</span>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {latestReviews[0].excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {latestReviews[0].tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  पूरी समीक्षा पढ़ें
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Other Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {latestReviews.slice(1).map((review) => (
            <Card key={review.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
              <div className="relative overflow-hidden">
                <img
                  src={review.image}
                  alt={review.titleEng}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-1 text-white">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(review.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-white/50'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold ml-2">{review.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    समीक्षा • Review
                  </Badge>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs text-gray-500">1.2k views</span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {review.title}
                </h4>
                <p className="text-gray-600 mb-3">{review.titleEng}</p>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {review.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>द्वारा {review.author}</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{review.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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