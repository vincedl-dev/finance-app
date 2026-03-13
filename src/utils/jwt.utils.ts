import jwt from "jsonwebtoken";

export const generateTokens = (payload: object) => {
  const accestoken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
  const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return { accestoken, refreshtoken };
};
