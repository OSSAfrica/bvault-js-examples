import { User, Task } from '@/types';

const STORAGE_KEYS = {
  USERS: 'dashboard_users',
  TASKS: 'dashboard_tasks',
  CURRENT_USER: 'dashboard_current_user',
};

// Initialize with default admin user
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    role: 'manager',
    password: 'manager123',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    password: 'user123',
    createdAt: new Date().toISOString(),
  },
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Setup Database',
    description: 'Initialize the database schema and connections',
    status: 'completed',
    priority: 'high',
    assignedTo: '2',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Create API Documentation',
    description: 'Document all API endpoints and their usage',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: '3',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};