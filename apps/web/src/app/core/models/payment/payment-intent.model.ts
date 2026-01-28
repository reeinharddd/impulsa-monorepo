import { ChannelType, ChargeStatus } from '../auth/enums';

export interface PaymentIntent {
  id: string;
  amountCents: number;
  status: ChargeStatus;
  channels: ChannelType[];
  reference: string;
  createdAt: Date;
  note?: string;
  saleId?: string;
}
