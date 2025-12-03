const express = require('express');
const Coupon = require('../models/Coupon');
const { authenticate, authorize, pagination } = require('../middleware');

const router = express.Router();

const getCoupons = async (req, res) => {
  try {
    const filter = { isActive: true };
    const coupons = await Coupon.find(filter)
      .select('-usageCount')
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);
    
    const total = await Coupon.countDocuments(filter);
    res.json(res.paginate(coupons, total));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, amount, productIds } = req.body;
    
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }
    
    if (coupon.minimumAmount && amount < coupon.minimumAmount) {
      return res.status(400).json({ message: `Minimum order amount is $${coupon.minimumAmount}` });
    }
    
    if (coupon.usageLimit?.total && coupon.usageCount >= coupon.usageLimit.total) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }
    
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (amount * coupon.value) / 100;
      if (coupon.maximumDiscount) {
        discount = Math.min(discount, coupon.maximumDiscount);
      }
    } else if (coupon.type === 'fixed_amount') {
      discount = Math.min(coupon.value, amount);
    }
    
    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value
      },
      discount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate coupon', error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon({
      ...req.body,
      createdBy: req.user.id
    });
    
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create coupon', error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update coupon', error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
  }
};

router.get('/', pagination(), getCoupons);
router.post('/validate', authenticate, validateCoupon);
router.post('/', authenticate, authorize('admin'), createCoupon);
router.put('/:id', authenticate, authorize('admin'), updateCoupon);
router.delete('/:id', authenticate, authorize('admin'), deleteCoupon);

module.exports = router;