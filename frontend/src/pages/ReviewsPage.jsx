import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import MainLayout from '../components/layout/MainLayout';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  const categories = ['All', 'Bollywood', 'South Cinema', 'International', 'Drama', 'Action', 'Comedy', 'Thriller'];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.reviews.getLatest(20);
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           review.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-xl">Loading movie reviews...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage message={error} onRetry={fetchReviews} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg border border-orange-200 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Movie Reviews
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl">
          Discover in-depth movie reviews from our expert critics. Find ratings, insights, and recommendations 
          for the latest Bollywood, South Cinema, and International films.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews by movie title or critic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-8">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="md:flex">
              {/* Review Image */}
              <div className="md:w-80 h-48 md:h-auto">
                <img
                  src={review.image}
                  alt={review.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Review Content */}
              <CardContent className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        Review
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-semibold ml-2">{review.rating}/5</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-orange-600 cursor-pointer transition-colors">
                      {review.title}
                    </h2>
                    
                    {review.title_hindi && (
                      <p className="text-gray-600 mb-3">{review.title_hindi}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {review.excerpt}
                </p>
                
                {/* Review Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>By {review.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  <span className="text-orange-600">{review.read_time}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Read More Button */}
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Read Full Review
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {filteredReviews.length > 0 && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3"
            onClick={() => fetchReviews()}
          >
            Load More Reviews
          </Button>
        </div>
      )}
      
      {/* No Results */}
      {filteredReviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'We\'re working on adding more movie reviews. Check back soon!'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ReviewsPage;