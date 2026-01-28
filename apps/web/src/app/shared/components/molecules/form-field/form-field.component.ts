import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import type { InputSize, InputType } from '../../atoms/input/input.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'ui-form-field',
  imports: [InputComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <ui-input
        [type]="type()"
        [size]="size()"
        [label]="label()"
        [placeholder]="placeholder()"
        [hint]="hint()"
        [error]="error()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [required]="required()"
        [clearable]="clearable()"
        [prefixIcon]="!!icon()"
        [(value)]="value"
      >
        @if (icon()) {
          <ui-icon prefix [name]="icon()!" size="sm" />
        }
      </ui-input>
    </div>
  `,
})
export class FormFieldComponent {
  // Pass-through inputs
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
  icon = input<LucideIconData | null>(null);

  // Two-way binding
  value = '';

  containerClasses = computed(() => 'w-full');
}
