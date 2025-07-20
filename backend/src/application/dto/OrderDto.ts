export interface OrderResponseDto {
  id: number;
  userId: number;
  isCooked: boolean;
  isPayment: boolean;
  isTakeOut: boolean;
  createdAt: string;
  description: string;
  isComplete: boolean;
}

export interface OrderListResponseDto {
  orders: OrderResponseDto[];
} 