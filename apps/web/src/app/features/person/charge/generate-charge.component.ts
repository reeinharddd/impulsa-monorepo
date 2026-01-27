import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockApiService } from '../../../core/services/mock-api.service';

@Component({
  selector: 'app-generate-charge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="charge-container">
      <div class="card">
        <h2>Generar Cobro</h2>
        <p class="subtitle">Ingresa el monto para recibir una transferencia.</p>

        <form [formGroup]="chargeForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Monto</label>
            <div class="amount-input">
              <span class="currency">$</span>
              <input type="number" formControlName="amount" placeholder="0.00" step="0.01" />
            </div>
          </div>

          <div class="form-group">
            <label>Nota (Opcional)</label>
            <input type="text" formControlName="note" placeholder="Ej. Cena viernes" />
          </div>

          <button type="submit" [disabled]="chargeForm.invalid" class="btn-create">
            Continuar
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .charge-container {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
      }
      .card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      h2 {
        margin-bottom: 0.5rem;
      }
      .subtitle {
        color: #6b7280;
        margin-bottom: 2rem;
      }
      .form-group {
        text-align: left;
        margin-bottom: 1.5rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      .amount-input {
        position: relative;
      }
      .currency {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        color: #6b7280;
      }
      input[type='number'] {
        width: 100%;
        padding: 1rem 1rem 1rem 2rem;
        font-size: 2rem;
        font-weight: 700;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        outline: none;
      }
      input[type='text'] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
      }
      .btn-create {
        width: 100%;
        background: #2563eb;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
      }
      .btn-create:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    `,
  ],
})
export class GenerateChargeComponent {
  private fb = inject(FormBuilder);
  private mockApi = inject(MockApiService);
  private router = inject(Router);

  chargeForm = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    note: [''],
  });

  onSubmit() {
    if (this.chargeForm.invalid) return;

    const { amount, note } = this.chargeForm.value;
    const amountCents = Math.round(parseFloat(amount!) * 100); // Convert to cents

    const intent = this.mockApi.createPaymentIntent({
      amountCents,
      channels: [],
      reference: `CHG-${Math.floor(Math.random() * 10000)}`,
      note: note || undefined,
    });

    this.router.navigate(['/app/payment/active-charge', intent.id]);
  }
}
