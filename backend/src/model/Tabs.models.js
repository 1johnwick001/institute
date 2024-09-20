import mongoose, { Types } from "mongoose";
import slugify from 'slugify';

const tabsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TabsData',
        default: null,
    },
    level: {
        type: Number,
        default: 0,
    }
});

// Pre-save middleware to generate slug
tabsSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Compound index to ensure slug is unique per category
tabsSchema.index({ slug: 1, category: 1 }, { unique: true });

const TabsData = mongoose.model('TabsData', tabsSchema);

export default TabsData;