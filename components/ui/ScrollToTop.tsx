"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  showAfterPx?: number;
  animationDuration?: number;
}

const ScrollToTop = ({ 
  showAfterPx = 300, 
  animationDuration = 1000 
}: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterPx) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfterPx]);

  // Scroll to top with animation
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const scrollStep = (currentTime: number): void => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      window.scrollTo({
        top: startPosition * (1 - easeInOutCubic(progress)),
        behavior: 'auto'
      });
      
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    };
    
    requestAnimationFrame(scrollStep);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="bg-white text-[#0ed632] hover:text-white hover:bg-[#0ed632] p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default ScrollToTop;
