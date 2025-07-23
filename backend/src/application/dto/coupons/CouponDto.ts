export interface CouponResponseDto {
  id: number;
  userId: number;
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface CouponListResponseDto {
  coupons: CouponResponseDto[];
  total: number;
}

// クーポン作成・更新用のDTO
export interface CreateCouponRequestDto {
  userId: number;
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  expiresAt: string;
}

export interface UpdateCouponRequestDto {
  userId?: number;
  code?: string;
  discountAmount?: number;
  discountType?: 'percentage' | 'fixed';
  isUsed?: boolean;
  expiresAt?: string;
}

export interface CreateCouponResponseDto {
  id: number;
  userId: number;
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface UseCouponRequestDto {
  couponId: number;
}

export interface UseCouponResponseDto {
  id: number;
  userId: number;
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  message: string;
} 