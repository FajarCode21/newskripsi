import express from "express";
import machineController from "../controllers/machineController.js";
import authHandler from "../middlewares/authHandler.js";

const router = express.Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  machineController.getAllMachines,
);
router.get(
  "/:id",
  authHandler.authenticationHandler,
  machineController.getMachineById,
);

router.post(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.postMachine,
);

router.put(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.putMachine,
);

router.delete(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.deleteMachineById,
);

export default router;
