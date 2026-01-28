import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SaleItem } from '@core/models/payment/sale.model';
import { Product } from '@core/models/product/product.model';
import { MockApiService } from '@core/services/auth/mock-api.service';

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sale-container">
      <div class="products-grid">
        <h2>Productos</h2>
        <div class="grid">
          @for (product of products(); track product.id) {
            <button
              class="product-card"
              [disabled]="!product.active || product.stock <= 0"
              (click)="addToCart(product)"
            >
              <div class="p-name">{{ product.name }}</div>
              <div class="p-price">{{ product.priceCents / 100 | currency }}</div>
              <div class="p-stock" [class.empty]="product.stock <= 0">
                Stock: {{ product.stock }}
              </div>
            </button>
          }
        </div>
      </div>

      <div class="cart-panel">
        <h2>Venta Actual</h2>

        <div class="cart-items">
          @if (cart().length === 0) {
            <p class="empty-cart">No hay items en la venta.</p>
          }

          @for (item of cart(); track item.product.id) {
            <div class="cart-item">
              <span class="item-name">{{ item.product.name }}</span>
              <div class="item-controls">
                <button (click)="updateQty(item, -1)">-</button>
                <span>{{ item.quantity }}</span>
                <button
                  (click)="updateQty(item, 1)"
                  [disabled]="item.quantity >= item.product.stock"
                >
                  +
                </button>
              </div>
              <span class="item-total">{{
                (item.product.priceCents * item.quantity) / 100 | currency
              }}</span>
            </div>
          }
        </div>

        <div class="cart-footer">
          <div class="total-row">
            <span>Total</span>
            <span class="total-amount">{{ total() / 100 | currency }}</span>
          </div>
          <button class="btn-charge" [disabled]="cart().length === 0" (click)="charge()">
            Cobrar {{ total() / 100 | currency }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sale-container {
        display: flex;
        gap: 1rem;
        height: calc(100vh - 140px); /* Adjust based on header/nav */
      }
      .products-grid {
        flex: 1;
        overflow-y: auto;
        padding-right: 1rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
      }
      .product-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        text-align: left;
        cursor: pointer;
        transition: transform 0.1s;
      }
      .product-card:active {
        transform: scale(0.98);
      }
      .product-card:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .p-name {
        font-weight: 600;
        margin-bottom: 5px;
      }
      .p-price {
        color: #2563eb;
        font-weight: 700;
      }
      .p-stock {
        font-size: 0.8rem;
        color: #6b7280;
        margin-top: 5px;
      }
      .p-stock.empty {
        color: #ef4444;
      }

      .cart-panel {
        width: 350px;
        background: white;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .cart-items {
        flex: 1;
        overflow-y: auto;
      }
      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f3f4f6;
      }
      .item-name {
        flex: 1;
        font-size: 0.9rem;
      }
      .item-controls {
        display: flex;
        align-items: center;
        gap: 5px;
        margin: 0 10px;
      }
      .item-controls button {
        background: #e5e7eb;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
      }
      .item-total {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .cart-footer {
        margin-top: 1rem;
        border-top: 2px solid #e5e7eb;
        padding-top: 1rem;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      .btn-charge {
        width: 100%;
        background: #111827;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
      }
      .btn-charge:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    `,
  ],
})
export class NewSaleComponent {
  private mockApi = inject(MockApiService);
  private router = inject(Router);

  products = signal<Product[]>(this.mockApi.listProducts());
  cart = signal<SaleItem[]>([]);

  total = computed(() => {
    return this.cart().reduce((acc, item) => acc + item.product.priceCents * item.quantity, 0);
  });

  addToCart(product: Product) {
    this.cart.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return items;
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  updateQty(item: SaleItem, change: number) {
    this.cart.update((items) => {
      return items
        .map((i) => {
          if (i.product.id === item.product.id) {
            const newQty = i.quantity + change;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  }

  charge() {
    const sale = this.mockApi.createSale({
      items: this.cart(),
      totalCents: this.total(),
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
    });

    // Create Payment Intent automatically for this sale
    const intent = this.mockApi.createPaymentIntent({
      amountCents: sale.totalCents,
      channels: [], // Orchestrator/Component will decide supported channels or default set
      reference: sale.reference,
      saleId: sale.id,
      note: `Venta ${sale.reference}`,
    });

    // Navigate to Active Charge
    this.router.navigate(['/app/payment/active-charge', intent.id]);
  }
}
