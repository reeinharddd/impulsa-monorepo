export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  VIEWER = 'viewer',
}

export type Permission =
  | 'dashboard:view'
  | 'pos:operate'
  | 'inventory:view'
  | 'inventory:manage'
  | 'orders:view'
  | 'orders:manage'
  | 'reports:view'
  | 'reports:export'
  | 'settings:view'
  | 'settings:manage'
  | 'users:view'
  | 'users:manage'
  | 'billing:view'
  | 'billing:manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: [
    'dashboard:view',
    'pos:operate',
    'inventory:view',
    'inventory:manage',
    'orders:view',
    'orders:manage',
    'reports:view',
    'reports:export',
    'settings:view',
    'settings:manage',
    'users:view',
    'users:manage',
    'billing:view',
    'billing:manage',
  ],
  [UserRole.MANAGER]: [
    'dashboard:view',
    'pos:operate',
    'inventory:view',
    'inventory:manage',
    'orders:view',
    'orders:manage',
    'reports:view',
    'reports:export',
    'settings:view',
    'users:view',
  ],
  [UserRole.CASHIER]: ['dashboard:view', 'pos:operate', 'orders:view'],
  [UserRole.VIEWER]: ['dashboard:view', 'reports:view'],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
