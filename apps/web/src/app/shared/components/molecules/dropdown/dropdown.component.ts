import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { LucideIconData } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: LucideIconData;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

@Component({
  selector: 'ui-dropdown',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block text-left">
      <!-- Trigger -->
      <div (click)="toggle()">
        <ng-content select="[trigger]" />
      </div>

      <!-- Menu -->
      @if (isOpen()) {
        <div
          class="absolute z-50 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          [class.right-0]="align() === 'right'"
          [class.left-0]="align() === 'left'"
        >
          <div class="py-1">
            @for (item of items(); track item.id) {
              @if (item.divider) {
                <hr class="my-1 border-gray-100" />
              } @else {
                <button
                  type="button"
                  [disabled]="item.disabled"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  [class.text-gray-700]="!item.danger && !item.disabled"
                  [class.text-red-600]="item.danger"
                  [class.text-gray-400]="item.disabled"
                  [class.hover:bg-gray-50]="!item.disabled"
                  [class.cursor-not-allowed]="item.disabled"
                  (click)="selectItem(item)"
                >
                  @if (item.icon) {
                    <ui-icon [name]="item.icon" size="sm" />
                  }
                  {{ item.label }}
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class DropdownComponent {
  items = input.required<DropdownItem[]>();
  align = input<'left' | 'right'>('right');
  isOpen = input(false);

  selected = output<DropdownItem>();
  openChange = output<boolean>();

  private _isOpen = false;

  toggle() {
    this._isOpen = !this._isOpen;
    this.openChange.emit(this._isOpen);
  }

  close() {
    this._isOpen = false;
    this.openChange.emit(false);
  }

  selectItem(item: DropdownItem) {
    if (!item.disabled) {
      this.selected.emit(item);
      this.close();
    }
  }

  onDocumentClick(event: MouseEvent) {
    // Close on outside click - simplified version
  }
}
