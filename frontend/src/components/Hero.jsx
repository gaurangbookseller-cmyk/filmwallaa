import React from 'react';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useFeaturedMovies } from '../hooks/useMovies';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Hero = () => {
  const { movies: featuredMovies, loading, error } = useFeaturedMovies();
  
  if (loading) {
    return (
      <section className=\"h-[80vh] flex items-center justify-center bg-gradient-to-r from-orange-600 via-red-600 to-pink-600\">\n        <LoadingSpinner size=\"lg\" className=\"text-white\" />\n        <span className=\"ml-4 text-white text-xl\">Loading featured movies...</span>\n      </section>\n    );\n  }\n  \n  if (error || !featuredMovies.length) {\n    return (\n      <section className=\"h-[80vh] flex items-center justify-center bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-4\">\n        <ErrorMessage \n          message={error || \"No featured movies available\"} \n          className=\"max-w-md bg-white/10 border-white/20 text-white\"\n        />\n      </section>\n    );\n  }\n  \n  const featuredMovie = featuredMovies[0];

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={featuredMovie.backdrop}
          alt={featuredMovie.titleEng}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white space-y-6">
          {/* Movie Badge */}
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1">
              फीचर्ड रिव्यू • Featured Review
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              {featuredMovie.industry}
            </Badge>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              {featuredMovie.title}
            </h1>
            <h2 className="text-2xl md:text-3xl text-orange-200 font-medium">
              {featuredMovie.titleEng}
            </h2>
          </div>

          {/* Movie Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-white">{featuredMovie.rating}/5</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{featuredMovie.year}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{featuredMovie.industry}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {featuredMovie.genre.map((genre, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-lg leading-relaxed text-gray-200 max-w-xl">
            {featuredMovie.synopsis}
          </p>

          {/* Review Excerpt */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-orange-200 italic">
              "{featuredMovie.reviewExcerpt}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              पूरा रिव्यू पढ़ें
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              ट्रेलर देखें
            </Button>
          </div>

          {/* Cast */}
          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-gray-400 mb-2">मुख्य कलाकार • Starring:</p>
            <div className="flex flex-wrap gap-2">
              {featuredMovie.cast.map((actor, index) => (
                <span key={index} className="text-white font-medium">
                  {actor}{index < featuredMovie.cast.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;