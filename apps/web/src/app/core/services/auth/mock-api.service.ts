import { Injectable, effect, inject, signal } from '@angular/core';
import { ChargeStatus, UserType } from '../../models/auth/enums';
import { User } from '../../models/auth/user.model';
import { PaymentIntent } from '../../models/payment/payment-intent.model';
import { Sale } from '../../models/payment/sale.model';
import { Product } from '../../models/product/product.model';
import { PaymentStateService, PaymentTransition } from '../payment/payment-state.service';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private paymentState = inject(PaymentStateService);

  // In-memory state initialized from localStorage
  private _users = signal<User[]>(this.load('users', []));
  readonly users = this._users.asReadonly();

  listUsers(): User[] {
    return this._users();
  }
  private _products = signal<Product[]>(this.load('products', []));
  private _sales = signal<Sale[]>(this.load('sales', []));
  private _paymentIntents = signal<PaymentIntent[]>(this.load('payment_intents', []));

  // Current session user
  private _currentUser = signal<User | null>(this.load('current_user', null));
  readonly currentUser = this._currentUser.asReadonly();

  constructor() {
    // Persist on change
    effect(() => this.save('users', this._users()));
    effect(() => this.save('products', this._products()));
    effect(() => this.save('sales', this._sales()));
    effect(() => this.save('payment_intents', this._paymentIntents()));
    effect(() => this.save('current_user', this._currentUser()));

    // Subscribe to orchestrator
    this.paymentState.validatedTransition$.subscribe((transition) => {
      this.handlePaymentTransition(transition);
    });
  }

  // --- Users ---
  registerUser(name: string, type: UserType, email?: string): User {
    const newUser: User = {
      id: `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name,
      type,
      email,
    };
    this._users.update((users) => [...users, newUser]);
    this._currentUser.set(newUser);
    return newUser;
  }

  loginAs(userId: string): boolean {
    const user = this._users().find((u) => u.id === userId);
    if (user) {
      this._currentUser.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
  }

  // --- Products ---
  createProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
    this._products.update((products) => [...products, newProduct]);
    return newProduct;
  }

  listProducts(): Product[] {
    return this._products();
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    this._products.update((products) =>
      products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  }

  // --- Sales ---
  createSale(sale: Omit<Sale, 'id' | 'createdAt' | 'confirmed'>): Sale {
    const newSale: Sale = {
      ...sale,
      id: `s_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      confirmed: false,
    };
    this._sales.update((sales) => [...sales, newSale]);
    return newSale;
  }

  getSale(id: string): Sale | undefined {
    return this._sales().find((s) => s.id === id);
  }

  // --- Payment Intents ---
  createPaymentIntent(intent: Omit<PaymentIntent, 'id' | 'createdAt' | 'status'>): PaymentIntent {
    const newIntent: PaymentIntent = {
      ...intent,
      id: `pi_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      status: ChargeStatus.CREATED,
    };
    this._paymentIntents.update((intents) => [...intents, newIntent]);
    return newIntent;
  }

  getPaymentIntent(id: string): PaymentIntent | undefined {
    return this._paymentIntents().find((pi) => pi.id === id);
  }

  listPaymentIntents(): PaymentIntent[] {
    return this._paymentIntents();
  }

  // --- Handling Transitions ---
  private handlePaymentTransition(transition: PaymentTransition): void {
    const { intentId, to } = transition;

    // Update Payment Intent Status
    this._paymentIntents.update((intents) =>
      intents.map((pi) => (pi.id === intentId ? { ...pi, status: to } : pi)),
    );

    // Side Effects based on Confirmed
    if (to === ChargeStatus.CONFIRMED) {
      const intent = this._paymentIntents().find((pi) => pi.id === intentId);
      if (intent && intent.saleId) {
        this.confirmSale(intent.saleId);
      }
    }
  }

  private confirmSale(saleId: string): void {
    // Mark Sale as Confirmed
    this._sales.update((sales) =>
      sales.map((s) => (s.id === saleId ? { ...s, confirmed: true } : s)),
    );

    // Decrement Stock
    const sale = this._sales().find((s) => s.id === saleId);
    if (sale) {
      this._products.update((products) => {
        return products.map((product) => {
          const saleItem = sale.items.find((item) => item.product.id === product.id);
          if (saleItem) {
            return { ...product, stock: product.stock - saleItem.quantity };
          }
          return product;
        });
      });
    }
  }

  // --- LocalStorage Helpers ---
  private load<T>(key: string, fallback: T): T {
    const stored = localStorage.getItem(`impulsa_mvp_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  }

  private save<T>(key: string, data: T): void {
    localStorage.setItem(`impulsa_mvp_${key}`, JSON.stringify(data));
  }
}
