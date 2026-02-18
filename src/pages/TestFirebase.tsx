import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestFirebase() {
  const [results, setResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const testResults: any = {};

    // Test 1: Firebase Config
    try {
      testResults.config = {
        status: 'success',
        message: 'Firebase configuration loaded',
        details: {
          projectId: auth.app.options.projectId,
          authDomain: auth.app.options.authDomain
        }
      };
    } catch (error: any) {
      testResults.config = {
        status: 'error',
        message: 'Firebase configuration error',
        error: error.message
      };
    }

    // Test 2: Authentication
    try {
      const testEmail = `test-${Date.now()}@test.com`;
      const testPassword = 'test123456';
      
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      testResults.auth = {
        status: 'success',
        message: 'Authentication working',
        details: {
          uid: userCredential.user.uid,
          email: userCredential.user.email
        }
      };

      // Clean up test user
      await deleteUser(userCredential.user);
    } catch (error: any) {
      testResults.auth = {
        status: 'error',
        message: 'Authentication error',
        error: error.message,
        code: error.code
      };
    }

    // Test 3: Firestore
    try {
      const testDocId = `test-${Date.now()}`;
      const testData = {
        test: true,
        timestamp: new Date()
      };

      await setDoc(doc(db, 'test', testDocId), testData);
      const docSnap = await getDoc(doc(db, 'test', testDocId));
      
      if (docSnap.exists()) {
        testResults.firestore = {
          status: 'success',
          message: 'Firestore working',
          details: {
            canWrite: true,
            canRead: true
          }
        };
        
        // Clean up test document
        await deleteDoc(doc(db, 'test', testDocId));
      } else {
        testResults.firestore = {
          status: 'error',
          message: 'Firestore read failed'
        };
      }
    } catch (error: any) {
      testResults.firestore = {
        status: 'error',
        message: 'Firestore error',
        error: error.message,
        code: error.code
      };
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Firebase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This page tests your Firebase configuration. Click the button below to run all tests.
          </p>

          <Button onClick={runTests} disabled={testing} className="w-full">
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>

          {Object.keys(results).length > 0 && (
            <div className="space-y-4 mt-6">
              {/* Config Test */}
              {results.config && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {results.config.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-semibold">Firebase Configuration</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{results.config.message}</p>
                  {results.config.details && (
                    <pre className="mt-2 text-xs bg-muted p-2 rounded">
                      {JSON.stringify(results.config.details, null, 2)}
                    </pre>
                  )}
                  {results.config.error && (
                    <p className="mt-2 text-sm text-red-500">{results.config.error}</p>
                  )}
                </div>
              )}

              {/* Auth Test */}
              {results.auth && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {results.auth.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-semibold">Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{results.auth.message}</p>
                  {results.auth.error && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-red-500">Error: {results.auth.error}</p>
                      {results.auth.code && (
                        <p className="text-xs text-red-500">Code: {results.auth.code}</p>
                      )}
                      {results.auth.code === 'auth/operation-not-allowed' && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs text-yellow-800">
                            <strong>Fix:</strong> Enable Email/Password authentication in Firebase Console:
                            <br />
                            Authentication → Sign-in method → Email/Password → Enable
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Firestore Test */}
              {results.firestore && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {results.firestore.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="font-semibold">Firestore Database</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{results.firestore.message}</p>
                  {results.firestore.error && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-red-500">Error: {results.firestore.error}</p>
                      {results.firestore.code && (
                        <p className="text-xs text-red-500">Code: {results.firestore.code}</p>
                      )}
                      {(results.firestore.code === 'permission-denied' || 
                        results.firestore.error?.includes('permission')) && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs text-yellow-800">
                            <strong>Fix:</strong> Update Firestore security rules to allow writes:
                            <br />
                            Firestore Database → Rules → Use test mode or update rules
                          </p>
                        </div>
                      )}
                      {results.firestore.error?.includes('not found') && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs text-yellow-800">
                            <strong>Fix:</strong> Create Firestore database:
                            <br />
                            Firestore Database → Create database → Test mode
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> This test creates and immediately deletes temporary data. 
              If all tests pass, your Firebase setup is correct and registration should work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
