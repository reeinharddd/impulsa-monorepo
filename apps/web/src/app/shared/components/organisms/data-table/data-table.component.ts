import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ChevronDown, ChevronLeft, ChevronRight, Package } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => string;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'ui-data-table',
  imports: [CommonModule, IconComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <!-- Header -->
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              @if (selectable()) {
                <th class="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    [checked]="allSelected()"
                    [indeterminate]="someSelected()"
                    (change)="toggleSelectAll()"
                  />
                </th>
              }
              @for (column of columns(); track column.key) {
                <th
                  [class]="headerCellClasses(column)"
                  [style.width]="column.width"
                  (click)="column.sortable ? onSort(column.key) : null"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ column.label }}</span>
                    @if (column.sortable) {
                      <div class="flex flex-col">
                        <ui-icon
                          [name]="ChevronDownIcon"
                          size="xs"
                          [class.text-brand-primary]="
                            currentSort()?.key === column.key && currentSort()?.direction === 'asc'
                          "
                          [class.rotate-180]="true"
                          class="-mb-1"
                        />
                        <ui-icon
                          [name]="ChevronDownIcon"
                          size="xs"
                          [class.text-brand-primary]="
                            currentSort()?.key === column.key && currentSort()?.direction === 'desc'
                          "
                        />
                      </div>
                    }
                  </div>
                </th>
              }
              @if (hasActions()) {
                <th class="w-20 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Acciones
                </th>
              }
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-gray-100">
            @if (loading()) {
              <tr>
                <td [attr.colspan]="totalColumns()" class="py-12 text-center">
                  <ui-spinner size="lg" label="Cargando..." [center]="true" />
                </td>
              </tr>
            } @else if (data().length === 0) {
              <tr>
                <td [attr.colspan]="totalColumns()" class="py-12 text-center">
                  <div class="flex flex-col items-center gap-3 text-gray-400">
                    <ui-icon [name]="PackageIcon" size="xl" />
                    <p class="text-sm">{{ emptyMessage() }}</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of data(); track trackByFn()(row); let idx = $index) {
                <tr
                  class="transition-colors"
                  [class.hover:bg-gray-50]="hoverable()"
                  [class.bg-brand-surface]="isSelected(row)"
                  [class.cursor-pointer]="clickable()"
                  (click)="onRowClick(row)"
                >
                  @if (selectable()) {
                    <td class="px-4 py-3">
                      <input
                        type="checkbox"
                        class="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        [checked]="isSelected(row)"
                        (change)="toggleSelect(row)"
                        (click)="$event.stopPropagation()"
                      />
                    </td>
                  }
                  @for (column of columns(); track column.key) {
                    <td [class]="bodyCellClasses(column)">
                      <ng-container
                        *ngTemplateOutlet="
                          cellTemplate;
                          context: {
                            $implicit: getCellValue(row, column),
                            row: row,
                            column: column,
                          }
                        "
                      />
                    </td>
                  }
                  @if (hasActions()) {
                    <td class="px-4 py-3 text-right">
                      <ng-content select="[table-actions]" />
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (showPagination() && !loading() && data().length > 0) {
        <div
          class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50"
        >
          <div class="text-sm text-gray-600">
            Mostrando {{ startIndex() + 1 }} - {{ endIndex() }} de {{ totalItems() }}
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage() === 1"
              (click)="onPageChange(currentPage() - 1)"
            >
              <ui-icon [name]="ChevronLeftIcon" size="sm" />
            </button>
            <span class="px-3 py-1 text-sm font-medium">
              {{ currentPage() }} / {{ totalPages() }}
            </span>
            <button
              type="button"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage() === totalPages()"
              (click)="onPageChange(currentPage() + 1)"
            >
              <ui-icon [name]="ChevronRightIcon" size="sm" />
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Default cell template -->
    <ng-template #cellTemplate let-value let-row="row" let-column="column">
      {{ value }}
    </ng-template>
  `,
})
export class DataTableComponent<T extends Record<string, unknown>> {
  // Icons
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly PackageIcon = Package;

  // Inputs
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  loading = input(false);
  selectable = input(false);
  hoverable = input(true);
  clickable = input(false);
  hasActions = input(false);
  emptyMessage = input<string>('No hay datos disponibles');
  trackByFn = input<(item: T) => unknown>((item: T) => item);

  // Pagination inputs
  showPagination = input(false);
  currentPage = input(1);
  pageSize = input(10);
  totalItems = input(0);

  // Outputs
  rowClick = output<T>();
  selectionChange = output<T[]>();
  sortChange = output<TableSort>();
  pageChange = output<number>();

  // Local state
  selectedItems = signal<Set<unknown>>(new Set());
  currentSort = signal<TableSort | null>(null);

  totalColumns = computed(() => {
    let count = this.columns().length;
    if (this.selectable()) count++;
    if (this.hasActions()) count++;
    return count;
  });

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());

  endIndex = computed(() => Math.min(this.startIndex() + this.pageSize(), this.totalItems()));

  allSelected = computed(() => {
    const data = this.data();
    if (data.length === 0) return false;
    return data.every((row) => this.selectedItems().has(this.trackByFn()(row)));
  });

  someSelected = computed(() => {
    const data = this.data();
    if (data.length === 0) return false;
    const selectedCount = data.filter((row) =>
      this.selectedItems().has(this.trackByFn()(row)),
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  });

  headerCellClasses(column: TableColumn<T>): string {
    const base = 'px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider';
    const align =
      column.align === 'center'
        ? 'text-center'
        : column.align === 'right'
          ? 'text-right'
          : 'text-left';
    const sortable = column.sortable ? 'cursor-pointer hover:bg-gray-100' : '';
    return `${base} ${align} ${sortable}`;
  }

  bodyCellClasses(column: TableColumn<T>): string {
    const base = 'px-4 py-3 text-sm text-gray-900';
    const align =
      column.align === 'center'
        ? 'text-center'
        : column.align === 'right'
          ? 'text-right'
          : 'text-left';
    return `${base} ${align}`;
  }

  getCellValue(row: T, column: TableColumn<T>): string {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    return String(value ?? '');
  }

  isSelected(row: T): boolean {
    return this.selectedItems().has(this.trackByFn()(row));
  }

  toggleSelect(row: T) {
    const key = this.trackByFn()(row);
    const current = new Set(this.selectedItems());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.selectedItems.set(current);
    this.emitSelection();
  }

  toggleSelectAll() {
    const data = this.data();
    if (this.allSelected()) {
      this.selectedItems.set(new Set());
    } else {
      const allKeys = new Set(data.map((row) => this.trackByFn()(row)));
      this.selectedItems.set(allKeys);
    }
    this.emitSelection();
  }

  private emitSelection() {
    const selected = this.data().filter((row) => this.selectedItems().has(this.trackByFn()(row)));
    this.selectionChange.emit(selected);
  }

  onSort(key: string) {
    const current = this.currentSort();
    let direction: 'asc' | 'desc' = 'asc';
    if (current?.key === key) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }
    const sort: TableSort = { key, direction };
    this.currentSort.set(sort);
    this.sortChange.emit(sort);
  }

  onRowClick(row: T) {
    if (this.clickable()) {
      this.rowClick.emit(row);
    }
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
