import { computed, Injectable, signal } from '@angular/core';
import {
  BarChart3,
  Box,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-angular';
import { hasPermission, UserRole } from '../../models/auth/user-role.model';
import type {
  FooterLinkGroup,
  NavigationUser,
  NavItem,
  PublicNavItem,
} from '../../models/navigation/navigation.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly currentUser = signal<NavigationUser | null>(null);
  private readonly featureFlags = signal<Set<string>>(new Set());
  private readonly badgeCounts = signal<Record<string, number | string>>({});

  private readonly allNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'NAV.DASHBOARD',
      icon: LayoutDashboard,
      route: '/dashboard',
      permissions: ['dashboard:view'],
      order: 1,
    },
    {
      id: 'pos',
      label: 'NAV.POS',
      icon: CreditCard,
      route: '/pos',
      permissions: ['pos:operate'],
      order: 2,
    },
    {
      id: 'inventory',
      label: 'NAV.INVENTORY',
      icon: Package,
      route: '/inventory',
      permissions: ['inventory:view'],
      order: 3,
      children: [
        {
          id: 'inventory-products',
          label: 'NAV.INVENTORY_PRODUCTS',
          icon: Box,
          route: '/inventory/products',
          permissions: ['inventory:view'],
        },
        {
          id: 'inventory-stock',
          label: 'NAV.INVENTORY_STOCK',
          icon: ClipboardList,
          route: '/inventory/stock',
          permissions: ['inventory:view'],
        },
      ],
    },
    {
      id: 'orders',
      label: 'NAV.ORDERS',
      icon: ShoppingCart,
      route: '/orders',
      permissions: ['orders:view'],
      order: 4,
    },
    {
      id: 'reports',
      label: 'NAV.REPORTS',
      icon: BarChart3,
      route: '/reports',
      permissions: ['reports:view'],
      order: 5,
      featureFlag: 'reports-module',
    },
    {
      id: 'users',
      label: 'NAV.USERS',
      icon: Users,
      route: '/users',
      permissions: ['users:view'],
      order: 6,
      roles: [UserRole.OWNER, UserRole.MANAGER],
    },
    {
      id: 'settings',
      label: 'NAV.SETTINGS',
      icon: Settings,
      route: '/settings',
      permissions: ['settings:view'],
      order: 10,
    },
  ];

  private readonly publicNavItems: PublicNavItem[] = [
    { id: 'features', label: 'NAV.PUBLIC.FEATURES', href: '/#features', order: 1 },
    { id: 'pricing', label: 'NAV.PUBLIC.PRICING', href: '/pricing', order: 2 },
    { id: 'about', label: 'NAV.PUBLIC.ABOUT', href: '/about', order: 3 },
    { id: 'contact', label: 'NAV.PUBLIC.CONTACT', href: '/contact', order: 4 },
  ];

  private readonly footerLinksData: FooterLinkGroup[] = [
    {
      title: 'FOOTER.PRODUCT',
      links: [
        { label: 'FOOTER.FEATURES', href: '/#features' },
        { label: 'FOOTER.PRICING', href: '/pricing' },
        { label: 'FOOTER.DEMO', href: '/demo' },
      ],
    },
    {
      title: 'FOOTER.COMPANY',
      links: [
        { label: 'FOOTER.ABOUT', href: '/about' },
        { label: 'FOOTER.BLOG', href: '/blog' },
        { label: 'FOOTER.CAREERS', href: '/careers' },
      ],
    },
    {
      title: 'FOOTER.SUPPORT',
      links: [
        { label: 'FOOTER.HELP_CENTER', href: '/help' },
        { label: 'FOOTER.CONTACT', href: '/contact' },
        { label: 'FOOTER.STATUS', href: 'https://status.impulsa.app', external: true },
      ],
    },
    {
      title: 'FOOTER.LEGAL',
      links: [
        { label: 'FOOTER.PRIVACY', href: '/privacy' },
        { label: 'FOOTER.TERMS', href: '/terms' },
      ],
    },
  ];

  readonly navItems = computed(() => {
    const user = this.currentUser();
    if (!user?.role) return [];
    return this.filterNavItems(this.allNavItems, user.role);
  });

  readonly user = computed(() => this.currentUser());

  setUser(user: NavigationUser | null): void {
    this.currentUser.set(user);
  }

  getNavItemsForRole(role: UserRole): NavItem[] {
    return this.filterNavItems(this.allNavItems, role);
  }

  getPublicNavItems(): PublicNavItem[] {
    return [...this.publicNavItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getFooterLinks(): FooterLinkGroup[] {
    return this.footerLinksData;
  }

  setBadge(itemId: string, value: number | string | undefined): void {
    this.badgeCounts.update((counts) => {
      const updated = { ...counts };
      if (value === undefined) {
        delete updated[itemId];
      } else {
        updated[itemId] = value;
      }
      return updated;
    });
  }

  enableFeature(flag: string): void {
    this.featureFlags.update((flags) => new Set(flags).add(flag));
  }

  disableFeature(flag: string): void {
    this.featureFlags.update((flags) => {
      const updated = new Set(flags);
      updated.delete(flag);
      return updated;
    });
  }

  private filterNavItems(items: NavItem[], role: UserRole): NavItem[] {
    const flags = this.featureFlags();
    const badges = this.badgeCounts();

    return items
      .filter((item) => this.canAccessItem(item, role, flags))
      .map((item) => ({
        ...item,
        badge: badges[item.id] ?? item.badge,
        children: item.children ? this.filterNavItems(item.children, role) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  private canAccessItem(item: NavItem, role: UserRole, flags: Set<string>): boolean {
    if (item.featureFlag && !flags.has(item.featureFlag)) {
      return false;
    }

    if (item.roles && item.roles.length > 0 && !item.roles.includes(role)) {
      return false;
    }

    if (item.permissions && item.permissions.length > 0) {
      return item.permissions.some((perm) => hasPermission(role, perm));
    }

    return true;
  }
}
