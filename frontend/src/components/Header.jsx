import React, { useState } from 'react';
import { Search, Menu, Globe, User, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { supportedLanguages } from '../data/mockData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');

  const navigation = [
    { name: 'Home', nameHi: 'होम', href: '/' },
    { name: 'Reviews', nameHi: 'रिव्यूज', href: '/reviews' },
    { name: 'News', nameHi: 'न्यूज', href: '/news' },
    { name: 'Bollywood', nameHi: 'बॉलीवुड', href: '/bollywood' },
    { name: 'South Cinema', nameHi: 'साउथ सिनेमा', href: '/south' },
    { name: 'International', nameHi: 'इंटरनेशनल', href: '/international' }
  ];

  return (
    <header className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black/20 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>The Voice of Cinema | सिनेमा की आवाज़</span>
          <div className="flex items-center space-x-4">
            <span>आज: {new Date().toLocaleDateString('hi-IN')}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-orange-200">
                  <Globe className="h-4 w-4 mr-1" />
                  {supportedLanguages.find(lang => lang.code === currentLang)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {supportedLanguages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setCurrentLang(lang.code)}>
                    {lang.name} ({lang.nameEng})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Star className="h-8 w-8 text-yellow-300 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">The Voice of Cinema</h1>
              <p className="text-orange-200 text-sm">सिनेमा समीक्षा</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white hover:text-orange-200 transition-colors duration-200 font-medium"
              >
                {currentLang === 'hi' ? item.nameHi : item.name}
              </a>
            ))}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
              <Input
                type="text"
                placeholder="फिल्म खोजें..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10 w-64"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            </div>
            
            <Button variant="ghost" size="sm" className="text-white hover:text-orange-200">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="फिल्म खोजें..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/30 backdrop-blur-sm">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-white hover:text-orange-200 transition-colors duration-200 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLang === 'hi' ? item.nameHi : item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;