import { createStudent,deleteStudent,getStudents,updateStudent } from "../controllers/studentController.js";

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/",authMiddleware, createStudent);
router.get("/",authMiddleware, getStudents);
router.delete("/:id", authMiddleware, deleteStudent);
router.put("/:id", authMiddleware, updateStudent);

export default router;