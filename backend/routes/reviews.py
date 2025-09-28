from fastapi import APIRouter, HTTPException
from typing import List
from models import EditorialReviewResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.get("/latest", response_model=List[EditorialReviewResponse])
async def get_latest_reviews(limit: int = 10):
    """Get latest published editorial reviews"""
    try:
        reviews = await db.editorial_reviews.find(
            {"status": "published"}
        ).sort("published_at", -1).limit(limit).to_list(limit)
        
        if not reviews:
            # Return mock data for demo if no reviews exist
            mock_reviews = [
                {
                    "id": "1",
                    "movie_id": "1",
                    "title": "Jawan: A Socially Conscious Spectacle",
                    "title_hindi": "जवान: एक सामाजिक रूप से जागरूक तमाशा",
                    "author": "Priya Sharma",
                    "content": "Full review content here...",
                    "excerpt": "Atlee crafts a compelling narrative that balances entertainment with social commentary. Shah Rukh Khan's dual role showcases his versatility...",
                    "rating": 4.5,
                    "tags": ["Bollywood", "Action", "Social Drama"],
                    "read_time": "8 min read",
                    "image": "https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop",
                    "status": "published",
                    "featured": False,
                    "created_at": datetime.utcnow(),
                    "published_at": datetime.utcnow()
                },
                {
                    "id": "2",
                    "movie_id": "2",
                    "title": "Kantara: Folklore Meets Cinema",
                    "title_hindi": "कंतारा: फोकलोर मिट्स सिनेमा",
                    "author": "Rajesh Kumar",
                    "content": "Full review content here...",
                    "excerpt": "Rishab Shetty has created something truly special - a film that honors tradition while delivering contemporary thrills...",
                    "rating": 4.8,
                    "tags": ["Kannada Cinema", "Folklore", "Drama"],
                    "read_time": "10 min read",
                    "image": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop",
                    "status": "published",
                    "featured": True,
                    "created_at": datetime.utcnow(),
                    "published_at": datetime.utcnow()
                }
            ]
            return [EditorialReviewResponse(**review) for review in mock_reviews]
        
        return [EditorialReviewResponse(**review) for review in reviews]
        
    except Exception as e:
        logger.error(f"Error fetching latest reviews: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch latest reviews")