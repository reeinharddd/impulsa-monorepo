import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../organisms/footer/footer.component';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';

@Component({
  selector: 'layout-public',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './public-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  appName = input<string>('Impulsa');
  logoInitial = input<string>('I');
  tagline = input<string>('COMMON.TAGLINE');
  showFooter = input(true);
}
