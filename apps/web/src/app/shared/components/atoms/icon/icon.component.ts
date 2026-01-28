import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type LucideIconData, LucideAngularModule } from 'lucide-angular';

// Re-export common icons for convenience
export {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Cloud,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  FileQuestion,
  Home,
  Info,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  Settings,
  ShieldX,
  ShoppingCart,
  Trash,
  TriangleAlert,
  User,
  X,
} from 'lucide-angular';

// Export type for consumers
export type { LucideIconData };

/**
 * Icon sizes mapped to pixel values
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon Atom - Uses Lucide Icons library
 *
 * Import icons from 'lucide-angular' or from this component's re-exports
 * and pass them to the [name] input.
 *
 * @example
 * ```typescript
 * import { Home, Settings, Search } from 'lucide-angular';
 * // Or from this component:
 * // import { Home, Settings, Search } from './icon.component';
 *
 * export class MyComponent {
 *   protected readonly Home = Home;
 *   protected readonly Settings = Settings;
 * }
 * ```
 *
 * ```html
 * <ui-icon [name]="Home" size="md" />
 * <ui-icon [name]="Settings" size="lg" class="text-brand-primary" />
 * ```
 *
 * @see https://lucide.dev/icons/ for available icons (2000+)
 */
@Component({
  selector: 'ui-icon',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lucide-icon [img]="name()" [size]="sizeInPixels()" [strokeWidth]="strokeWidth()" />
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `,
})
export class IconComponent {
  /**
   * The Lucide icon to display.
   * Import icons from 'lucide-angular' and pass the icon object.
   */
  name = input.required<LucideIconData>();

  /**
   * Size of the icon
   * - xs: 12px
   * - sm: 16px
   * - md: 20px (default)
   * - lg: 24px
   * - xl: 32px
   */
  size = input<IconSize>('md');

  /**
   * Stroke width of the icon (default: 2)
   */
  strokeWidth = input<number>(2);

  /**
   * Convert size to pixels for Lucide
   */
  protected sizeInPixels = computed(() => {
    const sizes: Record<IconSize, number> = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    };
    return sizes[this.size()];
  });
}
