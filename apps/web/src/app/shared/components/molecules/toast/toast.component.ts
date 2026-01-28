import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CircleCheck, CircleX, Info, type LucideIconData, TriangleAlert, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ui-toast',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="toastClasses()" role="alert">
      <!-- Icon -->
      <div [class]="iconClasses()">
        <ui-icon [name]="iconForVariant()" size="md" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        @if (title()) {
          <p class="text-sm font-semibold">{{ title() }}</p>
        }
        @if (message()) {
          <p class="text-sm opacity-90" [class.mt-0.5]="title()">{{ message() }}</p>
        }
      </div>

      <!-- Close button -->
      @if (dismissible()) {
        <button
          type="button"
          class="shrink-0 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
          (click)="dismiss.emit()"
        >
          <ui-icon [name]="XIcon" size="sm" />
        </button>
      }

      <!-- Action -->
      @if (actionLabel()) {
        <button
          type="button"
          class="shrink-0 text-sm font-semibold underline hover:no-underline"
          (click)="action.emit()"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class ToastComponent {
  // Icons
  protected readonly XIcon = X;

  // Inputs
  variant = input<ToastVariant>('info');
  title = input<string>('');
  message = input<string>('');
  dismissible = input(true);
  actionLabel = input<string>('');

  // Outputs
  dismiss = output<void>();
  action = output<void>();

  iconForVariant = computed((): LucideIconData => {
    const icons: Record<ToastVariant, LucideIconData> = {
      info: Info,
      success: CircleCheck,
      warning: TriangleAlert,
      error: CircleX,
    };
    return icons[this.variant()];
  });

  toastClasses = computed(() => {
    const base = 'flex items-start gap-3 p-4 rounded-xl shadow-lg border max-w-md w-full';

    const variants: Record<ToastVariant, string> = {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      error: 'bg-red-50 border-red-200 text-red-900',
    };

    return `${base} ${variants[this.variant()]}`;
  });

  iconClasses = computed(() => {
    const base = 'shrink-0 p-1 rounded-lg';

    const variants: Record<ToastVariant, string> = {
      info: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      error: 'bg-red-100 text-red-600',
    };

    return `${base} ${variants[this.variant()]}`;
  });
}
