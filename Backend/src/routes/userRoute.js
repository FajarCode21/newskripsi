import express from "express";
import userController from "../controllers/userController.js";
import authHandler from "../middlewares/authHandler.js";

const router = express.Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.getAll,
);
router.get(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.getByID,
);
router.post(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.post,
);
router.put("/:id", authHandler.authenticationHandler, userController.put);

router.delete(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.deleteById,
);

export default router;
