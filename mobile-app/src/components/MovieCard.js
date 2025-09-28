import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MovieCard = ({ 
  movie, 
  onPress, 
  style = {}, 
  imageStyle = {},
  compact = false 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={compact ? 12 : 16} color="#fbbf24" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={compact ? 12 : 16} color="#fbbf24" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={compact ? 12 : 16} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, style]}
        onPress={() => onPress?.(movie)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: movie.poster }} style={[styles.compactPoster, imageStyle]} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          {movie.title_hindi && (
            <Text style={styles.compactTitleHindi} numberOfLines={1}>
              {movie.title_hindi}
            </Text>
          )}
          <Text style={styles.compactMeta}>
            {movie.year} • {movie.industry || 'Cinema'}
          </Text>
          <View style={styles.compactRating}>
            <View style={styles.compactStars}>
              {renderStars(movie.rating)}
            </View>
            <Text style={styles.compactRatingText}>{movie.rating}/5</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.featuredCard, style]}
      onPress={() => onPress?.(movie)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: movie.poster }} style={[styles.featuredPoster, imageStyle]} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        {movie.title_hindi && (
          <Text style={styles.featuredTitleHindi} numberOfLines={1}>
            {movie.title_hindi}
          </Text>
        )}
        <Text style={styles.featuredYear}>
          {movie.year} • {movie.industry || 'Cinema'}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(movie.rating)}
          </View>
          <Text style={styles.ratingText}>{movie.rating}/5</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Featured card styles
  featuredCard: {
    width: 200,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
  featuredTitleHindi: {
    fontSize: 12,
    color: '#e5e7eb',
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

  // Compact card styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
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
  compactPoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  compactContent: {
    flex: 1,
    marginLeft: 16,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  compactTitleHindi: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  compactMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  compactRatingText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
});

export default MovieCard;