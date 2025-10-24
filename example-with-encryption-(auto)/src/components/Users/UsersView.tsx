import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';
import { getUsers, saveUsers } from '@/utils/storage';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import { AddUserDialog } from './AddUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const UsersView: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const canManageUsers = hasPermission(currentUser, 'canManageUsers');
  const canDeleteUsers = hasPermission(currentUser, 'canDeleteUsers');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await getUsers();
    setUsers(allUsers);
  };

  const handleAddUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setShowAddDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData: User) => {
    setLoading(true);
    try {
      const updatedUsers = users.map(u => u.id === userData.id ? userData : u);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setEditingUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("You cannot delete your own account");
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
    }
  };

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (!hasPermission(currentUser, 'canViewAllUsers')) {
    return (
      <Alert>
        <AlertDescription>
          You don't have permission to view this page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
        {canManageUsers && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.username}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                {user.lastLogin && (
                  <div>
                    <span className="font-medium">Last Login:</span>{' '}
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                )}
              </div>

              {canManageUsers && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {canDeleteUsers && user.id !== currentUser?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </CardContent>
        </Card>
      )}

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddUser}
        loading={loading}
      />

      {editingUser && (
        <EditUserDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onSubmit={handleEditUser}
          loading={loading}
        />
      )}
    </div>
  );
};