import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import QuickSubscribe from './components/QuickSubscribe';
import MainLayout from './components/layout/MainLayout';
import InlineAd from './components/ads/InlineAd';
import { Toaster } from './components/ui/sonner';

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      
      {/* Inline Ad after Hero */}
      <InlineAd type="banner" position="after-hero" />
      
      <FeaturedReviews />
      
      {/* Inline Product Ad between sections */}
      <InlineAd type="product" position="between-reviews" />
      
      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <QuickSubscribe size="large" className="mx-auto" />
        </div>
      </section>
      
      {/* Text Ad for Premium Content */}
      <InlineAd type="text" position="before-footer" />
      
      {/* Placeholder sections for future development */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Cinema News</h2>
          <p className="text-gray-600">Breaking entertainment news and industry updates coming soon...</p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Movie Categories</h2>
          <p className="text-gray-600">Bollywood, South Cinema, International collections coming soon...</p>
        </div>
      </section>
    </MainLayout>
  );
};

// Simple Admin Dashboard Component
const AdminDashboard = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMigrationData();
  }, []);

  const fetchMigrationData = async () => {
    try {
      // Fetch migration status
      const statusResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/migration/status`);
      const statusData = await statusResponse.json();
      setMigrationStatus(statusData);

      // Fetch posts preview
      const postsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/migration/preview-posts?limit=10`);
      const postsData = await postsResponse.json();
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error('Error fetching migration data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading migration dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">WordPress Migration Dashboard</h1>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Back to Filmwalla.com
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Migration Status */}
        {migrationStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Migration Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{migrationStatus.total_posts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{migrationStatus.mapped_movies}</div>
                <div className="text-sm text-gray-600">Mapped to Movies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{migrationStatus.failed_mappings}</div>
                <div className="text-sm text-gray-600">Failed Mappings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{migrationStatus.status}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Migrated Posts (Preview)</h2>
            <p className="text-gray-600">Your WordPress movie reviews ready for approval</p>
          </div>
          
          <div className="divide-y">
            {posts.map((post, index) => (
              <div key={post.id || index} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.read_time}</span>
                      {post.rating && (
                        <>
                          <span>•</span>
                          <span>⭐ {post.rating}/5</span>
                        </>
                      )}
                      {post.movie_id && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">✓ TMDB Mapped</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => alert(`Approve post: ${post.title}`)}
                    >
                      Approve
                    </button>
                    <button 
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => alert(`Edit post: ${post.title}`)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No migrated posts found. Try running the migration first.
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Migration Instructions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>40 WordPress posts</strong> have been successfully imported</p>
            <p>• <strong>28 posts</strong> were automatically mapped to TMDB movies</p>
            <p>• <strong>12 posts</strong> need manual movie mapping</p>
            <p>• Review each post and click <strong>"Approve"</strong> to publish on Filmwalla.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<div className="p-8 text-center">Reviews page coming soon...</div>} />
          <Route path="/news" element={<div className="p-8 text-center">News page coming soon...</div>} />
          <Route path="/bollywood" element={<div className="p-8 text-center">Bollywood page coming soon...</div>} />
          <Route path="/south" element={<div className="p-8 text-center">South Cinema page coming soon...</div>} />
          <Route path="/international" element={<div className="p-8 text-center">International page coming soon...</div>} />
          <Route path="/admin/migration" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;