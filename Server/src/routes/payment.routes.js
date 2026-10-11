import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    createNitroOrder,
    verifyNitroPayment,
} from "../controllers/payment.controller.js";
import { getMyNitro } from "../controllers/nitro.controller.js";

const router = express.Router();


router.post("/create-order", authMiddleware, createNitroOrder)
router.post("/verify-nitro", authMiddleware, verifyNitroPayment)
router.get("/my-nitro", authMiddleware, getMyNitro)
export default router