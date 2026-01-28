import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Search, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
  selector: 'ui-search-bar',
  imports: [IconComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <div class="relative">
        <!-- Search Icon -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          @if (loading()) {
            <ui-spinner size="sm" variant="gray" />
          } @else {
            <ui-icon [name]="SearchIcon" size="sm" class="text-gray-400" />
          }
        </div>

        <!-- Input -->
        <input
          type="search"
          [placeholder]="placeholder()"
          [value]="value()"
          [class]="inputClasses()"
          (input)="onInput($event)"
          (keydown.enter)="onSubmit()"
          (focus)="focused.set(true)"
          (blur)="focused.set(false)"
        />

        <!-- Clear button -->
        @if (value() && clearable()) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            (click)="clear()"
          >
            <ui-icon [name]="XIcon" size="sm" />
          </button>
        }
      </div>

      <!-- Search suggestions slot -->
      @if (showSuggestions() && focused()) {
        <div
          class="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-60 overflow-auto"
        >
          <ng-content select="[suggestions]" />
        </div>
      }
    </div>
  `,
})
export class SearchBarComponent {
  // Icons
  protected readonly SearchIcon = Search;
  protected readonly XIcon = X;

  // Inputs
  placeholder = input<string>('Buscar...');
  loading = input(false);
  clearable = input(true);
  showSuggestions = input(false);
  debounceMs = input(300);

  // Two-way binding
  value = model<string>('');

  // Outputs
  valueChange = output<string>();
  search = output<string>();

  // Local state
  focused = signal(false);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  containerClasses = computed(() => 'relative w-full');

  inputClasses = computed(() => {
    const base =
      'block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';

    const state = this.focused()
      ? 'border-brand-primary ring-2 ring-brand-primary/20'
      : 'border-gray-300 hover:border-gray-400';

    return `${base} ${state} bg-white`;
  });

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.valueChange.emit(target.value);

    // Debounced search
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.search.emit(target.value);
    }, this.debounceMs());
  }

  onSubmit() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.search.emit(this.value());
  }

  clear() {
    this.value.set('');
    this.valueChange.emit('');
    this.search.emit('');
  }
}
