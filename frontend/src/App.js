import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedReviews from './components/FeaturedReviews';
import QuickSubscribe from './components/QuickSubscribe';
import { Toaster } from './components/ui/sonner';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedReviews />
      
      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <QuickSubscribe size="large" className="mx-auto" />
        </div>
      </section>
      
      {/* Placeholder sections for future development */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Cinema News</h2>
          <h3 className="text-xl text-gray-700 mb-4">फिल्म समाचार</h3>
          <p className="text-gray-600">Breaking entertainment news and industry updates coming soon...</p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Movie Categories</h2>
          <h3 className="text-xl text-gray-700 mb-4">श्रेणियां</h3>
          <p className="text-gray-600">Bollywood, South Cinema, International collections coming soon...</p>
        </div>
      </section>
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
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;