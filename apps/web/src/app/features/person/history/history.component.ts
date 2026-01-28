import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { PaymentIntent } from '@core/models/payment/payment-intent.model';
import { MockApiService } from '@core/services/auth/mock-api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      <h1>Historial</h1>

      <div class="history-list">
        @if (intents().length === 0) {
          <div class="empty-state">No hay transacciones recientes.</div>
        }

        @for (intent of intents(); track intent.id) {
          <div class="history-item">
            <div class="intent-info">
              <span class="reference">{{ intent.reference }}</span>
              <span class="date">{{ intent.createdAt | date: 'short' }}</span>
            </div>
            <div class="intent-amount">
              <span class="amount">{{ intent.amountCents / 100 | currency }}</span>
              <span class="status" [class]="intent.status">{{ intent.status }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .history-container {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }
      h1 {
        margin-bottom: 2rem;
      }
      .history-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .history-item {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #f3f4f6;
      }
      .intent-info {
        display: flex;
        flex-direction: column;
      }
      .reference {
        font-weight: 600;
        font-size: 1rem;
      }
      .date {
        font-size: 0.8rem;
        color: #6b7280;
      }
      .intent-amount {
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .amount {
        font-weight: 700;
      }
      .status {
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
        margin-top: 4px;
        display: inline-block;
      }

      .status.CONFIRMED {
        background: #dcfce7;
        color: #166534;
      }
      .status.CREATED {
        background: #eff6ff;
        color: #1e40af;
      }
      .status.FAILED {
        background: #fee2e2;
        color: #991b1b;
      }
      .status.EXPIRED {
        background: #f3f4f6;
        color: #374151;
      }
    `,
  ],
})
export class HistoryComponent {
  private mockApi = inject(MockApiService);
  intents = signal<PaymentIntent[]>(this.mockApi.listPaymentIntents()); // Again, potentially stale if no signal linkage

  constructor() {
    // Ideally filter by user if multi-user support is real, but simple list for now
    // Assuming listPaymentIntents returns all (MVP single tenant simulation in localStorage)
  }
}
