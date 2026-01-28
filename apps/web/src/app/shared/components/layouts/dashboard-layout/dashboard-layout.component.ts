import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import type { HeaderAction, HeaderUser } from '../../organisms/header/header.component';
import { HeaderComponent } from '../../organisms/header/header.component';
import type { NavItem, SidebarUser } from '../../organisms/sidebar/sidebar.component';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';

type ContentPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'layout-dashboard',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly destroyRef = inject(DestroyRef);

  appName = input<string>('Impulsa');
  logoInitial = input<string>('I');
  navItems = input.required<NavItem[]>();
  pageTitle = input<string>('');
  pageSubtitle = input<string>('');
  showSearch = input(false);
  searchPlaceholder = input<string>('COMMON.SEARCH_PLACEHOLDER');
  headerActions = input<HeaderAction[]>([]);
  contentPadding = input<ContentPadding>('md');
  user = input<(SidebarUser & HeaderUser) | null>(null);

  searchQuery = output<string>();
  actionClicked = output<string>();
  userClicked = output<void>();

  protected readonly sidebarOpen = signal(true);
  protected readonly isMobile = signal(false);

  protected readonly sidebarUser = computed((): SidebarUser | null => {
    const u = this.user();
    if (!u) return null;
    return {
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      initials: u.initials,
      role: u.role,
    };
  });

  protected readonly headerUser = computed((): HeaderUser | null => {
    const u = this.user();
    if (!u) return null;
    return {
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      initials: u.initials,
    };
  });

  protected readonly contentClasses = computed(() => {
    const paddings: Record<ContentPadding, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    return paddings[this.contentPadding()];
  });

  constructor() {
    afterNextRender(() => {
      fromEvent(window, 'resize')
        .pipe(
          startWith(null),
          debounceTime(100),
          map(() => window.innerWidth < 1024),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((mobile) => {
          this.isMobile.set(mobile);
          if (mobile) {
            this.sidebarOpen.set(false);
          }
        });
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
}
