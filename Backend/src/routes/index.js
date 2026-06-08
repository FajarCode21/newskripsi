import express from "express";

import authenticationRoute from "./authenticationRoute.js";
import userRoute from "./userRoute.js";
import machineRoute from "./machineRoute.js";
import predictRoute from "./predictRoute.js";
import ticketMaintenanceRoute from "./ticketMaintenanceRoute.js";
import dashboardRoute from "./dashboardRoute.js";

const router = express.Router();

router.use("/api/auth", authenticationRoute);
router.use("/api/users", userRoute);
router.use("/api/dashboard", dashboardRoute);
router.use("/api/machines", machineRoute);
router.use("/api/predict", predictRoute);
router.use("/api/ticket-maintenance", ticketMaintenanceRoute);

export default router;
