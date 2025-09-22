import express from "express";
import {
    createOrderFromCart,
    getUserOrders,
    getSingleOrderById,
    cancelOrder
} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/authentication.js";

const router = express.Router();

router.route("/createorder").post(verifyJWT, createOrderFromCart);

router.route("/getuserorders").get(verifyJWT, getUserOrders);

router.route("/getsingleorder/:orderId").get(verifyJWT, getSingleOrderById);

router.route("/cancel/:orderId").delete(verifyJWT, cancelOrder);

export default router;