"use client";

import { useState } from "react";
import { Form } from "@/types/forms";
import { createFormAction, updateFormAction } from "@/app/forms/actions";
import { Button } from "../common/button";
import { useRouter } from "next/navigation";

interface FormEditorProps {
  form?: Form;
  isEdit?: boolean;
}

export default function FormEditor({ form, isEdit = false }: FormEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(form?.title || "");
  const [content, setContent] = useState(form?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit && form) {
        // Update existing form
        const result = await updateFormAction(form.id, { title, content });
        
        if (result.error) {
          setError(result.error);
        } else {
          router.push(`/forms/${form.id}`);
        }
      } else {
        // Create new form
        const result = await createFormAction({ title, content });
        
        if (result.error) {
          setError(result.error);
        } else if (result.formId) {
          router.push(`/forms/${result.formId}`);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : isEdit ? "Update Form" : "Create Form"}
        </Button>
      </div>
    </form>
  );
}
