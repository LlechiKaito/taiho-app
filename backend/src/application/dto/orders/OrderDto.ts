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

export interface OrderDetailResponseDto {
  id: number;
  userId: number;
  isCooked: boolean;
  isPayment: boolean;
  isTakeOut: boolean;
  createdAt: string;
  description: string;
  isComplete: boolean;
  orderLists: {
    id: number;
    orderId: number;
    itemId: number;
    quantity: number;
  }[];
}

export interface OrderListResponseDto {
  orders: OrderResponseDto[];
}

// 注文作成用のDTO
export interface CreateOrderRequestDto {
  userId: number;
  isTakeOut: boolean;
  itemList: {
    itemId: number;
    quantity: number;
  }[];
}

export interface CreateOrderResponseDto {
  id: number;
  userId: number;
  isCooked: boolean;
  isPayment: boolean;
  isTakeOut: boolean;
  createdAt: string;
  description: string;
  isComplete: boolean;
  orderLists: {
    id: number;
    orderId: number;
    itemId: number;
    quantity: number;
  }[];
} 