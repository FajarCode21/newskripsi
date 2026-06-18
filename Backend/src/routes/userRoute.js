import express from "express";
import userController from "../controllers/userController.js";
import authHandler from "../middlewares/authHandler.js";

const router = express.Router();

router.get(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.getAllUsers,
);
router.get(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.getUserById,
);
router.post(
  "/",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.postUser,
);
router.put("/:id", authHandler.authenticationHandler, userController.putUser);

router.delete(
  "/:id",
  authHandler.authenticationHandler,
  authHandler.authorizationHandler("Admin"),
  userController.deleteUserById,
);

export default router;
