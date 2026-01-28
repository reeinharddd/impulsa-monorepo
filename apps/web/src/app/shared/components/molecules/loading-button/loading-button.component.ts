import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { ButtonSize, ButtonVariant } from '../../atoms/button/button.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import type { SpinnerVariant } from '../../atoms/spinner/spinner.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

/**
 * Loading Button Molecule - Combines Button + Spinner atoms.
 * Use this when you need a button with loading state.
 * For simple buttons without loading, use ButtonComponent (atom) directly.
 */
@Component({
  selector: 'ui-loading-button',
  imports: [ButtonComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [fullWidth]="fullWidth()"
      (clicked)="handleClick($event)"
    >
      @if (loading()) {
        <ui-spinner [size]="spinnerSize()" [variant]="spinnerVariant()" class="-ml-1 mr-2" />
      }
      <ng-content />
    </ui-button>
  `,
})
export class LoadingButtonComponent {
  // Inputs (passthrough to Button)
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  fullWidth = input(false);

  // Loading-specific input
  loading = input(false);

  // Outputs
  clicked = output<MouseEvent>();

  // Computed spinner size based on button size
  spinnerSize = computed(() => {
    const sizes: Record<ButtonSize, 'sm' | 'md'> = {
      sm: 'sm',
      md: 'sm',
      lg: 'md',
    };
    return sizes[this.size()];
  });

  // Computed spinner variant based on button variant
  spinnerVariant = computed((): SpinnerVariant => {
    const v = this.variant();
    if (v === 'outline' || v === 'ghost') return 'gray';
    return 'white';
  });

  handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;

    this.clicked.emit(event);
  }
}
