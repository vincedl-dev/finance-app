import { Request, Response } from "express";
export const getTranscritions = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: "get transactions",
  });
};
