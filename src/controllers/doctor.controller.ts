import { Request, Response } from "express";
import prisma from "../config/db";

export const getAllDoctors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany();

    res.status(200).json({
      message: "Doctors fetched successfully",
      data: doctors,
    });
    return;
  } catch (e) {
    console.error("Error in getAllDoctos controller", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDoctorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(404).json({ error: "ID not found" });
      return;
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: id,
      },
    });

    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    res.status(200).json({
      message: "Doctor retrieved successfully",
      data: doctor,
    });
  } catch (e) {
    console.error("Error in getDoctorById controller", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
