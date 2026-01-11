'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Book {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  topics: {
    id: string;
    title: string;
    _count: {
      pages: number;
    };
  }[];
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      if (response.ok) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">کتب لوڈ ہو رہی ہیں...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-amber-700" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">اردو فلیپ بوک</h1>
                <p className="text-sm text-gray-600">Urdu Flipbook Platform</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin'}
              className="font-urdu"
            >
              ایڈمن لاگ ان
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-urdu">
            خوش آمدید
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اپنی پسندیدہ اردو کتابیں پڑھیں اور لطف اٹھائیں۔ واقعی کتابوں کی طرح صفحات پلٹیں۔
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              کوئی کتاب دستیاب نہیں
            </h3>
            <p className="text-gray-500">
              ابھی تک کوئی کتاب شائع نہیں کی گئی۔ جلد ہی واپس آئیں۔
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card
                key={book.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => window.location.href = `/book/${book.id}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Book className="w-10 h-10 text-amber-700 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <CardTitle className="text-xl font-urdu text-gray-900 group-hover:text-amber-700 transition-colors">
                        {book.title}
                      </CardTitle>
                      {book.description && (
                        <CardDescription className="mt-2 font-urdu text-gray-600">
                          {book.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>موضوعات:</span>
                      <span className="font-semibold">{book.topics.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>کل صفحات:</span>
                      <span className="font-semibold">
                        {book.topics.reduce((sum, topic) => sum + topic._count.pages, 0)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 font-urdu">
                    پڑھنا شروع کریں
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} اردو فلیپ بوک پلیٹ فارم</p>
        </div>
      </footer>
    </div>
  );
}
