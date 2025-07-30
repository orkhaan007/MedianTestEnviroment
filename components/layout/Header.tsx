"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/utils/gallery/db";
import { ChevronDown } from "lucide-react";
import { signOutUser } from "@/utils/auth/signOut";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [rescueOpen, setRescueOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-[#0ed632] transition-colors">
              Median
            </Link>
          </div>


          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/application" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  Application
                </Link>
              </li>
              <li>
                <Link 
                  href="/team" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  About
                </Link>
              </li>
              

              <li>
                <Link 
                  href="/media/gallery" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  Gallery
                </Link>
              </li>

              <li>
                <Link 
                  href="/forms" 
                  className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                >
                  Forms
                </Link>
              </li>
              

              <li className="relative">
                <button 
                  className="flex items-center text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                  onClick={() => {
                    setRescueOpen(!rescueOpen);
                    if (mediaOpen) setMediaOpen(false);
                  }}
                >
                  Median
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {rescueOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded shadow-sm border border-gray-100 py-1 z-10">
                    <Link 
                      href="/median/armor" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Armor
                    </Link>
                    <Link 
                      href="/median/jersey" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Jersey
                    </Link>
                  </div>
                )}
              </li>
              
              {/* Profile dropdown */}
              {currentUser ? (
                <li className="relative">
                  <button 
                    className="flex items-center text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      if (mediaOpen) setMediaOpen(false);
                      if (rescueOpen) setRescueOpen(false);
                    }}
                  >
                    Profile
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded shadow-sm border border-gray-100 py-1 z-10">
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        My Profile
                      </Link>
                      <Link 
                        href="/media/my-uploads" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        My Uploads
                      </Link>
                      <Link 
                        href="/media/upload" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        Upload Media
                      </Link>
                      <Link 
                        href="/profile/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => {
                          setProfileOpen(false);
                          signOutUser();
                        }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Link 
                    href="/sign-in" 
                    className="text-gray-600 hover:text-[#0ed632] font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>


          <div className="md:hidden">
            <button 
              className="text-gray-600 hover:text-[#0ed632] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/application" 
                    className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Application
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/team" 
                    className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li className="border-t border-gray-100 pt-2 mt-2">
                  <Link 
                    href="/media/gallery" 
                    className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gallery
                  </Link>
                </li>
                {/* Profile section in mobile menu */}
                {currentUser ? (
                  <li className="border-t border-gray-100 pt-2 mt-2">
                    <p className="px-4 text-sm font-medium text-gray-500">Profile</p>
                    <Link 
                      href="/profile" 
                      className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/media/my-uploads" 
                      className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Uploads
                    </Link>
                    <Link 
                      href="/media/upload" 
                      className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Upload Media
                    </Link>
                    <Link 
                      href="/profile/settings" 
                      className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1 mx-6"></div>
                    <button 
                      className="block w-full text-left px-6 py-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOutUser();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li className="border-t border-gray-100 pt-2 mt-2">
                    <Link 
                      href="/sign-in" 
                      className="block px-4 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                )}
                
                <li className="border-t border-gray-100 pt-2 mt-2">
                  <p className="px-4 text-sm font-medium text-gray-500">Rescue4src</p>
                  <Link 
                    href="/rescue4src/zirh" 
                    className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Zirh
                  </Link>
                  <Link 
                    href="/rescue4src/form" 
                    className="block px-6 py-2 text-gray-600 hover:text-[#0ed632] hover:bg-[#f0fff0]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Form
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
