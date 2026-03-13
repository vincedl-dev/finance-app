import { is } from "zod/v4/locales";
import { createUser, loginUser } from "../src/controllers/auth.controller";
import { UserModel } from "../src/models/user.model";

import * as authService from "../src/services/auth.service";
import mongoose from "mongoose"; // 1. Import mongoose
jest.mock("../src/models/user.model");

describe("createUser", () => {
  const mockReq = {
    body: {
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      isVerified: false,
    },
  } as any;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 when user creation is successful", async () => {
    const mockReq = {
      body: { username: "test", email: "test@test.com", password: "123" },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // FIX: Use the imported object 'authService'
    const serviceSpy = jest
      .spyOn(authService, "createUserService")
      .mockResolvedValue({
        _id: new mongoose.Types.ObjectId("65ccd75e37803a6697b0d771"),
        firstname: "John",
        lastname: "Doe",
        username: "test",
        email: "test@test.com",
        isVerified: false,
      } as any);

    await createUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User created successfully",
      }),
    );

    serviceSpy.mockRestore();
  });
  // it("should return 201 when user creation is successful", async () => {
  //   const mockReq = {
  //     body: { username: "test", email: "test@test.com", password: "123" },
  //   } as any;

  //   const mockRes = {
  //     status: jest.fn().mockReturnThis(), // .status() returns 'this' so we can chain .json()
  //     json: jest.fn().mockReturnThis(),
  //   } as any;

  //   // 1. Mock the SERVICE function so it doesn't touch the DB or Email
  //   const serviceSpy = jest
  //     .spyOn(createUserService, "createUserService")
  //     .mockResolvedValue({
  //       _id: "123",
  //       username: "test",
  //       email: "test@test.com",
  //     });

  //   await createUser(mockReq, mockRes);

  //   expect(mockRes.status).toHaveBeenCalledWith(201);
  //   expect(mockRes.json).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       message: "User created successfully",
  //     }),
  //   );

  //   serviceSpy.mockRestore();
  // });
  // it("should save a user and return user data", async () => {
  //   const res = mockRes();

  //   // Mock the UserModel constructor to return an object with a save method
  //   (UserModel as unknown as jest.Mock).mockImplementation(function () {
  //     return {
  //       ...mockReq.body,
  //       save: jest.fn().mockResolvedValue({
  //         _id: "1",
  //         ...mockReq.body,
  //         isVerified: false,
  //         verificationToken: "token",
  //         verificationTokenExpires: new Date(),
  //       }),
  //     };
  //   });

  //   await createUser(mockReq, res);

  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       message: "User created successfully",
  //     }),
  //   );
  // });

  it("should return 500 on error", async () => {
    const res = mockRes();

    (UserModel as unknown as jest.Mock).mockImplementation(function () {
      return {
        ...mockReq.body,
        save: jest.fn().mockRejectedValue(new Error("DB error")),
      };
    });

    await createUser(mockReq, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      status: "error",
    });
  });
});

describe("Login Functionality", () => {
  it("should return 200 when login is successful", async () => {
    const mockReq = {
      body: { email: "test@test.com", password: "123" },
    } as any;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
    const mockUser = {
      _id: new mongoose.Types.ObjectId("65ccd75e37803a6697b0d771"),
      email: "test@test.com",
      isVerified: false,
    };

    const serviceSpy = jest
      .spyOn(authService, "loginUserService")
      .mockResolvedValue(mockUser as any);

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User logged in successfully",
        data: mockUser,
      }),
    );

    serviceSpy.mockRestore();
  });
});
