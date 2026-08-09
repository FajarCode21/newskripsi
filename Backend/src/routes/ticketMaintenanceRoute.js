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

// Fitur 3 + tambah member: leader mulai maintenance, boleh sertakan member_ids baru
router.patch(
  "/:id/start",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Engineer"),
  ticketMaintenanceController.patchStartTicket,
);

// Fitur baru: admin kelola leader/member saat tiket InProgress (mis. leader/member sakit)
router.patch(
  "/:id/assignments",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.patchManageAssignments,
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

// Fitur 4: admin menolak laporan
router.patch(
  "/:id/reject",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.patchRejectTicket,
);

// Fitur 5: admin menghapus tiket yang belum ditugaskan
router.delete(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  ticketMaintenanceController.deleteTicket,
);

router.get(
  "/:id/report",
  authHandler.authenticationHandler,
  ticketMaintenanceController.getTicketReport,
);

export default router;
