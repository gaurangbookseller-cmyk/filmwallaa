import React, { useState } from 'react';
import { X, Mail, MessageCircle, CheckCircle, Loader2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { api } from '../services/api';

const SubscriptionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    email_notifications: true,
    whatsapp_notifications: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.subscriptions.subscribe({
        ...formData,
        subscription_type: 'weekly_digest'
      });

      setSubmitStatus({
        type: 'success',
        message: 'Successfully subscribed! Welcome to The Voice of Cinema family! 🎬'
      });

      if (onSuccess) onSuccess();
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          email_notifications: true,
          whatsapp_notifications: false
        });
        setSubmitStatus(null);
      }, 2000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to subscribe. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
              <Star className="h-6 w-6 text-white fill-current" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Join The Voice of Cinema
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Get weekly cinema reviews delivered to your inbox
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="text-xs text-gray-500">For WhatsApp notifications (optional)</p>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Notification Preferences</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox
                  id="email_notifications"
                  checked={formData.email_notifications}
                  onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                  disabled={isSubmitting}
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <Label htmlFor="email_notifications" className="text-sm font-medium cursor-pointer">
                      Weekly Email Digest
                    </Label>
                    <p className="text-xs text-gray-600">Get curated movie reviews every week</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Checkbox
                  id="whatsapp_notifications"
                  checked={formData.whatsapp_notifications}
                  onCheckedChange={(checked) => handleInputChange('whatsapp_notifications', checked)}
                  disabled={isSubmitting || !formData.phone_number}
                />
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <Label htmlFor="whatsapp_notifications" className="text-sm font-medium cursor-pointer">
                      WhatsApp Notifications
                    </Label>
                    <p className="text-xs text-gray-600">Instant alerts for new reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2">What You'll Get:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🎬 Weekly digest of top movie reviews</li>
              <li>🌟 Bollywood, South Indian & International cinema coverage</li>
              <li>🎭 Expert reviews in Hindi and English</li>
              <li>📱 Mobile-friendly content</li>
              <li>🔥 Breaking entertainment news</li>
            </ul>
          </div>

          {/* Status Message */}
          {submitStatus && (
            <div className={`p-4 rounded-lg border ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">{submitStatus.message}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.email || !formData.name}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center pt-2">
            We respect your privacy. Unsubscribe anytime. 
            <br />Powered by FILMWALLAA.COM
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;