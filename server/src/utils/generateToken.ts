import { sign, Secret, SignOptions } from "jsonwebtoken";

const accessSecret: Secret =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "your_access_secret_key";

const refreshSecret: Secret =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "your_refresh_secret_key";

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) || "15m",
  };

  return sign({ id: userId }, accessSecret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES as any) || "30d",
  };

  return sign({ id: userId }, refreshSecret, options);
};

export const generateToken = generateAccessToken;