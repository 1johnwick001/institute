import mongoose, { Types } from "mongoose";
import slugify from 'slugify'

const tabsSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TabsData', // Reference to another tab for hierarchy
        default: null,
    },
    level: {
        type: Number,
        default: 0,
    }
      
})

// Pre-save middleware to generate slug
tabsSchema.pre("save", function (next) {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
  });
  

const TabsData = mongoose.model('TabsData', tabsSchema);

export default TabsData;