'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('لاگ ان کامیاب');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.error || 'لاگین ناکام');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('داخلے میں خرابی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Book className="w-12 h-12 text-amber-700" />
          </div>
          <CardTitle className="text-2xl font-urdu">ایڈمن لاگ ان</CardTitle>
          <CardDescription>
            اپنے ایڈمن اکاؤنٹ تک رسائی حاصل کریں
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">یوزر نیم</Label>
              <Input
                id="username"
                type="text"
                placeholder="یوزر نیم درج کریں"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">پاس ورڈ</Label>
              <Input
                id="password"
                type="password"
                placeholder="پاس ورڈ درج کریں"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="text-right"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  لاگ ان ہو رہا ہے...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  لاگ ان
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <Button
              variant="link"
              onClick={() => router.push('/')}
              className="text-amber-700 hover:text-amber-800"
            >
              ہوم پیج پر واپس جائیں
            </Button>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500 border-t pt-4">
            <p>پہلی بار؟ ایڈمن اکاؤنٹ بنانے کے لیے</p>
            <Button
              variant="link"
              onClick={() => router.push('/admin/setup')}
              className="text-xs p-0 h-auto"
            >
              سٹ اپ کریں
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
