import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400).json({
        error: "All fields are reuqired to continue",
      });
      return;
    }

    // check if the email alrady exists

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    //generate a token

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    // remove the password from the response

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: userWithoutPassword,
      },
      accessToken,
    });
  } catch (e) {
    console.log("Error in registerController:", e);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ error: "Please provide both email and password" });
      return;
    }

    //check if the user exists

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({
        error: "User with this email does not exist please register first",
      });

      return;
    }

    // check if the password is correct

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({
        error: "Invalid Credentials",
      });
      return;
    }

    // remove the password from the response for data security

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: userWithoutPassword,
      },
      accessToken,
    });
  } catch (e) {
    console.log("Error in loginController:", e);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
