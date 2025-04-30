// src/pages/HomePage.js
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../components/styles/TestimonialSlider.css';
import Layout from '../components/layout/Layout';
import { FadeIn } from '../components/animations/FadeIn';
import { ChevronRightIcon, ChevronLeftIcon, ChevronRightIcon as SliderNextIcon } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    id: 1,
    content: "LifeLog transformed how I approach my daily routines. After just 3 months, I've built habits I've been trying to establish for years.",
    author: "Sarah Johnson",
    role: "Frontend Developer",
    avatar: "/assets/imgs/avatar1.jpg"
  },
  {
    id: 2,
    content: "As a backend developer, I appreciate the technical excellence of LifeLog. Clean code, reliable performance, and thoughtful UX make it my go-to productivity tool.",
    author: "Michael Chen",
    role: "Backend Engineer",
    avatar: "/assets/imgs/mendiola.jpg"
  },
  {
    id: 3,
    content: "The data visualization in LifeLog helps me understand my patterns better than any app I've used before. It's like having a personal coach in your pocket.",
    author: "Priya Sharma",
    role: "Full Stack Developer",
    avatar: "/assets/imgs/avatar-3.jpg"
  },
  {
    id: 4,
    content: "I've tried many habit tracking apps, but LifeLog strikes the perfect balance between powerful features and ease of use. The streak visualizations keep me motivated.",
    author: "James Wilson",
    role: "DevOps Engineer",
    avatar: "/assets/imgs/avatar-4.jpg"
  },
  {
    id: 5,
    content: "The API documentation is excellent, and I was able to build my own custom dashboard integration in just a weekend. Truly developer-friendly!",
    author: "Elena Rodriguez",
    role: "API Developer",
    avatar: "/assets/imgs/avatar-5.jpg"
  }
];

// Feature data
const features = [
  {
    icon: "🎯",
    title: "Set Goals",
    description: "Define clear goals for your habits and track your progress towards achieving them.",
    delay: 0.1
  },
  {
    icon: "📊",
    title: "Track Progress",
    description: "Visualize your habit streaks and see how consistent you've been over time.",
    delay: 0.3
  },
  {
    icon: "🔔",
    title: "Smart Reminders",
    description: "Get gentle nudges when it's time to complete your habits based on your personal schedule.",
    delay: 0.5
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Access your habits from anywhere with our mobile app, even when you're offline.",
    delay: 0.7
  },
  {
    icon: "🔄",
    title: "Sync Across Devices",
    description: "Seamlessly sync your data across all your devices in real-time.",
    delay: 0.9
  },
  {
    icon: "📈",
    title: "Insightful Analytics",
    description: "Gain deeper insights into your behavior patterns with advanced analytics.",
    delay: 1.1
  }
];

// Developer section data
const developers = {
  frontend: {
    title: "Modern Frontend",
    description: "Built with React, Tailwind CSS, and Framer Motion for a responsive, accessible, and visually stunning user experience that adapts to any device.",
    features: ["Component-based architecture", "Real-time updates", "Offline capability", "Optimized performance"],
    image: "/assets/imgs/avatar3.jpg"
  },
  backend: {
    title: "Powerful Backend",
    description: "Our robust API leverages Node.js, Express, and MongoDB to deliver lightning-fast responses, secure authentication, and reliable data storage.",
    features: ["RESTful API design", "JWT authentication", "Data encryption", "Comprehensive logging"],
    image: "/assets/imgs/avatar2.jpg"
  }
};

// Inspirational quotes
const quotes = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  }
];

// Custom arrow component for the slider
const SliderArrow = ({ direction }) => {
  const sliderRef = useRef(null);
  
  const handleClick = () => {
    if (direction === 'prev') {
      sliderRef.current.slickPrev();
    } else {
      sliderRef.current.slickNext();
    }
  };
  
  return (
    <button
      type="button"
      className={`absolute z-10 top-1/2 -mt-6 bg-white rounded-full p-2 shadow-md hover:shadow-lg focus:outline-none transition-all duration-300 ${
        direction === 'prev' ? 'left-0 -ml-3' : 'right-0 -mr-3'
      }`}
      onClick={handleClick}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    >
      {direction === 'prev' ? (
        <ChevronLeftIcon className="h-5 w-5 text-primary-600" />
      ) : (
        <SliderNextIcon className="h-5 w-5 text-primary-600" />
      )}
    </button>
  );
};

const HomePage = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const sliderRef = useRef(null);
  
  // Rotate through quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>

{/* Enhanced Hero Section */}
<div className="bg-gradient-to-br from-white via-gray-50 to-primary-50">
  <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
      {/* Left side content */}
      <div className="lg:col-span-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Track your habits with</span>
            <span className="block text-primary-600 mt-2 relative">
              LifeLog
              <motion.div 
                className="absolute -bottom-2 w-full h-1 bg-primary-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </h1>
          <p className="mt-6 text-base text-gray-500 sm:text-lg md:mt-8 md:text-xl">
            Build lasting habits, track your progress, and achieve your goals with our simple and effective habit tracking app. 
            <span className="hidden md:inline"> Your journey to a better you starts here.</span>
          </p>
          
          {/* Enhanced Get Started Section */}
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center px-10 py-5 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Get Started
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right side image/animation */}
      <div className="mt-12 lg:mt-0 lg:col-span-6">
        <motion.div
          className="relative mx-auto rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3
          }}
          whileHover={{ 
            y: -10,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <motion.img
            className="w-full"
            src="/assets/lifelog.png" 
            alt="LifeLog App Dashboard Preview"
            initial={{ filter: "brightness(0.8)" }}
            animate={{ filter: "brightness(1)" }}
            transition={{ delay: 0.6, duration: 1.2 }}
          />
          
          {/* Floating achievement notification */}
          <motion.div
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <motion.span 
                className="text-xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 1.8, duration: 0.8, times: [0, 0.5, 1] }}
              >🎯</motion.span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Achievement Unlocked!</p>
              <p className="text-xs text-gray-500">7-day streak completed</p>
            </div>
          </motion.div>
          
          {/* Floating streak counter */}
          <motion.div
            className="absolute bottom-4 left-4 bg-primary-600 text-white rounded-lg shadow-lg p-3 flex items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-primary-500 p-2 rounded-full mr-3">
              <motion.span 
                className="text-xl"
                animate={{ rotateY: [0, 360] }}
                transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
              >🔥</motion.span>
            </div>
            <div>
              <p className="text-sm font-bold">Current Streak</p>
              <motion.p 
                className="text-xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
              >12 Days</motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </div>
  
  {/* Inspirational Quote */}
  <div className="max-w-5xl mx-auto px-4 pb-16 sm:pb-24">
    <motion.div 
      className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <div className="relative">
        <div className="text-6xl absolute -top-6 -left-4 text-primary-300 opacity-50">❝</div>
        <div className="text-center px-6">
          <blockquote className="text-xl italic text-gray-700 md:text-2xl">
            {quotes[currentQuote].text}
          </blockquote>
          <cite className="mt-4 block text-primary-600 font-medium">
            — {quotes[currentQuote].author}
          </cite>
        </div>
        <div className="text-6xl absolute -bottom-6 -right-4 text-primary-300 opacity-50">❞</div>
      </div>
    </motion.div>
  </div>
</div>
      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Features designed for your success
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Everything you need to build lasting habits and transform your life.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <div className="text-5xl text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Developer Sections */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Built by developers, for everyone
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Our team of passionate developers crafted LifeLog with both technical excellence and user experience in mind.
              </p>
            </div>
          </FadeIn>
          
          {/* Frontend Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mt-10 lg:mt-0">
                <img 
                  className="mx-auto rounded-lg shadow-lg object-cover lg:mx-0" 
                  src={developers.frontend.image}
                  alt="Frontend development visualization" 
                />
              </div>
              <div className="mt-10 lg:mt-0 lg:pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {developers.frontend.title}
                </h3>
                <p className="text-lg text-gray-500 mb-6">
                  {developers.frontend.description}
                </p>
                <ul className="space-y-3">
                  {developers.frontend.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRightIcon className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Backend Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="lg:order-2">
                <img 
                  className="mx-auto rounded-lg shadow-lg object-cover lg:mx-0" 
                  src={developers.backend.image}
                  alt="Backend architecture visualization" 
                />
              </div>
              <div className="mt-10 lg:mt-0 lg:pr-8 lg:order-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {developers.backend.title}
                </h3>
                <p className="text-lg text-gray-500 mb-6">
                  {developers.backend.description}
                </p>
                <ul className="space-y-3">
                  {developers.backend.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRightIcon className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Loved by developers and users alike
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Hear from our community of users who have transformed their lives with LifeLog.
              </p>
            </div>
          </FadeIn>
          
          <div className="relative testimonial-slider-container">
            <SliderArrow direction="prev" />
            <SliderArrow direction="next" />
            
            <Slider
              ref={sliderRef}
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
              pauseOnHover={true}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]}
              className="testimonial-slider"
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="px-3">
                  <motion.div 
                    className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center mb-6">
                      <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src={testimonial.avatar}
                        alt={testimonial.author} 
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{testimonial.author}</h4>
                        <p className="text-primary-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">{testimonial.content}</p>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <FadeIn>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to transform your habits?</span>
              <span className="block text-primary-200">Start your journey today.</span>
            </h2>
            {/* Enhanced Get Started - Final CTA */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Get started
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;