import express from "express";
import {
    getAllProducts
} from "../controllers/product.controller.js"
 
const router = express.Router();

router.route("/getproducts").get(getAllProducts);

export default router;