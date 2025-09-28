from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from typing import List
from models import (
    SubscriptionCreate, SubscriptionResponse, Subscription, 
    QuickSubscribe
)
from services.email_service import email_service
from services.whatsapp_service import whatsapp_service
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import logging
from passlib.context import CryptContext
import secrets

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

@router.post("/subscribe", response_model=SubscriptionResponse)
async def create_subscription(
    subscription: SubscriptionCreate, 
    background_tasks: BackgroundTasks
):
    """Create a new subscription with full preferences"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Check if email already subscribed
        existing_sub = await db.subscriptions.find_one({
            "email": subscription.email,
            "is_active": True
        })
        
        if existing_sub:
            existing_sub['id'] = str(existing_sub.pop('_id'))
            return SubscriptionResponse(**existing_sub)
        
        # Create new subscription
        sub_data = subscription.dict()
        sub_data['subscribed_at'] = datetime.utcnow()
        sub_data['is_active'] = True
        
        result = await db.subscriptions.insert_one(sub_data)
        sub_data['id'] = str(result.inserted_id)
        
        # Send welcome email in background
        background_tasks.add_task(
            email_service.send_welcome_email,
            subscription.email,
            subscription.name
        )
        
        return SubscriptionResponse(**sub_data)
    
    except Exception as e:
        logger.error(f"Error creating subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to create subscription")

@router.post("/quick-subscribe", response_model=dict)
async def quick_subscribe(
    subscription: QuickSubscribe,
    background_tasks: BackgroundTasks
):
    """Quick email subscription (newsletter signup)"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Check if email already subscribed
        existing_sub = await db.subscriptions.find_one({
            "email": subscription.email,
            "is_active": True
        })
        
        if existing_sub:
            return {
                "status": "success",
                "message": "You're already subscribed to our weekly digest!",
                "already_subscribed": True
            }
        
        # Create new subscription with default settings
        sub_data = {
            "email": subscription.email,
            "name": subscription.name,
            "subscription_type": "weekly_digest",
            "email_notifications": True,
            "whatsapp_notifications": False,
            "is_active": True,
            "subscribed_at": datetime.utcnow()
        }
        
        result = await db.subscriptions.insert_one(sub_data)
        
        # Send welcome email in background
        background_tasks.add_task(
            email_service.send_welcome_email,
            subscription.email,
            subscription.name
        )
        
        return {
            "status": "success",
            "message": "Successfully subscribed to weekly cinema digest!",
            "subscription_id": str(result.inserted_id)
        }
    
    except Exception as e:
        logger.error(f"Error in quick subscribe: {e}")
        raise HTTPException(status_code=500, detail="Failed to subscribe")

@router.get("/", response_model=List[SubscriptionResponse])
async def get_subscriptions(
    active_only: bool = Query(True, description="Filter active subscriptions only"),
    limit: int = Query(100, le=1000, description="Limit results")
):
    """Get all subscriptions (admin endpoint)"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        query = {"is_active": True} if active_only else {}
        subscriptions = await db.subscriptions.find(query).limit(limit).to_list(limit)
        
        for sub in subscriptions:
            sub['id'] = str(sub.pop('_id'))
            
        return [SubscriptionResponse(**sub) for sub in subscriptions]
    
    except Exception as e:
        logger.error(f"Error fetching subscriptions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch subscriptions")

@router.post("/unsubscribe")
async def unsubscribe_email(
    email: str = Query(..., description="Email to unsubscribe")
):
    """Unsubscribe email from all notifications"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        result = await db.subscriptions.update_one(
            {"email": email, "is_active": True},
            {
                "$set": {
                    "is_active": False,
                    "unsubscribed_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            return {
                "status": "info",
                "message": "Email not found or already unsubscribed"
            }
        
        return {
            "status": "success",
            "message": "Successfully unsubscribed from all notifications"
        }
    
    except Exception as e:
        logger.error(f"Error unsubscribing: {e}")
        raise HTTPException(status_code=500, detail="Failed to unsubscribe")

@router.post("/send-weekly-digest")
async def send_weekly_digest_manually(
    background_tasks: BackgroundTasks
):
    """Manually trigger weekly digest (admin endpoint)"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get active subscribers
        subscribers = await db.subscriptions.find({
            "is_active": True,
            "email_notifications": True
        }).to_list(1000)
        
        if not subscribers:
            return {
                "status": "info",
                "message": "No active subscribers found"
            }
        
        # Get latest published reviews (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        reviews = await db.editorial_reviews.find({
            "status": "published",
            "published_at": {"$gte": week_ago}
        }).sort("published_at", -1).limit(10).to_list(10)
        
        if not reviews:
            # If no reviews in last 7 days, get latest 5 reviews
            reviews = await db.editorial_reviews.find({
                "status": "published"
            }).sort("published_at", -1).limit(5).to_list(5)
        
        # Send email digest in background
        background_tasks.add_task(
            email_service.send_weekly_digest,
            subscribers,
            reviews
        )
        
        # Send WhatsApp notifications
        background_tasks.add_task(
            whatsapp_service.send_weekly_digest_notification,
            subscribers,
            len(reviews)
        )
        
        return {
            "status": "success",
            "message": f"Weekly digest queued for {len(subscribers)} subscribers",
            "subscriber_count": len(subscribers),
            "review_count": len(reviews)
        }
    
    except Exception as e:
        logger.error(f"Error sending weekly digest: {e}")
        raise HTTPException(status_code=500, detail="Failed to send weekly digest")

@router.post("/notify-new-review/{review_id}")
async def notify_new_review(
    review_id: str,
    background_tasks: BackgroundTasks
):
    """Send notifications for new review publication"""
    try:
        # MongoDB connection
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get the review
        review = await db.editorial_reviews.find_one({"id": review_id})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Get WhatsApp subscribers only (instant notifications)
        subscribers = await db.subscriptions.find({
            "is_active": True,
            "whatsapp_notifications": True,
            "phone_number": {"$exists": True, "$ne": None}
        }).to_list(1000)
        
        if not subscribers:
            return {
                "status": "info",
                "message": "No WhatsApp subscribers found"
            }
        
        # Send WhatsApp notifications in background
        background_tasks.add_task(
            whatsapp_service.send_new_review_notification,
            subscribers,
            review
        )
        
        return {
            "status": "success",
            "message": f"Review notifications queued for {len(subscribers)} WhatsApp subscribers",
            "subscriber_count": len(subscribers)
        }
    
    except Exception as e:
        logger.error(f"Error sending review notifications: {e}")
        raise HTTPException(status_code=500, detail="Failed to send notifications")