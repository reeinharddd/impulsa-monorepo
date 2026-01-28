import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-card',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()" (click)="handleClick($event)">
      @if (hasHeader()) {
        <div [class]="headerClasses()">
          <ng-content select="[card-header]" />
        </div>
      }

      <div [class]="bodyClasses()">
        <ng-content />
      </div>

      @if (hasFooter()) {
        <div [class]="footerClasses()">
          <ng-content select="[card-footer]" />
        </div>
      }
    </div>
  `,
})
export class CardComponent {
  // Inputs
  variant = input<CardVariant>('default');
  padding = input<CardPadding>('md');
  hoverable = input(false);
  clickable = input(false);
  hasHeader = input(false);
  hasFooter = input(false);

  // Outputs
  clicked = output<MouseEvent>();

  cardClasses = computed(() => {
    const base = 'rounded-xl transition-all duration-200 overflow-hidden';

    const variants: Record<CardVariant, string> = {
      default: 'bg-white border border-gray-200',
      outlined: 'bg-transparent border-2 border-gray-300',
      elevated: 'bg-white shadow-lg',
      ghost: 'bg-transparent',
    };

    const hover = this.hoverable() ? 'hover:shadow-md hover:border-gray-300' : '';
    const cursor = this.clickable() ? 'cursor-pointer' : '';

    return `${base} ${variants[this.variant()]} ${hover} ${cursor}`;
  });

  headerClasses = computed(() => {
    const paddings: Record<CardPadding, string> = {
      none: '',
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };

    return `border-b border-gray-100 ${paddings[this.padding()]}`;
  });

  bodyClasses = computed(() => {
    const paddings: Record<CardPadding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return paddings[this.padding()];
  });

  footerClasses = computed(() => {
    const paddings: Record<CardPadding, string> = {
      none: '',
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };

    return `border-t border-gray-100 bg-gray-50 ${paddings[this.padding()]}`;
  });

  handleClick(event: MouseEvent) {
    if (this.clickable()) {
      this.clicked.emit(event);
    }
  }
}
