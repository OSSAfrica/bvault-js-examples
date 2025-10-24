import {Task, User} from '@/types';
import {decrypt, encrypt} from 'bvault-js';
import {Thumbmark} from '@thumbmarkjs/thumbmarkjs';

const thumbmark = new Thumbmark();

const fingerprint = await thumbmark.get();


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

export const initializeStorage = async () => {
    // encrypting the data
    const {
        encryptedData: encryptedUserData,
        iv: userIV,
        salt: userSalt
    } = await encrypt(JSON.stringify(defaultUsers), fingerprint.thumbmark);
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        // storing encrypted data
        localStorage.setItem(STORAGE_KEYS.USERS, encryptedUserData);
        localStorage.setItem(`${STORAGE_KEYS.USERS}_salt`, userSalt);
        localStorage.setItem(`${STORAGE_KEYS.USERS}_iv`, userIV);
    }

    // encrypting the data
    const {
        encryptedData: encryptedTaskData,
        iv: taskIV,
        salt: taskSalt
    } = await encrypt(JSON.stringify(defaultTasks), fingerprint.thumbmark);
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        // storing encrypted data
        localStorage.setItem(STORAGE_KEYS.TASKS, encryptedTaskData);
        localStorage.setItem(`${STORAGE_KEYS.TASKS}_salt`, taskSalt);
        localStorage.setItem(`${STORAGE_KEYS.TASKS}_iv`, taskIV);
    }
};

export const getUsers = async (): Promise<User[]> => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);

    const iv = localStorage.getItem(`${STORAGE_KEYS.USERS}_iv`);
    const salt = localStorage.getItem(`${STORAGE_KEYS.USERS}_salt`);
    const decryptedUsers = await decrypt(users!, fingerprint.thumbmark, iv!, salt!);
    return decryptedUsers ? JSON.parse(decryptedUsers) : [];
};

export const saveUsers = async (users: User[]) => {
    const {
        encryptedData: encryptedUsersData,
        iv: userIV,
        salt: userSalt
    } = await encrypt(JSON.stringify(users), fingerprint.thumbmark);
    localStorage.setItem(STORAGE_KEYS.USERS, encryptedUsersData);
    localStorage.setItem(`${STORAGE_KEYS.USERS}_salt`, userSalt);
    localStorage.setItem(`${STORAGE_KEYS.USERS}_iv`, userIV);
};

export const getTasks = async (): Promise<Task[]> => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);

    const iv = localStorage.getItem(`${STORAGE_KEYS.TASKS}_iv`);
    const salt = localStorage.getItem(`${STORAGE_KEYS.TASKS}_salt`);
    const decryptedTasks = await decrypt(tasks!, fingerprint.thumbmark, iv!, salt!);

    return tasks ? JSON.parse(decryptedTasks) : [];
};

export const saveTasks = async (tasks: Task[]) => {
    const {
        encryptedData: encryptedTaskData,
        iv: taskIV,
        salt: taskSalt
    } = await encrypt(JSON.stringify(tasks), fingerprint.thumbmark);

    // storing encrypted data
    localStorage.setItem(STORAGE_KEYS.TASKS, encryptedTaskData);
    localStorage.setItem(`${STORAGE_KEYS.TASKS}_salt`, taskSalt);
    localStorage.setItem(`${STORAGE_KEYS.TASKS}_iv`, taskIV);
};

export const getCurrentUser = async (): Promise<User | null> => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!user) return null;
    const iv = localStorage.getItem(`${STORAGE_KEYS.CURRENT_USER}_iv`);
    const salt = localStorage.getItem(`${STORAGE_KEYS.CURRENT_USER}_salt`);
    const decryptedUser = await decrypt(user!, fingerprint.thumbmark, iv!, salt!);
    return decryptedUser ? JSON.parse(decryptedUser) : null;
};

export const setCurrentUser = async (user: User | null) => {
    if (user) {
        const {
            encryptedData: encryptedTaskData,
            iv: currentIV,
            salt: currentSalt
        } = await encrypt(JSON.stringify(user), fingerprint.thumbmark);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, encryptedTaskData);
        localStorage.setItem(`${STORAGE_KEYS.CURRENT_USER}_salt`, currentSalt);
        localStorage.setItem(`${STORAGE_KEYS.CURRENT_USER}_iv`, currentIV);
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(`${STORAGE_KEYS.CURRENT_USER}_salt`);
        localStorage.removeItem(`${STORAGE_KEYS.CURRENT_USER}_iv`);
    }
};