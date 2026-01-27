import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Mobile Overlay -->
      <div
        *ngIf="isSidebarOpen()"
        class="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
        (click)="toggleSidebar()"
      ></div>

      <!-- Sidebar (Navigation) -->
      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0"
        [class.translate-x-0]="isSidebarOpen()"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <!-- Logo Area -->
        <div class="flex h-16 items-center border-b border-gray-100 px-6">
          <div class="flex items-center gap-3">
            <div
              class="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold"
            >
              I
            </div>
            <span class="text-xl font-bold tracking-tight text-gray-900">Impulsa</span>
          </div>
        </div>

        <!-- Build Info (Temporary for Dev) -->
        <div class="px-6 py-2 text-xs text-brand-secondary font-medium bg-green-50">
          Versión Alpha 0.1
        </div>

        <!-- Navigation Links -->
        <nav class="mt-6 flex flex-col gap-1 px-3">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <!-- Icon Mockup -->
            <span class="h-5 w-5 rounded-full border-2 border-current opacity-60"></span>
            Dashboard
          </a>

          <a
            routerLink="/pos"
            routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <span class="h-5 w-5 rounded-full border-2 border-current opacity-60"></span>
            Venta (POS)
          </a>

          <a
            routerLink="/inventory"
            routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <span class="h-5 w-5 rounded-full border-2 border-current opacity-60"></span>
            Inventario
          </a>

          <a
            routerLink="/orders"
            routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <span class="h-5 w-5 rounded-full border-2 border-current opacity-60"></span>
            Pedidos
          </a>

          <a
            routerLink="/settings"
            routerLinkActive="bg-brand-surface text-brand-primary font-semibold"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <span class="h-5 w-5 rounded-full border-2 border-current opacity-60"></span>
            Configuración
          </a>
        </nav>

        <!-- User Profile (Bottom) -->
        <div class="absolute bottom-0 left-0 w-full border-t border-gray-100 bg-white p-4">
          <div class="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 cursor-pointer">
            <div
              class="h-10 w-10 rounded-full bg-brand-surface text-brand-primary flex items-center justify-center font-bold"
            >
              JM
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-900">Juan Merchant</span>
              <span class="text-xs text-gray-500">Mi Negocio v1</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Top Header (Mobile Only / Minimal Desktop) -->
        <header
          class="flex h-16 items-center justify-between bg-white px-6 border-b border-gray-100 lg:hidden"
        >
          <button (click)="toggleSidebar()" class="text-gray-600 focus:outline-none">
            <span class="text-2xl">☰</span>
          </button>
          <span class="font-bold text-gray-900">Impulsa</span>
          <div class="w-8"></div>
          <!-- Spacer -->
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-4 lg:p-8">
          <div class="mx-auto max-w-6xl">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }
}
