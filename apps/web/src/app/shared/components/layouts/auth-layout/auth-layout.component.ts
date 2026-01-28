import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'layout-auth',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <!-- Left side - Branding (hidden on mobile) -->
      <div
        class="hidden lg:flex lg:w-1/2 bg-brand-primary relative overflow-hidden items-center justify-center"
      >
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center text-white px-12 max-w-lg">
          <!-- Logo -->
          <div
            class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
          >
            <span class="text-4xl font-bold">{{ logoInitial() }}</span>
          </div>

          <h1 class="text-4xl font-bold mb-4">{{ appName() }}</h1>
          <p class="text-xl text-white/80 mb-8">{{ tagline() }}</p>

          <!-- Features list -->
          @if (features().length > 0) {
            <div class="space-y-4 text-left">
              @for (feature of features(); track feature) {
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-white/90">{{ feature }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <!-- Mobile logo -->
          <div class="lg:hidden text-center mb-8">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-xl bg-brand-primary flex items-center justify-center"
            >
              <span class="text-2xl font-bold text-white">{{ logoInitial() }}</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">{{ appName() }}</h1>
          </div>

          <!-- Auth form slot -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <router-outlet />
          </div>

          <!-- Footer -->
          <div class="mt-8 text-center text-sm text-gray-500">
            <ng-content select="[auth-footer]" />
            @if (!hasFooterContent()) {
              <p>© {{ currentYear }} {{ appName() }}. Todos los derechos reservados.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  appName = input<string>('Impulsa');
  logoInitial = input<string>('I');
  tagline = input<string>('Gestiona tu negocio de forma inteligente');
  features = input<string[]>([
    'Punto de venta rápido y fácil',
    'Control de inventario en tiempo real',
    'Reportes y analytics',
    'Funciona sin internet',
  ]);
  hasFooterContent = input(false);

  currentYear = new Date().getFullYear();
}
