import mongoose from "mongoose";

const FooterCategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['pdf', 'link', 'page'], 
      required: true,
    },
    status: {
      type: Number,
      default: 1, // Default status is 1 , 0 and 8
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Update 'updatedAt' field before saving the document
  FooterCategorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  const FooterCategory = mongoose.model('FooterCategory', FooterCategorySchema);

export default FooterCategory