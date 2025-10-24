import {Task, User} from '@/types';
import {secureLocalStorage} from 'bvault-js';

const STORAGE_KEYS = {
    USERS: 'dashboard_users',
    TASKS: 'dashboard_tasks',
    CURRENT_USER: 'dashboard_current_user',
}

/**
 * An array of default user objects pre-defined in the system. Each user object
 * represents a user with a specific role and basic identification details.
 *
 * The array includes:
 * - An admin user with administrative privileges.
 * - A manager user with managerial rights.
 * - A regular user with basic access rights.
 *
 * Each user object contains the following properties:
 * - `id` (string): Unique identifier of the user.
 * - `username` (string): The username of the user.
 * - `email` (string): The email address of the user.
 * - `role` (string): The role assigned to the user, such as 'admin', 'manager', or 'user'.
 * - `password` (string): The password for the user account (stored in plain text for this example).
 * - `createdAt` (string): The ISO 8601 formatted timestamp when the user was created.
 *
 * This variable can be used as initial data to simulate user accounts in
 * applications, especially for development and testing purposes.
 */
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

/**
 * Represents the default list of tasks to be initialized in the system.
 *
 * Each task within the array is an object containing details about a specific task,
 * such as its unique identifier, title, description, current status, priority level,
 * user assignment, creator information, creation date, and due date.
 *
 * The `defaultTasks` variable is typically used as an initial data set to populate
 * the system with predefined tasks.
 *
 * @type {Task[]}
 */
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

/**
 * Initializes the local storage with default encrypted data for users and tasks
 * if they are not already present in the storage.
 *
 * @async
 */
export const initializeStorage = async () => {
    // Check if the users data is not present in the local storage
    if (!await secureLocalStorage.getItem(STORAGE_KEYS.USERS)) {
        // Store the default users data in the local storage
        await secureLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    // Check if the tasks data is not present in the local storage
    if (!await secureLocalStorage.getItem(STORAGE_KEYS.TASKS)) {
        // Store the default tasks data in the local storage
        await secureLocalStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
    }
};

/**
 * Retrieves the users data from the local storage.
 *
 * @async
 * @returns {Promise<User[]>} The array of user objects.
 */
export const getUsers = async (): Promise<User[]> => {
    const users = await secureLocalStorage.getItem(STORAGE_KEYS.USERS);
    // Parse the JSON string into an array of user objects
    return users ? JSON.parse(users) : [];
};

/**
 * Saves the users data to the local storage.
 *
 * @async
 * @param {User[]} users - The array of user objects to be saved.
 */
export const saveUsers = async (users: User[]) => {
    // Store the array of user objects as a JSON string in the local storage
    await secureLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Retrieves the tasks data from the local storage.
 *
 * @async
 * @returns {Promise<Task[]>} The array of task objects.
 */
export const getTasks = async (): Promise<Task[]> => {
    const tasks = await secureLocalStorage.getItem(STORAGE_KEYS.TASKS);
    // Parse the JSON string into an array of task objects
    return tasks ? JSON.parse(tasks) : [];
};

/**
 * Saves the tasks data to the local storage.
 *
 * @async
 * @param {Task[]} tasks - The array of task objects to be saved.
 */
export const saveTasks = async (tasks: Task[]) => {
    // Store the array of task objects as a JSON string in the local storage
    await secureLocalStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

/**
 * Retrieves the current user data from the local storage.
 *
 * @async
 * @returns {Promise<User | null>} The user object or null if not found.
 */
export const getCurrentUser = async (): Promise<User | null> => {
    const user = await secureLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    // Parse the JSON string into a user object or return null if not found
    return user ? JSON.parse(user) : null;
};

/**
 * Sets the current user data in the local storage.
 *
 * @async
 * @param {User | null} user - The user object to be saved or null to remove the data.
 */
export const setCurrentUser = async (user: User | null) => {
    if (user) {
        // Store the user object as a JSON string in the local storage
        await secureLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        // Remove the current user data from the local storage
        await secureLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};