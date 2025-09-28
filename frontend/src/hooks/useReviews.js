import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useLatestReviews = (limit = 10) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.reviews.getLatest(limit);
        setReviews(data);
      } catch (err) {
        console.error('Error fetching latest reviews:', err);
        setError('Failed to load reviews');
        // Fallback to mock data if API fails
        const { latestReviews } = await import('../data/mockData');
        setReviews(latestReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestReviews();
  }, [limit]);

  return { reviews, loading, error };
};

export default useLatestReviews;