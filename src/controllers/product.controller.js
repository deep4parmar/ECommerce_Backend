import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/Product.js";

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

export {
    getAllProducts
}