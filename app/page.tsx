"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaDiscord, FaSteam, FaUsers, FaGamepad, FaChevronRight, FaShieldAlt, FaUserPlus, FaArrowRight, FaSignInAlt } from "react-icons/fa";
import { RiSwordFill } from "react-icons/ri";
import { GiTrophy } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


interface DiscordMember {
  id: string;
  username: string;
  status: string;
  avatar_url?: string;
  game?: {
    name: string;
  };
}

interface DiscordStats {
  name?: string;
  approximate_member_count: number;
  approximate_presence_count: number;
  members?: DiscordMember[];
  instant_invite?: string;
  icon_url?: string;
}

export default function Home() {
  const [discordStats, setDiscordStats] = useState<DiscordStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscordStats() {
      try {
        const response = await fetch("/api/discord-stats?server=median");
        if (!response.ok) {
          throw new Error("Failed to fetch Discord stats");
        }
        const data = await response.json();
        setDiscordStats(data);
      } catch (error) {
        console.error("Error fetching Discord stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscordStats();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0ed632]/5 via-white to-gray-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#0ed632]/30 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#0ed632]/20 blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-[#0ed632]/20 blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4 px-4 py-1 bg-[#0ed632]/10 rounded-full">
                <p className="text-sm font-medium text-[#0ed632]">Median Gaming Website</p>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="text-[#0ed632] block">Unite.</span> 
                <span className="text-gray-700 block">Play.</span> 
                <span className="text-[#0ed632] block">Dominate.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Join Median, the ultimate gaming community where players connect, compete, and conquer together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/application" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#0ed632] text-white font-semibold rounded-xl shadow-lg hover:bg-[#0bc02c] transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  Join the Team
                  <FaChevronRight className="ml-2" />
                </Link>
                
                <a 
                  href="https://discord.gg/medianst" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#4752c4] border-2 border-[#4752c4] font-semibold rounded-xl hover:bg-[#4752c4]/5 transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  <FaDiscord className="mr-2 text-xl" />
                  Discord Server
                </a>
              </div>
              
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {loading ? (
                    // Loading placeholders for avatars
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white overflow-hidden animate-pulse"></div>
                    ))
                  ) : (
                    // Show up to 4 active members' avatars
                    discordStats?.members?.slice(0, 4).map((member, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src={member.avatar_url || '/default-avatar.png'} 
                          alt={member.username}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  )}
                </div>
                <p className="text-gray-600">
                  {loading ? (
                    <span className="inline-block w-24 h-5 bg-gray-200 rounded animate-pulse"></span>
                  ) : (
                    <>{discordStats?.approximate_member_count || '2,500'}+ gamers already joined</>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              className="flex-1 order-2 md:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#0ed632]/10 rounded-full blur-md"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#0ed632]/10 rounded-full blur-md"></div>
                
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="h-60 overflow-hidden rounded-2xl shadow-lg transform rotate-2">
                    <div className="w-full h-full bg-gray-200"></div>
                  </div>
                  <div className="h-60 overflow-hidden rounded-2xl shadow-lg transform -rotate-2 translate-y-10">
                    <div className="w-full h-full bg-gray-200"></div>
                  </div>
                  <div className="h-60 overflow-hidden rounded-2xl shadow-lg transform -rotate-3 -translate-y-6">
                    <div className="w-full h-full bg-gray-200"></div>
                  </div>
                  <div className="h-60 overflow-hidden rounded-2xl shadow-lg transform rotate-3">
                    <div className="w-full h-full bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4 px-4 py-1 bg-[#0ed632]/10 rounded-full">
                <p className="text-sm font-medium text-[#0ed632]">About Us</p>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                What is <span className="text-[#0ed632]">Median</span>?
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Median is more than just a gaming community — it's a thriving ecosystem where gamers of all skill levels come together to connect, compete, and grow.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0ed632]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Community First</h3>
                    <p className="text-gray-600">
                      We believe gaming is better together. Our community values respect, inclusion, and positive engagement above all else.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0ed632]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Skill Development</h3>
                    <p className="text-gray-600">
                      From casual players to competitive teams, we provide resources and support to help you improve your gaming skills.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0ed632]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Beyond Gaming</h3>
                    <p className="text-gray-600">
                      Median is about building real connections that extend beyond the screen, creating friendships that last.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discord Stats Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#5865F2]/5 via-white to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4 px-4 py-1 bg-[#5865F2]/10 rounded-full">
                <p className="text-sm font-medium text-[#5865F2]">Join Our Team</p>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Connect with our <span className="text-[#0ed632]">Discord</span> Team
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of gamers in our active Discord server. Connect, chat, and play together in a welcoming environment built for gamers of all levels.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium">Total Members</p>
                    <FaUsers className="text-[#0ed632] text-xl" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800">
                    {loading ? (
                      <div className="animate-pulse h-10 w-28 bg-gray-200 rounded"></div>
                    ) : (
                      <div className="flex items-end">
                        <span>{discordStats?.approximate_member_count.toLocaleString() || "--"}</span>
                        <span className="text-sm text-[#0ed632] ml-2 mb-1">+12% this month</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium">Online Now</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      <p className="text-green-500 font-medium">Live</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-800">
                    {loading ? (
                      <div className="animate-pulse h-10 w-28 bg-gray-200 rounded"></div>
                    ) : (
                      discordStats?.approximate_presence_count.toLocaleString() || "--"
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://discord.gg/medianst" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#5865F2] text-white font-semibold rounded-xl shadow-lg hover:bg-[#4752c4] transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  <FaDiscord className="mr-2 text-xl" /> Join Our Discord
                </a>
                
                <Link 
                  href="/media/gallery" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  Browse Gallery
                  <FaChevronRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-full h-full bg-[#0ed632]/10 rounded-2xl"></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                  <div className="bg-[#5865F2] p-6">
                    <div className="flex items-center">
                      <FaDiscord className="text-white text-3xl mr-3" />
                      <h3 className="text-2xl font-bold text-white">
                        {loading ? "Loading..." : (discordStats?.name || "Discord Server")}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        {loading ? (
                          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : discordStats?.icon_url ? (
                          <Image 
                            src={discordStats.icon_url} 
                            alt={discordStats?.name || "Discord Server"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-lg">
                            {discordStats?.name?.charAt(0) || "D"}
                          </div>
                        )}
                        <div className="ml-3">
                          {loading ? (
                            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-1"></div>
                          ) : (
                            <p className="font-bold text-gray-800">{discordStats?.name || "Discord Server"}</p>
                          )}
                          <p className="text-sm text-gray-500">Gaming Community</p>
                        </div>
                      </div>
                      <div className="bg-[#0ed632]/10 px-3 py-1 rounded-full">
                        <p className="text-xs font-medium text-[#0ed632]">VERIFIED</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">Active Members</h4>
                        {!loading && discordStats?.members && (
                          <div className="bg-[#0ed632]/10 px-3 py-1 rounded-full">
                            <p className="text-[#0ed632] text-sm font-medium">
                              {discordStats.members.length} Online
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar">
                          {discordStats?.members?.map((member) => (
                            <div key={member.id} className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <Image
                                  src={member.avatar_url}
                                  alt={member.username}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {member.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-800">{member.username}</p>
                                  <div className={`w-2 h-2 rounded-full ${
                                    member.status === "online" ? "bg-green-500" : 
                                    member.status === "idle" ? "bg-yellow-500" : 
                                    member.status === "dnd" ? "bg-red-500" : "bg-gray-400"
                                  }`}></div>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {member.game ? `Playing ${member.game.name}` : 
                                   member.status === "online" ? "Online" :
                                   member.status === "idle" ? "Idle" :
                                   member.status === "dnd" ? "Do Not Disturb" : "Offline"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[#5865F2] font-medium">
                        <span>© 2025 Median. All rights reserved.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Now Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ed632]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5865F2]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-1 bg-[#0ed632]/10 rounded-full">
              <p className="text-sm font-medium text-[#0ed632]">Join Our Community</p>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Ready to <span className="text-[#0ed632]">Level Up</span> Your Gaming Experience?
            </h2>
            
            <p className="text-lg text-gray-600">
              Become part of our growing community today. It only takes a minute to get started!
            </p>
          </motion.div>

          <motion.div 
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="group"
            >
              <a 
                href="/application" 
                className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full group-hover:border-[#0ed632]/20"
              >
                <div className="w-20 h-20 bg-[#0ed632]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0ed632]/20 transition-colors duration-300">
                  <FaUserPlus className="text-[#0ed632] text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Apply Now</h3>
                <p className="text-gray-600 mb-8">Submit your application to join our gaming community and access exclusive features.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-[#0ed632] text-white font-medium rounded-xl shadow-md group-hover:shadow-lg group-hover:bg-[#0bc02c] transition-all duration-300">
                    Get Started <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="group"
            >
              <a 
                href="https://discord.gg/medianst" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full group-hover:border-[#5865F2]/20"
              >
                <div className="w-20 h-20 bg-[#5865F2]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5865F2]/20 transition-colors duration-300">
                  <FaDiscord className="text-[#5865F2] text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Discord</h3>
                <p className="text-gray-600 mb-8">Connect with our community on Discord for voice chat, events, and gaming sessions.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-[#5865F2] text-white font-medium rounded-xl shadow-md group-hover:shadow-lg group-hover:bg-[#4752c4] transition-all duration-300">
                    Join Server <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="group"
            >
              <a 
                href="https://steamcommunity.com/groups/medianst" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full group-hover:border-[#171a21]/20"
              >
                <div className="w-20 h-20 bg-[#171a21]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#171a21]/20 transition-colors duration-300">
                  <FaSteam className="text-[#171a21] text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Steam Group</h3>
                <p className="text-gray-600 mb-8">Follow us on Steam for game events, tournaments, and community updates.</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center justify-center px-6 py-3 bg-[#171a21] text-white font-medium rounded-xl shadow-md group-hover:shadow-lg group-hover:bg-black transition-all duration-300">
                    Join Group <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}