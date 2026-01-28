export enum ChargeStatus {
  CREATED = 'CREATED',
  PRESENTED = 'PRESENTED',
  PAYMENT_SENT = 'PAYMENT_SENT',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  ABANDONED = 'ABANDONED',
}

export enum ChannelType {
  QR = 'QR',
  LINK = 'LINK',
  NFC_PRESENTATION = 'NFC_PRESENTATION',
  PROXIMITY_SHARE = 'PROXIMITY_SHARE',
}

export enum UserType {
  BUSINESS = 'business',
  PERSON = 'person',
}
