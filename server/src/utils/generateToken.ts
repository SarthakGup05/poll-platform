import jwt from "jsonwebtoken";

import type {
  Secret,
  SignOptions
} from "jsonwebtoken";



const accessSecret: Secret =
  process.env.JWT_ACCESS_SECRET!;

const refreshSecret: Secret =
  process.env.JWT_REFRESH_SECRET!;



export const generateAccessToken = (
  userId: string
): string => {

  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) || "15m",
  };

  return jwt.sign(
    { id: userId },
    accessSecret,
    options
  );
};



export const generateRefreshToken = (
  userId: string
): string => {

  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES as any) || "30d",
  };

  return jwt.sign(
    { id: userId },
    refreshSecret,
    options
  );
};



export const generateToken =
  generateAccessToken;