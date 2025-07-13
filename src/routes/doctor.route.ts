import { Router } from "express";
import { adminRoute, doctorRoute } from "../middleware/auth.middleware";
import { getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } from "../controllers/doctor.controller";

const router = Router();

router.get("/", doctorRoute, getAllDoctors)
router.get("/:id", doctorRoute, getDoctorById)
router.put("/:id", adminRoute, updateDoctor) 
router.delete("/:id", doctorRoute, deleteDoctor)

export default router;