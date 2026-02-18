import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CheckCircle, XCircle } from 'lucide-react';

export default function CheckUser() {
  const [uid, setUid] = useState('');
  const [result, setResult] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const checkUser = async () => {
    if (!uid.trim()) {
      setResult({ error: 'Please enter a UID' });
      return;
    }

    setChecking(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        setResult({
          success: true,
          data: userDoc.data(),
          id: userDoc.id
        });
      } else {
        setResult({
          success: false,
          message: 'User document not found in Firestore'
        });
      }
    } catch (error: any) {
      setResult({
        error: error.message
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Check User in Firestore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter a user's UID to check if their document exists in Firestore.
          </p>

          <div className="space-y-2">
            <Label htmlFor="uid">User UID</Label>
            <Input
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter Firebase Auth UID"
            />
          </div>

          <Button onClick={checkUser} disabled={checking} className="w-full">
            {checking ? 'Checking...' : 'Check User'}
          </Button>

          {result && (
            <div className="mt-6 border rounded-lg p-4">
              {result.success ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">User Found!</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Document ID:</strong> {result.id}</p>
                    <p><strong>Email:</strong> {result.data.email}</p>
                    <p><strong>Name:</strong> {result.data.name}</p>
                    <p><strong>Role:</strong> {result.data.role}</p>
                    <p><strong>Created At:</strong> {result.data.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}</p>
                    {result.data.createdBy && (
                      <p><strong>Created By:</strong> {result.data.createdBy}</p>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-xs text-green-800">
                      ✅ This user should be able to login with their email and password.
                    </p>
                  </div>
                </>
              ) : result.error ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold">Error</h3>
                  </div>
                  <p className="text-sm text-red-500">{result.error}</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold">User Not Found</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-800">
                      ❌ This user exists in Firebase Authentication but not in Firestore.
                      They won't be able to login until a Firestore document is created.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>How to get UID:</strong>
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to Firebase Console</li>
              <li>Authentication → Users</li>
              <li>Find the user's email</li>
              <li>Copy their UID</li>
              <li>Paste it here</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
