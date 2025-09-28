import xml.etree.ElementTree as ET
import re
from datetime import datetime
from typing import List, Dict, Optional
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from tmdb_service import tmdb_service
import uuid
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WordPressMigrator:
    def __init__(self):
        self.posts = []
        self.movies_mapping = {}
        self.failed_mappings = []
        
    def parse_wordpress_xml(self, xml_file_path: str):
        """Parse WordPress XML export file"""
        try:
            tree = ET.parse(xml_file_path)
            root = tree.getroot()
            
            # Define WordPress namespace
            namespaces = {
                'wp': 'http://wordpress.org/export/1.2/',
                'content': 'http://purl.org/rss/1.0/modules/content/',
                'dc': 'http://purl.org/dc/elements/1.1/'
            }
            
            posts = []
            
            for item in root.findall('.//item'):
                post_type = item.find('wp:post_type', namespaces)
                if post_type is not None and post_type.text == 'post':
                    
                    # Extract post data
                    title = item.find('title').text if item.find('title') is not None else ""
                    content = item.find('content:encoded', namespaces)
                    content_text = content.text if content is not None else ""
                    
                    # Clean HTML content
                    if content_text:
                        soup = BeautifulSoup(content_text, 'html.parser')
                        content_text = soup.get_text()
                    
                    # Extract dates
                    pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""
                    wp_date = item.find('wp:post_date', namespaces)
                    wp_date_text = wp_date.text if wp_date is not None else ""
                    
                    # Parse publication date
                    published_at = None
                    try:
                        if wp_date_text:
                            published_at = datetime.strptime(wp_date_text, '%Y-%m-%d %H:%M:%S')
                        elif pub_date:
                            # Parse RFC 2822 date format
                            published_at = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %z')
                            published_at = published_at.replace(tzinfo=None)  # Remove timezone for simplicity
                    except Exception as e:
                        logger.warning(f"Could not parse date for post '{title}': {e}")
                        published_at = datetime.utcnow()
                    
                    # Extract author
                    author = item.find('dc:creator', namespaces)
                    author_name = author.text if author is not None else "Gaurang Bookseller"
                    
                    # Extract categories
                    categories = []
                    for category in item.findall('category'):
                        if category.text:
                            categories.append(category.text)
                    
                    # Extract slug
                    post_name = item.find('wp:post_name', namespaces)
                    slug = post_name.text if post_name is not None else self.create_slug(title)
                    
                    # Extract post status
                    status = item.find('wp:status', namespaces)
                    post_status = status.text if status is not None else "publish"
                    
                    post_data = {
                        'id': str(uuid.uuid4()),
                        'original_title': title,
                        'title': title,
                        'content': content_text,
                        'author': author_name,
                        'published_at': published_at,
                        'categories': categories,
                        'slug': slug,
                        'status': 'draft' if post_status != 'publish' else 'draft',  # Start as draft for review
                        'original_url': item.find('link').text if item.find('link') is not None else "",
                        'migrated_at': datetime.utcnow(),
                        'movie_id': None,  # Will be populated during mapping
                        'tmdb_id': None,
                        'rating': self.extract_rating_from_content(content_text),
                        'excerpt': self.create_excerpt(content_text),
                        'read_time': self.calculate_read_time(content_text),
                        'tags': categories,  # Use categories as tags initially
                        'image': self.extract_featured_image(title)  # Default placeholder
                    }
                    
                    # Only include posts that seem to be movie reviews
                    if self.is_movie_review(title, content_text):
                        posts.append(post_data)
                        logger.info(f"Found movie review: {title}")
            
            self.posts = posts
            logger.info(f"Parsed {len(posts)} movie review posts from WordPress export")
            return posts
            
        except Exception as e:
            logger.error(f"Error parsing WordPress XML: {e}")
            return []
    
    def is_movie_review(self, title: str, content: str) -> bool:
        """Check if post is a movie review"""
        movie_keywords = [
            'movie', 'film', 'review', 'cinema', 'bollywood', 
            'hollywood', 'director', 'actor', 'actress', 'cast',
            'screenplay', 'plot', 'story', 'thriller', 'drama',
            'comedy', 'action', 'rating', 'oscar', 'box office'
        ]
        
        text = (title + ' ' + content).lower()
        keyword_count = sum(1 for keyword in movie_keywords if keyword in text)
        
        # Consider it a movie review if it has multiple movie-related keywords
        return keyword_count >= 3
    
    def extract_rating_from_content(self, content: str) -> Optional[float]:
        """Extract rating from review content"""
        # Look for patterns like "4/5", "3.5/5", "Rating: 4", etc.
        rating_patterns = [
            r'(\d(?:\.\d)?)/5',
            r'rating:?\s*(\d(?:\.\d)?)',
            r'(\d(?:\.\d)?)\s*out\s*of\s*5',
            r'(\d(?:\.\d)?)\s*stars?'
        ]
        
        for pattern in rating_patterns:
            match = re.search(pattern, content.lower())
            if match:
                try:
                    rating = float(match.group(1))
                    return min(rating, 5.0)  # Cap at 5
                except ValueError:
                    continue
        
        return None
    
    def create_excerpt(self, content: str, max_length: int = 200) -> str:
        """Create excerpt from content"""
        if not content:
            return ""
            
        # Clean and truncate
        excerpt = re.sub(r'\s+', ' ', content.strip())
        if len(excerpt) <= max_length:
            return excerpt
            
        # Truncate at word boundary
        truncated = excerpt[:max_length]
        last_space = truncated.rfind(' ')
        if last_space > 0:
            truncated = truncated[:last_space]
            
        return truncated + "..."
    
    def calculate_read_time(self, content: str) -> str:
        """Calculate estimated read time"""
        word_count = len(content.split())
        minutes = max(1, round(word_count / 200))  # Assume 200 words per minute
        return f"{minutes} min read"
    
    def create_slug(self, title: str) -> str:
        """Create URL slug from title"""
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug.strip())
        return slug[:50]  # Limit length
    
    def extract_featured_image(self, title: str) -> str:
        """Generate placeholder image URL"""
        # For now, use placeholder images
        # Later we can integrate with TMDB to get movie posters
        return f"https://images.unsplash.com/photo-1489599735429-c1fdf66d61e1?w=800&h=400&fit=crop&q=80"
    
    async def search_movie_in_tmdb(self, title: str) -> Optional[Dict]:
        """Search for movie in TMDB based on post title"""
        try:
            # Extract movie name from title
            movie_name = self.extract_movie_name_from_title(title)
            if not movie_name:
                return None
            
            logger.info(f"Searching TMDB for: {movie_name}")
            movies = tmdb_service.search_movies(movie_name)
            
            if movies:
                # Return the first match
                movie = movies[0]
                logger.info(f"Found TMDB match: {movie['title']} ({movie['year']})")
                return movie
            else:
                logger.warning(f"No TMDB match found for: {movie_name}")
                return None
                
        except Exception as e:
            logger.error(f"Error searching TMDB for '{title}': {e}")
            return None
    
    def extract_movie_name_from_title(self, title: str) -> Optional[str]:
        """Extract movie name from post title"""
        # Remove common review-related words
        title = title.lower()
        
        # Patterns to remove
        patterns_to_remove = [
            r'\s+review.*$',
            r'\s+movie.*$',
            r'\s+film.*$',
            r'^.*review:?\s*',
            r'\s+the\s+movie.*$',
            r'\s*-\s*my\s+review.*$',
            r'\s*\.\.\.*$'
        ]
        
        movie_name = title
        for pattern in patterns_to_remove:
            movie_name = re.sub(pattern, '', movie_name, flags=re.IGNORECASE)
        
        movie_name = movie_name.strip()
        
        # Clean up common words
        movie_name = re.sub(r'^(a|an|the)\s+', '', movie_name)
        
        return movie_name if movie_name else None
    
    async def create_movie_mappings(self):
        """Create mappings between WordPress posts and TMDB movies"""
        logger.info("Creating movie mappings with TMDB...")
        
        for post in self.posts:
            movie_data = await self.search_movie_in_tmdb(post['original_title'])
            
            if movie_data:
                post['movie_id'] = movie_data.get('tmdb_id')
                post['tmdb_id'] = movie_data.get('tmdb_id')
                post['tmdb_data'] = movie_data
                
                # Update post with movie data
                post['image'] = movie_data.get('poster', post['image'])
                
                # Store mapping
                self.movies_mapping[post['id']] = {
                    'post_title': post['original_title'],
                    'movie_title': movie_data.get('title'),
                    'tmdb_id': movie_data.get('tmdb_id'),
                    'year': movie_data.get('year'),
                    'confidence': 'high'  # Simple confidence for now
                }
            else:
                self.failed_mappings.append({
                    'post_id': post['id'],
                    'post_title': post['original_title'],
                    'reason': 'No TMDB match found'
                })
        
        logger.info(f"Created {len(self.movies_mapping)} movie mappings")
        logger.info(f"Failed to map {len(self.failed_mappings)} posts")
    
    async def save_to_database(self):
        """Save migrated posts to database"""
        try:
            # MongoDB connection
            mongo_url = os.environ['MONGO_URL']
            client = AsyncIOMotorClient(mongo_url)
            db = client[os.environ['DB_NAME']]
            
            # Save posts as draft reviews
            if self.posts:
                result = await db.migrated_reviews.insert_many(self.posts)
                logger.info(f"Saved {len(result.inserted_ids)} posts to database")
            
            # Save mappings
            if self.movies_mapping:
                mapping_docs = [
                    {'post_id': post_id, **mapping_data}
                    for post_id, mapping_data in self.movies_mapping.items()
                ]
                await db.movie_mappings.insert_many(mapping_docs)
                logger.info(f"Saved {len(mapping_docs)} movie mappings")
            
            # Save failed mappings for manual review
            if self.failed_mappings:
                await db.failed_mappings.insert_many(self.failed_mappings)
                logger.info(f"Saved {len(self.failed_mappings)} failed mappings for manual review")
            
            return True
            
        except Exception as e:
            logger.error(f"Error saving to database: {e}")
            return False
    
    def generate_migration_report(self) -> Dict:
        """Generate migration report"""
        return {
            'total_posts_found': len(self.posts),
            'successfully_mapped': len(self.movies_mapping),
            'failed_mappings': len(self.failed_mappings),
            'success_rate': len(self.movies_mapping) / len(self.posts) * 100 if self.posts else 0,
            'posts_with_ratings': len([p for p in self.posts if p['rating']]),
            'posts_by_year': self.group_posts_by_year(),
            'failed_mappings_list': self.failed_mappings[:10]  # First 10 for preview
        }
    
    def group_posts_by_year(self) -> Dict:
        """Group posts by publication year"""
        year_counts = {}
        for post in self.posts:
            if post['published_at']:
                year = post['published_at'].year
                year_counts[year] = year_counts.get(year, 0) + 1
        return year_counts

# Usage function
async def migrate_wordpress_posts(xml_file_path: str):
    """Main migration function"""
    migrator = WordPressMigrator()
    
    # Parse XML
    posts = migrator.parse_wordpress_xml(xml_file_path)
    
    if not posts:
        logger.error("No posts found to migrate")
        return None
    
    # Create movie mappings
    await migrator.create_movie_mappings()
    
    # Save to database
    success = await migrator.save_to_database()
    
    if success:
        # Generate report
        report = migrator.generate_migration_report()
        logger.info("Migration completed successfully!")
        return report
    else:
        logger.error("Migration failed")
        return None

if __name__ == "__main__":
    # Test the migration
    import asyncio
    
    async def test_migration():
        report = await migrate_wordpress_posts('/app/wordpress_export.xml')
        if report:
            print("\n=== MIGRATION REPORT ===")
            print(f"Total posts found: {report['total_posts_found']}")
            print(f"Successfully mapped: {report['successfully_mapped']}")
            print(f"Failed mappings: {report['failed_mappings']}")
            print(f"Success rate: {report['success_rate']:.1f}%")
            print(f"Posts with ratings: {report['posts_with_ratings']}")
            print(f"Posts by year: {report['posts_by_year']}")
            
            if report['failed_mappings_list']:
                print("\nFailed mappings (first 10):")
                for failed in report['failed_mappings_list']:
                    print(f"  - {failed['post_title']} ({failed['reason']})")
    
    # Run the test
    # asyncio.run(test_migration())