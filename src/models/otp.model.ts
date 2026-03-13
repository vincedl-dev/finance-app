import { Schema, model, Document } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: string;
  type: "verification" | "password-reset";
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    // Adding 'expires: 0' tells MongoDB to delete the doc when current time >= expiresAt
    type: {
      type: String,
      required: true,
      enum: ["verification", "password-reset"],
    },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: true },
);

export const OtpModel = model<IOtp>("Otp", OtpSchema);
