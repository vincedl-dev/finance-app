import { UserModel } from "../models/user.model";
import {
  CreateUserDto,
  LoginUserDto,
  OtpDto,
  resetPasswordDto,
} from "../schema/auth.schema";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "./email.service";
import crypto from "crypto";
import { generateOTP, hashOTP } from "../utils/crypto.util";
import { OtpModel } from "../models/otp.model";
import { generateTokens } from "../utils/jwt.utils";

export const createAndSendOTP = async (
  email: string,
  type: "verification" | "password-reset",
) => {
  const plainOtp = generateOTP();
  const hashedOtp = hashOTP(plainOtp);

  // Set dynamic duration based on context
  const duration = type === "password-reset" ? 60 : 3;
  const expiresAt = new Date(Date.now() + duration * 60 * 1000);

  // Ensure only one active OTP of this type exists for this email
  await OtpModel.deleteMany({ email, type });

  await OtpModel.create({ email, otp: hashedOtp, type, expiresAt });

  // In production, call your email service here:
  // await sendEmail(email, plainOtp, type);

  return plainOtp;
};

export const createUserService = async (data: CreateUserDto) => {
  const existingUsers = await UserModel.find({
    $or: [{ email: data.email }, { username: data.username }],
  })
    .select("email username")
    .lean();

  // 2. If the array is not empty, we have at least one conflict
  if (existingUsers.length > 0) {
    const conflicts: Record<string, string> = {};

    // Loop through all found users to catch multiple different conflicts
    existingUsers.forEach((user) => {
      if (user.email === data.email.toLowerCase()) {
        conflicts.email = "Email is already registered";
      }
      if (user.username === data.username.toLowerCase()) {
        conflicts.username = "Username is taken";
      }
    });

    throw new AppError("Identity Conflict", 409, conflicts);
  }

  const user = new UserModel(data);
  await user.save();

  // await sendVerificationEmail(user.email);
  const { password, ...safeUser } = user.toObject();
  // NEVER return the password
  return safeUser;
};

export const loginUserService = async (data: LoginUserDto) => {
  console.log(data);
  const user = await UserModel.findOne({ email: data.email }).select(
    "+password",
  );
  // comparePassword(candidatePassword: string, hashedPassword?: string): Promise<boolean>;
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const validatePassword = await user.comparePassword(data.password);
  if (!validatePassword) {
    throw new AppError("Invalid email or password", 401);
  }
  // 3. Reuse the Helper! (This makes your code DRY)
  if (user.status === "unverified") {
    const otp = await createAndSendOTP(user.email, "verification");
    console.log(`[DEV ONLY] Verification OTP for ${user.email}: ${otp}`);
  }
  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
  });
  console.log(tokens);

  return { user, ...tokens };
};

export const verifyAccountService = async (data: OtpDto) => {
  const { email, otp, type } = data;

  // 1. Find the OTP document
  const otpDoc = await OtpModel.findOne({ email, otp: hashOTP(otp), type });

  if (!otpDoc) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  // 2. If we found it, we can verify the account
  if (type === "verification") {
    await UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { status: "active" }, // Professional state management
      { new: true },
    );
  }

  // 3. Finally, we can delete the OTP document
  await OtpModel.deleteOne({ _id: otpDoc._id });
};
export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    // For security, we don't reveal whether the email exists or not
    return true;
  }

  const otp = await createAndSendOTP(user.email, "password-reset");
  console.log(`[DEV ONLY] Password forgot OTP for ${user.email}: ${otp}`);
  return true;
};

export const resetPasswordService = async (data: resetPasswordDto) => {
  const { email, otp, newPassword, type } = data;
  const normalizedEmail = email.toLowerCase();

  // 1. Find and validate OTP
  console.log(
    `Attempting password reset for ${normalizedEmail} with OTP ${hashOTP(otp)} and type ${type}`,
  );
  const otpDoc = await OtpModel.findOne({
    email: normalizedEmail,
    otp: hashOTP(otp),
    type: type,
  });

  console.log(`OTP Document found: ${otpDoc ? "Yes" : "No"}`);
  if (!otpDoc) {
    throw new AppError("Invalid or expired reset codes", 400);
  }

  // 2. Find User
  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) throw new AppError("User no longer exists", 404);

  // 3. Update Password
  // Mongoose 9.0 Hook handles hashing automatically on .save()
  user.password = newPassword;
  await user.save();

  // 4. Invalidate the OTP so it can't be used again
  await OtpModel.deleteOne({ _id: otpDoc._id });

  return { success: true };
};
