import os
from typing import List
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
import logging

logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID', 'your_twilio_sid_here')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN', 'your_twilio_token_here')
        self.whatsapp_number = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')  # Twilio Sandbox
        
        if (self.account_sid != 'your_twilio_sid_here' and 
            self.auth_token != 'your_twilio_token_here'):
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            logger.warning("Twilio not configured. WhatsApp messages will be logged only.")
    
    def send_message(self, to_number: str, message: str) -> bool:
        """Send WhatsApp message to a single recipient"""
        if not self.client:
            logger.info(f"WhatsApp message to {to_number}: {message}")
            return True
            
        try:
            # Ensure the number is in WhatsApp format
            if not to_number.startswith('whatsapp:'):
                to_number = f'whatsapp:{to_number}'
                
            message = self.client.messages.create(
                body=message,
                from_=self.whatsapp_number,
                to=to_number
            )
            
            logger.info(f"WhatsApp message sent successfully. SID: {message.sid}")
            return True
            
        except TwilioException as e:
            logger.error(f"Failed to send WhatsApp message: {str(e)}")
            return False
    
    def send_bulk_messages(self, recipients: List[dict], message_template: str) -> int:
        """Send WhatsApp messages to multiple recipients"""
        sent_count = 0
        
        for recipient in recipients:
            phone_number = recipient.get('phone_number')
            if not phone_number:
                continue
                
            # Personalize message if name is available
            personalized_message = message_template.replace(
                '{name}', recipient.get('name', 'there')
            )
            
            if self.send_message(phone_number, personalized_message):
                sent_count += 1
                
        logger.info(f"Sent WhatsApp messages to {sent_count}/{len(recipients)} recipients")
        return sent_count
    
    def send_new_review_notification(self, subscribers: List[dict], review: dict):
        """Send new review notification via WhatsApp"""
        # Filter subscribers who opted for WhatsApp notifications
        whatsapp_subscribers = [
            sub for sub in subscribers 
            if sub.get('whatsapp_notifications', False) and sub.get('phone_number')
        ]
        
        if not whatsapp_subscribers:
            logger.info("No WhatsApp subscribers found for review notification")
            return 0
            
        message_template = f"""🎬 *New Review Alert!*

*{review['title']}*
{review.get('title_hindi', '')}

⭐ Rating: {review['rating']}/5
✍️ By: {review['author']}

{review['excerpt'][:100]}...

🔗 Read full review: https://filmwallaa.com/reviews/{review['id']}

*The Voice of Cinema* | FILMWALLAA.COM

_Reply STOP to unsubscribe_"""
        
        return self.send_bulk_messages(whatsapp_subscribers, message_template)
    
    def send_weekly_digest_notification(self, subscribers: List[dict], review_count: int):
        """Send weekly digest notification via WhatsApp"""
        whatsapp_subscribers = [
            sub for sub in subscribers 
            if sub.get('whatsapp_notifications', False) and sub.get('phone_number')
        ]
        
        if not whatsapp_subscribers:
            return 0
            
        message_template = f"""📧 *Weekly Cinema Digest*

Hi {'{name}'}! 👋

Your weekly digest with {review_count} new movie reviews is ready!

🎭 Latest Bollywood & South Cinema reviews
🌟 Expert ratings and recommendations
📱 Multi-language content

📧 Check your email for the complete digest
🔗 Visit: https://filmwallaa.com

*The Voice of Cinema* | FILMWALLAA.COM"""
        
        return self.send_bulk_messages(whatsapp_subscribers, message_template)

# Global WhatsApp service instance
whatsapp_service = WhatsAppService()