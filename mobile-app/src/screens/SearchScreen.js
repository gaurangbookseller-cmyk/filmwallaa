import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/ApiService';

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Shah Rukh Khan',
    'Jawan',
    'Kantara',
    'Bollywood 2024',
    'Action Movies'
  ]);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (searchTerm.trim().length === 0) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const results = await ApiService.searchMovies(query);
      setSearchResults(results);
      
      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback mock results for demo
      const mockResults = [
        {
          id: 1,
          tmdb_id: 1,
          title: "Search Result: " + query,
          title_hindi: "खोज परिणाम: " + query,
          year: 2024,
          rating: 4.2,
          genre: ["Drama", "Action"],
          language: "Hindi",
          poster: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=300&h=450&fit=crop",
          industry: "Bollywood"
        }
      ];
      setSearchResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      performSearch(searchTerm);
      Keyboard.dismiss();
    }
  };

  const handleRecentSearchPress = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#fbbf24" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#fbbf24" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#d1d5db" />
      );
    }
    
    return stars;
  };

  const MovieCard = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('ReviewDetail', { movieId: item.id })}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        {item.title_hindi && (
          <Text style={styles.movieTitleHindi} numberOfLines={1}>
            {item.title_hindi}
          </Text>
        )}
        
        <Text style={styles.movieYear}>
          {item.year} • {item.industry || 'Cinema'}
        </Text>
        
        {item.genre && (
          <Text style={styles.movieGenre} numberOfLines={1}>
            {item.genre.join(', ')}
          </Text>
        )}
        
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.ratingText}>{item.rating}/5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RecentSearchItem = ({ term }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(term)}
    >
      <Ionicons name="time-outline" size={16} color="#9ca3af" />
      <Text style={styles.recentSearchText}>{term}</Text>
      <Ionicons name="arrow-up-outline" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );

  const EmptySearchState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Search Movies</Text>
      <Text style={styles.emptySubtitle}>
        Find reviews, ratings, and details about your favorite movies
      </Text>
    </View>
  );

  const NoResultsState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="film-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptySubtitle}>
        Try different keywords or check the spelling
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies, actors, directors..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            placeholderTextColor="#9ca3af"
            autoFocus={true}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        
        {searchTerm.length > 0 && (
          <TouchableOpacity style={styles.cancelButton} onPress={clearSearch}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {searchTerm.trim().length === 0 ? (
        <View style={styles.contentContainer}>
          {/* Recent Searches */}
          {(searchHistory.length > 0 || recentSearches.length > 0) && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {(searchHistory.length > 0 ? searchHistory : recentSearches).map((term, index) => (
                <RecentSearchItem key={index} term={term} />
              ))}
            </View>
          )}
          
          {/* Popular Searches */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularTags}>
              {['Bollywood', 'Hollywood', 'Action', 'Drama', 'Comedy', 'Thriller'].map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularTag}
                  onPress={() => handleRecentSearchPress(tag)}
                >
                  <Text style={styles.popularTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <EmptySearchState />
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {loading ? 'Searching...' : `${searchResults.length} results for "${searchTerm}"`}
            </Text>
          </View>

          {/* Results List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f97316" />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => <MovieCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={searchTerm.trim().length > 0 ? NoResultsState : null}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    marginLeft: 8,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  popularSection: {
    marginBottom: 32,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularTag: {
    backgroundColor: '#fef3f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  popularTagText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  movieCard: {
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
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  movieTitleHindi: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 12,
    color: '#6b7280',
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
    color: '#111827',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default SearchScreen;