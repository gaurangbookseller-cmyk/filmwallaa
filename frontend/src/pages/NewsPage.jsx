import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, TrendingUp, Film } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import MainLayout from '../components/layout/MainLayout';
import InlineAd from '../components/ads/InlineAd';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock news data (replace with API call)
  const mockNews = [
    {
      id: 1,
      title: 'Box Office Report: Latest Bollywood Releases Break Records',
      excerpt: 'The recent wave of Bollywood films has shown exceptional performance at the box office, with several movies crossing the 100 crore mark.',
      image: 'https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=600&h=300&fit=crop',
      author: 'Entertainment Desk',
      published_at: '2025-09-28T10:00:00Z',
      category: 'Box Office',
      read_time: '5 min read',
      featured: true
    },
    {
      id: 2,
      title: 'South Cinema Industry Expands Globally with International Collaborations',
      excerpt: 'Major South Indian production houses announce partnerships with international studios for upcoming multilingual projects.',
      image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&h=300&fit=crop',
      author: 'Industry Reporter',
      published_at: '2025-09-27T15:30:00Z',
      category: 'Industry News',
      read_time: '7 min read',
      featured: false
    },
    {
      id: 3,
      title: 'OTT Platforms Drive Content Creation Boom in Indian Cinema',
      excerpt: 'Streaming services continue to invest heavily in original content, creating new opportunities for filmmakers and actors across all regional markets.',
      image: 'https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=600&h=300&fit=crop',
      author: 'Digital Media Analyst',
      published_at: '2025-09-26T09:15:00Z',
      category: 'Digital Trends',
      read_time: '6 min read',
      featured: false
    },
    {
      id: 4,
      title: 'Awards Season Predictions: Critics Pick Early Favorites',
      excerpt: 'Film critics and industry experts share their predictions for the upcoming awards season, highlighting standout performances and technical achievements.',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=300&fit=crop',
      author: 'Awards Correspondent',
      published_at: '2025-09-25T14:20:00Z',
      category: 'Awards',
      read_time: '8 min read',
      featured: false
    },
    {
      id: 5,
      title: 'Technology in Cinema: How AI and VFX are Changing Filmmaking',
      excerpt: 'Explore the latest technological advancements in Indian cinema, from AI-assisted post-production to revolutionary visual effects techniques.',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=300&fit=crop',
      author: 'Tech Editor',
      published_at: '2025-09-24T11:45:00Z',
      category: 'Technology',
      read_time: '10 min read',
      featured: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Box Office': 'bg-green-100 text-green-800',
      'Industry News': 'bg-blue-100 text-blue-800',
      'Digital Trends': 'bg-purple-100 text-purple-800',
      'Awards': 'bg-yellow-100 text-yellow-800',
      'Technology': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </MainLayout>
    );
  }

  const featuredNews = news.find(item => item.featured);
  const otherNews = news.filter(item => !item.featured);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cinema News
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl">
          Stay updated with the latest news, trends, and developments in the world of cinema. 
          From box office reports to industry insights and technology updates.
        </p>
      </div>

      {/* Featured News */}
      {featuredNews && (
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-red-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured Story
            </Badge>
          </div>
          
          <Card className="overflow-hidden shadow-xl border-0 bg-white">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className={getCategoryColor(featuredNews.category)}>
                    {featuredNews.category}
                  </Badge>
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    <Film className="h-3 w-3 mr-1" />
                    Breaking News
                  </Badge>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredNews.title}
                </h2>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {featuredNews.excerpt}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By {featuredNews.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featuredNews.published_at)}</span>
                  </div>
                  <span className="text-orange-600">{featuredNews.read_time}</span>
                </div>
                
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  Read Full Story
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Inline Ad */}
      <InlineAd type="banner" position="between-news" />

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {otherNews.map((article) => (
          <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
            <div className="relative overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getCategoryColor(article.category)}>
                  {article.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <span className="text-blue-600">{article.read_time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatDate(article.published_at)}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg border border-orange-200 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Stay Updated with Cinema News
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Get the latest cinema news, box office reports, and industry insights delivered straight to your inbox.
        </p>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3">
          Subscribe to Newsletter
        </Button>
      </div>
    </MainLayout>
  );
};

export default NewsPage;