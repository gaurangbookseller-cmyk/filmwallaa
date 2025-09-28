from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import os
from datetime import datetime
import logging

# Import these after environment is loaded
import sys
sys.path.append('/app/backend')
from models import MovieResponse, MovieCreate
from tmdb_service import tmdb_service
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/featured", response_model=List[MovieResponse])
async def get_featured_movies():
    """Get featured movies from trending and popular lists"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get trending movies from TMDB
        trending_movies = tmdb_service.get_trending_movies()
        
        if not trending_movies:
            # Fallback to cached movies if TMDB fails
            cached_movies = await db.movies.find().limit(4).to_list(4)
            for movie in cached_movies:
                movie['id'] = str(movie.pop('_id'))
            return [MovieResponse(**movie) for movie in cached_movies]
        
        # Cache movies in database
        featured_movies = []
        for movie_data in trending_movies[:4]:  # Get top 4 featured movies
            movie_data['created_at'] = datetime.utcnow()
            movie_data['updated_at'] = datetime.utcnow()
            
            # Check if movie already exists
            existing_movie = await db.movies.find_one({"tmdb_id": movie_data['tmdb_id']})
            if existing_movie:
                existing_movie['id'] = str(existing_movie.pop('_id'))
                featured_movies.append(MovieResponse(**existing_movie))
            else:
                # Insert new movie
                result = await db.movies.insert_one(movie_data)
                movie_data['id'] = str(result.inserted_id)
                featured_movies.append(MovieResponse(**movie_data))
        
        return featured_movies
        
    except Exception as e:
        logger.error(f"Error fetching featured movies: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured movies")

@router.get("/search", response_model=List[MovieResponse])
async def search_movies(
    q: str = Query(..., description="Search query"),
    language: str = Query("en-US", description="Language code"),
    limit: int = Query(20, le=50, description="Number of movies to fetch")
):
    """Search movies by title"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        movies = tmdb_service.search_movies(query=q, language=language)
        
        if not movies:
            return []
        
        # Cache and return search results
        search_results = []
        for movie_data in movies[:limit]:
            movie_data['created_at'] = datetime.utcnow()
            movie_data['updated_at'] = datetime.utcnow()
            
            existing_movie = await db.movies.find_one({"tmdb_id": movie_data['tmdb_id']})
            if existing_movie:
                existing_movie['id'] = str(existing_movie.pop('_id'))
                search_results.append(MovieResponse(**existing_movie))
            else:
                result = await db.movies.insert_one(movie_data)
                movie_data['id'] = str(result.inserted_id)
                search_results.append(MovieResponse(**movie_data))
        
        return search_results
        
    except Exception as e:
        logger.error(f"Error searching movies: {e}")
        raise HTTPException(status_code=500, detail="Failed to search movies")

@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie_details(movie_id: str):
    """Get detailed movie information"""
    try:
        # Try to find movie in database first
        movie = await db.movies.find_one({"id": movie_id})
        if movie:
            return MovieResponse(**movie)
        
        # Try finding by TMDB ID
        try:
            tmdb_id = int(movie_id)
            movie = await db.movies.find_one({"tmdb_id": tmdb_id})
            if movie:
                return MovieResponse(**movie)
            
            # Fetch from TMDB if not in database
            movie_data = tmdb_service.get_movie_details(tmdb_id)
            if movie_data:
                movie_data['created_at'] = datetime.utcnow()
                movie_data['updated_at'] = datetime.utcnow()
                
                result = await db.movies.insert_one(movie_data)
                movie_data['id'] = str(result.inserted_id)
                return MovieResponse(**movie_data)
                
        except ValueError:
            pass  # movie_id is not a valid TMDB ID
        
        raise HTTPException(status_code=404, detail="Movie not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching movie details: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch movie details")