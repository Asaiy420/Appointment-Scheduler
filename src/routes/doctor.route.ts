import { Router } from "express";
import { doctorRoute } from "../middleware/auth.middleware";
import { getAllDoctors, getDoctorById, updateDoctor } from "../controllers/doctor.controller";

const router = Router();

router.get("/", doctorRoute, getAllDoctors)
router.get("/:id", doctorRoute, getDoctorById)
router.put("/:id", doctorRoute, updateDoctor) 

export default router;