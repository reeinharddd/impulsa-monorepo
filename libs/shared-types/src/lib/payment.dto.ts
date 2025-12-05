export interface CreatePaymentDto {
  amount: number;
  currency: string;
  provider: "conekta" | "stripe" | "mercadopago";
  metadata?: Record<string, any>;
}

export interface PaymentResponseDto {
  id: string;
  status: "pending" | "completed" | "failed";
  transactionId: string;
}
