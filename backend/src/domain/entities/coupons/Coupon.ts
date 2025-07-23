export class Coupon {
  constructor(
    readonly id: number,
    readonly userId: number,
    readonly code: string,
    readonly discountAmount: number,
    readonly discountType: 'percentage' | 'fixed',
    readonly isUsed: boolean,
    readonly expiresAt: Date,
    readonly createdAt: Date
  ) {}
} 