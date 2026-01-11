'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Plus, Edit, Trash2, LogOut, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  description: string | null;
  status: string;
  topics: {
    id: string;
    title: string;
    order: number;
    _count: {
      pages: number;
    };
  }[];
}

interface Topic {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  pages: {
    id: string;
    pageNumber: number;
    content: string;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Book modal state
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookModalMode, setBookModalMode] = useState<'create' | 'edit'>('create');
  const [bookForm, setBookForm] = useState({ title: '', description: '', status: 'draft' });

  // Topic modal state
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicModalMode, setTopicModalMode] = useState<'create' | 'edit'>('create');
  const [topicForm, setTopicForm] = useState({ title: '', content: '', order: 0 });

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }
      fetchBooks();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/admin/books');
      const data = await response.json();
      if (response.ok) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchTopics = async (bookId: string) => {
    try {
      const response = await fetch(`/api/admin/topics?bookId=${bookId}`);
      const data = await response.json();
      if (response.ok) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast.success('لاگ آٹ کامیاب');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    fetchTopics(book.id);
  };

  // Book handlers
  const openCreateBookModal = () => {
    setBookModalMode('create');
    setBookForm({ title: '', description: '', status: 'draft' });
    setShowBookModal(true);
  };

  const openEditBookModal = (book: Book) => {
    setBookModalMode('edit');
    setBookForm({ title: book.title, description: book.description || '', status: book.status });
    setShowBookModal(true);
  };

  const handleSaveBook = async () => {
    try {
      const url = bookModalMode === 'create'
        ? '/api/admin/books'
        : `/api/admin/books/${selectedBook?.id}`;

      const method = bookModalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(bookModalMode === 'create' ? 'کتاب بن گئی' : 'کتاب اپڈیٹ ہو گئی');
        setShowBookModal(false);
        fetchBooks();
        if (selectedBook && bookModalMode === 'edit') {
          setSelectedBook(data.book);
        }
      } else {
        toast.error(data.error || 'خرابی');
      }
    } catch (error) {
      console.error('Save book error:', error);
      toast.error('خرابی');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('کیا آپ واقعی یہ کتاب حذف کرنا چاہتے ہیں؟')) return;

    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('کتاب حذف ہو گئی');
        if (selectedBook?.id === bookId) {
          setSelectedBook(null);
          setTopics([]);
        }
        fetchBooks();
      } else {
        toast.error('حذف کرنے میں ناکامی');
      }
    } catch (error) {
      console.error('Delete book error:', error);
      toast.error('خرابی');
    }
  };

  // Topic handlers
  const openCreateTopicModal = () => {
    setTopicModalMode('create');
    setTopicForm({ title: '', content: '', order: topics.length });
    setShowTopicModal(true);
  };

  const openEditTopicModal = (topic: Topic) => {
    setTopicModalMode('edit');
    setTopicForm({ title: topic.title, content: topic.content, order: topic.order });
    setShowTopicModal(true);
  };

  const handleSaveTopic = async () => {
    if (!selectedBook) return;

    try {
      const url = topicModalMode === 'create'
        ? '/api/admin/topics'
        : `/api/admin/topics/${topicModalMode === 'edit' && topics.find(t => t.title === topicForm.title)?.id}`;

      const method = topicModalMode === 'create' ? 'POST' : 'PUT';

      const body = topicModalMode === 'create'
        ? { ...topicForm, bookId: selectedBook.id }
        : { title: topicForm.title, content: topicForm.content, order: topicForm.order };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(topicModalMode === 'create' ? 'موضوع بن گیا' : 'موضوع اپڈیٹ ہو گیا');
        setShowTopicModal(false);
        fetchTopics(selectedBook.id);
      } else {
        toast.error(data.error || 'خرابی');
      }
    } catch (error) {
      console.error('Save topic error:', error);
      toast.error('خرابی');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('کیا آپ واقعی یہ موضوع حذف کرنا چاہتے ہیں؟')) return;

    try {
      const response = await fetch(`/api/admin/topics/${topicId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('موضوع حذف ہو گیا');
        fetchTopics(selectedBook!.id);
      } else {
        toast.error('حذف کرنے میں ناکامی');
      }
    } catch (error) {
      console.error('Delete topic error:', error);
      toast.error('خرابی');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-amber-700" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ایڈمن ڈیش بورڈ</h1>
                <p className="text-sm text-gray-600">کتابیں اور موضوعات کی انتظامیہ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Books Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>کتابیں</CardTitle>
                <Button size="sm" onClick={openCreateBookModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  نئی کتاب
                </Button>
              </div>
              <CardDescription>کتاب منتخب کریں</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleSelectBook(book)}
                    className={`
                      p-3 rounded-lg cursor-pointer border-2 transition-colors
                      ${selectedBook?.id === book.id
                        ? 'border-amber-700 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                      }
                    `}
                  >
                    <div className="font-semibold text-gray-900 mb-1 font-urdu">
                      {book.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {book.topics.length} موضوعات • {book.topics.reduce((sum, t) => sum + t._count.pages, 0)} صفحات
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        book.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status === 'published' ? 'شائع شدہ' : 'ڈرافٹ'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditBookModal(book);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(book.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Topics Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>موضوعات</CardTitle>
                <Button
                  size="sm"
                  onClick={openCreateTopicModal}
                  disabled={!selectedBook}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  نیا موضوع
                </Button>
              </div>
              <CardDescription>
                {selectedBook ? `${selectedBook.title} کے موضوعات` : 'پہلے ایک کتاب منتخب کریں'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedBook ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>کچھ دیکھنے کے لیے بائیں طرف سے ایک کتاب منتخب کریں</p>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>ابھی کوئی موضوع نہیں ہے</p>
                  <p className="text-sm">پہلا موضوع شامل کرنے کے لیے اوپر بٹن پر کلک کریں</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {topics.map((topic) => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 font-urdu text-lg">
                            {topic.title}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {topic.pages.length} صفحات • آرڈر: {topic.order}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditTopicModal(topic)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTopic(topic.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {topic.content && (
                        <div className="text-sm text-gray-700 font-urdu line-clamp-3">
                          {topic.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Book Button */}
        {selectedBook && selectedBook.status === 'published' && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(`/book/${selectedBook.id}`)}
            >
              <Book className="w-5 h-5 mr-2" />
              کتاب دیکھیں
            </Button>
          </div>
        )}
      </main>

      {/* Book Modal */}
      <Dialog open={showBookModal} onOpenChange={setShowBookModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookModalMode === 'create' ? 'نئی کتاب' : 'کتاب ایڈٹ کریں'}
            </DialogTitle>
            <DialogDescription>
              کتاب کی تفصیلات درج کریں
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle">کتاب کا عنوان</Label>
              <Input
                id="bookTitle"
                placeholder="کتاب کا عنوان درج کریں"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bookDescription">تفصیل</Label>
              <Textarea
                id="bookDescription"
                placeholder="کتاب کی تفصیل درج کریں"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                rows={3}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label>حیثیت</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={bookForm.status === 'draft'}
                    onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
                  />
                  <span>ڈرافٹ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={bookForm.status === 'published'}
                    onChange={(e) => setBookForm({ ...bookForm, status: e.target.value })}
                  />
                  <span>شائع شدہ</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookModal(false)}>
              منسوخ کریں
            </Button>
            <Button onClick={handleSaveBook}>
              محفوظ کریں
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Topic Modal */}
      <Dialog open={showTopicModal} onOpenChange={setShowTopicModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {topicModalMode === 'create' ? 'نیا موضوع' : 'موضوع ایڈٹ کریں'}
            </DialogTitle>
            <DialogDescription>
              موضوع کی تفصیلات درج کریں
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topicTitle">موضوع کا عنوان</Label>
              <Input
                id="topicTitle"
                placeholder="موضوع کا عنوان درج کریں"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicOrder">ترتیب (Order)</Label>
              <Input
                id="topicOrder"
                type="number"
                value={topicForm.order}
                onChange={(e) => setTopicForm({ ...topicForm, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topicContent">مضمون (Urdu Content)</Label>
              <Textarea
                id="topicContent"
                placeholder="مضمون یہاں درج کریں... صفحات خود بخود بن جائیں گے"
                value={topicForm.content}
                onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                rows={12}
                className="text-right font-urdu"
              />
              <p className="text-xs text-gray-500">
                صفحات خود بخود بنیں گے (تقریباً 90 الفاظ فی صفحہ)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopicModal(false)}>
              منسوخ کریں
            </Button>
            <Button onClick={handleSaveTopic}>
              محفوظ کریں
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
