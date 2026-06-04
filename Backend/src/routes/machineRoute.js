import express from "express";
import machineController from "../controllers/machineController.js";
import authHandler from "../middlewares/authHandler.js";

const router = express.Router();

router.get("/", authHandler.authenticationHandler, machineController.getAll);
router.get(
  "/:id",
  authHandler.authenticationHandler,
  machineController.getById,
);

router.post(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.create,
);

router.put(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.update,
);

router.delete(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  machineController.deleteById,
);

export default router;
