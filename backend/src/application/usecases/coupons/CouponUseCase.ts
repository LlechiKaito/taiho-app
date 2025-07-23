import { Coupon } from '@/domain/entities/coupons/Coupon';
import { CouponRepository } from '@/domain/repositories/coupons/CouponRepository';
import {
  CouponResponseDto,
  CouponListResponseDto,
  CreateCouponRequestDto,
  UpdateCouponRequestDto,
  CreateCouponResponseDto,
  UseCouponResponseDto,
} from '@/application/dto/coupons/CouponDto';

export class CouponUseCase {
  constructor(
    private couponRepository: CouponRepository
  ) {}

  async getAllCoupons(): Promise<CouponListResponseDto> {
    const coupons = await this.couponRepository.findAll();
    const responseCoupons = coupons.map(coupon => this.toResponseDto(coupon));
    
    return {
      coupons: responseCoupons,
      total: responseCoupons.length
    };
  }

  async getCouponById(id: number): Promise<CouponResponseDto | null> {
    const coupon = await this.couponRepository.findById(id);
    return coupon ? this.toResponseDto(coupon) : null;
  }

  async getCouponsByUserId(userId: number): Promise<CouponListResponseDto> {
    const coupons = await this.couponRepository.findByUserId(userId);
    const responseCoupons = coupons.map(coupon => this.toResponseDto(coupon));
    
    return {
      coupons: responseCoupons,
      total: responseCoupons.length
    };
  }

  async createCoupon(request: CreateCouponRequestDto): Promise<CreateCouponResponseDto> {
    // バリデーション
    if (!request.userId || !request.code || request.discountAmount === undefined || !request.discountType || !request.expiresAt) {
      throw new Error('userId、code、discountAmount、discountType、expiresAtは必須です');
    }

    // 割引額のバリデーション
    if (request.discountType === 'percentage' && (request.discountAmount < 0 || request.discountAmount > 100)) {
      throw new Error('パーセンテージ割引は0-100の範囲で指定してください');
    }

    if (request.discountType === 'fixed' && request.discountAmount < 0) {
      throw new Error('固定額割引は0以上の値を指定してください');
    }

    // 期限のバリデーション
    const expiresAt = new Date(request.expiresAt);
    if (isNaN(expiresAt.getTime())) {
      throw new Error('有効期限の形式が正しくありません');
    }

    if (expiresAt <= new Date()) {
      throw new Error('有効期限は現在時刻より後の日時を指定してください');
    }

    // コードの重複チェック
    const existingCoupon = await this.couponRepository.findByCode(request.code);
    if (existingCoupon) {
      throw new Error('このクーポンコードは既に使用されています');
    }

    const coupon = await this.couponRepository.create({
      userId: request.userId,
      code: request.code,
      discountAmount: request.discountAmount,
      discountType: request.discountType,
      isUsed: false,
      expiresAt: expiresAt,
      createdAt: new Date()
    });

    return this.toCreateResponseDto(coupon);
  }

  async updateCoupon(id: number, request: UpdateCouponRequestDto): Promise<CouponResponseDto | null> {
    // バリデーション
    if (!request.userId && !request.code && request.discountAmount === undefined && !request.discountType && request.isUsed === undefined && !request.expiresAt) {
      throw new Error('更新する項目を指定してください');
    }

    const updateData: any = {};
    if (request.userId !== undefined) {
      updateData.userId = request.userId;
    }
    if (request.code !== undefined) {
      updateData.code = request.code;
    }
    if (request.discountAmount !== undefined) {
      updateData.discountAmount = request.discountAmount;
    }
    if (request.discountType !== undefined) {
      updateData.discountType = request.discountType;
    }
    if (request.isUsed !== undefined) {
      updateData.isUsed = request.isUsed;
    }
    if (request.expiresAt !== undefined) {
      updateData.expiresAt = new Date(request.expiresAt);
    }

    const coupon = await this.couponRepository.update(id, updateData);
    return coupon ? this.toResponseDto(coupon) : null;
  }

  async useCoupon(id: number): Promise<UseCouponResponseDto> {
    const coupon = await this.couponRepository.useCoupon(id);
    if (!coupon) {
      throw new Error('クーポンが見つかりません');
    }

    return {
      ...this.toResponseDto(coupon),
      message: 'クーポンを使用しました'
    };
  }

  private toResponseDto(coupon: Coupon): CouponResponseDto {
    return {
      id: coupon.id,
      userId: coupon.userId,
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      discountType: coupon.discountType,
      isUsed: coupon.isUsed,
      expiresAt: coupon.expiresAt.toISOString(),
      createdAt: coupon.createdAt.toISOString()
    };
  }

  private toCreateResponseDto(coupon: Coupon): CreateCouponResponseDto {
    return {
      id: coupon.id,
      userId: coupon.userId,
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      discountType: coupon.discountType,
      isUsed: coupon.isUsed,
      expiresAt: coupon.expiresAt.toISOString(),
      createdAt: coupon.createdAt.toISOString()
    };
  }
} 