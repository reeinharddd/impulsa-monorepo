import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * LogoComponent - Impulsa Logo/Icon Display
 *
 * Standalone component for displaying the Impulsa logo in various variants.
 * Automatically selects the appropriate SVG based on variant and type.
 *
 * @example
 * ```html
 * <!-- Icon only, light theme -->
 * <app-logo variant="light" type="icon" class="h-10 w-10" />
 *
 * <!-- Full logo with text, dark theme -->
 * <app-logo variant="dark" type="full" class="h-16 w-auto" />
 *
 * <!-- Monochrome icon -->
 * <app-logo variant="mono" type="icon" class="h-8 w-8" />
 * ```
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="logoSrc()"
      [alt]="altText()"
      [class]="'select-none ' + (class() || '')"
      draggable="false"
    />
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `,
  ],
})
export class LogoComponent {
  /**
   * Visual variant of the logo
   * - light: For light backgrounds (Deep Violet waves on Soft Lavender)
   * - dark: For dark backgrounds (Soft Lavender waves on Deep Violet)
   * - mono: Monochrome black (for print, documentation)
   */
  variant = signal<'light' | 'dark' | 'mono'>('light');
  @Input() set variantInput(value: 'light' | 'dark' | 'mono') {
    this.variant.set(value);
  }

  /**
   * Logo type
   * - full: Complete logo with "Impulsa" text
   * - icon: Symbol only (no text)
   */
  type = signal<'full' | 'icon'>('icon');
  @Input() set typeInput(value: 'full' | 'icon') {
    this.type.set(value);
  }

  /**
   * Additional CSS classes to apply
   */
  class = signal<string>('');
  @Input() set classInput(value: string) {
    this.class.set(value);
  }

  /**
   * Computed path to the logo SVG file
   */
  logoSrc = computed(() => {
    const variant = this.variant();
    const type = this.type();
    const prefix = type === 'full' ? 'logo' : 'icon';
    return `/assets/images/${prefix}-${variant}.svg`;
  });

  /**
   * Computed alt text for accessibility
   */
  altText = computed(() => {
    const type = this.type();
    const variant = this.variant();
    const typeText = type === 'full' ? 'Logo' : 'Icon';
    return `Impulsa ${typeText} (${variant} theme)`;
  });
}
