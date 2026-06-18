import { Router } from "express";
import ticketMaintenanceController from "../controllers/ticketMaintenanceController.js";
import authHandler from "../middlewares/authHandler.js";
import uploadReport from "../middlewares/uploadReport.js";

const router = Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  ticketMaintenanceController.getAllTickets,
);

router.get(
  "/:id",
  authHandler.authenticationHandler,
  ticketMaintenanceController.getTicketById,
);

router.patch(
  "/:id/assign",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.patchAssignTicket,
);

router.patch(
  "/:id/start",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Engineer"),
  ticketMaintenanceController.patchStartTicket,
);

router.patch(
  "/:id/submit",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Engineer"),
  uploadReport.single("image"),
  ticketMaintenanceController.patchSubmitTicket,
);

router.patch(
  "/:id/approve",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.patchApproveTicket,
);

export default router;
