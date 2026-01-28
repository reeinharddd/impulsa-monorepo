import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class AppComponent {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}
