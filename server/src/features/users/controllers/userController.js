import { User } from '../models/User.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  if (req.body.address) user.address = { ...user.address?.toObject?.() || user.address, ...req.body.address };
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    address: updated.address,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.role = req.body.role ?? user.role;
  user.twoFactorEnabled = req.body.twoFactorEnabled ?? user.twoFactorEnabled;
  const updated = await user.save();
  res.json(updated);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});
