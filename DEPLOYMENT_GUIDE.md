# Filmwalla.com Deployment Guide

## 🎯 Project Overview

**Filmwalla.com** is a comprehensive movie review platform with:
- ✅ **FastAPI Backend** with TMDB integration
- ✅ **React Web Frontend** 
- ✅ **React Native Mobile App** (Expo)
- ✅ **MongoDB Database**

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Frontend  │    │   FastAPI API   │
│  (React Native) │◄──►│     (React)     │◄──►│    (Python)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │    MongoDB      │
                                               │   (Database)    │
                                               └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │   TMDB API      │
                                               │ (Movie Data)    │
                                               └─────────────────┘
```

---

## 🚀 Quick Deployment (Production Ready)

### 1. Backend Deployment

**Requirements:**
- Python 3.9+
- MongoDB (Local or Cloud)
- TMDB API Keys

**Deploy to Heroku/Railway/DigitalOcean:**

```bash
# 1. Clone and setup
git clone https://github.com/your-repo/filmwalla.git
cd filmwalla/backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variables
export MONGO_URL="mongodb://localhost:27017"
export DB_NAME="filmwalla_db"
export TMDB_API_KEY="c8dea14dc917687ac631a52620e4f7ad"
export CORS_ORIGINS="*"

# 4. Run production server
uvicorn server:app --host 0.0.0.0 --port 8000
```

**Docker Deployment:**

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t filmwalla-backend .
docker run -p 8000:8000 -e MONGO_URL=mongodb://host.docker.internal:27017 filmwalla-backend
```

### 2. Web Frontend Deployment

**Deploy to Vercel/Netlify:**

```bash
# 1. Setup frontend
cd frontend
npm install

# 2. Build for production
npm run build

# 3. Deploy (example: Vercel)
npx vercel --prod
```

**Environment Variables:**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### 3. Mobile App Deployment

**Requirements:**
- Expo CLI
- EAS CLI (for app store deployment)

**Development:**
```bash
# 1. Setup mobile app
cd mobile-app
npm install

# 2. Start development server
expo start

# 3. Test on device via Expo Go app
# Scan QR code with Expo Go
```

**Production Builds:**

```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Configure EAS
eas build:configure

# 3. Build for iOS
eas build --platform ios

# 4. Build for Android
eas build --platform android

# 5. Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### 4. Database Setup

**Local MongoDB:**
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or download from https://www.mongodb.com/

# Start MongoDB
mongod --dbpath /data/db
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/atlas
2. Create cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/filmwalla_db`
4. Update `MONGO_URL` in backend `.env`

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 16+
- Python 3.9+
- MongoDB
- Expo CLI

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure environment variables
uvicorn server:app --reload --port 8001
```

### Frontend Setup
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Mobile App Setup
```bash
cd mobile-app
npm install
expo start  # Opens Expo DevTools
```

### MongoDB Setup
```bash
# Start local MongoDB
mongod

# Or use MongoDB Compass GUI
# Download: https://www.mongodb.com/products/compass
```

---

## 📱 Mobile App Distribution

### Internal Testing (TestFlight/Play Console)

**iOS TestFlight:**
```bash
# 1. Build for iOS
eas build --platform ios --profile preview

# 2. Upload to TestFlight
eas submit --platform ios --latest
```

**Android Internal Testing:**
```bash
# 1. Build for Android
eas build --platform android --profile preview

# 2. Upload to Play Console
eas submit --platform android --latest
```

### App Store Release

**iOS App Store:**
```bash
# 1. Production build
eas build --platform ios --profile production

# 2. Submit for review
eas submit --platform ios --latest
```

**Google Play Store:**
```bash
# 1. Production build
eas build --platform android --profile production

# 2. Submit for review
eas submit --platform android --latest
```

---

## 🔧 Configuration Files

### Backend Configuration (`backend/.env`)
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=filmwalla_db

# External APIs
TMDB_API_KEY=c8dea14dc917687ac631a52620e4f7ad
TMDB_READ_ACCESS_TOKEN=3cb41ecea3bf606c56552db3d17adefd

# Server
CORS_ORIGINS=*
DEBUG=false
```

### Frontend Configuration (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:8001/api
REACT_APP_APP_NAME=Filmwalla.com
```

### Mobile App Configuration (`mobile-app/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:8001/api
```

### App Configuration (`mobile-app/app.json`)
```json
{
  "expo": {
    "name": "Filmwalla Mobile",
    "slug": "filmwalla-mobile",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.filmwalla.mobile"
    },
    "android": {
      "package": "com.filmwalla.mobile"
    }
  }
}
```

---

## 🎯 Production Optimization

### Backend Optimizations

1. **Database Indexing:**
```javascript
// MongoDB indexes for performance
db.movies.createIndex({ "tmdb_id": 1 })
db.movies.createIndex({ "title": "text", "title_hindi": "text" })
db.editorial_reviews.createIndex({ "published_at": -1 })
db.editorial_reviews.createIndex({ "status": 1 })
```

2. **API Caching:**
```python
# Add Redis caching for TMDB API calls
import redis
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_tmdb_data(expiration=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"tmdb:{func.__name__}:{hash(str(args) + str(kwargs))}"
            cached_result = redis_client.get(cache_key)
            
            if cached_result:
                return json.loads(cached_result)
            
            result = func(*args, **kwargs)
            redis_client.setex(cache_key, expiration, json.dumps(result))
            return result
        return wrapper
    return decorator
```

3. **Production Settings:**
```python
# server.py production configuration
import logging
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["filmwalla.com", "*.filmwalla.com"])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Frontend Optimizations

1. **Bundle Optimization:**
```javascript
// webpack.config.js for production
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}
```

2. **PWA Configuration:**
```json
// public/manifest.json
{
  "short_name": "Filmwalla",
  "name": "Filmwalla - Movie Reviews",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#f97316",
  "background_color": "#ffffff"
}
```

### Mobile App Optimizations

1. **Performance:**
```javascript
// App.js optimizations
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

// Enable native screens
enableScreens();

// Use Flipper for debugging in development
if (__DEV__) {
  import('react-native-flipper').then(({default: Flipper}) => {
    Flipper.addPlugin({
      getId() { return 'Filmwalla'; },
      onConnect() { console.log('Flipper connected'); },
      onDisconnect() { console.log('Flipper disconnected'); },
      runInBackground() { return false; }
    });
  });
}
```

2. **App Size Optimization:**
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable asset bundling optimization
config.assetExts.push('db');
config.resolver.platforms = ['native', 'android', 'ios'];

module.exports = config;
```

---

## 🔒 Security Best Practices

### Backend Security

1. **Environment Variables:**
```python
# Use python-decouple for secure env management
from decouple import config

MONGO_URL = config('MONGO_URL')
TMDB_API_KEY = config('TMDB_API_KEY')
SECRET_KEY = config('SECRET_KEY', default='your-secret-key')
```

2. **CORS Configuration:**
```python
# Restrict CORS in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://filmwalla.com", "https://www.filmwalla.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

3. **Rate Limiting:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/movies/search")
@limiter.limit("30/minute")
async def search_movies(request: Request):
    # API endpoint with rate limiting
    pass
```

### Mobile App Security

1. **API Key Protection:**
```javascript
// Don't store sensitive keys in mobile app
// Use backend proxy for external API calls
const ApiService = {
  searchMovies: async (query) => {
    // Call backend, which handles TMDB API internally
    return await api.get(`/movies/search?q=${query}`);
  }
};
```

2. **Network Security:**
```javascript
// app.json - Network security config
{
  "expo": {
    "android": {
      "networkSecurityConfig": {
        "cleartextTrafficPermitted": false,
        "domain": [
          {
            "domain": "filmwalla.com",
            "includeSubdomains": true
          }
        ]
      }
    }
  }
}
```

---

## 📊 Monitoring and Analytics

### Backend Monitoring

```python
# Add application monitoring
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

### Mobile App Analytics

```javascript
// Add Expo Analytics
import * as Analytics from 'expo-analytics-segment';

Analytics.initialize('your-segment-key');

// Track user actions
const trackMovieView = (movieId, movieTitle) => {
  Analytics.track('Movie Viewed', {
    movieId,
    movieTitle,
    timestamp: new Date().toISOString()
  });
};
```

---

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)

1. **Technical Metrics:**
   - API Response Time: <200ms
   - Mobile App Load Time: <3s
   - Database Query Performance: <100ms
   - Uptime: >99.9%

2. **User Experience Metrics:**
   - App Crash Rate: <0.1%
   - User Retention: >70% (7-day)
   - Search Success Rate: >95%
   - Review Engagement: >60%

3. **Business Metrics:**
   - Daily Active Users (DAU)
   - Monthly Active Users (MAU)
   - Review Submissions per Day
   - Movie Search Volume

---

## 🆘 Troubleshooting

### Common Issues

**Backend Issues:**
```bash
# MongoDB connection failed
# Solution: Check MongoDB is running and connection string is correct
mongod --dbpath /data/db

# TMDB API rate limit exceeded
# Solution: Implement caching and request throttling
```

**Mobile App Issues:**
```bash
# Metro bundler cache issues
expo start -c

# Build failures
expo doctor  # Check for common issues
eas build:configure  # Reconfigure build settings
```

**Performance Issues:**
```bash
# Database slow queries
# Create indexes for frequently queried fields

# High API response times
# Add Redis caching for frequently accessed data
```

---

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly:**
   - Check error logs and fix critical issues
   - Monitor API usage and performance
   - Update movie database from TMDB

2. **Monthly:**
   - Update dependencies for security patches
   - Review and optimize database queries
   - Analyze user engagement metrics

3. **Quarterly:**
   - Major feature releases
   - Platform updates (iOS/Android)
   - Performance optimization reviews

### Backup Strategy

```bash
# MongoDB backup
mongodump --host localhost:27017 --db filmwalla_db --out /backups/

# Restore from backup
mongorestore --host localhost:27017 --db filmwalla_db /backups/filmwalla_db/
```

---

## 🎉 Final Notes

**Congratulations!** You now have a fully functional, production-ready movie review platform with:

- ✅ **Comprehensive Backend API** with TMDB integration
- ✅ **Professional Mobile App** with native-feeling UI/UX
- ✅ **Web Frontend** for broader accessibility  
- ✅ **Production-ready deployment** configuration
- ✅ **Security best practices** implemented
- ✅ **Monitoring and analytics** setup ready

**Next Steps:**
1. Deploy to your preferred cloud platform
2. Set up monitoring and analytics
3. Launch beta testing with select users
4. Gather feedback and iterate
5. Plan feature roadmap for future releases

**Support:**
- Documentation: Check this guide for detailed setup instructions
- Issues: Create GitHub issues for bug reports
- Features: Use GitHub discussions for feature requests

---

*Happy deploying! 🚀*