import requests
import os
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class TMDBService:
    def __init__(self):
        # Rotating TMDB API keys
        self.api_keys = [
            "c8dea14dc917687ac631a52620e4f7ad",
            "3cb41ecea3bf606c56552db3d17adefd"
        ]
        self.current_key_index = 0
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p"
        
    def get_current_api_key(self) -> str:
        return self.api_keys[self.current_key_index]
    
    def rotate_api_key(self):
        """Rotate to next API key if rate limited"""
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        logger.info(f"Rotated to API key index: {self.current_key_index}")
    
    def make_request(self, endpoint: str, params: dict = None) -> Optional[dict]:
        """Make request to TMDB API with error handling and key rotation"""
        if params is None:
            params = {}
        
        params['api_key'] = self.get_current_api_key()
        
        try:
            response = requests.get(f"{self.base_url}/{endpoint}", params=params)
            
            if response.status_code == 429:  # Rate limited
                logger.warning("Rate limited, rotating API key")
                self.rotate_api_key()
                params['api_key'] = self.get_current_api_key()
                response = requests.get(f"{self.base_url}/{endpoint}", params=params)
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"TMDB API request failed: {e}")
            return None
    
    def get_poster_url(self, poster_path: str, size: str = "w500") -> str:
        """Get full poster URL"""
        if not poster_path:
            return ""
        return f"{self.image_base_url}/{size}{poster_path}"
    
    def get_backdrop_url(self, backdrop_path: str, size: str = "w1280") -> str:
        """Get full backdrop URL"""
        if not backdrop_path:
            return ""
        return f"{self.image_base_url}/{size}{backdrop_path}"
    
    def get_trending_movies(self, time_window: str = "week") -> List[Dict]:
        """Get trending movies"""
        data = self.make_request(f"trending/movie/{time_window}")
        if not data:
            return []
        
        movies = []
        for movie in data.get('results', [])[:10]:
            movies.append(self.format_movie_data(movie))
        
        return movies
    
    def get_popular_movies(self, region: str = "IN", language: str = "en-US") -> List[Dict]:
        """Get popular movies by region"""
        params = {
            'region': region,
            'language': language
        }
        
        data = self.make_request("movie/popular", params)
        if not data:
            return []
        
        movies = []
        for movie in data.get('results', [])[:20]:
            movies.append(self.format_movie_data(movie))
        
        return movies
    
    def search_movies(self, query: str, language: str = "en-US") -> List[Dict]:
        """Search for movies"""
        params = {
            'query': query,
            'language': language
        }
        
        data = self.make_request("search/movie", params)
        if not data:
            return []
        
        movies = []
        for movie in data.get('results', [])[:20]:  # Limit to top 20 results
            movies.append(self.format_movie_data(movie))
        
        return movies
    
    def get_movie_details(self, movie_id: int, language: str = "en-US") -> Optional[Dict]:
        """Get detailed movie information"""
        params = {'language': language}
        
        movie_data = self.make_request(f"movie/{movie_id}", params)
        if not movie_data:
            return None
        
        # Get additional data
        credits_data = self.make_request(f"movie/{movie_id}/credits", params)
        videos_data = self.make_request(f"movie/{movie_id}/videos", params)
        
        return self.format_detailed_movie_data(movie_data, credits_data, videos_data)
    
    def format_movie_data(self, movie_data: Dict) -> Dict:
        """Format basic movie data"""
        return {
            'tmdb_id': movie_data.get('id'),
            'title': movie_data.get('title', ''),
            'year': int(movie_data.get('release_date', '2023')[:4]) if movie_data.get('release_date') else 2023,
            'rating': round(movie_data.get('vote_average', 0) / 2, 1),  # Convert to 5-star scale
            'genre': [genre.get('name') for genre in movie_data.get('genres', [])] if 'genres' in movie_data else [],
            'language': movie_data.get('original_language', 'en'),
            'poster': self.get_poster_url(movie_data.get('poster_path', '')),
            'backdrop': self.get_backdrop_url(movie_data.get('backdrop_path', '')),
            'synopsis': movie_data.get('overview', ''),
            'director': 'Unknown',
            'cast': [],
            'trailer_url': None,
            'industry': 'International'
        }
    
    def format_detailed_movie_data(self, movie_data: Dict, credits_data: Dict = None, videos_data: Dict = None) -> Dict:
        """Format detailed movie data with cast and crew"""
        formatted = self.format_movie_data(movie_data)
        
        # Add genre names
        formatted['genre'] = [genre.get('name') for genre in movie_data.get('genres', [])]
        
        # Add cast and crew
        if credits_data:
            cast = credits_data.get('cast', [])[:5]  # Top 5 cast members
            formatted['cast'] = [actor.get('name') for actor in cast]
            
            crew = credits_data.get('crew', [])
            director = next((person.get('name') for person in crew if person.get('job') == 'Director'), 'Unknown')
            formatted['director'] = director
        
        # Add trailer URL
        if videos_data:
            videos = videos_data.get('results', [])
            trailer = next((video for video in videos if video.get('type') == 'Trailer' and video.get('site') == 'YouTube'), None)
            if trailer:
                formatted['trailer_url'] = f"https://www.youtube.com/watch?v={trailer.get('key')}"
        
        # Determine industry based on language and production countries
        production_countries = movie_data.get('production_countries', [])
        original_language = movie_data.get('original_language', 'en')
        
        if original_language == 'hi' or any(country.get('iso_3166_1') == 'IN' for country in production_countries):
            if original_language in ['ta', 'te', 'kn', 'ml']:
                formatted['industry'] = 'South Indian'
            else:
                formatted['industry'] = 'Bollywood'
        else:
            formatted['industry'] = 'International'
        
        return formatted

# Global TMDB service instance
tmdb_service = TMDBService()