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
  image: string;
  created_at?: string;
  profile?: {
    banner_id?: string;
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

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { id, name, role, image, jersey_number, profile, created_at } = member;
  
  // Format the member since date if available, prioritizing profile.member_since over created_at
  const memberSince = profile?.member_since 
    ? new Date(profile.member_since).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    : created_at 
      ? new Date(created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        }) 
      : null;
  
  // Check if the member has any social links
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
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-64 w-full">
        <Image
          src={image || "/team/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-3 ${
            roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
          }`}
        >
          {role}
        </span>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {name}
        </h3>
        
        {profile?.banner_id && (
          <div className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-700 mb-2 inline-block">
            Banner ID: {profile.banner_id}
          </div>
        )}
        
        {memberSince && (
          <p className="text-sm text-gray-500 mb-4">Member since: {memberSince}</p>
        )}
        
        {jersey_number && (
          <p className="text-sm font-medium text-gray-700 mb-2">Jersey #: {jersey_number}</p>
        )}
        
        {/* Social Links */}
        {hasSocialLinks && (
          <div className="flex space-x-2 mt-3">
            {profile?.social_tiktok && (
              <a href={profile.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#000000] transition-colors">
                <FaTiktok size={18} />
              </a>
            )}
            {profile?.social_instagram && (
              <a href={profile.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {profile?.social_youtube && (
              <a href={profile.social_youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors">
                <FaYoutube size={18} />
              </a>
            )}
            {profile?.social_github && (
              <a href={profile.social_github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#333] transition-colors">
                <Github size={18} />
              </a>
            )}
            {profile?.social_steam && (
              <a href={profile.social_steam} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b2838] transition-colors">
                <FaSteam size={18} />
              </a>
            )}
            {profile?.social_kick && (
              <a href={profile.social_kick} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#53fc18] transition-colors">
                <SiKick size={18} />
              </a>
            )}
            {profile?.social_twitch && (
              <a href={profile.social_twitch} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#6441a5] transition-colors">
                <FaTwitch size={18} />
              </a>
            )}
          </div>
        )}
        
        <Link 
          href={`/team/${id}`}
          className="mt-4 inline-block text-[#0ed632] hover:underline"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
