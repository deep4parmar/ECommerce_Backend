import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getAllUser = await User.find().select("-password -refreshToken");
        return res
            .status(200)
            .json(
                new ApiResponse(200, getAllUser, "All User Fetched Successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while Fetching Users");
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        let user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "Not Found");
        }

        user = await User.findByIdAndDelete(userId);

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "User Deleted Successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong while Deleting User");
    }
})

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    if (
        [name, description, category].some((field) => field?.trim() === "") || price == null || stock == null
    ) {
        throw new ApiError(400, "All Fields Required");
    }

    const productImageUrlLocalPath = req.file?.path;

    if (!productImageUrlLocalPath) {
        throw new ApiError(400, "Product Image File is Required");
    }

    const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        productImageUrl: productImageUrlLocalPath
    })

    const savedProduct = await product.save();

    return res
        .status(201)
        .json(
            new ApiResponse(201, savedProduct, "Product Created Successfully")
        )
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        return res
            .status(200)
            .json(
                new ApiResponse(200, products, "Products Fetched Successfully")
            )
    } catch (err) {
        throw new ApiError(500, err.message)
    }
})

const updateProductDetails = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const { name, description, price, stock, category, productImageUrl } = req.body;

    if ([name, description, price, stock, category, productImageUrl].some(field => field?.trim() === 0)) {
        throw new ApiError(400, "All fields are Required");
    }

    const productImageUrlLocalPath = req.file?.path;

    const product = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name: name,
                description: description,
                price: price,
                stock: stock,
                category: category,
                productImageUrl: productImageUrlLocalPath,
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, product, "Product Update Successfully")
        )
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    product = await Product.findByIdAndDelete(productId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, product, "Product Deleted Successfully"
            )
        )
})

const getAllOrders = asyncHandler(async (req, res) => {
    const allOrders = await Order.find().sort({ createdAt: -1 }).populate("userId", "fullName email");

    return res
        .status(200)
        .json(
            new ApiResponse(200, allOrders, "All Orders Fetched Successfully")
        )
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order Not Found");
    }

    order.status = status;
    await order.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "Order Status Updated")
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
    getAllUsers,
    deleteUser,
    createProduct,
    getAllProducts,
    updateProductDetails,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
}