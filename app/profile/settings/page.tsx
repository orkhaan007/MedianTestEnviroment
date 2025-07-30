"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";

interface UserData {
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    social_url1?: string;
    social_name1?: string;
    social_url2?: string;
    social_name2?: string;
    banner_url?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    social_url1?: string;
    social_name1?: string;
    social_url2?: string;
    social_name2?: string;
    banner_url?: string;
  };
}

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [socialUrl1, setSocialUrl1] = useState('');
  const [socialName1, setSocialName1] = useState('');
  const [socialUrl2, setSocialUrl2] = useState('');
  const [socialName2, setSocialName2] = useState('');
  
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/sign-in");
          return;
        }
        
        setUser(user as UserProfile);
        
        // Initialize form with user data
        setFullName(user.user_metadata?.full_name || '');
        setLocation(user.user_metadata?.location || '');
        setBio(user.user_metadata?.bio || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');
        setBannerUrl(user.user_metadata?.banner_url || '');
        setSocialUrl1(user.user_metadata?.social_url1 || '');
        setSocialName1(user.user_metadata?.social_name1 || '');
        setSocialUrl2(user.user_metadata?.social_url2 || '');
        setSocialName2(user.user_metadata?.social_name2 || '');
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, [router]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          location,
          bio,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          social_url1: socialUrl1,
          social_name1: socialName1,
          social_url2: socialUrl2,
          social_name2: socialName2
        }
      });
      
      if (error) {
        throw error;
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser as UserProfile);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setSaving(false);
      
      // Clear success message after 3 seconds
      if (message.type === 'success') {
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ed632]"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">You need to sign in to edit your profile</h1>
        <Link 
          href="/sign-in"
          className="px-4 py-2 bg-[#0ed632] text-white rounded hover:bg-[#0bc52d] transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner with title and back button */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          {/* Banner Image with Upload */}
          <div className="h-64 bg-gray-100 relative overflow-hidden">
            <ProfileImageUploader
              type="banner"
              currentImageUrl={bannerUrl}
              onImageUploaded={(url) => setBannerUrl(url)}
              className="w-full h-full"
            />
            
            {/* Title and Back Button */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-8 py-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Edit Profile</h1>
              <Link 
                href="/profile"
                className="px-4 py-2 bg-white text-[#0ed632] font-medium rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </Link>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="px-8 py-6 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg relative">
                <ProfileImageUploader
                  type="avatar"
                  currentImageUrl={avatarUrl}
                  onImageUploaded={(url) => setAvatarUrl(url)}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <div className="mt-16">
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-8 py-6">
          
          {message.text && (
            <div className={`mb-6 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Form Sections */}
            <div className="space-y-8">
              {/* Personal Info Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                      />
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Social Media Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Social Media
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Social Media 1 */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="socialName1" className="block text-sm font-medium text-gray-700">
                        Platform Name
                      </label>
                      <select
                        id="socialName1"
                        value={socialName1}
                        onChange={(e) => setSocialName1(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                      >
                        <option value="">Select a platform</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="GitHub">GitHub</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Pinterest">Pinterest</option>
                        <option value="Reddit">Reddit</option>
                        <option value="Twitch">Twitch</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="socialUrl1" className="block text-sm font-medium text-gray-700">
                        URL or Username
                      </label>
                      <input
                        type="text"
                        id="socialUrl1"
                        value={socialUrl1}
                        onChange={(e) => setSocialUrl1(e.target.value)}
                        placeholder="URL or username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                      />
                    </div>
                  </div>
                  
                  {/* Social Media 2 */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="socialName2" className="block text-sm font-medium text-gray-700">
                        Platform Name
                      </label>
                      <select
                        id="socialName2"
                        value={socialName2}
                        onChange={(e) => setSocialName2(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                      >
                        <option value="">Select a platform</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="GitHub">GitHub</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Pinterest">Pinterest</option>
                        <option value="Reddit">Reddit</option>
                        <option value="Twitch">Twitch</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="socialUrl2" className="block text-sm font-medium text-gray-700">
                        URL or Username
                      </label>
                      <input
                        type="text"
                        id="socialUrl2"
                        value={socialUrl2}
                        onChange={(e) => setSocialUrl2(e.target.value)}
                        placeholder="URL or username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0ed632] focus:border-[#0ed632]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Member since: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href="/profile"
                    className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-5 py-2 bg-[#0ed632] text-white rounded-full hover:bg-[#0bc52d] transition-all flex items-center gap-2 hover:shadow-md ${
                      saving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-[#0ed632] relative">
          <div className="absolute inset-0 flex items-center px-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Account Security
            </h2>
          </div>
        </div>
        
        <div className="px-8 py-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </h3>
                <p className="text-gray-600 mt-1 ml-7">
                  Update your password regularly to keep your account secure.
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="px-5 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0ed632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}