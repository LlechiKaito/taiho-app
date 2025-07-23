export class Order {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly isCooked: boolean,
    public readonly isPayment: boolean,
    public readonly isTakeOut: boolean,
    public readonly createdAt: Date,
    public readonly description: string,
    public readonly isComplete: boolean
  ) {}
} 