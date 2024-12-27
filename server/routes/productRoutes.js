import express from 'express'
import { isAdmin,requireSignIn } from '../middlewares/authMiddleware.js'
import { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController,updateProductController,relatedProductController,createOfferProductController,getOfferProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'


const router = express.Router();


// create product
router.post("/create-product", requireSignIn,isAdmin,formidable(), createProductController)

// create offer product
router.post("/create-offer", requireSignIn,isAdmin,formidable(), createOfferProductController)

router.put("/update-product/:pid", requireSignIn,isAdmin,formidable(),updateProductController)

// get all product
router.get("/get-product", getProductController)

// get all offer product
router.get("/get-offer", getOfferProductController)

// single product
router.get("/get-product/:slug", getSingleProductController)

// get photo
router.get("/product-photo/:pid", productPhotoController)

// delete product
router.delete("/delete-product/:pid",deleteProductController)

// similar product
router.get('/related-product/:pid/:cid',relatedProductController)


export default router