import { Request, Response } from "express";
import prisma from "../config/db";

interface DoctorProps {
  specialization?: string;
  experienceYears?: string;
}

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

export const updateDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { specialization, experienceYears } = req.body;

    const updatedDoctor: DoctorProps = {};

    if (specialization !== undefined)
      updatedDoctor.specialization = specialization;
    if (experienceYears !== undefined)
      updatedDoctor.experienceYears = experienceYears;

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    const updatedDoctorData = await prisma.doctor.update({
      where: { id },
      data: updatedDoctor,
    });

    res.status(200).json({
      message: "Doctor updated successfully",
      data: updatedDoctorData,
    });

    return;
  } catch (e) {
    console.error("Error in updateDoctor controller", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(404).json({ error: "ID not found" });
      return;
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    await prisma.doctor.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Doctor deleted successfully",
    });

    return;
  } catch (e) {
    console.error("Error in deleteDoctor controller", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
