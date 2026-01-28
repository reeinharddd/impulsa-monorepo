import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { X } from 'lucide-angular';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { LoadingButtonComponent } from '../../molecules/loading-button/loading-button.component';

@Component({
  selector: 'ui-modal',
  imports: [IconComponent, ButtonComponent, LoadingButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="onBackdropClick()"
      ></div>

      <!-- Modal -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          [class]="modalClasses()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
        >
          <!-- Header -->
          @if (showHeader()) {
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 [id]="titleId" class="text-lg font-semibold text-gray-900">
                {{ title() }}
              </h3>
              @if (showCloseButton()) {
                <button
                  type="button"
                  class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  (click)="close()"
                >
                  <ui-icon [name]="XIcon" size="md" />
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div [class]="bodyClasses()">
            <ng-content />
          </div>

          <!-- Footer -->
          @if (showFooter()) {
            <div
              class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50"
            >
              <ng-content select="[modal-footer]" />
              @if (showDefaultActions()) {
                <ui-button variant="outline" (clicked)="close()">
                  {{ cancelText() }}
                </ui-button>
                <ui-loading-button
                  [variant]="confirmVariant()"
                  [loading]="loading()"
                  (clicked)="onConfirm()"
                >
                  {{ confirmText() }}
                </ui-loading-button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
  },
})
export class ModalComponent {
  // Icons
  protected readonly XIcon = X;

  // Inputs
  isOpen = input(false);
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  showHeader = input(true);
  showFooter = input(true);
  showCloseButton = input(true);
  showDefaultActions = input(true);
  closeOnBackdrop = input(true);
  closeOnEscape = input(true);
  loading = input(false);
  cancelText = input<string>('Cancelar');
  confirmText = input<string>('Confirmar');
  confirmVariant = input<'primary' | 'danger'>('primary');

  // Outputs
  openChange = output<boolean>();
  confirmed = output<void>();

  // Local
  titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

  modalClasses = computed(() => {
    const base =
      'relative bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] flex flex-col';

    const sizes: Record<string, string> = {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-md',
      lg: 'w-full max-w-lg',
      xl: 'w-full max-w-2xl',
      full: 'w-full max-w-[90vw]',
    };

    return `${base} ${sizes[this.size()]}`;
  });

  bodyClasses = computed(() => {
    const base = 'px-6 py-4 overflow-y-auto';
    const hasHeader = this.showHeader() ? '' : 'pt-6';
    const hasFooter = this.showFooter() ? '' : 'pb-6';
    return `${base} ${hasHeader} ${hasFooter}`;
  });

  close() {
    this.openChange.emit(false);
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  onEscapeKey() {
    if (this.closeOnEscape() && this.isOpen()) {
      this.close();
    }
  }

  onConfirm() {
    this.confirmed.emit();
  }
}
