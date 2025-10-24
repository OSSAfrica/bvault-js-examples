import {Permission, User} from '@/types';
import {decrypt, encrypt} from 'bvault-js';
import {Thumbmark} from '@thumbmarkjs/thumbmarkjs';

// Create a new instance of the Thumbmark class
const thumbmark = new Thumbmark();

// Retrieve the fingerprint from the Thumbmark instance asynchronously
// This operation is expected to be performed once, and the fingerprint can be cached for future use
const fingerprint = await thumbmark.get();

// Define the key used to store permissions in local storage
const PERMISSIONS_KEY = 'dashboard_permissions';


/**
 * Retrieves the permissions associated with a specified user role.
 *
 * This function attempts to fetch and decrypt user permissions stored in
 * local storage. If the decrypted permissions do not match the requested role
 * or if the decryption process fails, it computes the base permissions for the
 * given role. The computed permissions are then encrypted and stored in local storage
 * for future use.
 *
 * The function ensures secure storage and retrieval of user permissions by
 * using encryption mechanisms with salt and initialization vector (IV).
 *
 * @param {User['role']} role - The role of the user whose permissions
 * need to be retrieved.
 * @returns {Promise<Permission>} A promise resolving to the permissions
 * associated with the given role, either fetched from storage or recalculated.
 */
export const getPermissions = async (role: User['role']): Promise<Permission> => {
    try {
        // Try to get encrypted permissions from local storage
        const encryptedPermissions = localStorage.getItem(PERMISSIONS_KEY);

        // If encrypted permissions exist, try to decrypt them
        if (encryptedPermissions) {
            try {
                // Fetch the initialization vector (IV) and salt values associated with the encrypted permissions
                const iv = localStorage.getItem(`${PERMISSIONS_KEY}_iv`);
                const salt = localStorage.getItem(`${PERMISSIONS_KEY}_salt`);

                // Decrypt the stored permissions
                const decryptedPermissions = await decrypt(encryptedPermissions, fingerprint.thumbmark, iv!, salt!);

                // Parse the decrypted permissions into an object
                const parsedPermissions = JSON.parse(decryptedPermissions);

                // If the stored permissions match the requested role, return them
                if (parsedPermissions.role === role) {
                    return parsedPermissions.permissions;
                }
            } catch (error) {
                // Log any error that occurs during decryption
                console.error('Error decrypting permissions:', error);
            }
        }

        // If not found in storage or invalid, calculate permissions
        const permissions = getBasePermissions(role);

        // Store the permissions in local storage (encrypted)
        const permissionsData = JSON.stringify({
            role,
            permissions
        });

        // Encrypt the permissions data
        const {
            encryptedData: encryptedPermissionsData,
            iv: permissionsIV,
            salt: permissionsSalt
        } = await encrypt(permissionsData, fingerprint.thumbmark);

        // Store the encrypted permissions in local storage
        localStorage.setItem(PERMISSIONS_KEY, encryptedPermissionsData);
        localStorage.setItem(`${PERMISSIONS_KEY}_iv`, permissionsIV);
        localStorage.setItem(`${PERMISSIONS_KEY}_salt`, permissionsSalt);

        return permissions;
    } catch (error) {
        // Log any error that occurs during permission handling
        console.error('Error handling permissions:', error);
        return getBasePermissions(role); // Fallback to base permissions if encryption fails
    }
};

const getBasePermissions = (role: User['role']): Permission => {
    switch (role) {
        case 'admin':
            return {
                canManageUsers: true,
                canManageTasks: true,
                canViewAllTasks: true,
                canViewAllUsers: true,
                canDeleteTasks: true,
                canDeleteUsers: true,
            };
        case 'manager':
            return {
                canManageUsers: false,
                canManageTasks: true,
                canViewAllTasks: true,
                canViewAllUsers: true,
                canDeleteTasks: true,
                canDeleteUsers: false,
            };
        case 'user':
            return {
                canManageUsers: false,
                canManageTasks: false,
                canViewAllTasks: false,
                canViewAllUsers: false,
                canDeleteTasks: false,
                canDeleteUsers: false,
            };
        default:
            return {
                canManageUsers: false,
                canManageTasks: false,
                canViewAllTasks: false,
                canViewAllUsers: false,
                canDeleteTasks: false,
                canDeleteUsers: false,
            };
    }
};

export const hasPermission = async (user: User | null, permission: keyof Permission): Promise<boolean> => {
    if (!user) return false;
    const permissions = await getPermissions(user.role);
    return permissions[permission];
};

// Optional: Clear permissions when user logs out
export const clearPermissions = () => {
    localStorage.removeItem(PERMISSIONS_KEY);
    localStorage.removeItem(`${PERMISSIONS_KEY}_iv`);
    localStorage.removeItem(`${PERMISSIONS_KEY}_salt`);
};