import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

interface JwtPayload {
  userId: string;
}

export const doctorRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.role !== "DOCTOR") {
      res.status(403).json({ error: "Access denied. Doctor role required." });
      return;
    }

    // Add user to request for use in route handlers
    (req as any).user = user;
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    console.error("Error in doctorRoute middleware:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
