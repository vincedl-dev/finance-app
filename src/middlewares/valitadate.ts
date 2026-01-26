import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.flatten().fieldErrors, // ✅ professional
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
