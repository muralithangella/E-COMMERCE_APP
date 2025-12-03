const User = require('../models/User');
const KafkaManager = require('../config/kafka');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, profile },
      { new: true, runValidators: true }
    ).select('-password');
    
    await KafkaManager.publishUserEvent('PROFILE_UPDATED', {
      userId: user._id,
      email: user.email
    });
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update profile', error: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(req.body);
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add address', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(address, req.body);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update address', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.id(req.params.addressId).remove();
    await user.save();
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body },
      { new: true }
    ).select('preferences');
    
    res.json(user.preferences);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update preferences', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  updatePreferences
};