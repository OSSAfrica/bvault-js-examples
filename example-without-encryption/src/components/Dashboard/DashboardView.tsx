import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTasks, getUsers } from '@/utils/storage';
import { hasPermission } from '@/utils/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, Clock, TrendingUp } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const tasks = getTasks();
  const users = getUsers();

  const canViewAllTasks = hasPermission(user, 'canViewAllTasks');
  const canViewAllUsers = hasPermission(user, 'canViewAllUsers');

  const userTasks = canViewAllTasks 
    ? tasks 
    : tasks.filter(task => task.assignedTo === user?.id);

  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = userTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;

  const stats = [
    {
      title: 'Total Tasks',
      value: userTasks.length,
      description: canViewAllTasks ? 'All tasks in system' : 'Your assigned tasks',
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completedTasks,
      description: `${userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0}% completion rate`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      description: 'Currently active tasks',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  if (canViewAllUsers) {
    stats.push({
      title: 'Total Users',
      value: users.length,
      description: 'Registered users',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.username}! Here's what's happening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs text-muted-foreground">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest task activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500">{task.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
              {userTasks.length === 0 && (
                <p className="text-gray-500 text-sm">No tasks assigned to you yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Overview of task completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <span className="text-sm font-medium">{pendingTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${userTasks.length > 0 ? (pendingTasks / userTasks.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <span className="text-sm font-medium">{inProgressTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${userTasks.length > 0 ? (inProgressTasks / userTasks.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">{completedTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};