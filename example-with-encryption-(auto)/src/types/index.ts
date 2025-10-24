export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  password: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string; // user id
  createdBy: string; // user id
  createdAt: string;
  dueDate?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface Permission {
  canManageUsers: boolean;
  canManageTasks: boolean;
  canViewAllTasks: boolean;
  canViewAllUsers: boolean;
  canDeleteTasks: boolean;
  canDeleteUsers: boolean;
}