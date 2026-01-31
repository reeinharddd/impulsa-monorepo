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
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '@core/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { LogoComponent } from '@shared/components/atoms/logo/logo.component';
import { Menu, X } from 'lucide-angular';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'ui-navbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule, IconComponent, LogoComponent],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  appName = input.required<string>();

  // Icons
  protected readonly MenuIcon = Menu;
  protected readonly CloseIcon = X;

  private readonly navigationService = inject(NavigationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly navItems = computed(() => this.navigationService.getPublicNavItems());
  protected readonly mobileMenuOpen = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    afterNextRender(() => {
      fromEvent(window, 'scroll')
        .pipe(
          startWith(null), // Emit once to check initial scroll
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
