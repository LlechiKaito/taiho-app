export interface MenuItemResponseDto {
  id: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  price: number;
  category: string;
}

export interface MenuItemListResponseDto {
  items: MenuItemResponseDto[];
}