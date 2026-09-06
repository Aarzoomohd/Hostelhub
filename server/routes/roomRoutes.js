import express from "express"
import {createRoom, 
  getRooms,
  deleteRoom,
   updateRoom} 
from "../controllers/roomController.js"


import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router();

router.post("/", authMiddleware, createRoom);
router.get(
  "/",
  authMiddleware,
  getRooms,
);

router.delete("/:id",authMiddleware,deleteRoom );
router.put("/:id",authMiddleware, updateRoom);

export default router;
