import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { type LucideIconData, Package } from 'lucide-angular';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'ui-empty-state',
  imports: [IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <!-- Icon -->
      <div [class]="iconClasses()">
        <ui-icon [name]="icon()" [size]="iconSize()" />
      </div>

      <!-- Title -->
      @if (title()) {
        <h3 class="text-lg font-semibold text-gray-900 mt-4">{{ title() }}</h3>
      }

      <!-- Description -->
      @if (description()) {
        <p class="text-sm text-gray-500 mt-2 max-w-sm">{{ description() }}</p>
      }

      <!-- Action -->
      @if (actionLabel()) {
        <div class="mt-6">
          <ui-button [variant]="actionVariant()" (clicked)="action.emit()">
            @if (actionIcon()) {
              <ui-icon [name]="actionIcon()!" size="sm" class="mr-2" />
            }
            {{ actionLabel() }}
          </ui-button>
        </div>
      }

      <!-- Custom content -->
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  // Inputs
  icon = input<LucideIconData>(Package);
  iconSize = input<'lg' | 'xl'>('xl');
  title = input<string>('');
  description = input<string>('');
  actionLabel = input<string>('');
  actionIcon = input<LucideIconData | null>(null);
  actionVariant = input<'primary' | 'secondary' | 'outline'>('primary');
  compact = input(false);

  // Outputs
  action = output<void>();

  containerClasses = computed(() => {
    const base = 'flex flex-col items-center justify-center text-center';
    const padding = this.compact() ? 'py-8' : 'py-16';
    return `${base} ${padding}`;
  });

  iconClasses = computed(() => {
    const base = 'rounded-full flex items-center justify-center';
    const size = this.compact() ? 'w-16 h-16' : 'w-20 h-20';
    return `${base} ${size} bg-gray-100 text-gray-400`;
  });
}
