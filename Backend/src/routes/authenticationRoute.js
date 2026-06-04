import express from "express";
import autenticationController from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/", autenticationController.post);
router.put("/", autenticationController.put);
router.delete("/", autenticationController.delete);

export default router;
