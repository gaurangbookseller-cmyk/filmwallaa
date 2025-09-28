from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Movie Models (existing)
class Movie(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tmdb_id: int
    title: str
    title_hindi: Optional[str] = None
    year: int
    rating: float
    genre: List[str]
    language: str
    poster: str
    backdrop: str
    director: str
    cast: List[str]
    synopsis: str
    trailer_url: Optional[str] = None
    industry: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User & Subscription Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password: str  # will be hashed
    role: str = "user"  # user, editor, admin
    is_active: bool = True
    phone_number: Optional[str] = None
    preferences: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    is_active: bool
    phone_number: Optional[str] = None
    preferences: dict
    created_at: datetime

# Subscription Models
class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    phone_number: Optional[str] = None
    user_id: Optional[str] = None  # Link to user account if exists
    subscription_type: str = "weekly_digest"  # weekly_digest, instant_notifications
    email_notifications: bool = True
    whatsapp_notifications: bool = False
    is_active: bool = True
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    unsubscribed_at: Optional[datetime] = None

class SubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone_number: Optional[str] = None
    subscription_type: str = "weekly_digest"
    email_notifications: bool = True
    whatsapp_notifications: bool = False

class SubscriptionResponse(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    phone_number: Optional[str] = None
    subscription_type: str
    email_notifications: bool
    whatsapp_notifications: bool
    is_active: bool
    subscribed_at: datetime

class QuickSubscribe(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Review Models (updated)
class EditorialReview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    movie_id: str
    title: str
    title_hindi: Optional[str] = None
    author: str
    content: str
    excerpt: str
    rating: float
    tags: List[str]
    read_time: str
    image: str
    status: str = "draft"  # draft, published
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EditorialReviewCreate(BaseModel):
    movie_id: str
    title: str
    title_hindi: Optional[str] = None
    author: str
    content: str
    excerpt: str
    rating: float
    tags: List[str]
    read_time: str
    image: str

class EditorialReviewResponse(BaseModel):
    id: str
    movie_id: str
    title: str
    title_hindi: Optional[str] = None
    author: str
    content: str
    excerpt: str
    rating: float
    tags: List[str]
    read_time: str
    image: str
    status: str
    featured: bool
    created_at: datetime
    published_at: Optional[datetime] = None

# Newsletter Models
class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subject: str
    content: str
    review_ids: List[str] = []
    sent_to_count: int = 0
    status: str = "draft"  # draft, sent
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sent_at: Optional[datetime] = None

class MovieCreate(BaseModel):
    tmdb_id: int

class MovieResponse(BaseModel):
    id: str
    tmdb_id: int
    title: str
    title_hindi: Optional[str] = None
    year: int
    rating: float
    genre: List[str]
    language: str
    poster: str
    backdrop: str
    director: str
    cast: List[str]
    synopsis: str
    trailer_url: Optional[str] = None
    industry: str