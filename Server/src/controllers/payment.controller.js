import crypto from "node:crypto";
import razorpay from "../config/razorPay.js";
import nitroModel from "../models/nitro.model.js";
import paymentModel from "../models/payment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const NITRO_DURATION_DAYS = 30;

export const createNitroOrder = async (req, res, next) => {
    try {
        const order = await razorpay.orders.create({
            amount: 29900,
            currency: "INR",
            receipt: `n_${Date.now()}_${String(req.user.id).slice(-8)}`,
        });

        await paymentModel.create({
            user: req.user._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            product: "nitro",
            status: "created",
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    keyId: process.env.RAZOR_PAY_API_KEY,
                },
                "Nitro order created successfully"
            )
        );
    } catch (error) {
        return next(error);
    }
};

export const verifyNitroPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
        } = req.body;

        if (
            typeof orderId !== "string" ||
            typeof paymentId !== "string" ||
            typeof signature !== "string" ||
            !/^[a-f0-9]{64}$/i.test(signature)
        ) {
            return next(new ApiError(400, "Invalid Nitro payment details"));
        }

        const payment = await paymentModel.findOne({
            orderId,
            user: req.user._id,
            product: "nitro",
        });

        if (!payment) {
            return next(new ApiError(404, "Nitro order not found"));
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY)
            .update(`${orderId}|${paymentId}`)
            .digest();
        const receivedSignature = Buffer.from(signature, "hex");

        if (
            receivedSignature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)
        ) {
            return next(new ApiError(400, "Nitro payment signature is invalid"));
        }

        if (payment.status === "paid") {
            if (payment.paymentId !== paymentId) {
                return next(new ApiError(409, "This Nitro order has already been used"));
            }

            const existingNitro = await nitroModel.findOne({ razorpayPaymentId: paymentId });
            if (existingNitro) {
                return res.status(200).json(
                    new ApiResponse(200, { nitro: existingNitro }, "Nitro payment was already verified")
                );
            }
        }

        const razorpayPayment = await razorpay.payments.fetch(paymentId);
        if (
            razorpayPayment.order_id !== orderId ||
            razorpayPayment.amount !== payment.amount ||
            razorpayPayment.currency !== payment.currency
        ) {
            return next(new ApiError(400, "Nitro payment does not match this order"));
        }

        const capturedPayment = razorpayPayment.status === "authorized"
            ? await razorpay.payments.capture(
                paymentId,
                razorpayPayment.amount,
                razorpayPayment.currency
            )
            : razorpayPayment;

        if (capturedPayment.status !== "captured") {
            return next(new ApiError(409, "Nitro payment has not been captured"));
        }

        payment.paymentId = paymentId;
        payment.status = "paid";
        await payment.save();

        const now = new Date();
        const activeNitro = await nitroModel
            .findOne({ user: req.user._id, status: "active", endDate: { $gt: now } })
            .sort({ endDate: -1 });
        const startDate = activeNitro?.endDate || now;
        const endDate = new Date(startDate.getTime() + NITRO_DURATION_DAYS * 24 * 60 * 60 * 1000);
        const nitro = await nitroModel.create({
            user: req.user._id,
            plan: "nitro",
            status: "active",
            startDate,
            endDate,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
        });

        return res.status(200).json(
            new ApiResponse(200, { nitro }, "Nitro payment verified and membership activated")
        );
    } catch (error) {
        return next(error);
    }
};