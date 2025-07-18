export interface MenuItemResponseDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequestDto {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemRequestDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface MenuItemListResponseDto {
  items: MenuItemResponseDto[];
  total: number;
}

export interface CategorySummaryDto {
  category: string;
  count: number;
  avgPrice: number;
}

export interface MenuItemFilterDto {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
} 