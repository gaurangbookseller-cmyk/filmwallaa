# FILMWALLAA.COM Domain Setup Guide for Email Integration

## Overview
Your domain FILMWALLAA.COM needs to be configured for professional email sending via SendGrid. This involves DNS configuration on Namecheap and SendGrid domain verification.

## Step 1: SendGrid Account Setup

### 1.1 Create SendGrid Account
1. Go to https://sendgrid.com
2. Sign up for a free account (100 emails/day forever)
3. Verify your email address
4. Complete account setup

### 1.2 Generate API Key
1. Login to SendGrid Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Full Access** (for production)
5. Name it "FILMWALLAA_PRODUCTION_KEY"
6. **SAVE THIS KEY** - you'll need it for the backend

## Step 2: Domain Authentication (IMPORTANT)

### 2.1 Add Domain to SendGrid
1. In SendGrid Dashboard, go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select **Namecheap** as your DNS provider
4. Enter your domain: `filmwallaa.com`
5. Check "Yes" for branded links
6. Click **Next**

### 2.2 DNS Records to Add in Namecheap
SendGrid will provide you with DNS records to add. They'll look like:

**CNAME Records:**
```
Host: s1._domainkey
Value: s1.domainkey.u1234567.wl.sendgrid.net

Host: s2._domainkey  
Value: s2.domainkey.u1234567.wl.sendgrid.net

Host: em1234
Value: u1234567.wl.sendgrid.net
```

**Steps in Namecheap:**
1. Login to Namecheap account
2. Go to **Domain List** → Click **Manage** next to filmwallaa.com
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Add each CNAME record provided by SendGrid:
   - Type: CNAME Record
   - Host: (provided by SendGrid)
   - Value: (provided by SendGrid)
   - TTL: Automatic

### 2.3 Verify Domain
1. After adding DNS records, wait 5-10 minutes
2. Go back to SendGrid and click **Verify**
3. If successful, you'll see green checkmarks
4. If failed, double-check DNS records and wait longer

## Step 3: Create Sender Identity

### 3.1 Verified Sender
1. In SendGrid, go to **Settings** → **Sender Authentication**
2. Click **Create a Sender Identity**
3. Fill in details:
   - **From Name:** The Voice of Cinema
   - **From Email:** noreply@filmwallaa.com
   - **Reply To:** support@filmwallaa.com
   - **Company:** FILMWALLAA
   - **Address:** Your business address

## Step 4: Backend Configuration

### 4.1 Environment Variables
Add these to `/app/backend/.env`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDER_EMAIL=noreply@filmwallaa.com
SENDER_NAME=The Voice of Cinema

# Twilio WhatsApp (get these from Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 4.2 Install Dependencies
```bash
cd /app/backend
pip install sendgrid twilio jinja2
pip freeze > requirements.txt
```

## Step 5: Twilio WhatsApp Setup

### 5.1 Create Twilio Account
1. Go to https://twilio.com
2. Sign up for free account ($15 trial credit)
3. Verify your phone number

### 5.2 WhatsApp Sandbox Setup
1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow sandbox setup instructions
3. Get your WhatsApp number: `whatsapp:+14155238886`
4. Get Account SID and Auth Token from Dashboard

### 5.3 Production WhatsApp (Later)
For production WhatsApp (after testing):
1. Apply for WhatsApp Business API approval
2. Get your own WhatsApp Business number
3. Update configuration

## Step 6: Testing the Setup

### 6.1 Test Email Sending
```bash
# Test the subscription endpoint
curl -X POST "http://localhost:8001/api/subscriptions/quick-subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "your_email@gmail.com", "name": "Test User"}'
```

### 6.2 Test Weekly Digest
```bash
# Trigger manual weekly digest
curl -X POST "http://localhost:8001/api/subscriptions/send-weekly-digest"
```

## Step 7: Professional Email Setup (Optional)

For `support@filmwallaa.com` email:

### 7.1 Email Hosting Options
1. **Google Workspace** ($6/month) - Professional
2. **Namecheap Email** ($1.88/month) - Budget-friendly
3. **Zoho Mail** (Free tier available)

### 7.2 MX Records (if using email hosting)
Add MX records in Namecheap DNS:
```
Type: MX Record
Host: @
Value: (provided by email provider)
Priority: 10
```

## Summary Checklist

- [ ] SendGrid account created
- [ ] API key generated and saved
- [ ] Domain authenticated in SendGrid
- [ ] DNS CNAME records added in Namecheap
- [ ] Sender identity verified
- [ ] Backend environment variables configured
- [ ] Twilio account created (for WhatsApp)
- [ ] WhatsApp sandbox configured
- [ ] Email subscription tested
- [ ] Weekly digest tested

## Expected Timeline
- DNS propagation: 5-60 minutes
- Domain verification: Immediate after DNS
- Email setup: 30 minutes
- WhatsApp setup: 15 minutes

## Support
If you encounter issues:
1. Check DNS propagation: https://dnschecker.org
2. Verify SendGrid domain status
3. Test API keys with simple curl commands
4. Check logs for detailed error messages

## Next Steps After Setup
1. Update frontend with subscription forms
2. Set up automated weekly digest scheduling
3. Create email templates
4. Monitor email deliverability
5. Apply for production WhatsApp API