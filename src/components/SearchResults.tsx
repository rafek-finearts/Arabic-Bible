import React, { useRef, useEffect, useState } from 'react';
import { highlightSearchText } from '../utils/highlightText';

interface SearchResult {
  testament: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onResultClick: (testament: string, book: string, chapter: number, verse: number) => void;
  fontSize: number;
  scrollPosition: number;
  onScroll: (position: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  onResultClick,
  fontSize,
  scrollPosition,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const lastScrollPosition = useRef<number>(scrollPosition);
  const lastScrollTime = useRef<number>(Date.now());

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollTop !== scrollPosition) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleScroll = () => {
    if (contentRef.current) {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const timeout = setTimeout(() => {
        const currentScrollPosition = contentRef.current.scrollTop;
        const currentTime = Date.now();
        if (currentScrollPosition !== lastScrollPosition.current && currentTime - lastScrollTime.current >= 1000) {
          onScroll(currentScrollPosition); // Update scroll position if it has changed and 1 second has passed
          lastScrollPosition.current = currentScrollPosition;
          lastScrollTime.current = currentTime;
        }
      }, 1000);
      setScrollTimeout(timeout);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      localStorage.setItem('lastHeaderHeight', headerHeight.toString());
    }
    onResultClick(result.testament, result.book, result.chapter, result.verse);
  };

  return (
    <div className="h-full flex flex-col" dir="rtl">
      <div ref={headerRef} className="sticky top-0 bg-white dark:bg-gray-800 z-10 py-6 shadow-sm">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-2xl font-bold dark:text-white" style={{ fontSize: `${fontSize * 1.5}px` }}>
            نتائج البحث ({results.length})
          </h2>
        </div>
      </div>
      <div 
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-8 pt-4"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold dark:text-white" style={{ fontSize: `${fontSize}px` }}>
                    {result.book} {result.chapter}:{result.verse}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400" style={{ fontSize: `${fontSize * 0.875}px` }}>
                    {result.testament}
                  </span>
                </div>
                <p 
                  className="text-gray-700 dark:text-gray-300" 
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSearchText(result.text, searchQuery) 
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
