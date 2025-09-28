import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../services/ApiService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moviesData, reviewsData] = await Promise.all([
        ApiService.getFeaturedMovies(),
        ApiService.getLatestReviews(5)
      ]);
      
      setFeaturedMovies(moviesData);
      setLatestReviews(reviewsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#fbbf24" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#fbbf24" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  const FeaturedMovieCard = ({ movie }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('ReviewDetail', { movieId: movie.id })}
    >
      <Image source={{ uri: movie.poster }} style={styles.featuredPoster} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <Text style={styles.featuredTitle}>{movie.title}</Text>
        <Text style={styles.featuredYear}>{movie.year} • {movie.industry}</Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(movie.rating)}
          </View>
          <Text style={styles.ratingText}>{movie.rating}/5</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ReviewCard = ({ review }) => (
    <TouchableOpacity
      style={styles.reviewCard}
      onPress={() => navigation.navigate('ReviewDetail', { reviewId: review.id })}
    >
      <Image source={{ uri: review.image }} style={styles.reviewImage} />
      <View style={styles.reviewContent}>
        <Text style={styles.reviewTitle} numberOfLines={2}>
          {review.title}
        </Text>
        <Text style={styles.reviewAuthor}>By {review.author}</Text>
        <Text style={styles.reviewExcerpt} numberOfLines={3}>
          {review.excerpt}
        </Text>
        <View style={styles.reviewMeta}>
          <View style={styles.starsContainer}>
            {renderStars(review.rating)}
          </View>
          <Text style={styles.readTime}>{review.read_time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#f97316']}
        />
      }
    >
      {/* Header Banner */}
      <LinearGradient
        colors={['#f97316', '#dc2626']}
        style={styles.headerBanner}
      >
        <Text style={styles.headerTitle}>Welcome to Filmwalla.com</Text>
        <Text style={styles.headerSubtitle}>Your Gateway to Entertainment</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={20} color="#f97316" />
          <Text style={styles.searchButtonText}>Search Movies...</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Featured Movies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Movies</Text>
        <FlatList
          data={featuredMovies}
          renderItem={({ item }) => <FeaturedMovieCard movie={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      {/* Latest Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Reviews</Text>
        {latestReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Reviews')}
        >
          <Text style={styles.viewAllText}>View All Reviews</Text>
          <Ionicons name="arrow-forward" size={16} color="#f97316" />
        </TouchableOpacity>
      </View>

      {/* News Section Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cinema News</Text>
        <TouchableOpacity
          style={styles.newsPreview}
          onPress={() => navigation.navigate('News')}
        >
          <Text style={styles.newsText}>Stay updated with latest cinema news and industry trends</Text>
          <Ionicons name="newspaper" size={24} color="#f97316" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  headerBanner: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fed7aa',
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
  },
  searchButtonText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredCard: {
    width: 200,
    height: 300,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredPoster: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  featuredYear: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  reviewContent: {
    flex: 1,
    marginLeft: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#f97316',
    marginBottom: 8,
  },
  reviewExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3f2',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
    marginRight: 8,
  },
  newsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
  },
  newsText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginRight: 16,
  },
});

export default HomeScreen;