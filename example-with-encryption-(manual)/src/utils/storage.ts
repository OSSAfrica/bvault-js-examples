import {Task, User} from '@/types';
import {decrypt, encrypt} from 'bvault-js';
import {Thumbmark} from '@thumbmarkjs/thumbmarkjs';

// Create a new instance of the Thumbmark class
const thumbmark = new Thumbmark();

// Retrieve the fingerprint from the Thumbmark instance asynchronously
// This operation is expected to be performed once, and the fingerprint can be cached for future use
const fingerprint = await thumbmark.get();


const STORAGE_KEYS = {
    USERS: 'dashboard_users',
    TASKS: 'dashboard_tasks',
    CURRENT_USER: 'dashboard_current_user',
};


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
 * This function encrypts predefined default user and task data using a fingerprint
 * and stores the encrypted data, along with the associated initialization vector (IV)
 * and salt, into local storage.
 *
 * @async
 * @function initializeStorage
 * @throws {Error} Throws an error if encryption fails or an issue occurs during storage operations.
 */
export const initializeStorage = async () => {
    // Encrypting the default users data
    const {
        // The encrypted data
        encryptedData: encryptedUserData,
        // The initialization vector (IV)
        iv: userIV,
        // The salt value
        salt: userSalt
    } = await encrypt(JSON.stringify(defaultUsers), fingerprint.thumbmark);

    // If there are no users data in the local storage, store the encrypted data
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        // Store the encrypted users data in local storage
        localStorage.setItem(STORAGE_KEYS.USERS, encryptedUserData);
        // Store the salt value in local storage
        localStorage.setItem(`${STORAGE_KEYS.USERS}_salt`, userSalt);
        // Store the IV value in local storage
        localStorage.setItem(`${STORAGE_KEYS.USERS}_iv`, userIV);
    }

    // Encrypting the default tasks data
    const {
        // The encrypted data
        encryptedData: encryptedTaskData,
        // The initialization vector (IV)
        iv: taskIV,
        // The salt value
        salt: taskSalt
    } = await encrypt(JSON.stringify(defaultTasks), fingerprint.thumbmark);

    // If there are no tasks data in the local storage, store the encrypted data
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        // Store the encrypted tasks data in local storage
        localStorage.setItem(STORAGE_KEYS.TASKS, encryptedTaskData);
        // Store the salt value in local storage
        localStorage.setItem(`${STORAGE_KEYS.TASKS}_salt`, taskSalt);
        // Store the IV value in local storage
        localStorage.setItem(`${STORAGE_KEYS.TASKS}_iv`, taskIV);
    }
};


/**
 * Asynchronously retrieves a list of users from local storage.
 *
 * This function fetches encrypted user data along with associated initialization vector (IV)
 * and salt values from local storage. It decrypts the data using the provided fingerprint
 * thumbmark and then parses the decrypted data into an array of user objects.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of user objects.
 * If no users are found or decryption fails, an empty array is returned.
 */
export const getUsers = async (): Promise<User[]> => {
    // Get the encrypted users data from local storage
    const users = localStorage.getItem(STORAGE_KEYS.USERS);

    // Get the initialization vector (IV) and salt associated with the encrypted users data
    const iv = localStorage.getItem(`${STORAGE_KEYS.USERS}_iv`);
    const salt = localStorage.getItem(`${STORAGE_KEYS.USERS}_salt`);

    // Decrypt the encrypted users data using the provided fingerprint thumbmark and IV,
    // and salt values
    const decryptedUsers = await decrypt(users!, fingerprint.thumbmark, iv!, salt!);

    // If decryption is successful, parse the decrypted data into an array of user objects
    // and return it. If not, return an empty array.
    return decryptedUsers ? JSON.parse(decryptedUsers) : [];
};


/**
 * Asynchronously saves an array of users to local storage.
 *
 * This function encrypts the provided array of user objects using the provided fingerprint
 * thumbmark and stores the encrypted data along with associated initialization vector (IV)
 * and salt values in local storage.
 *
 * @param {User[]} users - The array of user objects to be saved.
 */
export const saveUsers = async (users: User[]) => {
    // Encrypt the array of user objects using the provided fingerprint thumbmark
    const {
        encryptedData: encryptedUsersData, // The encrypted data
        iv: userIV, // The initialization vector (IV)
        salt: userSalt // The salt value
    } = await encrypt(JSON.stringify(users), fingerprint.thumbmark);

    // Store the encrypted data in local storage
    localStorage.setItem(STORAGE_KEYS.USERS, encryptedUsersData);

    // Store the salt value in local storage
    localStorage.setItem(`${STORAGE_KEYS.USERS}_salt`, userSalt);

    // Store the IV value in local storage
    localStorage.setItem(`${STORAGE_KEYS.USERS}_iv`, userIV);
}


/**
 * Asynchronously retrieves a list of tasks from local storage.
 *
 * This function fetches encrypted task data along with associated initialization vector (IV)
 * and salt values from local storage. It decrypts the data using the provided fingerprint
 * thumbmark and then parses the decrypted data into an array of task objects.
 *
 * @returns {Promise<Task[]>} A promise that resolves to an array of task objects.
 * If no tasks are found or decryption fails, an empty array is returned.
 */
export const getTasks = async (): Promise<Task[]> => {
    // Get the encrypted tasks data from local storage
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);

    // Get the initialization vector (IV) and salt associated with the encrypted tasks data
    const iv = localStorage.getItem(`${STORAGE_KEYS.TASKS}_iv`);

    // Get the salt value associated with the encrypted tasks data
    const salt = localStorage.getItem(`${STORAGE_KEYS.TASKS}_salt`);

    // Decrypt the encrypted tasks data using the provided fingerprint thumbmark and IV,
    // and salt values
    const decryptedTasks = await decrypt(tasks!, fingerprint.thumbmark, iv!, salt!);

    // If decryption is successful, parse the decrypted data into an array of task objects
    // and return it. If not, return an empty array.
    return tasks ? JSON.parse(decryptedTasks) : [];
};


/**
 * Asynchronously saves an array of tasks securely by encrypting the data and storing it in local storage.
 *
 * @param {Task[]} tasks - The array of tasks to be saved.
 *
 * The tasks are encrypted using a cryptographic fingerprint and then stored in local storage along with their
 * corresponding encryption salt and initialization vector (IV). The function ensures task data secrecy
 * within the local storage mechanism.
 */
export const saveTasks = async (tasks: Task[]) => {
    // Encrypt the array of task objects using the provided fingerprint thumbmark
    const {
        // The encrypted data
        encryptedData: encryptedTaskData,
        // The initialization vector (IV)
        iv: taskIV,
        // The salt value
        salt: taskSalt
    } = await encrypt(JSON.stringify(tasks), fingerprint.thumbmark);

    // Store the encrypted data in local storage
    localStorage.setItem(STORAGE_KEYS.TASKS, encryptedTaskData);
    // Store the salt value in local storage
    localStorage.setItem(`${STORAGE_KEYS.TASKS}_salt`, taskSalt);
    // Store the IV value in local storage
    localStorage.setItem(`${STORAGE_KEYS.TASKS}_iv`, taskIV);
};


/**
 * Asynchronously retrieves the current user from local storage.
 *
 * This function fetches encrypted user data along with associated initialization vector (IV)
 * and salt values from local storage. It decrypts the data using the provided fingerprint
 * thumbmark and then parses the decrypted data into a user object.
 *
 * @returns {Promise<User | null>} A promise that resolves to a user object if found and decrypted successfully,
 * or null if no user is found or decryption fails.
 */
export const getCurrentUser = async (): Promise<User | null> => {
    // Retrieve the encrypted user data from local storage
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    // If no user is found, return null
    if (!user) return null;

    // Retrieve the initialization vector (IV) and salt associated with the encrypted user data
    const iv = localStorage.getItem(`${STORAGE_KEYS.CURRENT_USER}_iv`);
    const salt = localStorage.getItem(`${STORAGE_KEYS.CURRENT_USER}_salt`);

    // Decrypt the encrypted user data using the provided fingerprint thumbmark and IV,
    // and salt values
    const decryptedUser = await decrypt(user!, fingerprint.thumbmark, iv!, salt!);

    // If decryption is successful, parse the decrypted data into a user object
    // and return it. If not, return null.
    return decryptedUser ? JSON.parse(decryptedUser) : null;
};


/**
 * Asynchronously sets the current user in local storage.
 *
 * This function encrypts the provided user object using the provided fingerprint thumbmark
 * and stores the encrypted data along with associated initialization vector (IV) and salt values
 * in local storage. If the user is null, it removes the current user data from local storage.
 *
 * @param {User | null} user - The user object to be set as the current user, or null to clear the current user.
 */
export const setCurrentUser = async (user: User | null) => {
    // If user is provided, encrypt and store it in local storage
    if (user) {
        // Encrypt the user object using the provided fingerprint thumbmark
        const {
            encryptedData: encryptedTaskData, // The encrypted data
            iv: currentIV, // The initialization vector (IV)
            salt: currentSalt // The salt value
        } = await encrypt(JSON.stringify(user), fingerprint.thumbmark);

        // Store the encrypted data in local storage
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, encryptedTaskData);

        // Store the salt value in local storage
        localStorage.setItem(`${STORAGE_KEYS.CURRENT_USER}_salt`, currentSalt);

        // Store the IV value in local storage
        localStorage.setItem(`${STORAGE_KEYS.CURRENT_USER}_iv`, currentIV);
    }
    // If user is null, remove the current user data from local storage
    else {
        // Remove the current user data from local storage
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

        // Remove the salt value from local storage
        localStorage.removeItem(`${STORAGE_KEYS.CURRENT_USER}_salt`);

        // Remove the IV value from local storage
        localStorage.removeItem(`${STORAGE_KEYS.CURRENT_USER}_iv`);
    }
};