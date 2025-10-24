import { User, Permission } from '@/types';
import { encrypt, decrypt } from 'bvault-js';
import { Thumbmark } from '@thumbmarkjs/thumbmarkjs';

const thumbmark = new Thumbmark();
const fingerprint = await thumbmark.get();

const PERMISSIONS_KEY = 'dashboard_permissions';

export const getPermissions = async (role: User['role']): Promise<Permission> => {
  try {
    // Try to get encrypted permissions from local storage
    const encryptedPermissions = localStorage.getItem(PERMISSIONS_KEY);
    if (encryptedPermissions) {
      try {
        const iv = localStorage.getItem(`${PERMISSIONS_KEY}_iv`);
        const salt = localStorage.getItem(`${PERMISSIONS_KEY}_salt`);
        
        // Decrypt the stored permissions
        const decryptedPermissions = await decrypt(encryptedPermissions, fingerprint.thumbmark, iv!, salt!);
        const parsedPermissions = JSON.parse(decryptedPermissions);
        
        if (parsedPermissions.role === role) {
          return parsedPermissions.permissions;
        }
      } catch (error) {
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

    const {
      encryptedData: encryptedPermissionsData,
      iv: permissionsIV,
      salt: permissionsSalt
    } = await encrypt(permissionsData, fingerprint.thumbmark);

    localStorage.setItem(PERMISSIONS_KEY, encryptedPermissionsData);
    localStorage.setItem(`${PERMISSIONS_KEY}_iv`, permissionsIV);
    localStorage.setItem(`${PERMISSIONS_KEY}_salt`, permissionsSalt);

    return permissions;
  } catch (error) {
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