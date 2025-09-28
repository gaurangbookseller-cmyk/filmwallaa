import React, { useState } from 'react';
import { Star, Clock, ArrowRight, Eye, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import LanguageTranslator from './LanguageTranslator';
import TranslatableText from './TranslatableText';

const ReviewCard = ({ review, featured = false, className = '' }) => {
  const [translatedContent, setTranslatedContent] = useState({
    title: review.title,
    excerpt: review.excerpt
  });
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showTranslator, setShowTranslator] = useState(false);

  const handleTranslated = (field, translatedText, languageCode) => {
    setTranslatedContent(prev => ({
      ...prev,
      [field]: translatedText
    }));
    setCurrentLanguage(languageCode);
  };

  const handleBulkTranslate = async (translatedText, languageCode) => {
    // This would handle translating both title and excerpt together
    // For now, we'll handle them separately
    setCurrentLanguage(languageCode);
  };

  if (featured) {
    return (
      <Card className={`overflow-hidden shadow-xl border-0 bg-white ${className}`}>
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={review.image}
              alt={review.titleEng || review.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  Featured Review
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
              
              {/* Translation Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslator(!showTranslator)}
                className="text-orange-600 hover:text-orange-700"
              >
                <Languages className="h-4 w-4 mr-1" />
                Translate
              </Button>
            </div>

            {/* Translation Controls */}
            {showTranslator && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <LanguageTranslator
                  originalText={`${review.title}. ${review.excerpt}`}
                  onTranslated={handleBulkTranslate}
                  size="small"
                  showBadge={true}
                />
              </div>
            )}

            {/* Translatable Title */}
            <TranslatableText
              originalText={review.title}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            >
              {translatedContent.title}
            </TranslatableText>
            
            {review.title_hindi && currentLanguage === 'en' && (
              <p className="text-lg text-gray-600 mb-4">{review.title_hindi}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>By {review.author}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{review.read_time}</span>
              </div>
              <span>•</span>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
            </div>

            {/* Translatable Excerpt */}
            <TranslatableText
              originalText={review.excerpt}
              className="text-gray-700 text-lg leading-relaxed mb-6"
            >
              {translatedContent.excerpt}
            </TranslatableText>

            <div className="flex flex-wrap gap-2 mb-6">
              {review.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              Read Full Review
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Regular review card
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white ${className}`}>
      <div className="relative overflow-hidden">
        <img
          src={review.image}
          alt={review.titleEng || review.title}
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
        
        {/* Translation Button Overlay */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranslator(!showTranslator)}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <Languages className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Translation Controls */}
        {showTranslator && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <LanguageTranslator
              originalText={`${review.title}. ${review.excerpt}`}
              onTranslated={handleBulkTranslate}
              size="small"
              showBadge={true}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="outline" className="border-orange-200 text-orange-700">
            Review
          </Badge>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Eye className="h-4 w-4" />
            <span className="text-xs text-gray-500">1.2k views</span>
          </div>
        </div>
        
        {/* Translatable Content */}
        <TranslatableText
          originalText={review.title}
          className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200"
        >
          {translatedContent.title}
        </TranslatableText>
        
        {review.title_hindi && currentLanguage === 'en' && (
          <p className="text-gray-600 mb-3">{review.title_hindi}</p>
        )}
        
        <TranslatableText
          originalText={review.excerpt}
          className="text-gray-700 text-sm mb-4 line-clamp-3"
        >
          {translatedContent.excerpt}
        </TranslatableText>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {review.author}</span>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{review.read_time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;