import React from 'react';
import Header from '../Header';
import AdSidebar from '../ads/AdSidebar';
import AdBanner from '../ads/AdBanner';

const MainLayout = ({ children, showSidebar = true, showStickyAd = true }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Sticky Top Ad */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <AdBanner
            type="banner"
            title="📱 Filmwalla.com Mobile App - Coming Soon!"
            description="Get movie reviews, ratings, and news on your phone"
            ctaText="Notify Me"
            link="#" // Replace with app store pre-order link
            affiliate={false}
            className="h-16"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className={`flex-1 ${showSidebar ? 'lg:w-2/3' : 'w-full'}`}>
            {children}
          </main>
          
          {/* Sidebar with Ads */}
          {showSidebar && (
            <aside className="hidden lg:block lg:w-1/3">
              <div className="sticky top-6">
                <AdSidebar />
              </div>
            </aside>
          )}
        </div>
      </div>
      
      {/* Sticky Bottom Ad for Mobile */}
      {showStickyAd && (
        <AdBanner
          type="sticky"
          title="Download Our App"
          description="Movie reviews on the go"
          ctaText="Download"
          link="#" // Replace with app store link
          affiliate={false}
          className="lg:hidden"
        />
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Filmwalla.com</h3>
              <p className="text-gray-300 text-sm">
                Your gateway to entertainment with expert movie reviews, ratings, and cinema news.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/reviews" className="hover:text-white">Latest Reviews</a></li>
                <li><a href="/news" className="hover:text-white">Cinema News</a></li>
                <li><a href="/bollywood" className="hover:text-white">Bollywood</a></li>
                <li><a href="/south" className="hover:text-white">South Cinema</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Action Movies</a></li>
                <li><a href="#" className="hover:text-white">Drama Films</a></li>
                <li><a href="#" className="hover:text-white">Comedy Reviews</a></li>
                <li><a href="#" className="hover:text-white">Thriller Movies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Advertise</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Filmwalla.com. All rights reserved. | Affiliate partnerships help support our reviews.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;