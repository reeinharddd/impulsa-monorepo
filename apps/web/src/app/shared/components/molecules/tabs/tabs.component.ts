import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'ui-tabs',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <!-- Tab List -->
      <div [class]="tabListClasses()" role="tablist">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="activeTab() === tab.id"
            [disabled]="tab.disabled"
            [class]="tabClasses(tab)"
            (click)="selectTab(tab)"
          >
            @if (tab.icon) {
              <ui-icon [name]="$any(tab.icon)" size="sm" />
            }
            <span>{{ tab.label }}</span>
            @if (tab.badge) {
              <span
                class="ml-2 px-2 py-0.5 text-xs rounded-full"
                [class.bg-brand-primary]="activeTab() === tab.id"
                [class.text-white]="activeTab() === tab.id"
                [class.bg-gray-200]="activeTab() !== tab.id"
                [class.text-gray-600]="activeTab() !== tab.id"
              >
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Tab Content -->
      <div class="mt-4" role="tabpanel">
        <ng-content />
      </div>
    </div>
  `,
})
export class TabsComponent {
  tabs = input.required<Tab[]>();
  defaultTab = input<string>('');
  variant = input<'default' | 'pills' | 'underline'>('default');

  tabChange = output<string>();

  activeTab = signal<string>('');

  constructor() {
    // Initialize with first tab or default
    setTimeout(() => {
      if (!this.activeTab()) {
        this.activeTab.set(this.defaultTab() || this.tabs()[0]?.id || '');
      }
    });
  }

  containerClasses = computed(() => 'w-full');

  tabListClasses = computed(() => {
    const variants = {
      default: 'flex gap-1 p-1 bg-gray-100 rounded-xl',
      pills: 'flex gap-2',
      underline: 'flex gap-6 border-b border-gray-200',
    };

    return variants[this.variant()];
  });

  tabClasses(tab: Tab) {
    const isActive = this.activeTab() === tab.id;
    const base = 'flex items-center gap-2 font-medium transition-all duration-200';

    const variants = {
      default: isActive
        ? 'px-4 py-2 rounded-lg bg-white text-gray-900 shadow-sm'
        : 'px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900',
      pills: isActive
        ? 'px-4 py-2 rounded-full bg-brand-primary text-white'
        : 'px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100',
      underline: isActive
        ? 'pb-3 text-brand-primary border-b-2 border-brand-primary -mb-px'
        : 'pb-3 text-gray-600 hover:text-gray-900',
    };

    const disabled = tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return `${base} ${variants[this.variant()]} ${disabled}`;
  }

  selectTab(tab: Tab) {
    if (!tab.disabled) {
      this.activeTab.set(tab.id);
      this.tabChange.emit(tab.id);
    }
  }
}
