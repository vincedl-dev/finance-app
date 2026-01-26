import { Request, Response } from "express";
import { createUserService } from "../services/user.service"; // Adjust the import path as needed

export const createUser = async (req: Request, res: Response) => {
  console.log("Request Body:", req.body); // Debugging line

  console.log(
    new Date("2026-01-11T09:14:40.851+00:00").toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    })
  );
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
