import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Login attempt for:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        
        // Show specific error messages
        if (error.message.includes('User data not found')) {
          toast.error('Account exists but user data is missing. Please contact admin.');
        } else if (error.message.includes('auth/invalid-credential') || 
                   error.message.includes('auth/wrong-password') ||
                   error.message.includes('auth/user-not-found')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('auth/too-many-requests')) {
          toast.error('Too many failed attempts. Please try again later.');
        } else if (error.message.includes('auth/network-request-failed')) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error(error.message || 'Login failed');
        }
      } else {
        toast.success('Login successful');
        // Let the auth context handle the redirect based on role
        // The onAuthStateChanged will detect the user and redirect appropriately
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Hotel Management</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Admin Setup:</p>
            <div className="text-xs space-y-1">
              <p>Register with email: <strong>izmashaikh7681@gmail.com</strong></p>
              <p>Password: <strong>123456</strong> (or your choice)</p>
              <p className="text-muted-foreground text-xs mt-2">
                This email will automatically get admin privileges
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
