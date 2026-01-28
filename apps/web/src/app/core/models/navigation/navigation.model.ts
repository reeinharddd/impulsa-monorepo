import type { LucideIconData } from 'lucide-angular';
import type { Permission, UserRole } from '../auth/user-role.model';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIconData;
  route: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[];
  permissions?: Permission[];
  featureFlag?: string;
  order?: number;
}

export interface PublicNavItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
  order?: number;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: UserRole;
  businessName?: string;
}
