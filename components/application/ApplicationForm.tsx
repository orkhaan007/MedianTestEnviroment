"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ApplicationForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    discordNick: "",
    discordId: "",
    steamProfile: "",
    fivemHours: "",
    whyMedian: "",
    acceptWarningSystem: false,
    acceptCkPossibility: false,
    acceptHierarchy: false,
    southsideMeaning: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Name cannot be empty";
    if (!formData.age.trim()) newErrors.age = "Age cannot be empty";
    else if (isNaN(Number(formData.age)) || Number(formData.age) < 16) newErrors.age = "Please enter a valid age (16+)";
    
    if (!formData.discordNick.trim()) newErrors.discordNick = "Discord nickname cannot be empty";
    if (!formData.discordId.trim()) newErrors.discordId = "Discord ID cannot be empty";
    
    if (!formData.steamProfile.trim()) newErrors.steamProfile = "Steam profile link cannot be empty";
    if (!formData.steamProfile.includes("steamcommunity.com")) newErrors.steamProfile = "Please enter a valid Steam profile link";
    
    if (!formData.fivemHours.trim()) newErrors.fivemHours = "FiveM hours cannot be empty";
    else if (isNaN(Number(formData.fivemHours)) || Number(formData.fivemHours) < 0) newErrors.fivemHours = "Please enter valid hours";
    
    if (!formData.whyMedian.trim()) newErrors.whyMedian = "Why Median question cannot be empty";
    if (formData.whyMedian.trim().length < 50) newErrors.whyMedian = "Please enter at least 50 characters";
    
    if (!formData.acceptWarningSystem) newErrors.acceptWarningSystem = "You must check this box";
    if (!formData.acceptCkPossibility) newErrors.acceptCkPossibility = "You must check this box";
    if (!formData.acceptHierarchy) newErrors.acceptHierarchy = "You must check this box";
    
    if (!formData.southsideMeaning.trim()) newErrors.southsideMeaning = "Southside question cannot be empty";
    if (formData.southsideMeaning.trim().length < 50) newErrors.southsideMeaning = "Please enter at least 50 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/sign-in");
        return;
      }
      
      // Check if user already has a pending application
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (existingApplication && existingApplication.length > 0) {
        const application = existingApplication[0];
        if (application.status === "pending") {
          alert("You already have a pending application. Please wait for the result.");
          router.push("/application/status");
          return;
        }
      }
      
      // Insert new application
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        discord_nick: formData.discordNick,
        discord_id: formData.discordId,
        steam_profile: formData.steamProfile,
        fivem_hours: parseInt(formData.fivemHours),
        why_median: formData.whyMedian,
        accept_warning_system: formData.acceptWarningSystem,
        accept_ck_possibility: formData.acceptCkPossibility,
        accept_hierarchy: formData.acceptHierarchy,
        southside_meaning: formData.southsideMeaning,
        status: "pending"
      });
      
      if (error) throw error;
      
      alert("Your application has been successfully submitted. Please wait for the result.");
      router.push("/application/status");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Median Application Form</h1>
      
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium mb-2">Please correct the following errors:</p>
          <ul className="list-disc pl-5">
            {Object.values(errors).map((error, index) => (
              <li key={index} className="text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  OOC Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your Name"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="17"
                  className={`w-full px-4 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your Age"
                />
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
              </div>
            </div>
          </div>
          
          {/* Discord Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Discord Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="discordNick" className="block text-sm font-medium text-gray-700 mb-1">
                  Discord Nickname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="discordNick"
                  name="discordNick"
                  value={formData.discordNick}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.discordNick ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your Discord Username"
                />
                {errors.discordNick && <p className="mt-1 text-sm text-red-600">{errors.discordNick}</p>}
              </div>
              
              <div>
                <label htmlFor="discordId" className="block text-sm font-medium text-gray-700 mb-1">
                  Discord ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="discordId"
                  name="discordId"
                  value={formData.discordId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.discordId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your Discord ID"
                />
                {errors.discordId && <p className="mt-1 text-sm text-red-600">{errors.discordId}</p>}
              </div>
            </div>
          </div>
          
          {/* Gaming Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gaming Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="steamProfile" className="block text-sm font-medium text-gray-700 mb-1">
                  Steam Profile (Must Be Public) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="steamProfile"
                  name="steamProfile"
                  value={formData.steamProfile}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.steamProfile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your Steam Profile Link"
                />
                {errors.steamProfile && <p className="mt-1 text-sm text-red-600">{errors.steamProfile}</p>}
              </div>
              
              <div>
                <label htmlFor="fivemHours" className="block text-sm font-medium text-gray-700 mb-1">
                  FiveM Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="fivemHours"
                  name="fivemHours"
                  value={formData.fivemHours}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border ${errors.fivemHours ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Your FiveM Hours"
                />
                {errors.fivemHours && <p className="mt-1 text-sm text-red-600">{errors.fivemHours}</p>}
              </div>
            </div>
          </div>
          
          {/* Application Questions */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Questions</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="whyMedian" className="block text-sm font-medium text-gray-700 mb-1">
                  Why Median? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whyMedian"
                  name="whyMedian"
                  value={formData.whyMedian}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border ${errors.whyMedian ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="Why do you want to join Median?"
                />
                {errors.whyMedian && <p className="mt-1 text-sm text-red-600">{errors.whyMedian}</p>}
                <p className="mt-1 text-sm text-gray-500">Minimum 50 characters required.</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Rules and Conditions</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="acceptWarningSystem"
                        name="acceptWarningSystem"
                        type="checkbox"
                        checked={formData.acceptWarningSystem}
                        onChange={handleCheckboxChange}
                        className={`w-4 h-4 text-[#0ed632] border ${errors.acceptWarningSystem ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#0ed632]`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="acceptWarningSystem" className="font-medium text-gray-700">
                        Median has a warning system. You may receive warnings or bans for your mistakes. Do you accept this?
                      </label>
                      {errors.acceptWarningSystem && <p className="mt-1 text-sm text-red-600">{errors.acceptWarningSystem}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="acceptCkPossibility"
                        name="acceptCkPossibility"
                        type="checkbox"
                        checked={formData.acceptCkPossibility}
                        onChange={handleCheckboxChange}
                        className={`w-4 h-4 text-[#0ed632] border ${errors.acceptCkPossibility ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#0ed632]`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="acceptCkPossibility" className="font-medium text-gray-700">
                        Do you accept that there is a possibility of character kill (CK) after leaving the team?
                      </label>
                      {errors.acceptCkPossibility && <p className="mt-1 text-sm text-red-600">{errors.acceptCkPossibility}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="acceptHierarchy"
                        name="acceptHierarchy"
                        type="checkbox"
                        checked={formData.acceptHierarchy}
                        onChange={handleCheckboxChange}
                        className={`w-4 h-4 text-[#0ed632] border ${errors.acceptHierarchy ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-[#0ed632]`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="acceptHierarchy" className="font-medium text-gray-700">
                        Median has a hierarchy and strict rules/laws. You will be banned if you don't comply with them. Do you accept this?
                      </label>
                      {errors.acceptHierarchy && <p className="mt-1 text-sm text-red-600">{errors.acceptHierarchy}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="southsideMeaning" className="block text-sm font-medium text-gray-700 mb-1">
                  What does Southside mean to you? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="southsideMeaning"
                  name="southsideMeaning"
                  value={formData.southsideMeaning}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border ${errors.southsideMeaning ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ed632]`}
                  placeholder="What does Southside mean to you?"
                />
                {errors.southsideMeaning && <p className="mt-1 text-sm text-red-600">{errors.southsideMeaning}</p>}
                <p className="mt-1 text-sm text-gray-500">Minimum 50 characters required.</p>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0ed632] text-white font-medium rounded-md hover:bg-[#0bc02c] focus:outline-none focus:ring-2 focus:ring-[#0ed632] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
