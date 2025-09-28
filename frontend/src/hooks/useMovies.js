import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useFeaturedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.movies.getFeatured();
        setMovies(data);
      } catch (err) {
        console.error('Error fetching featured movies:', err);
        setError('Failed to load featured movies');
        // Fallback to mock data if API fails
        const { featuredMovies } = await import('../data/mockData');
        setMovies(featuredMovies);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  return { movies, loading, error };
};

export const useMovieSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.movies.search(query);
      setResults(data);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchMovies };
};

export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.movies.getDetails(movieId);
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { movie, loading, error };
};