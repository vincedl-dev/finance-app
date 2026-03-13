import { z } from "zod";
export const createUserSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const validateCreateUserSchema = createUserSchema.superRefine(
  async (data, ctx) => {},
);

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const OtpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 characters long"),
  type: z.enum(["verification", "password-reset"]),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});
export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  type: z.string(),
});
export type resetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type OtpDto = z.infer<typeof OtpSchema>;
export type forgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type LoginUserDto = z.infer<typeof loginSchema>;
