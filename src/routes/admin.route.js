import express from "express";
import { verifyJWT } from "../middlewares/authentication.js";
import { isAdmin } from "../middlewares/authentication.js";
import {
    getAllUsers,
    deleteUser,
    createProduct,
    getAllProducts,
    updateProductDetails,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from "../controllers/admin.controller.js"
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.use(verifyJWT, isAdmin);

// Admin EndPoints For User
router.route("/getallusers").get(getAllUsers);
router.route("/deleteuser/:userId").delete(deleteUser);

// Admin EndPoints For Product
router.route("/addproduct").post(upload.single("productImageUrl"), createProduct);
router.route("/getproducts").get(getAllProducts);
router.route("/updateproduct/:productId").put(upload.single("productImageUrl"), updateProductDetails);
router.route("/deleteproduct/:productId").delete(deleteProduct);
router.route("/orders").get(getAllOrders);
router.route("/updateorderstatus/:orderId").put(updateOrderStatus);
router.route("/cancelorder/:orderId").put(cancelOrder);

export default router;