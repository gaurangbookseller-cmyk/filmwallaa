import React from 'react';
import { Star, Users, Award, Target, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import MainLayout from '../components/layout/MainLayout';
import InlineAd from '../components/ads/InlineAd';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Gaurang Bookseller',
      role: 'Founder & Chief Editor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face=center',
      bio: 'Passionate cinema enthusiast with over 10 years of experience in film criticism and entertainment journalism.'
    },
    {
      name: 'Priya Sharma',
      role: 'Senior Film Critic',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b618?w=300&h=300&fit=crop&face=center',
      bio: 'Bollywood specialist with expertise in analyzing performances, direction, and storytelling techniques.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'South Cinema Expert',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face=center',
      bio: 'Expert in Tamil, Telugu, Malayalam, and Kannada cinema with deep knowledge of regional film industries.'
    }
  ];

  const achievements = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: '1000+ Reviews',
      description: 'Comprehensive movie reviews across all Indian cinema'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: '50K+ Readers',
      description: 'Monthly active users trusting our recommendations'
    },
    {
      icon: <Award className="h-8 w-8 text-purple-500" />,
      title: 'Industry Recognition',
      description: 'Cited by major entertainment publications'
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: '95% Accuracy',
      description: 'Reliable predictions and honest movie assessments'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-12 rounded-lg border border-orange-200 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            About Filmwalla.com
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Your trusted companion in the world of cinema. We bring you honest, insightful, and comprehensive 
            movie reviews covering Bollywood, South Indian cinema, and international films.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-orange-500 fill-current" />
              <span>Expert Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span>Industry Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              To provide honest, unbiased, and comprehensive movie reviews that help audiences make informed 
              entertainment choices. We believe in celebrating the art of cinema while maintaining critical integrity.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the most trusted platform for movie reviews and entertainment content, bridging the gap 
              between audiences and quality cinema across all Indian languages and international films.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inline Ad */}
      <InlineAd type="product" position="mid-about" />

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-orange-100"
                  />
                  <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2">
                    <div className="bg-orange-500 text-white p-2 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Cover */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What We Cover</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bollywood</h3>
            <p className="text-gray-600">Latest Hindi films, star performances, and industry trends</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">South Cinema</h3>
            <p className="text-gray-600">Tamil, Telugu, Malayalam, and Kannada film reviews</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">International</h3>
            <p className="text-gray-600">Hollywood blockbusters and world cinema gems</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Mail className="h-8 w-8 mx-auto mb-4 text-orange-400" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">contact@filmwallaa.com</p>
            </div>
            <div>
              <Phone className="h-8 w-8 mx-auto mb-4 text-orange-400" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+91 98765 43210</p>
            </div>
            <div>
              <MapPin className="h-8 w-8 mx-auto mb-4 text-orange-400" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">Mumbai, Maharashtra</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3">
              Contact Us Today
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;