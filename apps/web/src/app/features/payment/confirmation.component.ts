import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserType } from '@core/models/auth/enums';
import { PaymentIntent } from '@core/models/payment/payment-intent.model';
import { MockApiService } from '@core/services/auth/mock-api.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-container" *ngIf="intent(); else loading">
      <div class="receipt-card">
        <div class="success-icon">✓</div>
        <h2>Pago Confirmado</h2>
        <p class="subtitle">La transferencia ha sido recibida.</p>

        <div class="details">
          <div class="row">
            <span>Monto</span>
            <span class="value">{{ intent()!.amountCents / 100 | currency }}</span>
          </div>
          <div class="row">
            <span>Referencia</span>
            <span class="value">{{ intent()!.reference }}</span>
          </div>
          <div class="row">
            <span>Fecha</span>
            <span class="value">{{ intent()!.createdAt | date: 'short' }}</span>
          </div>
        </div>

        <div class="actions">
          @if (userType() === 'business') {
            <a routerLink="/app/business/sale" class="btn-primary">Nueva Venta</a>
          } @else {
            <a routerLink="/app/person/charge" class="btn-primary">Nuevo Cobro</a>
          }
        </div>
      </div>
    </div>
    <ng-template #loading>
      <div class="loading">Cargando recibo...</div>
    </ng-template>
  `,
  styles: [
    `
      .confirmation-container {
        display: flex;
        justify-content: center;
        padding-top: 3rem;
      }
      .receipt-card {
        background: white;
        padding: 3rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      .success-icon {
        width: 60px;
        height: 60px;
        background: #dcfce7;
        color: #166534;
        border-radius: 50%;
        font-size: 2rem;
        line-height: 60px;
        margin: 0 auto 1rem;
      }
      h2 {
        margin-bottom: 0.5rem;
        color: #166534;
      }
      .subtitle {
        color: #6b7280;
        margin-bottom: 2rem;
      }

      .details {
        background: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .row:last-child {
        margin-bottom: 0;
      }
      .value {
        font-weight: 600;
      }

      .btn-primary {
        display: block;
        width: 100%;
        background: #2563eb;
        color: white;
        text-decoration: none;
        padding: 1rem;
        border-radius: 8px;
        font-weight: 600;
      }
    `,
  ],
})
export class ConfirmationComponent {
  // Input from Resolver
  intent = input.required<PaymentIntent>();

  private mockApi = inject(MockApiService);
  userType = signal<UserType>(UserType.BUSINESS);

  constructor() {
    // Get user type once
    const user = this.mockApi.currentUser();
    if (user) {
      this.userType.set(user.type);
    }
  }
}
