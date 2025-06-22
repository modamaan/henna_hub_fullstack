import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import offerModel from "../models/offerModel.js";


export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, quantity, category, shipping, offer } =
            req.fields;
        const { photo } = req.files;
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: "Photo is required and should be less than 1mb",
                });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
};

// create offer product controller
export const createOfferProductController = async (req, res) => {
    try {
        const { name, slug, description, price, quantity, category, shipping, offer } =
            req.fields;
        const { photo } = req.files;
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !offer:
                return res.status(500).send({ error: "Offer price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: "Photo is required and should be less than 1mb",
                });
        }

        const products = new offerModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Offer Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
}


// get all product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All Products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message,
        });
    }
};

// get offer product controller
export const getOfferProductController = async (req, res) => {
    try {
        // Find one product that has an offer greater than 0
        const offerProduct = await productModel.findOne({ offer: { $gt: 0 } })
            .populate("category", "name") // You can populate specific fields if needed
            .select("-photo") // Exclude large photo buffer
            .sort({ createdAt: -1 });

        // If no offer product, return success with null
        if (!offerProduct) {
            return res.status(200).json({
                success: true,
                message: "No offer product found",
                offerProduct: null,
            });
        }

        res.status(200).send({
            success: true,
            message: "Offer Product fetched successfully",
            offerProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting offer product",
            error: error.message,
        });
    }
};
//get singleProduct

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting Single Product",
            error,
        });
    }
};

// get photo

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};



// update product

export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, quantity, category, shipping } =
            req.fields;
        const { photo } = req.files;
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !price:
                return res.status(500).send({ error: "Price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    error: "Photo is required and should be less than 1mb",
                });
        }
        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in update product",
        });
    }
};

// delete product

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};

// related product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while getting related product",
            error,
        });
    }
};

// prodcount controller

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while counting products",
            error
        });
    }
}

// product list per page

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? parseInt(req.params.page) : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .populate("category");
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting product list",
            error
        });
    }
}

// search controller
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");
        res.json(results)
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error
        });
    }
}

// get products by category
export const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await productModel
            .find({ category: categoryId })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting products by category",
            error,
        });
    }
};


