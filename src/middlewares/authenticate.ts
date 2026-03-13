import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 2. Extend the Express Request
interface JwtPayload {
  id: string;
  email: string;
}
interface AuthenticatedRequest extends Request {
  id?: string;
  email?: string;
}
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as JwtPayload;
    req.id = decoded.id;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
