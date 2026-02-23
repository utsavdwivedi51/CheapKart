const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/addresses — get all addresses for user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/addresses — add new address
router.post('/',
  [
    body('firstName').notEmpty().withMessage('First name required'),
    body('mobile').notEmpty().withMessage('Mobile required'),
    body('line1').notEmpty().withMessage('Address line 1 required'),
    body('city').notEmpty().withMessage('City required'),
    body('pincode').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit pincode required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

      const user = await User.findById(req.user._id);
      const { firstName, lastName, mobile, line1, line2, city, state, pincode, type, isDefault } = req.body;

      // If new address is default, unset others
      if (isDefault) {
        user.addresses.forEach(a => { a.isDefault = false; });
      }

      user.addresses.push({ firstName, lastName, mobile, line1, line2, city, state, pincode, type, isDefault: isDefault || user.addresses.length === 0 });
      await user.save();
      res.status(201).json({ success: true, data: { addresses: user.addresses } });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// PUT /api/addresses/:id — update address
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });

    const fields = ['firstName', 'lastName', 'mobile', 'line1', 'line2', 'city', 'state', 'pincode', 'type'];
    fields.forEach(f => { if (req.body[f] !== undefined) addr[f] = req.body[f]; });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
      addr.isDefault = true;
    }
    await user.save();
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/addresses/:id — remove address
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    addr.deleteOne();
    await user.save();
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PATCH /api/addresses/:id/default — set as default
router.patch('/:id/default', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(a => { a.isDefault = a._id.toString() === req.params.id; });
    await user.save();
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
