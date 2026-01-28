import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

@Component({
  selector: 'ui-skeleton',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div [class]="skeletonClasses()" [style]="skeletonStyles()"></div> `,
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('text');
  width = input<string>('100%');
  height = input<string>('');
  lines = input(1);
  animated = input(true);

  skeletonClasses = computed(() => {
    const base = 'bg-gray-200';
    const animation = this.animated() ? 'animate-pulse' : '';

    const variants: Record<SkeletonVariant, string> = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-xl',
    };

    return `${base} ${animation} ${variants[this.variant()]}`;
  });

  skeletonStyles = computed(() => {
    const v = this.variant();
    let height = this.height();

    if (!height) {
      if (v === 'text') height = '1em';
      else if (v === 'circular') height = this.width();
      else height = '100px';
    }

    return {
      width: this.width(),
      height,
    };
  });
}
