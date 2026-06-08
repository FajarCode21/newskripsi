import dashboardController from "../controllers/dashboardController.js";
import authHandler from "../middlewares/authHandler.js";
import express from "express";

const router = express.Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  dashboardController.getDashboard,
);

export default router;
