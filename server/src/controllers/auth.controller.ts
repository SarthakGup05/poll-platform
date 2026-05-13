import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import { eq } from "drizzle-orm";

import { db } from "../config/db.js";

import { users } from "../config/db/schema/users.js";

import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

import { AuthRequest } from "../types/index.js";



export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword
      })
      .returning();

    const accessToken = generateAccessToken(newUser[0].id);
    const refreshToken = generateRefreshToken(newUser[0].id);

    return res.status(201).json({
      message: "User registered",
      accessToken,
      refreshToken,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};



export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (foundUsers.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const user = foundUsers[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!foundUsers || foundUsers.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = foundUsers[0];

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });
  }
};