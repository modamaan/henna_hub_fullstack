import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true
    }
})

// Pre-save hook to generate unique slug
categorySchema.pre("save", async function (next) {
    if (!this.isModified("name")) return next();

    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Check for existing slugs and make unique
    while (await mongoose.models.Category.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
    next();
});

export default mongoose.model("Category",categorySchema)