import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChargeStatus } from '../models/enums';
import { PaymentIntent } from '../models/payment-intent.model';

export interface PaymentTransition {
  intentId: string;
  from: ChargeStatus;
  to: ChargeStatus;
  timestamp: Date;
  meta?: any;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentStateService {
  // Valid transitions map
  private readonly ALLOWED_TRANSITIONS: Record<ChargeStatus, ChargeStatus[]> = {
    [ChargeStatus.CREATED]: [ChargeStatus.PRESENTED, ChargeStatus.CANCELED, ChargeStatus.ABANDONED],
    [ChargeStatus.PRESENTED]: [
      ChargeStatus.PAYMENT_SENT,
      ChargeStatus.EXPIRED,
      ChargeStatus.CANCELED,
      ChargeStatus.ABANDONED,
    ],
    [ChargeStatus.PAYMENT_SENT]: [
      ChargeStatus.CONFIRMED,
      ChargeStatus.FAILED,
      ChargeStatus.EXPIRED,
    ], // Expired might happen if payment notification never comes? Or maybe not needed from sent.
    [ChargeStatus.CONFIRMED]: [], // Terminal
    [ChargeStatus.FAILED]: [], // Terminal for that attempt (could retry but new intent usually)
    [ChargeStatus.EXPIRED]: [], // Terminal
    [ChargeStatus.CANCELED]: [], // Terminal
    [ChargeStatus.ABANDONED]: [ChargeStatus.EXPIRED], // Mapping abandoned to expired for persistence if needed
  };

  private _validatedTransitionSubject = new Subject<PaymentTransition>();
  public validatedTransition$ = this._validatedTransitionSubject.asObservable();

  constructor() {}

  validateAndEmit(intent: PaymentIntent, to: ChargeStatus, meta?: any): boolean {
    const from = intent.status;

    // Idempotency check
    if (from === to) {
      console.warn(
        `[PaymentState] Idempotent transition attempted: ${from} -> ${to} for intent ${intent.id}`,
      );
      return true; // Treat as success but don't emit change
    }

    // Validity check
    const allowed = this.ALLOWED_TRANSITIONS[from];
    if (!allowed || !allowed.includes(to)) {
      console.error(
        `[PaymentState] Invalid transition attempted: ${from} -> ${to} for intent ${intent.id}`,
      );
      return false;
    }

    // Emit validated transition
    const transition: PaymentTransition = {
      intentId: intent.id,
      from,
      to,
      timestamp: new Date(),
      meta,
    };

    this._validatedTransitionSubject.next(transition);
    return true;
  }
}
