import crypto from "node:crypto";
export const generateOTP = (): string => {
  // 1. Generate a random integer between 0 and 999,999
  // (The max is exclusive, so we use 1,000,000)
  const randomNumber = crypto.randomInt(0, 1000000);

  // 2. Convert to string and pad with '0' until it is 6 characters long
  return randomNumber.toString().padStart(6, "0");
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
console.log(generateOTP());
