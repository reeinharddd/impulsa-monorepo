import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationService } from '@core/services/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-footer',
  imports: [RouterLink, TranslateModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  appName = input.required<string>();
  logoInitial = input.required<string>();
  tagline = input.required<string>();

  private readonly navigationService = inject(NavigationService);

  protected readonly footerLinks = computed(() => this.navigationService.getFooterLinks());
  protected readonly currentYear = new Date().getFullYear();
}
