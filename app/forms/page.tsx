import Link from "next/link";
import { getForms, getCurrentUser } from "@/utils/forms/db";
import FormListClient from "@/components/forms/FormListClient";
import { Button } from "@/components/common/button";

interface FormsPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function FormsPage({ searchParams }: FormsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = 10;
  
  const { forms, count } = await getForms(page, limit);
  const user = await getCurrentUser();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forms</h1>
        
        {user && (
          <Button asChild>
            <Link href="/forms/new">Create New Form</Link>
          </Button>
        )}
      </div>
      
      <FormListClient 
        initialForms={forms} 
        count={count} 
        page={page} 
        limit={limit} 
        currentUserId={user?.id} 
      />
    </div>
  );
}
