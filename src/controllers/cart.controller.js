import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

function calculateCartTotalPrices(items) {
    let totalPrice = 0
    let totalItems = 0

    items.forEach((item) => {
        totalPrice += item.price * item.quantity;
        totalItems += item.quantity;
    });

    return { totalPrice, totalItems }
}

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product Not Found")
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] })
    }

    const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId,
            quantity,
            price: product.price,
        })
    }

    const { totalPrice, totalItems } = calculateCartTotalPrices(cart.items);
    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;

    await cart.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, "Product is Added In Cart Successfully")
        )
})

const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId")

    if (!cart) {
        throw new ApiError(200, "Cart is Empty");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, "Your Cart!!")
        )
})

const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new ApiError(404, "Cart Not Found");
    }

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    )

    const { totalPrice, totalItems } = calculateCartTotalPrices(cart.items);
    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;

    await cart.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, "Item Removed")
        )
})

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new ApiError(404, "Cart Not Found");
    }

    cart.items = [];

    cart.totalPrice = 0;
    cart.totalItems = 0;

    await cart.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, cart, "Cart Cleared")
        )
})

export {
    addToCart,
    getUserCart,
    removeFromCart,
    clearCart,
}
