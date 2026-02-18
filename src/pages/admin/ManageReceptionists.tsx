import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useReceptionists } from '@/hooks/useReceptionists';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageReceptionists() {
  const { receptionists, loading, addReceptionist, updateReceptionist, deleteReceptionist } = useReceptionists();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateReceptionist(editingId, formData);
        toast.success('Receptionist updated successfully');
        setIsOpen(false);
        setFormData({ name: '', email: '', password: '' });
        setEditingId(null);
      } else {
        toast.info('Creating receptionist account...');
        await addReceptionist(formData);
        toast.success('Receptionist added successfully! You may need to refresh the page.');
        setIsOpen(false);
        setFormData({ name: '', email: '', password: '' });
        setEditingId(null);
        
        // Refresh the page to restore admin session
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error saving receptionist:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else {
        toast.error('Failed to save receptionist');
      }
    }
  };

  const handleEdit = (receptionist: any) => {
    setEditingId(receptionist.id);
    setFormData({
      name: receptionist.name,
      email: receptionist.email,
      password: ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this receptionist?')) {
      try {
        await deleteReceptionist(id);
        toast.success('Receptionist deleted successfully');
      } catch (error) {
        toast.error('Failed to delete receptionist');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Receptionists</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Receptionist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Receptionist</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!editingId}
                  />
                  {editingId && (
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingId}
                    placeholder={editingId ? 'Leave blank to keep current' : 'Min 6 characters'}
                    minLength={6}
                  />
                  {editingId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Password updates are not supported. Receptionist must reset their own password.
                    </p>
                  )}
                </div>
                {!editingId && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> After creating a receptionist, the page will refresh automatically. 
                      The receptionist can then login with the email and password you provide.
                    </p>
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {editingId ? 'Update' : 'Add'} Receptionist
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            receptionists.map((receptionist) => (
              <Card key={receptionist.id}>
                <CardHeader>
                  <CardTitle>{receptionist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{receptionist.email}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(receptionist)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(receptionist.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
