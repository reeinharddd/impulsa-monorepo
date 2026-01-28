import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'ui-avatar',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="avatarClasses()">
      @if (src()) {
        <img [src]="src()" [alt]="alt()" class="w-full h-full object-cover" />
      } @else if (initials()) {
        <span [class]="initialsClasses()">{{ initials() }}</span>
      } @else {
        <svg class="w-3/5 h-3/5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      }

      @if (status()) {
        <span [class]="statusClasses()"></span>
      }
    </div>
  `,
})
export class AvatarComponent {
  src = input<string>('');
  alt = input<string>('Avatar');
  initials = input<string>('');
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  status = input<'online' | 'offline' | 'busy' | ''>('');

  avatarClasses = computed(() => {
    const base = 'relative inline-flex items-center justify-center bg-gray-100 overflow-hidden';

    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const shapes: Record<AvatarShape, string> = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    };

    return `${base} ${sizes[this.size()]} ${shapes[this.shape()]}`;
  });

  initialsClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    return `${sizes[this.size()]} font-medium text-gray-600 uppercase`;
  });

  statusClasses = computed(() => {
    const base = 'absolute bottom-0 right-0 block rounded-full ring-2 ring-white';

    const sizes: Record<AvatarSize, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    const statusColors: Record<string, string> = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
    };

    return `${base} ${sizes[this.size()]} ${statusColors[this.status()] || ''}`;
  });
}
