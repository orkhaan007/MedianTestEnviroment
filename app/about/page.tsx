import React from 'react';
import Layout from '@/components/layout/Layout';

export const metadata = {
  title: 'About Us | Median',
  description: 'Learn more about Median - a passionate gaming community dedicated to players around the world.',
};

const AboutPage = () => {
  return (
    <Layout>
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Median</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A passionate gaming community where players connect, compete, and create unforgettable experiences together.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Median was born from a group of friends who shared a passion for gaming and wanted to create a space where gamers from all backgrounds could come together.
            </p>
            <p className="text-gray-600 mb-4">
              What started as casual gaming sessions has evolved into a thriving community with members from around the world. Our tournaments, events, and content creation have helped us build a reputation as one of the most welcoming gaming communities online.
            </p>
            <p className="text-gray-600">
              Today, we continue to grow and expand our reach, connecting players across different platforms and games while fostering a spirit of friendly competition and camaraderie.
            </p>
          </div>
          <div className="relative h-80 md:h-96">
            <div className="w-full h-full rounded-lg flex items-center justify-center">
              <img src="/Logos/MedianLogo.png" alt="Median Logo" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At Median, our gaming community is built on principles that create an inclusive, exciting, and supportive environment for all players.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion for Gaming</h3>
              <p className="text-gray-600">
                We live and breathe gaming, constantly exploring new titles, strategies, and ways to enhance the gaming experience for our community.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We believe that gaming is better together. Our community supports each other, shares knowledge, and builds lasting friendships through shared experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We welcome gamers of all skill levels, backgrounds, and interests. Everyone deserves a place where they can enjoy gaming in a respectful environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Meet the passionate gamers who manage our community, organize events, and keep Median running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
              <img src="/Logos/KozmosLogo.png" alt="Kozmos" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Kozmos</h3>
            <p className="text-green-600 mb-3">Community Founder</p>
            <p className="text-gray-600 mb-4">
              A lifelong gamer with a passion for building communities and organizing competitive events across multiple platforms.
            </p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
              <img src="/Logos/MentizLogo.png" alt="Mentiz" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Mentiz</h3>
            <p className="text-green-600 mb-3">Tournament Director</p>
            <p className="text-gray-600 mb-4">
              An expert in organizing competitive gaming events with experience in multiple game titles and tournament formats.
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
              <img src="/Logos/WardonLogo.png" alt="Wardon" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Wardon</h3>
            <p className="text-green-600 mb-3">Content Creator</p>
            <p className="text-gray-600 mb-4">
              A talented streamer and video producer who creates engaging content and helps our community share their gaming moments.
            </p>
          </div>
          
        </div>
        
        {/* Second row centered */}
        <div className="flex justify-center mt-8 gap-8">
          {/* Team Member 4 */}
          <div className="w-full md:w-1/3 max-w-sm">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img src="/Logos/OrkhanLogo.png" alt="Orkhan" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Orkhan</h3>
              <p className="text-green-600 mb-3">Community Manager</p>
              <p className="text-gray-600 mb-4">
                Dedicated to fostering a positive environment and building relationships within our gaming community across all platforms.
              </p>
            </div>
          </div>
          
          {/* Team Member 5 */}
          <div className="w-full md:w-1/3 max-w-sm">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <img src="/Logos/VageLogo.png" alt="Vage" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Vage</h3>
              <p className="text-green-600 mb-3">Esports Coach</p>
              <p className="text-gray-600 mb-4">
                Former professional player who now mentors our competitive teams and helps members improve their skills across various games.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're a casual player or aspiring pro, there's a place for you in our gaming community.
          </p>
          <button className="bg-[#0ed632] hover:bg-green-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
            Become a Member
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AboutPage;
