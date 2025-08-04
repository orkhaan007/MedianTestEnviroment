import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { roleColors } from "@/utils/team/data";
import { Instagram, Github } from "lucide-react";
import { FaTiktok, FaYoutube, FaSteam, FaTwitch } from "react-icons/fa";
import { SiKick } from "react-icons/si";

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  jersey_number?: string;
  image?: string;
  created_at?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    banner_url?: string;
    bio?: string;
    personal_quote?: string;
    social_instagram?: string;
    social_github?: string;
    social_tiktok?: string;
    social_youtube?: string;
    social_steam?: string;
    social_kick?: string;
    social_twitch?: string;
    member_since?: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const formatSocialLink = (link: string, platform: string): string => {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }
  
  switch (platform) {
    case 'tiktok':
      return `https://www.tiktok.com/${link.startsWith('@') ? link : '@' + link}`;
    case 'instagram':
      return `https://www.instagram.com/${link.startsWith('@') ? link.substring(1) : link}`;
    case 'youtube':
      return `https://www.youtube.com/${link.startsWith('@') ? link : '@' + link}`;
    case 'github':
      return `https://github.com/${link}`;
    case 'steam':
      return `https://steamcommunity.com/id/${link}`;
    case 'kick':
      return `https://kick.com/${link}`;
    case 'twitch':
      return `https://www.twitch.tv/${link}`;
    default:
      return link;
  }
};

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { id, name, role, jersey_number, profile, created_at } = member;
  
  // Use profile avatar_url if available, otherwise use null
  const avatarUrl = profile?.avatar_url || null;
  
  const memberSince = created_at 
    ? new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;
  
  const hasSocialLinks = profile && (
    profile.social_instagram || 
    profile.social_github ||
    profile.social_tiktok ||
    profile.social_youtube ||
    profile.social_steam ||
    profile.social_kick ||
    profile.social_twitch
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative h-64 w-full group overflow-hidden">
        {avatarUrl ? (
          <>
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-green-600 via-[#0ed632] to-green-400 animate-gradient-x">
            <div className="text-6xl text-white font-bold drop-shadow-lg">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
              roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
            }`}
          >
            {role}
          </span>
          
          {jersey_number && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
              #{jersey_number}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {profile?.full_name || name}
        </h3>
        
        {memberSince && (
          <p className="text-sm text-gray-500 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Member since: {memberSince}
          </p>
        )}
        
        {/* Social Links */}
        {hasSocialLinks && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Connect</p>
            <div className="flex flex-wrap gap-2">
              {profile?.social_tiktok && (
                <a href={formatSocialLink(profile.social_tiktok, 'tiktok')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all duration-200">
                  <FaTiktok size={16} />
                </a>
              )}
              {profile?.social_instagram && (
                <a href={formatSocialLink(profile.social_instagram, 'instagram')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] hover:text-white transition-all duration-200">
                  <Instagram size={16} />
                </a>
              )}
              {profile?.social_youtube && (
                <a href={formatSocialLink(profile.social_youtube, 'youtube')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#FF0000] hover:text-white transition-all duration-200">
                  <FaYoutube size={16} />
                </a>
              )}
              {profile?.social_github && (
                <a href={formatSocialLink(profile.social_github, 'github')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#333] hover:text-white transition-all duration-200">
                  <Github size={16} />
                </a>
              )}
              {profile?.social_steam && (
                <a href={formatSocialLink(profile.social_steam, 'steam')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1b2838] hover:text-white transition-all duration-200">
                  <FaSteam size={16} />
                </a>
              )}
              {profile?.social_kick && (
                <a href={formatSocialLink(profile.social_kick, 'kick')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#53fc18] hover:text-black transition-all duration-200">
                  <SiKick size={16} />
                </a>
              )}
              {profile?.social_twitch && (
                <a href={formatSocialLink(profile.social_twitch, 'twitch')} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-[#6441a5] hover:text-white transition-all duration-200">
                  <FaTwitch size={16} />
                </a>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {memberSince}
          </span>
          <Link 
            href={`/team/${id}`}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
