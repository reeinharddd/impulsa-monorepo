import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChargeStatus } from '@core/models/auth/enums';
import { PaymentIntent } from '@core/models/payment/payment-intent.model';
import { MockApiService } from '@core/services/auth/mock-api.service';
import { PaymentStateService } from '@core/services/payment/payment-state.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-active-charge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="active-charge-container" *ngIf="currentIntent(); else loading">
      <div class="status-card">
        <h2 class="amount">{{ currentIntent()!.amountCents / 100 | currency }}</h2>
        <div class="status-badge" [class]="currentIntent()!.status">
          {{ currentIntent()!.status }}
        </div>
        <p class="reference">Ref: {{ currentIntent()!.reference }}</p>

        <div class="channels-section">
          <h3>Métodos de Cobro</h3>
          <div class="channels-grid">
            <div class="channel-card">
              <div class="icon qr">QR</div>
              <span>Escanea QR</span>
            </div>
            <div class="channel-card">
              <div class="icon nfc">NFC</div>
              <span>Compartir por Proximidad</span>
            </div>
            <div class="channel-card">
              <div class="icon link">LINK</div>
              <span>Enviar Liga</span>
            </div>
          </div>

          <p class="legal-disclaimer">
            Impulsa no custodia fondos. El tiempo de confirmación depende del banco emisor.
          </p>
        </div>

        <div class="mock-controls">
          <h4>[MOCK CONTROLS]</h4>
          <button
            (click)="simulatePaymentSent()"
            [disabled]="
              currentIntent()!.status !== 'CREATED' && currentIntent()!.status !== 'PRESENTED'
            "
          >
            Simular Pago Enviado
          </button>
          <button class="btn-cancel" (click)="cancel()">Cancelar</button>
        </div>
      </div>
    </div>
    <ng-template #loading>
      <div class="loading">Cargando cobro...</div>
    </ng-template>
  `,
  styles: [
    `
      .active-charge-container {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
      }
      .status-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      .amount {
        font-size: 3rem;
        margin: 0;
        color: #111827;
      }
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 16px;
        font-weight: 600;
        margin: 10px 0;
        font-size: 0.9rem;
      }
      .status-badge.CREATED {
        background: #eff6ff;
        color: #1e40af;
      }
      .status-badge.PRESENTED {
        background: #e0f2fe;
        color: #0369a1;
      }
      .status-badge.PAYMENT_SENT {
        background: #fef9c3;
        color: #854d0e;
      }
      .status-badge.CONFIRMED {
        background: #dcfce7;
        color: #166534;
      }
      .status-badge.CANCELED {
        background: #fef2f2;
        color: #ef4444;
      }

      .reference {
        color: #6b7280;
        font-family: monospace;
        letter-spacing: 1px;
      }

      .channels-section {
        margin-top: 2rem;
      }
      .channels-grid {
        display: flex;
        justify-content: space-around;
        margin: 1.5rem 0;
      }
      .channel-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      .icon {
        width: 50px;
        height: 50px;
        background: #f3f4f6;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 0.8rem;
      }
      .icon.qr {
        background: #dbeafe;
        color: #1e40af;
      }
      .icon.nfc {
        background: #fae8ff;
        color: #86198f;
      }
      .icon.link {
        background: #fce7f3;
        color: #9d174d;
      }

      .legal-disclaimer {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-top: 2rem;
        border-top: 1px solid #f3f4f6;
        padding-top: 1rem;
      }

      .mock-controls {
        margin-top: 2rem;
        background: #fffbeb;
        padding: 1rem;
        border-radius: 8px;
        border: 1px dashed #fcd34d;
      }
      .mock-controls button {
        display: block;
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.5rem;
        cursor: pointer;
      }
      .btn-cancel {
        background: #fee2e2;
        border: 1px solid #ef4444;
        color: #b91c1c;
        border-radius: 4px;
      }
    `,
  ],
})
export class ActiveChargeComponent implements OnInit, OnDestroy {
  // Input from Resolver
  intentInput = input.required<PaymentIntent>({ alias: 'intent' });

  // Local state for updates
  currentIntent = signal<PaymentIntent | undefined>(undefined);

  private router = inject(Router);
  private mockApi = inject(MockApiService);
  private paymentState = inject(PaymentStateService);
  private pollSub?: Subscription;

  constructor() {
    // Sync input to local state initially and when it changes
    effect(
      () => {
        const i = this.intentInput();
        this.currentIntent.set(i);
        // Auto-transition logic
        if (i.status === ChargeStatus.CREATED) {
          this.paymentState.validateAndEmit(i, ChargeStatus.PRESENTED);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    // Simple polling to check for updates
    this.pollSub = interval(1000).subscribe(() => {
      if (this.currentIntent()) {
        const updated = this.mockApi.getPaymentIntent(this.currentIntent()!.id);
        if (updated && updated.status !== this.currentIntent()!.status) {
          this.currentIntent.set(updated);
          this.checkStatus();
        }
      }
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  checkStatus() {
    if (this.currentIntent()?.status === ChargeStatus.CONFIRMED) {
      this.router.navigate(['/app/payment/confirmation', this.currentIntent()!.id]);
    }
  }

  simulatePaymentSent() {
    if (!this.currentIntent()) return;

    // 1. Transition to PAYMENT_SENT
    this.paymentState.validateAndEmit(this.currentIntent()!, ChargeStatus.PAYMENT_SENT);
    this.currentIntent.set(this.mockApi.getPaymentIntent(this.currentIntent()!.id)); // refresh local

    // 2. Simulate external bank confirmation after delay
    setTimeout(() => {
      const id = this.currentIntent()!.id;
      const current = this.mockApi.getPaymentIntent(id);
      if (current && current.status === ChargeStatus.PAYMENT_SENT) {
        this.paymentState.validateAndEmit(current, ChargeStatus.CONFIRMED);
      }
    }, 2000);
  }

  cancel() {
    if (!this.currentIntent()) return;
    this.paymentState.validateAndEmit(this.currentIntent()!, ChargeStatus.CANCELED);
    this.currentIntent.set(this.mockApi.getPaymentIntent(this.currentIntent()!.id));
  }
}
