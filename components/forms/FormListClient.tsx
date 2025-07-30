"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "@/types/forms";
import { formatDate } from "@/utils/date";
import { Badge } from "../common/badge";
import { subscribeToFormsListUpdates } from "@/utils/forms/realtime";

interface FormListClientProps {
  initialForms: Form[];
  count: number;
  page: number;
  limit: number;
  currentUserId?: string | null;
}

export default function FormListClient({ 
  initialForms, 
  count: initialCount, 
  page, 
  limit,
  currentUserId
}: FormListClientProps) {
  const [forms, setForms] = useState<Form[]>(initialForms);
  const [count, setCount] = useState(initialCount);
  
  // Set up real-time subscription
  useEffect(() => {
    // Only set up real-time if we have a user
    if (!currentUserId) return;
    
    const unsubscribe = subscribeToFormsListUpdates(
      // Handle form inserts
      (newForm) => {
        // Only add to current page if it's the first page
        if (page === 1) {
          setForms((prevForms) => {
            // Check if form already exists
            if (prevForms.some(form => form.id === newForm.id)) {
              return prevForms;
            }
            
            // Add new form to the beginning and maintain limit
            const updatedForms = [newForm, ...prevForms];
            if (updatedForms.length > limit) {
              updatedForms.pop();
            }
            return updatedForms;
          });
          
          setCount(prevCount => prevCount + 1);
        } else {
          // Just update the count for pagination
          setCount(prevCount => prevCount + 1);
        }
      },
      // Handle form updates
      (updatedForm) => {
        setForms((prevForms) => 
          prevForms.map((form) => 
            form.id === updatedForm.id ? updatedForm : form
          )
        );
      },
      // Handle form deletes
      (deletedFormId) => {
        setForms((prevForms) => 
          prevForms.filter((form) => form.id !== deletedFormId)
        );
        
        setCount(prevCount => Math.max(0, prevCount - 1));
      }
    );
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [page, limit, currentUserId]);
  
  const totalPages = Math.ceil(count / limit);
  
  return (
    <div className="space-y-6">
      {forms.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No forms found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <Link 
              key={form.id} 
              href={`/forms/${form.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    {form.title}
                    {form.is_solved && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                        Solved
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Posted by {form.user_full_name} on {formatDate(form.created_at)}
                    {form.is_edited && <span className="ml-2 text-gray-400">(edited)</span>}
                  </p>
                  <p className="mt-2 line-clamp-2">{form.content}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex space-x-1" aria-label="Pagination">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              const isCurrentPage = pageNumber === page;
              
              return (
                <Link
                  key={pageNumber}
                  href={`/forms?page=${pageNumber}`}
                  className={`px-3 py-1 rounded ${
                    isCurrentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
