export interface OrderListResponseDto {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
}

export interface OrderListListResponseDto {
  orderLists: OrderListResponseDto[];
  total: number;
} 