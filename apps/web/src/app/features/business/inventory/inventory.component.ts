import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { MockApiService } from '../../../core/services/mock-api.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inventory-container">
      <header class="page-header">
        <h1>Inventario</h1>
        <button class="btn-primary" (click)="toggleAddMode()">
            {{ isAdding() ? 'Cancelar' : 'Nuevo Producto' }}
        </button>
      </header>

      @if (isAdding()) {
        <div class="add-product-form">
            <h3>Nuevo Producto</h3>
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" formControlName="name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Precio (Centavos)</label>
                        <input type="number" formControlName="priceCents">
                    </div>
                    <div class="form-group">
                        <label>Stock Inicial</label>
                        <input type="number" formControlName="stock">
                    </div>
                </div>
                <button type="submit" [disabled]="productForm.invalid" class="btn-save">Guardar</button>
            </form>
        </div>
      }

      <div class="products-list">
        @if (products().length === 0) {
            <p class="empty-state">No hay productos registrados.</p>
        }

        @for (product of products(); track product.id) {
            <div class="product-item" [class.inactive]="!product.active">
                <div class="product-info">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-price">{{ product.priceCents / 100 | currency }}</span>
                </div>
                <div class="product-meta">
                    <span class="stock-badge" [class.low-stock]="product.stock < 5">
                        Stock: {{ product.stock }}
                    </span>
                    <button class="btn-toggle" (click)="toggleActive(product)">
                        {{ product.active ? 'Desactivar' : 'Activar' }}
                    </button>
                </div>
            </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .inventory-container { padding: 1rem; }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .btn-primary {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
    }
    .add-product-form {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin-bottom: 2rem;
    }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
    }
    .btn-save {
        background: #059669;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    }
    .products-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .product-item {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #f3f4f6;
    }
    .product-item.inactive { opacity: 0.6; background: #f9fafb; }
    .product-name { font-weight: 600; display: block; }
    .product-price { color: #6b7280; font-size: 0.9rem; }
    .product-meta { display: flex; gap: 1rem; align-items: center; }
    .stock-badge {
        background: #eef2ff;
        color: #4338ca;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .stock-badge.low-stock { background: #fef2f2; color: #b91c1c; }
    .btn-toggle {
        background: #fff;
        border: 1px solid #d1d5db;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
    }
  `]
})
export class InventoryComponent {
  private mockApi = inject(MockApiService);
  private fb = inject(FormBuilder);

  isAdding = signal(false);
  products = signal<Product[]>(this.mockApi.listProducts());

  productForm = this.fb.group({
    name: ['', Validators.required],
    priceCents: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  // Since mockApi.listProducts returns a static array (not a signal yet in my implementation above, wait...)
  // In step 16, I implemented listProducts() returning `this._products()`.
  // However, `products` signal here won't auto-update unless I assume listProducts returns a reference or I use an effect/signal link.
  // The MockApiService exposes signals mostly internally but returns array snapshots.
  // I should probably fix MockApiService to expose readonly signals or just refresh manually.
  // For MVP speed, I will refresh manually on actions.

  constructor() {
      // Refresh list occasionally or after actions?
      // Actually, let's just create a computed or effect if possible, but the service returns value T.
      // I'll update the list manually after 'save'.
  }

  toggleAddMode() {
    this.isAdding.update(v => !v);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    this.mockApi.createProduct({
        name: val.name!,
        priceCents: val.priceCents!,
        stock: val.stock!,
        active: true
    });

    this.products.set(this.mockApi.listProducts()); // content refresh
    this.isAdding.set(false);
    this.productForm.reset({ priceCents: 0, stock: 0 });
  }

  toggleActive(product: Product) {
      this.mockApi.updateProduct(product.id, { active: !product.active });
      this.products.set(this.mockApi.listProducts());
  }
}
