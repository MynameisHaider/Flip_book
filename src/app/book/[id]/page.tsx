'use client';

import { useEffect, useState, useRef, TouchEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, List, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Book {
  id: string;
  title: string;
  description: string | null;
  topics: {
    id: string;
    title: string;
    order: number;
    pages: {
      id: string;
      pageNumber: number;
      content: string;
    }[];
  }[];
}

interface FlatPage {
  type: 'cover' | 'toc' | 'content' | 'blank';
  content: string;
  title?: string;
  pageNumber?: number;
  topicId?: string;
  topicTitle?: string;
}

export default function BookReader() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flatPages, setFlatPages] = useState<FlatPage[]>([]);
  const [showTOC, setShowTOC] = useState(false);
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isMobile = useRef(false);

  // Check if mobile
  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    const handleResize = () => {
      isMobile.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/page-flip.mp3');
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch book data
  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}`);
      const data = await response.json();
      if (response.ok && data.book) {
        setBook(data.book);
        createFlatPages(data.book);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFlatPages = (bookData: Book) => {
    const pages: FlatPage[] = [];

    // Add cover page
    pages.push({
      type: 'cover',
      content: bookData.description || '',
      title: bookData.title,
    });

    // Add blank page after cover
    pages.push({ type: 'blank', content: '' });

    // Add TOC pages
    pages.push({
      type: 'toc',
      content: 'Table of Contents',
    });

    // Add blank page after TOC
    pages.push({ type: 'blank', content: '' });

    // Add topic pages in pairs
    bookData.topics.forEach((topic) => {
      topic.pages.forEach((page) => {
        pages.push({
          type: 'content',
          content: page.content,
          title: topic.title,
          pageNumber: page.pageNumber,
          topicId: topic.id,
          topicTitle: topic.title,
        });
      });
    });

    // Add blank page at end if odd number of pages
    if (pages.length % 2 !== 0) {
      pages.push({ type: 'blank', content: '' });
    }

    setFlatPages(pages);
  };

  const playFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio errors
      });
    }
  };

  const nextPage = () => {
    if (isMobile.current) {
      // Mobile: single page navigation
      if (currentPageIndex < flatPages.length - 1) {
        playFlipSound();
        setFlipping('next');
        setTimeout(() => {
          setCurrentPageIndex(currentPageIndex + 1);
          setFlipping(null);
        }, 300);
      }
    } else {
      // Desktop: two-page spread navigation
      if (currentPageIndex + 2 < flatPages.length) {
        playFlipSound();
        setFlipping('next');
        setTimeout(() => {
          setCurrentPageIndex(currentPageIndex + 2);
          setFlipping(null);
        }, 600);
      }
    }
  };

  const prevPage = () => {
    if (isMobile.current) {
      // Mobile: single page navigation
      if (currentPageIndex > 0) {
        playFlipSound();
        setFlipping('prev');
        setTimeout(() => {
          setCurrentPageIndex(currentPageIndex - 1);
          setFlipping(null);
        }, 300);
      }
    } else {
      // Desktop: two-page spread navigation
      if (currentPageIndex - 2 >= 0) {
        playFlipSound();
        setFlipping('prev');
        setTimeout(() => {
          setCurrentPageIndex(currentPageIndex - 2);
          setFlipping(null);
        }, 600);
      }
    }
  };

  const goToPage = (pageIndex: number) => {
    playFlipSound();
    if (pageIndex > currentPageIndex) {
      setFlipping('next');
    } else if (pageIndex < currentPageIndex) {
      setFlipping('prev');
    }
    
    // Align to even pages for desktop
    let targetPage = pageIndex;
    if (!isMobile.current && pageIndex % 2 !== 0) {
      targetPage = pageIndex - 1;
    }
    
    setTimeout(() => {
      setCurrentPageIndex(targetPage);
      setFlipping(null);
    }, 600);
    setShowTOC(false);
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next page
        nextPage();
      } else {
        // Swipe right - previous page
        prevPage();
      }
    }
  };

  // Jump to topic from TOC
  const jumpToTopic = (topicOrder: number) => {
    const topic = book?.topics.find((t) => t.order === topicOrder);
    if (topic && topic.pages.length > 0) {
      let pageIndex = flatPages.findIndex(
        (p) => p.type === 'content' && p.topicId === topic.id
      );
      
      // Align to even pages for desktop
      if (!isMobile.current && pageIndex % 2 !== 0) {
        pageIndex = pageIndex - 1;
      }
      
      if (pageIndex !== -1) {
        goToPage(pageIndex);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">کتاب لوڈ ہو رہا ہے...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">کتاب نہیں ملی</p>
          <Button onClick={() => router.push('/')}>واپس جائیں</Button>
        </div>
      </div>
    );
  }

  const leftPage = flatPages[currentPageIndex];
  const rightPage = flatPages[currentPageIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 font-urdu truncate px-4">
              {book.title}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTOC(true)}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">TOC</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Flipbook */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Book Container */}
          <div className="book-container relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="book-spine">
              {/* Left Page */}
              <div className={`book-page left-page ${flipping === 'prev' ? 'flipping-prev' : ''}`}>
                {leftPage && (
                  <>
                    {leftPage.type === 'blank' && (
                      <div className="h-full flex items-center justify-center">
                        <div className="page-texture"></div>
                      </div>
                    )}
                    {leftPage.type === 'cover' && (
                      <div className="book-cover h-full">
                        <h1 className="book-cover-title">{leftPage.title}</h1>
                        {leftPage.content && (
                          <p className="book-cover-description">{leftPage.content}</p>
                        )}
                      </div>
                    )}
                    {leftPage.type === 'toc' && (
                      <div className="h-full flex flex-col p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center border-b pb-4 font-urdu">
                          فہرست
                        </h2>
                        <div className="flex-1 overflow-y-auto toc-scroll">
                          {book.topics.map((topic) => {
                            const pageIndex = flatPages.findIndex(
                              (p) => p.type === 'content' && p.topicId === topic.id
                            );
                            return (
                              <div
                                key={topic.id}
                                onClick={() => goToPage(pageIndex)}
                                className="toc-item hover:bg-gray-50"
                              >
                                <div className="toc-item-title">{topic.title}</div>
                                <div className="toc-item-page">صفحہ {pageIndex + 1}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {leftPage.type === 'content' && (
                      <div className="h-full flex flex-col p-6">
                        {leftPage.topicTitle && (
                          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b font-urdu">
                            {leftPage.topicTitle}
                          </h2>
                        )}
                        <div className="flex-1 overflow-y-auto">
                          <div className="page-content whitespace-pre-line">
                            {leftPage.content}
                          </div>
                        </div>
                        <div className="page-number">
                          صفحہ {leftPage.pageNumber}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Page */}
              <div className={`book-page right-page ${flipping === 'next' ? 'flipping-next' : ''}`}>
                {rightPage && (
                  <>
                    {rightPage.type === 'blank' && (
                      <div className="h-full flex items-center justify-center">
                        <div className="page-texture"></div>
                      </div>
                    )}
                    {rightPage.type === 'content' && (
                      <div className="h-full flex flex-col p-6">
                        {rightPage.topicTitle && (
                          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b font-urdu">
                            {rightPage.topicTitle}
                          </h2>
                        )}
                        <div className="flex-1 overflow-y-auto">
                          <div className="page-content whitespace-pre-line">
                            {rightPage.content}
                          </div>
                        </div>
                        <div className="page-number">
                          صفحہ {rightPage.pageNumber}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <Button
              onClick={prevPage}
              disabled={currentPageIndex === 0}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>پچھلا</span>
            </Button>

            <div className="text-center min-w-[120px]">
              <p className="text-sm text-gray-600">صفحہ</p>
              <p className="text-2xl font-bold text-amber-700">
                {Math.floor(currentPageIndex / 2) + 1} / {Math.ceil(flatPages.length / 2)}
              </p>
            </div>

            <Button
              onClick={nextPage}
              disabled={currentPageIndex >= flatPages.length - 2}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <span>اگلا</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Keyboard Navigation Hint */}
          <p className="text-sm text-gray-500 mt-4">
            Arrow keys or swipe to navigate
          </p>
        </div>
      </main>

      {/* TOC Sidebar */}
      {showTOC && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 px-4">
          <div className="w-full max-w-md max-h-[80vh] overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold font-urdu">فہرست</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTOC(false)}
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] toc-scroll">
              {book.topics.map((topic) => {
                const pageIndex = flatPages.findIndex(
                  (p) => p.type === 'content' && p.topicId === topic.id
                );
                return (
                  <div
                    key={topic.id}
                    onClick={() => goToPage(pageIndex)}
                    className={`toc-item ${
                      currentPageIndex === pageIndex ? 'active' : ''
                    }`}
                  >
                    <div className="toc-item-title">{topic.title}</div>
                    <div className="toc-item-page">صفحہ {pageIndex + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
