import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Sparkles, Cloud, Star, Sun, BookOpen, MessageCircle, User, Smile, ArrowRight, TrendingUp, Quote } from 'lucide-react';

const Homepage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Calculate gradient based on scroll position - Calming green to blue transition
  const getGradientColor = () => {
    const maxScroll = 2000;
    const scrollPercent = Math.min(scrollY / maxScroll, 1);
    
    // Smooth transition from calming green shades to serene blue shades
    // Light mint green -> Soft teal -> Gentle sky blue
    if (scrollPercent < 0.33) {
      const progress = scrollPercent / 0.33;
      return {
        from: `rgba(${167 + (125 - 167) * progress}, ${243 + (241 - 243) * progress}, ${208 + (232 - 208) * progress}, 1)`, // #A7F3D0 -> #7DF1E8
        via: `rgba(${209 + (165 - 209) * progress}, ${250 + (243 - 250) * progress}, ${229 + (235 - 229) * progress}, 1)`, // #D1FAE5 -> #A5F3EB
        to: `rgba(${167 + (110 - 167) * progress}, ${243 + (231 - 243) * progress}, ${208 + (248 - 208) * progress}, 1)` // #A7F3D0 -> #6EE7F8
      };
    } else if (scrollPercent < 0.66) {
      const progress = (scrollPercent - 0.33) / 0.33;
      return {
        from: `rgba(${125 + (103 - 125) * progress}, ${241 + (232 - 241) * progress}, ${232 + (246 - 232) * progress}, 1)`, // #7DF1E8 -> #67E8F6
        via: `rgba(${165 + (165 - 165) * progress}, ${243 + (242 - 243) * progress}, ${235 + (245 - 235) * progress}, 1)`, // #A5F3EB -> #A5F2F5
        to: `rgba(${110 + (125 - 110) * progress}, ${231 + (211 - 231) * progress}, ${248 + (254 - 248) * progress}, 1)` // #6EE7F8 -> #7DD3FE
      };
    } else {
      const progress = (scrollPercent - 0.66) / 0.34;
      return {
        from: `rgba(${103 + (147 - 103) * progress}, ${232 + (197 - 232) * progress}, ${246 + (237 - 246) * progress}, 1)`, // #67E8F6 -> #93C5ED
        via: `rgba(${165 + (186 - 165) * progress}, ${242 + (230 - 242) * progress}, ${245 + (253 - 245) * progress}, 1)`, // #A5F2F5 -> #BAE6FD
        to: `rgba(${125 + (147 - 125) * progress}, ${211 + (197 - 211) * progress}, ${254 + (237 - 254) * progress}, 1)` // #7DD3FE -> #93C5ED
      };
    }
  };

  const gradientColors = getGradientColor();
  
  const inspirationalQuotes = [
    "Healing is not linear, and that's perfectly okay.",
    "Your mental health is a priority, not a luxury.",
    "Every step forward, no matter how small, is progress.",
    "You are stronger than you think, braver than you believe.",
    "It's okay to not be okay. Reach out, you're not alone."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div 
      className="relative min-h-screen overflow-hidden transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.via} 50%, ${gradientColors.to} 100%)`
      }}
    >
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-[28rem] h-[28rem] bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-float animation-delay-200"></div>
        <div className="absolute bottom-32 left-1/3 w-[32rem] h-[32rem] bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-float animation-delay-400"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-breathe"></div>
      </div>

      {/* Floating Decorative Icons - Larger and More Visible */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <Brain className="absolute top-32 left-20 w-16 h-16 text-gray-600 animate-gentle-pulse" />
        <Heart className="absolute top-1/4 right-32 w-18 h-18 text-gray-600 animate-breathe" />
        <Sparkles className="absolute bottom-1/3 left-1/4 w-14 h-14 text-gray-600 animate-float" />
        <Cloud className="absolute top-1/3 right-1/4 w-20 h-20 text-gray-500 animate-float animation-delay-300" />
        <Star className="absolute bottom-1/4 right-1/3 w-14 h-14 text-gray-600 animate-gentle-pulse animation-delay-200" />
        <Sun className="absolute top-1/2 left-1/3 w-16 h-16 text-gray-600 animate-breathe animation-delay-400" />
        <Cloud className="absolute top-20 right-1/3 w-18 h-18 text-gray-500 animate-float animation-delay-100" />
        <Cloud className="absolute bottom-1/2 left-1/4 w-22 h-22 text-gray-500 animate-breathe animation-delay-500" />
        <Cloud className="absolute top-2/3 right-1/2 w-20 h-20 text-gray-500 animate-float animation-delay-600" />
        <Heart className="absolute bottom-40 left-1/2 w-14 h-14 text-gray-600 animate-gentle-pulse animation-delay-300" />
      </div>

      {/* Header */}
      <header className="relative z-20 w-full px-8 py-5 flex justify-between items-center">
        <div className="flex items-center animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inner Compass
          </h1>
        </div>
        <nav className="flex items-center space-x-3 animate-fade-in-down animation-delay-200">
          <a href="#home" className="px-4 py-2.5 text-base font-bold text-gray-800 hover:text-gray-900 transition-colors">
            Home
          </a>
          <a href="#about" className="px-4 py-2.5 text-base font-bold text-gray-800 hover:text-gray-900 transition-colors">
            About
          </a>
          <a href="#features" className="px-4 py-2.5 text-base font-bold text-gray-800 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#contact" className="px-4 py-2.5 text-base font-bold text-gray-800 hover:text-gray-900 transition-colors">
            Contact
          </a>
          <a href="#blogs" className="px-4 py-2.5 text-base font-bold text-gray-800 hover:text-gray-900 transition-colors">
            Blogs
          </a>
          <Link 
            to="/get-started" 
            className="ml-3 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold text-base transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 container mx-auto px-12 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-xl animate-fade-in-left">
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 animate-fade-in-up animation-delay-100">
              Start Your Journey to a Healthier Mind
            </h2>
            
            <p className="text-lg text-gray-700 mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
              Begin your journey to emotional healing with Inner Compass—where compassionate guidance, personalised support, and a safe, nurturing space help you rediscover balance, build resilience, and move confidently toward a happier, healthier, and more empowered you.
            </p>

            <div className="flex items-center space-x-4 animate-fade-in-up animation-delay-300">
              <Link 
                to="/get-started"
                className="px-9 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>


          </div>

          {/* Right Image with Connected Border */}
          <div className="flex-1 flex justify-end items-center animate-fade-in-right relative">
            <div className="relative">
              {/* Image with Connected Border Frame */}
              <div className="relative bg-white rounded-[45px] p-5 shadow-2xl">
                <div className="relative overflow-hidden rounded-[40px]">
                  <img 
                    src="/sad.png" 
                    alt="Mental wellness journey" 
                    className="w-full max-w-sm lg:max-w-md object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="relative z-10 container mx-auto px-12 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/70 backdrop-blur-md p-12 rounded-3xl border border-white/60 shadow-xl">
            <Quote className="w-16 h-16 text-gray-400 mx-auto mb-6 animate-gentle-pulse" />
            <blockquote className="text-2xl lg:text-3xl font-semibold text-gray-800 leading-relaxed transition-all duration-500">
              {inspirationalQuotes[currentQuote]}
            </blockquote>
            <div className="flex justify-center space-x-2 mt-8">
              {inspirationalQuotes.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote ? 'w-8 bg-gray-900' : 'w-2 bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 container mx-auto px-12 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            About Inner Compass
          </h3>
        </div>

        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md p-14 rounded-3xl border border-white/60 shadow-xl">
          <div className="relative mb-10">
            <Quote className="absolute -top-4 -left-4 w-20 h-20 text-emerald-400 opacity-30" />
            <Quote className="absolute -bottom-4 -right-4 w-20 h-20 text-cyan-400 opacity-30 rotate-180" />
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium italic text-center px-8">
                <span className="text-7xl font-bold text-emerald-600 float-left mr-4 mt-2 leading-none">A</span>
                t Inner Compass, we are dedicated to making mental health support accessible, personalized, and effective. We believe that everyone deserves a safe space to explore their emotions, track their progress, and find the support they need.
              </p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-700 leading-relaxed mt-12">
            <p className="text-lg">
              Our platform combines cutting-edge AI technology with compassionate care to provide you with 24/7 support, personalized insights, and tools to help you on your wellness journey. We understand that mental health is just as important as physical health, and we're here to support you every step of the way.
            </p>
            <p className="text-lg">
              Whether you're dealing with stress, anxiety, depression, or simply looking to improve your emotional well-being, Inner Compass offers a safe, judgment-free environment where you can grow, heal, and thrive.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="text-center p-7 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-md">
                <div className="text-4xl font-bold text-emerald-700 mb-2">24/7</div>
                <div className="text-sm font-bold text-gray-800">Available Support</div>
              </div>
              <div className="text-center p-7 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-md">
                <div className="text-4xl font-bold text-cyan-700 mb-2">100%</div>
                <div className="text-sm font-bold text-gray-800">Confidential</div>
              </div>
              <div className="text-center p-7 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-md">
                <div className="text-4xl font-bold text-blue-700 mb-2">AI-Powered</div>
                <div className="text-sm font-bold text-gray-800">Personalized Insights</div>
              </div>
            </div>
            <div className="text-center mt-10">
              <Link 
                to="/get-started"
                className="inline-block px-9 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-12 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h3 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Our Features
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Comprehensive tools and support to guide you through your mental wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Mental Health Tracking</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Track your emotional patterns, mood changes, and mental wellness journey with AI-powered insights and analytics.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mb-6">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">AI Advisory Chatbot</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Get instant support from our intelligent chatbot. Available 24/7 to listen, guide, and provide coping strategies.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Personal Diary</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Express your thoughts freely in your private digital journal. Reflect, process emotions, and track your growth.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
              <Smile className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Mood Freshener</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Access curated content, mindfulness exercises, breathing techniques, and activities to boost your mood instantly.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Progress Analytics</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Visualize your wellness journey with detailed charts, trends, and personalized recommendations for improvement.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-6">
              <User className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Professional Support</h4>
            <p className="text-gray-700 leading-relaxed text-sm">Connect with licensed mental health professionals. Get expert advice and receive personalized care when you need it.</p>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="relative z-10 container mx-auto px-12 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h3 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Latest Insights
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Explore articles, tips, and resources for your mental wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
              <Heart className="w-16 h-16 text-emerald-600" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Understanding Anxiety</h4>
              <p className="text-gray-700 text-sm mb-4">Learn about anxiety disorders, their symptoms, and effective coping strategies to manage daily challenges.</p>
              <a href="#" className="text-teal-600 font-bold text-sm hover:text-teal-700 transition-colors">Read More →</a>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-cyan-600" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Mindfulness Practices</h4>
              <p className="text-gray-700 text-sm mb-4">Discover simple mindfulness exercises that can help reduce stress and improve your overall well-being.</p>
              <a href="#" className="text-cyan-600 font-bold text-sm hover:text-cyan-700 transition-colors">Read More →</a>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
              <Sun className="w-16 h-16 text-blue-600" />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">Building Resilience</h4>
              <p className="text-gray-700 text-sm mb-4">Develop emotional resilience and learn how to bounce back from life's challenges with strength.</p>
              <a href="#" className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <footer 
        id="contact"
        className="relative z-10 border-t border-white/60 mt-20 transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.via} 50%, ${gradientColors.to} 100%)`
        }}
      >
        <div className="bg-white/40 backdrop-blur-md">
          <div className="container mx-auto px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Inner Compass</h3>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed font-medium">
                  Your trusted companion for mental wellness and emotional healing.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-base">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li><a href="#home" className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Home</a></li>
                  <li><a href="#about" className="hover:text-gray-900 cursor-pointer transition-colors font-bold">About</a></li>
                  <li><a href="#features" className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Features</a></li>
                  <li><a href="#blogs" className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Blogs</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-base">Account</h4>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li><Link to="/get-started" className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Get Started</Link></li>
                  <li className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Privacy Policy</li>
                  <li className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Terms of Service</li>
                  <li className="hover:text-gray-900 cursor-pointer transition-colors font-bold">Help Center</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-base">Contact Us</h4>
                <p className="text-sm text-gray-800 mb-4 font-medium">
                  Email: singhal.himanshu.dev@gmail.com
                </p>
                <p className="text-sm text-gray-800 mb-4 font-medium">
                  Phone: +91 7906136665
                </p>
                <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-400/30 pt-6 text-center">
              <p className="text-gray-800 text-sm font-bold">
                &copy; 2025 Inner Compass. All rights reserved. Your mental health matters.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;