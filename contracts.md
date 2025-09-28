# API Contracts & Backend Implementation Plan

## Frontend Mock Data Integration
Currently using mock data from `/app/frontend/src/data/mockData.js` for:
- Featured movies with TMDB-style data structure
- Latest reviews with Hindi/English titles
- News articles and user reviews
- Categories and language support

## TMDB API Integration

### Movie Data Endpoints
```
GET /api/movies/featured - Get featured movies
GET /api/movies/popular - Get popular movies by region
GET /api/movies/search?q={query} - Search movies
GET /api/movies/{id} - Get movie details
GET /api/movies/{id}/videos - Get movie trailers
```

### Review Management Endpoints
```
POST /api/reviews - Create editorial review
GET /api/reviews/latest - Get latest reviews
GET /api/reviews/{id} - Get specific review
PUT /api/reviews/{id} - Update review
DELETE /api/reviews/{id} - Delete review
```

### User Management Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
POST /api/user-reviews - User movie reviews
GET /api/user-reviews/{movieId} - Get user reviews for movie
```

### News & Content Endpoints
```
GET /api/news/latest - Latest cinema news
POST /api/news - Create news article
GET /api/categories - Get movie categories
```

## Database Schema

### Movies Collection
```javascript
{
  tmdbId: Number,
  title: String,
  titleHindi: String,
  year: Number,
  rating: Number,
  genre: [String],
  language: String,
  poster: String,
  backdrop: String,
  director: String,
  cast: [String],
  synopsis: String,
  trailerUrl: String,
  industry: String, // Bollywood, Kollywood, etc.
  createdAt: Date,
  updatedAt: Date
}
```

### Editorial Reviews Collection
```javascript
{
  movieId: ObjectId,
  title: String,
  titleHindi: String,
  author: String,
  content: String,
  excerpt: String,
  rating: Number,
  tags: [String],
  readTime: String,
  image: String,
  status: String, // draft, published
  createdAt: Date,
  publishedAt: Date
}
```

### User Reviews Collection
```javascript
{
  userId: ObjectId,
  movieId: ObjectId,
  rating: Number,
  review: String,
  createdAt: Date
}
```

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: String, // user, editor, admin
  preferences: {
    language: String,
    favoriteGenres: [String]
  },
  createdAt: Date
}
```

### News Articles Collection
```javascript
{
  title: String,
  titleHindi: String,
  author: String,
  content: String,
  excerpt: String,
  category: String,
  image: String,
  tags: [String],
  readTime: String,
  status: String,
  createdAt: Date,
  publishedAt: Date
}
```

## Frontend-Backend Integration Plan

### Replace Mock Data
1. Update `FeaturedReviews.jsx` to call `/api/reviews/latest`
2. Update `Hero.jsx` to call `/api/movies/featured`
3. Add loading states and error handling
4. Implement real search functionality
5. Add user authentication context

### TMDB Integration Details
- Use TMDB API keys: `c8dea14dc917687ac631a52620e4f7ad`, `3cb41ecea3bf606c56552db3d17adefd`
- Cache movie data in MongoDB for performance
- Sync movie details, trailers, and posters
- Support multi-language content (Hindi translations)

### Authentication Flow
1. JWT-based authentication
2. Role-based access (readers, editors, admins)
3. User preferences for language and content
4. Editorial review creation for authorized users

### Search & Filtering
1. Movie search with TMDB integration
2. Review search within editorial content
3. Filter by genre, language, year, rating
4. Support Hindi and English search terms

## Implementation Priority
1. ✅ Frontend with mock data - COMPLETED
2. 🔄 TMDB API integration and movie endpoints
3. 🔄 Editorial review management system
4. 🔄 User authentication and profiles
5. 🔄 User review system
6. 🔄 News and content management
7. 🔄 Advanced search and recommendations

## Testing Strategy
- Backend API testing with curl/Postman
- Frontend integration testing
- TMDB API rate limiting handling
- Multi-language content validation
- User authentication flows