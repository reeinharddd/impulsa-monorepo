import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChevronDown, type LucideIconData, Menu } from 'lucide-angular';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar.component';

export interface HeaderUser {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
}

export interface HeaderAction {
  id: string;
  icon: LucideIconData;
  label: string;
  badge?: number;
}

@Component({
  selector: 'ui-header',
  imports: [IconComponent, AvatarComponent, SearchBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header [class]="headerClasses()">
      <!-- Left section -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu button -->
        @if (showMenuButton()) {
          <button
            type="button"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            (click)="menuToggle.emit()"
          >
            <ui-icon [name]="MenuIcon" size="md" />
          </button>
        }

        <!-- Title / Breadcrumb -->
        <div>
          @if (title()) {
            <h1 class="text-xl font-bold text-gray-900">{{ title() }}</h1>
          }
          @if (subtitle()) {
            <p class="text-sm text-gray-500">{{ subtitle() }}</p>
          }
        </div>
      </div>

      <!-- Center section - Search -->
      @if (showSearch()) {
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <ui-search-bar [placeholder]="searchPlaceholder()" (search)="search.emit($event)" />
        </div>
      }

      <!-- Right section -->
      <div class="flex items-center gap-3">
        <!-- Actions -->
        @for (action of actions(); track action.id) {
          <button
            type="button"
            class="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            [title]="action.label"
            (click)="actionClick.emit(action.id)"
          >
            <ui-icon [name]="action.icon" size="md" />
            @if (action.badge && action.badge > 0) {
              <span
                class="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full"
              >
                {{ action.badge > 9 ? '9+' : action.badge }}
              </span>
            }
          </button>
        }

        <!-- Divider -->
        @if (user()) {
          <div class="w-px h-8 bg-gray-200 mx-2"></div>
        }

        <!-- User menu -->
        @if (user()) {
          <button
            type="button"
            class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
            (click)="userClick.emit()"
          >
            <ui-avatar [src]="user()!.avatar || ''" [initials]="user()!.initials || ''" size="sm" />
            <div class="hidden sm:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ user()!.name }}</p>
              @if (user()!.email) {
                <p class="text-xs text-gray-500 truncate max-w-32">{{ user()!.email }}</p>
              }
            </div>
            <ui-icon [name]="ChevronDownIcon" size="sm" class="text-gray-400 hidden sm:block" />
          </button>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  // Icons
  protected readonly MenuIcon = Menu;
  protected readonly ChevronDownIcon = ChevronDown;

  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  showMenuButton = input(true);
  showSearch = input(false);
  searchPlaceholder = input<string>('Buscar...');
  user = input<HeaderUser | null>(null);
  actions = input<HeaderAction[]>([]);
  sticky = input(true);

  // Outputs
  menuToggle = output<void>();
  search = output<string>();
  actionClick = output<string>();
  userClick = output<void>();

  headerClasses = computed(() => {
    const base =
      'flex items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-gray-200';

    const sticky = this.sticky() ? 'sticky top-0 z-10' : '';

    return `${base} ${sticky}`;
  });
}
