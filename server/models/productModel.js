import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true, // Ensure slug is unique
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
    },
    photo: {
        type: String, // Cloudinary image URL
        required: true
    },
    shipping: {
        type: String
    },
    offer: {
        type: Number
    }
}, { timestamps: true })

// Pre-save hook to generate unique slug
productSchema.pre("save", async function (next) {
    if (!this.isModified("name")) return next();

    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Check for existing slugs and make unique
    while (await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
    next();
});

export default mongoose.model("Product", productSchema)