import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorCode: { type: String, select: false },
    twoFactorExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

export const User = mongoose.model('User', userSchema);
