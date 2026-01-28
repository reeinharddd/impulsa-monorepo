import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { FileQuestion, Home } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule, ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-24">
      <div class="text-center">
        <div
          class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-brand-surface"
        >
          <ui-icon [name]="FileQuestion" size="xl" class="text-brand-primary" />
        </div>
        <h1 class="text-6xl font-extrabold text-brand-primary">404</h1>
        <h2 class="mt-4 text-2xl font-bold text-slate-900">
          {{ 'ERRORS.NOT_FOUND.TITLE' | translate }}
        </h2>
        <p class="mx-auto mt-4 max-w-md text-slate-600">
          {{ 'ERRORS.NOT_FOUND.MESSAGE' | translate }}
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ui-button variant="primary" size="lg" (clicked)="goHome()">
            <ui-icon [name]="Home" size="sm" class="mr-2" />
            {{ 'ERRORS.ACTIONS.GO_HOME' | translate }}
          </ui-button>
          <ui-button variant="outline" size="lg" (clicked)="goBack()">
            {{ 'ERRORS.ACTIONS.GO_BACK' | translate }}
          </ui-button>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected readonly FileQuestion = FileQuestion;
  protected readonly Home = Home;

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    history.back();
  }
}
