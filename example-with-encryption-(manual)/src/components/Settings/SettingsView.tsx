import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Clock } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <p className="text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="mt-1">
                <Badge variant={
                  user.role === 'admin' ? 'destructive' :
                  user.role === 'manager' ? 'default' : 'secondary'
                }>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Member Since</label>
              <p className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            {user.lastLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700">Last Login</label>
                <p className="text-gray-900">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>Your current role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage Users</span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Allowed' : 'Restricted'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manage Tasks</span>
                <Badge variant={user.role !== 'user' ? 'default' : 'secondary'}>
                  {user.role !== 'user' ? 'Allowed' : 'Restricted'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">View All Tasks</span>
                <Badge variant={user.role !== 'user' ? 'default' : 'secondary'}>
                  {user.role !== 'user' ? 'Allowed' : 'Restricted'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Delete Tasks</span>
                <Badge variant={user.role !== 'user' ? 'default' : 'secondary'}>
                  {user.role !== 'user' ? 'Allowed' : 'Restricted'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Delete Users</span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Allowed' : 'Restricted'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Application details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Application Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Storage</span>
              <span className="text-sm font-medium">Local Storage</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Session Type</span>
              <span className="text-sm font-medium">Browser Session</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};