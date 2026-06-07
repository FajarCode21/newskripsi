import { Router } from "express";
import ticketMaintenanceController from "../controllers/ticketMaintenanceController.js";
import authHandler from "../middlewares/authHandler.js";
import uploadReport from "../middlewares/uploadReport.js";

const router = Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  ticketMaintenanceController.getAll,
);

router.get(
  "/:id",
  authHandler.authenticationHandler,
  ticketMaintenanceController.getById,
);

router.patch(
  "/:id/assign",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.assign,
);

router.patch(
  "/:id/start",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Engineer"),
  ticketMaintenanceController.start,
);

router.patch(
  "/:id/submit",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Engineer"),
  uploadReport.single("image"),
  ticketMaintenanceController.submit,
);

router.patch(
  "/:id/approve",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.approve,
);

export default router;
