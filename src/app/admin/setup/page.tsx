'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSetup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('پاس ورڈز میچ نہیں کرتے');
      return;
    }

    if (password.length < 6) {
      toast.error('پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('ایڈمن اکاؤنٹ بن گیا');
        router.push('/admin/login');
      } else {
        toast.error(data.error || 'اکاؤنٹ بنانے میں ناکامی');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('سیٹ اپ میں خرابی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-amber-700" />
          </div>
          <CardTitle className="text-2xl font-urdu">ایڈمن سٹ اپ</CardTitle>
          <CardDescription>
            پہلا ایڈمن اکاؤنٹ بنائیں
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">پاس ورڈ کی تصدیق کریں</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="پاس ورڈ دوبارہ درج کریں"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  اکاؤنٹ بن رہا ہے...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  اکاؤنٹ بنائیں
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <Button
              variant="link"
              onClick={() => router.push('/admin/login')}
              className="text-amber-700 hover:text-amber-800"
            >
              پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-sm"
            >
              <Book className="w-4 h-4 mr-2" />
              ہوم پیج پر واپس
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
