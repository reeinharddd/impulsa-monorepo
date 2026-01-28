import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-badge',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses()">
      @if (dot()) {
        <span [class]="dotClasses()"></span>
      }
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  // Inputs
  variant = input<BadgeVariant>('default');
  size = input<BadgeSize>('md');
  rounded = input(false);
  dot = input(false);

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center font-medium';

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-brand-primary/10 text-brand-primary',
      secondary: 'bg-brand-secondary/10 text-brand-secondary',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };

    const sizes: Record<BadgeSize, string> = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-xs gap-1.5',
      lg: 'px-3 py-1.5 text-sm gap-2',
    };

    const radius = this.rounded() ? 'rounded-full' : 'rounded-md';

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${radius}`;
  });

  dotClasses = computed(() => {
    const base = 'w-1.5 h-1.5 rounded-full';

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-gray-500',
      primary: 'bg-brand-primary',
      secondary: 'bg-brand-secondary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    };

    return `${base} ${variants[this.variant()]}`;
  });
}
