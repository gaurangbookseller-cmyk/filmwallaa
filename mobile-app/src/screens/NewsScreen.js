import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      // Mock news data for now - will be replaced with actual API
      const mockNews = [
        {
          id: 1,
          title: "Shah Rukh Khan's 'Jawan' Breaks Box Office Records",
          title_hindi: "शाहरुख खान की 'जवान' ने तोड़े बॉक्स ऑफिस रिकॉर्ड",
          excerpt: "The action thriller directed by Atlee continues to dominate cinemas worldwide...",
          image: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop",
          author: "Entertainment Desk",
          publishedAt: "2 hours ago",
          category: "Box Office"
        },
        {
          id: 2,
          title: "Upcoming Bollywood Movies to Watch in 2024",
          title_hindi: "2024 में देखी जाने वाली आगामी बॉलीवुड फिल्में",
          excerpt: "From action thrillers to romantic dramas, here's what Bollywood has in store...",
          image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop",
          author: "Film Reporter",
          publishedAt: "5 hours ago",
          category: "Upcoming"
        },
        {
          id: 3,
          title: "Regional Cinema Gaining Global Recognition",
          title_hindi: "क्षेत्रीय सिनेमा को मिल रही वैश्विक पहचान",
          excerpt: "South Indian films continue to make waves internationally with unique storytelling...",
          image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
          author: "Cultural Reporter",
          publishedAt: "8 hours ago",
          category: "Industry"
        },
        {
          id: 4,
          title: "OTT Platforms Changing Movie Distribution",
          title_hindi: "OTT प्लेटफॉर्म बदल रहे फिल्म वितरण",
          excerpt: "Digital streaming services are reshaping how audiences consume cinema content...",
          image: "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop",
          author: "Tech Reporter",
          publishedAt: "1 day ago",
          category: "Technology"
        }
      ];

      setNews(mockNews);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const NewsCard = ({ item }) => (
    <TouchableOpacity style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.publishTime}>{item.publishedAt}</Text>
        </View>
        
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        {item.title_hindi && (
          <Text style={styles.newsTitleHindi} numberOfLines={1}>
            {item.title_hindi}
          </Text>
        )}
        
        <Text style={styles.newsExcerpt} numberOfLines={3}>
          {item.excerpt}
        </Text>
        
        <View style={styles.newsFooter}>
          <Text style={styles.author}>By {item.author}</Text>
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read More</Text>
            <Ionicons name="chevron-forward" size={16} color="#f97316" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="newspaper-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No news available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for latest cinema news and updates
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={({ item }) => <NewsCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f97316']}
          />
        }
        ListEmptyComponent={!loading ? EmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#fef3f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
  },
  publishTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 24,
  },
  newsTitleHindi: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#9ca3af',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '600',
    marginRight: 4,
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
  },
});

export default NewsScreen;