import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewCard = ({ 
  review, 
  onPress, 
  style = {},
  compact = false 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starSize = compact ? 12 : 14;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={starSize} color="#fbbf24" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={starSize} color="#fbbf24" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={starSize} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  return (
    <TouchableOpacity
      style={[styles.reviewCard, style]}
      onPress={() => onPress?.(review)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: review.image }} style={styles.reviewImage} />
      <View style={styles.reviewContent}>
        <Text style={[styles.reviewTitle, compact && styles.compactTitle]} numberOfLines={2}>
          {review.title}
        </Text>
        
        {review.title_hindi && (
          <Text style={[styles.reviewTitleHindi, compact && styles.compactTitleHindi]} numberOfLines={1}>
            {review.title_hindi}
          </Text>
        )}
        
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={16} color="#f97316" />
          <Text style={styles.reviewAuthor}>By {review.author}</Text>
        </View>
        
        <Text style={[styles.reviewExcerpt, compact && styles.compactExcerpt]} numberOfLines={compact ? 2 : 3}>
          {review.excerpt}
        </Text>
        
        <View style={styles.reviewMeta}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(review.rating)}
            </View>
            <Text style={styles.ratingText}>{review.rating}/5</Text>
          </View>
          
          <View style={styles.readTimeContainer}>
            <Ionicons name="time-outline" size={12} color="#9ca3af" />
            <Text style={styles.readTime}>{review.read_time}</Text>
          </View>
        </View>
        
        {review.tags && review.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {review.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {review.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{review.tags.length - 2} more</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
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
  reviewImage: {
    width: 100,
    height: 150,
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
    lineHeight: 22,
  },
  compactTitle: {
    fontSize: 15,
  },
  reviewTitleHindi: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  compactTitleHindi: {
    fontSize: 13,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#f97316',
    marginLeft: 4,
    fontWeight: '600',
  },
  reviewExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  compactExcerpt: {
    fontSize: 13,
    marginBottom: 10,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#fef3f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#f97316',
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default ReviewCard;