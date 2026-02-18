import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { initializeRooms } from '@/utils/initializeRooms';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupRooms() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInitialize = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await initializeRooms();
      setResult(response);
      
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to initialize rooms');
      setResult({ success: false, message: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Room Setup</h1>
          <p className="text-muted-foreground mt-1">Initialize the hotel with 17 rooms</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Initialize Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will create 17 rooms in your database with the following configuration:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>Rooms 1-10: Single rooms at ₹1000/night</li>
                <li>Rooms 11-17: Double rooms at ₹1500/night</li>
                <li>All rooms start with "Available" status</li>
                <li>Rooms are distributed across 3 floors</li>
                <li>All rooms include: WiFi, TV, AC, Bathroom</li>
              </ul>
            </div>

            {result && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleInitialize} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Initialize 17 Rooms'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Note: If rooms already exist, this operation will not create duplicates.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This is a one-time setup. After initialization, you can manage rooms from the "Rooms" page. 
              Room status will automatically update based on bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
