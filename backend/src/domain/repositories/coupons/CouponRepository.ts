import { Coupon } from '@/domain/entities/coupons/Coupon';

export interface CouponRepository {
  findAll(): Promise<Coupon[]>;
  findById(id: number): Promise<Coupon | null>;
  findByUserId(userId: number): Promise<Coupon[]>;
  findByCode(code: string): Promise<Coupon | null>;
  create(coupon: Omit<Coupon, 'id'>): Promise<Coupon>;
  update(id: number, coupon: Partial<Omit<Coupon, 'id'>>): Promise<Coupon | null>;
  useCoupon(id: number): Promise<Coupon | null>;
} 