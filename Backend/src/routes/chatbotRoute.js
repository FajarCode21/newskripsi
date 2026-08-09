import express from "express";

import chatbotController from "../controllers/chatbotController.js";
import authHandler from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/", authHandler.authenticationHandler, chatbotController.chat);

export default router;
