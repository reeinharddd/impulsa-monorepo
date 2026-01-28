import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { CardComponent } from '@shared/components/molecules/card/card.component';
import { Cloud, DollarSign, Package, type LucideIconData } from 'lucide-angular';

interface Feature {
  key: string;
  icon: LucideIconData;
  iconContainerClass: string;
}

@Component({
  selector: 'app-landing',
  imports: [NgClass, TranslateModule, ButtonComponent, IconComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  private readonly router = inject(Router);

  protected readonly features: Feature[] = [
    {
      key: 'POS',
      icon: DollarSign,
      iconContainerClass: 'bg-green-50 text-green-600 ring-green-100 group-hover:bg-green-100',
    },
    {
      key: 'INVENTORY',
      icon: Package,
      iconContainerClass: 'bg-orange-50 text-orange-600 ring-orange-100 group-hover:bg-orange-100',
    },
    {
      key: 'CLOUD',
      icon: Cloud,
      iconContainerClass:
        'bg-brand-surface text-brand-primary ring-purple-100 group-hover:bg-purple-100',
    },
  ];

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
