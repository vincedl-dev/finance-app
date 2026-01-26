import { Request, Response } from "express";
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

export const createUser = async (req: Request, res: Response) => {
  return res.status(201).json({
    success: true,
    data: req.body,
  });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
export const specificUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);
  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};
