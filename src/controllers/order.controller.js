import { Cart } from "../models/Cart.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/Order.js";

const createOrderFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { address, paymentMehtod = "COD" } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is Empty");
    }

    const order = new Order({
        userId,
        items: cart.items,
        totalAmount: cart.totalPrice,
        address,
        status: 'pending',
        paymentMehtod,
        paymentStatus: paymentMehtod === "COD" ? "pending" : "paid"
    })

    await order.save();

    // clear cart after order placed
    cart.items = [];
    cart.totalPrice = 0;
    cart.totalItems = 0;

    await cart.save();

    return res
        .status(201)
        .json(
            new ApiResponse(201, order, "Order Placed Successfully")
        )
})

const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const orders = await Order.find({ userId });

    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, "Your All Orders")
        )
})

const getSingleOrderById = asyncHandler(async (req, res) => {
    // const userId = req.user?._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
        throw new ApiError(404, "Order Not Found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "Your Order")
        )
})

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) throw new ApiError(404, "Order Not Found");

    if (req.user.role !== "admin" && order.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Not Allowed");
    }

    order.status = "cancelled";
    order.paymentStatus = order.paymentMethod !== "COD" ? "refunded" : "pending";
    await order.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "Order Cancelled!")
        )
})

export {
    createOrderFromCart,
    getUserOrders,
    getSingleOrderById,
    cancelOrder
}