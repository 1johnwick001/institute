import mongoose, { Types } from "mongoose";
import slugify from 'slugify'

const categorySchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    parent: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    instituteId : {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'InstituteBanner',
      default:null
    },
    level: {
        type: Number,
        default: 0
    },   
    type: {
        type: String,
        enum: ['pdf', 'text', 'both'],
        required: function() {
          return this.level > 0;
        },
    }
})

// Pre-save middleware to generate slug
categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
    if (this.level > 0) {
        if (!this.type) {
          this.invalidate("type", "Type is required for child and grandchild categories");
        }
      }
    next();
  });


  
  

const Category = mongoose.model('Category', categorySchema);

export default Category;