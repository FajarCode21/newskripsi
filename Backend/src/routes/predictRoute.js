import express from "express";
import predictController from "../controllers/predictController.js";

const router = express.Router();

router.post("/", predictController.postPredict);

export default router;
