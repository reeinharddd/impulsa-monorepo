import { TestBed } from '@angular/core/testing';
import { ChargeStatus } from '../../models/auth/enums';
import { PaymentStateService } from '../payment/payment-state.service';
import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;
  let paymentState: PaymentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockApiService);
    paymentState = TestBed.inject(PaymentStateService);

    // Clear localStorage mock for isolation (would need real mock, but valid for now if acceptable)
    localStorage.clear();
  });

  it('should create Product and retrieve it', () => {
    const p = service.createProduct({
      name: 'Test Prod',
      priceCents: 500,
      stock: 10,
      active: true,
    });
    expect(p.id).toBeDefined();
    expect(service.listProducts().length).toBeGreaterThan(0);
  });

  it('should decrement stock when Payment is CONFIRMED', () => {
    // 1. Setup Data
    const product = service.createProduct({
      name: 'Test',
      priceCents: 100,
      stock: 10,
      active: true,
    });
    const sale = service.createSale({
      items: [{ product, quantity: 2 }],
      totalCents: 200,
      reference: 'SALE1',
    });
    const intent = service.createPaymentIntent({
      amountCents: 200,
      channels: [],
      reference: 'REF1',
      saleId: sale.id,
    });

    // Set status to PAYMENT_SENT manually or via flow
    // We cheat and update internal state or just rely on orchestrator validation?
    // MockAPI updates on orchestrator emit.
    // Let's bypass internal intent status (MockApi doesn't validate, Orchestrator does).
    // We just need to trigger the emission.

    // Simulate intent is currently PAYMENT_SENT (MockAPI must know current state for orchestrator to validate? No, validator takes intent obj)
    // We need to pass an intent object with current state to validator.
    const intentSent = { ...intent, status: ChargeStatus.PAYMENT_SENT };

    // 2. Trigger Transition
    paymentState.validateAndEmit(intentSent, ChargeStatus.CONFIRMED);

    // 3. Check Persistence
    const updatedProd = service.listProducts().find((p) => p.id === product.id);
    expect(updatedProd?.stock).toBe(8); // 10 - 2

    const updatedSale = service.getSale(sale.id);
    expect(updatedSale?.confirmed).toBe(true);
  });
});
