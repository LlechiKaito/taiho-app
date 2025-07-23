import { CouponRepository } from '@/domain/repositories/coupons/CouponRepository';
import { CouponUseCase } from '@/application/usecases/coupons/CouponUseCase';
import {
  CouponResponseDto,
  CouponListResponseDto,
  CreateCouponRequestDto,
  UpdateCouponRequestDto,
  CreateCouponResponseDto,
  UseCouponResponseDto,
} from '@/application/dto/coupons/CouponDto';

export class CouponApplicationService {
  private couponUseCase: CouponUseCase;

  constructor(
    private couponRepository: CouponRepository
  ) {
    this.couponUseCase = new CouponUseCase(couponRepository);
  }

  /**
   * クーポン一覧の取得
   */
  async getAllCoupons(): Promise<CouponListResponseDto> {
    return await this.couponUseCase.getAllCoupons();
  }

  /**
   * クーポン詳細の取得
   */
  async getCouponById(id: number): Promise<CouponResponseDto | null> {
    return await this.couponUseCase.getCouponById(id);
  }

  /**
   * ユーザーIDによるクーポン取得
   */
  async getCouponsByUserId(userId: number): Promise<CouponListResponseDto> {
    return await this.couponUseCase.getCouponsByUserId(userId);
  }

  /**
   * クーポンの作成
   */
  async createCoupon(request: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
    return await this.couponUseCase.createCoupon(request);
  }

  /**
   * クーポンの更新
   */
  async updateCoupon(id: number, request: UpdateCouponRequestDto): Promise<CouponResponseDto | null> {
    return await this.couponUseCase.updateCoupon(id, request);
  }

  /**
   * クーポンの使用
   */
  async useCoupon(id: number): Promise<UseCouponResponseDto> {
    return await this.couponUseCase.useCoupon(id);
  }
} 