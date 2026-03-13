import { Request, Response } from "express";
import {
  createUserService,
  loginUserService,
  verifyAccountService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service"; // Adjust the import path as needed

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        status: "fail",
        errors: error.conflicts, // Sent as { email: "taken" } or { username: "taken" }
      });
    }

    // Fallback for unexpected errors
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { user, accestoken, refreshtoken } = await loginUserService(req.body);

    res.status(200).json({
      message: "User logged in successfully",
      data: { user, accessToken: accestoken, refreshToken: refreshtoken },
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const user = await verifyAccountService(req.body);

    res.status(200).json({
      message: "Account verified successfully",
      data: user,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await forgotPasswordService(req.body.email);

    res.status(200).json({
      message: "Password reset email sent successfully",
      data: user,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const user = await resetPasswordService(req.body);

    res.status(200).json({
      message: "Password reset successfully",
      data: user,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Internal Server Error",
    });
  }
};
