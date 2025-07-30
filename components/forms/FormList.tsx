import Link from "next/link";
import { Form } from "@/types/forms";
import { formatDate } from "@/utils/date";
import { Badge } from "../common/badge";

interface FormListProps {
  forms: Form[];
  count: number;
  page: number;
  limit: number;
}

export default function FormList({ forms, count, page, limit }: FormListProps) {
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
