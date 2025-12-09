const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');

/**
 * Get user's wishlists
 */
exports.getWishlists = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const wishlists = await Wishlist.find({ user: userId })
      .populate('items.product', 'name price images brand discount')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: wishlists
    });
  } catch (error) {
    console.error('Get wishlists error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlists',
      error: error.message
    });
  }
};

/**
 * Get a specific wishlist
 */
exports.getWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user?.id || req.query.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      $or: [
        { user: userId },
        { isPublic: true },
        { shareToken: req.query.token }
      ]
    }).populate('items.product', 'name price images brand discount inventory rating');

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

/**
 * Create a new wishlist
 */
exports.createWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { name, description, isPublic } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const wishlist = new Wishlist({
      user: userId,
      name: name || 'My Wishlist',
      description,
      isPublic: isPublic || false,
      items: []
    });

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Create wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create wishlist',
      error: error.message
    });
  }
};

/**
 * Add item to wishlist
 */
exports.addItem = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { productId, notes, variant } = req.body;
    const userId = req.user?.id || req.body.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Check if product already exists
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Get product price (would need to call product service)
    // For now, we'll add without price
    wishlist.items.push({
      product: productId,
      notes,
      variant,
      addedAt: new Date()
    });

    wishlist.updatedAt = new Date();
    await wishlist.save();

    await wishlist.populate('items.product', 'name price images brand');

    res.json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
};

/**
 * Remove item from wishlist
 */
exports.removeItem = async (req, res) => {
  try {
    const { wishlistId, itemId } = req.params;
    const userId = req.user?.id || req.query.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item._id.toString() !== itemId
    );
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    });
  }
};

/**
 * Update wishlist
 */
exports.updateWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.user?.id || req.body.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    if (name) wishlist.name = name;
    if (description !== undefined) wishlist.description = description;
    if (isPublic !== undefined) wishlist.isPublic = isPublic;
    wishlist.updatedAt = new Date();

    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist updated successfully',
      data: wishlist
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update wishlist',
      error: error.message
    });
  }
};

/**
 * Delete wishlist
 */
exports.deleteWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user?.id || req.query.userId;

    const wishlist = await Wishlist.findOneAndDelete({
      _id: wishlistId,
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    res.json({
      success: true,
      message: 'Wishlist deleted successfully'
    });
  } catch (error) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete wishlist',
      error: error.message
    });
  }
};

/**
 * Generate share token
 */
exports.generateShareToken = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user?.id || req.query.userId;

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    await wishlist.generateShareToken();

    res.json({
      success: true,
      data: {
        shareToken: wishlist.shareToken,
        shareUrl: `/wishlist/${wishlistId}?token=${wishlist.shareToken}`
      }
    });
  } catch (error) {
    console.error('Generate share token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate share token',
      error: error.message
    });
  }
};

