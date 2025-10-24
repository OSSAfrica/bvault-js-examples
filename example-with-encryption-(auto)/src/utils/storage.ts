import { User, Task } from '@/types';
import {secureLocalStorage} from 'bvault-js';

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

export const initializeStorage = async() => {
  if (!await secureLocalStorage.getItem(STORAGE_KEYS.USERS)) {
    await secureLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!await secureLocalStorage.getItem(STORAGE_KEYS.TASKS)) {
    await secureLocalStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
  }
};

export const getUsers = async (): Promise<User[]> => {
  const users = await secureLocalStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = async (users: User[]) => {
  await secureLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getTasks = async (): Promise<Task[]> => {
  const tasks = await secureLocalStorage.getItem(STORAGE_KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = async (tasks: Task[]) => {
  await secureLocalStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = await secureLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = async (user: User | null) => {
  if (user) {
    await secureLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    await secureLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};