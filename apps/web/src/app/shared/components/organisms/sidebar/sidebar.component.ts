import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChevronDown, type LucideIconData } from 'lucide-angular';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIconData;
  route: string;
  badge?: string | number;
  children?: NavItem[];
}

export interface SidebarUser {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: string;
}

@Component({
  selector: 'ui-sidebar',
  imports: [RouterLink, RouterLinkActive, IconComponent, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile overlay -->
    @if (isOpen() && isMobile()) {
      <div
        class="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
        (click)="close()"
      ></div>
    }

    <!-- Sidebar -->
    <aside
      [class]="sidebarClasses()"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center border-b border-gray-100 px-6">
        <div class="flex items-center gap-3">
          <div
            class="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-lg"
          >
            {{ logoInitial() }}
          </div>
          @if (!collapsed()) {
            <span class="text-xl font-bold tracking-tight text-gray-900">{{ appName() }}</span>
          }
        </div>
      </div>

      <!-- User section (optional) -->
      @if (user()) {
        <div class="px-4 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <ui-avatar
              [src]="user()!.avatar || ''"
              [initials]="user()!.initials || ''"
              size="md"
              status="online"
            />
            @if (!collapsed()) {
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ user()!.name }}</p>
                @if (user()!.role) {
                  <p class="text-xs text-gray-500 truncate">{{ user()!.role }}</p>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <ul class="space-y-1">
          @for (item of navItems(); track item.id) {
            <li>
              @if (item.children && item.children.length > 0) {
                <!-- Parent with children -->
                <button
                  type="button"
                  class="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  (click)="toggleExpanded(item.id)"
                >
                  <div class="flex items-center gap-3">
                    <ui-icon [name]="item.icon" size="md" class="opacity-70" />
                    @if (!collapsed()) {
                      <span>{{ item.label }}</span>
                    }
                  </div>
                  @if (!collapsed()) {
                    <ui-icon
                      [name]="ChevronDownIcon"
                      size="sm"
                      class="transition-transform"
                      [class.rotate-180]="isExpanded(item.id)"
                    />
                  }
                </button>

                @if (isExpanded(item.id) && !collapsed()) {
                  <ul class="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                    @for (child of item.children; track child.id) {
                      <li>
                        <a
                          [routerLink]="child.route"
                          routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
                          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          <ui-icon [name]="child.icon" size="sm" class="opacity-60" />
                          <span>{{ child.label }}</span>
                        </a>
                      </li>
                    }
                  </ul>
                }
              } @else {
                <!-- Single item -->
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
                  [routerLinkActiveOptions]="{ exact: item.route === '/' }"
                  class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  <ui-icon [name]="item.icon" size="md" class="opacity-70" />
                  @if (!collapsed()) {
                    <span class="flex-1">{{ item.label }}</span>
                    @if (item.badge) {
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary"
                      >
                        {{ item.badge }}
                      </span>
                    }
                  }
                </a>
              }
            </li>
          }
        </ul>
      </nav>

      <!-- Footer -->
      <div class="border-t border-gray-100 p-4">
        @if (!collapsed()) {
          <div class="text-xs text-gray-400 text-center">
            <ng-content select="[sidebar-footer]" />
          </div>
        }
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  // Icons
  protected readonly ChevronDownIcon = ChevronDown;

  // Inputs
  appName = input<string>('Impulsa');
  logoInitial = input<string>('I');
  navItems = input.required<NavItem[]>();
  user = input<SidebarUser | null>(null);
  isOpen = input(true);
  collapsed = input(false);
  isMobile = input(false);

  // Outputs
  openChange = output<boolean>();

  // Local state
  private expandedItems = signal<Set<string>>(new Set());

  sidebarClasses = computed(() => {
    const base =
      'fixed inset-y-0 left-0 z-30 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out lg:relative lg:translate-x-0';

    const width = this.collapsed() ? 'w-20' : 'w-64';

    return `${base} ${width}`;
  });

  isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  toggleExpanded(itemId: string) {
    const current = new Set(this.expandedItems());
    if (current.has(itemId)) {
      current.delete(itemId);
    } else {
      current.add(itemId);
    }
    this.expandedItems.set(current);
  }

  close() {
    this.openChange.emit(false);
  }
}
