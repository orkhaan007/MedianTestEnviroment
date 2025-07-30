"use client";

import Layout from "../components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGamepad, FaTrophy, FaUsers, FaHeadset, FaDiscord, FaTiktok, FaYoutube, FaAngleRight, FaFire, FaRocket, FaChevronDown } from "react-icons/fa";
import { SiEpicgames, SiSteam, SiTwitch } from "react-icons/si";
import Image from "next/image";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('tournaments');
  const [animateCount, setAnimateCount] = useState(false);

  useEffect(() => {
    // Initial load animation
    setIsLoaded(true);
    
    // Trigger count animation when page loads
    const timer = setTimeout(() => {
      setAnimateCount(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section with Futuristic Gaming Theme */}
      <div className="relative h-screen max-h-[900px] bg-gradient-to-b from-[#050A18] via-[#0B1933] to-[#050A18] overflow-hidden">
        {/* Animated background with particles */}
        <div className="absolute inset-0 bg-[url('/Logos/MedianLogo.png')] bg-center bg-no-repeat opacity-5"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0B1933]/80 to-[#050A18] opacity-90"></div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
        
        {/* Glowing accent elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] opacity-80"></div>
        <div className="absolute top-1 left-0 w-full h-[1px] bg-white/10"></div>
        
        {/* Hero content with advanced animation */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-12">
              {/* Left content */}
              <div className={`md:w-1/2 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-[#FF4D4D] to-[#7928CA] rounded-full blur-3xl opacity-20"></div>
                  <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-[#7928CA] to-[#00C6FF] rounded-full blur-3xl opacity-20"></div>
                  
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-2 text-white tracking-tighter">
                    <span className="relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] blur-lg opacity-30"></span>
                      <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF]">MEDIAN</span>
                    </span>
                  </h1>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    GAMING <span className="text-[#7928CA]">COMMUNITY</span>
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                    Experience gaming like never before. Join our elite community of passionate gamers, compete in tournaments, and connect with players worldwide.                    
                  </p>
                  
                  <div className="flex flex-wrap gap-6">
                    <Link href="/about" className="group relative px-8 py-4 bg-gradient-to-r from-[#FF4D4D] to-[#7928CA] text-white font-bold rounded-lg overflow-hidden shadow-lg shadow-[#7928CA]/20">
                      <span className="absolute inset-0 bg-gradient-to-r from-[#7928CA] to-[#00C6FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center gap-2">
                        Join Us <FaRocket className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    
                    <Link href="/media/gallery" className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-bold rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors shadow-lg shadow-black/5">
                      <span className="relative z-10 flex items-center gap-2">
                        View Gallery <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Right content - 3D visual element */}
              <div className={`md:w-1/2 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative h-[400px] w-full">
                  {/* Decorative elements */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#7928CA] to-[#00C6FF] rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full animate-spin-slow"></div>
                  
                  {/* Central logo or image placeholder */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-[#FF4D4D]/20 via-[#7928CA]/20 to-[#00C6FF]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <div className="w-40 h-40 relative">
                      <div className="absolute inset-0 bg-[url('/Logos/MedianLogo.png')] bg-center bg-contain bg-no-repeat"></div>
                    </div>
                  </div>
                  
                  {/* Floating platform icons with animation */}
                  <div className="absolute top-10 right-10 animate-float-slow">
                    <SiSteam className="text-white text-3xl hover:text-[#7928CA] transition-colors cursor-pointer" />
                  </div>
                  <div className="absolute bottom-20 right-20 animate-float-medium">
                    <SiEpicgames className="text-white text-3xl hover:text-[#7928CA] transition-colors cursor-pointer" />
                  </div>
                  <div className="absolute bottom-40 left-20 animate-float-fast">
                    <SiTwitch className="text-white text-3xl hover:text-[#7928CA] transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
          <FaChevronDown className="text-white/50 animate-bounce" />
        </div>
      </div>

      {/* Featured Content Section with Interactive Cards */}
      <div className="bg-gradient-to-b from-[#050A18] to-[#0B1933] py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="relative mb-8 md:mb-0">
              <h2 className="text-4xl font-bold text-white">
                Featured <span className="relative">
                  <span className="absolute -inset-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] blur-lg opacity-30"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF]">Content</span>
                </span>
              </h2>
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#FF4D4D] to-[#7928CA]"></div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('tournaments')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'tournaments' ? 'bg-gradient-to-r from-[#FF4D4D]/20 to-[#7928CA]/20 text-white border border-[#7928CA]/30' : 'text-gray-400 hover:text-white'}`}
              >
                Tournaments
              </button>
              <button 
                onClick={() => setActiveTab('leaderboards')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'leaderboards' ? 'bg-gradient-to-r from-[#FF4D4D]/20 to-[#7928CA]/20 text-white border border-[#7928CA]/30' : 'text-gray-400 hover:text-white'}`}
              >
                Leaderboards
              </button>
              <button 
                onClick={() => setActiveTab('events')} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'events' ? 'bg-gradient-to-r from-[#FF4D4D]/20 to-[#7928CA]/20 text-white border border-[#7928CA]/30' : 'text-gray-400 hover:text-white'}`}
              >
                Events
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Item 1 - Glassmorphism Card */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(121,40,202,0.3)] duration-300 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 via-[#7928CA]/10 to-[#00C6FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#050A18] to-[#0B1933]"></div>
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
                
                {/* Animated icon with glow effect */}
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute -inset-8 bg-[#7928CA] rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <FaGamepad className="text-[#FF4D4D] text-6xl relative z-10" />
                </div>
              </div>
              
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[#7928CA]/10 to-transparent rounded-bl-full"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#FF4D4D] to-[#7928CA] mr-3"></div>
                  <h3 className="text-2xl font-bold text-white">Latest Tournaments</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">Experience competitive gaming at its finest. Join our tournaments and compete for glory and exclusive rewards.</p>
                
                <Link href="#" className="inline-flex items-center text-[#7928CA] font-semibold hover:text-[#FF4D4D] transition-colors">
                  View Tournaments <FaAngleRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Featured Item 2 - Glassmorphism Card */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(121,40,202,0.3)] duration-300 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 via-[#7928CA]/10 to-[#00C6FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#050A18] to-[#0B1933]"></div>
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
                
                {/* Animated icon with glow effect */}
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute -inset-8 bg-[#7928CA] rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <FaTrophy className="text-[#7928CA] text-6xl relative z-10" />
                </div>
              </div>
              
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[#7928CA]/10 to-transparent rounded-bl-full"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#7928CA] to-[#00C6FF] mr-3"></div>
                  <h3 className="text-2xl font-bold text-white">Leaderboards</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">Track your progress and compete with the best. Our real-time leaderboards showcase the elite players across all games.</p>
                
                <Link href="#" className="inline-flex items-center text-[#7928CA] font-semibold hover:text-[#00C6FF] transition-colors">
                  View Leaderboards <FaAngleRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Featured Item 3 - Glassmorphism Card */}
            <div className="group relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(121,40,202,0.3)] duration-300 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 via-[#7928CA]/10 to-[#00C6FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="h-56 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#050A18] to-[#0B1933]"></div>
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10"></div>
                
                {/* Animated icon with glow effect */}
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute -inset-8 bg-[#00C6FF] rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <FaUsers className="text-[#00C6FF] text-6xl relative z-10" />
                </div>
              </div>
              
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[#00C6FF]/10 to-transparent rounded-bl-full"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#00C6FF] to-[#7928CA] mr-3"></div>
                  <h3 className="text-2xl font-bold text-white">Community Events</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">Connect with fellow gamers at our regular events. From watch parties to casual gaming sessions, there's always something happening.</p>
                
                <Link href="#" className="inline-flex items-center text-[#7928CA] font-semibold hover:text-[#00C6FF] transition-colors">
                  View Events <FaAngleRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Categories - Futuristic Hexagon Style */}
      <div className="py-24 bg-[#050A18] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4D4D] via-transparent to-[#00C6FF] opacity-30"></div>
        
        {/* Decorative orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-[#7928CA] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-[#FF4D4D] rounded-full blur-[120px] opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white inline-block relative">
              Popular <span className="relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] blur-lg opacity-30"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF]">Categories</span>
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF4D4D] to-[#7928CA] mx-auto mt-4"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">Explore our diverse range of gaming categories and find your perfect match</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'FPS', icon: '🎯', color: 'from-[#FF4D4D]', toColor: 'to-[#FF8080]' },
              { name: 'MOBA', icon: '🏆', color: 'from-[#7928CA]', toColor: 'to-[#A15EDB]' },
              { name: 'Battle Royale', icon: '🔫', color: 'from-[#00C6FF]', toColor: 'to-[#92E0FF]' },
              { name: 'RPG', icon: '⚔️', color: 'from-[#FF4D4D]', toColor: 'to-[#7928CA]' },
              { name: 'Racing', icon: '🏎️', color: 'from-[#7928CA]', toColor: 'to-[#00C6FF]' },
              { name: 'Sports', icon: '⚽', color: 'from-[#00C6FF]', toColor: 'to-[#FF4D4D]' },
              { name: 'Strategy', icon: '🧠', color: 'from-[#FF4D4D]', toColor: 'to-[#00C6FF]' },
              { name: 'Fighting', icon: '👊', color: 'from-[#7928CA]', toColor: 'to-[#FF4D4D]' }
            ].map((category, index) => (
              <div 
                key={index} 
                className={`group relative bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105 hover:shadow-lg hover:shadow-${category.color.replace('from-', '')}/20`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.toColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Hexagon icon container */}
                <div className="relative mb-6 flex justify-center">
                  <div className={`w-16 h-16 flex items-center justify-center relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} ${category.toColor} opacity-10 rounded-full transform group-hover:scale-110 transition-all duration-500`}></div>
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-500 z-10">{category.icon}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className={`text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${category.color} ${category.toColor} transition-colors duration-300`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors text-sm">
                    Browse Games
                  </p>
                </div>
                
                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${category.color} ${category.toColor} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats Counter Section - Animated */}
      <div className="bg-[#0B1933] py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-10 w-32 h-32 bg-[#FF4D4D] rounded-full blur-[80px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-[#00C6FF] rounded-full blur-[80px] opacity-10 animate-pulse-slow"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Counter 1 */}
            <div className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#FF4D4D]/30 transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className={`text-5xl font-black mb-3 ${animateCount ? 'animate-counter' : ''}`}>
                  <span className="text-white">10K</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] to-[#7928CA]">+</span>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-[#FF4D4D] to-[#7928CA] mx-auto mb-3 transform origin-left group-hover:scale-x-125 transition-transform"></div>
                <p className="text-gray-300 font-medium">Active Players</p>
              </div>
            </div>
            
            {/* Counter 2 */}
            <div className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#7928CA]/30 transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7928CA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className={`text-5xl font-black mb-3 ${animateCount ? 'animate-counter' : ''}`}>
                  <span className="text-white">250</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7928CA] to-[#00C6FF]">+</span>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-[#7928CA] to-[#00C6FF] mx-auto mb-3 transform origin-left group-hover:scale-x-125 transition-transform"></div>
                <p className="text-gray-300 font-medium">Tournaments</p>
              </div>
            </div>
            
            {/* Counter 3 */}
            <div className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#00C6FF]/30 transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C6FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className={`text-5xl font-black mb-3 ${animateCount ? 'animate-counter' : ''}`}>
                  <span className="text-white">50</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6FF] to-[#FF4D4D]">+</span>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-[#00C6FF] to-[#FF4D4D] mx-auto mb-3 transform origin-left group-hover:scale-x-125 transition-transform"></div>
                <p className="text-gray-300 font-medium">Game Titles</p>
              </div>
            </div>
            
            {/* Counter 4 */}
            <div className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-[#FF4D4D]/30 transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className="text-5xl font-black mb-3">
                  <span className="text-white">24</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7928CA] to-[#00C6FF]">/7</span>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-[#7928CA] to-[#00C6FF] mx-auto mb-3 transform origin-left group-hover:scale-x-125 transition-transform"></div>
                <p className="text-gray-300 font-medium">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community Section - Immersive Style */}
      <div className="relative py-32 overflow-hidden bg-[#050A18]">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-[#0B1933]/80 to-[#050A18] opacity-80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#7928CA] rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF4D4D] rounded-full blur-[100px] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
              {/* Left content */}
              <div className="md:w-1/2 text-center md:text-left">
                <div className="inline-block p-3 bg-white/5 backdrop-blur-sm rounded-full mb-8 border border-white/10">
                  <div className="p-4 bg-gradient-to-br from-[#FF4D4D]/20 to-[#00C6FF]/20 rounded-full">
                    <FaHeadset className="text-white text-4xl" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Join Our <span className="relative">
                    <span className="absolute -inset-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] blur-lg opacity-30"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF]">Gaming Community</span>
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Connect with passionate gamers, participate in exclusive tournaments, and share your gaming experiences in our vibrant community.
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8 md:mb-0 justify-center md:justify-start">
                  <Link href="/about" className="group relative px-8 py-4 bg-gradient-to-r from-[#FF4D4D] to-[#7928CA] text-white font-bold rounded-lg overflow-hidden shadow-lg shadow-[#7928CA]/20">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7928CA] to-[#00C6FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      Join Now <FaRocket className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
              
              {/* Right content - Social Media Interactive Element */}
              <div className="md:w-1/2">
                <div className="relative bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/5 via-[#7928CA]/5 to-[#00C6FF]/5 rounded-2xl"></div>
                  
                  <h3 className="text-2xl font-bold text-white mb-8 text-center">Connect With Us</h3>
                  
                  <div className="grid grid-cols-3 gap-6">
                    {/* Discord */}
                    <a href="#" className="group flex flex-col items-center p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:scale-105">
                      <div className="relative mb-3">
                        <div className="absolute -inset-3 bg-[#7289DA] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <FaDiscord className="text-4xl text-[#7289DA] group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-white font-medium">Discord</span>
                      <span className="text-gray-400 text-sm mt-1">Join Server</span>
                    </a>
                    
                    {/* TikTok */}
                    <a href="#" className="group flex flex-col items-center p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:scale-105">
                      <div className="relative mb-3">
                        <div className="absolute -inset-3 bg-[#FF0050] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <FaTiktok className="text-4xl text-white group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-white font-medium">TikTok</span>
                      <span className="text-gray-400 text-sm mt-1">Follow Us</span>
                    </a>
                    
                    {/* YouTube */}
                    <a href="#" className="group flex flex-col items-center p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-300 hover:scale-105">
                      <div className="relative mb-3">
                        <div className="absolute -inset-3 bg-[#FF0000] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <FaYoutube className="text-4xl text-[#FF0000] group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-white font-medium">YouTube</span>
                      <span className="text-gray-400 text-sm mt-1">Subscribe</span>
                    </a>
                  </div>
                  
                  <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-300 text-center">Join our community of over <span className="text-white font-bold">10,000+</span> gamers worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4D4D] via-[#7928CA] to-[#00C6FF] opacity-50"></div>
      </div>
    </Layout>
  );
}