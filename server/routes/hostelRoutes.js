import express from "express"
import { createHostel,getHostelDetails,updateHostel } from "../controllers/hostelController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, createHostel);
router.get("/", authMiddleware, getHostelDetails);
router.put("/update", authMiddleware, updateHostel);

export default router;
