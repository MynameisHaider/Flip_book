'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Book className="w-12 h-12 text-amber-700" />
          </div>
          <CardTitle className="text-2xl font-urdu">ایڈمن پورٹل</CardTitle>
          <CardDescription>
            اردو فلیپ بوک پلیٹ فارم کی انتظامیہ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push('/admin/login')}
            className="w-full"
            size="lg"
          >
            لاگ ان کریں
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            ہوم پیج پر واپس
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
