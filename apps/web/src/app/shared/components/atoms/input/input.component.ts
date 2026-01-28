import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-input',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div [class]="containerClasses()">
      @if (label()) {
        <label [for]="inputId()" class="block text-sm font-medium text-gray-700 mb-1.5">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-0.5">*</span>
          }
        </label>
      }

      <div class="relative">
        @if (prefixIcon()) {
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
          >
            <ng-content select="[prefix]" />
          </div>
        }

        <input
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class]="inputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="focused.set(true)"
        />

        @if (suffixIcon()) {
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"
          >
            <ng-content select="[suffix]" />
          </div>
        }

        @if (clearable() && value()) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            (click)="clear()"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        }
      </div>

      @if (error()) {
        <p class="mt-1.5 text-sm text-red-600">{{ error() }}</p>
      } @else if (hint()) {
        <p class="mt-1.5 text-sm text-gray-500">{{ hint() }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  // Inputs
  type = input<InputType>('text');
  size = input<InputSize>('md');
  label = input<string>('');
  placeholder = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  disabled = input(false);
  readonly = input(false);
  required = input(false);
  clearable = input(false);
  prefixIcon = input(false);
  suffixIcon = input(false);
  inputId = input<string>(`input-${Math.random().toString(36).slice(2, 9)}`);

  // Two-way binding
  value = model<string>('');

  // Outputs
  valueChange = output<string>();
  blurred = output<void>();

  // Local state
  focused = signal(false);

  // Control Value Accessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  containerClasses = computed(() => {
    return 'w-full';
  });

  inputClasses = computed(() => {
    const base =
      'block w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';

    const sizes: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const states = this.error()
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500/20'
      : this.focused()
        ? 'border-brand-primary ring-2 ring-brand-primary/20'
        : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20';

    const disabled = this.disabled() ? 'bg-gray-50 cursor-not-allowed' : 'bg-white';

    const padding = this.prefixIcon() ? 'pl-10' : '';

    return `${base} ${sizes[this.size()]} ${states} ${disabled} ${padding}`;
  });

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
    this.valueChange.emit(target.value);
  }

  onBlur() {
    this.focused.set(false);
    this.onTouched();
    this.blurred.emit();
  }

  clear() {
    this.value.set('');
    this.onChange('');
    this.valueChange.emit('');
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }
}
