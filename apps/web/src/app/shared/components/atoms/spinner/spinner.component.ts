import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'gray';

@Component({
  selector: 'ui-spinner',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" role="status" aria-label="Loading">
      <svg [class]="spinnerClasses()" viewBox="0 0 24 24" fill="none">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      @if (label()) {
        <span [class]="labelClasses()">{{ label() }}</span>
      }
    </div>
  `,
})
export class SpinnerComponent {
  size = input<SpinnerSize>('md');
  variant = input<SpinnerVariant>('primary');
  label = input<string>('');
  center = input(false);

  containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-2';
    const centered = this.center() ? 'justify-center w-full' : '';
    return `${base} ${centered}`;
  });

  spinnerClasses = computed(() => {
    const base = 'animate-spin';

    const sizes: Record<SpinnerSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const variants: Record<SpinnerVariant, string> = {
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      white: 'text-white',
      gray: 'text-gray-400',
    };

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]}`;
  });

  labelClasses = computed(() => {
    const sizes: Record<SpinnerSize, string> = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    return `${sizes[this.size()]} text-gray-600 font-medium`;
  });
}
