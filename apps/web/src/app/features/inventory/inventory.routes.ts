import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  template: `<h2 class="text-xl">Inventario (Mockup List)</h2>`,
})
export class InventoryListComponent {}

export const INVENTORY_ROUTES: Routes = [{ path: '', component: InventoryListComponent }];
