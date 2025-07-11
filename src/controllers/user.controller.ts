import { Request, Response } from "express";
import prisma from "../config/db";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
    return;
  } catch (e) {
    console.error("Error in getAllUsers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const fetchUserById = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!fetchUserById) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: fetchUserById,
    });
    return;
  } catch (e) {
    console.error("Error in getUserById:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    // Only update fields that are provided
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
    return;
  } catch (e: any) {
    // Prisma unique constraint error for email
    if (e.code === "P2002" && e.meta?.target?.includes("email")) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }
    console.error("Error in updateUser:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    return;
  } catch (e) {
    console.error("Error in deleteUser:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
