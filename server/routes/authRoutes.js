import express from "express";

import {
  registerOwner,
  loginOwner,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);

export default router;