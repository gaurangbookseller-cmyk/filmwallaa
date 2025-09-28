from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Movie Models
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
    industry: str  # Bollywood, Kollywood, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

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

# Review Models
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
    created_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[datetime] = None

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
    created_at: datetime
    published_at: Optional[datetime] = None