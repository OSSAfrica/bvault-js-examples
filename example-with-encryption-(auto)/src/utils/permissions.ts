import { User, Permission } from '@/types';

export const getPermissions = (role: User['role']): Permission => {
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

export const hasPermission = (user: User | null, permission: keyof Permission): boolean => {
  if (!user) return false;
  const permissions = getPermissions(user.role);
  return permissions[permission];
};