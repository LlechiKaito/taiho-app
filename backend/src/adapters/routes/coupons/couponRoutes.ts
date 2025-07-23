import { Router } from 'express';
import { CouponController } from '@/adapters/controllers/coupons/CouponController';
import { DynamoDBCouponRepository } from '@/infrastructure/repositories/coupons/DynamoDBCouponRepository';
import { authenticateToken } from '@/adapters/middleware/authMiddleware';
import { requireAdmin } from '@/adapters/middleware/authMiddleware';

const router = Router();
const couponRepository = new DynamoDBCouponRepository();
const couponController = new CouponController(couponRepository);

router.get('/api/coupons/all', authenticateToken, requireAdmin, (req, res) => couponController.getAllCoupons(req, res));
router.get('/api/coupons', authenticateToken, (req, res) => couponController.getUserCoupons(req, res));
router.get('/api/coupons/:id', (req, res) => couponController.getCouponById(req, res));
router.post('/api/coupons', authenticateToken, requireAdmin, (req, res) => couponController.createCoupon(req, res));
router.put('/api/coupons/:id', authenticateToken, requireAdmin, (req, res) => couponController.updateCoupon(req, res));
router.post('/api/coupons/:id/use', authenticateToken, (req, res) => couponController.useCoupon(req, res));

export default router; 