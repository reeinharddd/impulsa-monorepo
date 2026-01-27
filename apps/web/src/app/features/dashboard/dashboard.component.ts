import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">

      <!-- Welcome Header -->
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-gray-900">Hola, Juan 👋</h1>
        <p class="text-gray-500">Aquí está el resumen de tu negocio hoy.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Stat Card 1 -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500">Ventas Hoy</span>
              <span class="mt-1 text-2xl font-bold text-gray-900">$12,450</span>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <!-- Icon Placeholder -->
              <span class="font-bold">$</span>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs">
            <span class="font-medium text-green-600">+12%</span>
            <span class="ml-2 text-gray-400">vs ayer</span>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500">Pedidos</span>
              <span class="mt-1 text-2xl font-bold text-gray-900">24</span>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <span class="font-bold">#</span>
            </div>
          </div>
           <div class="mt-4 flex items-center text-xs">
            <span class="font-medium text-orange-600">3 pendientes</span>
            <span class="ml-2 text-gray-400">de preparar</span>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500">Inventario Bajo</span>
              <span class="mt-1 text-2xl font-bold text-gray-900">5</span>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <span class="font-bold">!</span>
            </div>
          </div>
          <div class="mt-4 text-xs text-orange-600 font-medium cursor-pointer hover:underline">
            Ver productos
          </div>
        </div>

      </div>

    </div>
  `
})
export class DashboardComponent {}
