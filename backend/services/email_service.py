import os
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To
from datetime import datetime, timedelta
import logging
from jinja2 import Template

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY', 'your_sendgrid_key_here')
        self.sender_email = os.getenv('SENDER_EMAIL', 'noreply@filmwallaa.com')
        self.sender_name = os.getenv('SENDER_NAME', 'Filmwalla.com')
        self.sg = SendGridAPIClient(self.api_key) if self.api_key != 'your_sendgrid_key_here' else None
        
    def send_email(self, to_emails: List[str], subject: str, html_content: str, plain_content: str = None):
        """Send email to multiple recipients"""
        if not self.sg:
            logger.warning("SendGrid not configured. Email would be sent to: %s", to_emails)
            logger.info("Subject: %s", subject)
            return True
            
        try:
            message = Mail(
                from_email=(self.sender_email, self.sender_name),
                to_emails=to_emails,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
            
            response = self.sg.send(message)
            logger.info(f"Email sent successfully. Status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    def send_welcome_email(self, email: str, name: str = None):
        """Send welcome email to new subscribers"""
        subject = "Welcome to Filmwalla.com! 🎬"
        
        html_template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .btn { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎭 Filmwalla.com</h1>
                <p>Your Gateway to Indian Entertainment</p>
            </div>
            <div class="content">
                <h2>Welcome{% if name %} {{ name }}{% endif %}! 🙏</h2>
                <p>Thank you for subscribing to <strong>Filmwalla.com</strong> - your premier destination for Indian cinema reviews and entertainment news.</p>
                
                <h3>What to Expect:</h3>
                <ul>
                    <li>📧 Weekly digest of top movie reviews</li>
                    <li>🎬 Latest Bollywood, South Indian, and International cinema coverage</li>
                    <li>🌟 Expert reviews in Hindi and English</li>
                    <li>🔥 Breaking entertainment news and updates</li>
                </ul>
                
                <p>Visit our website to explore the latest reviews and discover your next favorite film!</p>
                <a href="https://filmwallaa.com" class="btn">Visit Website</a>
                
                <p><strong>Follow us:</strong> Stay connected for the latest updates!</p>
            </div>
            <div class="footer">
                <p>© 2025 The Voice of Cinema | FILMWALLAA.COM</p>
                <p>You're receiving this because you subscribed to our updates.</p>
                <p><a href="{{ unsubscribe_url }}">Unsubscribe</a> | <a href="https://filmwallaa.com">Visit Website</a></p>
            </div>
        </body>
        </html>
        """)
        
        html_content = html_template.render(
            name=name,
            unsubscribe_url=f"https://filmwallaa.com/unsubscribe?email={email}"
        )
        
        plain_content = f"""
Welcome to The Voice of Cinema!{'  ' + name if name else ''}

Thank you for subscribing to The Voice of Cinema - your premier destination for Indian cinema reviews.

What to Expect:
- Weekly digest of top movie reviews
- Latest Bollywood, South Indian, and International cinema coverage  
- Expert reviews in Hindi and English
- Breaking entertainment news

Visit https://filmwallaa.com to explore the latest reviews!

© 2025 The Voice of Cinema | FILMWALLAA.COM
Unsubscribe: https://filmwallaa.com/unsubscribe?email={email}
        """
        
        return self.send_email([email], subject, html_content, plain_content)
    
    def send_weekly_digest(self, subscribers: List[dict], reviews: List[dict]):
        """Send weekly digest email to all subscribers"""
        if not reviews:
            logger.info("No reviews to send in weekly digest")
            return True
            
        subject = f"🎬 Weekly Cinema Digest - {datetime.now().strftime('%B %d, %Y')}"
        
        html_template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .review-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; }
                .review-title { color: #f97316; font-size: 18px; font-weight: bold; }
                .review-meta { color: #666; font-size: 14px; margin: 5px 0; }
                .rating { color: #fbbf24; }
                .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .btn { display: inline-block; background: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎭 Filmwalla.com</h1>
                <p>Weekly Cinema Digest - {{ date }}</p>
            </div>
            <div class="content">
                <h2>This Week's Top Reviews 🌟</h2>
                <p>Here are the latest movie reviews from our expert critics:</p>
                
                {% for review in reviews %}
                <div class="review-card">
                    <div class="review-title">{{ review.title }}</div>
                    {% if review.title_hindi %}
                    <div class="review-meta">{{ review.title_hindi }}</div>
                    {% endif %}
                    <div class="review-meta">
                        By {{ review.author }} | 
                        <span class="rating">{'★' * (review.rating|int)}{'☆' * (5 - (review.rating|int))}</span> {{ review.rating }}/5
                    </div>
                    <p>{{ review.excerpt }}</p>
                    <a href="https://filmwallaa.com/reviews/{{ review.id }}" class="btn">Read Full Review</a>
                </div>
                {% endfor %}
                
                <hr style="margin: 30px 0;">
                <h3>📱 Don't Miss Out!</h3>
                <p>Visit our website for more reviews, news, and cinema updates.</p>
                <a href="https://filmwallaa.com" class="btn">Visit FILMWALLAA.COM</a>
            </div>
            <div class="footer">
                <p>© 2025 The Voice of Cinema | FILMWALLAA.COM</p>
                <p>You're receiving this weekly digest because you subscribed to our updates.</p>
                <p><a href="{{ unsubscribe_url }}">Unsubscribe</a> | <a href="https://filmwallaa.com">Manage Preferences</a></p>
            </div>
        </body>
        </html>
        """)
        
        # Send to all subscribers
        recipient_emails = [sub['email'] for sub in subscribers]
        
        html_content = html_template.render(
            reviews=reviews,
            date=datetime.now().strftime('%B %d, %Y'),
            unsubscribe_url="https://filmwallaa.com/unsubscribe"
        )
        
        return self.send_email(recipient_emails, subject, html_content)
    
    def send_new_review_notification(self, subscribers: List[dict], review: dict):
        """Send notification about new review via WhatsApp"""
        # This will be handled by WhatsApp service
        pass

# Global email service instance
email_service = EmailService()