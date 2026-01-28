import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChevronLeft, X } from 'lucide-angular';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'layout-fullscreen',
  imports: [RouterOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-900 text-white flex flex-col">
      <!-- Header (optional) -->
      @if (showHeader()) {
        <header
          class="flex items-center justify-between h-14 px-4 bg-gray-800/50 backdrop-blur border-b border-gray-700"
        >
          <!-- Left side -->
          <div class="flex items-center gap-4">
            @if (showBackButton()) {
              <button
                type="button"
                class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                (click)="back.emit()"
              >
                <ui-icon [name]="ChevronLeftIcon" size="md" />
              </button>
            }
            @if (title()) {
              <h1 class="text-lg font-semibold">{{ title() }}</h1>
            }
          </div>

          <!-- Center -->
          <div class="flex-1 flex justify-center">
            <ng-content select="[header-center]" />
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-2">
            <ng-content select="[header-actions]" />
            @if (showCloseButton()) {
              <button
                type="button"
                class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                (click)="close.emit()"
              >
                <ui-icon [name]="XIcon" size="md" />
              </button>
            }
          </div>
        </header>
      }

      <!-- Main content -->
      <main [class]="mainClasses()">
        <router-outlet />
      </main>

      <!-- Footer (optional) -->
      @if (showFooter()) {
        <footer
          class="flex items-center justify-between h-16 px-4 bg-gray-800/50 backdrop-blur border-t border-gray-700"
        >
          <ng-content select="[footer-left]" />
          <ng-content select="[footer-center]" />
          <ng-content select="[footer-right]" />
        </footer>
      }
    </div>
  `,
})
export class FullscreenLayoutComponent {
  // Icons
  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly XIcon = X;

  // Inputs
  title = input<string>('');
  showHeader = input(true);
  showFooter = input(true);
  showBackButton = input(true);
  showCloseButton = input(true);
  padding = input<'none' | 'sm' | 'md'>('none');

  // Outputs
  back = output<void>();
  close = output<void>();

  mainClasses = computed(() => {
    const base = 'flex-1 overflow-auto';

    const paddings: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
    };

    return `${base} ${paddings[this.padding()]}`;
  });
}
