import express from "express";
import { verifyJWT } from "../middlewares/authentication.js";
import {
    addToCart,
    clearCart,
    getUserCart,
    removeFromCart
} from "../controllers/cart.controller.js"

const router = express.Router();

router.route("/addtocart").post(verifyJWT, addToCart);

router.route("/getcart").get(verifyJWT, getUserCart);

router.route("/remove").post(verifyJWT, removeFromCart);

router.route('/clear').delete(verifyJWT, clearCart);

export default router;