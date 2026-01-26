import { Request, Response } from "express";
import { getUsers, specificUser } from "../src/controllers/user.controller";
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
describe("getUsers controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return users with status 200", async () => {
    await getUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: users,
    });
  });
});

describe("get specific user", () => {
  it("should return specific user with status 200", async () => {
    const req: Partial<Request> = {
      params: { id: "1" },
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await specificUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, name: "John" },
    });
  });
  it("should return with status 200 if the user found", async () => {
    const req: Partial<Request> = {
      params: { id: "100" },
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await specificUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found",
    });
  });
});
