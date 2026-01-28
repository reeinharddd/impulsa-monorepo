import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import type { FooterLinkGroup, PublicNavItem } from '@core/models/navigation/navigation.model';
import { NavigationService } from '@core/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { Menu, X } from 'lucide-angular';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'layout-public',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, IconComponent],
  templateUrl: './public-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  protected readonly MenuIcon = Menu;
  protected readonly CloseIcon = X;

  private readonly navigationService = inject(NavigationService);
  private readonly destroyRef = inject(DestroyRef);

  appName = input<string>('Impulsa');
  logoInitial = input<string>('I');
  tagline = input<string>('COMMON.TAGLINE');
  showFooter = input(true);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly navItems = computed<PublicNavItem[]>(() =>
    this.navigationService.getPublicNavItems(),
  );

  protected readonly footerLinks = computed<FooterLinkGroup[]>(() =>
    this.navigationService.getFooterLinks(),
  );

  constructor() {
    afterNextRender(() => {
      fromEvent(window, 'scroll')
        .pipe(
          startWith(null),
          map(() => window.scrollY > 10),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((isScrolled) => this.scrolled.set(isScrolled));
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
