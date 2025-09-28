from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import logging
from wordpress_migration import migrate_wordpress_posts, WordPressMigrator
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/migration", tags=["migration"])

class MigrationStatus(BaseModel):
    status: str
    message: str
    total_posts: int = 0
    processed_posts: int = 0
    mapped_movies: int = 0
    failed_mappings: int = 0

class ReviewApproval(BaseModel):
    review_id: str
    approved: bool
    movie_id: str = None
    title: str = None
    excerpt: str = None
    rating: float = None
    tags: List[str] = []

@router.post("/start-wordpress-migration")
async def start_wordpress_migration(background_tasks: BackgroundTasks):
    """Start WordPress migration process"""
    try:
        # Run migration in background
        background_tasks.add_task(run_migration_task)
        
        return {
            "status": "started",
            "message": "WordPress migration started in background. Check status for updates."
        }
    except Exception as e:
        logger.error(f"Error starting migration: {e}")
        raise HTTPException(status_code=500, detail="Failed to start migration")

async def run_migration_task():
    """Background task to run migration"""
    try:
        logger.info("Starting WordPress migration task...")
        report = await migrate_wordpress_posts('/app/wordpress_export.xml')
        
        if report:
            logger.info(f"Migration completed: {report['successfully_mapped']} posts mapped")
        else:
            logger.error("Migration failed")
            
    except Exception as e:
        logger.error(f"Migration task error: {e}")

@router.get("/status", response_model=MigrationStatus)
async def get_migration_status():
    """Get migration status"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Count migrated posts
        total_posts = await db.migrated_reviews.count_documents({})
        mapped_movies = await db.movie_mappings.count_documents({})
        failed_mappings = await db.failed_mappings.count_documents({})
        
        return MigrationStatus(
            status="completed" if total_posts > 0 else "not_started",
            message=f"Found {total_posts} migrated posts ready for review",
            total_posts=total_posts,
            processed_posts=total_posts,
            mapped_movies=mapped_movies,
            failed_mappings=failed_mappings
        )
        
    except Exception as e:
        logger.error(f"Error getting migration status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get migration status")

@router.get("/preview-posts")
async def get_migrated_posts_preview(limit: int = 20, skip: int = 0):
    """Get preview of migrated posts for review"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get migrated posts
        posts = await db.migrated_reviews.find().skip(skip).limit(limit).to_list(limit)
        
        # Convert ObjectId to string
        for post in posts:
            if '_id' in post:
                post['_id'] = str(post['_id'])
        
        return {
            "posts": posts,
            "total": await db.migrated_reviews.count_documents({}),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error getting posts preview: {e}")
        raise HTTPException(status_code=500, detail="Failed to get posts preview")

@router.get("/failed-mappings")
async def get_failed_mappings():
    """Get posts that failed TMDB mapping"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        failed_mappings = await db.failed_mappings.find().to_list(100)
        
        # Convert ObjectId to string
        for mapping in failed_mappings:
            if '_id' in mapping:
                mapping['_id'] = str(mapping['_id'])
        
        return {
            "failed_mappings": failed_mappings,
            "total": len(failed_mappings)
        }
        
    except Exception as e:
        logger.error(f"Error getting failed mappings: {e}")
        raise HTTPException(status_code=500, detail="Failed to get failed mappings")

@router.post("/approve-review")
async def approve_review(approval: ReviewApproval):
    """Approve and publish a migrated review"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get the migrated review
        migrated_review = await db.migrated_reviews.find_one({"id": approval.review_id})
        if not migrated_review:
            raise HTTPException(status_code=404, detail="Review not found")
        
        if approval.approved:
            # Create final review document
            review_data = {
                "id": migrated_review['id'],
                "movie_id": approval.movie_id or migrated_review.get('movie_id'),
                "title": approval.title or migrated_review['title'],
                "author": migrated_review['author'],
                "content": migrated_review['content'],
                "excerpt": approval.excerpt or migrated_review['excerpt'],
                "rating": approval.rating or migrated_review.get('rating', 4.0),
                "tags": approval.tags or migrated_review['tags'],
                "read_time": migrated_review['read_time'],
                "image": migrated_review['image'],
                "status": "published",
                "featured": False,
                "created_at": migrated_review['migrated_at'],
                "published_at": migrated_review['published_at'],
                "updated_at": datetime.utcnow(),
                "migrated_from_wordpress": True,
                "original_url": migrated_review.get('original_url')
            }
            
            # Insert into editorial_reviews collection
            await db.editorial_reviews.insert_one(review_data)
            
            # Remove from migrated_reviews
            await db.migrated_reviews.delete_one({"id": approval.review_id})
            
            return {
                "status": "approved",
                "message": "Review approved and published successfully",
                "review_id": approval.review_id
            }
        else:
            # Mark as rejected
            await db.migrated_reviews.update_one(
                {"id": approval.review_id},
                {"$set": {"status": "rejected", "rejected_at": datetime.utcnow()}}
            )
            
            return {
                "status": "rejected",
                "message": "Review marked as rejected",
                "review_id": approval.review_id
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving review: {e}")
        raise HTTPException(status_code=500, detail="Failed to approve review")

@router.post("/manual-movie-mapping")
async def create_manual_movie_mapping(
    post_id: str,
    tmdb_id: int,
    confidence: str = "manual"
):
    """Manually map a post to a TMDB movie"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get movie data from TMDB
        from tmdb_service import tmdb_service
        movie_data = tmdb_service.get_movie_details(tmdb_id)
        
        if not movie_data:
            raise HTTPException(status_code=404, detail="Movie not found in TMDB")
        
        # Update the migrated review with movie data
        await db.migrated_reviews.update_one(
            {"id": post_id},
            {
                "$set": {
                    "movie_id": tmdb_id,
                    "tmdb_id": tmdb_id,
                    "tmdb_data": movie_data,
                    "image": movie_data.get('poster'),
                    "manual_mapping": True
                }
            }
        )
        
        # Create mapping record
        mapping_data = {
            "post_id": post_id,
            "movie_title": movie_data.get('title'),
            "tmdb_id": tmdb_id,
            "year": movie_data.get('year'),
            "confidence": confidence,
            "created_at": datetime.utcnow()
        }
        
        await db.movie_mappings.insert_one(mapping_data)
        
        # Remove from failed mappings if exists
        await db.failed_mappings.delete_one({"post_id": post_id})
        
        return {
            "status": "success",
            "message": "Manual mapping created successfully",
            "movie_title": movie_data.get('title'),
            "tmdb_id": tmdb_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating manual mapping: {e}")
        raise HTTPException(status_code=500, detail="Failed to create manual mapping")

@router.delete("/clear-migration-data")
async def clear_migration_data():
    """Clear all migration data (for testing)"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Clear collections
        await db.migrated_reviews.delete_many({})
        await db.movie_mappings.delete_many({})
        await db.failed_mappings.delete_many({})
        
        return {
            "status": "success",
            "message": "All migration data cleared"
        }
        
    except Exception as e:
        logger.error(f"Error clearing migration data: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear migration data")