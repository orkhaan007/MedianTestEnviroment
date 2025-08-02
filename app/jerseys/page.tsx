"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";
import { motion } from "framer-motion";

interface Jersey {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  season?: string;
  created_at: string;
}

export default function JerseyShowcasePage() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const supabase = createClient();

  // Fetch jerseys from database
  useEffect(() => {
    async function fetchJerseys() {
      try {
        const { data, error } = await supabase
          .from("jerseys")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching jerseys:", error);
        } else {
          setJerseys(data || []);
        }
      } catch (error) {
        console.error("Error in fetchJerseys:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJerseys();
  }, [supabase]);

  const handleJerseyClick = (jersey: Jersey) => {
    setSelectedJersey(jersey);
  };

  const closeModal = () => {
    setSelectedJersey(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Team Jerseys
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our team's official jerseys collection
            </p>
          </div>

          {/* Jersey grid */}
          {jerseys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No jerseys available yet.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {jerseys.map((jersey) => (
                <motion.div
                  key={jersey.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleJerseyClick(jersey)}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={jersey.image_url}
                      alt={`${jersey.name} Jersey`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div>
                      <h3 className="font-medium text-lg truncate">{jersey.name}</h3>
                    </div>
                    
                    {jersey.season && (
                      <p className="text-gray-600 mt-1 text-sm">
                        Season: {jersey.season}
                      </p>
                    )}
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(jersey.created_at).toLocaleDateString()}
                      </span>
                      <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Jersey Modal */}
      {selectedJersey && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium text-xl">
                
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img 
                      src={selectedJersey.image_url}
                      alt={`${selectedJersey.name} Jersey`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJersey.name}</h2>
                  <div className="mb-4">
                    {selectedJersey.season && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full ml-2">
                        Season: {selectedJersey.season}
                      </span>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <h4 className="text-gray-900 font-medium">Description:</h4>
                    <p>{selectedJersey.description || "No description available."}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Added on {new Date(selectedJersey.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </>
  );
}