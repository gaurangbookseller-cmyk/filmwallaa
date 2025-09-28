import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/ApiService';

const ReviewDetailScreen = ({ route, navigation }) => {
  const { reviewId, movieId } = route.params || {};
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviewDetail();
  }, [reviewId, movieId]);

  const loadReviewDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (reviewId) {
        // Load specific review
        const reviewData = await ApiService.getReviewById(reviewId);
        setReview(reviewData);
      } else if (movieId) {
        // Load movie details for review (if navigating from movie)
        const movieData = await ApiService.getMovieDetails(movieId);
        // Create mock review for movie
        const mockReview = {
          id: movieId,
          movie_id: movieId,
          title: `Review: ${movieData.title}`,
          title_hindi: movieData.title_hindi,
          author: "Editorial Team",
          content: generateMockReviewContent(movieData),
          excerpt: `A comprehensive review of ${movieData.title}...`,
          rating: movieData.rating || 4.0,
          tags: movieData.genre || ["Movie Review"],
          read_time: "10 min read",
          image: movieData.poster,
          status: "published",
          movie: movieData
        };
        setReview(mockReview);
      }
    } catch (error) {
      console.error('Error loading review detail:', error);
      setError('Failed to load review details');
      
      // Fallback mock data
      const fallbackReview = {
        id: "1",
        movie_id: "1",
        title: "Sample Movie Review",
        title_hindi: "नमूना फिल्म समीक्षा",
        author: "Film Critic",
        content: generateFallbackContent(),
        excerpt: "This is a sample review to demonstrate the review detail screen...",
        rating: 4.5,
        tags: ["Bollywood", "Drama", "Entertainment"],
        read_time: "8 min read",
        image: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop",
        status: "published"
      };
      setReview(fallbackReview);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReviewContent = (movie) => {
    return `# ${movie.title} Review

${movie.title} is a ${movie.genre?.join(", ") || "compelling"} film that ${movie.year ? `released in ${movie.year}` : "recently hit theaters"}. 

## Plot Overview
${movie.synopsis || "The story follows an engaging narrative that keeps viewers invested throughout the runtime."}

## Performance Analysis
The cast delivers strong performances across the board. ${movie.director ? `Directed by ${movie.director}, ` : ""}the film showcases excellent character development and emotional depth.

## Technical Aspects
The cinematography and production values are noteworthy, creating an immersive viewing experience that complements the storytelling.

## Final Verdict
${movie.title} is ${movie.rating >= 4 ? "highly recommended" : movie.rating >= 3 ? "worth watching" : "a decent watch"} for fans of ${movie.genre?.join(" and ") || "quality cinema"}. The film successfully ${movie.rating >= 4 ? "exceeds expectations" : "delivers on its promises"} and provides entertainment value.

**Rating: ${movie.rating || 4.0}/5**`;
  };

  const generateFallbackContent = () => {
    return `# Sample Movie Review

This is a comprehensive review that demonstrates how the review detail screen displays full content.

## Story & Direction
The narrative structure is well-crafted, providing viewers with an engaging storyline that maintains interest throughout.

## Performances
The cast delivers compelling performances that bring depth to their characters and enhance the overall viewing experience.

## Technical Excellence
From cinematography to sound design, the technical aspects contribute significantly to the film's impact.

## Conclusion
This film represents quality filmmaking and is recommended for cinema enthusiasts.

**Rating: 4.5/5**`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={20} color="#fbbf24" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={20} color="#fbbf24" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  const formatContent = (content) => {
    // Simple markdown-like formatting for display
    return content
      .replace(/# (.*)/g, '\n$1\n')
      .replace(/## (.*)/g, '\n$1\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .trim();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Loading review...</Text>
      </View>
    );
  }

  if (error && !review) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
        <Text style={styles.errorTitle}>Failed to Load Review</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadReviewDetail}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Image */}
      {review?.image && (
        <Image source={{ uri: review.image }} style={styles.headerImage} />
      )}

      {/* Review Header */}
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewTitle}>{review?.title}</Text>
        
        {review?.title_hindi && (
          <Text style={styles.reviewTitleHindi}>{review.title_hindi}</Text>
        )}

        <View style={styles.reviewMeta}>
          <View style={styles.authorInfo}>
            <Ionicons name="person-circle-outline" size={20} color="#f97316" />
            <Text style={styles.authorText}>By {review?.author}</Text>
          </View>
          
          <View style={styles.readTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.readTimeText}>{review?.read_time}</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(review?.rating || 0)}
          </View>
          <Text style={styles.ratingText}>{review?.rating}/5</Text>
        </View>

        {/* Tags */}
        {review?.tags && review.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {review.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Review Content */}
      <View style={styles.reviewContent}>
        <Text style={styles.contentText}>
          {formatContent(review?.content || review?.excerpt || "")}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color="#f97316" />
          <Text style={styles.shareButtonText}>Share Review</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={20} color="#f97316" />
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      {/* Related Reviews */}
      <View style={styles.relatedSection}>
        <Text style={styles.relatedTitle}>More Reviews</Text>
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={() => navigation.navigate('Reviews')}
        >
          <Text style={styles.viewMoreText}>View All Reviews</Text>
          <Ionicons name="arrow-forward" size={16} color="#f97316" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  reviewHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 32,
  },
  reviewTitleHindi: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginLeft: 8,
  },
  readTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#fef3f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
  },
  reviewContent: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  shareButtonText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginLeft: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  likeButtonText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginLeft: 8,
  },
  relatedSection: {
    padding: 20,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3f2',
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
    marginRight: 8,
  },
});

export default ReviewDetailScreen;