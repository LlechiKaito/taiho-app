import { Request, Response } from 'express';
import { CouponApplicationService } from '@/application/services/coupons/CouponApplicationService';
import { CouponRepository } from '@/domain/repositories/coupons/CouponRepository';
import { CreateCouponRequestDto, UpdateCouponRequestDto } from '@/application/dto/coupons/CouponDto';
import { AuthenticatedRequest } from '@/adapters/middleware/authMiddleware';

export class CouponController {
  private couponApplicationService: CouponApplicationService;

  constructor(
    private couponRepository: CouponRepository
  ) {
    this.couponApplicationService = new CouponApplicationService(couponRepository);
  }

  /**
   * 全クーポン一覧取得（管理者のみ）
   */
  async getAllCoupons(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const result = await this.couponApplicationService.getAllCoupons();
      if (result.coupons.length === 0) {
        res.status(404).json({ error: 'クーポンが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * 認証されたユーザーのクーポン一覧取得
   */
  async getUserCoupons(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: '認証が必要です' });
        return;
      }

      const userId = req.user.userId;
      const result = await this.couponApplicationService.getCouponsByUserId(userId);
      if (result.coupons.length === 0) {
        res.status(404).json({ error: 'クーポンが見つかりません' });
        return;
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * クーポン詳細の取得
   */
  async getCouponById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'クーポンIDは数値である必要があります' });
        return;
      }

      const result = await this.couponApplicationService.getCouponById(id);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'クーポンが見つかりません' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * クーポンの作成（管理者のみ）
   */
  async createCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const request: CreateCouponRequestDto = req.body;

      // バリデーション
      if (!request.userId || !request.code || request.discountAmount === undefined || !request.discountType || !request.expiresAt) {
        res.status(400).json({ error: 'userId、code、discountAmount、discountType、expiresAtは必須です' });
        return;
      }

      const result = await this.couponApplicationService.createCoupon(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating coupon:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'クーポンの作成に失敗しました' });
      }
    }
  }

  /**
   * クーポンの更新（管理者のみ）
   */
  async updateCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 管理者権限チェック
      if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: '管理者権限が必要です' });
        return;
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'クーポンIDは数値である必要があります' });
        return;
      }

      const request: UpdateCouponRequestDto = req.body;

      // バリデーション
      if (!request.userId && !request.code && request.discountAmount === undefined && !request.discountType && request.isUsed === undefined && !request.expiresAt) {
        res.status(400).json({ error: '更新する項目を指定してください' });
        return;
      }

      const result = await this.couponApplicationService.updateCoupon(id, request);
      
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'クーポンが見つかりません' });
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'クーポンの更新に失敗しました' });
      }
    }
  }

  /**
   * クーポンの使用
   */
  async useCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'クーポンIDは数値である必要があります' });
        return;
      }

      const result = await this.couponApplicationService.useCoupon(id);
      res.json(result);
    } catch (error) {
      console.error('Error using coupon:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'クーポンの使用に失敗しました' });
      }
    }
  }
} 