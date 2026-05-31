import crypto from "crypto";
import { User } from "../../users/models/User.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { generateToken } from "../../../shared/utils/generateToken.js";
import { sendEmail } from "../../../shared/utils/sendEmail.js";
import { env } from "../../../shared/config/env.js";

const buildAuthResponse = (user, token, extra = {}) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  address: user.address,
  token,
  ...extra,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password, role: "user" });
  try {
    await sendEmail({
      to: user.email,
      subject: "Welcome to ShopVerse",
      html: `<p>Hi ${user.name},</p><p>Your account was created successfully. Start shopping today!</p>`,
    });
  } catch (err) {
    console.warn("Welcome email failed:", err.message);
  }
  const token = generateToken(user._id, user.role);
  res.status(201).json(buildAuthResponse(user, token));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(
    "+password +twoFactorCode +twoFactorExpires",
  );
  console.log("we are here");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.role === "admin" && user.twoFactorEnabled) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorCode = code;
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    console.log(code);
    try {
      await sendEmail({
        to: user.email,
        subject: "Admin 2FA Code",
        html: `<p>Your verification code is: <strong>${code}</strong></p><p>Expires in 10 minutes.</p>`,
      });
    } catch (err) {
      console.warn("2FA email failed, code for dev:", code, err.message);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(`[2FA] Admin code for ${user.email}: ${code}`);
    }
    return res.json({
      requires2FA: true,
      userId: user._id,
      message: "2FA code sent to your email",
    });
  }

  const token = generateToken(user._id, user.role);
  res.json(buildAuthResponse(user, token));
});

export const verify2FA = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  const user = await User.findById(userId).select(
    "+twoFactorCode +twoFactorExpires",
  );
  if (
    !user ||
    user.twoFactorCode !== code ||
    user.twoFactorExpires < new Date()
  ) {
    res.status(401);
    throw new Error("Invalid or expired 2FA code");
  }
  user.twoFactorCode = undefined;
  user.twoFactorExpires = undefined;
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id, user.role);
  res.json(buildAuthResponse(user, token));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ message: "If that email exists, a reset link was sent" });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.storefrontUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 1 hour.</p>`,
  });
  res.json({ message: "If that email exists, a reset link was sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  const token = generateToken(user._id, user.role);
  res.json(buildAuthResponse(user, token));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  const redirect = req.user.role === "admin" ? env.crmUrl : env.storefrontUrl;
  res.redirect(`${redirect}/auth/callback?token=${token}`);
});
