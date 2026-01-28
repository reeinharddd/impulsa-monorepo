import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [],
})
export class App {
  protected readonly title = signal('merchant-web');

  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }
}
