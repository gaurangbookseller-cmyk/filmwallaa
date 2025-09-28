import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { api } from '../services/api';

const QuickSubscribe = ({ className = '', size = 'default' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.subscriptions.quickSubscribe({ email, name });
      
      setSubmitStatus({
        type: 'success',
        message: response.already_subscribed 
          ? "You're already subscribed! 🎬"
          : 'Successfully subscribed to weekly digest! 🎉'
      });
      
      if (!response.already_subscribed) {
        setEmail('');
        setName('');
      }
      
      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to subscribe. Please try again.'
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizeClasses = {
    small: {
      container: 'p-4',
      title: 'text-lg font-semibold',
      input: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    default: {
      container: 'p-6',
      title: 'text-xl font-bold',
      input: 'text-base',
      button: 'px-6 py-3'
    },
    large: {
      container: 'p-8',
      title: 'text-2xl font-bold',
      input: 'text-lg',
      button: 'px-8 py-4 text-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 ${classes.container} ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className={`${classes.title} bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
            Weekly Cinema Digest
          </h3>
          <p className="text-gray-600 text-sm">
            Get expert movie reviews delivered weekly
          </p>
        </div>
      </div>

      {submitStatus ? (
        <div className={`p-4 rounded-lg border text-center ${
          submitStatus.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            {submitStatus.type === 'success' && <CheckCircle className="h-5 w-5" />}
            <span className="font-medium">{submitStatus.message}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className={`flex-1 ${classes.input}`}
            />
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className={`flex-1 ${classes.input}`}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !email}
            className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 ${classes.button}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe to Weekly Digest'
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Join thousands of cinema lovers • Unsubscribe anytime
          </p>
        </form>
      )}
    </div>
  );
};

export default QuickSubscribe;