import mongoose from "mongoose";
import { connectDB } from "../../src/config/db";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectDB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
  });

  it("connects successfully", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
  });

  it("throws error if MONGO_URI is not set", async () => {
    delete process.env.MONGO_URI;

    await expect(connectDB()).rejects.toThrow(
      "MONGO_URI is not defined in environment variables"
    );
  });
});
