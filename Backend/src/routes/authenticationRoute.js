import express from "express";
import authenticationController from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/", authenticationController.postAuthentication);
router.put("/", authenticationController.putAuthentication);
router.delete("/", authenticationController.deleteAuthentication);

export default router;
