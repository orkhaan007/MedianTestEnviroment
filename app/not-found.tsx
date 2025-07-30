import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-[#0ed632] text-white rounded-lg shadow-md hover:bg-[#0bc52d] transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Go to Homepage
          </Link>
          <Link 
            href="/media/gallery"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 text-[#0ed632]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Browse Gallery
          </Link>
        </div>
      </div>
      
      <div className="mt-16">
        <Link 
          href="/contact"
          className="text-[#0ed632] hover:underline flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Contact Support
        </Link>
      </div>
    </div>
  );
}
