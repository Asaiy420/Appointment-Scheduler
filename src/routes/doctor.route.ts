import { Router } from "express";
import { doctorRoute } from "../middleware/auth.middleware";
import { getAllDoctors } from "../controllers/doctor.controller";

const router = Router();

router.get("/", doctorRoute, getAllDoctors)

export default router;